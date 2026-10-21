import type { Metadata } from 'next'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { excon } from '@/app/mansour-motors/fonts/excon'
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
    <div className={excon.variable} style={{ display: 'contents' }}>
      <DashboardLayout>{children}</DashboardLayout>
    </div>
  )
}
