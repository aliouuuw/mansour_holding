import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  agentRules: false,
  experimental: {
    serverActions: {
      /* phone photos exceed the 1 MB Server Action default */
      bodySizeLimit: '12mb',
    },
  },
  serverExternalPackages: ['postgres'],
  async redirects() {
    /* the public site moved to the root (2026-10-21). Old links keep working; the query and
       the #fragment travel with the redirect. /mansour-motors/* asset paths are files, not pages. */
    return [
      { source: '/mansour-motors', destination: '/', permanent: true },
      { source: '/mansour-motors/vehicules', destination: '/vehicules', permanent: true },
      { source: '/mansour-motors/vehicules/:id', destination: '/vehicules/:id', permanent: true },
    ]
  },
  async rewrites() {
    const base = process.env.R2_PUBLIC_URL?.replace(/\/$/, '')
    if (!base) return []
    return [
      { source: '/mansour-motors/vehicles/:path*', destination: `${base}/mansour-motors/vehicles/:path*` },
      { source: '/mansour-motors/covers/:path*', destination: `${base}/mansour-motors/covers/:path*` },
    ]
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'pub-f32571f814724ac2a7ad9c9666a095bf.r2.dev' },
    ],
  },
}

export default nextConfig
