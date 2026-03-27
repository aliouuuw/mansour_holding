/**
 * Single schema file for drizzle-kit migrations
 * This file consolidates all schemas without cross-imports to avoid module resolution issues
 * 
 * Note: Auth tables use varchar IDs to support better-auth's nanoId format
 * Business tables (vehicles, customers, deals) use UUID for consistency
 */

import { pgTable, uuid, varchar, boolean, timestamp, text, integer, jsonb, pgEnum } from 'drizzle-orm/pg-core'

// =================== AUTH SCHEMA (better-auth) ===================
// Using varchar to support better-auth's nanoId format

export const user = pgTable('user', {
  id: varchar('id', { length: 36 }).primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  emailVerified: boolean('email_verified').notNull().default(false),
  image: text('image'),
  organizationId: varchar('organization_id', { length: 36 }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const session = pgTable('session', {
  id: varchar('id', { length: 36 }).primaryKey(),
  userId: varchar('user_id', { length: 36 })
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  token: varchar('token', { length: 255 }).notNull().unique(),
  expiresAt: timestamp('expires_at').notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const account = pgTable('account', {
  id: varchar('id', { length: 36 }).primaryKey(),
  userId: varchar('user_id', { length: 36 })
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accountId: text('account_id').notNull(),
  providerId: varchar('provider_id', { length: 255 }).notNull(),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  idToken: text('id_token'),
  password: text('password'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const verification = pgTable('verification', {
  id: varchar('id', { length: 36 }).primaryKey(),
  identifier: varchar('identifier', { length: 255 }).notNull(),
  value: varchar('value', { length: 255 }).notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

// =================== VEHICLES SCHEMA ===================

export const vehicleStatusEnum = pgEnum('vehicle_status', ['available', 'sold', 'reserved'])
export const fuelTypeEnum = pgEnum('fuel_type', ['gasoline', 'diesel', 'hybrid', 'electric'])
export const transmissionEnum = pgEnum('transmission', ['manual', 'automatic', 'cvt'])

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

// =================== CUSTOMERS SCHEMA ===================

export const customerSourceEnum = pgEnum('customer_source', ['walk-in', 'referral', 'online', 'phone'])

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

// =================== DEALS SCHEMA ===================

export const dealStatusEnum = pgEnum('deal_status', ['lead', 'negotiation', 'closed-won', 'closed-lost'])

export const deals = pgTable('deals', {
  id: uuid('id').primaryKey().defaultRandom(),
  vehicleId: uuid('vehicle_id')
    .notNull()
    .references(() => vehicles.id, { onDelete: 'cascade' }),
  customerId: uuid('customer_id')
    .notNull()
    .references(() => customers.id, { onDelete: 'cascade' }),
  salesPersonId: varchar('sales_person_id', { length: 36 })
    .notNull()
    .references(() => user.id),
  status: dealStatusEnum('status').notNull().default('lead'),
  price: integer('price').notNull(),
  notes: text('notes'),
  testDriveDate: timestamp('test_drive_date'),
  closedAt: timestamp('closed_at'),
  organizationId: uuid('organization_id'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})
