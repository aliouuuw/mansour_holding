import { Plus } from 'lucide-react'
import { cn, formatPrice } from '@/lib/utils'
import {
  deals,
  dealStatusLabels,
  dealStatusColors,
  type Deal,
} from '@/data/mock'

const pipelineColumns: { status: Deal['status']; label: string; color: string }[] = [
  { status: 'prospect', label: 'Prospect', color: 'border-t-blue-500' },
  { status: 'negotiation', label: 'Négociation', color: 'border-t-amber-500' },
  { status: 'test-drive', label: 'Essai', color: 'border-t-purple-500' },
  { status: 'closed-won', label: 'Conclu', color: 'border-t-emerald-500' },
  { status: 'closed-lost', label: 'Perdu', color: 'border-t-red-500' },
]

function DealCard({ deal }: { deal: Deal }) {
  return (
    <div className="rounded-lg border border-border bg-white p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
      <div className="flex items-start justify-between">
        <p className="text-sm font-semibold text-primary-900">{deal.customerName}</p>
        <span
          className={cn(
            'rounded-full px-2 py-0.5 text-[10px] font-medium',
            dealStatusColors[deal.status]
          )}
        >
          {dealStatusLabels[deal.status]}
        </span>
      </div>
      <p className="mt-1.5 text-xs text-muted">{deal.vehicleName}</p>
      <div className="mt-3 flex items-center justify-between">
        <p className="text-sm font-bold text-primary-950">{formatPrice(deal.price)}</p>
        <p className="text-[10px] text-muted">{deal.salesPerson}</p>
      </div>
    </div>
  )
}

export function MotorsSales() {
  const totalPipeline = deals
    .filter((d) => !d.status.startsWith('closed'))
    .reduce((sum, d) => sum + d.price, 0)

  const closedWon = deals
    .filter((d) => d.status === 'closed-won')
    .reduce((sum, d) => sum + d.price, 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary-950">Pipeline des ventes</h1>
          <p className="mt-1 text-sm text-muted">
            {deals.length} affaires · Pipeline: {formatPrice(totalPipeline)} · Conclu: {formatPrice(closedWon)}
          </p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 transition-colors">
          <Plus className="h-4 w-4" />
          Nouvelle affaire
        </button>
      </div>

      {/* Kanban Board */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {pipelineColumns.map((col) => {
          const columnDeals = deals.filter((d) => d.status === col.status)
          const columnTotal = columnDeals.reduce((sum, d) => sum + d.price, 0)

          return (
            <div
              key={col.status}
              className={cn(
                'min-w-[280px] flex-1 rounded-xl border-t-4 bg-surface-dim',
                col.color
              )}
            >
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-primary-950">{col.label}</h3>
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-surface-bright text-xs font-medium text-muted">
                    {columnDeals.length}
                  </span>
                </div>
                <p className="text-xs font-medium text-muted">{formatPrice(columnTotal)}</p>
              </div>
              <div className="space-y-3 px-3 pb-3">
                {columnDeals.map((deal) => (
                  <DealCard key={deal.id} deal={deal} />
                ))}
                {columnDeals.length === 0 && (
                  <div className="rounded-lg border-2 border-dashed border-border py-8 text-center">
                    <p className="text-xs text-muted">Aucune affaire</p>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
