import {
  createRouter,
  createRootRoute,
  createRoute,
  Outlet,
} from '@tanstack/react-router'
import { LandingPage } from '@/pages/LandingPage'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { DashboardHome } from '@/pages/dashboard/DashboardHome'
import { MotorsDashboard } from '@/pages/dashboard/motors/MotorsDashboard'
import { MotorsInventory } from '@/pages/dashboard/motors/MotorsInventory'
import { MotorsVehicleDetail } from '@/pages/dashboard/motors/MotorsVehicleDetail'
import { MotorsSales } from '@/pages/dashboard/motors/MotorsSales'
import { MotorsCustomers } from '@/pages/dashboard/motors/MotorsCustomers'
import { LoginPage } from '@/pages/auth/LoginPage'
import { RegisterPage } from '@/pages/auth/RegisterPage'
import { PublicVehicles } from '@/pages/public/PublicVehicles'
import { PublicVehicleDetail } from '@/pages/public/PublicVehicleDetail'
import { MansourMotorsLanding } from '@/pages/public/MansourMotorsLanding'

const rootRoute = createRootRoute({
  component: () => <Outlet />,
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
    motorsVehicleDetailRoute,
    motorsSalesRoute,
    motorsCustomersRoute,
  ]),
])

export const router = createRouter({ 
  routeTree,
  defaultPreload: 'intent',
  scrollRestoration: true,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
