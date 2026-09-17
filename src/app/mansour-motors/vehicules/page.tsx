import { listVehicles } from '@/server/vehicles'
import { PublicVehicles } from './catalog'

export const revalidate = 60

export default async function Page() {
  const { data } = await listVehicles({ limit: 200 })
  return <PublicVehicles vehicles={data} />
}
