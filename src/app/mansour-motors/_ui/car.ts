import type { ApiVehicle } from '@/lib/api'
import { cover, face, focal, isCutout, rangeOf, type RangeId } from './shared'

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
  range: RangeId
  arrived: number
  order: number
}

/** Showroom arrival instant; legacy rows without `arrivedAt` use record creation. */
export const arrivalMs = (v: Pick<ApiVehicle, 'arrivedAt' | 'createdAt'>) =>
  Date.parse(v.arrivedAt || v.createdAt)

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
  range: rangeOf(v),
  arrived: arrivalMs(v),
  order: v.sortOrder ?? 0,
})

/* home plateau length; the order dialog marks the same prefix */
export const PLATEAU = 7

/* staff order from the inventory dialog. The home section shows the first PLATEAU cars. */
export const lineup = (vs: ApiVehicle[]) =>
  [...vs].sort((a, b) => a.sortOrder - b.sortOrder)
