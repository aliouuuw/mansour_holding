import {
  listVehicles,
  getVehicle,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  uploadVehicleImage,
  type VehicleFilters,
  type VehicleStatus,
  type FuelType,
  type Transmission,
} from '@/server/vehicles'
import {
  listCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  type CustomerSource,
} from '@/server/customers'
import {
  listDeals,
  getDeal,
  getDealSummary,
  listDealsBoard,
  createDeal,
  updateDeal,
  deleteDeal,
  type DealStatus,
} from '@/server/deals'
import { getHoldingOverview, getMotorsOverview } from '@/server/overview'
import type { QueryClient } from '@tanstack/react-query'

export type { VehicleStatus, FuelType, Transmission, VehicleFilters, CustomerSource, DealStatus }

export type ApiVehicle = {
  id: string
  make: string
  model: string
  year: number
  mileage: number
  price: number | null
  status: VehicleStatus
  fuelType: FuelType
  transmission: Transmission
  color: string | null
  vin: string | null
  description: string | null
  images: string[]
  extras: Record<string, string>
  organizationId: string | null
  createdBy: string | null
  createdAt: string
  updatedAt: string
}

export type VehicleListResponse = {
  data: ApiVehicle[]
  pagination: { page: number; limit: number; total: number; pages: number }
}

export type ApiCustomer = {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string | null
  notes: string | null
  source: CustomerSource
  organizationId: string | null
  createdAt: string
  updatedAt: string
}

export type CustomerListResponse = {
  data: ApiCustomer[]
  pagination: { page: number; limit: number; total: number; pages: number }
}

export type ApiDeal = {
  id: string
  vehicleId: string
  customerId: string
  salesPersonId: string
  status: DealStatus
  price: number
  notes: string | null
  testDriveDate: string | null
  closedAt: string | null
  organizationId: string | null
  createdAt: string
  updatedAt: string
  vehicleName: string | null
  customerName: string | null
  customerPhone: string | null
}

export type DealSummary = {
  lead: number
  negotiation: number
  'closed-won': number
  'closed-lost': number
  totalRevenue: number
}

export const vehiclesApi = {
  list: listVehicles,
  get: getVehicle,
  create: createVehicle,
  update: updateVehicle,
  delete: deleteVehicle,
  uploadImage: (id: string, file: File) => {
    const form = new FormData()
    form.append('file', file)
    return uploadVehicleImage(id, form)
  },
}

export const publicVehiclesApi = {
  list: listVehicles,
  get: getVehicle,
}

export const customersApi = {
  list: listCustomers,
  get: getCustomer,
  create: createCustomer,
  update: updateCustomer,
  delete: deleteCustomer,
}

export const dealsApi = {
  list: listDeals,
  board: listDealsBoard,
  summary: getDealSummary,
  get: getDeal,
  create: createDeal,
  update: updateDeal,
  delete: deleteDeal,
}

export const overviewApi = {
  holding: getHoldingOverview,
  motors: getMotorsOverview,
}

export function invalidateMotorsQueries(qc: QueryClient) {
  void qc.invalidateQueries({ queryKey: ['overview'] })
  void qc.invalidateQueries({ queryKey: ['vehicles'] })
  void qc.invalidateQueries({ queryKey: ['customers'] })
  void qc.invalidateQueries({ queryKey: ['deals'] })
  void qc.invalidateQueries({ queryKey: ['deals-board'] })
  void qc.invalidateQueries({ queryKey: ['deals-summary'] })
  void qc.invalidateQueries({ queryKey: ['public-vehicles'] })
  void qc.invalidateQueries({ queryKey: ['public-featured-vehicles'] })
}
