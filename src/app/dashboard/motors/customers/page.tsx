'use client'

import { useState } from 'react'
import { Link } from '@/lib/router'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { Search01Icon, Add01Icon, ViewIcon } from 'hugeicons-react'
import { formatDate } from '@/lib/utils'
import { DashButton, DashPageHeader } from '@/components/dashboard'
import { customersApi, type ApiCustomer, type CustomerSource } from '@/lib/api'
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'

const sourceLabels: Record<CustomerSource, string> = { 'walk-in': 'Passage', referral: 'Référence', online: 'En ligne', phone: 'Téléphone' }

const columnHelper = createColumnHelper<ApiCustomer>()
const columns = [
  columnHelper.accessor((row) => `${row.firstName} ${row.lastName}`, {
    id: 'name', header: 'Nom',
    cell: (info) => (
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center bg-[var(--mm-off)] text-xs font-medium text-[var(--mm-ink)]">
          {info.row.original.firstName[0]}{info.row.original.lastName[0]}
        </div>
        <span className="font-medium">{info.getValue()}</span>
      </div>
    ),
  }),
  columnHelper.accessor('email', { header: 'Email', cell: (info) => <span className="text-sm mm-muted">{info.getValue()}</span> }),
  columnHelper.accessor('phone', { header: 'Téléphone', cell: (info) => <span className="text-sm tabular-nums">{info.getValue()}</span> }),
  columnHelper.accessor('source', {
    header: 'Source',
    cell: (info) => (
      <span className="text-xs font-medium uppercase tracking-wider text-[var(--mm-grey)]">
        {sourceLabels[info.getValue()]}
      </span>
    ),
  }),
  columnHelper.accessor('createdAt', { header: 'Ajouté le', cell: (info) => <span className="text-sm mm-muted">{formatDate(info.getValue())}</span> }),
  columnHelper.display({
    id: 'actions', header: '',
    cell: (info) => (
      <Link to="/dashboard/motors/customers/$customerId" params={{ customerId: info.row.original.id }}
        className="mm-link inline-flex items-center gap-1.5">
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
      <DashPageHeader
        title="Clients"
        lead={`${pagination.total} clients enregistrés`}
        actions={
          <DashButton to="/dashboard/motors/customers/new">
            <Add01Icon className="h-4 w-4" aria-hidden="true" /> Nouveau client
          </DashButton>
        }
      />

      <div className="mm-search max-w-md">
        <Search01Icon className="mm-search-icon h-4 w-4" aria-hidden="true" />
        <input
          type="search"
          placeholder="Rechercher par nom, email ou téléphone…"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className="mm-input mm-input--search text-sm"
        />
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
                <tr><td colSpan={columns.length} className="py-12 text-center mm-muted">Aucun client trouvé</td></tr>
              ) : (
                table.getRowModel().rows.map((row, i) => (
                  <motion.tr key={row.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
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

export default MotorsCustomers
