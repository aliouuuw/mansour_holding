'use client'

import { Link } from '@/lib/router'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import {
  Car01Icon,
  UserMultiple02Icon,
  DollarCircleIcon,
  Add01Icon,
  ArrowRight01Icon,
  ShoppingCart01Icon,
} from 'hugeicons-react'
import { formatPrice, formatNumber } from '@/lib/utils'
import { DashButton, DashPageHeader, dashDealStatusTone } from '@/components/dashboard'
import { overviewApi } from '@/lib/api'

const overviewActions = (
  <>
    <DashButton to="/dashboard/motors/inventory" variant="soft">
      <Car01Icon className="h-4 w-4" aria-hidden="true" /> Inventaire
    </DashButton>
    <DashButton to="/dashboard/motors/sales/new">
      <Add01Icon className="h-4 w-4" aria-hidden="true" /> Nouvelle affaire
    </DashButton>
  </>
)

const dealStatusLabel = {
  lead: 'Prospect',
  negotiation: 'Négociation',
  'closed-won': 'Conclu',
  'closed-lost': 'Perdu',
} as const

export function MotorsDashboard() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['overview', 'motors'],
    queryFn: overviewApi.motors,
  })

  const header = (
    <DashPageHeader
      title="Mansour Motors"
      lead="Tableau de bord du concessionnaire"
      actions={overviewActions}
    />
  )

  /* no zeros while loading or after a failure: a 0 FCFA revenue would read as a fact */
  if (isLoading) {
    return (
      <div className="space-y-8" aria-busy="true">
        {header}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="mm-panel mm-panel-pad min-h-28" aria-hidden="true">
              <div className="mm-skel w-24" />
              <div className="mm-skel mt-4 h-7 w-16" />
            </div>
          ))}
        </div>
        <p className="sr-only">Chargement</p>
      </div>
    )
  }
  if (error) {
    return (
      <div className="space-y-8">
        {header}
        <div className="mm-alert-error" role="alert">Chiffres indisponibles : {(error as Error).message}</div>
      </div>
    )
  }

  const vehicles = data?.availableVehicles ?? []
  const totalVehicles = data?.vehicleTotal ?? 0
  const availableCount = data?.availableCount ?? 0
  const totalCustomers = data?.customerTotal ?? 0
  const deals = data?.recentDeals ?? []
  const activeDeals = data?.activeDeals ?? 0
  const totalRevenue = data?.totalRevenue ?? 0

  const kpis = [
    {
      label: 'Disponibles',
      value: formatNumber(availableCount),
      total: `${totalVehicles} au total`,
      icon: Car01Icon,
      href: '/dashboard/motors/inventory' as const,
    },
    {
      label: 'Affaires en cours',
      value: formatNumber(activeDeals),
      total: `${data?.dealTotal ?? 0} total`,
      icon: ShoppingCart01Icon,
      href: '/dashboard/motors/sales' as const,
    },
    {
      label: 'Revenus conclus',
      value: formatPrice(totalRevenue),
      total: 'Affaires gagnées',
      icon: DollarCircleIcon,
      href: '/dashboard/motors/sales' as const,
    },
    {
      label: 'Clients',
      value: formatNumber(totalCustomers),
      total: 'Enregistrés',
      icon: UserMultiple02Icon,
      href: '/dashboard/motors/customers' as const,
    },
  ]

  const pipelineStages = [
    { label: 'Prospects', count: data?.lead ?? 0, tone: dashDealStatusTone.lead },
    { label: 'Négociation', count: data?.negotiation ?? 0, tone: dashDealStatusTone.negotiation },
    { label: 'Conclu', count: data?.['closed-won'] ?? 0, tone: dashDealStatusTone['closed-won'] },
    { label: 'Perdu', count: data?.['closed-lost'] ?? 0, tone: dashDealStatusTone['closed-lost'] },
  ]
  const maxPipeline = Math.max(...pipelineStages.map(s => s.count), 1)

  // Top vehicles for the sidebar (first 3 available)
  const topVehicles = vehicles

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        {header}
      </motion.div>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi, index) => (
          <Link
            key={kpi.label}
            to={kpi.href}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="group mm-panel mm-panel-pad cursor-pointer transition-colors hover:bg-[var(--mm-off)]/40"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="mm-section-label mb-0">{kpi.label}</p>
                  <p className="mt-2 text-2xl font-semibold tracking-tight">{kpi.value}</p>
                  <p className="mt-1 text-xs mm-muted">{kpi.total}</p>
                </div>
                <div className="border border-[var(--mm-line)] bg-[var(--mm-off)] p-2.5 text-[var(--mm-ink)]">
                  <kpi.icon className="h-5 w-5" aria-hidden="true" />
                </div>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="grid gap-6 lg:grid-cols-5"
      >
        {/* Recent Deals */}
        <div className="lg:col-span-3 mm-panel overflow-hidden">
          <div className="mm-panel-head">
            <h2>Dernières affaires</h2>
            <Link to="/dashboard/motors/sales" className="mm-link uppercase tracking-wider">
              Voir tout
            </Link>
          </div>
          <div className="divide-y divide-[var(--mm-line)]">
            {deals.length === 0 ? (
              <div className="mm-empty">Aucune affaire pour le moment</div>
            ) : (
              deals.map((deal) => (
                <Link
                  key={deal.id}
                  to="/dashboard/motors/sales/$dealId"
                  params={{ dealId: deal.id }}
                  className="flex items-center gap-4 px-6 py-4 text-[inherit] no-underline transition-colors hover:bg-[var(--mm-off)]/50"
                >
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium">{deal.vehicleName ?? '—'}</p>
                    <p className="text-xs mm-muted">{deal.customerName ?? '—'}</p>
                  </div>
                  <p className="text-sm font-semibold">{formatPrice(deal.price)}</p>
                  <span className="flex items-center gap-1.5 text-xs font-medium text-[var(--mm-grey)]">
                    <span className="h-2 w-2" style={{ background: dashDealStatusTone[deal.status] }} aria-hidden="true" />
                    {dealStatusLabel[deal.status]}
                  </span>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-2 space-y-6">
          {/* Pipeline */}
          <div className="mm-panel mm-panel-pad">
            <h2 className="mm-panel-title">Pipeline</h2>
            <div className="mt-5 space-y-4">
              {pipelineStages.map((stage, index) => (
                <motion.div
                  key={stage.label}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 + index * 0.08 }}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-3">
                      <div className="h-2.5 w-2.5" style={{ background: stage.tone }} aria-hidden="true" />
                      <span className="text-sm">{stage.label}</span>
                    </div>
                    <span className="text-sm font-semibold">{stage.count}</span>
                  </div>
                  <div className="mm-progress">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(stage.count / maxPipeline) * 100}%` }}
                      transition={{ duration: 0.8, delay: 0.6 + index * 0.08, ease: [0.16, 1, 0.3, 1] }}
                      style={{ background: stage.tone }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
            <Link to="/dashboard/motors/sales" className="mm-link mt-5 inline-flex items-center gap-1.5 text-sm">
              Voir le pipeline <ArrowRight01Icon className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          {/* Top Vehicles */}
          <div className="mm-panel mm-panel-pad">
            <div className="flex items-center justify-between gap-3">
              <h2 className="mm-panel-title mb-0">Véhicules disponibles</h2>
              <Link to="/dashboard/motors/inventory" className="mm-link text-xs uppercase tracking-wider">
                Voir tout
              </Link>
            </div>
            <div className="mt-4 space-y-2">
              {topVehicles.length === 0 ? (
                <p className="mm-empty py-4">Aucun véhicule disponible</p>
              ) : (
                topVehicles.map((v, index) => (
                  <motion.div
                    key={v.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.6 + index * 0.05 }}
                  >
                    <Link to="/dashboard/motors/inventory/$vehicleId" params={{ vehicleId: v.id }}
                      className="-mx-2 flex items-center gap-3 rounded-[var(--mm-r)] p-2 transition-colors hover:bg-[var(--mm-off)]/50">
                      {v.images?.[0] ? (
                        <img src={v.images[0]} alt={`${v.make} ${v.model}`} className="h-12 w-16 rounded-[var(--mm-r)] object-cover" loading="lazy" decoding="async" />
                      ) : (
                        <div className="flex h-12 w-16 items-center justify-center rounded-[var(--mm-r)] bg-[var(--mm-off)]"><Car01Icon className="h-4 w-4 text-[var(--mm-grey-muted)]" aria-hidden="true" /></div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-sm font-medium">{v.make} {v.model}</p>
                        <p className="text-xs mm-muted">{v.year} · {formatPrice(v.price)}</p>
                      </div>
                      <ArrowRight01Icon className="h-4 w-4 text-[var(--mm-grey-muted)]" aria-hidden="true" />
                    </Link>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default MotorsDashboard
