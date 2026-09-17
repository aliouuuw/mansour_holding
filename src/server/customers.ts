'use server'

import { eq, or, ilike, sql } from 'drizzle-orm'
import { db } from './db/index'
import { customers } from './db/schema'
import { requireUser } from './session'
import { createCustomerSchema, updateCustomerSchema, parseBody, iso } from './schemas'

export type CustomerSource = 'walk-in' | 'referral' | 'online' | 'phone'

function serializeCustomer(row: typeof customers.$inferSelect) {
  return {
    ...row,
    createdAt: iso(row.createdAt)!,
    updatedAt: iso(row.updatedAt)!,
  }
}

export async function listCustomers(params: { page?: number; limit?: number; search?: string } = {}) {
  await requireUser()
  const pageNum = Math.max(1, params.page ?? 1)
  const limitNum = Math.min(100, Math.max(1, params.limit ?? 20))
  const offset = (pageNum - 1) * limitNum

  const where = params.search
    ? or(
        ilike(customers.firstName, `%${params.search}%`),
        ilike(customers.lastName, `%${params.search}%`),
        ilike(customers.email, `%${params.search}%`),
        ilike(customers.phone, `%${params.search}%`)
      )
    : undefined

  const [rows, [{ count }]] = await Promise.all([
    db.select().from(customers).where(where).limit(limitNum).offset(offset),
    db.select({ count: sql<number>`count(*)::int` }).from(customers).where(where),
  ])

  return {
    data: rows.map(serializeCustomer),
    pagination: { page: pageNum, limit: limitNum, total: count, pages: Math.ceil(count / limitNum) },
  }
}

export async function getCustomer(id: string) {
  await requireUser()
  const [customer] = await db.select().from(customers).where(eq(customers.id, id))
  if (!customer) throw new Error('Customer not found')
  return serializeCustomer(customer)
}

export async function createCustomer(data: unknown) {
  await requireUser()
  const validated = parseBody(createCustomerSchema, data)
  const [customer] = await db.insert(customers).values(validated).returning()
  return serializeCustomer(customer)
}

export async function updateCustomer(id: string, data: unknown) {
  await requireUser()
  const validated = parseBody(updateCustomerSchema, data)
  const [customer] = await db
    .update(customers)
    .set({ ...validated, updatedAt: new Date() })
    .where(eq(customers.id, id))
    .returning()
  if (!customer) throw new Error('Customer not found')
  return serializeCustomer(customer)
}

export async function deleteCustomer(id: string) {
  await requireUser()
  const [deleted] = await db.delete(customers).where(eq(customers.id, id)).returning()
  if (!deleted) throw new Error('Customer not found')
  return { success: true as const }
}
