'use server'

import { eq, and, sql } from 'drizzle-orm'
import { db } from './db/index'
import { vehicles } from './db/schema'
import { requireUser } from './session'
import { createVehicleSchema, updateVehicleSchema, parseBody, iso } from './schemas'
import { uploadToR2 } from './r2-upload'

export type VehicleStatus = 'available' | 'reserved' | 'sold'
export type FuelType = 'gasoline' | 'diesel' | 'hybrid' | 'electric'
export type Transmission = 'manual' | 'automatic' | 'cvt'

export type VehicleFilters = {
  page?: number
  limit?: number
  status?: VehicleStatus
  search?: string
}

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
  const limitNum = Math.min(100, Math.max(1, filters.limit ?? 20))
  const offset = (pageNum - 1) * limitNum

  const conditions = []
  if (filters.status) conditions.push(eq(vehicles.status, filters.status))
  if (filters.search) {
    conditions.push(
      sql`(${vehicles.make} ilike ${'%' + filters.search + '%'} or ${vehicles.model} ilike ${'%' + filters.search + '%'})`
    )
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined

  const [rows, [{ count }]] = await Promise.all([
    db.select().from(vehicles).where(where).limit(limitNum).offset(offset),
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
  const [vehicle] = await db
    .insert(vehicles)
    .values({ ...validated, createdBy: user.id })
    .returning()
  return serializeVehicle(vehicle)
}

export async function updateVehicle(id: string, data: unknown) {
  await requireUser()
  const validated = parseBody(updateVehicleSchema, data)
  const [vehicle] = await db
    .update(vehicles)
    .set({ ...validated, updatedAt: new Date() })
    .where(eq(vehicles.id, id))
    .returning()
  if (!vehicle) throw new Error('Vehicle not found')
  return serializeVehicle(vehicle)
}

export async function deleteVehicle(id: string) {
  await requireUser()
  const [deleted] = await db.delete(vehicles).where(eq(vehicles.id, id)).returning()
  if (!deleted) throw new Error('Vehicle not found')
  return { success: true as const }
}

export async function uploadVehicleImage(id: string, formData: FormData) {
  await requireUser()
  const [vehicle] = await db.select().from(vehicles).where(eq(vehicles.id, id))
  if (!vehicle) throw new Error('Vehicle not found')

  const file = formData.get('file')
  if (!(file instanceof File)) throw new Error('No file provided')

  const ext = file.name.split('.').pop() ?? 'jpg'
  const key = `vehicles/${id}/${Date.now()}.${ext}`
  const buffer = await file.arrayBuffer()

  try {
    await uploadToR2(key, new Uint8Array(buffer), file.type)
  } catch (err) {
    console.error('R2 upload error:', err)
    throw new Error('Upload failed')
  }

  const publicUrl = `${process.env.R2_PUBLIC_URL}/${key}`
  const updatedImages = [...(vehicle.images ?? []), publicUrl]

  const [updated] = await db
    .update(vehicles)
    .set({ images: updatedImages, updatedAt: new Date() })
    .where(eq(vehicles.id, id))
    .returning()

  return { url: publicUrl, images: updated.images ?? [] }
}
