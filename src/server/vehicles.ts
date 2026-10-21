'use server'

import { UserError, attempt } from './action-result'
import { revalidatePath } from 'next/cache'
import { eq, and, sql, asc, desc } from 'drizzle-orm'
import { db } from './db/index'
import { vehicles } from './db/schema'
import { requireUser } from './session'
import { createVehicleSchema, updateVehicleSchema, parseBody, iso } from './schemas'
import { uploadToR2 } from './r2-upload'
import { rememberInventoryPatch } from './inventory-suggestions'
import { coverFor, vehicleImageMeta } from './vehicle-image'
import { assertReorderIds } from './vehicle-order'

export type VehicleStatus = 'available' | 'reserved' | 'sold'
export type FuelType = 'gasoline' | 'diesel' | 'hybrid' | 'electric'
export type Transmission = 'manual' | 'automatic' | 'cvt'

export type VehicleSortField = 'arrivedAt' | 'price' | 'year' | 'mileage' | 'make' | 'sortOrder'
export type VehicleSortDir = 'asc' | 'desc'

export type VehicleFilters = {
  page?: number
  limit?: number
  status?: VehicleStatus
  search?: string
  sortBy?: VehicleSortField
  sortDir?: VehicleSortDir
  /* public pages: a car with no photo and no studio cover stays off the site */
  withPhoto?: boolean
}

function vehicleSortColumn(field: VehicleSortField) {
  switch (field) {
    case 'price':
      return vehicles.price
    case 'year':
      return vehicles.year
    case 'mileage':
      return vehicles.mileage
    case 'make':
      return vehicles.make
    case 'sortOrder':
      return vehicles.sortOrder
    default:
      return vehicles.arrivedAt
  }
}

/* landing, stock and detail pages are ISR: refresh them on every staff change.
   The public site sits at the root (app/(motors)), so the root layout covers every page. */
const refreshSite = () => revalidatePath('/', 'layout')

function serializeVehicle(row: typeof vehicles.$inferSelect) {
  return {
    ...row,
    images: row.images ?? [],
    extras: row.extras ?? {},
    arrivedAt: iso(row.arrivedAt)!,
    createdAt: iso(row.createdAt)!,
    updatedAt: iso(row.updatedAt)!,
  }
}

