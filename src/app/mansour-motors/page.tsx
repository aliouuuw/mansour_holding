import type { Metadata } from 'next'
import { listVehicles } from '@/server/vehicles'
import { MansourMotorsLanding } from './landing'
import { JsonLd, dealerLd } from './seo'

export const revalidate = 60

export const metadata: Metadata = {
  alternates: { canonical: '/' },
}

export default async function Page() {
  /* all statuses: the floor plan shows reserved and sold cars too */
  const { data } = await listVehicles({ limit: 100 })
  return (
    <>
      <JsonLd data={dealerLd} />
      <MansourMotorsLanding vehicles={data} />
    </>
  )
}
