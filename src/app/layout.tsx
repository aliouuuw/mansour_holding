import type { Metadata, Viewport } from 'next'
import { Providers } from '@/components/providers'
import './globals.css'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

/* the app is Mansour Motors first; the holding page (app/holding) sets its own title */
export const metadata: Metadata = {
  title: 'Mansour Motors',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
