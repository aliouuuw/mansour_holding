import { Context, Next } from 'hono'

interface RateLimitStore {
  [key: string]: {
    count: number
    resetAt: number
  }
}

const store: RateLimitStore = {}

// Clean up expired entries every 5 minutes
setInterval(() => {
  const now = Date.now()
  for (const key in store) {
    if (store[key].resetAt < now) {
      delete store[key]
    }
  }
}, 5 * 60 * 1000)

export interface RateLimitOptions {
  windowMs: number // Time window in milliseconds
  max: number // Max requests per window
  keyGenerator?: (c: Context) => string // Custom key generator
}

/**
 * Simple in-memory rate limiter middleware
 * For production, consider using Redis or a dedicated rate limiting service
 */
export function rateLimit(options: RateLimitOptions) {
  const { windowMs, max, keyGenerator } = options

  return async (c: Context, next: Next) => {
    const key = keyGenerator ? keyGenerator(c) : getDefaultKey(c)
    const now = Date.now()

    // Initialize or get existing entry
    if (!store[key] || store[key].resetAt < now) {
      store[key] = {
        count: 0,
        resetAt: now + windowMs,
      }
    }

    // Increment counter
    store[key].count++

    // Set rate limit headers
    const remaining = Math.max(0, max - store[key].count)
    const resetAt = Math.ceil(store[key].resetAt / 1000)

    c.header('X-RateLimit-Limit', max.toString())
    c.header('X-RateLimit-Remaining', remaining.toString())
    c.header('X-RateLimit-Reset', resetAt.toString())

    // Check if limit exceeded
    if (store[key].count > max) {
      const retryAfter = Math.ceil((store[key].resetAt - now) / 1000)
      c.header('Retry-After', retryAfter.toString())
      return c.json(
        {
          error: 'Too many requests',
          message: `Rate limit exceeded. Try again in ${retryAfter} seconds.`,
        },
        429
      )
    }

    await next()
  }
}

/**
 * Default key generator: IP address + user agent
 */
function getDefaultKey(c: Context): string {
  const ip = c.req.header('cf-connecting-ip') || c.req.header('x-forwarded-for') || 'unknown'
  const userAgent = c.req.header('user-agent') || 'unknown'
  return `${ip}:${userAgent}`
}
