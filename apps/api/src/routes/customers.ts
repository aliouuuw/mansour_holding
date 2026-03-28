import { Hono } from 'hono'
import { eq, or, ilike, and, sql } from 'drizzle-orm'
import { db } from '../db/index'
import { customers } from '../db/schema'
import { auth } from '../auth'

const customersRoute = new Hono()

// Auth middleware
customersRoute.use('*', async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers })
  if (!session) return c.json({ error: 'Unauthorized' }, 401)
  await next()
})

// GET /api/customers — list with search and pagination
customersRoute.get('/', async (c) => {
  const { page = '1', limit = '20', search } = c.req.query()
  const pageNum = Math.max(1, parseInt(page))
  const limitNum = Math.min(100, Math.max(1, parseInt(limit)))
  const offset = (pageNum - 1) * limitNum

  const where = search
    ? or(
        ilike(customers.firstName, `%${search}%`),
        ilike(customers.lastName, `%${search}%`),
        ilike(customers.email, `%${search}%`),
        ilike(customers.phone, `%${search}%`)
      )
    : undefined

  const [rows, [{ count }]] = await Promise.all([
    db.select().from(customers).where(where).limit(limitNum).offset(offset),
    db.select({ count: sql<number>`count(*)::int` }).from(customers).where(where),
  ])

  return c.json({
    data: rows,
    pagination: { page: pageNum, limit: limitNum, total: count, pages: Math.ceil(count / limitNum) },
  })
})

// GET /api/customers/:id
customersRoute.get('/:id', async (c) => {
  const [customer] = await db.select().from(customers).where(eq(customers.id, c.req.param('id')))
  if (!customer) return c.json({ error: 'Customer not found' }, 404)
  return c.json(customer)
})

// POST /api/customers
customersRoute.post('/', async (c) => {
  const body = await c.req.json()
  const [customer] = await db.insert(customers).values(body).returning()
  return c.json(customer, 201)
})

// PUT /api/customers/:id
customersRoute.put('/:id', async (c) => {
  const body = await c.req.json()
  const { id: _id, createdAt: _ca, ...updates } = body
  const [customer] = await db
    .update(customers)
    .set({ ...updates, updatedAt: new Date() })
    .where(eq(customers.id, c.req.param('id')))
    .returning()
  if (!customer) return c.json({ error: 'Customer not found' }, 404)
  return c.json(customer)
})

// DELETE /api/customers/:id
customersRoute.delete('/:id', async (c) => {
  const [deleted] = await db.delete(customers).where(eq(customers.id, c.req.param('id'))).returning()
  if (!deleted) return c.json({ error: 'Customer not found' }, 404)
  return c.json({ success: true })
})

export default customersRoute
