import type { MetadataRoute } from 'next'
import { MOTORS_SITE } from '@/lib/motors-public-host'
import { listVehicles } from '@/server/vehicles'
import { vehicleUrl } from './(motors)/_ui/shared'
import { motorsRoutes } from '@/lib/motors-routes'

export const revalidate = 3600

/* the public motors site only: the holding page and the back office stay out */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data } = await listVehicles({ limit: 500, withPhoto: true })
  const newest = data.reduce((max, v) => (v.updatedAt > max ? v.updatedAt : max), '')
  return [
    { url: MOTORS_SITE, lastModified: newest || undefined },
    { url: `${MOTORS_SITE}${motorsRoutes.stock}`, lastModified: newest || undefined },
    ...data.map((v) => ({ url: `${MOTORS_SITE}${vehicleUrl(v)}`, lastModified: v.updatedAt })),
  ]
}
