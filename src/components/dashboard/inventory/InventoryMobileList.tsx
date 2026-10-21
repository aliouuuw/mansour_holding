'use client'

import { useState } from 'react'
import { Link } from '@/lib/router'
import { dashVehicleStatusLabels, DashStatus } from '@/components/dashboard'
import type { ApiVehicle, VehicleStatus } from '@/lib/api'
import { formatDate, formatNumber, formatPrice } from '@/lib/utils'
import type { VehiclesQueryKey } from './useInventoryPatch'
import { useInventoryPatch } from './useInventoryPatch'

const statusLabels = dashVehicleStatusLabels
const STATUSES: VehicleStatus[] = ['available', 'reserved', 'sold']

export function InventoryMobileList({
  vehicles,
  vehiclesQueryKey,
  isLoading,
}: {
  vehicles: ApiVehicle[]
  vehiclesQueryKey: VehiclesQueryKey
  isLoading: boolean
}) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="mm-spinner" role="status" aria-label="Chargement" />
      </div>
    )
  }
  return (
    <div className="mm-inventory-cards">
      {vehicles.map((v) => (
        <MobileVehicleCard key={v.id} vehicle={v} vehiclesQueryKey={vehiclesQueryKey} />
      ))}
    </div>
  )
}

function MobileVehicleCard({ vehicle, vehiclesQueryKey }: { vehicle: ApiVehicle; vehiclesQueryKey: VehiclesQueryKey }) {
  /* one save state per card: saving one price must not lock the field you tap next */
  const { saveField, patchStatus, isPending: disabled } = useInventoryPatch(vehiclesQueryKey)
  const saved = vehicle.price === null ? '' : String(vehicle.price)
  const [priceDraft, setPriceDraft] = useState(saved)
  const [seenPrice, setSeenPrice] = useState(saved)
  if (seenPrice !== saved) {
    setSeenPrice(saved)
    setPriceDraft(saved)
  }

  const img = vehicle.images?.[0]

  return (
    <article className="mm-inventory-card mm-inventory-card--edit">
      {img ? (
        <img src={img} alt="" className="h-16 w-20 shrink-0 rounded-[var(--mm-r)] object-cover" loading="lazy" decoding="async" />
      ) : (
        <div className="flex h-16 w-20 shrink-0 items-center justify-center rounded-[var(--mm-r)] bg-[var(--mm-off)] text-xs text-[var(--mm-grey-muted)]">—</div>
      )}
      <div className="min-w-0 flex-1 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <Link
              to="/dashboard/motors/inventory/$vehicleId"
              params={{ vehicleId: vehicle.id }}
              className="mm-link block truncate font-medium"
            >
              {vehicle.make} {vehicle.model}
            </Link>
            <p className="text-xs mm-muted">{vehicle.year} · {formatNumber(vehicle.mileage)} km · {formatDate(vehicle.arrivedAt)}</p>
          </div>
          <DashStatus status={vehicle.status} />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <label className="flex min-w-0 flex-1 items-center gap-2 text-xs mm-muted">
            Prix
            <input
              type="text"
              inputMode="numeric"
              className="mm-grid-input mm-grid-input--compact flex-1"
              value={priceDraft}
              disabled={disabled}
              onChange={(e) => setPriceDraft(e.target.value)}
              onBlur={() => saveField(vehicle, 'price', priceDraft)}
            />
          </label>
          <select
            className="mm-grid-select mm-grid-select--compact"
            value={vehicle.status}
            disabled={disabled}
            aria-label="Statut"
            onChange={(e) => {
              const status = e.target.value as VehicleStatus
              if (status !== vehicle.status) patchStatus({ id: vehicle.id, patch: { status } })
            }}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>{statusLabels[s]}</option>
            ))}
          </select>
        </div>
      </div>
    </article>
  )
}
