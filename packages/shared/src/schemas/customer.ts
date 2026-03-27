import { z } from 'zod'
import { idSchema } from './id'

/**
 * Customer source enum
 */
export const customerSourceSchema = z.enum(['walk-in', 'referral', 'online', 'phone'])

export type CustomerSource = z.infer<typeof customerSourceSchema>

/**
 * Customer schema for validation
 */
export const customerSchema = z.object({
  id: idSchema,
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  email: z.string().email(),
  phone: z.string().min(8).max(20),
  address: z.string().nullable(),
  notes: z.string().nullable(),
  source: customerSourceSchema,
  organizationId: idSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type Customer = z.infer<typeof customerSchema>

/**
 * Create customer input schema
 */
export const createCustomerSchema = customerSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

export type CreateCustomer = z.infer<typeof createCustomerSchema>

/**
 * Update customer input schema
 */
export const updateCustomerSchema = createCustomerSchema.partial()

export type UpdateCustomer = z.infer<typeof updateCustomerSchema>
