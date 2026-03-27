import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { config } from 'dotenv'
import bcrypt from 'bcrypt'
import * as schema from './schema-for-migrations'

// Load environment variables from .env file
config({ path: '../../.env' })

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set')
}

// Disable prefetch as it is not supported for "Transaction" pool mode
const client = postgres(connectionString, { prepare: false })
const db = drizzle(client, { schema })

// Generate a nanoId-like ID (better-auth uses 21 char nanoId, we use 36 for UUID-like)
function generateId() {
  return crypto.randomUUID()
}

async function seed() {
  console.log('Starting database seed...')
  
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@mansour.sn'
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123456'
  const adminName = process.env.ADMIN_NAME || 'Admin User'
  
  try {
    // Check if admin user already exists
    const existingUser = await db.query.user.findFirst({
      where: (user, { eq }) => eq(user.email, adminEmail)
    })
    
    if (existingUser) {
      console.log(`Admin user already exists: ${adminEmail}`)
      await client.end()
      return
    }
    
    console.log(`Creating admin user: ${adminEmail}`)
    
    // Generate IDs
    const userId = generateId()
    const accountId = generateId()
    
    // Hash password with bcrypt
    const hashedPassword = await bcrypt.hash(adminPassword, 10)
    
    // Create admin user directly with Drizzle
    await db.insert(schema.user).values({
      id: userId,
      email: adminEmail,
      name: adminName,
      emailVerified: true,
    })
    
    // Create account with password for email/password auth
    await db.insert(schema.account).values({
      id: accountId,
      userId: userId,
      accountId: adminEmail,
      providerId: 'credential',
      password: hashedPassword,
    })
    
    console.log('✅ Admin user created successfully!')
    console.log(`   Email: ${adminEmail}`)
    console.log(`   Password: ${adminPassword}`)
  } catch (error) {
    console.error('❌ Seed failed:', error)
    throw error
  } finally {
    await client.end()
  }
}

seed().catch((error) => {
  console.error(error)
  process.exit(1)
})
