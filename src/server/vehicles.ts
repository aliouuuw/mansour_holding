'use server'

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

/* landing, stock and detail pages are ISR: refresh them on every staff change */
const refreshSite = () => revalidatePath('/mansour-motors', 'layout')

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
  if (filters.search) {
    conditions.push(
      sql`(${vehicles.make} ilike ${'%' + filters.search + '%'} or ${vehicles.model} ilike ${'%' + filters.search + '%'})`
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
  if (!vehicle) throw new Error('Vehicle not found')
  return serializeVehicle(vehicle)
}

export async function createVehicle(data: unknown) {
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
}

export async function reorderVehicles(orderedIds: string[]) {
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
}

export async function updateVehicle(id: string, data: unknown) {
  await requireUser()
  const validated = parseBody(updateVehicleSchema, data)
  const vehicle = await db.transaction(async (tx) => {
    const [existing] = await tx.select().from(vehicles).where(eq(vehicles.id, id)).for('update')
    if (!existing) throw new Error('Vehicle not found')
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
}

export async function deleteVehicle(id: string) {
  await requireUser()
  const [deleted] = await db.delete(vehicles).where(eq(vehicles.id, id)).returning()
  if (!deleted) throw new Error('Vehicle not found')
  refreshSite()
  return { success: true as const }
}

async function storeVehicleFile(id: string, file: File) {
  const { type, ext } = vehicleImageMeta(file)
  const base = process.env.R2_PUBLIC_URL?.replace(/\/$/, '')
  if (!base) throw new Error('Stockage photo indisponible.')
  const key = `vehicles/${id}/${Date.now()}.${ext}`
  try {
    await uploadToR2(key, new Uint8Array(await file.arrayBuffer()), type)
  } catch (err) {
    console.error('R2 upload error:', err)
    throw new Error('Envoi de la photo impossible.')
  }
  return `${base}/${key}`
}

export async function uploadVehicleImage(id: string, formData: FormData) {
  await requireUser()
  const [vehicle] = await db.select({ id: vehicles.id }).from(vehicles).where(eq(vehicles.id, id))
  if (!vehicle) throw new Error('Vehicle not found')

  const file = formData.get('file')
  if (!(file instanceof File)) throw new Error('No file provided')

  const publicUrl = await storeVehicleFile(id, file)
  const [updated] = await db
    .update(vehicles)
    .set({
      images: sql`coalesce(${vehicles.images}, '[]'::jsonb) || jsonb_build_array(${publicUrl}::text)`,
      updatedAt: new Date(),
    })
    .where(eq(vehicles.id, id))
    .returning()

  if (!updated) throw new Error('Vehicle not found')
  const serialized = serializeVehicle(updated)
  refreshSite()
  return { url: publicUrl, images: serialized.images }
}

export async function replaceVehicleImage(id: string, index: number, formData: FormData) {
  await requireUser()
  const [existing] = await db.select({ id: vehicles.id }).from(vehicles).where(eq(vehicles.id, id))
  if (!existing) throw new Error('Vehicle not found')
  const file = formData.get('file')
  if (!(file instanceof File)) throw new Error('No file provided')
  if (!Number.isInteger(index) || index < 0) throw new Error('Image index out of range')

  const publicUrl = await storeVehicleFile(id, file)
  const updated = await db.transaction(async (tx) => {
    const [vehicle] = await tx.select().from(vehicles).where(eq(vehicles.id, id)).for('update')
    if (!vehicle) throw new Error('Vehicle not found')
    const before = vehicle.images ?? []
    const images = [...before]
    if (index >= images.length) throw new Error('Image index out of range')
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
}
