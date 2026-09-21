'use client'

import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Link } from '@/lib/router'
import type { ApiVehicle } from '@/lib/api'
import { Button, Chapter, Field, OpenNote, Plate, Shell, ShowroomMap } from './_ui'
import { lineup, toCar } from './_ui/car'
import { BUDGETS, CONTACT, DAY, HOURS, STATE, YEARS, pad2, vehicleUrl, waLink } from './_ui/shared'

function prestige(vehicles: ApiVehicle[]) {
  const open = vehicles.filter((v) => v.status !== 'sold')
  return open.find((v) => v.make === 'Rolls-Royce')
    ?? lineup(open).find((v) => v.status === 'available')
    ?? open[0]
    ?? vehicles[0]
}

/* ── chapter 1: the prestige car on the floor. Camera enters the room. ── */
function Hero({ star, fresh }: { star?: ApiVehicle; fresh?: boolean }) {
  const ref = useRef<HTMLElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const fine = window.matchMedia('(pointer: fine)').matches
    const motion = window.matchMedia('(prefers-reduced-motion: no-preference)').matches
    if (!fine || !motion) return
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      const x = ((e.clientX - r.left) / r.width) * 2 - 1
      const y = ((e.clientY - r.top) / r.height) * 2 - 1
      el.style.setProperty('--mx', String(Math.max(-1, Math.min(1, x))))
      el.style.setProperty('--my', String(Math.max(-1, Math.min(1, y))))
    }
    const onLeave = () => {
      el.style.setProperty('--mx', '0')
      el.style.setProperty('--my', '0')
    }
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    return () => {
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
    }
  }, [])
  if (!star) return null
  return (
    <section
      className="hero ch-light relative isolate h-svh min-h-dvh overflow-hidden bg-mm-paper text-mm-ink"
      aria-label={fresh ? `${star.make} ${star.model}, dernière arrivée à Dakar` : `${star.make} ${star.model}`}
      ref={ref}
    >
      <div className="hero-stage pointer-events-none z-0 origin-[72%_58%] max-mm:origin-[50%_58%]" aria-hidden="true">
        <div className="hero-cam origin-[72%_58%] max-mm:origin-[50%_58%]">
          <picture className="block size-full">
            <source media="(max-width: 860px)" srcSet="/mansour-motors/hero-still-m.jpg" width={1080} height={1920} />
            {/* local Higgsfield still, full-bleed cover */}
            <img
              className="hero-still object-[58%_50%] max-mm:object-[50%_62%] [transform:translate3d(calc(var(--mx)*-1.5%),calc(var(--my)*-.9%),0)]"
              src="/mansour-motors/hero-still.jpg"
              alt=""
              width={2688}
              height={1520}
              decoding="async"
              fetchPriority="high"
            />
          </picture>
        </div>
        <div className="hero-glint" />
      </div>
      <div className="hero-copy pointer-events-none absolute inset-0 z-[2] flex flex-col items-start justify-end gap-[.45rem] bg-[linear-gradient(to_top,rgb(243_242_239_/_0.82)_0%,rgb(243_242_239_/_0.38)_26%,rgb(243_242_239_/_0.08)_46%,transparent_62%)] px-[var(--pad)] pb-[4%] max-mm:gap-1.5 max-mm:bg-[linear-gradient(to_top,rgb(243_242_239_/_0.86)_0%,rgb(243_242_239_/_0.4)_28%,rgb(243_242_239_/_0.08)_48%,transparent_64%)] max-mm:pb-[calc(1.1rem+env(safe-area-inset-bottom,0px))]">
        {fresh && <p className="hero-arrival mb-[.55em] text-[.78rem] font-medium uppercase tracking-[.22em] text-mm-grey max-mm:mb-[.28em] max-mm:tracking-[.2em]">Dernière arrivée à Dakar</p>}
        <h2 className="hero-title text-balance text-[clamp(4rem,_13vw,_10.5rem)] font-extralight leading-[.86] tracking-[-.04em] [overflow-wrap:anywhere] text-mm-ink max-mm:text-[clamp(2.6rem,_11vw,_3.6rem)] max-mm:tracking-[-.03em]">{star.model}</h2>
        <p className="brand">{star.make}</p>
        <Button className="pointer-events-auto" to={vehicleUrl(star)}>Voir le véhicule</Button>
      </div>
    </section>
  )
}

/* ── chapter 2: the line-up. Hover pulls neighbouring plates (see _ui/turntable.js) ── */
/* The plateau fans the cars across one frame. Past this many the plates
   compress into slivers you cannot read, so the rest live on the stock page. */
const PLATEAU = 7

