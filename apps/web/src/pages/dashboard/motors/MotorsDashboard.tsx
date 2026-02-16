import { Link } from '@tanstack/react-router'
import {
  Car,
  Users,
  DollarSign,
  Plus,
  ArrowRight,
  ShoppingCart,
  Calendar,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react'
import { cn, formatPrice, formatNumber } from '@/lib/utils'
import { vehicles, deals, customers, recentActivity } from '@/data/mock'

const kpis = [
  {
    label: 'Véhicules en stock',
    value: formatNumber(vehicles.filter((v) => v.status === 'available').length),
    total: `${vehicles.length} total`,
    icon: Car,
    color: 'text-steel-700 bg-steel-50',
  },
  {
    label: 'Affaires en cours',
    value: formatNumber(deals.filter((d) => !d.status.startsWith('closed')).length),
    total: `${deals.length} total`,
    icon: ShoppingCart,
    color: 'text-amber-700 bg-amber-50',
  },
  {
    label: 'Revenus du mois',
    value: formatPrice(111500000),
    total: '+23% vs mois dernier',
    icon: DollarSign,
    color: 'text-jade-700 bg-jade-50',
  },
  {
    label: 'Clients actifs',
    value: formatNumber(customers.length),
    total: '3 nouveaux ce mois',
    icon: Users,
    color: 'text-gold-700 bg-gold-50',
  },
]

const activityIcons: Record<string, typeof Car> = {
  sale: CheckCircle2,
  lead: AlertCircle,
  vehicle: Car,
  appointment: Calendar,
}

const activityColors: Record<string, string> = {
  sale: 'text-jade-700 bg-jade-50',
  lead: 'text-steel-700 bg-steel-50',
  vehicle: 'text-amber-700 bg-amber-50',
  appointment: 'text-gold-700 bg-gold-50',
}

export function MotorsDashboard() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-noir-950">Mansour Motors</h1>
          <p className="mt-1 text-sm text-noir-500">Tableau de bord du concessionnaire</p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/dashboard/motors/inventory"
            className="inline-flex items-center gap-2 rounded-sm border border-noir-200 bg-white px-4 py-2 text-sm font-medium text-noir-900 shadow-sm hover:bg-surface-dim transition-colors"
          >
            <Car className="h-4 w-4" />
            Inventaire
          </Link>
          <Link
            to="/dashboard/motors/sales"
            className="inline-flex items-center gap-2 rounded-sm bg-gold-400 px-4 py-2 text-sm font-semibold text-noir-950 shadow-sm hover:bg-gold-300 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Nouvelle affaire
          </Link>
        </div>
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
            <p className="mt-1 text-xs text-noir-500">{kpi.total}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Recent Activity */}
        <div className="lg:col-span-3 rounded-sm border border-noir-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-noir-200 px-6 py-4">
            <h2 className="font-semibold text-noir-950">Activité récente</h2>
            <span className="text-xs text-noir-500">Aujourd'hui</span>
          </div>
          <div className="divide-y divide-border">
            {recentActivity.map((activity) => {
              const Icon = activityIcons[activity.type] ?? Car
              const color = activityColors[activity.type] ?? 'text-slate-600 bg-slate-50'
              return (
                <div key={activity.id} className="flex items-start gap-4 px-6 py-4">
                  <div className={cn('mt-0.5 rounded-sm p-2', color)}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-noir-900">{activity.message}</p>
                    <p className="mt-0.5 text-xs text-noir-500">{activity.time}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Quick Stats / Pipeline */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-sm border border-noir-200 bg-white p-6 shadow-sm">
            <h2 className="font-semibold text-noir-950">Pipeline des ventes</h2>
            <div className="mt-4 space-y-3">
              {[
                { label: 'Prospects', count: deals.filter((d) => d.status === 'prospect').length, color: 'bg-steel-500' },
                { label: 'Négociation', count: deals.filter((d) => d.status === 'negotiation').length, color: 'bg-amber-500' },
                { label: 'Essai', count: deals.filter((d) => d.status === 'test-drive').length, color: 'bg-gold-500' },
                { label: 'Conclu', count: deals.filter((d) => d.status === 'closed-won').length, color: 'bg-jade-500' },
                { label: 'Perdu', count: deals.filter((d) => d.status === 'closed-lost').length, color: 'bg-garnet-500' },
              ].map((stage) => (
                <div key={stage.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn('h-2.5 w-2.5 rounded-full', stage.color)} />
                    <span className="text-sm text-noir-900">{stage.label}</span>
                  </div>
                  <span className="text-sm font-semibold text-noir-950">{stage.count}</span>
                </div>
              ))}
            </div>
            <Link
              to="/dashboard/motors/sales"
              className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-gold-600 hover:text-gold-700"
            >
              Voir le pipeline <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="rounded-sm border border-noir-200 bg-white p-6 shadow-sm">
            <h2 className="font-semibold text-noir-950">Véhicules populaires</h2>
            <div className="mt-4 space-y-3">
              {vehicles.slice(0, 3).map((v) => (
                <Link
                  key={v.id}
                  to="/dashboard/motors/inventory/$vehicleId"
                  params={{ vehicleId: v.id }}
                  className="flex items-center gap-3 rounded-sm p-2 -mx-2 hover:bg-surface-dim transition-colors"
                >
                  <img
                    src={v.image}
                    alt={`${v.make} ${v.model}`}
                    className="h-10 w-14 rounded-sm object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium text-noir-900">
                      {v.make} {v.model}
                    </p>
                    <p className="text-xs text-noir-500">{v.year} · {formatPrice(v.price)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
