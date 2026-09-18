import { notFound } from 'next/navigation'
import { getVehicle, listVehicles } from '@/server/vehicles'
import { PublicVehicleDetail } from './detail'

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
      .sort((a, b) => Math.abs(a.price - vehicle.price) - Math.abs(b.price - vehicle.price))
      .slice(0, 3)
    return <PublicVehicleDetail vehicle={vehicle} others={others} />
  } catch {
    notFound()
  }
}
