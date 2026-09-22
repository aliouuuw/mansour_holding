'use client'

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { arrivedAtFromForm, arrivedAtToForm } from '@/components/motors/VehicleForm'
import {
  vehiclesApi,
  invalidateMotorsQueries,
  type ApiVehicle,
  type VehicleListResponse,
  type VehicleStatus,
} from '@/lib/api'
import { useToast } from '@/components/ui/Toast'

export type InventoryPatchField =
  | 'make'
  | 'model'
  | 'year'
  | 'mileage'
  | 'price'
  | 'status'
  | 'vin'
  | 'arrivedAt'

export type InventorySuggestionField = Exclude<InventoryPatchField, 'status'>

const PREFIX_FILTER_FIELDS = new Set<InventoryPatchField>([
  'year',
  'mileage',
  'price',
  'vin',
  'arrivedAt',
])

export function mergeInventoryOptions(
  serverOptions: string[],
  vehicles: ApiVehicle[],
  field: InventorySuggestionField
): string[] {
  const seen = new Set<string>()
  const out: string[] = []
  const add = (raw: string) => {
    const v = raw.trim()
    if (!v || seen.has(v)) return
    seen.add(v)
    out.push(v)
  }
  for (const o of serverOptions) add(o)
  for (const v of vehicles) {
    add(inventoryDisplayValue(v, field))
  }
  return out
}

/** Filter dropdown options while typing (prefix for numbers/dates, contains for text). */
export function filterComboboxOptions(
  field: InventoryPatchField,
  options: string[],
  query: string,
  max = 25
): string[] {
  const q = query.trim()
  if (!q) return options.slice(0, max)

  const qLower = q.toLowerCase()
  const usePrefix = PREFIX_FILTER_FIELDS.has(field)

  const matched = options.filter((o) => {
    const ol = o.toLowerCase()
    return usePrefix ? ol.startsWith(qLower) : ol.includes(qLower)
  })

  matched.sort((a, b) => a.localeCompare(b, 'fr', { numeric: true }))
  return matched.slice(0, max)
}

export type InventoryPatchBody = Partial<{
  make: string
  model: string
  year: number
  mileage: number
  price: number | null
  status: VehicleStatus
  vin: string | null
  arrivedAt: Date
}>

export function inventoryDisplayValue(vehicle: ApiVehicle, field: InventoryPatchField): string {
  switch (field) {
    case 'make':
      return vehicle.make
    case 'model':
      return vehicle.model
    case 'year':
      return String(vehicle.year)
    case 'mileage':
      return String(vehicle.mileage)
    case 'price':
      return vehicle.price === null ? '' : String(vehicle.price)
    case 'status':
      return vehicle.status
    case 'vin':
      return vehicle.vin ?? ''
    case 'arrivedAt':
      return arrivedAtToForm(vehicle.arrivedAt)
    default:
      return ''
  }
}

export function parseInventoryPatch(field: InventoryPatchField, raw: string): InventoryPatchBody {
  switch (field) {
    case 'make':
    case 'model':
      return { [field]: raw.trim() }
    case 'year':
      return { year: Number.parseInt(raw, 10) }
    case 'mileage':
      return { mileage: Number.parseInt(raw.replace(/\s/g, ''), 10) }
    case 'price': {
      const t = raw.trim()
      if (!t) return { price: null }
      const n = Number.parseInt(t.replace(/\s/g, ''), 10)
      return { price: Number.isFinite(n) ? n : null }
    }
    case 'status':
      return { status: raw as VehicleStatus }
    case 'vin': {
      const v = raw.trim()
      return { vin: v.length === 0 ? null : v }
    }
    case 'arrivedAt':
      return { arrivedAt: arrivedAtFromForm(raw) }
    default:
      return {}
  }
}

function applyPatchToVehicle(v: ApiVehicle, patch: InventoryPatchBody): ApiVehicle {
  const { arrivedAt, ...rest } = patch
  const next: ApiVehicle = { ...v, ...rest }
  if (arrivedAt) next.arrivedAt = arrivedAt.toISOString()
  return next
}

export function validateInventoryPatch(
  field: InventoryPatchField,
  patch: InventoryPatchBody
): string | null {
  if (field === 'vin' && patch.vin !== null && patch.vin !== undefined && patch.vin.length !== 17) {
    return 'Le VIN doit contenir 17 caractères.'
  }
  if ((field === 'make' || field === 'model') && (!patch[field] || patch[field]!.length === 0)) {
    return 'Champ requis.'
  }
  if (field === 'year' && (patch.year! < 1900 || patch.year! > 2100)) {
    return 'Année invalide.'
  }
  if (field === 'mileage' && patch.mileage! < 0) {
    return 'Kilométrage invalide.'
  }
  if (field === 'price' && patch.price !== null && patch.price !== undefined && patch.price < 0) {
    return 'Prix invalide.'
  }
  return null
}

export type VehiclesQueryKey = (string | number)[]

export function useInventoryPatch(vehiclesQueryKey: VehiclesQueryKey) {
  const qc = useQueryClient()
  const toast = useToast()
  const [savingField, setSavingField] = useState<InventoryPatchField | null>(null)

  const mutation = useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: InventoryPatchBody }) =>
      vehiclesApi.update(id, patch),
    onMutate: async ({ id, patch }) => {
      setSavingField(Object.keys(patch)[0] as InventoryPatchField)
      await qc.cancelQueries({ queryKey: vehiclesQueryKey })
      const prev = qc.getQueryData<VehicleListResponse>(vehiclesQueryKey)
      if (prev) {
        qc.setQueryData(vehiclesQueryKey, {
          ...prev,
          data: prev.data.map((v) => (v.id === id ? applyPatchToVehicle(v, patch) : v)),
        })
      }
      return { prev }
    },
    onError: (err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(vehiclesQueryKey, ctx.prev)
      toast(err instanceof Error ? err.message : 'Enregistrement impossible', 'error')
    },
    onSuccess: () => {
      invalidateMotorsQueries(qc)
    },
    onSettled: () => {
      setSavingField(null)
    },
  })

  const saveField = (
    vehicle: ApiVehicle,
    field: InventoryPatchField,
    raw: string,
    opts?: { silent?: boolean }
  ): string | null => {
    const current = inventoryDisplayValue(vehicle, field)
    if (raw === current || (field === 'price' && raw === '' && vehicle.price === null)) return null
    const patch = parseInventoryPatch(field, raw)
    const validation = validateInventoryPatch(field, patch)
    if (validation) {
      if (!opts?.silent) toast(validation, 'error')
      return validation
    }
    mutation.mutate({ id: vehicle.id, patch })
    return null
  }

  return { saveField, patchStatus: mutation.mutate, savingField, isPending: mutation.isPending }
}
