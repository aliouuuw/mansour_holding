import { Link } from '@tanstack/react-router'
import {
  Car,
  Home,
  Key,
  HardHat,
  TrendingUp,
  Users,
  DollarSign,
  ArrowUpRight,
  ArrowRight,
} from 'lucide-react'
import { cn, formatPrice, formatNumber } from '@/lib/utils'

const businessCards = [
  {
    name: 'Mansour Motors',
    icon: Car,
    color: 'bg-gold-400',
    stats: { revenue: 178500000, items: 8, clients: 6 },
    href: '/dashboard/motors',
    active: true,
  },
  {
    name: 'Mansour Immobilier',
    icon: Home,
    color: 'bg-steel-400',
    stats: { revenue: 0, items: 0, clients: 0 },
    href: '/dashboard',
    active: false,
  },
  {
    name: 'Mansour Location',
    icon: Key,
    color: 'bg-silver-400',
    stats: { revenue: 0, items: 0, clients: 0 },
    href: '/dashboard',
    active: false,
  },
  {
    name: 'Mansour Construction',
    icon: HardHat,
    color: 'bg-amber-400',
    stats: { revenue: 0, items: 0, clients: 0 },
    href: '/dashboard',
    active: false,
  },
]

const kpis = [
  { label: 'Chiffre d\'affaires total', value: formatPrice(178500000), change: '+12.5%', icon: DollarSign, color: 'text-jade-700 bg-jade-50' },
  { label: 'Entreprises actives', value: '1 / 7', change: 'Phase 1', icon: TrendingUp, color: 'text-steel-700 bg-steel-50' },
  { label: 'Clients totaux', value: formatNumber(6), change: '+3 ce mois', icon: Users, color: 'text-gold-700 bg-gold-50' },
  { label: 'Transactions', value: formatNumber(8), change: '2 conclues', icon: ArrowUpRight, color: 'text-amber-700 bg-amber-50' },
]

export function DashboardHome() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-noir-950">Vue d'ensemble</h1>
        <p className="mt-1 text-sm text-noir-500">
          Performance globale du groupe Mansour Holding
        </p>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="rounded-sm border border-noir-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-noir-600">{kpi.label}</p>
              <div className={cn('rounded-sm p-2', kpi.color)}>
                <kpi.icon className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-3 text-2xl font-bold text-noir-950">{kpi.value}</p>
            <p className="mt-1 text-xs font-medium text-jade-600">{kpi.change}</p>
          </div>
        ))}
      </div>

      {/* Business Cards */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-noir-950">Entreprises</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {businessCards.map((biz) => (
            <Link
              key={biz.name}
              to={biz.href}
              className={cn(
                'group rounded-sm border bg-white p-6 shadow-sm transition-all',
                biz.active
                  ? 'border-noir-200 hover:shadow-md hover:-translate-y-0.5 cursor-pointer'
                  : 'border-noir-200/50 opacity-50 cursor-default'
              )}
              disabled={!biz.active}
            >
              <div className="flex items-start justify-between">
                <div className={cn('rounded-sm p-3 text-noir-950', biz.color)}>
                  <biz.icon className="h-5 w-5" />
                </div>
                {biz.active && (
                  <ArrowRight className="h-4 w-4 text-noir-600 opacity-0 transition-opacity group-hover:opacity-100" />
                )}
              </div>
              <h3 className="mt-4 font-bold text-noir-950">{biz.name}</h3>
              {biz.active ? (
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
