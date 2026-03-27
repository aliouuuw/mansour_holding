import { config } from 'dotenv'
import { eq } from 'drizzle-orm'
import { auth } from '../auth'
import { db } from './index'
import * as schema from './schema-for-migrations'

// Load environment variables from .env file
config({ path: '../../.env' })

async function seed() {
  console.log('Starting database seed...')
  
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@mansour.sn'
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123456'
  const adminName = process.env.ADMIN_NAME || 'Admin User'
  
  try {
    // Check if admin user already exists
    const [existingUser] = await db
      .select({ id: schema.user.id, email: schema.user.email })
      .from(schema.user)
      .where(eq(schema.user.email, adminEmail))
      .limit(1)
    
    if (existingUser) {
      console.log(`Removing existing admin user so credentials can be recreated safely: ${adminEmail}`)

      await db.delete(schema.account).where(eq(schema.account.userId, existingUser.id))
      await db.delete(schema.session).where(eq(schema.session.userId, existingUser.id))
      await db.delete(schema.user).where(eq(schema.user.id, existingUser.id))
    }
    
    console.log(`Creating admin user: ${adminEmail}`)
    await auth.api.signUpEmail({
      body: {
        email: adminEmail,
        password: adminPassword,
        name: adminName,
      },
    })
    
    console.log('✅ Admin user created successfully!')
    console.log(`   Email: ${adminEmail}`)
    console.log(`   Password: ${adminPassword}`)
  } catch (error) {
    console.error('❌ Seed failed:', error)
    throw error
  }
}

seed().catch((error) => {
  console.error(error)
  process.exit(1)
})