export async function listVehicles(filters: VehicleFilters = {}) {
  const pageNum = Math.max(1, filters.page ?? 1)
  const limitNum = Math.min(500, Math.max(1, filters.limit ?? 20))
  const offset = (pageNum - 1) * limitNum

  const conditions = []
  if (filters.status) conditions.push(eq(vehicles.status, filters.status))
  if (filters.withPhoto) {
    conditions.push(sql`(jsonb_array_length(${vehicles.images}) > 0 or coalesce(${vehicles.extras}->>'cover', '') <> '')`)
  }
  if (filters.search) {
    /* "Toyota Land Cruiser" spans both columns; VIN is how staff find a specific car */
    conditions.push(
      sql`concat_ws(' ', ${vehicles.make}, ${vehicles.model}, coalesce(${vehicles.vin}, '')) ilike ${'%' + filters.search.trim() + '%'}`
    )
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined

  const sortBy =
    filters.sortBy && ['arrivedAt', 'price', 'year', 'mileage', 'make', 'sortOrder'].includes(filters.sortBy)
      ? filters.sortBy
      : 'arrivedAt'
  const col = vehicleSortColumn(sortBy)
  const order = filters.sortDir === 'asc' ? asc(col) : desc(col)

  const [rows, [{ count }]] = await Promise.all([
    db.select().from(vehicles).where(where).orderBy(order).limit(limitNum).offset(offset),
    db.select({ count: sql<number>`count(*)::int` }).from(vehicles).where(where),
  ])

  return {
    data: rows.map(serializeVehicle),
    pagination: { page: pageNum, limit: limitNum, total: count, pages: Math.ceil(count / limitNum) },
  }
}

export async function getVehicle(id: string) {
  const [vehicle] = await db.select().from(vehicles).where(eq(vehicles.id, id))
  if (!vehicle) throw new UserError('Véhicule introuvable.')
  return serializeVehicle(vehicle)
}

/** Public detail pages resolve a slug by the short id at its end (src/lib/motors-routes.ts). */
export async function getVehicleByIdPrefix(prefix: string) {
  if (!/^[0-9a-f]{12}$/.test(prefix)) throw new UserError('Véhicule introuvable.')
  const [vehicle] = await db
    .select()
    .from(vehicles)
    .where(sql`replace(${vehicles.id}::text, '-', '') like ${prefix + '%'}`)
    .limit(1)
  if (!vehicle) throw new UserError('Véhicule introuvable.')
  return serializeVehicle(vehicle)
}

export async function createVehicle(data: unknown) {
  return attempt(async () => {
    const user = await requireUser()
    const validated = parseBody(createVehicleSchema, data)
    const [{ minOrder }] = await db
      .select({ minOrder: sql<number>`coalesce(min(${vehicles.sortOrder}), 1)::int` })
      .from(vehicles)
    const [vehicle] = await db
      .insert(vehicles)
      .values({ ...validated, createdBy: user.id, sortOrder: minOrder - 1 })
      .returning()
    refreshSite()
    return serializeVehicle(vehicle)
  })
}

export async function reorderVehicles(orderedIds: string[]) {
  return attempt(async () => {
    await requireUser()
    const rows = await db.select({ id: vehicles.id }).from(vehicles)
    assertReorderIds(orderedIds, rows.map((row) => row.id))
    await db.transaction(async (tx) => {
      for (let i = 0; i < orderedIds.length; i++) {
        await tx
          .update(vehicles)
          .set({ sortOrder: i, updatedAt: new Date() })
          .where(eq(vehicles.id, orderedIds[i]!))
      }
    })
    refreshSite()
    return { success: true as const }
  })
}

export async function updateVehicle(id: string, data: unknown) {
  return attempt(async () => {
    await requireUser()
    const validated = parseBody(updateVehicleSchema, data)
    const vehicle = await db.transaction(async (tx) => {
      const [existing] = await tx.select().from(vehicles).where(eq(vehicles.id, id)).for('update')
      if (!existing) throw new UserError('Véhicule introuvable.')
      const extras = validated.images
        ? coverFor(validated.extras ?? existing.extras ?? {}, existing.images ?? [], validated.images)
        : validated.extras
      const [row] = await tx
        .update(vehicles)
        .set({ ...validated, ...(extras && { extras }), updatedAt: new Date() })
        .where(eq(vehicles.id, id))
        .returning()
      return row
    })
    await rememberInventoryPatch(validated)
    refreshSite()
    return serializeVehicle(vehicle)
  })
}

export async function deleteVehicle(id: string) {
  return attempt(async () => {
    await requireUser()
    const [deleted] = await db.delete(vehicles).where(eq(vehicles.id, id)).returning()
    if (!deleted) throw new UserError('Véhicule introuvable.')
    refreshSite()
    return { success: true as const }
  })
}

async function storeVehicleFile(id: string, file: File) {
  const { type, ext } = vehicleImageMeta(file)
  const base = process.env.R2_PUBLIC_URL?.replace(/\/$/, '')
  if (!base) throw new UserError('Stockage photo indisponible.')
  const key = `vehicles/${id}/${Date.now()}.${ext}`
  try {
    await uploadToR2(key, new Uint8Array(await file.arrayBuffer()), type)
  } catch (err) {
    console.error('R2 upload error:', err)
    throw new UserError('Envoi de la photo impossible.')
  }
  return `${base}/${key}`
}

export async function uploadVehicleImage(id: string, formData: FormData) {
  return attempt(async () => {
    await requireUser()
    const [vehicle] = await db.select({ id: vehicles.id }).from(vehicles).where(eq(vehicles.id, id))
    if (!vehicle) throw new UserError('Véhicule introuvable.')

    const file = formData.get('file')
    if (!(file instanceof File)) throw new UserError('Aucune photo reçue.')

    const publicUrl = await storeVehicleFile(id, file)
    const [updated] = await db
      .update(vehicles)
      .set({
        images: sql`coalesce(${vehicles.images}, '[]'::jsonb) || jsonb_build_array(${publicUrl}::text)`,
        updatedAt: new Date(),
      })
      .where(eq(vehicles.id, id))
      .returning()

    if (!updated) throw new UserError('Véhicule introuvable.')
    const serialized = serializeVehicle(updated)
    refreshSite()
    return { url: publicUrl, images: serialized.images }
  })
}

export async function replaceVehicleImage(id: string, index: number, formData: FormData) {
  return attempt(async () => {
    await requireUser()
    const [existing] = await db.select({ id: vehicles.id }).from(vehicles).where(eq(vehicles.id, id))
    if (!existing) throw new UserError('Véhicule introuvable.')
    const file = formData.get('file')
    if (!(file instanceof File)) throw new UserError('Aucune photo reçue.')
    if (!Number.isInteger(index) || index < 0) throw new UserError('Cette photo n’existe plus. Rechargez la page.')

    const publicUrl = await storeVehicleFile(id, file)
    const updated = await db.transaction(async (tx) => {
      const [vehicle] = await tx.select().from(vehicles).where(eq(vehicles.id, id)).for('update')
      if (!vehicle) throw new UserError('Véhicule introuvable.')
      const before = vehicle.images ?? []
      const images = [...before]
      if (index >= images.length) throw new UserError('Cette photo n’existe plus. Rechargez la page.')
      images[index] = publicUrl
      const [row] = await tx
        .update(vehicles)
        .set({ images, extras: coverFor(vehicle.extras ?? {}, before, images), updatedAt: new Date() })
        .where(eq(vehicles.id, id))
        .returning()
      return row
    })

    refreshSite()
    return serializeVehicle(updated)
  })
}
