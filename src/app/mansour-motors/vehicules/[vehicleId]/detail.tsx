'use client'

import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { Link } from '@/lib/router'
import type { ApiVehicle } from '@/lib/api'
import { Shell } from '../../_ui/shell'
import { Card } from '../../_ui/card'
import { CONTACT, FUEL, GEARBOX, STATE, bookingDays, fcfa, focal, km, pad2, waLink } from '../../_ui/shared'

const TABS = [
  { id: 'photos', label: 'Photos' },
  { id: 'caracteristiques', label: 'Détails' },
  { id: 'description', label: 'Description' },
  { id: 'visite', label: 'Visite' },
]

const fmtShort = new Intl.DateTimeFormat('fr-FR', { weekday: 'short', timeZone: 'UTC' })
const fmtLong = new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' })

/* photos: the record's own photographs; with a single one, three framings of it */
function framings(v: ApiVehicle, title: string) {
  if (v.images.length > 1) return v.images.map((src, i) => ({ src, pos: i ? '50% 50%' : focal(v), zoom: 1, alt: `${title}, photo ${i + 1}` }))
  const src = v.images[0] ?? ''
  return [
    { src, pos: focal(v), zoom: 1, alt: `${title}, ${v.color}` },
    { src, pos: '24% 58%', zoom: 1.7, alt: `${title}, détail avant` },
    { src, pos: '76% 60%', zoom: 1.8, alt: `${title}, détail arrière` },
  ]
}

function Gallery({ v, title }: { v: ApiVehicle; title: string }) {
  const photos = useMemo(() => framings(v, title), [v, title])
  const ref = useRef<HTMLDivElement>(null)
  const [at, setAt] = useState(0)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const figs = [...el.querySelectorAll('.photo')]
    const ratios = new Map<Element, number>()
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) ratios.set(e.target, e.intersectionRatio)
      let best = 0
      let bestRatio = -1
      figs.forEach((p, i) => { const r = ratios.get(p) ?? 0; if (r > bestRatio) { bestRatio = r; best = i } })
      setAt(best)
    }, { root: matchMedia('(max-width: 860px)').matches ? el : null, threshold: [0, 0.25, 0.5, 0.75, 1] })
    figs.forEach((p) => io.observe(p))
    return () => io.disconnect()
  }, [photos])
  return (
    <section id="photos" className="gallery" aria-label="Photos">
      <div className="photos" ref={ref}>
        {photos.map((p, i) => (
          <figure key={i} className="media photo is-colour">
            {/* eslint-disable-next-line @next/next/no-img-element -- framing uses object-position and zoom */}
            <img src={p.src} alt={p.alt} style={{ '--pos': p.pos, '--zoom': p.zoom } as React.CSSProperties} loading={i ? 'lazy' : 'eager'} decoding="async" />
          </figure>
        ))}
      </div>
      <p className="photo-bar" aria-live="polite">
        <span><b>{pad2(at + 1)}</b> / {pad2(photos.length)}</span>
        <span className="rail" aria-hidden="true"><i style={{ '--p': String((at + 1) / photos.length) } as React.CSSProperties} /></span>
      </p>
    </section>
  )
}

