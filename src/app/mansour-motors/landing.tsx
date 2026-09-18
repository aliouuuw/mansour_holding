'use client'

import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Link } from '@/lib/router'
import type { ApiVehicle } from '@/lib/api'
import { Shell, OpenNote } from './_ui/shell'
import { ShowroomMap } from './_ui/showroom-map'
import { lineup, toCar } from './_ui/car'
import { CONTACT, DAY, FUEL, HOURS, STATE, cover, fcfa, focal, km, pad2, vehicleUrl, waLink } from './_ui/shared'

const BUDGETS = [30, 50, 70, 100]

/* ── chapter 1: one car on a plate, and the search on the same black ── */
function Hero({ star, vehicles }: { star?: ApiVehicle; vehicles: ApiVehicle[] }) {
  const router = useRouter()
  const [make, setMake] = useState('')
  const makes = useMemo(() => [...new Set(vehicles.map((v) => v.make))].sort((a, b) => a.localeCompare(b, 'fr')), [vehicles])
  const models = useMemo(() => vehicles.filter((v) => v.make === make).map((v) => v.model), [vehicles, make])

  const search = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const q = new URLSearchParams()
    for (const [k, v] of new FormData(e.currentTarget)) if (v) q.set(k, String(v))
    router.push(`/mansour-motors/vehicules${q.size ? `?${q}` : ''}`)
  }

  return (
    <section className="hero ch-dark" aria-label="Véhicule à la une">
      {star && (
        <>
          <div className="hero-rail">
            <p className="brand">{star.make}</p>
            <h2 className="hero-title">{star.model}</h2>
            <div><span className="status" data-status={star.status}>{STATE[star.status]}</span></div>
            <dl className="figures">
              <dt>Année</dt><dd>{star.year}</dd>
              <dt>Kilométrage</dt><dd>{km(star.mileage)}</dd>
              <dt>Énergie</dt><dd>{FUEL[star.fuelType]}</dd>
            </dl>
            <dl className="figures figures-price"><dt>Prix</dt><dd>{fcfa(star.price)}</dd></dl>
            <Link className="btn btn-light" to={vehicleUrl(star)}>Voir le véhicule <span className="arr" aria-hidden="true">→</span></Link>
          </div>
          <div className="hero-stage">
            <Link className="hero-plate" to={vehicleUrl(star)} aria-label={`${star.make} ${star.model}`}>
              <span className="crop" aria-hidden="true" />
              {/* eslint-disable-next-line @next/next/no-img-element -- object-position comes from the vehicle's focal point */}
              <img src={cover(star)} alt={`${star.make} ${star.model}, ${star.color}`} style={{ '--pos': focal(star) } as React.CSSProperties} decoding="async" fetchPriority="high" />
            </Link>
          </div>
        </>
      )}
      <form className="hero-dock" action="/mansour-motors/vehicules" onSubmit={search}>
        <p className="dock-title">Trouver un véhicule</p>
        <label><span>Marque</span>
          <select name="marque" value={make} onChange={(e) => setMake(e.target.value)}>
            <option value="">Toutes</option>
            {makes.map((m) => <option key={m}>{m}</option>)}
          </select>
        </label>
        <label><span>Modèle</span>
          <select name="modele" disabled={!make} key={make}>
            <option value="">{make ? 'Tous' : "Marque d'abord"}</option>
            {models.map((m) => <option key={m}>{m}</option>)}
          </select>
        </label>
        <label><span>Budget</span>
          <select name="budget">
            <option value="">Tous les budgets</option>
            {BUDGETS.map((b) => <option key={b} value={b * 1_000_000}>{b} M FCFA max.</option>)}
          </select>
        </label>
        <button className="btn btn-light" type="submit">Rechercher <span className="arr" aria-hidden="true">→</span></button>
      </form>
    </section>
  )
}

