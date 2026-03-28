import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { Search01Icon, Add01Icon, Loading03Icon, ViewIcon } from 'hugeicons-react'
import { cn, formatDate } from '@/lib/utils'
import { customersApi, type ApiCustomer, type CustomerSource } from '@/lib/api'
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'

const sourceLabels: Record<CustomerSource, string> = { 'walk-in': 'Passage', referral: 'Référence', online: 'En ligne', phone: 'Téléphone' }
const sourceColors: Record<CustomerSource, string> = {
  'walk-in': 'bg-blue-100 text-blue-800', referral: 'bg-purple-100 text-purple-800',
  online: 'bg-emerald-100 text-emerald-800', phone: 'bg-amber-100 text-amber-800',
}

const columnHelper = createColumnHelper<ApiCustomer>()
const columns = [
  columnHelper.accessor((row) => `${row.firstName} ${row.lastName}`, {
    id: 'name', header: 'Nom',
    cell: (info) => (
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center bg-noir-100 text-xs font-semibold text-noir-700">
          {info.row.original.firstName[0]}{info.row.original.lastName[0]}
        </div>
        <span className="font-medium text-noir-950">{info.getValue()}</span>
      </div>
    ),
  }),
  columnHelper.accessor('email', { header: 'Email', cell: (info) => <span className="text-sm text-noir-600">{info.getValue()}</span> }),
  columnHelper.accessor('phone', { header: 'Téléphone', cell: (info) => <span className="text-sm text-noir-700">{info.getValue()}</span> }),
  columnHelper.accessor('source', {
    header: 'Source',
    cell: (info) => (
      <span className={cn('inline-flex px-2.5 py-1 text-xs font-medium uppercase tracking-wider', sourceColors[info.getValue()])}>
        {sourceLabels[info.getValue()]}
      </span>
    ),
  }),
  columnHelper.accessor('createdAt', { header: 'Ajouté le', cell: (info) => <span className="text-sm text-noir-500">{formatDate(info.getValue())}</span> }),
  columnHelper.display({
    id: 'actions', header: '',
    cell: (info) => (
      <Link to="/dashboard/motors/customers/$customerId" params={{ customerId: info.row.original.id }}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gold-600 hover:text-gold-700 hover:bg-gold-50 transition-colors">
        <ViewIcon className="h-3.5 w-3.5" /> Voir
      </Link>
    ),
  }),
]

export function MotorsCustomers() {
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [page, setPage] = useState(1)
  const [debounceTimer, setDebounceTimer] = useState<ReturnType<typeof setTimeout> | null>(null)

  const handleSearch = (val: string) => {
    setSearch(val)
    if (debounceTimer) clearTimeout(debounceTimer)
    setDebounceTimer(setTimeout(() => { setDebouncedSearch(val); setPage(1) }, 300))
  }

  const { data, isLoading, error } = useQuery({
    queryKey: ['customers', page, debouncedSearch],
    queryFn: () => customersApi.list({ page, limit: 20, ...(debouncedSearch ? { search: debouncedSearch } : {}) }),
    placeholderData: (prev) => prev,
  })

  const customers = data?.data ?? []
  const pagination = data?.pagination ?? { total: 0, pages: 1 }
  const table = useReactTable({ data: customers, columns, getCoreRowModel: getCoreRowModel() })

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-motors-display text-2xl font-medium text-noir-950">Clients</h1>
          <p className="mt-1 text-sm text-noir-500">{pagination.total} clients enregistrés</p>
        </div>
        <button className="inline-flex items-center gap-2 bg-noir-950 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-noir-800 transition-colors">
          <Add01Icon className="h-4 w-4" /> Nouveau client
        </button>
      </div>

      <div className="relative max-w-md">
        <Search01Icon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-noir-400" />
        <input type="text" placeholder="Rechercher par nom, email ou téléphone..." value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full border border-noir-200 bg-white py-2.5 pl-10 pr-4 text-sm text-noir-900 outline-none transition-all focus:border-gold-400 focus:ring-1 focus:ring-gold-400/20" />
      </div>

      <div className="overflow-hidden border border-noir-200 bg-white shadow-sm">
        {error && <div className="border-b border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">{(error as Error).message}</div>}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              {table.getHeaderGroups().map((hg) => (
                <tr key={hg.id} className="border-b border-noir-200 bg-surface-dim">
                  {hg.headers.map((h) => (
                    <th key={h.id} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-noir-500">
                      {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-noir-100">
              {isLoading ? (
                <tr><td colSpan={columns.length} className="py-12 text-center"><Loading03Icon className="mx-auto h-6 w-6 animate-spin text-gold-400" /></td></tr>
              ) : table.getRowModel().rows.length === 0 ? (
                <tr><td colSpan={columns.length} className="py-12 text-center text-sm text-noir-500">Aucun client trouvé</td></tr>
              ) : (
                table.getRowModel().rows.map((row, i) => (
                  <motion.tr key={row.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: i * 0.03 }} className="hover:bg-surface-dim/50 transition-colors">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-3">{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                    ))}
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {pagination.pages > 1 && (
          <div className="flex items-center justify-between border-t border-noir-200 px-4 py-3">
            <p className="text-xs text-noir-500">Page {page} sur {pagination.pages} · {pagination.total} résultats</p>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="px-3 py-1.5 text-xs font-medium border border-noir-200 text-noir-600 hover:bg-surface-dim disabled:opacity-40 disabled:cursor-not-allowed transition-colors">Précédent</button>
              <button onClick={() => setPage(p => Math.min(pagination.pages, p + 1))} disabled={page === pagination.pages}
                className="px-3 py-1.5 text-xs font-medium border border-noir-200 text-noir-600 hover:bg-surface-dim disabled:opacity-40 disabled:cursor-not-allowed transition-colors">Suivant</button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}
