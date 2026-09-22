'use client'

import { Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from '@/lib/router'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { motion, useReducedMotion } from 'framer-motion'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Search01Icon, Add01Icon, ViewIcon, Download01Icon } from 'hugeicons-react'
import { downloadCsv } from '@/lib/csv'
import { useToast } from '@/components/ui/Toast'
import { formatDate } from '@/lib/utils'
import { DashBreadcrumbs, DashButton, DashPageHeader } from '@/components/dashboard'
import { customersApi, type ApiCustomer, type CustomerSource } from '@/lib/api'
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'

const sourceLabels: Record<CustomerSource, string> = {
  'walk-in': 'Passage',
  referral: 'Référence',
  online: 'En ligne',
  phone: 'Téléphone',
}

const columnHelper = createColumnHelper<ApiCustomer>()
const columns = [
  columnHelper.accessor((row) => `${row.firstName} ${row.lastName}`, {
    id: 'name',
    header: 'Nom',
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
    id: 'actions',
    header: '',
    cell: (info) => (
      <Link
        to="/dashboard/motors/customers/$customerId"
        params={{ customerId: info.row.original.id }}
        className="mm-link inline-flex items-center gap-1.5"
      >
        <ViewIcon className="h-3.5 w-3.5" aria-hidden="true" /> Voir
      </Link>
    ),
  }),
]

function MotorsCustomersContent() {
  const navigate = useNavigate()
  const toast = useToast()
  const reduceMotion = useReducedMotion()
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const queryQ = searchParams.get('q') ?? ''
  const page = Math.max(1, Number.parseInt(searchParams.get('page') ?? '1', 10) || 1)
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

  const handleSearch = (val: string) => {
    setSearchInput(val)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      patchParams({ q: val.trim() || null, page: null })
    }, 300)
  }

  const { data, isLoading, error } = useQuery({
    queryKey: ['customers', page, queryQ],
    queryFn: () => customersApi.list({ page, limit: 20, ...(queryQ ? { search: queryQ } : {}) }),
    placeholderData: (prev) => prev,
  })

  const customers = data?.data ?? []
  const pagination = data?.pagination ?? { total: 0, pages: 1 }
  const table = useReactTable({ data: customers, columns, getCoreRowModel: getCoreRowModel() })
  const hasSearch = queryQ.length > 0

  const openCustomer = (customerId: string) => {
    void navigate({ to: '/dashboard/motors/customers/$customerId', params: { customerId } })
  }

  const exportMutation = useMutation({
    mutationFn: () =>
      customersApi.list({
        page: 1,
        limit: 500,
        ...(queryQ ? { search: queryQ } : {}),
      }),
    onSuccess: (res) => {
      downloadCsv(
        `clients-${new Date().toISOString().slice(0, 10)}.csv`,
        ['Prénom', 'Nom', 'Email', 'Téléphone', 'Source', 'Ajouté le'],
        res.data.map((c) => [
          c.firstName,
          c.lastName,
          c.email ?? '',
          c.phone ?? '',
          sourceLabels[c.source],
          formatDate(c.createdAt),
        ])
      )
      toast(`${res.data.length} client${res.data.length === 1 ? '' : 's'} exporté${res.data.length === 1 ? '' : 's'}`)
    },
    onError: (e) => toast((e as Error).message, 'error'),
  })

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-6">
      <DashBreadcrumbs
        items={[
          { label: 'Mansour Motors', to: '/dashboard/motors' },
          { label: 'Clients' },
        ]}
      />
      <DashPageHeader
        title="Clients"
        lead={`${pagination.total} client${pagination.total === 1 ? '' : 's'}${hasSearch ? ' (filtrés)' : ''}`}
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
            <DashButton to="/dashboard/motors/customers/new">
              <Add01Icon className="h-4 w-4" aria-hidden="true" /> Nouveau client
            </DashButton>
          </>
        }
      />

      <div className="mm-search max-w-md">
        <Search01Icon className="mm-search-icon h-4 w-4" aria-hidden="true" />
        <input
          type="search"
          placeholder="Rechercher par nom, email ou téléphone…"
          value={searchInput}
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
                <tr>
                  <td colSpan={columns.length} className="py-12 text-center">
                    <div className="mm-spinner mx-auto" role="status" aria-label="Chargement" />
                  </td>
                </tr>
              ) : table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length}>
                    <div className="mm-empty-cta">
                      <p>{hasSearch ? 'Aucun client ne correspond à votre recherche.' : 'Aucun client enregistré.'}</p>
                      {hasSearch ? (
                        <DashButton
                          type="button"
                          variant="soft"
                          onClick={() => {
                            setSearchInput('')
                            patchParams({ q: null, page: null })
                          }}
                        >
                          Réinitialiser la recherche
                        </DashButton>
                      ) : (
                        <DashButton to="/dashboard/motors/customers/new">Nouveau client</DashButton>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row, i) => {
                  const customerId = row.original.id
                  const go = () => openCustomer(customerId)
                  return (
                    <motion.tr
                      key={row.id}
                      tabIndex={0}
                      role="link"
                      aria-label={`Ouvrir ${row.original.firstName} ${row.original.lastName}`}
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

function CustomersPageFallback() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="mm-spinner" role="status" aria-label="Chargement" />
    </div>
  )
}

export function MotorsCustomers() {
  return (
    <Suspense fallback={<CustomersPageFallback />}>
      <MotorsCustomersContent />
    </Suspense>
  )
}

export default function MotorsCustomersPage() {
  return <MotorsCustomers />
}
