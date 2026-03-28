import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { auth } from './auth'
import vehiclesRoute from './routes/vehicles'
import customersRoute from './routes/customers'
import dealsRoute from './routes/deals'
import { rateLimit } from './middleware/rateLimit'

const app = new Hono()

app.use('*', logger())
app.use('*', cors({
  origin: (origin) => {
    const allowed = [
      process.env.FRONTEND_URL || 'http://localhost:5173',
      'https://mansour-holding.vercel.app',
      'https://integral-adel-wadeweb-04b62073.koyeb.app',
      'http://localhost:5173',
      'http://localhost:3000',
    ]
    return allowed.includes(origin) ? origin : null
  },
  credentials: true,
}))

// Rate limiting: 100 requests per 15 minutes per IP
app.use('*', rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
}))

app.get('/api/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.on(['POST', 'GET'], '/api/auth/*', (c) => {
  return auth.handler(c.req.raw)
})

app.route('/api/vehicles', vehiclesRoute)
app.route('/api/customers', customersRoute)
app.route('/api/deals', dealsRoute)

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
