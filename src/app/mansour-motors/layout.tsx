import type { Metadata } from 'next'
import './motors.css'

export const metadata: Metadata = {
  title: 'Mansour Motors',
  description: 'Véhicules premium à Dakar. Un stock réel, au showroom de la route de la Corniche Ouest.',
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
