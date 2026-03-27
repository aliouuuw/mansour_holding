import { drizzle } from 'drizzle-orm/postgres-js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import postgres from 'postgres'
import { config } from 'dotenv'

// Load environment variables from .env file
config({ path: '../../.env' })

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set')
}

const migrationClient = postgres(connectionString, { max: 1 })

async function runMigrations() {
  console.log('Running migrations...')
  
  const db = drizzle(migrationClient)
  await migrate(db, { migrationsFolder: './drizzle' })
  
  console.log('Migrations completed!')
  await migrationClient.end()
}

runMigrations().catch((error) => {
  console.error('Migration failed:', error)
  process.exit(1)
})
