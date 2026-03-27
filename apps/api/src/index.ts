import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { auth } from './auth'

const app = new Hono()

app.use('*', logger())
app.use('*', cors({
  origin: (origin) => {
    const allowed = [
      process.env.FRONTEND_URL || 'http://localhost:5173',
      'https://mansour-holding.vercel.app',
      'http://localhost:5173',
      'http://localhost:3000',
    ]
    return allowed.includes(origin) ? origin : null
  },
  credentials: true,
}))

app.get('/api/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.on(['POST', 'GET'], '/api/auth/*', (c) => {
  return auth.handler(c.req.raw)
})

// TODO: Mount vehicle routes at /api/vehicles
// TODO: Mount customer routes at /api/customers
// TODO: Mount deal routes at /api/deals

app.notFound((c) => c.json({ error: 'Not found' }, 404))
app.onError((err, c) => {
  console.error('Error:', err)
  return c.json({ error: 'Internal server error' }, 500)
})

const port = process.env.PORT ? parseInt(process.env.PORT) : 3000
console.log(`Starting server on port ${port}...`)

export default {
  port,
  fetch: app.fetch,
}
