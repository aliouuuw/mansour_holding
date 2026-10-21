/** Canonical origin for every public motors URL (metadata, sitemap, JSON-LD). */
export const MOTORS_SITE = 'https://mansourmotors.sn'

/** Hostnames that serve the public Mansour Motors site. */
const MOTORS_PUBLIC_HOSTS = new Set(['mansourmotors.sn', 'www.mansourmotors.sn'])

/** Hostnames where / is the Mansour Holding page. Everywhere else (localhost, previews) / is Motors. */
const HOLDING_HOSTS = new Set(['mansour-holding.vercel.app'])

const hostOf = (hostHeader: string | null) => hostHeader?.split(':')[0]?.toLowerCase() ?? ''

export function isMotorsPublicHost(hostHeader: string | null): boolean {
  return MOTORS_PUBLIC_HOSTS.has(hostOf(hostHeader))
}

export function isHoldingHost(hostHeader: string | null): boolean {
  return HOLDING_HOSTS.has(hostOf(hostHeader))
}
