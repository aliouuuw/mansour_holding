'use client'

import { useState } from 'react'
import { Link } from '@/lib/router'
import { ViewIcon } from 'hugeicons-react'
import type { ApiVehicle, VehicleSortDir, VehicleSortField, VehicleStatus } from '@/lib/api'
import { dashVehicleStatusLabels } from '@/components/dashboard'
import { formatNumber, formatPrice, formatDate } from '@/lib/utils'
import { InventoryFieldCombobox } from './InventoryFieldCombobox'
import {
  inventoryDisplayValue,
  mergeInventoryOptions,
  useInventoryPatch,
  type InventoryPatchField,
  type InventorySuggestionField,
  type VehiclesQueryKey,
} from './useInventoryPatch'

const statusLabels = dashVehicleStatusLabels
const STATUSES: VehicleStatus[] = ['available', 'reserved', 'sold']

const EDITABLE_FIELDS: InventoryPatchField[] = ['make', 'model', 'year', 'mileage', 'price', 'vin', 'arrivedAt']

function SortHeader({
  label,
  field,
  sortBy,
  sortDir,
  onSort,
}: {
  label: string
  field: VehicleSortField
  sortBy: VehicleSortField
  sortDir: VehicleSortDir
  onSort: (field: VehicleSortField) => void
}) {
  const ariaSort = sortBy !== field ? 'none' : sortDir === 'asc' ? 'ascending' : 'descending'
  return (
    <button type="button" className="mm-th-sort" aria-sort={ariaSort} onClick={() => onSort(field)}>
      {label}
      <span className="mm-th-sort-icon" aria-hidden="true">
        {sortBy === field ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}
      </span>
    </button>
  )
}

function InventoryGridRow({
  vehicle,
  allVehicles,
  vehiclesQueryKey,
  suggestionMap,
  onOpenMedia,
}: {
  vehicle: ApiVehicle
  allVehicles: ApiVehicle[]
  vehiclesQueryKey: VehiclesQueryKey
  suggestionMap: Record<InventorySuggestionField, string[]>
  onOpenMedia: (vehicle: ApiVehicle) => void
}) {
  const { saveField, patchStatus, savingField } = useInventoryPatch(vehiclesQueryKey)
  const [edit, setEdit] = useState<{ field: InventoryPatchField; draft: string } | null>(null)
  const [fieldError, setFieldError] = useState<string | null>(null)

  const commitEdit = (draftOverride?: string) => {
    if (!edit) return
    const { field } = edit
    const draft = draftOverride ?? edit.draft
    const err = saveField(vehicle, field, draft, { silent: true })
    if (err) {
      setFieldError(err)
      return
    }
    setFieldError(null)
    setEdit(null)
  }

  const img = vehicle.images?.[0]

  const cellProps = (field: InventoryPatchField) => {
    const numeric = field === 'year' || field === 'mileage' || field === 'price'
    const display =
      field === 'mileage' ? `${formatNumber(vehicle.mileage)} km` :
      field === 'price' ? (vehicle.price === null ? '—' : formatPrice(vehicle.price)) :
      field === 'year' ? vehicle.year :
      field === 'vin' ? (vehicle.vin ? <span className="font-mono text-xs">{vehicle.vin}</span> : '—') :
      field === 'arrivedAt' ? formatDate(vehicle.arrivedAt) :
      vehicle[field]

    const suggestionKey = field as InventorySuggestionField

    return {
      field,
      vehicleId: vehicle.id,
      display,
      editing: edit?.field === field,
      draft: edit?.field === field ? edit.draft : '',
      saving: savingField === field,
      error: edit?.field === field ? fieldError : null,
      options: mergeInventoryOptions(suggestionMap[suggestionKey] ?? [], allVehicles, suggestionKey),
      inputType: 'text' as const,
      inputMode: numeric ? 'numeric' as const : 'text' as const,
      align: numeric || field === 'arrivedAt' ? 'right' as const : 'left' as const,
      onStart: () => {
        setFieldError(null)
        setEdit({ field, draft: inventoryDisplayValue(vehicle, field) })
      },
      onDraft: (v: string) => setEdit((e) => (e ? { ...e, draft: v } : null)),
      onCommit: (picked?: string) => commitEdit(picked),
      onCancel: () => {
        setEdit(null)
        setFieldError(null)
      },
    }
  }

  return (
    <tr className="mm-grid-row">
      <td className="mm-grid-cell-td mm-grid-cell-td--thumb">
        <button
          type="button"
          className="mm-grid-thumb-btn"
          onClick={() => onOpenMedia(vehicle)}
          aria-label={`Gérer les photos de ${vehicle.make} ${vehicle.model}`}
        >
          {img ? (
            <img src={img} alt="" className="mm-grid-thumb" loading="lazy" decoding="async" />
          ) : (
            <div className="mm-grid-thumb mm-grid-thumb--empty">+</div>
          )}
        </button>
      </td>
      {EDITABLE_FIELDS.slice(0, 5).map((field) => (
        <InventoryFieldCombobox key={field} {...cellProps(field)} />
      ))}
      <td className="mm-grid-cell-td">
        <select
          className="mm-grid-select"
          value={vehicle.status}
          aria-label={`Statut ${vehicle.make} ${vehicle.model}`}
          onChange={(e) => {
            const status = e.target.value as VehicleStatus
            if (status !== vehicle.status) patchStatus({ id: vehicle.id, patch: { status } })
          }}
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>{statusLabels[s]}</option>
          ))}
        </select>
      </td>
      <InventoryFieldCombobox {...cellProps('vin')} />
      <InventoryFieldCombobox {...cellProps('arrivedAt')} />
      <td className="mm-grid-cell-td mm-grid-cell-td--actions">
        <Link
          to="/dashboard/motors/inventory/$vehicleId"
          params={{ vehicleId: vehicle.id }}
          className="mm-link inline-flex items-center gap-1"
        >
          <ViewIcon className="h-3.5 w-3.5" aria-hidden="true" />
          <span className="sr-only">Fiche</span>
        </Link>
      </td>
    </tr>
  )
}

