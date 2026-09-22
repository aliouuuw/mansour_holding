'use client'

import { motion } from 'framer-motion'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Add01Icon, UserIcon, Car01Icon, DollarCircleIcon } from 'hugeicons-react'
import { formatPrice } from '@/lib/utils'
import { DashButton, DashPageHeader } from '@/components/dashboard'
import { dealsApi, invalidateMotorsQueries, type ApiDeal, type DealStatus } from '@/lib/api'
import { useToast } from '@/components/ui/Toast'
import type { DealsBoard } from '@/server/deals'

const COLUMNS: { status: DealStatus; label: string }[] = [
  { status: 'lead', label: 'Prospect' },
  { status: 'negotiation', label: 'Négociation' },
  { status: 'closed-won', label: 'Conclu' },
  { status: 'closed-lost', label: 'Perdu' },
]

function DealCard({ deal, onMove }: { deal: ApiDeal; onMove: (id: string, status: DealStatus) => void }) {
  return (
    <motion.div layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mm-deal-card">
      <div className="flex items-start gap-2">
        <Car01Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--mm-grey-muted)]" aria-hidden="true" />
        <p className="text-sm font-medium leading-tight">{deal.vehicleName ?? 'Véhicule inconnu'}</p>
      </div>
      <div className="flex items-center gap-2">
        <UserIcon className="h-3.5 w-3.5 shrink-0 text-[var(--mm-grey-muted)]" aria-hidden="true" />
        <p className="text-xs mm-muted">{deal.customerName ?? '—'}</p>
      </div>
      <div className="flex items-center gap-2">
        <DollarCircleIcon className="h-3.5 w-3.5 shrink-0 text-[var(--mm-grey)]" aria-hidden="true" />
        <p className="text-sm font-medium tabular-nums">{formatPrice(deal.price)}</p>
      </div>
      <div className="border-t border-[var(--mm-line)] pt-2">
        <p className="mm-section-label mb-1.5">Déplacer vers</p>
        <div className="flex flex-wrap gap-1">
          {COLUMNS.filter((c) => c.status !== deal.status).map(({ status, label }) => (
            <button key={status} type="button" onClick={() => onMove(deal.id, status)} className="mm-chip">
              {label}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

function moveInBoard(board: DealsBoard, id: string, status: DealStatus): DealsBoard {
  const all = COLUMNS.flatMap((col) => board.columns[col.status])
  const deal = all.find((d) => d.id === id)
  if (!deal) return board

  const columns: DealsBoard['columns'] = {
    lead: board.columns.lead.filter((d) => d.id !== id),
    negotiation: board.columns.negotiation.filter((d) => d.id !== id),
    'closed-won': board.columns['closed-won'].filter((d) => d.id !== id),
    'closed-lost': board.columns['closed-lost'].filter((d) => d.id !== id),
  }
  columns[status] = [{ ...deal, status }, ...columns[status]]

  return {
    columns,
    activeCount: columns.lead.length + columns.negotiation.length,
    wonRevenue: columns['closed-won'].reduce((sum, d) => sum + d.price, 0),
  }
}

export function MotorsSales({ initial }: { initial: DealsBoard }) {
  const qc = useQueryClient()
  const toast = useToast()

  const { data, isLoading, error } = useQuery({
    queryKey: ['deals-board'],
    queryFn: dealsApi.board,
    initialData: initial,
  })

  const moveMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: DealStatus }) => dealsApi.update(id, { status }),
    onMutate: async ({ id, status }) => {
      await qc.cancelQueries({ queryKey: ['deals-board'] })
      const prev = qc.getQueryData<DealsBoard>(['deals-board'])
      if (prev) qc.setQueryData(['deals-board'], moveInBoard(prev, id, status))
      return { prev }
    },
    onSuccess: (_, { status }) => {
      invalidateMotorsQueries(qc)
      toast(`Affaire déplacée vers ${COLUMNS.find(c => c.status === status)?.label}`)
    },
    onError: (e, _, ctx) => {
      if (ctx?.prev) qc.setQueryData(['deals-board'], ctx.prev)
      toast((e as Error).message, 'error')
    },
  })

  const board = data
  const totalActive = board.activeCount
  const totalWon = board.wonRevenue

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-6">
      <DashPageHeader
        title="Pipeline des ventes"
        lead={`${totalActive} affaire${totalActive !== 1 ? 's' : ''} en cours · ${formatPrice(totalWon)} conclus`}
        actions={
          <DashButton to="/dashboard/motors/sales/new">
            <Add01Icon className="h-4 w-4" aria-hidden="true" /> Nouvelle affaire
          </DashButton>
        }
      />

      {error && <div className="mm-alert-error">{(error as Error).message}</div>}

      {isLoading ? (
        <div className="flex items-center justify-center py-20"><div className="mm-spinner" role="status" aria-label="Chargement" /></div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {COLUMNS.map((col) => {
            const cards = board.columns[col.status]
            const colTotal = cards.reduce((sum, d) => sum + d.price, 0)
            return (
              <div key={col.status} className="flex flex-col gap-3">
                <div className="mm-kanban-head">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[var(--mm-ink)]" aria-hidden="true" />
                    <span className="text-xs font-bold uppercase tracking-wider">{col.label}</span>
                    <span className="mm-kanban-count">{cards.length}</span>
                  </div>
                  {colTotal > 0 && <span className="text-[0.65rem] font-medium tabular-nums text-[var(--mm-grey)]">{formatPrice(colTotal)}</span>}
                </div>
                <div className="flex min-h-[120px] flex-col gap-2">
                  {cards.length === 0 ? (
                    <div className="mm-empty">Aucune affaire</div>
                  ) : (
                    cards.map(deal => <DealCard key={deal.id} deal={deal} onMove={(id, status) => moveMutation.mutate({ id, status })} />)
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </motion.div>
  )
}
