import { Hono, type Context, type Next } from 'hono'
import { eq, sql } from 'drizzle-orm'
import { db } from '../db/index'
import { deals, vehicles, customers } from '../db/schema'
import { auth } from '../auth'

const dealsRoute = new Hono()

async function requireAuth(c: Context, next: Next) {
  const session = await auth.api.getSession({ headers: c.req.raw.headers })
  if (!session) return c.json({ error: 'Unauthorized' }, 401)
  c.set('session' as never, session)
  await next()
}

dealsRoute.use('*', requireAuth)

// GET /api/deals/summary — counts per status (must be before /:id)
dealsRoute.get('/summary', async (c) => {
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

  return c.json({ ...summary, totalRevenue: totalRevenue[0].total })
})

// GET /api/deals — list with optional status filter and pagination
dealsRoute.get('/', async (c) => {
  const { page = '1', limit = '50', status } = c.req.query()
  const pageNum = Math.max(1, parseInt(page))
  const limitNum = Math.min(100, Math.max(1, parseInt(limit)))
  const offset = (pageNum - 1) * limitNum

  const where = status ? eq(deals.status, status as 'lead' | 'negotiation' | 'closed-won' | 'closed-lost') : undefined

  const [rows, [{ count }]] = await Promise.all([
    db
      .select({
        deal: deals,
        vehicleMake: vehicles.make,
        vehicleModel: vehicles.model,
        vehicleYear: vehicles.year,
        customerFirstName: customers.firstName,
        customerLastName: customers.lastName,
        customerPhone: customers.phone,
      })
      .from(deals)
      .leftJoin(vehicles, eq(deals.vehicleId, vehicles.id))
      .leftJoin(customers, eq(deals.customerId, customers.id))
      .where(where)
      .limit(limitNum)
      .offset(offset),
    db.select({ count: sql<number>`count(*)::int` }).from(deals).where(where),
  ])

  const data = rows.map(({ deal, vehicleMake, vehicleModel, vehicleYear, customerFirstName, customerLastName, customerPhone }) => ({
    ...deal,
    vehicleName: vehicleMake ? `${vehicleMake} ${vehicleModel} ${vehicleYear}` : null,
    customerName: customerFirstName ? `${customerFirstName} ${customerLastName}` : null,
    customerPhone: customerPhone ?? null,
  }))

  return c.json({
    data,
    pagination: { page: pageNum, limit: limitNum, total: count, pages: Math.ceil(count / limitNum) },
  })
})

// GET /api/deals/:id
dealsRoute.get('/:id', async (c) => {
  const id = c.req.param('id') as string
  const [row] = await db
    .select({
      deal: deals,
      vehicleMake: vehicles.make,
      vehicleModel: vehicles.model,
      vehicleYear: vehicles.year,
      customerFirstName: customers.firstName,
      customerLastName: customers.lastName,
      customerPhone: customers.phone,
    })
    .from(deals)
    .leftJoin(vehicles, eq(deals.vehicleId, vehicles.id))
    .leftJoin(customers, eq(deals.customerId, customers.id))
    .where(eq(deals.id, id))

  if (!row) return c.json({ error: 'Deal not found' }, 404)

  return c.json({
    ...row.deal,
    vehicleName: row.vehicleMake ? `${row.vehicleMake} ${row.vehicleModel} ${row.vehicleYear}` : null,
    customerName: row.customerFirstName ? `${row.customerFirstName} ${row.customerLastName}` : null,
    customerPhone: row.customerPhone ?? null,
  })
})

// POST /api/deals
dealsRoute.post('/', async (c) => {
  const session = c.get('session' as never) as Awaited<ReturnType<typeof auth.api.getSession>>
  const body = await c.req.json()
  const [deal] = await db
    .insert(deals)
    .values({ ...body, salesPersonId: session?.user.id })
    .returning()
  return c.json(deal, 201)
})

// PUT /api/deals/:id
dealsRoute.put('/:id', async (c) => {
  const id = c.req.param('id') as string
  const body = await c.req.json()
  const { id: _id, createdAt: _ca, salesPersonId: _sp, ...updates } = body

  // Auto-set closedAt when status changes to closed
  if (updates.status === 'closed-won' || updates.status === 'closed-lost') {
    updates.closedAt = new Date()
  }

  const [deal] = await db
    .update(deals)
    .set({ ...updates, updatedAt: new Date() })
    .where(eq(deals.id, id))
    .returning()

  if (!deal) return c.json({ error: 'Deal not found' }, 404)
  return c.json(deal)
})

// DELETE /api/deals/:id
dealsRoute.delete('/:id', async (c) => {
  const id = c.req.param('id') as string
  const [deleted] = await db.delete(deals).where(eq(deals.id, id)).returning()
  if (!deleted) return c.json({ error: 'Deal not found' }, 404)
  return c.json({ success: true })
})

export default dealsRoute
