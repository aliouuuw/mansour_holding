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

const navLinks = [
  { label: 'Véhicules', to: '/mansour-motors/vehicules' },
  { label: 'Services', to: '/mansour-motors#services' },
  { label: 'Showroom', to: '/mansour-motors#contact' },
  { label: 'Connexion', to: '/login' },
]

export function MotorsFooter() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="relative bg-carbon-950 text-white overflow-hidden">
      {/* Cyan accent line */}
      <div className="cyan-divider" />

      {/* Subtle grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }} />

      <div className="relative z-10 px-6 py-16 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-7xl">
          {/* Top Row */}
          <div className="mb-14 flex items-start justify-between">
            <div>
              <Link to="/mansour-motors" className="group flex items-center gap-3">
                <span className="font-motors-display text-sm font-bold uppercase tracking-[0.08em] text-white transition-colors group-hover:text-cyan-400">
                  Mansour Motors
                </span>
              </Link>
              <p className="mt-4 max-w-sm font-motors text-sm font-light leading-relaxed text-silver-600">
                L'excellence automobile à Dakar. Véhicules premium neufs et d'occasion certifiés.
              </p>
            </div>
            <button
              onClick={scrollToTop}
              className="group flex h-10 w-10 items-center justify-center border border-white/10 text-silver-600 transition-all hover:border-cyan-400/50 hover:text-cyan-400 rounded-sm"
              aria-label="Retour en haut"
            >
              <ArrowUp01Icon className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
            </button>
          </div>

          {/* Link Grid */}
          <div className="mb-14 grid grid-cols-1 gap-10 md:grid-cols-3">
            <div>
              <h4 className="mb-5 font-motors text-[10px] font-bold uppercase tracking-[0.25em] text-cyan-400">
                Navigation
              </h4>
              <ul className="space-y-2.5">
                {navLinks.map((item) => (
                  <li key={item.label}>
                    <Link
                      to={item.to.split('#')[0] as any}
                      hash={item.to.includes('#') ? item.to.split('#')[1] : undefined}
                      className="font-motors text-sm text-silver-500 transition-colors hover:text-white"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="mb-5 font-motors text-[10px] font-bold uppercase tracking-[0.25em] text-cyan-400">
                Contact
              </h4>
              <ul className="space-y-3">
                <li>
                  <a href="tel:+221331234567" className="flex items-center gap-3 font-motors text-sm text-silver-500 transition-colors hover:text-white">
                    <TelephoneIcon className="h-4 w-4 flex-shrink-0 text-cyan-400/40" />
                    +221 33 123 45 67
                  </a>
                </li>
                <li>
                  <a href="mailto:motors@mansour.sn" className="flex items-center gap-3 font-motors text-sm text-silver-500 transition-colors hover:text-white">
                    <Mail01Icon className="h-4 w-4 flex-shrink-0 text-cyan-400/40" />
                    motors@mansour.sn
                  </a>
                </li>
                <li className="flex items-center gap-3 font-motors text-sm text-silver-500">
                  <Location01Icon className="h-4 w-4 flex-shrink-0 text-cyan-400/40" />
                  Avenue Cheikh Anta Diop, Dakar
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-5 font-motors text-[10px] font-bold uppercase tracking-[0.25em] text-cyan-400">
                Groupe Mansour
              </h4>
              <p className="font-motors text-sm text-silver-600 leading-relaxed mb-4">
                Mansour Motors fait partie du groupe Mansour Holding, un conglomérat diversifié basé à Dakar.
              </p>
              <Link
                to="/"
                className="font-motors text-xs font-medium uppercase tracking-[0.15em] text-silver-500 transition-colors hover:text-cyan-400"
              >
                mansourholding.com →
              </Link>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="flex flex-col items-center justify-between gap-6 border-t border-white/[0.06] pt-8 md:flex-row">
            <p className="font-motors text-xs text-silver-700">
              © {new Date().getFullYear()} Mansour Motors. Tous droits réservés.
            </p>
            <div className="flex items-center gap-3">
              {[
                { icon: Linkedin01Icon, label: 'LinkedIn', href: '#' },
                { icon: NewTwitterIcon, label: 'X', href: '#' },
                { icon: InstagramIcon, label: 'Instagram', href: '#' },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="flex h-8 w-8 items-center justify-center border border-white/[0.06] text-silver-600 transition-all hover:border-cyan-400/30 hover:text-cyan-400 rounded-sm"
                >
                  <social.icon className="h-3.5 w-3.5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
