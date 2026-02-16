import { useState } from 'react'
import { Search, Plus, Phone, Mail } from 'lucide-react'
import { cn, formatDate } from '@/lib/utils'
import {
  customers,
  type Customer,
} from '@/data/mock'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from '@tanstack/react-table'

const sourceLabels: Record<Customer['source'], string> = {
  'walk-in': 'Visite',
  'referral': 'Recommandation',
  'online': 'En ligne',
  'phone': 'Téléphone',
}

const sourceColors: Record<Customer['source'], string> = {
  'walk-in': 'bg-blue-100 text-blue-800',
  'referral': 'bg-emerald-100 text-emerald-800',
  'online': 'bg-purple-100 text-purple-800',
  'phone': 'bg-amber-100 text-amber-800',
}

const columnHelper = createColumnHelper<Customer>()

const columns = [
  columnHelper.accessor((row) => `${row.firstName} ${row.lastName}`, {
    id: 'name',
    header: 'Client',
    cell: (info) => (
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-700">
          {info.row.original.firstName[0]}{info.row.original.lastName[0]}
        </div>
        <div>
          <p className="font-medium text-primary-900">{info.getValue()}</p>
          <p className="text-xs text-muted">{info.row.original.email}</p>
        </div>
      </div>
    ),
  }),
  columnHelper.accessor('phone', {
    header: 'Téléphone',
    cell: (info) => (
      <div className="flex items-center gap-2 text-sm text-primary-900">
        <Phone className="h-3.5 w-3.5 text-muted" />
        {info.getValue()}
      </div>
    ),
  }),
  columnHelper.accessor('source', {
    header: 'Source',
    cell: (info) => (
      <span
        className={cn(
          'inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium',
          sourceColors[info.getValue()]
        )}
      >
        {sourceLabels[info.getValue()]}
      </span>
    ),
  }),
  columnHelper.accessor('totalDeals', {
    header: 'Affaires',
    cell: (info) => (
      <span className="text-sm font-medium text-primary-900">{info.getValue()}</span>
    ),
  }),
  columnHelper.accessor('createdAt', {
    header: 'Ajouté le',
    cell: (info) => (
      <span className="text-sm text-muted">{formatDate(info.getValue())}</span>
    ),
  }),
  columnHelper.display({
    id: 'actions',
    header: '',
    cell: (_info) => (
      <div className="flex items-center gap-1">
        <button className="rounded-lg p-1.5 text-muted hover:bg-primary-50 hover:text-primary-600 transition-colors">
          <Phone className="h-4 w-4" />
        </button>
        <button className="rounded-lg p-1.5 text-muted hover:bg-primary-50 hover:text-primary-600 transition-colors">
          <Mail className="h-4 w-4" />
        </button>
      </div>
    ),
  }),
]

export function MotorsCustomers() {
  const [globalFilter, setGlobalFilter] = useState('')

  const table = useReactTable({
    data: customers,
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
          <h1 className="text-2xl font-bold text-primary-950">Clients</h1>
          <p className="mt-1 text-sm text-muted">
            {customers.length} clients enregistrés
          </p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 transition-colors">
          <Plus className="h-4 w-4" />
          Ajouter un client
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <input
          type="text"
          placeholder="Rechercher un client..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="w-full rounded-lg border border-border bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
        />
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
            Aucun client trouvé
          </div>
        )}
      </div>
    </div>
  )
}
