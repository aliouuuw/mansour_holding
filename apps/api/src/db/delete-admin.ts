import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { config } from 'dotenv'
import { eq } from 'drizzle-orm'
import * as schema from './schema-for-migrations'

// Load environment variables from .env file
config({ path: '../../.env' })

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set')
}

const client = postgres(connectionString, { prepare: false })
const db = drizzle(client, { schema })

async function deleteAdmin() {
  console.log('Deleting admin user...')
  
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@mansour.sn'
  
  // Find the user
  const user = await db.query.user.findFirst({
    where: (user, { eq: eqFn }) => eqFn(user.email, adminEmail)
  })
  
  if (!user) {
    console.log('Admin user not found')
    await client.end()
    return
  }
  
  // Delete associated accounts first
  await db.delete(schema.account).where(eq(schema.account.userId, user.id))
  
  // Delete the user
  await db.delete(schema.user).where(eq(schema.user.email, adminEmail))
  
  console.log('Admin user deleted successfully')
  await client.end()
}

deleteAdmin().catch((error) => {
  console.error(error)
  process.exit(1)
})
