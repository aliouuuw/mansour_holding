import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import {
  Car01Icon,
  UserMultiple02Icon,
  DollarCircleIcon,
  Add01Icon,
  ArrowRight01Icon,
  ShoppingCart01Icon,
  Calendar01Icon,
  CheckmarkCircle01Icon,
  AlertCircleIcon,
} from 'hugeicons-react'
import { cn, formatPrice, formatNumber } from '@/lib/utils'
import { vehicles, deals, customers, recentActivity } from '@/data/mock'

const kpis = [
  {
    label: 'Véhicules en stock',
    value: formatNumber(vehicles.filter((v) => v.status === 'available').length),
    total: `${vehicles.length} total`,
    icon: Car01Icon,
    color: 'text-steel-700 bg-steel-50 border-steel-200',
    trend: '+2 cette semaine',
  },
  {
    label: 'Affaires en cours',
    value: formatNumber(deals.filter((d) => !d.status.startsWith('closed')).length),
    total: `${deals.length} total`,
    icon: ShoppingCart01Icon,
    color: 'text-amber-700 bg-amber-50 border-amber-200',
    trend: '3 en négociation',
  },
  {
    label: 'Revenus du mois',
    value: formatPrice(111500000),
    total: '+23% vs mois dernier',
    icon: DollarCircleIcon,
    color: 'text-jade-700 bg-jade-50 border-jade-200',
    trend: 'Objectif atteint à 87%',
  },
  {
    label: 'Clients actifs',
    value: formatNumber(customers.length),
    total: '3 nouveaux ce mois',
    icon: UserMultiple02Icon,
    color: 'text-gold-700 bg-gold-50 border-gold-200',
    trend: '+12% ce trimestre',
  },
]

const activityIcons: Record<string, typeof Car01Icon> = {
  sale: CheckmarkCircle01Icon,
  lead: AlertCircleIcon,
  vehicle: Car01Icon,
  appointment: Calendar01Icon,
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
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="font-motors-display text-2xl font-medium text-noir-950">Mansour Motors</h1>
          <p className="mt-1 text-sm text-noir-500">Tableau de bord du concessionnaire</p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/dashboard/motors/inventory"
            className="inline-flex items-center gap-2 border border-noir-200 bg-white px-4 py-2.5 text-sm font-medium text-noir-900 shadow-sm hover:bg-surface-dim hover:border-noir-300 transition-all"
          >
            <Car01Icon className="h-4 w-4" />
            Inventaire
          </Link>
          <Link
            to="/dashboard/motors/sales"
            className="inline-flex items-center gap-2 bg-gold-400 px-4 py-2.5 text-sm font-semibold text-noir-950 shadow-sm hover:bg-gold-300 transition-all"
          >
            <Add01Icon className="h-4 w-4" />
            Nouvelle affaire
          </Link>
        </div>
      </motion.div>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi, index) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="group border border-noir-200 bg-white p-5 shadow-sm hover:shadow-md hover:border-noir-300 transition-all"
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
            <div className="mt-4 pt-3 border-t border-noir-100">
              <p className="text-xs text-noir-400">{kpi.trend}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="grid gap-6 lg:grid-cols-5"
      >
        {/* Recent Activity */}
        <div className="lg:col-span-3 border border-noir-200 bg-white shadow-sm overflow-hidden">
          <div className="flex items-center justify-between border-b border-noir-200 px-6 py-4 bg-surface-dim/50">
            <h2 className="font-motors-display text-lg font-medium text-noir-950">Activité récente</h2>
            <span className="text-xs font-medium uppercase tracking-wider text-noir-400">Aujourd'hui</span>
          </div>
          <div className="divide-y divide-noir-100">
            {recentActivity.map((activity, index) => {
              const Icon = activityIcons[activity.type] ?? Car01Icon
              const color = activityColors[activity.type] ?? 'text-noir-600 bg-noir-50'
              return (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
                  className="flex items-start gap-4 px-6 py-4 hover:bg-surface-dim/50 transition-colors"
                >
                  <div className={cn('mt-0.5 p-2.5', color)}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-noir-900">{activity.message}</p>
                    <p className="mt-0.5 text-xs text-noir-500">{activity.time}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Quick Stats / Pipeline */}
        <div className="lg:col-span-2 space-y-6">
          <div className="border border-noir-200 bg-white p-6 shadow-sm">
            <h2 className="font-motors-display text-lg font-medium text-noir-950">Pipeline des ventes</h2>
            <div className="mt-5 space-y-4">
              {[
                { label: 'Prospects', count: deals.filter((d) => d.status === 'prospect').length, color: 'bg-steel-500', width: '15%' },
                { label: 'Négociation', count: deals.filter((d) => d.status === 'negotiation').length, color: 'bg-amber-500', width: '25%' },
                { label: 'Essai', count: deals.filter((d) => d.status === 'test-drive').length, color: 'bg-gold-500', width: '20%' },
                { label: 'Conclu', count: deals.filter((d) => d.status === 'closed-won').length, color: 'bg-jade-500', width: '30%' },
                { label: 'Perdu', count: deals.filter((d) => d.status === 'closed-lost').length, color: 'bg-garnet-500', width: '10%' },
              ].map((stage, index) => (
                <motion.div
                  key={stage.label}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 + index * 0.08 }}
                  className="group"
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
                      animate={{ width: stage.width }}
                      transition={{ duration: 0.8, delay: 0.6 + index * 0.08, ease: [0.16, 1, 0.3, 1] }}
                      className={cn('h-full', stage.color)}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
            <Link
              to="/dashboard/motors/sales"
              className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-gold-600 hover:text-gold-700 transition-colors"
            >
              Voir le pipeline <ArrowRight01Icon className="h-4 w-4" />
            </Link>
          </div>

          <div className="border border-noir-200 bg-white p-6 shadow-sm">
            <h2 className="font-motors-display text-lg font-medium text-noir-950">Véhicules populaires</h2>
            <div className="mt-4 space-y-2">
              {vehicles.slice(0, 3).map((v, index) => (
                <motion.div
                  key={v.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.6 + index * 0.05 }}
                >
                  <Link
                    to="/dashboard/motors/inventory/$vehicleId"
                    params={{ vehicleId: v.id }}
                    className="flex items-center gap-3 p-2 -mx-2 hover:bg-surface-dim transition-colors"
                  >
                    <img
                      src={v.image}
                      alt={`${v.make} ${v.model}`}
                      className="h-12 w-16 object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-medium text-noir-900">
                        {v.make} {v.model}
                      </p>
                      <p className="text-xs text-noir-500">{v.year} · {formatPrice(v.price)}</p>
                    </div>
                    <ArrowRight01Icon className="h-4 w-4 text-noir-300 group-hover:text-gold-500" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
