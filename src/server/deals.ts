'use server'

import { UserError, attempt, type ActionResult } from './action-result'
import { revalidatePath } from 'next/cache'
import { and, desc, eq, ilike, or, sql } from 'drizzle-orm'
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

function dealListWhere(params: { status?: DealStatus; search?: string }) {
  const parts = []
  if (params.status) parts.push(eq(deals.status, params.status))
  if (params.search?.trim()) {
    const term = `%${params.search.trim()}%`
    parts.push(
      or(
        ilike(sql`concat_ws(' ', ${vehicles.make}, ${vehicles.model})`, term),
        ilike(sql`concat_ws(' ', ${customers.firstName}, ${customers.lastName})`, term),
        ilike(sql`concat_ws(' ', ${customers.lastName}, ${customers.firstName})`, term),
        ilike(customers.phone, term)
      )
    )
  }
  return parts.length > 0 ? and(...parts) : undefined
}

export async function listDeals(params: { page?: number; limit?: number; status?: DealStatus; search?: string } = {}) {
  return attempt(async () => {
    await requireUser()
    const pageNum = Math.max(1, params.page ?? 1)
    const limitNum = Math.min(100, Math.max(1, params.limit ?? 50))
    const offset = (pageNum - 1) * limitNum
    const where = dealListWhere(params)

    const base = db
      .select(dealSelect)
      .from(deals)
      .leftJoin(vehicles, eq(deals.vehicleId, vehicles.id))
      .leftJoin(customers, eq(deals.customerId, customers.id))

    const [rows, [{ count }]] = await Promise.all([
      base.where(where).orderBy(desc(deals.createdAt)).limit(limitNum).offset(offset),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(deals)
        .leftJoin(vehicles, eq(deals.vehicleId, vehicles.id))
        .leftJoin(customers, eq(deals.customerId, customers.id))
        .where(where),
    ])

    return {
      data: rows.map(serializeDeal),
      pagination: { page: pageNum, limit: limitNum, total: count, pages: Math.ceil(count / limitNum) },
    }
  })
}

export async function getDealSummary() {
  return attempt(async () => {
    await requireUser()
    const [rows, [{ total }]] = await Promise.all([
      db
        .select({ status: deals.status, count: sql<number>`count(*)::int` })
        .from(deals)
        .groupBy(deals.status),
      db
        .select({ total: sql<number>`coalesce(sum(${deals.price}), 0)`.mapWith(Number) })
        .from(deals)
        .where(eq(deals.status, 'closed-won')),
    ])

    const summary = { lead: 0, negotiation: 0, 'closed-won': 0, 'closed-lost': 0, totalRevenue: total }
    for (const row of rows) summary[row.status] = row.count
    return summary
  })
}

export type DealsBoard = {
  columns: Record<DealStatus, ReturnType<typeof serializeDeal>[]>
  activeCount: number
  wonRevenue: number
}

export async function listDealsBoard(): Promise<ActionResult<DealsBoard>> {
  return attempt(async () => {
    await requireUser()
    // ponytail: one scan of deals. Paginate per column if the board grows past a few hundred rows.
    const rows = await db
      .select(dealSelect)
      .from(deals)
      .leftJoin(vehicles, eq(deals.vehicleId, vehicles.id))
      .leftJoin(customers, eq(deals.customerId, customers.id))
      .orderBy(desc(deals.createdAt))

    const columns: DealsBoard['columns'] = {
      lead: [],
      negotiation: [],
      'closed-won': [],
      'closed-lost': [],
    }
    for (const row of rows) {
      const deal = serializeDeal(row)
      columns[deal.status].push(deal)
    }

    return {
      columns,
      activeCount: columns.lead.length + columns.negotiation.length,
      wonRevenue: columns['closed-won'].reduce((sum, deal) => sum + deal.price, 0),
    }
  })
}

export async function getDeal(id: string) {
  return attempt(async () => {
    await requireUser()
    const [row] = await db
      .select(dealSelect)
      .from(deals)
      .leftJoin(vehicles, eq(deals.vehicleId, vehicles.id))
      .leftJoin(customers, eq(deals.customerId, customers.id))
      .where(eq(deals.id, id))

    if (!row) throw new UserError('Affaire introuvable.')
    return serializeDeal(row)
  })
}

export async function createDeal(data: unknown) {
  return attempt(async () => {
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
  })
}

export async function updateDeal(id: string, data: unknown) {
  return attempt(async () => {
    await requireUser()
    const validated = parseBody(updateDealSchema, data)
    if (validated.status) {
      /* reopening a deal clears its close date */
      validated.closedAt = validated.status === 'closed-won' || validated.status === 'closed-lost' ? new Date() : null
    }

    const deal = await db.transaction(async (tx) => {
      const [row] = await tx
        .update(deals)
        .set({ ...validated, updatedAt: new Date() })
        .where(eq(deals.id, id))
        .returning()
      if (!row) throw new UserError('Affaire introuvable.')
      /* a won deal sells the car: the public site shows it as Vendu. Reopening does not put it back on sale. */
      if (validated.status === 'closed-won') {
        await tx.update(vehicles).set({ status: 'sold', updatedAt: new Date() }).where(eq(vehicles.id, row.vehicleId))
      }
      return row
    })
    if (validated.status === 'closed-won') revalidatePath('/mansour-motors', 'layout')

    const [row] = await db
      .select(dealSelect)
      .from(deals)
      .leftJoin(vehicles, eq(deals.vehicleId, vehicles.id))
      .leftJoin(customers, eq(deals.customerId, customers.id))
      .where(eq(deals.id, deal.id))

    return serializeDeal(row!)
  })
}

export async function deleteDeal(id: string) {
  return attempt(async () => {
    await requireUser()
    const [deleted] = await db.delete(deals).where(eq(deals.id, id)).returning()
    if (!deleted) throw new UserError('Affaire introuvable.')
    return { success: true as const }
  })
}
