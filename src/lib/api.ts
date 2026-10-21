import {
  listVehicles,
  getVehicle,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  uploadVehicleImage,
  replaceVehicleImage,
  reorderVehicles,
  type VehicleFilters,
  type VehicleSortField,
  type VehicleSortDir,
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
import { listInventorySuggestionMap } from '@/server/inventory-suggestions'
import {
  suggestVehicleFromTitle,
  generateVehicleDescription,
  listVehicleAiModels,
} from '@/server/vehicle-ai'
import type { VehicleSuggestPayload } from '@/server/vehicle-ai-parse'
import type { VehicleDescriptionFacts } from '@/server/vehicle-ai-parse'
import type { QueryClient } from '@tanstack/react-query'
import { unwrap, type ActionResult } from '@/server/action-result'
import { fitImageForUpload } from '@/lib/fit-image'

/* server actions return { ok, error }: turn a failure back into an Error with the French message */
const u =
  <A extends unknown[], T>(fn: (...args: A) => Promise<ActionResult<T>>) =>
  (...args: A) =>
    unwrap(fn(...args))

export type {
  VehicleStatus,
  FuelType,
  Transmission,
  VehicleFilters,
  VehicleSortField,
  VehicleSortDir,
  CustomerSource,
  DealStatus,
}

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
  arrivedAt: string
  sortOrder: number
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
  create: u(createVehicle),
  update: u(updateVehicle),
  delete: u(deleteVehicle),
  reorder: u(reorderVehicles),
  uploadImage: async (id: string, file: File) => {
    const form = new FormData()
    form.append('file', await fitImageForUpload(file))
    return unwrap(uploadVehicleImage(id, form))
  },
  replaceImage: async (id: string, index: number, file: File) => {
    const form = new FormData()
    form.append('file', await fitImageForUpload(file))
    return unwrap(replaceVehicleImage(id, index, form))
  },
}

export const inventorySuggestionsApi = {
  list: listInventorySuggestionMap,
}

export type { VehicleSuggestPayload, VehicleDescriptionFacts }

export const vehiclesAiApi = {
  listModels: u(listVehicleAiModels),
  suggestFromTitle: u(suggestVehicleFromTitle),
  generateDescription: u(generateVehicleDescription),
}

export const publicVehiclesApi = {
  list: listVehicles,
  get: getVehicle,
}

export const customersApi = {
  list: u(listCustomers),
  get: u(getCustomer),
  create: u(createCustomer),
  update: u(updateCustomer),
  delete: u(deleteCustomer),
}

export const dealsApi = {
  list: u(listDeals),
  board: u(listDealsBoard),
  summary: u(getDealSummary),
  get: u(getDeal),
  create: u(createDeal),
  update: u(updateDeal),
  delete: u(deleteDeal),
}

export const overviewApi = {
  holding: getHoldingOverview,
  motors: getMotorsOverview,
}

export function invalidateMotorsQueries(qc: QueryClient) {
  void qc.invalidateQueries({ queryKey: ['overview'] })
  void qc.invalidateQueries({ queryKey: ['vehicles'] })
  void qc.invalidateQueries({ queryKey: ['vehicle'] })
  void qc.invalidateQueries({ queryKey: ['vehicles-for-deal'] })
  void qc.invalidateQueries({ queryKey: ['customers'] })
  void qc.invalidateQueries({ queryKey: ['customer'] })
  void qc.invalidateQueries({ queryKey: ['customers-for-deal'] })
  void qc.invalidateQueries({ queryKey: ['deals'] })
  void qc.invalidateQueries({ queryKey: ['deals-board'] })
  void qc.invalidateQueries({ queryKey: ['deals-summary'] })
  void qc.invalidateQueries({ queryKey: ['deal'] })
  void qc.invalidateQueries({ queryKey: ['public-vehicles'] })
  void qc.invalidateQueries({ queryKey: ['public-featured-vehicles'] })
  void qc.invalidateQueries({ queryKey: ['inventory-suggestions'] })
}
