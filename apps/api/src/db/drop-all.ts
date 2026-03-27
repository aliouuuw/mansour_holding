import postgres from 'postgres'
import { config } from 'dotenv'

// Load environment variables from .env file
config({ path: '../../.env' })

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set')
}

const client = postgres(connectionString, { max: 1 })

async function dropAllTables() {
  console.log('Dropping all tables...')
  
  // Drop tables in order to avoid FK constraint issues
  await client`DROP TABLE IF EXISTS deals CASCADE`
  await client`DROP TABLE IF EXISTS vehicles CASCADE`
  await client`DROP TABLE IF EXISTS customers CASCADE`
  await client`DROP TABLE IF EXISTS account CASCADE`
  await client`DROP TABLE IF EXISTS session CASCADE`
  await client`DROP TABLE IF EXISTS verification CASCADE`
  await client`DROP TABLE IF EXISTS "user" CASCADE`
  
  console.log('All tables dropped successfully!')
  await client.end()
}

dropAllTables().catch((error) => {
  console.error('Failed to drop tables:', error)
  process.exit(1)
})
