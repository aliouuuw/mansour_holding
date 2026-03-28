import {
  createRouter,
  createRootRoute,
  createRoute,
  Outlet,
  useRouterState,
} from '@tanstack/react-router'
import { useEffect, useRef, lazy, Suspense } from 'react'
import Lenis from 'lenis'

// ── Lazy-loaded pages (code splitting) ──────────────────────────────────────
const LandingPage = lazy(() => import('@/pages/LandingPage').then(m => ({ default: m.LandingPage })))
const LoginPage = lazy(() => import('@/pages/auth/LoginPage').then(m => ({ default: m.LoginPage })))
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage').then(m => ({ default: m.RegisterPage })))
const MansourMotorsLanding = lazy(() => import('@/pages/public/MansourMotorsLanding').then(m => ({ default: m.MansourMotorsLanding })))
const PublicVehicles = lazy(() => import('@/pages/public/PublicVehicles').then(m => ({ default: m.PublicVehicles })))
const PublicVehicleDetail = lazy(() => import('@/pages/public/PublicVehicleDetail').then(m => ({ default: m.PublicVehicleDetail })))
const DashboardLayout = lazy(() => import('@/components/layout/DashboardLayout').then(m => ({ default: m.DashboardLayout })))
const DashboardHome = lazy(() => import('@/pages/dashboard/DashboardHome').then(m => ({ default: m.DashboardHome })))
const MotorsDashboard = lazy(() => import('@/pages/dashboard/motors/MotorsDashboard').then(m => ({ default: m.MotorsDashboard })))
const MotorsInventory = lazy(() => import('@/pages/dashboard/motors/MotorsInventory').then(m => ({ default: m.MotorsInventory })))
const MotorsVehicleNew = lazy(() => import('@/pages/dashboard/motors/MotorsVehicleNew').then(m => ({ default: m.MotorsVehicleNew })))
const MotorsVehicleDetail = lazy(() => import('@/pages/dashboard/motors/MotorsVehicleDetail').then(m => ({ default: m.MotorsVehicleDetail })))
const MotorsSales = lazy(() => import('@/pages/dashboard/motors/MotorsSales').then(m => ({ default: m.MotorsSales })))
const MotorsCustomers = lazy(() => import('@/pages/dashboard/motors/MotorsCustomers').then(m => ({ default: m.MotorsCustomers })))
const MotorsCustomerNew = lazy(() => import('@/pages/dashboard/motors/MotorsCustomerNew').then(m => ({ default: m.MotorsCustomerNew })))
const MotorsCustomerDetail = lazy(() => import('@/pages/dashboard/motors/MotorsCustomerDetail').then(m => ({ default: m.MotorsCustomerDetail })))
const MotorsDealNew = lazy(() => import('@/pages/dashboard/motors/MotorsDealNew').then(m => ({ default: m.MotorsDealNew })))

function PageLoader() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-gold-400" />
    </div>
  )
}

function RootComponent() {
  const lenisRef = useRef<Lenis | null>(null)
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })
    lenisRef.current = lenis

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    const rafId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true })
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    }
  }, [pathname])

  return (
    <Suspense fallback={<PageLoader />}>
      <Outlet />
    </Suspense>
  )
}

const rootRoute = createRootRoute({ component: RootComponent })

const landingRoute = createRoute({ getParentRoute: () => rootRoute, path: '/', component: LandingPage })
const loginRoute = createRoute({ getParentRoute: () => rootRoute, path: '/login', component: LoginPage })
const registerRoute = createRoute({ getParentRoute: () => rootRoute, path: '/register', component: RegisterPage })
const mansourMotorsRoute = createRoute({ getParentRoute: () => rootRoute, path: '/mansour-motors', component: MansourMotorsLanding })
const mansourMotorsVehiclesRoute = createRoute({ getParentRoute: () => rootRoute, path: '/mansour-motors/vehicules', component: PublicVehicles })
const mansourMotorsVehicleDetailRoute = createRoute({ getParentRoute: () => rootRoute, path: '/mansour-motors/vehicules/$vehicleId', component: PublicVehicleDetail })
const publicVehiclesRoute = createRoute({ getParentRoute: () => rootRoute, path: '/vehicules', component: PublicVehicles })
const publicVehicleDetailRoute = createRoute({ getParentRoute: () => rootRoute, path: '/vehicules/$vehicleId', component: PublicVehicleDetail })

const dashboardRoute = createRoute({ getParentRoute: () => rootRoute, path: '/dashboard', component: DashboardLayout })
const dashboardIndexRoute = createRoute({ getParentRoute: () => dashboardRoute, path: '/', component: DashboardHome })
const motorsDashboardRoute = createRoute({ getParentRoute: () => dashboardRoute, path: '/motors', component: MotorsDashboard })
const motorsInventoryRoute = createRoute({ getParentRoute: () => dashboardRoute, path: '/motors/inventory', component: MotorsInventory })
const motorsVehicleNewRoute = createRoute({ getParentRoute: () => dashboardRoute, path: '/motors/inventory/new', component: MotorsVehicleNew })
const motorsVehicleDetailRoute = createRoute({ getParentRoute: () => dashboardRoute, path: '/motors/inventory/$vehicleId', component: MotorsVehicleDetail })
const motorsSalesRoute = createRoute({ getParentRoute: () => dashboardRoute, path: '/motors/sales', component: MotorsSales })
const motorsCustomersRoute = createRoute({ getParentRoute: () => dashboardRoute, path: '/motors/customers', component: MotorsCustomers })
const motorsCustomerNewRoute = createRoute({ getParentRoute: () => dashboardRoute, path: '/motors/customers/new', component: MotorsCustomerNew })
const motorsCustomerDetailRoute = createRoute({ getParentRoute: () => dashboardRoute, path: '/motors/customers/$customerId', component: MotorsCustomerDetail })
const motorsDealNewRoute = createRoute({ getParentRoute: () => dashboardRoute, path: '/motors/sales/new', component: MotorsDealNew })

const routeTree = rootRoute.addChildren([
  landingRoute,
  loginRoute,
  registerRoute,
  mansourMotorsRoute,
  mansourMotorsVehiclesRoute,
  mansourMotorsVehicleDetailRoute,
  publicVehiclesRoute,
  publicVehicleDetailRoute,
  dashboardRoute.addChildren([
    dashboardIndexRoute,
    motorsDashboardRoute,
    motorsInventoryRoute,
    motorsVehicleNewRoute,
    motorsVehicleDetailRoute,
    motorsSalesRoute,
    motorsCustomersRoute,
    motorsCustomerNewRoute,
    motorsCustomerDetailRoute,
    motorsDealNewRoute,
  ]),
])

export const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  scrollRestoration: false,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