function Lineup({ vehicles, total }: { vehicles: ApiVehicle[]; total: number }) {
  const ref = useRef<HTMLElement>(null)
  const router = useRouter()
  const cars = useMemo(() => vehicles.map(toCar), [vehicles])
  const available = vehicles.filter((v) => v.status === 'available').length
  /* name the whole stock, then what this frame holds: the rest are one click away */
  const shown = total > vehicles.length
    ? `${total} véhicules au showroom, ${vehicles.length} sur le plateau`
    : `${available} disponible${available > 1 ? 's' : ''} sur ${total}`

  useEffect(() => {
    let table: { destroy(): void } | undefined
    let dead = false
    let gen = 0
    const mq = window.matchMedia('(max-width: 860px)')
    const mount = () => {
      const id = ++gen
      table?.destroy()
      table = undefined
      const phone = mq.matches
      import('./_ui/turntable.js').then(({ mountTurntable }) => {
        if (dead || id !== gen || !ref.current) return
        const t = mountTurntable(ref.current, {
          drive: phone ? 'pointer' : 'hover',
          modes: phone ? ['atelier'] : ['ring', 'list'],
          navigate: (href: string) => router.push(href),
        })
        t.setCars(cars)
        table = t
      })
    }
    mount()
    mq.addEventListener('change', mount)
    return () => { dead = true; mq.removeEventListener('change', mount); table?.destroy() }
  }, [cars, router])

  return (
    <Chapter tone="dark" className="lineup is-ring" aria-label="La gamme en stock" ref={ref}>
      <div className="lineup-pin">
        <div className="wrap lineup-head">
          <div>
            <h2 className="h2">En stock au showroom</h2>
            <p className="lead lead-ring">{shown}. Survolez un véhicule. Les voisins se rapprochent.</p>
            <p className="lead lead-list">{shown}. Prix et état sur chaque ligne.</p>
            <p className="lead lead-atelier">{shown}. Glissez la rangée. Touchez la photo pour ouvrir.</p>
          </div>
          <div className="lineup-tools">
            <div className="seg" role="group" aria-label="Affichage" data-view>
              <button type="button" data-mode="ring" aria-pressed="true">Plateau</button>
              <button type="button" data-mode="list" aria-pressed="false">Liste</button>
            </div>
            <Button to="/mansour-motors/vehicules">Tout le stock</Button>
          </div>
        </div>
        <div className="ring-stage" data-stage>
          <canvas className="ring-canvas" data-canvas tabIndex={0} role="img" aria-label="Plateau des véhicules en stock. Survolez un véhicule. Flèches gauche et droite pour changer, Entrée pour l'ouvrir." />
          <div className="ring-hud" data-hud>
            <div className="ticks" role="group" aria-label="Aller au véhicule" data-ticks />
            <p className="count" data-lineup-count />
            <div className="ring-copy">
              <p className="ring-name" data-lineup-name />
              <p className="ring-specs" data-lineup-specs />
            </div>
            <p className="ring-price" data-lineup-price />
            <Button href="#" data-open-front="">Voir le véhicule</Button>
          </div>
          <p className="vh" aria-live="polite" data-live />
          <ol className="index wrap" data-index hidden />
        </div>
        <div className="atelier" data-atelier hidden>
          <a className="atelier-hero ch-dark" href="#" data-atelier-hero>
            {/* eslint-disable-next-line @next/next/no-img-element -- filled by turntable.js */}
            <img data-atelier-img alt="" decoding="async" />
            <div className="atelier-meta">
              <p className="count" data-atelier-count />
              <p className="brand" data-atelier-brand />
              <p className="atelier-name" data-atelier-name />
              <p className="atelier-specs" data-atelier-specs />
              <div data-atelier-status />
              <p className="atelier-price" data-atelier-price />
              <Plate>Voir le véhicule</Plate>
            </div>
          </a>
          <div className="atelier-rail wrap">
            <p className="atelier-kicker">La rangée</p>
            <div className="atelier-strip" data-atelier-strip />
          </div>
        </div>
      </div>
    </Chapter>
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
    <Chapter className="statement">
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
    </Chapter>
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
    <Chapter tone="dark" className="visit-ch" id="showroom">
      <div className="map-stage"><ShowroomMap /></div>
      <div className="wrap visit-home">
        <p className="brand">Showroom</p>
        <h2 className="address">Route de la Corniche Ouest<br />Almadies, Dakar</h2>
        <p className="week-note"><OpenNote /></p>
        <Week />
        <div className="actions">
          <Button href={CONTACT.tel}>Appeler</Button>
          <Button tone="soft" href={CONTACT.maps} target="_blank" rel="noopener">Itinéraire</Button>
        </div>
      </div>
      <p className="map-credit">Plan : © contributeurs OpenStreetMap</p>
    </Chapter>
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
    <Chapter id="alerte">
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
          <Field className="full" label="Marque et modèle recherchés">
            <input ref={wantRef} value={wish.want} onChange={set('want')} placeholder="Par exemple : Toyota Land Cruiser 300" autoComplete="off" />
          </Field>
          <Field label="Budget maximum">
            <select value={wish.budget} onChange={set('budget')}>
              <option value="">À discuter</option>
              {BUDGETS.map((b) => <option key={b}>{b} 000 000 FCFA</option>)}
            </select>
          </Field>
          <Field label="Année minimum">
            <select value={wish.year} onChange={set('year')}>
              <option value="">Indifférent</option>
              {YEARS.map((y) => <option key={y}>{y}</option>)}
            </select>
          </Field>
          <Field label="Votre nom"><input value={wish.name} onChange={set('name')} autoComplete="name" /></Field>
          <Field label="Téléphone"><input value={wish.tel} onChange={set('tel')} type="tel" inputMode="tel" autoComplete="tel" /></Field>
          <p className="form-msg full" role="status">{msg}</p>
          <Button className="full" type="submit">Être prévenu sur WhatsApp</Button>
        </form>
      </div>
    </Chapter>
  )
}

export function MansourMotorsLanding({ vehicles }: { vehicles: ApiVehicle[] }) {
  const ordered = useMemo(() => lineup(vehicles), [vehicles])
  const star = prestige(ordered)
  const fresh = !!star && ordered.every((v) => v.createdAt <= star.createdAt)
  return (
    <Shell>
      <main>
        <h1 className="vh">Mansour Motors, véhicules premium à Dakar</h1>
        <Hero star={star} fresh={fresh} />
        {ordered.length > 0 && <Lineup vehicles={ordered.slice(0, PLATEAU)} total={ordered.length} />}
        <Statement vehicles={vehicles} />
        <Alert />
        <Visit />
      </main>
    </Shell>
  )
}
