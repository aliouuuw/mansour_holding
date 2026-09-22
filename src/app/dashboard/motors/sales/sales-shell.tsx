'use client'

import { Suspense, useCallback } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { Add01Icon } from 'hugeicons-react'
import { formatPrice } from '@/lib/utils'
import { DashBreadcrumbs, DashButton, DashPageHeader } from '@/components/dashboard'
import { dealsApi } from '@/lib/api'
import type { DealsBoard } from '@/server/deals'
import { MotorsSalesBoard } from './board'
import { MotorsSalesList } from './list'

type SalesView = 'board' | 'list'

function parseView(raw: string | null): SalesView {
  return raw === 'list' ? 'list' : 'board'
}

function SalesPageContent({ initial }: { initial: DealsBoard }) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const view = parseView(searchParams.get('view'))

  const { data: board } = useQuery({
    queryKey: ['deals-board'],
    queryFn: dealsApi.board,
    initialData: initial,
    staleTime: 30_000,
  })

  const setView = useCallback(
    (next: SalesView) => {
      const params = new URLSearchParams(searchParams.toString())
      if (next === 'board') params.delete('view')
      else params.set('view', next)
      const qs = params.toString()
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
    },
    [pathname, router, searchParams]
  )

  const totalActive = board.activeCount
  const totalWon = board.wonRevenue

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-6">
      <DashBreadcrumbs
        items={[
          { label: 'Mansour Motors', to: '/dashboard/motors' },
          { label: 'Ventes' },
        ]}
      />
      <DashPageHeader
        title="Ventes"
        lead={`${totalActive} affaire${totalActive !== 1 ? 's' : ''} en cours · ${formatPrice(totalWon)} conclus`}
        actions={
          <DashButton to="/dashboard/motors/sales/new">
            <Add01Icon className="h-4 w-4" aria-hidden="true" /> Nouvelle affaire
          </DashButton>
        }
      />

      <div className="mm-seg-scroll w-full sm:w-auto">
        <div className="mm-seg" role="tablist" aria-label="Vue des ventes">
          <button
            type="button"
            role="tab"
            aria-selected={view === 'board'}
            aria-pressed={view === 'board'}
            onClick={() => setView('board')}
          >
            Pipeline
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={view === 'list'}
            aria-pressed={view === 'list'}
            onClick={() => setView('list')}
          >
            Liste
          </button>
        </div>
      </div>

      {view === 'list' ? <MotorsSalesList /> : <MotorsSalesBoard initial={initial} />}
    </motion.div>
  )
}

export function MotorsSalesPage({ initial }: { initial: DealsBoard }) {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-20">
          <div className="mm-spinner" role="status" aria-label="Chargement" />
        </div>
      }
    >
      <SalesPageContent initial={initial} />
    </Suspense>
  )
}