/* ── chapter 2: the line-up. Scroll turns the WebGL plateau (see _ui/turntable.js) ── */
function Lineup({ vehicles }: { vehicles: ApiVehicle[] }) {
  const ref = useRef<HTMLElement>(null)
  const router = useRouter()
  const cars = useMemo(() => vehicles.map(toCar), [vehicles])
  const available = vehicles.filter((v) => v.status === 'available').length

  useEffect(() => {
    let table: { destroy(): void } | undefined
    let dead = false
    import('./_ui/turntable.js').then(({ mountTurntable }) => {
      if (dead || !ref.current) return
      const t = mountTurntable(ref.current, { drive: 'scroll', modes: ['ring', 'list'], navigate: (href: string) => router.push(href) })
      t.setCars(cars)
      table = t
    })
    return () => { dead = true; table?.destroy() }
  }, [cars, router])

  return (
    <section className="lineup ch-dark is-ring" aria-label="La gamme en stock" ref={ref}>
      <div className="lineup-pin">
        <div className="wrap lineup-head">
          <div>
            <h2 className="h2">En stock au showroom</h2>
            <p className="lead">{available} disponibles sur {vehicles.length}. Faites défiler, ou choisissez un repère sous le plateau.</p>
          </div>
          <div className="lineup-tools">
            <div className="seg" role="group" aria-label="Affichage" data-view>
              <button type="button" data-mode="ring" aria-pressed="true">Plateau</button>
              <button type="button" data-mode="list" aria-pressed="false">Liste</button>
            </div>
            <Link className="btn btn-ghost-light" to="/mansour-motors/vehicules">Tout le stock <span className="arr" aria-hidden="true">→</span></Link>
          </div>
        </div>
        <div className="ring-stage" data-stage>
          <canvas className="ring-canvas" data-canvas tabIndex={0} role="img" aria-label="Plateau des véhicules en stock. Flèches gauche et droite pour changer de véhicule, Entrée pour l'ouvrir." />
          <div className="ring-hud" data-hud>
            <div className="ticks" role="group" aria-label="Aller au véhicule" data-ticks />
            <p className="count" data-lineup-count />
            <div className="ring-copy">
              <p className="ring-name" data-lineup-name />
              <p className="ring-specs" data-lineup-specs />
            </div>
            <p className="ring-price" data-lineup-price />
            <a className="btn btn-light" href="#" data-open-front>Voir le véhicule <span className="arr" aria-hidden="true">→</span></a>
          </div>
          <p className="vh" aria-live="polite" data-live />
          <ol className="index" data-index hidden />
        </div>
      </div>
    </section>
  )
}

/* ── chapter 3: the promise inks in as you read; the floor plan proves it ── */
const PROMISE = 'Une maison, un stock réel. Chaque véhicule présenté ici est au showroom, route de la Corniche Ouest. Vous pouvez venir le voir le jour même.'

/* 8 bays: the cars on the floor first (oldest arrival in bay 01), then the latest sold as traces */
function bays(vs: ApiVehicle[]) {
  const byArrival = [...vs].sort((a, b) => a.createdAt.localeCompare(b.createdAt))
  const floor = byArrival.filter((v) => v.status !== 'sold')
  const sold = byArrival.filter((v) => v.status === 'sold').reverse()
  return [...floor, ...sold].slice(0, 8)
}

