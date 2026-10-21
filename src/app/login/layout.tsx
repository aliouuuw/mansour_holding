import type { Metadata } from 'next'
import { excon } from '@/app/(motors)/fonts/excon'
import '../dashboard/dashboard.css'

export const metadata: Metadata = {
  title: 'Connexion · Mansour Motors',
  robots: { index: false },
}

/* login wears the back-office shell: same tokens, same font */
export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <div className={`${excon.variable} mm-dash`}>{children}</div>
}
