import type { Metadata, Viewport } from 'next'
import { Playfair_Display } from 'next/font/google'
import { Providers } from '@/components/providers'
import './globals.css'

/* self-hosted by next/font: no render-blocking @import chain to Google. Only the holding page uses it. */
const playfair = Playfair_Display({
  subsets: ['latin'],
  style: ['normal', 'italic'],
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
