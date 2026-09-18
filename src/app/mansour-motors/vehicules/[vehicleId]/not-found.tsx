import { Link } from '@/lib/router'
import { Shell } from '../../_ui/shell'

export default function NotFound() {
  return (
    <Shell>
      <main className="wrap" style={{ paddingBlock: 'calc(var(--head) + 6rem) 8rem' }}>
        <div className="empty">
          <p className="h2">Ce véhicule n&apos;est plus en ligne.</p>
          <p className="lead">Il a peut-être été vendu. Le stock du showroom est à jour.</p>
          <Link className="btn" to="/mansour-motors/vehicules">Tout le stock <span className="arr" aria-hidden="true">→</span></Link>
        </div>
      </main>
    </Shell>
  )
}
