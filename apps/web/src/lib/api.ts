const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

function getHeaders(): HeadersInit {
  const token = localStorage.getItem('better-auth-token')
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    credentials: 'include',
    ...init,
    headers: { ...getHeaders(), ...init?.headers },
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error((err as { error: string }).error || res.statusText)
  }
  return res.json() as Promise<T>
}

// ---- Vehicle types ----
export type VehicleStatus = 'available' | 'reserved' | 'sold'
export type FuelType = 'gasoline' | 'diesel' | 'hybrid' | 'electric'
export type Transmission = 'manual' | 'automatic' | 'cvt'

export interface ApiVehicle {
  id: string
  make: string
  model: string
  year: number
  mileage: number
  price: number
  status: VehicleStatus
  fuelType: FuelType
  transmission: Transmission
  color: string
  vin: string | null
  description: string | null
  images: string[]
  extras: Record<string, string>
  organizationId: string | null
  createdBy: string | null
  createdAt: string
  updatedAt: string
}

export interface VehicleListResponse {
  data: ApiVehicle[]
  pagination: { page: number; limit: number; total: number; pages: number }
}

export interface VehicleFilters {
  page?: number
  limit?: number
  status?: VehicleStatus
  search?: string
}

// ---- Vehicle API ----
export const vehiclesApi = {
  list: (filters: VehicleFilters = {}) => {
    const params = new URLSearchParams()
    if (filters.page) params.set('page', String(filters.page))
    if (filters.limit) params.set('limit', String(filters.limit))
    if (filters.status) params.set('status', filters.status)
    if (filters.search) params.set('search', filters.search)
    const qs = params.toString()
    return request<VehicleListResponse>(`/api/vehicles${qs ? `?${qs}` : ''}`)
  },

  get: (id: string) => request<ApiVehicle>(`/api/vehicles/${id}`),

  create: (data: Omit<ApiVehicle, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'organizationId'>) =>
    request<ApiVehicle>('/api/vehicles', { method: 'POST', body: JSON.stringify(data) }),

  update: (id: string, data: Partial<ApiVehicle>) =>
    request<ApiVehicle>(`/api/vehicles/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  delete: (id: string) =>
    request<{ success: boolean }>(`/api/vehicles/${id}`, { method: 'DELETE' }),

  uploadImage: (id: string, file: File) => {
    const token = localStorage.getItem('better-auth-token')
    const form = new FormData()
    form.append('file', file)
    return fetch(`${BASE_URL}/api/vehicles/${id}/images`, {
      method: 'POST',
      credentials: 'include',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: form,
    }).then(async (res) => {
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: res.statusText }))
        throw new Error((err as { error: string }).error || res.statusText)
      }
      return res.json() as Promise<{ url: string; images: string[] }>
    })
  },
}

// ---- Customer types ----
export type CustomerSource = 'walk-in' | 'referral' | 'online' | 'phone'

export interface ApiCustomer {
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

export interface CustomerListResponse {
  data: ApiCustomer[]
  pagination: { page: number; limit: number; total: number; pages: number }
}

// ---- Customer API ----
export const customersApi = {
  list: (params: { page?: number; limit?: number; search?: string } = {}) => {
    const qs = new URLSearchParams()
    if (params.page) qs.set('page', String(params.page))
    if (params.limit) qs.set('limit', String(params.limit))
    if (params.search) qs.set('search', params.search)
    const q = qs.toString()
    return request<CustomerListResponse>(`/api/customers${q ? `?${q}` : ''}`)
  },

  get: (id: string) => request<ApiCustomer>(`/api/customers/${id}`),

  create: (data: Omit<ApiCustomer, 'id' | 'createdAt' | 'updatedAt' | 'organizationId'>) =>
    request<ApiCustomer>('/api/customers', { method: 'POST', body: JSON.stringify(data) }),

  update: (id: string, data: Partial<ApiCustomer>) =>
    request<ApiCustomer>(`/api/customers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  delete: (id: string) =>
    request<{ success: boolean }>(`/api/customers/${id}`, { method: 'DELETE' }),
}
