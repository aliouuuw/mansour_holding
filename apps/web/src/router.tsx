import {
  createRouter,
  createRootRoute,
  createRoute,
  Outlet,
  useRouterState,
} from '@tanstack/react-router'
import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import { LandingPage } from '@/pages/LandingPage'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { DashboardHome } from '@/pages/dashboard/DashboardHome'
import { MotorsDashboard } from '@/pages/dashboard/motors/MotorsDashboard'
import { MotorsInventory } from '@/pages/dashboard/motors/MotorsInventory'
import { MotorsVehicleDetail } from '@/pages/dashboard/motors/MotorsVehicleDetail'
import { MotorsVehicleNew } from '@/pages/dashboard/motors/MotorsVehicleNew'
import { MotorsSales } from '@/pages/dashboard/motors/MotorsSales'
import { MotorsCustomers } from '@/pages/dashboard/motors/MotorsCustomers'
import { MotorsCustomerDetail } from '@/pages/dashboard/motors/MotorsCustomerDetail'
import { LoginPage } from '@/pages/auth/LoginPage'
import { RegisterPage } from '@/pages/auth/RegisterPage'
import { PublicVehicles } from '@/pages/public/PublicVehicles'
import { PublicVehicleDetail } from '@/pages/public/PublicVehicleDetail'
import { MansourMotorsLanding } from '@/pages/public/MansourMotorsLanding'

function RootComponent() {
  const lenisRef = useRef<Lenis | null>(null)
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  // Initialize Lenis once globally
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

  // Scroll to top on every route change
  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true })
    } else {
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    }
  }, [pathname])

  return <Outlet />
}

const rootRoute = createRootRoute({
  component: RootComponent,
})

const landingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: LandingPage,
})

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
})

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/register',
  component: RegisterPage,
})

const mansourMotorsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/mansour-motors',
  component: MansourMotorsLanding,
})

const mansourMotorsVehiclesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/mansour-motors/vehicules',
  component: PublicVehicles,
})

const mansourMotorsVehicleDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/mansour-motors/vehicules/$vehicleId',
  component: PublicVehicleDetail,
})

const publicVehiclesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/vehicules',
  component: PublicVehicles,
})

const publicVehicleDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/vehicules/$vehicleId',
  component: PublicVehicleDetail,
})

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: DashboardLayout,
})

const dashboardIndexRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: '/',
  component: DashboardHome,
})

const motorsDashboardRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: '/motors',
  component: MotorsDashboard,
})

const motorsInventoryRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: '/motors/inventory',
  component: MotorsInventory,
})

const motorsVehicleNewRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: '/motors/inventory/new',
  component: MotorsVehicleNew,
})

const motorsVehicleDetailRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: '/motors/inventory/$vehicleId',
  component: MotorsVehicleDetail,
})

const motorsSalesRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: '/motors/sales',
  component: MotorsSales,
})

const motorsCustomersRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: '/motors/customers',
  component: MotorsCustomers,
})

const motorsCustomerDetailRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: '/motors/customers/$customerId',
  component: MotorsCustomerDetail,
})

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
    motorsCustomerDetailRoute,
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