export function InventoryGrid({
  vehicles,
  vehiclesQueryKey,
  suggestionMap,
  sortBy,
  sortDir,
  onSort,
  onOpenMedia,
  isLoading,
}: {
  vehicles: ApiVehicle[]
  vehiclesQueryKey: VehiclesQueryKey
  suggestionMap: Record<InventorySuggestionField, string[]>
  sortBy: VehicleSortField
  sortDir: VehicleSortDir
  onSort: (field: VehicleSortField) => void
  onOpenMedia: (vehicle: ApiVehicle) => void
  isLoading: boolean
}) {
  const colCount = 10

  return (
    <div className="mm-grid-wrap">
      <p className="mm-grid-hint">
        Chaque cellule ouvre une liste de valeurs déjà utilisées. Tapez une nouvelle valeur pour l&apos;enregistrer dans la liste. Cliquez la vignette pour gérer les photos.
      </p>
      <div className="mm-grid-scroll">
        <table className="mm-grid-table">
          <thead>
            <tr>
              <th className="mm-grid-th mm-grid-th--thumb" scope="col" />
              <th className="mm-grid-th" scope="col">
                <SortHeader label="Marque" field="make" sortBy={sortBy} sortDir={sortDir} onSort={onSort} />
              </th>
              <th className="mm-grid-th" scope="col">Modèle</th>
              <th className="mm-grid-th mm-grid-th--num" scope="col">
                <SortHeader label="Année" field="year" sortBy={sortBy} sortDir={sortDir} onSort={onSort} />
              </th>
              <th className="mm-grid-th mm-grid-th--num" scope="col">
                <SortHeader label="Km" field="mileage" sortBy={sortBy} sortDir={sortDir} onSort={onSort} />
              </th>
              <th className="mm-grid-th mm-grid-th--num" scope="col">
                <SortHeader label="Prix" field="price" sortBy={sortBy} sortDir={sortDir} onSort={onSort} />
              </th>
              <th className="mm-grid-th" scope="col">Statut</th>
              <th className="mm-grid-th" scope="col">VIN</th>
              <th className="mm-grid-th mm-grid-th--num" scope="col">
                <SortHeader label="Arrivée" field="arrivedAt" sortBy={sortBy} sortDir={sortDir} onSort={onSort} />
              </th>
              <th className="mm-grid-th mm-grid-th--actions" scope="col" />
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={colCount} className="mm-grid-loading">
                  <div className="mm-spinner mx-auto" role="status" aria-label="Chargement" />
                </td>
              </tr>
            ) : (
              vehicles.map((v) => (
                <InventoryGridRow
                  key={v.id}
                  vehicle={v}
                  allVehicles={vehicles}
                  vehiclesQueryKey={vehiclesQueryKey}
                  suggestionMap={suggestionMap}
                  onOpenMedia={onOpenMedia}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
