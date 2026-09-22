'use client'

import { useState } from 'react'
import { Link } from '@/lib/router'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { Search01Icon, Add01Icon, ViewIcon } from 'hugeicons-react'
import { formatPrice, formatNumber } from '@/lib/utils'
import { DashButton, DashPageHeader, DashStatus, dashVehicleStatusLabels } from '@/components/dashboard'
import { vehiclesApi, type ApiVehicle, type VehicleStatus } from '@/lib/api'
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'

const statusLabels = dashVehicleStatusLabels

const columnHelper = createColumnHelper<ApiVehicle>()
const columns = [
  columnHelper.display({
    id: 'image',
    header: '',
    cell: (info) => {
      const img = info.row.original.images?.[0]
      return img
        ? <img src={img} alt="" className="h-14 w-20 object-cover" loading="lazy" decoding="async" />
        : <div className="flex h-14 w-20 items-center justify-center bg-[var(--mm-off)] text-xs text-[var(--mm-grey-muted)]">—</div>
    },
    size: 90,
  }),
  columnHelper.accessor((row) => `${row.make} ${row.model}`, {
    id: 'name', header: 'Véhicule',
    cell: (info) => (
      <div>
        <p className="font-medium text-[var(--mm-ink)]">{info.getValue()}</p>
        {info.row.original.vin && <p className="font-mono text-xs text-[var(--mm-grey)]">{info.row.original.vin}</p>}
      </div>
    ),
  }),
  columnHelper.accessor('year', { header: 'Année', cell: (info) => <span className="text-sm tabular-nums">{info.getValue()}</span> }),
  columnHelper.accessor('mileage', { header: 'Kilométrage', cell: (info) => <span className="text-sm tabular-nums">{formatNumber(info.getValue())} km</span> }),
  columnHelper.accessor('price', { header: 'Prix', cell: (info) => <span className="text-sm font-medium tabular-nums">{formatPrice(info.getValue())}</span> }),
  columnHelper.accessor('status', {
    header: 'Statut',
    cell: (info) => <DashStatus status={info.getValue()} />,
  }),
  columnHelper.display({
    id: 'actions', header: '',
    cell: (info) => (
      <Link to="/dashboard/motors/inventory/$vehicleId" params={{ vehicleId: info.row.original.id }} className="mm-link inline-flex items-center gap-1.5">
        <ViewIcon className="h-3.5 w-3.5" aria-hidden="true" /> Voir
      </Link>
    ),
  }),
]

export function MotorsInventory() {
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<VehicleStatus | 'all'>('all')
  const [page, setPage] = useState(1)

  // Debounce search
  const [debounceTimer, setDebounceTimer] = useState<ReturnType<typeof setTimeout> | null>(null)
  const handleSearch = (val: string) => {
    setSearch(val)
    if (debounceTimer) clearTimeout(debounceTimer)
    setDebounceTimer(setTimeout(() => { setDebouncedSearch(val); setPage(1) }, 300))
  }

  const { data, isLoading, error } = useQuery({
    queryKey: ['vehicles', page, statusFilter, debouncedSearch],
    queryFn: () => vehiclesApi.list({
      page, limit: 20,
      ...(statusFilter !== 'all' ? { status: statusFilter } : {}),
      ...(debouncedSearch ? { search: debouncedSearch } : {}),
    }),
    placeholderData: (prev) => prev, // keep previous data while fetching next page
  })

  const vehicles = data?.data ?? []
  const pagination = data?.pagination ?? { total: 0, pages: 1 }

  const table = useReactTable({ data: vehicles, columns, getCoreRowModel: getCoreRowModel() })

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-6">
      <DashPageHeader
        title="Inventaire"
        lead={`${pagination.total} véhicules · ${vehicles.filter((v) => v.status === 'available').length} disponibles`}
        actions={
          <DashButton to="/dashboard/motors/inventory/new">
            <Add01Icon className="h-4 w-4" aria-hidden="true" /> Ajouter un véhicule
          </DashButton>
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="mm-search">
          <Search01Icon className="mm-search-icon h-4 w-4" aria-hidden="true" />
          <input
            type="search"
            placeholder="Rechercher par marque ou modèle…"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="mm-input mm-input--search text-sm"
          />
        </div>
        <div className="mm-seg" role="group" aria-label="Filtrer par statut">
          {(['all', 'available', 'reserved', 'sold'] as const).map((s) => (
            <button
              key={s}
              type="button"
              aria-pressed={statusFilter === s}
              onClick={() => { setStatusFilter(s); setPage(1) }}
            >
              {s === 'all' ? 'Tous' : statusLabels[s]}
            </button>
          ))}
        </div>
      </div>

      <div className="mm-panel">
        {error && <div className="mm-alert-error border-b">{(error as Error).message}</div>}
        <div className="overflow-x-auto">
          <table className="mm-table">
            <thead>
              {table.getHeaderGroups().map((hg) => (
                <tr key={hg.id}>
                  {hg.headers.map((h) => (
                    <th key={h.id}>
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
                <tr><td colSpan={columns.length} className="py-12 text-center mm-muted">Aucun véhicule trouvé</td></tr>
              ) : (
                table.getRowModel().rows.map((row, i) => (
                  <motion.tr key={row.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: i * 0.03 }}>
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                    ))}
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {pagination.pages > 1 && (
          <div className="mm-table-foot">
            <p>Page {page} sur {pagination.pages} · {pagination.total} résultats</p>
            <div className="flex gap-2">
              <DashButton type="button" variant="soft" className="!min-h-0 !py-1.5 !text-xs" disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
                Précédent
              </DashButton>
              <DashButton type="button" variant="soft" className="!min-h-0 !py-1.5 !text-xs" disabled={page === pagination.pages} onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}>
                Suivant
              </DashButton>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default MotorsInventory
