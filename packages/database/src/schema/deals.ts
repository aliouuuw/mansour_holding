import { pgTable, uuid, integer, timestamp, text, pgEnum } from 'drizzle-orm/pg-core'
import { users } from './auth'
import { vehicles } from './vehicles'
import { customers } from './customers'

/**
 * Deal status enum
 */
export const dealStatusEnum = pgEnum('deal_status', ['lead', 'negotiation', 'closed-won', 'closed-lost'])

/**
 * Deals table (sales pipeline)
 */
export const deals = pgTable('deals', {
  id: uuid('id').primaryKey().defaultRandom(),
  vehicleId: uuid('vehicle_id')
    .notNull()
    .references(() => vehicles.id, { onDelete: 'cascade' }),
  customerId: uuid('customer_id')
    .notNull()
    .references(() => customers.id, { onDelete: 'cascade' }),
  salesPersonId: uuid('sales_person_id')
    .notNull()
    .references(() => users.id),
  status: dealStatusEnum('status').notNull().default('lead'),
  price: integer('price').notNull(),
  notes: text('notes'),
  testDriveDate: timestamp('test_drive_date'),
  closedAt: timestamp('closed_at'),
  organizationId: uuid('organization_id'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

// Types
export type Deal = typeof deals.$inferSelect
export type NewDeal = typeof deals.$inferInsert
