'use server'

import { desc, sql } from 'drizzle-orm'
import { db } from './db/index'
import { inventoryFieldSuggestions, vehicles } from './db/schema'
import { requireUser } from './session'
import { iso } from './schemas'
import {
  INVENTORY_SUGGESTION_FIELDS,
  type InventorySuggestionField,
} from './inventory-suggestion-fields'

function mergeUnique(...lists: string[][]): string[] {
  const seen = new Set<string>()
  const out: string[] = []
  for (const list of lists) {
    for (const raw of list) {
      const v = raw.trim()
      if (!v || seen.has(v)) continue
      seen.add(v)
      out.push(v)
    }
  }
  return out
}

async function distinctVehicleStrings(
  column: 'make' | 'model' | 'year' | 'mileage' | 'price' | 'vin' | 'arrivedAt'
): Promise<string[]> {
  if (column === 'make') {
    const rows = await db.selectDistinct({ value: vehicles.make }).from(vehicles).limit(60)
    return rows.map((r) => r.value).sort((a, b) => a.localeCompare(b, 'fr'))
  }
  if (column === 'model') {
    const rows = await db.selectDistinct({ value: vehicles.model }).from(vehicles).limit(80)
    return rows.map((r) => r.value).sort((a, b) => a.localeCompare(b, 'fr'))
  }
  if (column === 'year') {
    const rows = await db.selectDistinct({ value: vehicles.year }).from(vehicles).orderBy(desc(vehicles.year)).limit(40)
    return rows.map((r) => String(r.value))
  }
  if (column === 'mileage') {
    const rows = await db.selectDistinct({ value: vehicles.mileage }).from(vehicles).limit(40)
    return rows.map((r) => String(r.value)).sort((a, b) => Number(b) - Number(a))
  }
  if (column === 'price') {
    const rows = await db
      .selectDistinct({ value: vehicles.price })
      .from(vehicles)
      .where(sql`${vehicles.price} is not null`)
      .limit(40)
    return rows.map((r) => String(r.value)).sort((a, b) => Number(b) - Number(a))
  }
  if (column === 'vin') {
    const rows = await db
      .selectDistinct({ value: vehicles.vin })
      .from(vehicles)
      .where(sql`${vehicles.vin} is not null`)
      .limit(30)
    return rows.map((r) => r.value!).filter(Boolean)
  }
  const rows = await db.selectDistinct({ value: vehicles.arrivedAt }).from(vehicles).limit(40)
  return rows
    .map((r) => iso(r.value)?.slice(0, 10) ?? '')
    .filter(Boolean)
    .sort()
    .reverse()
}

export async function listInventorySuggestionMap(): Promise<Record<InventorySuggestionField, string[]>> {
  await requireUser()

  const stored = await db
    .select()
    .from(inventoryFieldSuggestions)
    .orderBy(desc(inventoryFieldSuggestions.useCount), desc(inventoryFieldSuggestions.lastUsedAt))

  const byField: Record<string, string[]> = {}
  for (const row of stored) {
    if (!INVENTORY_SUGGESTION_FIELDS.includes(row.field as InventorySuggestionField)) continue
    const key = row.field as InventorySuggestionField
    if (!byField[key]) byField[key] = []
    byField[key].push(row.value)
  }

  const out = {} as Record<InventorySuggestionField, string[]>
  for (const field of INVENTORY_SUGGESTION_FIELDS) {
    const fromFleet = await distinctVehicleStrings(field)
    out[field] = mergeUnique(byField[field] ?? [], fromFleet).slice(0, 200)
  }
  return out
}

export async function rememberInventoryFieldValue(field: InventorySuggestionField, value: string) {
  await requireUser()
  const trimmed = value.trim()
  if (!trimmed) return

  await db
    .insert(inventoryFieldSuggestions)
    .values({ field, value: trimmed, useCount: 1, lastUsedAt: new Date() })
    .onConflictDoUpdate({
      target: [inventoryFieldSuggestions.field, inventoryFieldSuggestions.value],
      set: {
        useCount: sql`${inventoryFieldSuggestions.useCount} + 1`,
        lastUsedAt: new Date(),
      },
    })
}

export async function rememberInventoryPatch(patch: Record<string, unknown>) {
  const tasks: Promise<void>[] = []
  if (typeof patch.make === 'string') tasks.push(rememberInventoryFieldValue('make', patch.make))
  if (typeof patch.model === 'string') tasks.push(rememberInventoryFieldValue('model', patch.model))
  if (typeof patch.year === 'number') tasks.push(rememberInventoryFieldValue('year', String(patch.year)))
  if (typeof patch.mileage === 'number') tasks.push(rememberInventoryFieldValue('mileage', String(patch.mileage)))
  if (typeof patch.price === 'number') tasks.push(rememberInventoryFieldValue('price', String(patch.price)))
  if (typeof patch.vin === 'string') tasks.push(rememberInventoryFieldValue('vin', patch.vin))
  if (patch.arrivedAt instanceof Date) {
    tasks.push(rememberInventoryFieldValue('arrivedAt', patch.arrivedAt.toISOString().slice(0, 10)))
  }
  await Promise.all(tasks)
}
