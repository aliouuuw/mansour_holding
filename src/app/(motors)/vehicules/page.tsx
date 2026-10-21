import type { Metadata } from 'next'
import { listPublicVehicles } from '@/server/vehicles'
import { og } from '../seo'
import { PublicVehicles } from './catalog'
import { motorsRoutes } from '@/lib/motors-routes'

export const revalidate = 60

const title = 'Véhicules en stock à Dakar'
const description =
  'Le stock Mansour Motors : SUV et 4x4, pick-up, berlines de luxe et sportives. Prix en FCFA, photos et fiche complète pour chaque véhicule.'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: motorsRoutes.stock },
  openGraph: { ...og, title, description, url: motorsRoutes.stock },
}

export default async function Page() {
  const { data } = await listPublicVehicles({ limit: 200, sortBy: 'sortOrder', sortDir: 'asc', withPhoto: true })
  return <PublicVehicles vehicles={data} />
}
