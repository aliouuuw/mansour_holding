import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'

type Bindings = {
  DATABASE_URL: string
  BETTER_AUTH_SECRET: string
  BETTER_AUTH_URL: string
  FRONTEND_URL: string
  ASSETS: R2Bucket
}

const app = new Hono<{ Bindings: Bindings }>()

// Middleware
app.use('*', logger())
app.use('*', async (c, next) => {
  // Inject Worker bindings into process.env so existing code can use process.env
  if (c.env.DATABASE_URL) process.env.DATABASE_URL = c.env.DATABASE_URL
  if (c.env.BETTER_AUTH_SECRET) process.env.BETTER_AUTH_SECRET = c.env.BETTER_AUTH_SECRET
  if (c.env.BETTER_AUTH_URL) process.env.BETTER_AUTH_URL = c.env.BETTER_AUTH_URL
  if (c.env.FRONTEND_URL) process.env.FRONTEND_URL = c.env.FRONTEND_URL
  await next()
})
app.use('*', async (c, next) => {
  const allowed = [
    'https://mansour-holding.vercel.app',
    c.env.FRONTEND_URL,
    'http://localhost:5173',
    'http://localhost:3000',
  ].filter(Boolean) as string[]

  return cors({
    origin: (origin) => allowed.includes(origin) ? origin : null,
    credentials: true,
  })(c, next)
})

// Health check endpoint
app.get('/api/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Mount better-auth routes at /api/auth/*
app.on(['POST', 'GET'], '/api/auth/*', async (c) => {
  const { auth } = await import('./auth')
  return auth.handler(c.req.raw)
})

// TODO: Mount vehicle routes at /api/vehicles
// TODO: Mount customer routes at /api/customers
// TODO: Mount deal routes at /api/deals

// 404 handler
app.notFound((c) => {
  return c.json({ error: 'Not found' }, 404)
})

// Error handler
app.onError((err, c) => {
  console.error('Error:', err)
  return c.json({ error: 'Internal server error' }, 500)
})

export default app
