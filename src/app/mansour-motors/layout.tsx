import type { Metadata, Viewport } from 'next'
import './motors.css'

export const viewport: Viewport = {
  viewportFit: 'cover',
}

const iconBase = '/mansour-motors'

export const metadata: Metadata = {
  title: 'Mansour Motors',
  description: 'Véhicules premium à Dakar. Un stock réel, au showroom de la route de la Corniche Ouest.',
  icons: {
    icon: [
      { url: `${iconBase}/favicon-32.png`, sizes: '32x32', type: 'image/png' },
      { url: `${iconBase}/favicon-16.png`, sizes: '16x16', type: 'image/png' },
    ],
    apple: `${iconBase}/apple-touch-icon.png`,
  },
}

export default function MotorsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Excon (Fontshare, free licence), the prototype's face */}
      <link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=excon@100,200,300,400,500&display=swap" precedence="default" />
      {children}
    </>
  )
}
