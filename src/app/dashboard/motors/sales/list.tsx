'use client'

import { useQuery } from '@tanstack/react-query'
import { formatPrice } from '@/lib/utils'
import { dealsApi, type DealStatus } from '@/lib/api'
const statusLabels: Record<DealStatus, string> = {
  lead: 'Prospect',
  negotiation: 'Négociation',
  'closed-won': 'Conclu',
  'closed-lost': 'Perdu',
}

export function MotorsSalesList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['deals', 'list'],
    queryFn: () => dealsApi.list({ limit: 100 }),
  })

  const deals = data?.data ?? []

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
            </tr>
          </thead>
          <tbody>
            {deals.map((deal) => (
              <tr key={deal.id}>
                <td>
                  <p className="text-sm font-medium">{deal.vehicleName ?? '—'}</p>
                </td>
                <td>
                  <p className="text-sm">{deal.customerName ?? '—'}</p>
                  {deal.customerPhone ? <p className="text-xs mm-muted">{deal.customerPhone}</p> : null}
                </td>
                <td className="text-sm font-medium tabular-nums">{formatPrice(deal.price)}</td>
                <td className="text-sm font-medium">{statusLabels[deal.status]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
