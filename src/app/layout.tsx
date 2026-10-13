import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import { Providers } from '@/components/providers'
import './globals.css'

/* self-hosted Playfair (variable, latin): no render-blocking @import chain to Google, and no font
   fetch at build time. Only the holding page uses it. */
const playfair = localFont({
  src: [
    { path: './fonts/playfair.woff2', weight: '400 900', style: 'normal' },
    { path: './fonts/playfair-italic.woff2', weight: '400 900', style: 'italic' },
  ],
  variable: '--font-playfair',
  preload: false,
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export const metadata: Metadata = {
  title: 'Mansour Holding',
  description: 'L\'autorité de l\'excellence durable',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={playfair.variable}>
      <head>
        <link rel="preconnect" href="https://images.unsplash.com" />
      </head>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
