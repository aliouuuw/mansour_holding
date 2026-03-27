import { Link, useRouterState } from '@tanstack/react-router'
import {
  Building03Icon,
  TelephoneIcon,
  Mail01Icon,
  Location01Icon,
  ArrowUp01Icon,
  Linkedin01Icon,
  NewTwitterIcon,
  InstagramIcon,
  Car01Icon,
} from 'hugeicons-react'
import { cn } from '@/lib/utils'

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
  const routerState = useRouterState()
  const isMotorsTheme = routerState.location.pathname.startsWith('/mansour-motors')

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const accent = isMotorsTheme ? 'text-cyan-400' : 'text-gold-400'
  const accentMuted = isMotorsTheme ? 'text-cyan-500/60' : 'text-gold-400/60'
  const hoverAccent = isMotorsTheme ? 'hover:text-cyan-400' : 'hover:text-gold-400'
  const borderAccent = isMotorsTheme ? 'hover:border-cyan-500/30' : 'hover:border-gold-400/30'
  const dividerClass = isMotorsTheme ? 'cyan-divider' : 'gold-divider'
  const borderColor = isMotorsTheme ? 'border-carbon-800' : 'border-white/[0.06]'

  return (
    <footer className={cn(
      'relative text-white',
      isMotorsTheme ? 'bg-carbon-950 font-motors' : 'bg-noir-950'
    )}>
      <div className={dividerClass} />

      <div className="px-6 py-20 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-7xl">
          {/* Top Row: Brand + Back to top */}
          <div className="mb-16 flex items-start justify-between">
            <div>
              {isMotorsTheme ? (
                <Link to="/mansour-motors" className="flex items-center gap-3 group">
                  <Car01Icon className="h-6 w-6 text-cyan-400 transition-transform duration-300 group-hover:scale-110" />
                  <span className="text-sm font-bold uppercase tracking-[0.2em] text-white">
                    Mansour Motors
                  </span>
                </Link>
              ) : (
                <Link to="/" className="flex items-center gap-3 hover-trigger group">
                  <Building03Icon className="h-7 w-7 text-gold-400 transition-transform duration-300 group-hover:scale-110" />
                  <span className="text-sm font-bold uppercase tracking-[0.18em] text-white">
                    Mansour Holding
                  </span>
                </Link>
              )}
              <p className={cn(
                'mt-5 max-w-sm text-sm font-light leading-relaxed',
                isMotorsTheme ? 'text-silver-600' : 'text-white/40'
              )}>
                {isMotorsTheme
                  ? 'Concessionnaire automobile premium à Dakar. Vente, financement et service après-vente d\'excellence.'
                  : 'Groupe diversifié basé à Dakar, Sénégal. Excellence et performance dans chaque secteur depuis 2012.'
                }
              </p>
            </div>
            <button
              onClick={scrollToTop}
              className={cn(
                'group flex h-10 w-10 items-center justify-center border text-white/40 transition-all',
                borderColor, borderAccent, hoverAccent
              )}
              aria-label="Retour en haut"
            >
              <ArrowUp01Icon className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
            </button>
          </div>

          {/* Link Grid */}
          <div className="mb-16 grid grid-cols-1 gap-10 md:grid-cols-3 lg:grid-cols-4">
            <div>
              <h4 className={cn('mb-6 text-[10px] font-bold uppercase tracking-[0.2em]', accent)}>
                Portfolio
              </h4>
              <ul className="space-y-3">
                {businessLinks.map((item) => (
                  <li key={item.label}>
                    {item.disabled ? (
                      <span className={isMotorsTheme ? 'text-sm text-carbon-600' : 'text-sm text-white/20'}>{item.label}</span>
                    ) : (
                      <Link
                        to={item.to as any}
                        className={cn('text-sm transition-colors', isMotorsTheme ? 'text-silver-500 hover:text-cyan-400' : 'text-white/50 hover:text-gold-400 hover-trigger')}
                      >
                        {item.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className={cn('mb-6 text-[10px] font-bold uppercase tracking-[0.2em]', accent)}>
                Navigation
              </h4>
              <ul className="space-y-3">
                {navLinks.map((item) => (
                  <li key={item.label}>
                    <Link
                      to={item.to as any}
                      className={cn('text-sm transition-colors', isMotorsTheme ? 'text-silver-500 hover:text-cyan-400' : 'text-white/50 hover:text-gold-400 hover-trigger')}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="md:col-span-1 lg:col-span-2">
              <h4 className={cn('mb-6 text-[10px] font-bold uppercase tracking-[0.2em]', accent)}>
                Contact
              </h4>
              <ul className="space-y-4">
                <li>
                  <a href="tel:+221331234567" className={cn('flex items-center gap-3 text-sm transition-colors hover:text-white', isMotorsTheme ? 'text-silver-500' : 'text-white/50 hover-trigger')}>
                    <TelephoneIcon className={cn('h-4 w-4 flex-shrink-0', accentMuted)} />
                    +221 33 123 45 67
                  </a>
                </li>
                <li>
                  <a href={isMotorsTheme ? 'mailto:motors@mansour.sn' : 'mailto:contact@mansour.sn'} className={cn('flex items-center gap-3 text-sm transition-colors hover:text-white', isMotorsTheme ? 'text-silver-500' : 'text-white/50 hover-trigger')}>
                    <Mail01Icon className={cn('h-4 w-4 flex-shrink-0', accentMuted)} />
                    {isMotorsTheme ? 'motors@mansour.sn' : 'contact@mansour.sn'}
                  </a>
                </li>
                <li className={cn('flex items-center gap-3 text-sm', isMotorsTheme ? 'text-silver-500' : 'text-white/50')}>
                  <Location01Icon className={cn('h-4 w-4 flex-shrink-0', accentMuted)} />
                  Avenue Cheikh Anta Diop, Dakar, Sénégal
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className={cn('flex flex-col items-center justify-between gap-6 border-t pt-8 md:flex-row', borderColor)}>
            <p className={isMotorsTheme ? 'text-xs text-carbon-500' : 'text-xs text-white/25'}>
              © {new Date().getFullYear()} {isMotorsTheme ? 'Mansour Motors' : 'Mansour Holding'}. Tous droits réservés.
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
                  className={cn(
                    'flex h-9 w-9 items-center justify-center border text-white/30 transition-all',
                    borderColor, borderAccent, hoverAccent
                  )}
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