function Visit({ v, title }: { v: ApiVehicle; title: string }) {
  const [days, setDays] = useState<ReturnType<typeof bookingDays>>([])
  const [day, setDay] = useState<number | null>(null)
  const [slot, setSlot] = useState<number | null>(null)
  const [msg, setMsg] = useState('')
  useEffect(() => setDays(bookingDays()), [])
  const send = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const d = day == null ? null : days[day]
    if (!d || slot == null) { setMsg('Choisissez un jour et une heure.'); return }
    const f = new FormData(e.currentTarget)
    const name = String(f.get('name') ?? '').trim()
    const tel = String(f.get('tel') ?? '').trim()
    const text = [
      'Bonjour Mansour Motors, je souhaite voir un véhicule au showroom.',
      `Véhicule : ${title}, ${v.year}`,
      `Créneau : ${fmtLong.format(d.date)} à ${pad2(slot)}:00`,
      name && `Nom : ${name}`,
      tel && `Téléphone : ${tel}`,
    ].filter(Boolean).join('\n')
    window.open(waLink(text), '_blank', 'noopener')
  }
  const slots = day == null ? [] : days[day]?.slots ?? []
  return (
    <section id="visite" className="block">
      <h2 className="h2">Réserver une visite</h2>
      <form className="visit" noValidate onSubmit={send} onChange={() => setMsg('')}>
        <p className="lead">Choisissez un créneau dans nos horaires. La demande part sur WhatsApp, prête à envoyer.</p>
        <fieldset className="field"><legend>Jour</legend>
          <div className="tiles">
            {days.map((d, i) => (
              <span className="tile" key={i}>
                <input type="radio" name="day" id={`day-${i}`} checked={day === i} onChange={() => { setDay(i); setSlot(null) }} />
                <label htmlFor={`day-${i}`} aria-label={fmtLong.format(d.date)}>{d.today ? 'Auj.' : fmtShort.format(d.date).replace('.', '')}<b>{d.date.getUTCDate()}</b></label>
              </span>
            ))}
          </div>
        </fieldset>
        <fieldset className="field"><legend>Heure</legend>
          <div className="tiles tiles-slots">
            {day == null
              ? <p className="hint">Choisissez d&apos;abord un jour.</p>
              : slots.map((s) => (
                <span className="tile" key={s}>
                  <input type="radio" name="slot" id={`slot-${s}`} checked={slot === s} onChange={() => setSlot(s)} />
                  <label htmlFor={`slot-${s}`}>{pad2(s)}:00</label>
                </span>
              ))}
          </div>
        </fieldset>
        <div className="visit-row">
          <label className="field"><span>Votre nom</span><input name="name" autoComplete="name" /></label>
          <label className="field"><span>Téléphone</span><input name="tel" type="tel" inputMode="tel" autoComplete="tel" /></label>
        </div>
        <p className="form-msg" role="status">{msg}</p>
        <button className="btn" type="submit">Envoyer la demande <span className="arr" aria-hidden="true">→</span></button>
        <p className="visit-alt">Ou appelez le showroom au <a href={CONTACT.tel}>{CONTACT.phone}</a></p>
      </form>
    </section>
  )
}

