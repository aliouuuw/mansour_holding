import { useState } from 'react'
import { Link, useRouterState } from '@tanstack/react-router'
import { useScroll, useAnimationFrame, motion, AnimatePresence } from 'framer-motion'
import { Menu01Icon, Cancel01Icon, ArrowUpRight01Icon } from 'hugeicons-react'
import { cn } from '@/lib/utils'

const navLinks = [
  { label: 'Véhicules', to: '/mansour-motors/vehicules' },
  { label: 'Services', to: '/mansour-motors#services' },
  { label: 'Showroom', to: '/mansour-motors#contact' },
]

const darkHeroPages = ['/mansour-motors']

export function MotorsNavbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { scrollY } = useScroll()
  const routerState = useRouterState()
  const currentPath = routerState.location.pathname

  const hasDarkHero = darkHeroPages.includes(currentPath) || currentPath.startsWith('/mansour-motors/vehicules/')
  const showSolidBg = isScrolled || !hasDarkHero
  const useDarkText = showSolidBg && !isMobileMenuOpen

  useAnimationFrame(() => {
    if (scrollY.get() > 50 && !isScrolled) setIsScrolled(true)
    if (scrollY.get() <= 50 && isScrolled) setIsScrolled(false)
  })

  return (
    <>
      <motion.nav
        className={cn(
          'fixed left-0 right-0 top-0 z-50 flex items-center justify-between px-6 py-5 transition-all duration-500 lg:px-12',
          showSolidBg || isMobileMenuOpen
            ? 'py-3.5 backdrop-blur-xl border-b shadow-xs'
            : 'bg-transparent border-b border-transparent',
          showSolidBg && !isMobileMenuOpen
            ? 'bg-white/95 border-noir-100'
            : isMobileMenuOpen
              ? 'bg-noir-950/95 border-white/[0.04]'
              : 'border-transparent'
        )}
      >
        {/* Brand */}
        <div className="flex items-center gap-3">
          <Link to="/mansour-motors" className="group flex items-center gap-2">
            <span className={cn(
              'font-motors-display text-[13px] font-bold uppercase tracking-[0.25em] transition-colors',
              useDarkText ? 'text-noir-950 group-hover:text-gold-600' : 'text-white group-hover:text-gold-400'
            )}>
              Mansour
            </span>
            <span className={cn('h-4 w-px', useDarkText ? 'bg-noir-200' : 'bg-white/20')} />
            <span className={cn(
              'font-motors-display text-[13px] font-bold uppercase tracking-[0.25em]',
              useDarkText ? 'text-gold-600' : 'text-gold-400'
            )}>
              Motors
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const basePath = link.to.split('#')[0]
            const isActive =
              currentPath === basePath ||
              (basePath === '/mansour-motors/vehicules' && currentPath.startsWith('/mansour-motors/vehicules'))
            return (
              <Link
                key={link.to}
                to={basePath as any}
                hash={link.to.includes('#') ? link.to.split('#')[1] : undefined}
                className={cn(
                  'relative px-5 py-2 font-motors text-[11px] font-medium uppercase tracking-[0.18em] transition-all duration-300',
                  isActive
                    ? useDarkText ? 'text-gold-600' : 'text-white'
                    : useDarkText ? 'text-noir-500 hover:text-noir-950' : 'text-white/70 hover:text-white'
                )}
              >
                {link.label}
                {isActive && (
                  <motion.span
                    layoutId="motors-nav-indicator"
                    className="absolute bottom-0 left-5 right-5 h-px bg-gold-400"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            )
          })}

          <div className={cn('ml-6 h-4 w-px', useDarkText ? 'bg-noir-200' : 'bg-white/10')} />

          <Link
            to="/"
            className={cn(
              'ml-4 font-motors text-[10px] font-medium uppercase tracking-[0.18em] transition-colors',
              useDarkText ? 'text-noir-400 hover:text-noir-700' : 'text-silver-500 hover:text-silver-300'
            )}
          >
            Holding
          </Link>

          <Link
            to="/mansour-motors/vehicules"
            className="group ml-4 inline-flex items-center gap-2 bg-gold-400 px-5 py-2.5 font-motors text-[10px] font-bold uppercase tracking-[0.2em] text-noir-950 transition-all duration-300 hover:bg-gold-300 hover:shadow-gold-sm"
          >
            Catalogue
            <ArrowUpRight01Icon className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className={cn(
            'relative z-50 flex h-11 w-11 items-center justify-center md:hidden',
            useDarkText && !isMobileMenuOpen ? 'text-noir-950' : 'text-white'
          )}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
        >
          <AnimatePresence mode="wait">
            {isMobileMenuOpen ? (
              <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                <Cancel01Icon className="h-6 w-6" />
              </motion.div>
            ) : (
              <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                <Menu01Icon className="h-6 w-6" />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 flex flex-col justify-between bg-noir-950 px-6 pb-12 pt-28 md:hidden"
          >
            <div className="flex flex-col gap-1">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.to}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 * (i + 1), duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    to={link.to.split('#')[0] as any}
                    hash={link.to.includes('#') ? link.to.split('#')[1] : undefined}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-3 font-motors-display text-2xl uppercase tracking-wide text-white transition-colors hover:text-gold-400"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="space-y-4"
            >
              <div className="gold-divider mb-6" />
              <Link
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-3 text-center font-motors text-xs font-medium uppercase tracking-[0.2em] text-silver-500 transition-colors hover:text-white"
              >
                Mansour Holding
              </Link>
              <Link
                to="/mansour-motors/vehicules"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block bg-gold-400 px-6 py-4 text-center font-motors text-xs font-bold uppercase tracking-[0.25em] text-noir-950 transition-colors hover:bg-gold-300"
              >
                Voir le Catalogue
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
