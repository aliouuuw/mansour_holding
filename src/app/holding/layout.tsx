import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { preconnect } from 'react-dom'

/* self-hosted Playfair (variable, latin): only the holding page uses it */
const playfair = localFont({
  src: [
    { path: '../fonts/playfair.woff2', weight: '400 900', style: 'normal' },
    { path: '../fonts/playfair-italic.woff2', weight: '400 900', style: 'italic' },
  ],
  variable: '--font-playfair',
  preload: false,
})

export const metadata: Metadata = {
  title: 'Mansour Holding',
  description: 'L\'autorité de l\'excellence durable',
}

/* served at / on the holding host only (src/proxy.ts). Moves to its own site later. */
export default function HoldingLayout({ children }: { children: React.ReactNode }) {
  preconnect('https://images.unsplash.com')
  return <div className={playfair.variable} style={{ display: 'contents' }}>{children}</div>
}