export function PublicVehicleDetail({ vehicle: v, others }: { vehicle: ApiVehicle; others: ApiVehicle[] }) {
  const title = `${v.make} ${v.model}`
  const sold = v.status === 'sold'
  const question = `Bonjour Mansour Motors, une question sur le ${title} (${v.year}).`
  /* a sold car cannot be visited: its section and tab leave the page */
  const tabs = sold ? TABS.slice(0, -1) : TABS
  const [tab, setTab] = useState('photos')
  const tabsRef = useRef<HTMLElement>(null)
  const anchorRef = useRef<HTMLDivElement>(null)
  const [bar, setBar] = useState(false)

  useEffect(() => { document.title = `${title}, Mansour Motors` }, [title])

  /* the section tabs follow your reading position */
  useEffect(() => {
    const spy = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) setTab(e.target.id)
    }, { rootMargin: '-35% 0px -60% 0px' })
    tabs.forEach((t) => { const s = document.getElementById(t.id); if (s) spy.observe(s) })
    return () => spy.disconnect()
  }, [tabs])
  useEffect(() => {
    const seg = tabsRef.current
    if (seg) import('../../_ui/dom.js').then(({ segThumb }) => segThumb(seg))
  }, [tab])

  /* phones: the price bar arrives when the main price leaves */
  useEffect(() => {
    const a = anchorRef.current
    if (!a) return
    const io = new IntersectionObserver(([e]) => setBar(!e.isIntersecting && e.boundingClientRect.top < 0))
    io.observe(a)
    return () => io.disconnect()
  }, [])

  const facts: [string, React.ReactNode, boolean?][] = [
    ['Année', v.year],
    ['Kilométrage', km(v.mileage)],
    ['Énergie', FUEL[v.fuelType]],
    ['Boîte', GEARBOX[v.transmission]],
    ['Couleur', v.color, true],
    ['Statut', STATE[v.status], true],
  ]
  if (v.vin) facts.push(['VIN', v.vin, true])

  return (
    <Shell className="detail-page" waText={question}>
      <main>
        <div className="wrap detail-head">
          <div>
            <p className="crumbs"><Link to="/mansour-motors">Accueil</Link> / <Link to="/mansour-motors/vehicules">Véhicules</Link> / <span>{title}</span></p>
            <p className="brand">{v.make}</p>
            <h1 className="display">{v.model}</h1>
          </div>
          <Link className="soft" to="/mansour-motors/vehicules"><span aria-hidden="true">←</span> Tout le stock</Link>
        </div>

        <div className="wrap detail">
          <div>
            <Gallery v={v} title={title} />
            <section id="caracteristiques" className="block">
              <h2 className="h2">Caractéristiques</h2>
              <dl className="facts">
                {facts.map(([label, value, small]) => <div key={label}><dt>{label}</dt><dd className={small ? 'small' : undefined}>{value}</dd></div>)}
              </dl>
            </section>
            <section id="description" className="block">
              <h2 className="h2">Description</h2>
              <p className="desc">{v.description || 'Le showroom vous donne tous les détails de ce véhicule sur place ou par WhatsApp.'}</p>
            </section>
            {!sold && <Visit v={v} title={title} />}
          </div>

          <aside className="panel" aria-label="Résumé">
            <div ref={anchorRef}>
              <p className="panel-price">{fcfa(v.price)}</p>
              <p><span className="status" data-status={v.status}>{STATE[v.status]}</span></p>
            </div>
            <dl className="specs">
              <div><dt>Année</dt><dd>{v.year}</dd></div>
              <div><dt>Kilométrage</dt><dd>{km(v.mileage)}</dd></div>
              <div><dt>Énergie</dt><dd>{FUEL[v.fuelType]}</dd></div>
            </dl>
            <nav className="seg" aria-label="Sections de la fiche" ref={tabsRef}>
              {tabs.map((t) => <a key={t.id} href={`#${t.id}`} aria-current={tab === t.id ? 'true' : undefined}>{t.label}</a>)}
            </nav>
            <div className="panel-actions">
              {sold
                ? <Link className="btn" to="/mansour-motors#alerte">Être prévenu d&apos;un modèle similaire <span className="arr" aria-hidden="true">→</span></Link>
                : <>
                  <a className="btn" href="#visite">Réserver une visite <span className="arr" aria-hidden="true">→</span></a>
                  <div className="pair">
                    <a className="soft" href={waLink(question)} target="_blank" rel="noopener">WhatsApp</a>
                    <a className="soft" href={CONTACT.tel}>Appeler</a>
                  </div>
                </>}
            </div>
          </aside>
        </div>

        {others.length > 0 && (
          <section className="wrap others">
            <div className="lineup-head" style={{ paddingInline: 0 }}><h2 className="h2">Autres véhicules</h2></div>
            <div className="grid">{others.map((o) => <Card key={o.id} v={o} />)}</div>
          </section>
        )}
      </main>

      <div className={`bar${bar ? ' is-on' : ''}`} aria-hidden={!bar}>
        <p><span>{title}</span><b>{fcfa(v.price)}</b></p>
        {sold
          ? <Link className="btn" to="/mansour-motors#alerte" tabIndex={bar ? 0 : -1}>Être prévenu</Link>
          : <a className="btn" href="#visite" tabIndex={bar ? 0 : -1}>Réserver une visite <span className="arr" aria-hidden="true">→</span></a>}
      </div>
    </Shell>
  )
}
