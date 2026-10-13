import { NextResponse, type NextRequest } from 'next/server'
import { isMotorsPublicHost } from '@/lib/motors-public-host'

/* Brand domain home → /mansour-motors. Every other path is served as-is:
   /mansour-motors/* already lives there, /vehicules is a 308 in next.config,
   and unknown paths 404 instead of serving the home page (soft 404). */
export function middleware(request: NextRequest) {
  if (!isMotorsPublicHost(request.headers.get('host'))) return NextResponse.next()
  const url = request.nextUrl.clone()
  url.pathname = '/mansour-motors'
  return NextResponse.rewrite(url)
}

export const config = {
  matcher: ['/'],
}
