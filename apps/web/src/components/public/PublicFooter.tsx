import { Link } from '@tanstack/react-router'
import {
  Buildings,
  Phone,
  Envelope,
  MapPin,
  ArrowUp,
  LinkedinLogo,
  InstagramLogo,
  XLogo,
} from '@phosphor-icons/react'

const businessLinks = [
  { label: 'Mansour Motors', to: '/mansour-motors' },
  { label: 'Mansour Immobilier', to: '#', disabled: true },
  { label: 'Mansour Location', to: '#', disabled: true },
  { label: 'Mansour Construction', to: '#', disabled: true },
]

const navLinks = [
  { label: 'Accueil', to: '/' },
  { label: 'Véhicules', to: '/mansour-motors/vehicules' },
  { label: 'Connexion', to: '/login' },
  { label: 'Espace Pro', to: '/dashboard' },
]

export function PublicFooter() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="relative bg-noir-950 text-white">
      {/* Gold Divider */}
      <div className="gold-divider" />

      <div className="px-6 py-20 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-7xl">
          {/* Top Row: Brand + Back to top */}
          <div className="mb-16 flex items-start justify-between">
            <div>
              <Link to="/" className="flex items-center gap-3 hover-trigger group">
                <Buildings className="h-7 w-7 text-gold-400 transition-transform duration-300 group-hover:scale-110" weight="duotone" />
                <span className="text-sm font-bold uppercase tracking-[0.18em] text-white">
                  Mansour Holding
                </span>
              </Link>
              <p className="mt-5 max-w-sm text-sm font-light leading-relaxed text-white/40">
                Groupe diversifié basé à Dakar, Sénégal. Excellence et performance dans chaque
                secteur depuis 2012.
              </p>
            </div>
            <button
              onClick={scrollToTop}
              className="group flex h-10 w-10 items-center justify-center border border-white/10 text-white/40 transition-all hover:border-gold-400 hover:text-gold-400"
              aria-label="Retour en haut"
            >
              <ArrowUp className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" weight="bold" />
            </button>
          </div>

          {/* Link Grid */}
          <div className="mb-16 grid grid-cols-1 gap-10 md:grid-cols-3 lg:grid-cols-4">
            <div>
              <h4 className="mb-6 text-[10px] font-bold uppercase tracking-[0.2em] text-gold-400">
                Portfolio
              </h4>
              <ul className="space-y-3">
                {businessLinks.map((item) => (
                  <li key={item.label}>
                    {item.disabled ? (
                      <span className="text-sm text-white/20">{item.label}</span>
                    ) : (
                      <Link
                        to={item.to as any}
                        className="text-sm text-white/50 transition-colors hover:text-gold-400 hover-trigger"
                      >
                        {item.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="mb-6 text-[10px] font-bold uppercase tracking-[0.2em] text-gold-400">
                Navigation
              </h4>
              <ul className="space-y-3">
                {navLinks.map((item) => (
                  <li key={item.label}>
                    <Link
                      to={item.to as any}
                      className="text-sm text-white/50 transition-colors hover:text-gold-400 hover-trigger"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="md:col-span-1 lg:col-span-2">
              <h4 className="mb-6 text-[10px] font-bold uppercase tracking-[0.2em] text-gold-400">
                Contact
              </h4>
              <ul className="space-y-4">
                <li>
                  <a href="tel:+221331234567" className="flex items-center gap-3 text-sm text-white/50 transition-colors hover:text-white hover-trigger">
                    <Phone className="h-4 w-4 flex-shrink-0 text-gold-400/60" weight="fill" />
                    +221 33 123 45 67
                  </a>
                </li>
                <li>
                  <a href="mailto:contact@mansour.sn" className="flex items-center gap-3 text-sm text-white/50 transition-colors hover:text-white hover-trigger">
                    <Envelope className="h-4 w-4 flex-shrink-0 text-gold-400/60" weight="fill" />
                    contact@mansour.sn
                  </a>
                </li>
                <li className="flex items-center gap-3 text-sm text-white/50">
                  <MapPin className="h-4 w-4 flex-shrink-0 text-gold-400/60" weight="fill" />
                  Avenue Cheikh Anta Diop, Dakar, Sénégal
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="flex flex-col items-center justify-between gap-6 border-t border-white/[0.06] pt-8 md:flex-row">
            <p className="text-xs text-white/25">
              © {new Date().getFullYear()} Mansour Holding. Tous droits réservés.
            </p>
            <div className="flex items-center gap-4">
              {[
                { icon: LinkedinLogo, label: 'LinkedIn', href: '#' },
                { icon: XLogo, label: 'X', href: '#' },
                { icon: InstagramLogo, label: 'Instagram', href: '#' },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="flex h-9 w-9 items-center justify-center border border-white/[0.06] text-white/30 transition-all hover:border-gold-400/30 hover:text-gold-400 hover-trigger"
                >
                  <social.icon className="h-4 w-4" weight="bold" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
