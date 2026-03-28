import { useState, useEffect, useCallback } from 'react'
import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { Search01Icon, Add01Icon, FilterIcon, ViewIcon, Loading03Icon } from 'hugeicons-react'
import { cn, formatPrice, formatNumber } from '@/lib/utils'
import { vehiclesApi, type ApiVehicle, type VehicleStatus } from '@/lib/api'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'

const vehicleStatusLabels: Record<VehicleStatus, string> = {
  available: 'Disponible',
  reserved: 'Réservé',
  sold: 'Vendu',
}

const vehicleStatusColors: Record<VehicleStatus, string> = {
  available: 'bg-emerald-100 text-emerald-800',
  reserved: 'bg-amber-100 text-amber-800',
  sold: 'bg-slate-100 text-slate-600',
}

const fuelTypeLabels: Record<string, string> = {
  gasoline: 'Essence',
  diesel: 'Diesel',
  hybrid: 'Hybride',
  electric: 'Électrique',
}

const columnHelper = createColumnHelper<ApiVehicle>()

const columns = [
  columnHelper.display({
    id: 'image',
    header: '',
    cell: (info) => {
      const img = info.row.original.images?.[0]
      return img ? (
        <img
          src={img}
          alt={`${info.row.original.make} ${info.row.original.model}`}
          className="h-14 w-20 object-cover"
        />
      ) : (
        <div className="h-14 w-20 bg-surface-dim flex items-center justify-center text-xs text-noir-400">
          —
        </div>
      )
    },
    size: 90,
  }),
  columnHelper.accessor((row) => `${row.make} ${row.model}`, {
    id: 'name',
    header: 'Véhicule',
    cell: (info) => (
      <div>
        <p className="font-medium text-noir-950">{info.getValue()}</p>
        {info.row.original.vin && (
          <p className="text-xs text-noir-500 font-mono">{info.row.original.vin}</p>
        )}
      </div>
    ),
  }),
  columnHelper.accessor('year', {
    header: 'Année',
    cell: (info) => <span className="text-sm text-noir-700">{info.getValue()}</span>,
  }),
  columnHelper.accessor('mileage', {
    header: 'Kilométrage',
    cell: (info) => (
      <span className="text-sm text-noir-700">{formatNumber(info.getValue())} km</span>
    ),
  }),
  columnHelper.accessor('price', {
    header: 'Prix',
    cell: (info) => (
      <span className="text-sm font-semibold text-noir-950">{formatPrice(info.getValue())}</span>
    ),
  }),
  columnHelper.accessor('status', {
    header: 'Statut',
    cell: (info) => (
      <span
        className={cn(
          'inline-flex px-2.5 py-1 text-xs font-medium uppercase tracking-wider',
          vehicleStatusColors[info.getValue()]
        )}
      >
        {vehicleStatusLabels[info.getValue()]}
      </span>
    ),
  }),
  columnHelper.display({
    id: 'actions',
    header: '',
    cell: (info) => (
      <Link
        to="/dashboard/motors/inventory/$vehicleId"
        params={{ vehicleId: info.row.original.id }}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gold-600 hover:text-gold-700 hover:bg-gold-50 transition-colors"
      >
        <ViewIcon className="h-3.5 w-3.5" />
        Voir
      </Link>
    ),
  }),
]

export function MotorsInventory() {
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<VehicleStatus | 'all'>('all')
  const [page, setPage] = useState(1)
  const [data, setData] = useState<ApiVehicle[]>([])
  const [pagination, setPagination] = useState({ total: 0, pages: 1 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300)
    return () => clearTimeout(t)
  }, [search])

  // Reset to page 1 when filters change
  useEffect(() => { setPage(1) }, [debouncedSearch, statusFilter])

  const fetchVehicles = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await vehiclesApi.list({
        page,
        limit: 20,
        ...(statusFilter !== 'all' ? { status: statusFilter } : {}),
        ...(debouncedSearch ? { search: debouncedSearch } : {}),
      })
      setData(res.data)
      setPagination({ total: res.pagination.total, pages: res.pagination.pages })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur de chargement')
    } finally {
      setLoading(false)
    }
  }, [page, statusFilter, debouncedSearch])

  useEffect(() => { void fetchVehicles() }, [fetchVehicles])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const availableCount = data.filter((v) => v.status === 'available').length

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-motors-display text-2xl font-medium text-noir-950">Inventaire</h1>
          <p className="mt-1 text-sm text-noir-500">
            {pagination.total} véhicules · {availableCount} disponibles
          </p>
        </div>
        <Link
          to="/dashboard/motors/inventory/new"
          className="inline-flex items-center gap-2 bg-noir-950 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-noir-800 transition-colors"
        >
          <Add01Icon className="h-4 w-4" />
          Ajouter un véhicule
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search01Icon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-noir-400" />
          <input
            type="text"
            placeholder="Rechercher par marque ou modèle..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-noir-200 bg-white py-2.5 pl-10 pr-4 text-sm text-noir-900 outline-none transition-all focus:border-gold-400 focus:ring-1 focus:ring-gold-400/20"
          />
        </div>
        <div className="flex items-center gap-2">
          <FilterIcon className="h-4 w-4 text-noir-400" />
          {(['all', 'available', 'reserved', 'sold'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={cn(
                'px-3 py-1.5 text-xs font-medium uppercase tracking-wider transition-colors',
                statusFilter === s
                  ? 'bg-noir-950 text-white'
                  : 'bg-white border border-noir-200 text-noir-600 hover:border-noir-300 hover:text-noir-900'
              )}
            >
              {s === 'all' ? 'Tous' : vehicleStatusLabels[s]}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden border border-noir-200 bg-white shadow-sm">
        {error && (
          <div className="border-b border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="border-b border-noir-200 bg-surface-dim">
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-noir-500"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-noir-100">
              {loading ? (
                <tr>
                  <td colSpan={columns.length} className="py-12 text-center">
                    <Loading03Icon className="mx-auto h-6 w-6 animate-spin text-gold-400" />
                  </td>
                </tr>
              ) : table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="py-12 text-center text-sm text-noir-500">
                    Aucun véhicule trouvé
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row, index) => (
                  <motion.tr
                    key={row.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.03 }}
                    className="hover:bg-surface-dim/50 transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-3">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex items-center justify-between border-t border-noir-200 px-4 py-3">
            <p className="text-xs text-noir-500">
              Page {page} sur {pagination.pages} · {pagination.total} résultats
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 text-xs font-medium border border-noir-200 text-noir-600 hover:bg-surface-dim disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Précédent
              </button>
              <button
                onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                disabled={page === pagination.pages}
                className="px-3 py-1.5 text-xs font-medium border border-noir-200 text-noir-600 hover:bg-surface-dim disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Suivant
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}
