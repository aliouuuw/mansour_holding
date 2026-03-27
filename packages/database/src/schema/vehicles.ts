import { pgTable, uuid, varchar, integer, timestamp, jsonb, text, pgEnum } from 'drizzle-orm/pg-core'
import { user } from './auth'

/**
 * Vehicle status enum
 */
export const vehicleStatusEnum = pgEnum('vehicle_status', ['available', 'sold', 'reserved'])

/**
 * Fuel type enum
 */
export const fuelTypeEnum = pgEnum('fuel_type', ['gasoline', 'diesel', 'hybrid', 'electric'])

/**
 * Transmission type enum
 */
export const transmissionEnum = pgEnum('transmission', ['manual', 'automatic', 'cvt'])

/**
 * Vehicles table
 */
export const vehicles = pgTable('vehicles', {
  id: uuid('id').primaryKey().defaultRandom(),
  make: varchar('make', { length: 100 }).notNull(),
  model: varchar('model', { length: 100 }).notNull(),
  year: integer('year').notNull(),
  mileage: integer('mileage').notNull(),
  price: integer('price').notNull(),
  status: vehicleStatusEnum('status').notNull().default('available'),
  fuelType: fuelTypeEnum('fuel_type').notNull(),
  transmission: transmissionEnum('transmission').notNull(),
  color: varchar('color', { length: 50 }).notNull(),
  vin: varchar('vin', { length: 17 }),
  description: text('description'),
  images: jsonb('images').$type<string[]>().notNull().default([]),
  organizationId: uuid('organization_id'),
  createdBy: varchar('created_by', { length: 36 }).references(() => user.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

// Types
export type Vehicle = typeof vehicles.$inferSelect
export type NewVehicle = typeof vehicles.$inferInsert
