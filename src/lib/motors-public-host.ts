/** Canonical origin for every public motors URL (metadata, sitemap, JSON-LD). */
export const MOTORS_SITE = 'https://mansourmotors.sn'

/** Hostnames that serve the public Mansour Motors site (not the holding landing). */
const MOTORS_PUBLIC_HOSTS = new Set(['mansourmotors.sn', 'www.mansourmotors.sn'])

export function isMotorsPublicHost(hostHeader: string | null): boolean {
  if (!hostHeader) return false
  const host = hostHeader.split(':')[0]?.toLowerCase() ?? ''
  return MOTORS_PUBLIC_HOSTS.has(host)
}
