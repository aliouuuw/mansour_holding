import { listVehicles } from '@/server/vehicles'
import { MansourMotorsLanding } from './landing'

export const revalidate = 60

export default async function Page() {
  /* all statuses: the floor plan shows reserved and sold cars too */
  const { data } = await listVehicles({ limit: 100 })
  return <MansourMotorsLanding vehicles={data} />
}
