import type { Metadata, Viewport } from 'next'
import { MOTORS_SITE } from '@/lib/motors-public-host'
import { og } from './seo'
import { excon } from './fonts/excon'
import './motors.css'


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
  openGraph: { ...og, description },
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
