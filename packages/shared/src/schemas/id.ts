import { z } from 'zod'

/**
 * Generic ID schema for validation
 */
export const idSchema = z.string().uuid()

export type Id = z.infer<typeof idSchema>
