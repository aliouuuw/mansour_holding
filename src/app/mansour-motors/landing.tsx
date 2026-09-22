'use client'

import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Link } from '@/lib/router'
import type { ApiVehicle } from '@/lib/api'
import { AtelierSwipeHint, Button, Chapter, Field, OpenNote, Shell, ShowroomMap } from './_ui'
import { lineup, toCar } from './_ui/car'
import { BUDGETS, CONTACT, DAY, HOURS, STATE, YEARS, cover, pad2, vehicleUrl, waLink } from './_ui/shared'

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
  const videoRef = useRef<HTMLVideoElement>(null)
  const [clip, setClip] = useState(false)
  const [phone, setPhone] = useState(false)
  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: no-preference)')
    const narrow = window.matchMedia('(max-width: 860px)')
    const sync = () => {
      setClip(motion.matches)
      setPhone(narrow.matches)
    }
    sync()
    motion.addEventListener('change', sync)
    narrow.addEventListener('change', sync)
    return () => {
      motion.removeEventListener('change', sync)
      narrow.removeEventListener('change', sync)
    }
  }, [])
  useEffect(() => {
    const video = videoRef.current
    const hero = ref.current
    if (!clip || !video || !hero) return
    const step = 1 / 24
    let mode: 'play' | 'scrub' = 'play'
    let goal = 0
    let shown = 0
    let raf = 0
    let seeking = false
    const timeAtScroll = () => {
      const dur = video.duration
      if (!Number.isFinite(dur) || dur <= 0) return null
      const forth = Math.max(0, dur / 2 - step)
      const run = Math.max(1, hero.offsetHeight - innerHeight)
      const p = Math.max(0, Math.min(1, -hero.getBoundingClientRect().top / run))
      return p * forth
    }
    const seek = (t: number) => {
      video.pause()
      if (seeking || Math.abs(video.currentTime - t) < step * 0.5) return
      seeking = true
      video.currentTime = t
    }
    const tick = () => {
      raf = 0
      if (mode !== 'scrub') return
      video.pause()
      const next = timeAtScroll()
      if (next == null) return
      goal = next
      shown += (goal - shown) * 0.42
      if (Math.abs(goal - shown) < 0.01) shown = goal
      seek(shown)
      if (shown !== goal) raf = requestAnimationFrame(tick)
    }
    const kick = () => {
      if (mode === 'scrub' && !raf) raf = requestAnimationFrame(tick)
    }
    const arm = () => {
      if (mode === 'scrub') return
      mode = 'scrub'
      video.pause()
      const next = timeAtScroll()
      shown = next ?? 0
      goal = shown
      kick()
    }
    let baseY = scrollY
    const settle = requestAnimationFrame(() => { baseY = scrollY })
    const onScroll = () => {
      if (mode === 'play') {
        if (Math.abs(scrollY - baseY) < 24) return
        arm()
        return
      }
      kick()
    }
    const onSeeked = () => {
      seeking = false
      if (mode !== 'scrub') return
      video.pause()
      if (Math.abs(video.currentTime - shown) >= step * 0.5) seek(shown)
    }
    const onPlay = () => {
      if (mode === 'scrub') video.pause()
    }
    const onEnded = () => arm()
    video.addEventListener('seeked', onSeeked)
    video.addEventListener('ended', onEnded)
    video.addEventListener('play', onPlay)
    addEventListener('scroll', onScroll, { passive: true })
    addEventListener('resize', kick)
    void video.play().catch(() => {})
    return () => {
      if (raf) cancelAnimationFrame(raf)
      cancelAnimationFrame(settle)
      video.removeEventListener('seeked', onSeeked)
      video.removeEventListener('ended', onEnded)
      video.removeEventListener('play', onPlay)
      removeEventListener('scroll', onScroll)
      removeEventListener('resize', kick)
    }
  }, [clip, phone])
  if (!star) return null
  return (
    <section
      className="hero ch-light"
      aria-label={fresh ? `${star.make} ${star.model}, dernier arrivage à Dakar` : `${star.make} ${star.model}`}
      ref={ref}
    >
      <div className="hero-pin">
      <div className="hero-stage" aria-hidden="true">
        <div className="hero-cam">
          <picture>
            <source media="(max-width: 860px)" srcSet="/mansour-motors/hero-still-m.jpg" width={1080} height={1920} />
            {/* local Higgsfield still, full-bleed cover */}
            <img
              className="hero-still"
              src="/mansour-motors/hero-still.jpg"
              alt=""
              width={2688}
              height={1520}
              decoding="async"
              fetchPriority="high"
            />
          </picture>
          {clip && (
            <video
              className="hero-still hero-clip"
              ref={videoRef}
              key={phone ? 'phone' : 'desk'}
              muted
              playsInline
              autoPlay
              preload="auto"
              poster={phone ? '/mansour-motors/hero-still-m.jpg' : '/mansour-motors/hero-still.jpg'}
              width={phone ? 720 : 1276}
              height={phone ? 1280 : 720}
              aria-hidden="true"
            >
              <source
                src={phone ? '/mansour-motors/hero-intro-m.mp4' : '/mansour-motors/hero-intro.mp4'}
                type="video/mp4"
              />
            </video>
          )}
        </div>
      </div>
      {fresh && (
        <p className="hero-ledger">
          <span className="hero-ledger-mark" aria-hidden="true" />
          Dernier arrivage à Dakar
        </p>
      )}
      <div className="hero-shelf">
        <div className="hero-shelf-copy">
          <p className="brand">{star.make}</p>
          <h2 className="hero-title">{star.model}</h2>
        </div>
        <div className="hero-shelf-action">
          <span className="hero-year" aria-hidden="true">{star.year}</span>
          <Button to={vehicleUrl(star)}>Voir le véhicule</Button>
        </div>
      </div>
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
  const firstDetailHref = vehicles[0] ? vehicleUrl(vehicles[0]) : '/mansour-motors/vehicules'
  const firstAtelierImg = vehicles[0] ? cover(vehicles[0]) : ''

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
            <p className="lead lead-atelier">{shown}. Glissez la photo pour changer. Touchez pour ouvrir.</p>
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
            <Button href={firstDetailHref} data-open-front="">Voir le véhicule</Button>
          </div>
          <p className="vh" aria-live="polite" data-live />
          <ol className="index wrap" data-index hidden />
        </div>
        <div className="atelier" data-atelier hidden>
          <a className="atelier-hero ch-dark" href={firstDetailHref} data-atelier-hero>
            <div className="atelier-hero-media" data-atelier-media>
              <AtelierSwipeHint />
              {/* eslint-disable-next-line @next/next/no-img-element -- filled by turntable.js */}
              <img
                data-atelier-img
                alt=""
                decoding="async"
                src={firstAtelierImg || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'/%3E"}
              />
            </div>
            <div className="atelier-meta">
              <div className="atelier-id">
                <p className="count" data-atelier-count />
                <p className="brand" data-atelier-brand />
                <p className="atelier-name" data-atelier-name />
                <p className="atelier-facts">
                  <span className="atelier-specs" data-atelier-specs />
                  <span data-atelier-status />
                </p>
              </div>
              <p className="atelier-price" data-atelier-price />
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
          <p className="brand">Recherche</p>
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
  const openYears = ordered.filter((v) => v.status !== 'sold').map((v) => v.year)
  const newestYear = openYears.length ? Math.max(...openYears) : 0
  /* createdAt follows insert order, so a later row hid this line.
     The newest model year on the floor is the arrival. */
  const fresh = !!star && star.status !== 'sold' && star.year === newestYear
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
