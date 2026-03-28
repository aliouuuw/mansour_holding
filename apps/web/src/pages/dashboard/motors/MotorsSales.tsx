import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Add01Icon, Loading03Icon, UserIcon, Car01Icon, DollarCircleIcon } from 'hugeicons-react'
import { cn, formatPrice } from '@/lib/utils'
import { dealsApi, type ApiDeal, type DealStatus } from '@/lib/api'
import { useToast } from '@/components/ui/Toast'

const COLUMNS: { status: DealStatus; label: string; color: string; dot: string }[] = [
  { status: 'lead',         label: 'Prospect',     color: 'border-blue-200 bg-blue-50',    dot: 'bg-blue-400' },
  { status: 'negotiation',  label: 'Négociation',  color: 'border-amber-200 bg-amber-50',  dot: 'bg-amber-400' },
  { status: 'closed-won',   label: 'Conclu',       color: 'border-emerald-200 bg-emerald-50', dot: 'bg-emerald-500' },
  { status: 'closed-lost',  label: 'Perdu',        color: 'border-slate-200 bg-slate-50',  dot: 'bg-slate-400' },
]

const STATUS_BADGE: Record<DealStatus, string> = {
  lead:          'bg-blue-100 text-blue-700',
  negotiation:   'bg-amber-100 text-amber-700',
  'closed-won':  'bg-emerald-100 text-emerald-700',
  'closed-lost': 'bg-slate-100 text-slate-600',
}

function DealCard({ deal, onStatusChange }: { deal: ApiDeal; onStatusChange: (id: string, status: DealStatus) => void }) {
  const nextStatuses = COLUMNS.map(c => c.status).filter(s => s !== deal.status)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="border border-noir-200 bg-white p-4 shadow-sm space-y-3"
    >
      {/* Vehicle */}
      <div className="flex items-start gap-2">
        <Car01Icon className="h-3.5 w-3.5 text-noir-400 mt-0.5 flex-shrink-0" />
        <p className="text-sm font-semibold text-noir-950 leading-tight">
          {deal.vehicleName ?? 'Véhicule inconnu'}
        </p>
      </div>

      {/* Customer */}
      <div className="flex items-center gap-2">
        <UserIcon className="h-3.5 w-3.5 text-noir-400 flex-shrink-0" />
        <p className="text-xs text-noir-600">{deal.customerName ?? '—'}</p>
      </div>

      {/* Price */}
      <div className="flex items-center gap-2">
        <DollarCircleIcon className="h-3.5 w-3.5 text-gold-500 flex-shrink-0" />
        <p className="text-sm font-bold text-noir-950">{formatPrice(deal.price)}</p>
      </div>

      {/* Move to */}
      <div className="pt-1 border-t border-noir-100">
        <p className="text-[10px] uppercase tracking-wider text-noir-400 mb-1.5">Déplacer vers</p>
        <div className="flex flex-wrap gap-1">
          {nextStatuses.map((s) => {
            const col = COLUMNS.find(c => c.status === s)!
            return (
              <button
                key={s}
                onClick={() => onStatusChange(deal.id, s)}
                className={cn(
                  'px-2 py-1 text-[10px] font-semibold uppercase tracking-wider border transition-colors',
                  STATUS_BADGE[s],
                  'hover:opacity-80'
                )}
              >
                {col.label}
              </button>
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}

export function MotorsSales() {
  const [deals, setDeals] = useState<ApiDeal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const toast = useToast()

  const fetchDeals = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await dealsApi.list({ limit: 100 })
      setDeals(res.data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur de chargement')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { void fetchDeals() }, [fetchDeals])

  const handleStatusChange = async (id: string, status: DealStatus) => {
    // Optimistic update
    setDeals((prev) => prev.map((d) => d.id === id ? { ...d, status } : d))
    try {
      await dealsApi.update(id, { status })
      toast(`Affaire déplacée vers ${COLUMNS.find(c => c.status === status)?.label}`)
    } catch (e) {
      toast(e instanceof Error ? e.message : 'Erreur', 'error')
      void fetchDeals() // revert
    }
  }

  const byStatus = (status: DealStatus) => deals.filter(d => d.status === status)
  const totalActive = deals.filter(d => d.status === 'lead' || d.status === 'negotiation').length
  const totalWon = deals.filter(d => d.status === 'closed-won').reduce((sum, d) => sum + d.price, 0)

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
          <h1 className="font-motors-display text-2xl font-medium text-noir-950">Pipeline des ventes</h1>
          <p className="mt-1 text-sm text-noir-500">
            {totalActive} affaire{totalActive !== 1 ? 's' : ''} en cours · {formatPrice(totalWon)} conclus
          </p>
        </div>
        <button className="inline-flex items-center gap-2 bg-noir-950 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-noir-800 transition-colors">
          <Add01Icon className="h-4 w-4" />
          Nouvelle affaire
        </button>
      </div>

      {error && (
        <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loading03Icon className="h-8 w-8 animate-spin text-gold-400" />
        </div>
      ) : (
        /* Kanban board */
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {COLUMNS.map((col) => {
            const cards = byStatus(col.status)
            const colTotal = cards.reduce((sum, d) => sum + d.price, 0)
            return (
              <div key={col.status} className="flex flex-col gap-3">
                {/* Column header */}
                <div className={cn('border px-3 py-2.5 flex items-center justify-between', col.color)}>
                  <div className="flex items-center gap-2">
                    <span className={cn('h-2 w-2 rounded-full', col.dot)} />
                    <span className="text-xs font-bold uppercase tracking-wider text-noir-700">
                      {col.label}
                    </span>
                    <span className="flex h-5 w-5 items-center justify-center bg-white/70 text-[10px] font-bold text-noir-600 rounded-full">
                      {cards.length}
                    </span>
                  </div>
                  {colTotal > 0 && (
                    <span className="text-[10px] font-semibold text-noir-500">{formatPrice(colTotal)}</span>
                  )}
                </div>

                {/* Cards */}
                <div className="flex flex-col gap-2 min-h-[120px]">
                  {cards.length === 0 ? (
                    <div className="flex items-center justify-center py-8 border border-dashed border-noir-200 text-xs text-noir-400">
                      Aucune affaire
                    </div>
                  ) : (
                    cards.map((deal) => (
                      <DealCard key={deal.id} deal={deal} onStatusChange={handleStatusChange} />
                    ))
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
