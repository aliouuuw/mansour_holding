import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { Search01Icon, Add01Icon, FilterIcon, ViewIcon } from 'hugeicons-react'
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
        className="h-14 w-20 object-cover"
      />
    ),
    size: 90,
  }),
  columnHelper.accessor((row) => `${row.make} ${row.model}`, {
    id: 'name',
    header: 'Véhicule',
    cell: (info) => (
      <div>
        <p className="font-medium text-noir-950">{info.getValue()}</p>
        <p className="text-xs text-noir-500 font-mono">{info.row.original.vin}</p>
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
      <span className="text-sm font-semibold text-noir-950">
        {formatPrice(info.getValue())}
      </span>
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
            {vehicles.length} véhicules · {vehicles.filter((v) => v.status === 'available').length} disponibles
          </p>
        </div>
        <button className="inline-flex items-center gap-2 bg-noir-950 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-noir-800 transition-colors">
          <Add01Icon className="h-4 w-4" />
          Ajouter un véhicule
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search01Icon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-noir-400" />
          <input
            type="text"
            placeholder="Rechercher un véhicule..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="w-full border border-noir-200 bg-white py-2.5 pl-10 pr-4 text-sm text-noir-900 outline-none transition-all focus:border-gold-400 focus:ring-1 focus:ring-gold-400/20"
          />
        </div>
        <div className="flex items-center gap-2">
          <FilterIcon className="h-4 w-4 text-noir-400" />
          {['all', 'available', 'reserved', 'sold'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={cn(
                'px-3 py-1.5 text-xs font-medium uppercase tracking-wider transition-colors',
                statusFilter === status
                  ? 'bg-noir-950 text-white'
                  : 'bg-white border border-noir-200 text-noir-600 hover:border-noir-300 hover:text-noir-900'
              )}
            >
              {status === 'all' ? 'Tous' : vehicleStatusLabels[status as Vehicle['status']]}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden border border-noir-200 bg-white shadow-sm">
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
              {table.getRowModel().rows.map((row, index) => (
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
              ))}
            </tbody>
          </table>
        </div>
        {table.getRowModel().rows.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-sm text-noir-500">Aucun véhicule trouvé</p>
          </div>
        )}
      </div>
    </motion.div>
  )
}
