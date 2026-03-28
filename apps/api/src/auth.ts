import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { db } from './db/index'
import * as schema from './db/schema-for-migrations'

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: schema,
  }),
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
    'http://localhost:5173',
    'http://localhost:3000',
  ],
  cookie: {
    secure: true,
    sameSite: 'none',
    httpOnly: true,
  },
})

export type Auth = typeof auth