function Statement({ vehicles }: { vehicles: ApiVehicle[] }) {
  const inkRef = useRef<HTMLParagraphElement>(null)
  const planRef = useRef<HTMLOListElement>(null)
  const plan = useMemo(() => bays(vehicles), [vehicles])

  useEffect(() => {
    const ink = inkRef.current
    const planEl = planRef.current
    if (!ink || !planEl) return
    const words = [...ink.querySelectorAll('span')]
    const links = [...planEl.querySelectorAll('a')]
    const reduce = matchMedia('(prefers-reduced-motion: reduce)')
    let raf = 0
    const inkIn = () => {
      if (reduce.matches) { [...words, ...links].forEach((el) => el.classList.add('on')); return }
      const r = ink.getBoundingClientRect()
      const p = Math.min(1, Math.max(0, (innerHeight * 0.82 - r.top) / (r.height + innerHeight * 0.3)))
      const on = Math.round(p * words.length)
      words.forEach((s, i) => s.classList.toggle('on', i < on))
      /* the bays light one by one as the sentence is read */
      links.forEach((b, i) => b.classList.toggle('on', p >= (i + 1) / (links.length + 1)))
    }
    const onScroll = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(inkIn) }
    addEventListener('scroll', onScroll, { passive: true })
    inkIn()
    return () => { removeEventListener('scroll', onScroll); cancelAnimationFrame(raf) }
  }, [])

  const car = <svg viewBox="0 0 40 84"><use href="#car-top" /></svg>
  return (
    <section className="statement ch-light">
      <div className="wrap statement-grid">
        <p className="ink" ref={inkRef}>{PROMISE.split(' ').map((w, i) => <span key={i}>{w} </span>)}</p>
        <figure className="plan">
          <ol className="plan-bays" aria-label="Plan du showroom, un emplacement par véhicule" ref={planRef}>
            {plan.map((v, i) => (
              <li key={v.id}>
                <Link to={vehicleUrl(v)} data-status={v.status} aria-label={`Emplacement ${pad2(i + 1)} : ${v.make} ${v.model}, ${STATE[v.status]}`}>
                  <span className="bay-n">{pad2(i + 1)}</span>
                  <svg className="bay-car" viewBox="0 0 40 84" aria-hidden="true"><use href="#car-top" /></svg>
                  <span className="bay-name">{v.make.split('-')[0]}</span>
                </Link>
              </li>
            ))}
          </ol>
          <figcaption className="plan-street">Entrée, route de la Corniche Ouest, Almadies</figcaption>
          <p className="plan-key" aria-hidden="true">
            <span data-status="available">{car}Disponible</span>
            <span data-status="reserved">{car}Réservé</span>
            <span data-status="sold">{car}Vendu</span>
          </p>
        </figure>
      </div>
    </section>
  )
}

/* ── chapter 4: the showroom on its street, and the week ── */
function Week() {
  const [now, setNow] = useState<Date | null>(null)
  useEffect(() => {
    setNow(new Date())
    const t = setInterval(() => setNow(new Date()), 60_000)
    return () => clearInterval(t)
  }, [])
  const today = now?.getUTCDay()
  return (
    <div className="week">
      {[1, 2, 3, 4, 5, 6, 0].map((d) => {
        const hh = HOURS[d]
        const name = DAY[d][0].toUpperCase() + DAY[d].slice(1, 3) + '.'
        /* today's bar: how far through the opening hours we are, Dakar time */
        const h = now ? now.getUTCHours() + now.getUTCMinutes() / 60 : 0
        const fill = hh ? Math.min(1, Math.max(0, (h - hh[0]) / (hh[1] - hh[0]))) : 0
        return (
          <div key={d} className="day" aria-current={d === today ? 'date' : undefined} data-closed={hh ? undefined : ''}
            style={d === today ? ({ '--day': fill.toFixed(3) } as React.CSSProperties) : undefined}>
            <b>{name}</b><span>{hh ? <>{hh[0]}h<br />{hh[1]}h</> : 'Fermé'}</span>
          </div>
        )
      })}
    </div>
  )
}

function Visit() {
  return (
    <section className="ch-dark visit-ch" id="showroom">
      <div className="map-stage"><ShowroomMap /></div>
      <div className="wrap visit-home">
        <p className="brand">Showroom</p>
        <p className="address">Route de la Corniche Ouest<br />Almadies, Dakar</p>
        <p className="week-note"><OpenNote /></p>
        <Week />
        <div className="actions">
          <a className="btn btn-light" href={CONTACT.maps} target="_blank" rel="noopener">Itinéraire <span className="arr" aria-hidden="true">→</span></a>
          <a className="btn btn-ghost-light" href={CONTACT.tel}>Appeler <span className="arr" aria-hidden="true">→</span></a>
        </div>
      </div>
      <p className="map-credit">Plan : © contributeurs OpenStreetMap</p>
    </section>
  )
}

