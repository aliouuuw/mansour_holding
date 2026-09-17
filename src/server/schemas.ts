import { z } from 'zod'

const idSchema = z.string().uuid()

export function parseBody<T>(schema: z.ZodType<T>, data: unknown): T {
  const result = schema.safeParse(data)
  if (!result.success) throw new Error('Validation failed')
  return result.data
}

export function iso(value: Date | string | null | undefined): string | null {
  if (!value) return null
  return new Date(value).toISOString()
}

export const createVehicleSchema = z.object({
  make: z.string().min(1).max(100),
  model: z.string().min(1).max(100),
  year: z.number().int().min(1900).max(2100),
  mileage: z.number().int().min(0),
  price: z.number().int().min(0),
  status: z.enum(['available', 'sold', 'reserved']),
  fuelType: z.enum(['gasoline', 'diesel', 'hybrid', 'electric']),
  transmission: z.enum(['manual', 'automatic', 'cvt']),
  color: z.string().min(1).max(50),
  vin: z.string().min(17).max(17).nullable(),
  description: z.string().nullable(),
  images: z.array(z.string().url()),
  extras: z.record(z.string()).optional(),
  organizationId: idSchema.optional().nullable(),
})

export const updateVehicleSchema = createVehicleSchema.partial()

export const createCustomerSchema = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  email: z.string().email(),
  phone: z.string().min(8).max(20),
  address: z.string().nullable(),
  notes: z.string().nullable(),
  source: z.enum(['walk-in', 'referral', 'online', 'phone']),
  organizationId: idSchema.optional().nullable(),
})

export const updateCustomerSchema = createCustomerSchema.partial()

export const createDealSchema = z.object({
  vehicleId: idSchema,
  customerId: idSchema,
  status: z.enum(['lead', 'negotiation', 'closed-won', 'closed-lost']),
  price: z.number().int().min(0),
  notes: z.string().nullable(),
  testDriveDate: z.date().nullable(),
  closedAt: z.date().nullable(),
  organizationId: idSchema.optional().nullable(),
})

export const updateDealSchema = createDealSchema.partial()
