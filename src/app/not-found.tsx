import type { Metadata } from 'next'
import { motorsRoutes } from '@/lib/motors-routes'
import { excon } from './(motors)/fonts/excon'
import { Button, Shell } from './(motors)/_ui'
import './(motors)/motors.css'

export const metadata: Metadata = {
  title: 'Page introuvable | Mansour Motors',
  robots: { index: false },
}

/* every unknown URL: the root not-found renders outside the (motors) layout, so it loads the font and styles itself */
export default function NotFound() {
  return (
    <div className={excon.variable} style={{ display: 'contents' }}>
      <Shell>
        <main className="wrap" style={{ paddingBlock: 'calc(var(--head) + 6rem) 8rem' }}>
          <div className="empty">
            <h1 className="h2">Cette page n&apos;existe pas.</h1>
            <p className="lead">L&apos;adresse a peut-être changé. Le stock du showroom est à jour.</p>
            <Button to={motorsRoutes.stock}>Voir les véhicules</Button>
          </div>
        </main>
      </Shell>
    </div>
  )
}
