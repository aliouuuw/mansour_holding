'use server'

import { eq, sql } from 'drizzle-orm'
import { db } from './db/index'
import { deals, vehicles, customers } from './db/schema'
import { requireUser } from './session'
import { createDealSchema, updateDealSchema, parseBody, iso } from './schemas'

export type DealStatus = 'lead' | 'negotiation' | 'closed-won' | 'closed-lost'

const dealSelect = {
  deal: deals,
  vehicleMake: vehicles.make,
  vehicleModel: vehicles.model,
  vehicleYear: vehicles.year,
  customerFirstName: customers.firstName,
  customerLastName: customers.lastName,
  customerPhone: customers.phone,
}

function serializeDeal(row: {
  deal: typeof deals.$inferSelect
  vehicleMake: string | null
  vehicleModel: string | null
  vehicleYear: number | null
  customerFirstName: string | null
  customerLastName: string | null
  customerPhone: string | null
}) {
  return {
    ...row.deal,
    createdAt: iso(row.deal.createdAt)!,
    updatedAt: iso(row.deal.updatedAt)!,
    testDriveDate: iso(row.deal.testDriveDate),
    closedAt: iso(row.deal.closedAt),
    vehicleName: row.vehicleMake ? `${row.vehicleMake} ${row.vehicleModel} ${row.vehicleYear}` : null,
    customerName: row.customerFirstName ? `${row.customerFirstName} ${row.customerLastName}` : null,
    customerPhone: row.customerPhone ?? null,
  }
}

export async function listDeals(params: { page?: number; limit?: number; status?: DealStatus } = {}) {
  await requireUser()
  const pageNum = Math.max(1, params.page ?? 1)
  const limitNum = Math.min(100, Math.max(1, params.limit ?? 50))
  const offset = (pageNum - 1) * limitNum
  const where = params.status ? eq(deals.status, params.status) : undefined

  const [rows, [{ count }]] = await Promise.all([
    db
      .select(dealSelect)
      .from(deals)
      .leftJoin(vehicles, eq(deals.vehicleId, vehicles.id))
      .leftJoin(customers, eq(deals.customerId, customers.id))
      .where(where)
      .limit(limitNum)
      .offset(offset),
    db.select({ count: sql<number>`count(*)::int` }).from(deals).where(where),
  ])

  return {
    data: rows.map(serializeDeal),
    pagination: { page: pageNum, limit: limitNum, total: count, pages: Math.ceil(count / limitNum) },
  }
}

export async function getDealSummary() {
  await requireUser()
  const rows = await db
    .select({ status: deals.status, count: sql<number>`count(*)::int` })
    .from(deals)
    .groupBy(deals.status)

  const summary: Record<string, number> = {
    lead: 0, negotiation: 0, 'closed-won': 0, 'closed-lost': 0,
  }
  for (const row of rows) summary[row.status] = row.count

  const totalRevenue = await db
    .select({ total: sql<number>`coalesce(sum(price), 0)::int` })
    .from(deals)
    .where(eq(deals.status, 'closed-won'))

  return { ...summary, totalRevenue: totalRevenue[0].total } as {
    lead: number
    negotiation: number
    'closed-won': number
    'closed-lost': number
    totalRevenue: number
  }
}

export async function getDeal(id: string) {
  await requireUser()
  const [row] = await db
    .select(dealSelect)
    .from(deals)
    .leftJoin(vehicles, eq(deals.vehicleId, vehicles.id))
    .leftJoin(customers, eq(deals.customerId, customers.id))
    .where(eq(deals.id, id))

  if (!row) throw new Error('Deal not found')
  return serializeDeal(row)
}

export async function createDeal(data: unknown) {
  const user = await requireUser()
  const validated = parseBody(createDealSchema, data)
  const [deal] = await db
    .insert(deals)
    .values({ ...validated, salesPersonId: user.id })
    .returning()

  const [row] = await db
    .select(dealSelect)
    .from(deals)
    .leftJoin(vehicles, eq(deals.vehicleId, vehicles.id))
    .leftJoin(customers, eq(deals.customerId, customers.id))
    .where(eq(deals.id, deal.id))

  return serializeDeal(row!)
}

export async function updateDeal(id: string, data: unknown) {
  await requireUser()
  const validated = parseBody(updateDealSchema, data)
  if (validated.status === 'closed-won' || validated.status === 'closed-lost') {
    validated.closedAt = new Date()
  }

  const [deal] = await db
    .update(deals)
    .set({ ...validated, updatedAt: new Date() })
    .where(eq(deals.id, id))
    .returning()

  if (!deal) throw new Error('Deal not found')

  const [row] = await db
    .select(dealSelect)
    .from(deals)
    .leftJoin(vehicles, eq(deals.vehicleId, vehicles.id))
    .leftJoin(customers, eq(deals.customerId, customers.id))
    .where(eq(deals.id, deal.id))

  return serializeDeal(row!)
}

export async function deleteDeal(id: string) {
  await requireUser()
  const [deleted] = await db.delete(deals).where(eq(deals.id, id)).returning()
  if (!deleted) throw new Error('Deal not found')
  return { success: true as const }
}
