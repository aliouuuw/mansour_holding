import type { ApiVehicle } from '@/lib/api'
import { cover, face, focal, isCutout } from './shared'

/* the shape the plateau (turntable.js) reads; `n` carries the vehicle id for links */
export type PlateauCar = {
  n: string
  make: string
  model: string
  year: number
  km: number
  price: number | null
  img: string
  pos: string
  face: 'left' | 'right'
  cutout: boolean
  status: ApiVehicle['status']
  color: string | null
  fuel: ApiVehicle['fuelType']
  arrived: number
}

export const toCar = (v: ApiVehicle): PlateauCar => ({
  n: v.id,
  make: v.make,
  model: v.model,
  year: v.year,
  km: v.mileage,
  price: v.price,
  img: cover(v),
  pos: focal(v),
  face: face(v),
  cutout: isCutout(v),
  status: v.status,
  color: v.color,
  fuel: v.fuelType,
  arrived: Date.parse(v.createdAt),
})

/* the line-up order: what you can buy first, the dearest first */
const ORDER = { available: 0, reserved: 1, sold: 2 } as const
const dear = (p: number | null) => (p == null ? -1 : p)
export const lineup = (vs: ApiVehicle[]) =>
  [...vs].sort((a, b) => ORDER[a.status] - ORDER[b.status] || dear(b.price) - dear(a.price))
