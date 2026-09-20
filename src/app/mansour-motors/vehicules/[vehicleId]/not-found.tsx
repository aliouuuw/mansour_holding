import { Button, Shell } from '../../_ui'

export default function NotFound() {
  return (
    <Shell>
      <main className="wrap" style={{ paddingBlock: 'calc(var(--head) + 6rem) 8rem' }}>
        <div className="empty">
          <p className="h2">Ce véhicule n&apos;est plus en ligne.</p>
          <p className="lead">Il a peut-être été vendu. Le stock du showroom est à jour.</p>
          <Button to="/mansour-motors/vehicules">Tout le stock</Button>
        </div>
      </main>
    </Shell>
  )
}
