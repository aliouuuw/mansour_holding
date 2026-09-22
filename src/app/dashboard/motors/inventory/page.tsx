'use client'

import { Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from '@/lib/router'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { motion, useReducedMotion } from 'framer-motion'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Search01Icon, Add01Icon, ViewIcon, Download01Icon } from 'hugeicons-react'
import { downloadCsv } from '@/lib/csv'
import { useToast } from '@/components/ui/Toast'
import { formatPrice, formatNumber, formatDate } from '@/lib/utils'
import {
  DashBreadcrumbs,
  DashButton,
  DashPageHeader,
  DashStatus,
  dashVehicleStatusLabels,
} from '@/components/dashboard'
import {
  overviewApi,
  vehiclesApi,
  type ApiVehicle,
  type VehicleSortDir,
  type VehicleSortField,
  type VehicleStatus,
} from '@/lib/api'
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'

const statusLabels = dashVehicleStatusLabels
const columnHelper = createColumnHelper<ApiVehicle>()

function parseStatus(raw: string | null): VehicleStatus | 'all' {
  if (raw === 'available' || raw === 'reserved' || raw === 'sold') return raw
  return 'all'
}

const SORT_FIELDS: VehicleSortField[] = ['make', 'year', 'mileage', 'price', 'arrivedAt']

function parseSortBy(raw: string | null): VehicleSortField {
  if (raw && SORT_FIELDS.includes(raw as VehicleSortField)) return raw as VehicleSortField
  return 'arrivedAt'
}

function parseSortDir(raw: string | null): VehicleSortDir {
  return raw === 'asc' ? 'asc' : 'desc'
}

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

