import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  agentRules: false,
  serverExternalPackages: ['postgres'],
  async redirects() {
    return [
      { source: '/vehicules', destination: '/mansour-motors/vehicules', permanent: true },
      { source: '/vehicules/:vehicleId', destination: '/mansour-motors/vehicules/:vehicleId', permanent: true },
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
