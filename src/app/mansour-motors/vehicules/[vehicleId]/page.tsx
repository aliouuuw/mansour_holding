import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { cache } from 'react'
import { getVehicle, listVehicles } from '@/server/vehicles'
import { FUEL, GEARBOX, STATE, fcfa, km, vehicleUrl } from '../../_ui/shared'
import { JsonLd, carLd, og, shareImage } from '../../seo'
import { PublicVehicleDetail } from './detail'

/* a car with no price yet cannot be near one: it ranks after every priced car */
const near = (a: number | null, b: number | null) =>
  a == null || b == null ? Number.POSITIVE_INFINITY : Math.abs(a - b)

/* metadata and the page read the same record: one query per request */
const vehicleById = cache(getVehicle)

export const revalidate = 60

type Props = { params: Promise<{ vehicleId: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { vehicleId } = await params
  try {
    const v = await vehicleById(vehicleId)
    const title = `${v.make} ${v.model} ${v.year}`
    const description = `${title}, ${km(v.mileage)}, ${FUEL[v.fuelType].toLowerCase()}, boîte ${GEARBOX[v.transmission].toLowerCase()}. ${fcfa(v.price)}. ${STATE[v.status]}. Showroom Mansour Motors, Corniche Ouest, Dakar.`
    const image = shareImage(v)
    return {
      title,
      description,
      alternates: { canonical: vehicleUrl(v) },
      openGraph: { ...og, title, description, url: vehicleUrl(v), images: image ? [image] : og.images },
    }
  } catch {
    return {}
  }
}

export default async function Page({ params }: Props) {
  const { vehicleId } = await params
  const [vehicle, all] = await Promise.all([
    vehicleById(vehicleId),
    listVehicles({ limit: 100, withPhoto: true }),
  ]).catch(() => notFound())
  /* same rule as the lists: no photo, no public page yet */
  if (!vehicle.images.length && !vehicle.extras.cover) notFound()
  /* other cars: the three nearest in price */
  const others = all.data
    .filter((v) => v.id !== vehicleId)
    .sort((a, b) => near(a.price, vehicle.price) - near(b.price, vehicle.price))
    .slice(0, 3)
  return (
    <>
      <JsonLd data={carLd(vehicle)} />
      <PublicVehicleDetail vehicle={vehicle} others={others} />
    </>
  )
}
