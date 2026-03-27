import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { db } from './db/index'
import { auth } from './auth'

const app = new Hono()

// Middleware
app.use('*', logger())
app.use('*', cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}))

// Health check endpoint
app.get('/api/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Mount better-auth routes at /api/auth/*
app.on(['POST', 'GET'], '/api/auth/*', (c) => {
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

// Start server
const port = process.env.PORT ? parseInt(process.env.PORT) : 3000

console.log(`Starting server on port ${port}...`)

export default {
  port,
  fetch: app.fetch,
}
