import { listVehicles } from '@/server/vehicles'
import { MansourMotorsLanding } from './landing'

export const revalidate = 60

export default async function Page() {
  const { data } = await listVehicles({ limit: 5, status: 'available' })
  return <MansourMotorsLanding featuredVehicles={data} />
}
