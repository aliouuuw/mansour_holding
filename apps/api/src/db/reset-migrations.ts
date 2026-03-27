import postgres from 'postgres'
import { config } from 'dotenv'

// Load environment variables from .env file
config({ path: '../../.env' })

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set')
}

const client = postgres(connectionString, { max: 1 })

async function resetMigrations() {
  console.log('Resetting drizzle migrations tracking...')
  
  // Clear all entries from drizzle migrations table
  await client`DELETE FROM "__drizzle_migrations"`
  
  console.log('Migration tracking reset successfully!')
  await client.end()
}

resetMigrations().catch((error) => {
  console.error('Failed to reset migrations:', error)
  process.exit(1)
})
