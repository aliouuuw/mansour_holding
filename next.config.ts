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
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'pub-f32571f814724ac2a7ad9c9666a095bf.r2.dev' },
    ],
  },
}

export default nextConfig
