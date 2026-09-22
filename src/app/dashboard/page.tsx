'use client'

import { Link } from '@/lib/router'
import { useQuery } from '@tanstack/react-query'
import {
  Car01Icon,
  Home01Icon,
  Key01Icon,
  Wrench01Icon,
  ChartUpIcon,
  UserMultiple02Icon,
  DollarCircleIcon,
  ArrowUpRight01Icon,
  ArrowRight01Icon,
} from 'hugeicons-react'
import { cn, formatPrice, formatNumber } from '@/lib/utils'
import { overviewApi } from '@/lib/api'
import { DashPageHeader } from '@/components/dashboard'

export function DashboardHome() {
  const { data } = useQuery({
    queryKey: ['overview', 'holding'],
    queryFn: overviewApi.holding,
  })

  const totalVehicles = data?.vehicleTotal ?? 0
  const totalCustomers = data?.customerTotal ?? 0
  const totalDeals = data?.dealTotal ?? 0
  const totalRevenue = data?.totalRevenue ?? 0

  const kpis = [
    { label: "Chiffre d'affaires", value: formatPrice(totalRevenue), sub: 'Affaires conclues', icon: DollarCircleIcon },
    { label: 'Entreprises actives', value: '1 / 4', sub: 'Phase 1 — Motors', icon: ChartUpIcon },
    { label: 'Clients totaux', value: formatNumber(totalCustomers), sub: 'Enregistrés', icon: UserMultiple02Icon },
    { label: 'Transactions', value: formatNumber(totalDeals), sub: `${data?.closedWon ?? 0} conclues`, icon: ArrowUpRight01Icon },
  ]

  const businessCards = [
    {
      name: 'Mansour Motors',
      icon: Car01Icon,
      stats: { revenue: totalRevenue, items: totalVehicles, clients: totalCustomers },
      href: '/dashboard/motors' as const,
      active: true,
    },
    { name: 'Mansour Immobilier', icon: Home01Icon, stats: null, href: '/dashboard' as const, active: false },
    { name: 'Mansour Location', icon: Key01Icon, stats: null, href: '/dashboard' as const, active: false },
    { name: 'Mansour Construction', icon: Wrench01Icon, stats: null, href: '/dashboard' as const, active: false },
  ]

  return (
    <div className="space-y-8">
      <DashPageHeader
        title="Vue d'ensemble"
        lead="Performance globale du groupe Mansour Holding"
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="mm-panel mm-panel-pad">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-[var(--mm-grey)]">{kpi.label}</p>
              <div className="border border-[var(--mm-line)] bg-[var(--mm-off)] p-2 text-[var(--mm-ink)]">
                <kpi.icon className="h-4 w-4" aria-hidden="true" />
              </div>
            </div>
            <p className="mt-3 text-2xl font-light tracking-tight tabular-nums">{kpi.value}</p>
            <p className="mt-1 text-xs text-[var(--mm-grey)]">{kpi.sub}</p>
          </div>
        ))}
      </div>

      <div>
        <h2 className="mm-panel-title mb-4">Entreprises</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {businessCards.map((biz) => (
            <Link
              key={biz.name}
              to={biz.href}
              className={cn(
                'group mm-panel mm-panel-pad transition-colors',
                biz.active
                  ? 'hover:bg-[var(--mm-off)]/40'
                  : 'opacity-50 pointer-events-none'
              )}
              aria-disabled={!biz.active}
            >
              <div className="flex items-start justify-between">
                <div className="border border-[var(--mm-line)] bg-[var(--mm-off)] p-3 text-[var(--mm-ink)]">
                  <biz.icon className="h-5 w-5" aria-hidden="true" />
                </div>
                {biz.active && (
                  <ArrowRight01Icon className="h-4 w-4 text-[var(--mm-grey)] opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true" />
                )}
              </div>
              <h3 className="mt-4 text-lg font-medium tracking-tight">{biz.name}</h3>
              {biz.stats ? (
                <div className="mt-3 grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-lg font-medium tabular-nums">{formatPrice(biz.stats.revenue)}</p>
                    <p className="text-xs text-[var(--mm-grey)]">Revenus</p>
                  </div>
                  <div>
                    <p className="text-lg font-medium tabular-nums">{biz.stats.items}</p>
                    <p className="text-xs text-[var(--mm-grey)]">Véhicules</p>
                  </div>
                  <div>
                    <p className="text-lg font-medium tabular-nums">{biz.stats.clients}</p>
                    <p className="text-xs text-[var(--mm-grey)]">Clients</p>
                  </div>
                </div>
              ) : (
                <p className="mt-3 text-sm mm-muted">Bientôt disponible</p>
              )}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DashboardHome
