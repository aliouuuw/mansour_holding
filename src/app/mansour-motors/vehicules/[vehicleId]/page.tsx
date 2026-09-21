import { notFound } from 'next/navigation'
import { getVehicle, listVehicles } from '@/server/vehicles'
import { PublicVehicleDetail } from './detail'

/* a car with no price yet cannot be near one: it ranks after every priced car */
const near = (a: number | null, b: number | null) =>
  a == null || b == null ? Number.POSITIVE_INFINITY : Math.abs(a - b)

export const revalidate = 60

export default async function Page({
  params,
}: {
  params: Promise<{ vehicleId: string }>
}) {
  const { vehicleId } = await params

  try {
    const [vehicle, all] = await Promise.all([
      getVehicle(vehicleId),
      listVehicles({ limit: 100 }),
    ])
    /* other cars: the three nearest in price */
    const others = all.data
      .filter((v) => v.id !== vehicleId)
      .sort((a, b) => near(a.price, vehicle.price) - near(b.price, vehicle.price))
      .slice(0, 3)
    return <PublicVehicleDetail vehicle={vehicle} others={others} />
  } catch {
    notFound()
  }
}
