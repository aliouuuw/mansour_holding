import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { config } from 'dotenv'
import * as schema from './schema-for-migrations'

// Load environment variables from .env file
config({ path: '../../.env' })

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set')
}

const client = postgres(connectionString, { prepare: false })
const db = drizzle(client, { schema })

async function verify() {
  console.log('Verifying admin user...')
  
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@mansour.sn'
  
  const user = await db.query.user.findFirst({
    where: (user, { eq }) => eq(user.email, adminEmail)
  })
  
  if (!user) {
    console.log('❌ Admin user not found')
    await client.end()
    return
  }
  
  // Check for associated account
  const accounts = await db.query.account.findMany({
    where: (account, { eq }) => eq(account.userId, user.id)
  })
  
  console.log('✅ Admin user verified:')
  console.log('   ID:', user.id)
  console.log('   Email:', user.email)
  console.log('   Name:', user.name)
  console.log('   Email Verified:', user.emailVerified)
  console.log('   Accounts:', accounts.length)
  accounts.forEach(acc => {
    console.log('     - Provider:', acc.providerId)
    console.log('       Has Password:', !!acc.password)
  })
  
  await client.end()
}

verify().catch((error) => {
  console.error(error)
  process.exit(1)
})
