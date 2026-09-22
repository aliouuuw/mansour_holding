'use client'

import { Suspense, useCallback } from 'react'
import { Link } from '@/lib/router'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { formatPrice, formatDate } from '@/lib/utils'
import { DashButton } from '@/components/dashboard'
import { dealsApi, type DealStatus } from '@/lib/api'

const statusLabels: Record<DealStatus, string> = {
  lead: 'Prospect',
  negotiation: 'Négociation',
  'closed-won': 'Conclu',
  'closed-lost': 'Perdu',
}

const PAGE_SIZE = 20

function parseStatus(raw: string | null): DealStatus | 'all' {
  if (raw === 'lead' || raw === 'negotiation' || raw === 'closed-won' || raw === 'closed-lost') return raw
  return 'all'
}

function MotorsSalesListContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const page = Math.max(1, Number.parseInt(searchParams.get('page') ?? '1', 10) || 1)
  const statusFilter = parseStatus(searchParams.get('status'))

  const patchParams = useCallback(
    (patch: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString())
      if (!params.get('view')) params.set('view', 'list')
      for (const [key, value] of Object.entries(patch)) {
        if (value === null || value === '') params.delete(key)
        else params.set(key, value)
      }
      const qs = params.toString()
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
    },
    [pathname, router, searchParams]
  )

  const patchPage = useCallback(
    (nextPage: number) => {
      patchParams({ page: nextPage <= 1 ? null : String(nextPage) })
    },
    [patchParams]
  )

  const { data, isLoading, error } = useQuery({
    queryKey: ['deals', 'list', page, statusFilter],
    queryFn: () => dealsApi.list({
      page,
      limit: PAGE_SIZE,
      ...(statusFilter !== 'all' ? { status: statusFilter } : {}),
    }),
  })

  const deals = data?.data ?? []
  const pagination = data?.pagination ?? { page: 1, pages: 1, total: 0, limit: PAGE_SIZE }
  const hasStatusFilter = statusFilter !== 'all'

  if (error) {
    return <div className="mm-alert-error">{(error as Error).message}</div>
  }

  return (
    <div className="space-y-3">
      <div className="mm-seg-scroll w-full sm:w-auto">
        <div className="mm-seg" role="group" aria-label="Filtrer par statut">
          {(['all', 'lead', 'negotiation', 'closed-won', 'closed-lost'] as const).map((s) => (
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

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="mm-spinner" role="status" aria-label="Chargement" />
        </div>
      ) : deals.length === 0 ? (
        <div className="mm-empty-cta mm-panel">
          <p>{hasStatusFilter ? 'Aucune affaire pour ce statut.' : 'Aucune affaire enregistrée.'}</p>
          {hasStatusFilter ? (
            <DashButton type="button" variant="soft" onClick={() => patchParams({ status: null, page: null })}>
              Réinitialiser le filtre
            </DashButton>
          ) : (
            <DashButton to="/dashboard/motors/sales/new">Nouvelle affaire</DashButton>
          )}
        </div>
      ) : (
        <div className="mm-panel overflow-hidden">
          <div className="overflow-x-auto">
            <table className="mm-table">
              <thead>
                <tr>
                  <th>Véhicule</th>
                  <th>Client</th>
                  <th>Prix</th>
                  <th>Statut</th>
                  <th className="mm-table-col-narrow">Créée</th>
                </tr>
              </thead>
              <tbody>
                {deals.map((deal) => (
                  <tr key={deal.id} className="mm-table-row-link">
                    <td>
                      <Link
                        to="/dashboard/motors/sales/$dealId"
                        params={{ dealId: deal.id }}
                        className="mm-link text-sm font-medium"
                      >
                        {deal.vehicleName ?? '—'}
                      </Link>
                    </td>
                    <td>
                      <p className="text-sm">{deal.customerName ?? '—'}</p>
                      {deal.customerPhone ? <p className="text-xs mm-muted">{deal.customerPhone}</p> : null}
                    </td>
                    <td className="text-sm font-medium tabular-nums">{formatPrice(deal.price)}</td>
                    <td className="text-sm font-medium">{statusLabels[deal.status]}</td>
                    <td className="mm-table-col-narrow text-xs mm-muted tabular-nums">{formatDate(deal.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {pagination.pages > 1 && (
            <div className="mm-table-foot">
              <p>Page {page} sur {pagination.pages} · {pagination.total} affaires</p>
              <div className="flex gap-2">
                <DashButton
                  type="button"
                  variant="soft"
                  className="!min-h-0 !py-1.5 !text-xs"
                  disabled={page === 1}
                  onClick={() => patchPage(page - 1)}
                >
                  Précédent
                </DashButton>
                <DashButton
                  type="button"
                  variant="soft"
                  className="!min-h-0 !py-1.5 !text-xs"
                  disabled={page === pagination.pages}
                  onClick={() => patchPage(page + 1)}
                >
                  Suivant
                </DashButton>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export function MotorsSalesList() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-20">
          <div className="mm-spinner" role="status" aria-label="Chargement" />
        </div>
      }
    >
      <MotorsSalesListContent />
    </Suspense>
  )
}