export function MotorsInventory() {
  const navigate = useNavigate()
  const reduceMotion = useReducedMotion()
  const toast = useToast()
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const queryQ = searchParams.get('q') ?? ''
  const statusFilter = parseStatus(searchParams.get('status'))
  const page = Math.max(1, Number.parseInt(searchParams.get('page') ?? '1', 10) || 1)
  const sortBy = parseSortBy(searchParams.get('sort'))
  const sortDir = parseSortDir(searchParams.get('dir'))

  const [searchInput, setSearchInput] = useState(queryQ)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setSearchInput(queryQ)
  }, [queryQ])

  const patchParams = useCallback(
    (patch: Record<string, string | null>) => {
      const next = new URLSearchParams(searchParams.toString())
      for (const [key, value] of Object.entries(patch)) {
        if (value === null || value === '') next.delete(key)
        else next.set(key, value)
      }
      const qs = next.toString()
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
    },
    [pathname, router, searchParams]
  )

  const toggleSort = (field: VehicleSortField) => {
    if (sortBy === field) {
      patchParams({ dir: sortDir === 'asc' ? 'desc' : 'asc', page: null })
      return
    }
    patchParams({
      sort: field === 'arrivedAt' ? null : field,
      dir: field === 'make' ? 'asc' : 'desc',
      page: null,
    })
  }

  const handleSearch = (val: string) => {
    setSearchInput(val)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      patchParams({ q: val.trim() || null, page: null })
    }, 300)
  }

  const { data: overview } = useQuery({
    queryKey: ['overview', 'motors'],
    queryFn: overviewApi.motors,
    staleTime: 60_000,
  })

  const { data, isLoading, error } = useQuery({
    queryKey: ['vehicles', page, statusFilter, queryQ, sortBy, sortDir],
    queryFn: () => vehiclesApi.list({
      page, limit: 20,
      sortBy,
      sortDir,
      ...(statusFilter !== 'all' ? { status: statusFilter } : {}),
      ...(queryQ ? { search: queryQ } : {}),
    }),
    placeholderData: (prev) => prev,
  })

  const vehicles = data?.data ?? []
  const pagination = data?.pagination ?? { total: 0, pages: 1 }

  const columns = [
    columnHelper.display({
      id: 'image',
      header: '',
      cell: (info) => {
        const img = info.row.original.images?.[0]
        return img
          ? <img src={img} alt="" className="h-14 w-20 rounded-[var(--mm-r)] object-cover" loading="lazy" decoding="async" />
          : <div className="flex h-14 w-20 items-center justify-center rounded-[var(--mm-r)] bg-[var(--mm-off)] text-xs text-[var(--mm-grey-muted)]">—</div>
      },
      size: 90,
    }),
    columnHelper.accessor((row) => `${row.make} ${row.model}`, {
      id: 'name',
      header: () => <SortHeader label="Véhicule" field="make" sortBy={sortBy} sortDir={sortDir} onSort={toggleSort} />,
      cell: (info) => (
        <div>
          <p className="font-medium text-[var(--mm-ink)]">{info.getValue()}</p>
          {info.row.original.vin && <p className="font-mono text-xs text-[var(--mm-grey)]">{info.row.original.vin}</p>}
        </div>
      ),
    }),
    columnHelper.accessor('year', {
      header: () => <SortHeader label="Année" field="year" sortBy={sortBy} sortDir={sortDir} onSort={toggleSort} />,
      meta: { narrow: true },
      cell: (info) => <span className="text-sm tabular-nums">{info.getValue()}</span>,
    }),
    columnHelper.accessor('mileage', {
      header: () => <SortHeader label="Kilométrage" field="mileage" sortBy={sortBy} sortDir={sortDir} onSort={toggleSort} />,
      meta: { narrow: true },
      cell: (info) => <span className="text-sm tabular-nums">{formatNumber(info.getValue())} km</span>,
    }),
    columnHelper.accessor('price', {
      header: () => <SortHeader label="Prix" field="price" sortBy={sortBy} sortDir={sortDir} onSort={toggleSort} />,
      cell: (info) => <span className="text-sm font-medium tabular-nums">{formatPrice(info.getValue())}</span>,
    }),
    columnHelper.accessor('arrivedAt', {
      header: () => <SortHeader label="Arrivée" field="arrivedAt" sortBy={sortBy} sortDir={sortDir} onSort={toggleSort} />,
      meta: { narrow: true },
      cell: (info) => <span className="text-xs tabular-nums mm-muted">{formatDate(info.getValue())}</span>,
    }),
    columnHelper.accessor('status', {
      header: 'Statut',
      cell: (info) => <DashStatus status={info.getValue()} />,
    }),
    columnHelper.display({
      id: 'actions',
      header: '',
      cell: (info) => (
        <Link to="/dashboard/motors/inventory/$vehicleId" params={{ vehicleId: info.row.original.id }} className="mm-link inline-flex items-center gap-1.5">
          <ViewIcon className="h-3.5 w-3.5" aria-hidden="true" /> Voir
        </Link>
      ),
    }),
  ]

  const table = useReactTable({ data: vehicles, columns, getCoreRowModel: getCoreRowModel() })

  const openVehicle = (vehicleId: string) => {
    void navigate({ to: '/dashboard/motors/inventory/$vehicleId', params: { vehicleId } })
  }

  const totalStock = overview?.vehicleTotal ?? pagination.total
  const availableStock = overview?.availableCount ?? 0
  const lead =
    statusFilter !== 'all' || queryQ
      ? `${pagination.total} résultat${pagination.total === 1 ? '' : 's'} · ${availableStock} disponibles au showroom`
      : `${totalStock} véhicules · ${availableStock} disponibles au showroom`

  const hasFilters = statusFilter !== 'all' || queryQ.length > 0

  const exportMutation = useMutation({
    mutationFn: () =>
      vehiclesApi.list({
        page: 1,
        limit: 500,
        sortBy,
        sortDir,
        ...(statusFilter !== 'all' ? { status: statusFilter } : {}),
        ...(queryQ ? { search: queryQ } : {}),
      }),
    onSuccess: (res) => {
      const statusExport: Record<string, string> = {
        available: 'Disponible',
        reserved: 'Réservé',
        sold: 'Vendu',
      }
      downloadCsv(
        `inventaire-${new Date().toISOString().slice(0, 10)}.csv`,
        ['Marque', 'Modèle', 'Année', 'Kilométrage', 'Prix', 'Statut', 'VIN', 'Arrivée showroom'],
        res.data.map((v) => [
          v.make,
          v.model,
          v.year,
          v.mileage,
          v.price ?? '',
          statusExport[v.status] ?? v.status,
          v.vin ?? '',
          formatDate(v.arrivedAt),
        ])
      )
      toast(`${res.data.length} véhicules exportés`)
    },
    onError: (e) => toast((e as Error).message, 'error'),
  })

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-6">
      <DashBreadcrumbs
        items={[
          { label: 'Mansour Motors', to: '/dashboard/motors' },
          { label: 'Inventaire' },
        ]}
      />
      <DashPageHeader
        title="Inventaire"
        lead={lead}
        actions={
          <>
            <DashButton
              type="button"
              variant="soft"
              disabled={exportMutation.isPending || pagination.total === 0}
              onClick={() => exportMutation.mutate()}
            >
              <Download01Icon className="h-4 w-4" aria-hidden="true" />
              {exportMutation.isPending ? 'Export…' : 'Exporter CSV'}
            </DashButton>
            <DashButton to="/dashboard/motors/inventory/new">
              <Add01Icon className="h-4 w-4" aria-hidden="true" /> Ajouter un véhicule
            </DashButton>
          </>
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="mm-search">
          <Search01Icon className="mm-search-icon h-4 w-4" aria-hidden="true" />
          <input
            type="search"
            placeholder="Rechercher par marque ou modèle…"
            value={searchInput}
            onChange={(e) => handleSearch(e.target.value)}
            className="mm-input mm-input--search text-sm"
          />
        </div>
        <div className="mm-seg-scroll w-full sm:w-auto">
          <div className="mm-seg" role="group" aria-label="Filtrer par statut">
            {(['all', 'available', 'reserved', 'sold'] as const).map((s) => (
              <button
                key={s}
                type="button"
                aria-pressed={statusFilter === s}
                onClick={() => patchParams({ status: s === 'all' ? null : s, page: null })}
              >
                {s === 'all' ? 'Tous' : statusLabels[s]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mm-panel">
        {error && <div className="mm-alert-error border-b">{(error as Error).message}</div>}

        {!isLoading && vehicles.length > 0 && (
          <div className="mm-inventory-cards">
            {vehicles.map((v) => (
              <button
                key={v.id}
                type="button"
                className="mm-inventory-card"
                onClick={() => openVehicle(v.id)}
              >
                {v.images?.[0] ? (
                  <img src={v.images[0]} alt="" className="h-16 w-20 shrink-0 rounded-[var(--mm-r)] object-cover" loading="lazy" decoding="async" />
                ) : (
                  <div className="flex h-16 w-20 shrink-0 items-center justify-center rounded-[var(--mm-r)] bg-[var(--mm-off)] text-xs text-[var(--mm-grey-muted)]">—</div>
                )}
                <div className="min-w-0 flex-1 text-left">
                  <p className="truncate font-medium">{v.make} {v.model}</p>
                  <p className="text-xs mm-muted">{v.year} · {formatNumber(v.mileage)} km · {formatDate(v.arrivedAt)}</p>
                  <p className="mt-1 text-sm font-semibold tabular-nums">{formatPrice(v.price)}</p>
                  <div className="mt-1.5"><DashStatus status={v.status} /></div>
                </div>
              </button>
            ))}
          </div>
        )}

        <div className="mm-table-desktop overflow-x-auto">
          <table className="mm-table">
            <thead>
              {table.getHeaderGroups().map((hg) => (
                <tr key={hg.id}>
                  {hg.headers.map((h) => (
                    <th
                      key={h.id}
                      className={(h.column.columnDef.meta as { narrow?: boolean } | undefined)?.narrow ? 'mm-table-col-narrow' : undefined}
                    >
                      {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={columns.length} className="py-12 text-center">
                  <div className="mm-spinner mx-auto" role="status" aria-label="Chargement" />
                </td></tr>
              ) : table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length}>
                    <div className="mm-empty-cta">
                      <p>
                        {hasFilters
                          ? 'Aucun véhicule ne correspond à vos critères.'
                          : 'Aucun véhicule en stock pour le moment.'}
                      </p>
                      {hasFilters ? (
                        <DashButton
                          type="button"
                          variant="soft"
                          onClick={() => {
                            setSearchInput('')
                            patchParams({ q: null, status: null, page: null })
                          }}
                        >
                          Réinitialiser les filtres
                        </DashButton>
                      ) : (
                        <DashButton to="/dashboard/motors/inventory/new">
                          <Add01Icon className="h-4 w-4" aria-hidden="true" /> Ajouter un véhicule
                        </DashButton>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row, i) => {
                  const vehicleId = row.original.id
                  const go = () => openVehicle(vehicleId)
                  return (
                    <motion.tr
                      key={row.id}
                      tabIndex={0}
                      role="link"
                      aria-label={`Ouvrir ${row.original.make} ${row.original.model}`}
                      className="mm-table-row-link"
                      initial={reduceMotion ? false : { opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={reduceMotion ? { duration: 0 } : { duration: 0.2, delay: Math.min(i * 0.02, 0.25) }}
                      onClick={go}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          go()
                        }
                      }}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          className={(cell.column.columnDef.meta as { narrow?: boolean } | undefined)?.narrow ? 'mm-table-col-narrow' : undefined}
                          onClick={(e) => {
                            if ((e.target as HTMLElement).closest('a, button')) e.stopPropagation()
                          }}
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </motion.tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
        {pagination.pages > 1 && (
          <div className="mm-table-foot">
            <p>Page {page} sur {pagination.pages} · {pagination.total} résultats</p>
            <div className="flex gap-2">
              <DashButton
                type="button"
                variant="soft"
                className="!min-h-0 !py-1.5 !text-xs"
                disabled={page === 1}
                onClick={() => patchParams({ page: page <= 2 ? null : String(page - 1) })}
              >
                Précédent
              </DashButton>
              <DashButton
                type="button"
                variant="soft"
                className="!min-h-0 !py-1.5 !text-xs"
                disabled={page === pagination.pages}
                onClick={() => patchParams({ page: String(page + 1) })}
              >
                Suivant
              </DashButton>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}

function InventoryPageFallback() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="mm-spinner" role="status" aria-label="Chargement" />
    </div>
  )
}

export default function MotorsInventoryPage() {
  return (
    <Suspense fallback={<InventoryPageFallback />}>
      <MotorsInventory />
    </Suspense>
  )
}
