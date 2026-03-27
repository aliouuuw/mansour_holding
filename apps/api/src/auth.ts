import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { getDb } from './db/index'
import * as schema from './db/schema-for-migrations'

function createAuth() {
  return betterAuth({
    database: drizzleAdapter(getDb(), {
      provider: 'pg',
      schema: schema,
    }),
    advanced: {
      generateId: () => crypto.randomUUID(),
    },
    emailAndPassword: {
      enabled: true,
      autoSignIn: true,
    },
    socialProviders: {},
    secret: process.env.BETTER_AUTH_SECRET || 'your-secret-key-change-in-production',
    baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3000',
    trustedOrigins: [
      process.env.FRONTEND_URL || 'http://localhost:5173',
      'https://mansour-holding.vercel.app',
      'https://mansour-api.mansour-holding.workers.dev',
      'http://localhost:5173',
      'http://localhost:3000',
    ],
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      httpOnly: true,
    },
  })
}

let _auth: ReturnType<typeof createAuth> | null = null

export const auth = new Proxy({} as ReturnType<typeof createAuth>, {
  get(_, prop) {
    if (!_auth) _auth = createAuth()
    return (_auth as any)[prop]
  },
})

export type Auth = typeof auth
