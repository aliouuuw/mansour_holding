import type { MetadataRoute } from 'next'
import { MOTORS_SITE } from '@/lib/motors-public-host'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/dashboard', '/api/', '/login', '/register'] },
    sitemap: `${MOTORS_SITE}/sitemap.xml`,
  }
}
