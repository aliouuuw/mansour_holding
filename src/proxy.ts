import { NextResponse, type NextRequest } from 'next/server'
import { isHoldingHost, isMotorsPublicHost } from '@/lib/motors-public-host'

/* Motors owns the URL space (/, /vehicules). The holding page lives at /holding:
   the holding host shows it at /, the brand domain never shows it. */
export function proxy(request: NextRequest) {
  const host = request.headers.get('host')
  const { pathname } = request.nextUrl
  if (pathname === '/' && isHoldingHost(host)) {
    const url = request.nextUrl.clone()
    url.pathname = '/holding'
    return NextResponse.rewrite(url)
  }
  if (pathname.startsWith('/holding') && isMotorsPublicHost(host)) {
    /* no such page on mansourmotors.sn: rewrite to a path no route matches, so it renders the 404 */
    const url = request.nextUrl.clone()
    url.pathname = '/_holding-not-here'
    return NextResponse.rewrite(url)
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/holding/:path*'],
}
