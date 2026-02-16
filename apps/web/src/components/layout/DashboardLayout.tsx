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
          'fixed inset-y-0 left-0 z-50 w-64 bg-noir-950 text-white transition-transform duration-200 lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-16 items-center gap-3 border-b border-white/10 px-6">
          <Building2 className="h-7 w-7 text-gold-400" />
          <div>
            <p className="text-sm font-bold uppercase tracking-widest">Mansour Holding</p>
            <p className="text-[10px] font-medium uppercase tracking-wider text-silver-400">Plateforme Pro</p>
          </div>
        </div>

        {/* Business Switcher */}
        <div className="border-b border-white/10 p-4">
          <button className="flex w-full items-center justify-between rounded-sm bg-white/5 px-3 py-2.5 text-sm hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-2">
              <Car className="h-4 w-4 text-gold-400" />
              <span className="font-semibold">Mansour Motors</span>
            </div>
            <ChevronDown className="h-4 w-4 text-gold-400" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-4 space-y-1 px-3">
          <Link
            to="/dashboard"
            className={cn(
              'flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm font-medium transition-colors',
              matchRoute({ to: '/dashboard', fuzzy: false })
                ? 'bg-gold-400 text-noir-950'
                : 'text-silver-300 hover:bg-white/5 hover:text-white'
            )}
          >
            <LayoutDashboard className="h-4 w-4" />
            Vue d'ensemble
          </Link>

          <div className="pt-4">
            <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.15em] text-gold-400">
              Mansour Motors
            </p>
            {motorsNavItems.map((item) => {
              const isActive = matchRoute({ to: item.href, fuzzy: false })
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-gold-400 text-noir-950'
                      : 'text-silver-300 hover:bg-white/5 hover:text-white'
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
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gold-400 text-sm font-bold text-noir-950">
              AW
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium">Aliou Wade</p>
              <p className="truncate text-xs text-silver-400">Administrateur</p>
            </div>
            <Link
              to="/login"
              className="rounded-sm p-1.5 text-silver-400 hover:bg-white/5 hover:text-white transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-noir-200 bg-white px-4 lg:px-8">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-sm p-2 text-noir-600 hover:bg-surface-dim lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="hidden lg:block">
            <h2 className="text-sm font-medium text-noir-500">
              Bienvenue, <span className="text-noir-950 font-semibold">Aliou</span>
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button className="relative rounded-sm p-2 text-noir-600 hover:bg-surface-dim transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-gold-400" />
            </button>
            <button className="flex items-center gap-2 rounded-sm p-2 text-noir-600 hover:bg-surface-dim transition-colors lg:hidden">
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
