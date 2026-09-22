import type { Metadata } from 'next'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import './dashboard.css'

const iconBase = '/mansour-motors'

export const metadata: Metadata = {
  title: 'Admin · Mansour Motors',
  description: 'Gestion du showroom Mansour Motors.',
  icons: {
    icon: [
      { url: `${iconBase}/favicon-32.png`, sizes: '32x32', type: 'image/png' },
      { url: `${iconBase}/favicon-16.png`, sizes: '16x16', type: 'image/png' },
    ],
    apple: `${iconBase}/apple-touch-icon.png`,
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <link
        rel="stylesheet"
        href="https://api.fontshare.com/v2/css?f[]=excon@100,200,300,400,500&display=swap"
        precedence="default"
      />
      <DashboardLayout>{children}</DashboardLayout>
    </>
  )
}
