'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Link } from '@/lib/router'
import { CONTACT, openState, waLink } from './shared'

const NAV = [
  { label: 'Accueil', to: '/mansour-motors' },
  { label: 'Véhicules', to: '/mansour-motors/vehicules' },
  { label: 'Showroom', to: '/mansour-motors#showroom' },
]

/* "Ouvert jusqu'à 18h" depends on the visitor's clock, so it is filled after hydration */
export function OpenNote({ className }: { className?: string }) {
  const [open, setOpen] = useState<{ open: boolean; text: string } | null>(null)
  useEffect(() => setOpen(openState()), [])
  return <span className={className} data-open="" data-state={open ? (open.open ? 'open' : 'closed') : undefined}>{open?.text}</span>
}

/* the top-down car used by the floor plan, its key, and the map pin */
function CarSprite() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
      <symbol id="car-top" viewBox="0 0 40 84">
        <rect className="car-mirror" x="3.5" y="24" width="5" height="3.2" rx="1.6" />
        <rect className="car-mirror" x="31.5" y="24" width="5" height="3.2" rx="1.6" />
        <path className="car-body" d="M8.5 11C8.5 4.5 13 3 20 3s11.5 1.5 11.5 8l1.3 61c0 7-4.5 9-12.8 9s-12.8-2-12.8-9z" />
        <path className="car-glass" d="M10.5 23.5Q20 19 29.5 23.5L28 33.5Q20 31.5 12 33.5z" />
        <path className="car-glass" d="M12 62Q20 64 28 62L29 69.5Q20 72.5 11 69.5z" />
      </symbol>
    </svg>
  )
}

function Header() {
  const ref = useRef<HTMLElement>(null)
  const pathname = usePathname()
  /* the header takes the tone of the chapter passing under it */
  useEffect(() => {
    const header = ref.current
    if (!header) return
    const onScroll = () => {
      header.classList.toggle('is-scrolled', scrollY > 24)
      const y = header.offsetHeight
      const under = [...document.querySelectorAll('.mm .ch-dark, .mm .ch-light')].find((c) => {
        const r = c.getBoundingClientRect()
        return r.top <= y && r.bottom > y
      })
      header.dataset.tone = under?.classList.contains('ch-dark') ? 'dark' : 'light'
    }
    addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => removeEventListener('scroll', onScroll)
  }, [pathname])

  return (
    <header className="header" ref={ref}>
      <div className="wrap">
        <Link className="logo" to="/mansour-motors">Mansour Motors</Link>
        <nav className="nav" aria-label="Principal">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} aria-current={pathname === n.to ? 'page' : undefined}>{n.label}</Link>
          ))}
        </nav>
        <div className="header-end">
          <OpenNote />
          <a href={CONTACT.tel}>{CONTACT.phone}</a>
        </div>
      </div>
    </header>
  )
}

function Footer() {
  return (
    <footer className="sign ch-dark">
      <div className="wrap sign-links">
        <p><b>Showroom</b>{CONTACT.address}</p>
        <p><b>Contact</b><a href={CONTACT.tel}>{CONTACT.phone}</a><br /><a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></p>
        <p><b>Mansour Holding</b>Mansour Motors est une maison Mansour Holding.</p>
      </div>
      <p className="wordmark" aria-hidden="true">MANSOUR</p>
    </footer>
  )
}

const WA_PATH = 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z'

/* every public motors page: header, content, footer, WhatsApp. `tone` sets the header over the first screen. */
export function Shell({ children, className = '', waText = 'Bonjour Mansour Motors, je souhaite des informations.' }: {
  children: ReactNode
  className?: string
  waText?: string
}) {
  const [ready, setReady] = useState(false)
  const router = useRouter()
  useEffect(() => { requestAnimationFrame(() => setReady(true)) }, [])
  /* the plateau, the stock grid and the cards write plain <a> links; route them in the app */
  const route = (e: React.MouseEvent) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    const a = (e.target as Element).closest('a')
    const href = a?.getAttribute('href')
    if (!a || a.target || !href?.startsWith('/mansour-motors')) return
    e.preventDefault()
    router.push(href)
  }
  return (
    <div className={`mm ${className}${ready ? ' is-ready' : ''}`} onClick={route}>
      <CarSprite />
      <Header />
      {children}
      <Footer />
      <a className="wa" href={waLink(waText)} target="_blank" rel="noopener" aria-label="WhatsApp">
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d={WA_PATH} /></svg>
      </a>
    </div>
  )
}
