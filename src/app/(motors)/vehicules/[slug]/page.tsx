import type { Metadata } from 'next'
import { notFound, permanentRedirect } from 'next/navigation'
import { cache } from 'react'
import { getVehicle, getVehicleByIdPrefix, listPublicVehicles } from '@/server/vehicles'
import { parseVehicleSlug, vehicleSlug } from '@/lib/motors-routes'
import { FUEL, GEARBOX, STATE, fcfa, km, vehicleUrl } from '../../_ui/shared'
import { JsonLd, carLd, og, shareImage } from '../../seo'
import { PublicVehicleDetail } from './detail'

/* a car with no price yet cannot be near one: it ranks after every priced car */
const near = (a: number | null, b: number | null) =>
  a == null || b == null ? Number.POSITIVE_INFINITY : Math.abs(a - b)

/* metadata and the page read the same record: one query per request. null = no such car. */
const vehicleBySlug = cache(async (slug: string) => {
  const ref = parseVehicleSlug(slug)
  if (!ref) return null
  return ('id' in ref ? getVehicle(ref.id) : getVehicleByIdPrefix(ref.prefix))
    .then((row) => (row.listed ? row : null))
    .catch(() => null)
})

export const revalidate = 60

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const v = await vehicleBySlug(slug)
  if (!v) return {}
  const title = `${v.make} ${v.model} ${v.year}`
  const description = `${title}, ${km(v.mileage)}, ${FUEL[v.fuelType].toLowerCase()}, boîte ${GEARBOX[v.transmission].toLowerCase()}. ${fcfa(v.price)}. ${STATE[v.status]}. Showroom Mansour Motors, Corniche Ouest, Dakar.`
  const image = shareImage(v)
  return {
    title,
    description,
    alternates: { canonical: vehicleUrl(v) },
    openGraph: { ...og, title, description, url: vehicleUrl(v), images: image ? [image] : og.images },
  }
}

export default async function Page({ params }: Props) {
  const { slug } = await params
  const [vehicle, all] = await Promise.all([vehicleBySlug(slug), listPublicVehicles({ limit: 100, withPhoto: true })])
  /* same rule as the lists: no photo, no public page yet */
  if (!vehicle || (!vehicle.images.length && !vehicle.extras.cover)) notFound()
  /* old uuid links and renamed cars land on the one canonical slug */
  if (slug !== vehicleSlug(vehicle)) permanentRedirect(vehicleUrl(vehicle))
  /* other cars: the three nearest in price */
  const others = all.data
    .filter((v) => v.id !== vehicle.id)
    .sort((a, b) => near(a.price, vehicle.price) - near(b.price, vehicle.price))
    .slice(0, 3)
  return (
    <>
      <JsonLd data={carLd(vehicle)} />
      <PublicVehicleDetail vehicle={vehicle} others={others} />
    </>
  )
}
