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
    const [vehicle, related] = await Promise.all([
      getVehicle(vehicleId),
      listVehicles({ limit: 6, status: 'available' }),
    ])
    return (
      <PublicVehicleDetail
        vehicle={vehicle}
        relatedVehicles={related.data.filter((v) => v.id !== vehicleId).slice(0, 5)}
      />
    )
  } catch {
    notFound()
  }
}
