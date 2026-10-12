/** Hostnames that serve the public Mansour Motors site (not the holding landing). */
const MOTORS_PUBLIC_HOSTS = new Set(['mansourmotors.sn', 'www.mansourmotors.sn'])

export function isMotorsPublicHost(hostHeader: string | null): boolean {
  if (!hostHeader) return false
  const host = hostHeader.split(':')[0]?.toLowerCase() ?? ''
  return MOTORS_PUBLIC_HOSTS.has(host)
}

/** Paths that stay on the brand domain without mapping to /mansour-motors. */
export function isMotorsStaffOrSystemPath(pathname: string): boolean {
  return (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/dashboard') ||
    pathname === '/login' ||
    pathname === '/register'
  )
}

export function isMotorsPublicAssetPath(pathname: string): boolean {
  return /\.(?:ico|png|jpe?g|webp|svg|gif|css|js|mjs|map|woff2?|txt|xml)$/i.test(pathname)
}
