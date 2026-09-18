import type { ApiVehicle } from '@/lib/api'
import { FUEL, STATE, cover, fcfa, focal, km, vehicleUrl } from './shared'

/* the stock card: the photograph rests in black and white and comes into colour
   when the car has your attention (hover, or nearest the middle on touch) */
export function Card({ v, eager = false }: { v: ApiVehicle; eager?: boolean }) {
  return (
    <article className="card" data-n={v.id} data-status={v.status}>
      <a className="card-link" href={vehicleUrl(v)}>
        <div className="media card-media">
          {/* eslint-disable-next-line @next/next/no-img-element -- object-position comes from the vehicle's focal point */}
          <img src={cover(v)} alt={`${v.make} ${v.model}`} style={{ '--pos': focal(v) } as React.CSSProperties} loading={eager ? 'eager' : 'lazy'} decoding="async" />
        </div>
        <div className="card-body">
          <p className="brand">{v.make}</p>
          <h3 className="card-model">{v.model}</h3>
          <p className="meta"><span>{v.year}</span><span>{km(v.mileage)}</span><span>{FUEL[v.fuelType]}</span></p>
          <p className="card-foot"><span className="card-price">{fcfa(v.price)}</span><span className="status" data-status={v.status}>{STATE[v.status]}</span></p>
        </div>
      </a>
    </article>
  )
}
