import { z } from 'zod'
import { idSchema } from './id'

/**
 * User role enum
 */
export const userRoleSchema = z.enum(['admin', 'manager', 'salesperson'])

export type UserRole = z.infer<typeof userRoleSchema>

/**
 * User schema for validation
 */
export const userSchema = z.object({
  id: idSchema,
  email: z.string().email(),
  name: z.string().min(1).max(255),
  emailVerified: z.boolean(),
  image: z.string().url().nullable(),
  role: userRoleSchema.default('salesperson'),
  organizationId: idSchema.nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type User = z.infer<typeof userSchema>

/**
 * Create user input schema
 */
export const createUserSchema = userSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

export type CreateUser = z.infer<typeof createUserSchema>

/**
 * Update user input schema
 */
export const updateUserSchema = createUserSchema.partial()

export type UpdateUser = z.infer<typeof updateUserSchema>
