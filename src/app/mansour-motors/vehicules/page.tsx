import type { Metadata } from 'next'
import { listVehicles } from '@/server/vehicles'
import { og } from '../seo'
import { PublicVehicles } from './catalog'

export const revalidate = 60

const title = 'Véhicules en stock à Dakar'
const description =
  'Le stock Mansour Motors : SUV et 4x4, pick-up, berlines de luxe et sportives. Prix en FCFA, photos et fiche complète pour chaque véhicule.'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/mansour-motors/vehicules' },
  openGraph: { ...og, title, description, url: '/mansour-motors/vehicules' },
}

export default async function Page() {
  const { data } = await listVehicles({ limit: 200, sortBy: 'sortOrder', sortDir: 'asc', withPhoto: true })
  return <PublicVehicles vehicles={data} />
}
