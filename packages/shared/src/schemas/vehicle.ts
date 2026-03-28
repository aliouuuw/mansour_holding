import { z } from 'zod'
import { idSchema } from './id'

/**
 * Vehicle status enum
 */
export const vehicleStatusSchema = z.enum(['available', 'sold', 'reserved'])

export type VehicleStatus = z.infer<typeof vehicleStatusSchema>

/**
 * Fuel type enum
 */
export const fuelTypeSchema = z.enum(['gasoline', 'diesel', 'hybrid', 'electric'])

export type FuelType = z.infer<typeof fuelTypeSchema>

/**
 * Transmission type enum
 */
export const transmissionSchema = z.enum(['manual', 'automatic', 'cvt'])

export type Transmission = z.infer<typeof transmissionSchema>

/**
 * Vehicle schema for validation
 */
export const vehicleSchema = z.object({
  id: idSchema,
  make: z.string().min(1).max(100),
  model: z.string().min(1).max(100),
  year: z.number().int().min(1900).max(2100),
  mileage: z.number().int().min(0),
  price: z.number().int().min(0),
  status: vehicleStatusSchema,
  fuelType: fuelTypeSchema,
  transmission: transmissionSchema,
  color: z.string().min(1).max(50),
  vin: z.string().min(17).max(17).nullable(),
  description: z.string().nullable(),
  images: z.array(z.string().url()),
  extras: z.record(z.string()).optional(),
  organizationId: idSchema.nullable(),
  createdBy: idSchema.nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type Vehicle = z.infer<typeof vehicleSchema>

/**
 * Create vehicle input schema (createdBy is set server-side from session)
 */
export const createVehicleSchema = vehicleSchema.omit({
  id: true,
  createdBy: true,
  createdAt: true,
  updatedAt: true,
})

export type CreateVehicle = z.infer<typeof createVehicleSchema>

/**
 * Update vehicle input schema
 */
export const updateVehicleSchema = createVehicleSchema.partial()

export type UpdateVehicle = z.infer<typeof updateVehicleSchema>
