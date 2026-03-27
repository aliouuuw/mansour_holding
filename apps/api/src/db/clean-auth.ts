import postgres from 'postgres'
import { config } from 'dotenv'

// Load environment variables from .env file
config({ path: '../../.env' })

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set')
}

const client = postgres(connectionString, { max: 1 })

async function cleanAuthTables() {
  console.log('Dropping auth tables to recreate with correct schema...')
  
  // Drop in correct order to avoid FK constraint issues
  await client`DROP TABLE IF EXISTS account CASCADE`
  await client`DROP TABLE IF EXISTS session CASCADE`
  await client`DROP TABLE IF EXISTS verification CASCADE`
  await client`DROP TABLE IF EXISTS "user" CASCADE`
  
  // Reset drizzle migrations to start fresh
  await client`DELETE FROM "__drizzle_migrations" WHERE id IN (
    SELECT id FROM "__drizzle_migrations" 
    WHERE migration_name LIKE '%0000_%' OR migration_name LIKE '%0001_%'
  )`
  
  console.log('Auth tables dropped successfully!')
  await client.end()
}

cleanAuthTables().catch((error) => {
  console.error('Failed to clean auth tables:', error)
  process.exit(1)
})
