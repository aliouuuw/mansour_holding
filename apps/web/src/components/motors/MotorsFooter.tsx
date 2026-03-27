import { Link } from '@tanstack/react-router'
import {
  TelephoneIcon,
  Mail01Icon,
  Location01Icon,
  ArrowUp01Icon,
  Linkedin01Icon,
  NewTwitterIcon,
  InstagramIcon,
} from 'hugeicons-react'

const footerLinks = [
  { label: 'Véhicules', to: '/mansour-motors/vehicules' },
  { label: 'Services', to: '/mansour-motors#services' },
  { label: 'Showroom', to: '/mansour-motors#contact' },
]

export function MotorsFooter() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="relative bg-carbon-950 font-motors">
      <div className="gold-divider" />

      <div className="px-6 py-16 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-7xl">
          {/* Top: Brand + Back to top */}
          <div className="mb-16 flex items-start justify-between">
            <div>
              <Link to="/mansour-motors" className="group inline-flex items-center gap-2">
                <span className="font-motors-display text-[12px] font-bold uppercase tracking-[0.25em] text-white transition-colors group-hover:text-gold-400">
                  Mansour
                </span>
                <span className="h-3.5 w-px bg-white/20" />
                <span className="font-motors-display text-[12px] font-bold uppercase tracking-[0.25em] text-gold-400 transition-colors group-hover:text-gold-300">
                  Motors
                </span>
              </Link>
              <p className="mt-5 max-w-xs text-sm font-light leading-relaxed text-silver-500">
                Concessionnaire automobile premium à Dakar.
                L'excellence au service de la performance.
              </p>
            </div>
            <button
              onClick={scrollToTop}
              className="group flex h-10 w-10 items-center justify-center border border-white/10 text-silver-500 transition-all hover:border-gold-400 hover:text-gold-400"
              aria-label="Retour en haut"
            >
              <ArrowUp01Icon className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
            </button>
          </div>

          {/* Links Grid */}
          <div className="mb-16 grid grid-cols-1 gap-10 md:grid-cols-3">
            <div>
              <h4 className="mb-6 text-[10px] font-bold uppercase tracking-[0.2em] text-gold-400">
                Navigation
              </h4>
              <ul className="space-y-3">
                {footerLinks.map((item) => (
                  <li key={item.label}>
                    <Link
                      to={item.to.split('#')[0] as any}
                      hash={item.to.includes('#') ? item.to.split('#')[1] : undefined}
                      className="text-sm text-silver-500 transition-colors hover:text-white"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    to="/"
                    className="text-sm text-silver-600 transition-colors hover:text-silver-400"
                  >
                    ← Mansour Holding
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-6 text-[10px] font-bold uppercase tracking-[0.2em] text-gold-400">
                Contact
              </h4>
              <ul className="space-y-4">
                <li>
                  <a href="tel:+221331234567" className="flex items-center gap-3 text-sm text-silver-500 transition-colors hover:text-white">
                    <TelephoneIcon className="h-4 w-4 flex-shrink-0 text-gold-400/60" />
                    +221 33 123 45 67
                  </a>
                </li>
                <li>
                  <a href="mailto:motors@mansour.sn" className="flex items-center gap-3 text-sm text-silver-500 transition-colors hover:text-white">
                    <Mail01Icon className="h-4 w-4 flex-shrink-0 text-gold-400/60" />
                    motors@mansour.sn
                  </a>
                </li>
                <li className="flex items-center gap-3 text-sm text-silver-500">
                  <Location01Icon className="h-4 w-4 flex-shrink-0 text-gold-400/60" />
                  Avenue Cheikh Anta Diop, Dakar
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-6 text-[10px] font-bold uppercase tracking-[0.2em] text-gold-400">
                Horaires
              </h4>
              <div className="space-y-2 text-sm text-silver-500">
                <p>Lundi – Vendredi: <span className="text-silver-300">8h – 18h</span></p>
                <p>Samedi: <span className="text-silver-300">9h – 17h</span></p>
                <p>Dimanche: <span className="text-silver-600">Fermé</span></p>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="flex flex-col items-center justify-between gap-6 border-t border-white/[0.06] pt-8 md:flex-row">
            <p className="text-xs text-silver-600">
              © {new Date().getFullYear()} Mansour Motors — Dakar, Sénégal
            </p>
            <div className="flex items-center gap-4">
              {[
                { icon: Linkedin01Icon, label: 'LinkedIn', href: '#' },
                { icon: NewTwitterIcon, label: 'X', href: '#' },
                { icon: InstagramIcon, label: 'Instagram', href: '#' },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="flex h-9 w-9 items-center justify-center border border-white/[0.06] text-silver-600 transition-all hover:border-gold-400/30 hover:text-gold-400"
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
