import { z } from 'zod'
import { idSchema } from './id'

/**
 * Deal status enum
 */
export const dealStatusSchema = z.enum(['lead', 'negotiation', 'closed-won', 'closed-lost'])

export type DealStatus = z.infer<typeof dealStatusSchema>

/**
 * Deal schema for validation
 */
export const dealSchema = z.object({
  id: idSchema,
  vehicleId: idSchema,
  customerId: idSchema,
  salesPersonId: idSchema,
  status: dealStatusSchema,
  price: z.number().int().min(0),
  notes: z.string().nullable(),
  testDriveDate: z.date().nullable(),
  closedAt: z.date().nullable(),
  organizationId: idSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type Deal = z.infer<typeof dealSchema>

/**
 * Create deal input schema
 */
export const createDealSchema = dealSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

export type CreateDeal = z.infer<typeof createDealSchema>

/**
 * Update deal input schema
 */
export const updateDealSchema = createDealSchema.partial()

export type UpdateDeal = z.infer<typeof updateDealSchema>
