import { Link } from '@tanstack/react-router'
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
import { vehiclesApi, customersApi, dealsApi } from '@/lib/api'

export function DashboardHome() {
  const { data: vehiclesData } = useQuery({
    queryKey: ['vehicles', 1, 'all', ''],
    queryFn: () => vehiclesApi.list({ page: 1, limit: 1 }),
  })
  const { data: customersData } = useQuery({
    queryKey: ['customers', 1, ''],
    queryFn: () => customersApi.list({ page: 1, limit: 1 }),
  })
  const { data: summaryData } = useQuery({
    queryKey: ['deals-summary'],
    queryFn: () => dealsApi.summary(),
  })
  const { data: dealsData } = useQuery({
    queryKey: ['deals'],
    queryFn: () => dealsApi.list({ limit: 1 }),
  })

  const totalVehicles = vehiclesData?.pagination?.total ?? 0
  const totalCustomers = customersData?.pagination?.total ?? 0
  const totalDeals = dealsData?.pagination?.total ?? 0
  const totalRevenue = summaryData?.totalRevenue ?? 0

  const kpis = [
    { label: 'Chiffre d\'affaires', value: formatPrice(totalRevenue), sub: 'Affaires conclues', icon: DollarCircleIcon, color: 'text-emerald-700 bg-emerald-50' },
    { label: 'Entreprises actives', value: '1 / 4', sub: 'Phase 1 — Motors', icon: ChartUpIcon, color: 'text-blue-700 bg-blue-50' },
    { label: 'Clients totaux', value: formatNumber(totalCustomers), sub: 'Enregistrés', icon: UserMultiple02Icon, color: 'text-gold-700 bg-gold-50' },
    { label: 'Transactions', value: formatNumber(totalDeals), sub: `${summaryData?.['closed-won'] ?? 0} conclues`, icon: ArrowUpRight01Icon, color: 'text-amber-700 bg-amber-50' },
  ]

  const businessCards = [
    {
      name: 'Mansour Motors',
      icon: Car01Icon,
      color: 'bg-gold-400',
      stats: { revenue: totalRevenue, items: totalVehicles, clients: totalCustomers },
      href: '/dashboard/motors' as const,
      active: true,
    },
    { name: 'Mansour Immobilier', icon: Home01Icon, color: 'bg-slate-300', stats: null, href: '/dashboard' as const, active: false },
    { name: 'Mansour Location', icon: Key01Icon, color: 'bg-slate-300', stats: null, href: '/dashboard' as const, active: false },
    { name: 'Mansour Construction', icon: Wrench01Icon, color: 'bg-amber-300', stats: null, href: '/dashboard' as const, active: false },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-noir-950">Vue d'ensemble</h1>
        <p className="mt-1 text-sm text-noir-500">Performance globale du groupe Mansour Holding</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="border border-noir-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-noir-600">{kpi.label}</p>
              <div className={cn('p-2', kpi.color)}><kpi.icon className="h-4 w-4" /></div>
            </div>
            <p className="mt-3 text-2xl font-bold text-noir-950">{kpi.value}</p>
            <p className="mt-1 text-xs text-noir-500">{kpi.sub}</p>
          </div>
        ))}
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold text-noir-950">Entreprises</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {businessCards.map((biz) => (
            <Link
              key={biz.name}
              to={biz.href}
              className={cn(
                'group border bg-white p-6 shadow-sm transition-all',
                biz.active
                  ? 'border-noir-200 hover:shadow-md hover:-translate-y-0.5 cursor-pointer'
                  : 'border-noir-200/50 opacity-50 cursor-default'
              )}
              disabled={!biz.active}
            >
              <div className="flex items-start justify-between">
                <div className={cn('p-3 text-noir-950', biz.color)}><biz.icon className="h-5 w-5" /></div>
                {biz.active && <ArrowRight01Icon className="h-4 w-4 text-noir-600 opacity-0 transition-opacity group-hover:opacity-100" />}
              </div>
              <h3 className="mt-4 font-bold text-noir-950">{biz.name}</h3>
              {biz.stats ? (
                <div className="mt-3 grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-lg font-bold text-noir-900">{formatPrice(biz.stats.revenue)}</p>
                    <p className="text-xs text-noir-500">Revenus</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-noir-900">{biz.stats.items}</p>
                    <p className="text-xs text-noir-500">Véhicules</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-noir-900">{biz.stats.clients}</p>
                    <p className="text-xs text-noir-500">Clients</p>
                  </div>
                </div>
              ) : (
                <p className="mt-3 text-sm text-noir-500">Bientôt disponible</p>
              )}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
