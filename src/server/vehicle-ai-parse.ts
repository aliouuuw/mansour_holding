import { z } from 'zod'
import type { FuelType, Transmission } from './vehicles'

const fuelTypeSchema = z.enum(['gasoline', 'diesel', 'hybrid', 'electric'])
const transmissionSchema = z.enum(['manual', 'automatic', 'cvt'])

export const vehicleSuggestSchema = z.object({
  make: z.string().min(1).optional(),
  model: z.string().min(1).optional(),
  year: z.number().int().min(1980).max(new Date().getFullYear() + 2).optional(),
  fuelType: fuelTypeSchema.optional(),
  transmission: transmissionSchema.optional(),
  extras: z.record(z.string(), z.string()).optional(),
})

export type VehicleSuggestPayload = z.infer<typeof vehicleSuggestSchema>

export const vehicleDescriptionSchema = z.object({
  description: z.string().min(1).max(2000),
})

/** Strip markdown fences and parse JSON from an LLM reply. */
export function parseJsonFromLlm(text: string): unknown {
  let s = text.trim()
  const fence = /^```(?:json)?\s*\n?([\s\S]*?)\n?```$/i.exec(s)
  if (fence) s = fence[1]!.trim()
  const start = s.indexOf('{')
  const end = s.lastIndexOf('}')
  if (start >= 0 && end > start) s = s.slice(start, end + 1)
  return JSON.parse(s) as unknown
}

export function normalizeSuggestPayload(raw: unknown): VehicleSuggestPayload {
  const parsed = vehicleSuggestSchema.parse(raw)
  const extras = parsed.extras ?? {}
  const cleaned: Record<string, string> = {}
  for (const [k, v] of Object.entries(extras)) {
    const key = k.trim()
    const val = v.trim()
    if (key && val) cleaned[key] = val
  }
  return { ...parsed, extras: Object.keys(cleaned).length ? cleaned : undefined }
}

export type VehicleDescriptionFacts = {
  make: string
  model: string
  year: number
  mileage: number
  fuelType: FuelType
  transmission: Transmission
  color?: string | null
  extras: Record<string, string>
}

const PHOTO_KEYS = new Set(['face', 'pos', 'cover', 'source'])

export function featureExtrasForPrompt(extras: Record<string, string>) {
  return Object.fromEntries(
    Object.entries(extras).filter(([k]) => !PHOTO_KEYS.has(k)),
  )
}
