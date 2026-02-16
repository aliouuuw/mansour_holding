import { useState } from 'react'
import { Outlet, Link, useMatchRoute } from '@tanstack/react-router'
import {
  LayoutDashboard,
  Car,
  Package,
  Users,
  TrendingUp,
  Menu,
  ChevronDown,
  Building2,
  LogOut,
  User,
  Bell,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const motorsNavItems = [
  { label: 'Tableau de bord', href: '/dashboard/motors', icon: LayoutDashboard },
  { label: 'Inventaire', href: '/dashboard/motors/inventory', icon: Package },
  { label: 'Ventes', href: '/dashboard/motors/sales', icon: TrendingUp },
  { label: 'Clients', href: '/dashboard/motors/customers', icon: Users },
]

export function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const matchRoute = useMatchRoute()

  return (
    <div className="min-h-screen bg-surface-dim">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-primary-950 text-white transition-transform duration-200 lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-16 items-center gap-3 border-b border-white/10 px-6">
          <Building2 className="h-7 w-7 text-primary-400" />
          <div>
            <p className="text-sm font-bold tracking-wide">Mansour Holding</p>
            <p className="text-[11px] text-primary-300">Plateforme de gestion</p>
          </div>
        </div>

        {/* Business Switcher */}
        <div className="border-b border-white/10 p-4">
          <button className="flex w-full items-center justify-between rounded-lg bg-white/10 px-3 py-2 text-sm hover:bg-white/15 transition-colors">
            <div className="flex items-center gap-2">
              <Car className="h-4 w-4 text-primary-300" />
              <span className="font-medium">Mansour Motors</span>
            </div>
            <ChevronDown className="h-4 w-4 text-primary-400" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-4 space-y-1 px-3">
          <Link
            to="/dashboard"
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
              matchRoute({ to: '/dashboard', fuzzy: false })
                ? 'bg-white/15 text-white'
                : 'text-primary-200 hover:bg-white/10 hover:text-white'
            )}
          >
            <LayoutDashboard className="h-4 w-4" />
            Vue d'ensemble
          </Link>

          <div className="pt-4">
            <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-primary-400">
              Mansour Motors
            </p>
            {motorsNavItems.map((item) => {
              const isActive = matchRoute({ to: item.href, fuzzy: false })
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-white/15 text-white'
                      : 'text-primary-200 hover:bg-white/10 hover:text-white'
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              )
            })}
          </div>
        </nav>

        {/* Bottom */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-600 text-sm font-bold">
              AW
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium">Aliou Wade</p>
              <p className="truncate text-xs text-primary-300">Administrateur</p>
            </div>
            <button className="rounded-lg p-1.5 text-primary-300 hover:bg-white/10 hover:text-white transition-colors">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-surface px-4 lg:px-8">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 text-muted hover:bg-surface-bright lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="hidden lg:block">
            <h2 className="text-sm font-medium text-muted">
              Bienvenue, <span className="text-primary-900 font-semibold">Aliou</span>
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button className="relative rounded-lg p-2 text-muted hover:bg-surface-bright transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
            </button>
            <button className="flex items-center gap-2 rounded-lg p-2 text-muted hover:bg-surface-bright transition-colors lg:hidden">
              <User className="h-5 w-5" />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
