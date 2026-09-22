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

function MotorsSalesListContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const page = Math.max(1, Number.parseInt(searchParams.get('page') ?? '1', 10) || 1)

  const patchPage = useCallback(
    (nextPage: number) => {
      const params = new URLSearchParams(searchParams.toString())
      if (!params.get('view')) params.set('view', 'list')
      if (nextPage <= 1) params.delete('page')
      else params.set('page', String(nextPage))
      const qs = params.toString()
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
    },
    [pathname, router, searchParams]
  )

  const { data, isLoading, error } = useQuery({
    queryKey: ['deals', 'list', page],
    queryFn: () => dealsApi.list({ page, limit: PAGE_SIZE }),
  })

  const deals = data?.data ?? []
  const pagination = data?.pagination ?? { page: 1, pages: 1, total: 0, limit: PAGE_SIZE }

  if (error) {
    return <div className="mm-alert-error">{(error as Error).message}</div>
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="mm-spinner" role="status" aria-label="Chargement" />
      </div>
    )
  }

  if (deals.length === 0) {
    return (
      <div className="mm-empty-cta mm-panel">
        <p>Aucune affaire enregistrée.</p>
        <DashButton to="/dashboard/motors/sales/new">Nouvelle affaire</DashButton>
      </div>
    )
  }

  return (
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
