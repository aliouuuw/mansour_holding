import { config } from 'dotenv'
import { defineConfig } from 'drizzle-kit'

// Load environment variables from .env file
config({ path: '../../.env' })

export default defineConfig({
  schema: './src/db/schema-for-migrations.ts',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL || 'postgres://localhost:5432/mansour_holding',
  },
  verbose: true,
  strict: true,
})
