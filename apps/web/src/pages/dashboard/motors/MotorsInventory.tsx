import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Search, Plus, Filter, Eye } from 'lucide-react'
import { cn, formatPrice, formatNumber } from '@/lib/utils'
import {
  vehicles,
  vehicleStatusLabels,
  vehicleStatusColors,
  type Vehicle,
} from '@/data/mock'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from '@tanstack/react-table'

const columnHelper = createColumnHelper<Vehicle>()

const columns = [
  columnHelper.display({
    id: 'image',
    header: '',
    cell: (info) => (
      <img
        src={info.row.original.image}
        alt={`${info.row.original.make} ${info.row.original.model}`}
        className="h-12 w-16 rounded-lg object-cover"
      />
    ),
    size: 80,
  }),
  columnHelper.accessor((row) => `${row.make} ${row.model}`, {
    id: 'name',
    header: 'Véhicule',
    cell: (info) => (
      <div>
        <p className="font-medium text-primary-900">{info.getValue()}</p>
        <p className="text-xs text-muted">{info.row.original.vin}</p>
      </div>
    ),
  }),
  columnHelper.accessor('year', {
    header: 'Année',
    cell: (info) => <span className="text-sm">{info.getValue()}</span>,
  }),
  columnHelper.accessor('mileage', {
    header: 'Kilométrage',
    cell: (info) => (
      <span className="text-sm">{formatNumber(info.getValue())} km</span>
    ),
  }),
  columnHelper.accessor('price', {
    header: 'Prix',
    cell: (info) => (
      <span className="text-sm font-semibold text-primary-900">
        {formatPrice(info.getValue())}
      </span>
    ),
  }),
  columnHelper.accessor('status', {
    header: 'Statut',
    cell: (info) => (
      <span
        className={cn(
          'inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium',
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
        className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-primary-600 hover:bg-primary-50 transition-colors"
      >
        <Eye className="h-3.5 w-3.5" />
        Voir
      </Link>
    ),
  }),
]

export function MotorsInventory() {
  const [globalFilter, setGlobalFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const filteredData = statusFilter === 'all'
    ? vehicles
    : vehicles.filter((v) => v.status === statusFilter)

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary-950">Inventaire</h1>
          <p className="mt-1 text-sm text-muted">
            {vehicles.length} véhicules · {vehicles.filter((v) => v.status === 'available').length} disponibles
          </p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 transition-colors">
          <Plus className="h-4 w-4" />
          Ajouter un véhicule
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="Rechercher un véhicule..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="w-full rounded-lg border border-border bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted" />
          {['all', 'available', 'reserved', 'sold'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={cn(
                'rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
                statusFilter === status
                  ? 'bg-primary-600 text-white'
                  : 'bg-surface-bright text-muted hover:bg-surface-dim'
              )}
            >
              {status === 'all' ? 'Tous' : vehicleStatusLabels[status as Vehicle['status']]}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="border-b border-border bg-surface-dim">
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-border">
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-surface-dim/50 transition-colors">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {table.getRowModel().rows.length === 0 && (
          <div className="py-12 text-center text-sm text-muted">
            Aucun véhicule trouvé
          </div>
        )}
      </div>
    </div>
  )
}
