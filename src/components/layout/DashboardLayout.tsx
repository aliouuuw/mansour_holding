'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { Link, useMatchRoute, useNavigate } from '@/lib/router'
import {
  DashboardSquare01Icon,
  Car01Icon,
  PackageIcon,
  UserMultiple02Icon,
  ChartUpIcon,
  Menu01Icon,
  ArrowDown01Icon,
  Logout01Icon,
  UserIcon,
  Notification02Icon,
} from 'hugeicons-react'
import { cn } from '@/lib/utils'
import { useSession, signOut } from '@/lib/auth'

const motorsNavItems = [
  { label: 'Tableau de bord', href: '/dashboard/motors', icon: DashboardSquare01Icon },
  { label: 'Inventaire', href: '/dashboard/motors/inventory', icon: PackageIcon },
  { label: 'Ventes', href: '/dashboard/motors/sales', icon: ChartUpIcon },
  { label: 'Clients', href: '/dashboard/motors/customers', icon: UserMultiple02Icon },
]

const navLinkClass = (active: boolean) =>
  cn(
    'flex min-h-[var(--mm-touch)] items-center gap-3 rounded-[var(--mm-r)] px-3 py-2 text-sm font-medium transition-colors duration-200',
    active
      ? 'bg-[var(--mm-white)] text-[var(--mm-ink)]'
      : 'text-[var(--mm-white)]/72 hover:bg-white/[0.06] hover:text-[var(--mm-white)]'
  )

export function DashboardLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const matchRoute = useMatchRoute()
  const navigate = useNavigate()
  const { data, isPending } = useSession()

  useEffect(() => {
    if (!isPending && !data?.user) {
      void navigate({ to: '/login', replace: true })
    }
  }, [data?.user, isPending, navigate])

  if (isPending) {
    return (
      <div className="mm-dash flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div
            className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--mm-line)] border-t-[var(--mm-ink)]"
            role="status"
            aria-label="Chargement"
          />
          <p className="text-sm text-[var(--mm-grey)]">Chargement…</p>
        </div>
      </div>
    )
  }

  if (!data?.user) {
    return null
  }

  const user = data.user
  const userInitials = user.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U'
  const userName = user.name || 'Utilisateur'

  const handleLogout = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <div className="mm-dash min-h-screen">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/45 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-[var(--mm-sidebar)] flex-col bg-[var(--mm-black)] text-[var(--mm-white)] transition-transform duration-200 ease-[var(--mm-ease)] lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-16 shrink-0 items-center gap-3 border-b border-[var(--mm-line-d)] px-5">
          <img
            src="/mansour-motors/logo-header-white.png"
            alt=""
            width={469}
            height={429}
            className="h-7 w-auto max-w-[7.5rem] object-contain object-left"
            decoding="async"
          />
          <div className="min-w-0">
            <p className="truncate text-[0.65rem] font-medium uppercase tracking-[0.22em] text-[var(--mm-grey-muted)]">
              Showroom
            </p>
          </div>
        </div>

        <div className="border-b border-[var(--mm-line-d)] p-4">
          <button
            type="button"
            className="flex w-full min-h-[var(--mm-touch)] items-center justify-between rounded-[var(--mm-r)] border border-[var(--mm-line-d)] bg-white/[0.04] px-3 py-2 text-sm transition-colors hover:bg-white/[0.07]"
          >
            <div className="flex items-center gap-2">
              <Car01Icon className="h-4 w-4 shrink-0 opacity-90" aria-hidden="true" />
              <span className="font-medium">Mansour Motors</span>
            </div>
            <ArrowDown01Icon className="h-4 w-4 shrink-0 opacity-50" aria-hidden="true" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <Link
            to="/dashboard"
            className={navLinkClass(matchRoute({ to: '/dashboard', fuzzy: false }))}
            onClick={() => setSidebarOpen(false)}
          >
            <DashboardSquare01Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
            Vue d&apos;ensemble
          </Link>

          <div className="pt-6">
            <p className="mb-2 px-3 text-[0.65rem] font-medium uppercase tracking-[0.22em] text-[var(--mm-grey-muted)]">
              Gestion
            </p>
            {motorsNavItems.map((item) => {
              const isActive = matchRoute({ to: item.href, fuzzy: false })
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={navLinkClass(isActive)}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                  {item.label}
                </Link>
              )
            })}
          </div>

          <div className="mt-8 border-t border-[var(--mm-line-d)] pt-4">
            <Link
              to="/mansour-motors"
              className="flex min-h-[var(--mm-touch)] items-center gap-2 rounded-[var(--mm-r)] px-3 text-sm text-[var(--mm-white)]/65 transition-colors hover:bg-white/[0.06] hover:text-[var(--mm-white)]"
              onClick={() => setSidebarOpen(false)}
            >
              Site public
            </Link>
          </div>
        </nav>

        <div className="shrink-0 border-t border-[var(--mm-line-d)] p-4">
          <div className="flex items-center gap-3">
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--mm-white)] text-sm font-medium text-[var(--mm-ink)]"
              aria-hidden="true"
            >
              {userInitials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{userName}</p>
              <p className="truncate text-xs text-[var(--mm-grey-muted)]">{user.email}</p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="flex min-h-9 min-w-9 items-center justify-center rounded-[var(--mm-r)] text-[var(--mm-grey-muted)] transition-colors hover:bg-white/[0.06] hover:text-[var(--mm-white)]"
              title="Se déconnecter"
            >
              <Logout01Icon className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </aside>

      <div className="lg:pl-[var(--mm-sidebar)]">
        <header
          className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[var(--mm-line)] bg-[var(--mm-paper)] px-4 lg:px-8"
        >
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="flex min-h-[var(--mm-touch)] min-w-[var(--mm-touch)] items-center justify-center rounded-[var(--mm-r)] text-[var(--mm-grey)] transition-colors hover:bg-[var(--mm-off)] lg:hidden"
            aria-label="Ouvrir le menu"
          >
            <Menu01Icon className="h-5 w-5" aria-hidden="true" />
          </button>

          <div className="hidden lg:block">
            <h2 className="text-sm font-normal text-[var(--mm-grey)]">
              Bienvenue,{' '}
              <span className="font-medium text-[var(--mm-ink)]">{userName.split(' ')[0]}</span>
            </h2>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              className="relative flex min-h-[var(--mm-touch)] min-w-[var(--mm-touch)] items-center justify-center rounded-[var(--mm-r)] text-[var(--mm-grey)] transition-colors hover:bg-[var(--mm-off)]"
              aria-label="Notifications"
            >
              <Notification02Icon className="h-5 w-5" aria-hidden="true" />
              <span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-[var(--mm-ink)]" aria-hidden="true" />
            </button>
            <button
              type="button"
              className="flex min-h-[var(--mm-touch)] min-w-[var(--mm-touch)] items-center justify-center rounded-[var(--mm-r)] text-[var(--mm-grey)] transition-colors hover:bg-[var(--mm-off)] lg:hidden"
              aria-label="Profil"
            >
              <UserIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </header>

        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