/* ── chapter 5: not in stock yet? The message is shown before it is sent ── */
type Wish = { want: string; budget: string; year: string; name: string; tel: string }

/* one builder for the preview and for what is sent, so they never differ */
function alertText(w: Wish) {
  return [
    'Bonjour Mansour Motors, je recherche un véhicule.',
    `Modèle : ${w.want.trim() || '…'}`,
    w.budget && `Budget maximum : ${w.budget}`,
    w.year && `Année minimum : ${w.year}`,
    w.name.trim() && `Nom : ${w.name.trim()}`,
    w.tel.trim() && `Téléphone : ${w.tel.trim()}`,
    'Merci de me prévenir quand un véhicule correspond.',
  ].filter(Boolean).join('\n')
}

function Alert() {
  const [wish, setWish] = useState<Wish>({ want: '', budget: '', year: '', name: '', tel: '' })
  const [msg, setMsg] = useState('')
  const wantRef = useRef<HTMLInputElement>(null)
  const set = (k: keyof Wish) => (e: { target: { value: string } }) => { setMsg(''); setWish((w) => ({ ...w, [k]: e.target.value })) }
  const send = (e: FormEvent) => {
    e.preventDefault()
    if (!wish.want.trim()) { setMsg('Indiquez la marque et le modèle recherchés.'); wantRef.current?.focus(); return }
    window.open(waLink(alertText(wish)), '_blank', 'noopener')
  }
  return (
    <section className="ch-light" id="alerte">
      <div className="wrap alert">
        <div>
          <h2 className="h2">Vous ne trouvez pas votre modèle ?</h2>
          <p className="lead">Dites-nous ce que vous cherchez. La demande part sur WhatsApp, et le showroom vous recontacte quand un véhicule correspond.</p>
          <div className="wa-preview">
            <p className="wa-preview-label" id="wa-preview-label">Le message qui part</p>
            <p className="wa-bubble" aria-labelledby="wa-preview-label">{alertText(wish)}</p>
          </div>
        </div>
        <form className="alert-form" noValidate onSubmit={send}>
          <span className="crop" aria-hidden="true" />
          <label className="field full"><span>Marque et modèle recherchés</span>
            <input ref={wantRef} value={wish.want} onChange={set('want')} placeholder="Par exemple : Toyota Land Cruiser 300" autoComplete="off" />
          </label>
          <label className="field"><span>Budget maximum</span>
            <select value={wish.budget} onChange={set('budget')}>
              <option value="">À discuter</option>
              {BUDGETS.map((b) => <option key={b}>{b} 000 000 FCFA</option>)}
            </select>
          </label>
          <label className="field"><span>Année minimum</span>
            <select value={wish.year} onChange={set('year')}>
              <option value="">Indifférent</option>
              {[2022, 2023, 2024, 2025].map((y) => <option key={y}>{y}</option>)}
            </select>
          </label>
          <label className="field"><span>Votre nom</span><input value={wish.name} onChange={set('name')} autoComplete="name" /></label>
          <label className="field"><span>Téléphone</span><input value={wish.tel} onChange={set('tel')} type="tel" inputMode="tel" autoComplete="tel" /></label>
          <p className="form-msg full" role="status">{msg}</p>
          <button className="btn full" type="submit">Être prévenu sur WhatsApp <span className="arr" aria-hidden="true">→</span></button>
        </form>
      </div>
    </section>
  )
}

export function MansourMotorsLanding({ vehicles }: { vehicles: ApiVehicle[] }) {
  const ordered = useMemo(() => lineup(vehicles), [vehicles])
  const star = ordered.find((v) => v.status === 'available') ?? ordered[0]
  return (
    <Shell className="on-dark-top">
      <main>
        <h1 className="vh">Mansour Motors, véhicules premium à Dakar</h1>
        <Hero star={star} vehicles={vehicles} />
        {ordered.length > 0 && <Lineup vehicles={ordered} />}
        <Statement vehicles={vehicles} />
        <Visit />
        <Alert />
      </main>
    </Shell>
  )
}
