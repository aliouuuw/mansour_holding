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
import { cn, formatPrice, formatNumber } from '@/lib/utils'
import { DashButton, DashPageHeader } from '@/components/dashboard'
import { overviewApi } from '@/lib/api'

export function MotorsDashboard() {
  const { data } = useQuery({
    queryKey: ['overview', 'motors'],
    queryFn: overviewApi.motors,
  })

  const vehicles = data?.availableVehicles ?? []
  const totalVehicles = data?.vehicleTotal ?? 0
  const availableCount = data?.availableCount ?? 0
  const totalCustomers = data?.customerTotal ?? 0
  const deals = data?.recentDeals ?? []
  const activeDeals = data?.activeDeals ?? 0
  const totalRevenue = data?.totalRevenue ?? 0

  const kpis = [
    {
      label: 'Véhicules en stock',
      value: formatNumber(availableCount),
      total: `${totalVehicles} total`,
      icon: Car01Icon,
      color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      href: '/dashboard/motors/inventory' as const,
    },
    {
      label: 'Affaires en cours',
      value: formatNumber(activeDeals),
      total: `${data?.dealTotal ?? 0} total`,
      icon: ShoppingCart01Icon,
      color: 'text-amber-700 bg-amber-50 border-amber-200',
      href: '/dashboard/motors/sales' as const,
    },
    {
      label: 'Revenus conclus',
      value: formatPrice(totalRevenue),
      total: 'Affaires gagnées',
      icon: DollarCircleIcon,
      color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      href: '/dashboard/motors/sales' as const,
    },
    {
      label: 'Clients',
      value: formatNumber(totalCustomers),
      total: 'Enregistrés',
      icon: UserMultiple02Icon,
      color: 'border border-[var(--mm-line)] bg-[var(--mm-off)] text-[var(--mm-ink)]',
      href: '/dashboard/motors/customers' as const,
    },
  ]

  const pipelineStages = [
    { label: 'Prospects', count: data?.lead ?? 0, color: 'bg-blue-500' },
    { label: 'Négociation', count: data?.negotiation ?? 0, color: 'bg-amber-500' },
    { label: 'Conclu', count: data?.['closed-won'] ?? 0, color: 'bg-emerald-500' },
    { label: 'Perdu', count: data?.['closed-lost'] ?? 0, color: 'bg-slate-400' },
  ]
  const maxPipeline = Math.max(...pipelineStages.map(s => s.count), 1)

  // Top vehicles for the sidebar (first 3 available)
  const topVehicles = vehicles

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <DashPageHeader
          title="Mansour Motors"
          lead="Tableau de bord du concessionnaire"
          actions={
            <>
              <DashButton to="/dashboard/motors/inventory" variant="soft">
                <Car01Icon className="h-4 w-4" aria-hidden="true" /> Inventaire
              </DashButton>
              <DashButton to="/dashboard/motors/sales/new">
                <Add01Icon className="h-4 w-4" aria-hidden="true" /> Nouvelle affaire
              </DashButton>
            </>
          }
        />
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
                  <p className="text-sm font-medium text-noir-600">{kpi.label}</p>
                  <p className="mt-2 text-2xl font-bold text-noir-950">{kpi.value}</p>
                  <p className="mt-1 text-xs text-noir-500">{kpi.total}</p>
                </div>
                <div className={cn('border p-2.5 transition-colors', kpi.color)}>
                  <kpi.icon className="h-5 w-5" />
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
          <div className="divide-y divide-noir-100">
            {deals.length === 0 ? (
              <div className="px-6 py-12 text-center text-sm text-noir-400">Aucune affaire pour le moment</div>
            ) : (
              deals.map((deal, index) => (
                <motion.div
                  key={deal.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-surface-dim/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-noir-900 truncate">{deal.vehicleName ?? '—'}</p>
                    <p className="text-xs text-noir-500">{deal.customerName ?? '—'}</p>
                  </div>
                  <p className="text-sm font-semibold text-noir-950">{formatPrice(deal.price)}</p>
                  <span className={cn('px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider',
                    deal.status === 'closed-won' ? 'bg-emerald-100 text-emerald-700' :
                    deal.status === 'closed-lost' ? 'bg-slate-100 text-slate-600' :
                    deal.status === 'negotiation' ? 'bg-amber-100 text-amber-700' :
                    'bg-blue-100 text-blue-700'
                  )}>
                    {deal.status === 'lead' ? 'Prospect' : deal.status === 'negotiation' ? 'Négo' : deal.status === 'closed-won' ? 'Conclu' : 'Perdu'}
                  </span>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-2 space-y-6">
          {/* Pipeline */}
          <div className="border border-noir-200 bg-white p-6 shadow-sm">
            <h2 className="font-motors-display text-lg font-medium text-noir-950">Pipeline</h2>
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
                      <div className={cn('h-2.5 w-2.5', stage.color)} />
                      <span className="text-sm text-noir-700">{stage.label}</span>
                    </div>
                    <span className="text-sm font-semibold text-noir-950">{stage.count}</span>
                  </div>
                  <div className="h-1.5 w-full bg-noir-100 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(stage.count / maxPipeline) * 100}%` }}
                      transition={{ duration: 0.8, delay: 0.6 + index * 0.08, ease: [0.16, 1, 0.3, 1] }}
                      className={cn('h-full', stage.color)}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
            <Link to="/dashboard/motors/sales"
              className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-gold-600 hover:text-gold-700 transition-colors">
              Voir le pipeline <ArrowRight01Icon className="h-4 w-4" />
            </Link>
          </div>

          {/* Top Vehicles */}
          <div className="border border-noir-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="font-motors-display text-lg font-medium text-noir-950">Véhicules disponibles</h2>
              <Link to="/dashboard/motors/inventory" className="text-xs font-medium uppercase tracking-wider text-gold-600 hover:text-gold-700 transition-colors">
                Voir tout
              </Link>
            </div>
            <div className="mt-4 space-y-2">
              {topVehicles.length === 0 ? (
                <p className="text-sm text-noir-400 py-4 text-center">Aucun véhicule disponible</p>
              ) : (
                topVehicles.map((v, index) => (
                  <motion.div
                    key={v.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.6 + index * 0.05 }}
                  >
                    <Link to="/dashboard/motors/inventory/$vehicleId" params={{ vehicleId: v.id }}
                      className="flex items-center gap-3 p-2 -mx-2 hover:bg-surface-dim transition-colors">
                      {v.images?.[0] ? (
                        <img src={v.images[0]} alt={`${v.make} ${v.model}`} className="h-12 w-16 object-cover" loading="lazy" decoding="async" />
                      ) : (
                        <div className="h-12 w-16 bg-noir-100 flex items-center justify-center"><Car01Icon className="h-4 w-4 text-noir-300" /></div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-sm font-medium text-noir-900">{v.make} {v.model}</p>
                        <p className="text-xs text-noir-500">{v.year} · {formatPrice(v.price)}</p>
                      </div>
                      <ArrowRight01Icon className="h-4 w-4 text-noir-300" />
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
