import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import { MOTORS_SITE } from '@/lib/motors-public-host'
import './motors.css'

/* Excon (Fontshare, free licence), self-hosted: no third-party CSS on the critical path */
const excon = localFont({
  src: [
    { path: './fonts/excon-100.woff2', weight: '100' },
    { path: './fonts/excon-300.woff2', weight: '300' },
    { path: './fonts/excon-400.woff2', weight: '400' },
    { path: './fonts/excon-500.woff2', weight: '500' },
  ],
  variable: '--font-excon',
  display: 'swap',
})

export const viewport: Viewport = {
  viewportFit: 'cover',
}

const iconBase = '/mansour-motors'
const description =
  'Véhicules premium neufs et d’occasion : Toyota, Land Rover, Mercedes-Benz, Rolls-Royce. Showrooms à Dakar, route de la Corniche Ouest, et à Conakry, Kaloum.'

export const metadata: Metadata = {
  metadataBase: new URL(MOTORS_SITE),
  title: {
    default: 'Mansour Motors | Véhicules premium à Dakar et Conakry',
    template: '%s | Mansour Motors',
  },
  description,
  openGraph: {
    type: 'website',
    siteName: 'Mansour Motors',
    locale: 'fr_SN',
    description,
    images: [{ url: '/mansour-motors/hero-still.jpg', width: 2688, height: 1520 }],
  },
  twitter: { card: 'summary_large_image' },
  icons: {
    icon: [
      { url: `${iconBase}/favicon-32.png`, sizes: '32x32', type: 'image/png' },
      { url: `${iconBase}/favicon-16.png`, sizes: '16x16', type: 'image/png' },
    ],
    apple: `${iconBase}/apple-touch-icon.png`,
  },
}

export default function MotorsLayout({ children }: { children: React.ReactNode }) {
  /* display: contents, so the wrapper only carries the font variable down to .mm */
  return <div className={excon.variable} style={{ display: 'contents' }}>{children}</div>
}
