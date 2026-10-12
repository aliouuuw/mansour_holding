import { NextResponse, type NextRequest } from 'next/server'
import {
  isMotorsPublicAssetPath,
  isMotorsPublicHost,
  isMotorsStaffOrSystemPath,
} from '@/lib/motors-public-host'

/** Brand domain → /mansour-motors/*; staff routes and /api stay as-is. */
export function middleware(request: NextRequest) {
  if (!isMotorsPublicHost(request.headers.get('host'))) {
    return NextResponse.next()
  }

  const { pathname } = request.nextUrl

  if (
    isMotorsStaffOrSystemPath(pathname) ||
    isMotorsPublicAssetPath(pathname) ||
    pathname.startsWith('/mansour-motors')
  ) {
    return NextResponse.next()
  }

  const url = request.nextUrl.clone()

  if (pathname === '/') {
    url.pathname = '/mansour-motors'
    return NextResponse.rewrite(url)
  }

  if (pathname === '/vehicules' || pathname.startsWith('/vehicules/')) {
    url.pathname = `/mansour-motors${pathname}`
    return NextResponse.rewrite(url)
  }

  url.pathname = '/mansour-motors'
  return NextResponse.rewrite(url)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image).*)'],
}
