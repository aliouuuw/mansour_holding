import { pgTable, uuid, varchar, timestamp, text, pgEnum } from 'drizzle-orm/pg-core'

/**
 * Customer source enum
 */
export const customerSourceEnum = pgEnum('customer_source', ['walk-in', 'referral', 'online', 'phone'])

/**
 * Customers table
 */
export const customers = pgTable('customers', {
  id: uuid('id').primaryKey().defaultRandom(),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 20 }).notNull(),
  address: text('address'),
  notes: text('notes'),
  source: customerSourceEnum('source').notNull(),
  organizationId: uuid('organization_id'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

// Types
export type Customer = typeof customers.$inferSelect
export type NewCustomer = typeof customers.$inferInsert
