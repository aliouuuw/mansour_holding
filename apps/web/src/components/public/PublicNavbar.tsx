import { useState } from 'react'
import { Link, useRouterState } from '@tanstack/react-router'
import { useScroll, useAnimationFrame, motion, AnimatePresence } from 'framer-motion'
import { Building03Icon, Menu01Icon, Cancel01Icon, Car01Icon } from 'hugeicons-react'
import { cn } from '@/lib/utils'

const holdingLinks = [
  { label: 'Motors', to: '/mansour-motors' },
  { label: 'À propos', to: '/#about' },
  { label: 'Contact', to: '/#contact' },
]

const motorsLinks = [
  { label: 'Véhicules', to: '/mansour-motors/vehicules' },
  { label: 'Services', to: '/mansour-motors#services' },
  { label: 'Showroom', to: '/mansour-motors#contact' },
]

// Pages that have dark hero sections (navbar starts transparent with white text)
const darkHeroPages = ['/', '/mansour-motors']

export function PublicNavbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { scrollY } = useScroll()
  const routerState = useRouterState()
  const currentPath = routerState.location.pathname

  const isMotorsSection = currentPath.startsWith('/mansour-motors')
  const navLinks = isMotorsSection ? motorsLinks : holdingLinks
  const hasDarkHero = darkHeroPages.includes(currentPath)

  // Motors section is ALWAYS dark-themed (carbon bg)
  // Holding: dark hero pages start transparent → white on scroll; other pages always white
  const isMotorsTheme = isMotorsSection

  useAnimationFrame(() => {
    if (scrollY.get() > 50 && !isScrolled) setIsScrolled(true)
    if (scrollY.get() <= 50 && isScrolled) setIsScrolled(false)
  })

  // --- Holding theme logic (unchanged behavior) ---
  if (!isMotorsTheme) {
    const showSolidBg = isScrolled || !hasDarkHero
    const useDarkText = showSolidBg

    return (
      <>
        <motion.nav
          className={cn(
            'fixed left-0 right-0 top-0 z-50 flex items-center justify-between px-6 py-5 transition-all duration-500 lg:px-12',
            showSolidBg || isMobileMenuOpen
              ? 'py-3.5 backdrop-blur-xl border-b shadow-xs'
              : 'bg-transparent',
            showSolidBg && !isMobileMenuOpen
              ? 'bg-white/95 border-noir-100'
              : isMobileMenuOpen
                ? 'bg-noir-950/95 border-white/[0.04]'
                : 'border-transparent'
          )}
        >
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2.5 hover-trigger group">
              <Building03Icon className={cn('h-5 w-5 transition-transform duration-300 group-hover:scale-110', useDarkText && !isMobileMenuOpen ? 'text-gold-600' : 'text-gold-400')} />
              <span className={cn('text-[11px] font-bold uppercase tracking-[0.18em]', useDarkText && !isMobileMenuOpen ? 'text-noir-950' : 'text-white')}>
                Mansour
              </span>
            </Link>
          </div>

          <div className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => {
              const isActive = currentPath === link.to || (link.to !== '/' && currentPath.startsWith(link.to.split('#')[0]) && link.to.split('#')[0] !== '/mansour-motors' && link.to.split('#')[0] !== '/')
              return (
                <Link
                  key={link.to}
                  to={link.to.split('#')[0] as any}
                  hash={link.to.includes('#') ? link.to.split('#')[1] : undefined}
                  className={cn(
                    'relative px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] transition-colors hover-trigger',
                    isActive
                      ? useDarkText ? 'text-gold-600' : 'text-gold-400'
                      : useDarkText ? 'text-noir-500 hover:text-noir-950' : 'text-white/70 hover:text-white'
                  )}
                >
                  {link.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-indicator"
                      className={cn('absolute bottom-0 left-4 right-4 h-px', useDarkText ? 'bg-gold-600' : 'bg-gold-400')}
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              )
            })}
            <div className={cn('ml-4 h-4 w-px', useDarkText ? 'bg-noir-200' : 'bg-white/10')} />
            <Link
              to="/login"
              className={cn(
                'ml-3 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] transition-colors hover-trigger',
                useDarkText ? 'text-noir-500 hover:text-noir-950' : 'text-white/70 hover:text-white'
              )}
            >
              Connexion
            </Link>
            <Link
              to="/dashboard"
              className="ml-1 bg-gold-400 px-5 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-noir-950 transition-all hover:bg-gold-300 hover-trigger"
            >
              Espace Pro
            </Link>
          </div>

          <button
            className={cn(
              'relative z-50 flex h-11 w-11 items-center justify-center md:hidden',
              isMobileMenuOpen ? 'text-white' : useDarkText ? 'text-noir-950' : 'text-white'
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
                      className="block py-3 text-3xl font-bold uppercase tracking-wide text-white transition-colors hover:text-gold-400"
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
                className="space-y-3"
              >
                <div className="gold-divider mb-6" />
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-3 text-center text-xs font-bold uppercase tracking-[0.2em] text-white/60 transition-colors hover:text-white"
                >
                  Connexion
                </Link>
                <Link
                  to="/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block bg-gold-400 px-6 py-4 text-center text-xs font-bold uppercase tracking-[0.25em] text-noir-950"
                >
                  Espace Pro
                </Link>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    )
  }

  // --- Motors theme: always-dark, carbon/cyan aesthetic ---
  return (
    <>
      <motion.nav
        className={cn(
          'fixed left-0 right-0 top-0 z-50 flex items-center justify-between px-6 py-5 font-motors transition-all duration-500 lg:px-12',
          isScrolled || isMobileMenuOpen
            ? 'py-3.5 backdrop-blur-xl bg-carbon-950/90 border-b border-carbon-800/60'
            : 'bg-transparent border-b border-transparent'
        )}
      >
        <div className="flex items-center gap-5">
          <Link to="/" className="flex items-center gap-2 group">
            <Building03Icon className="h-4 w-4 text-silver-500 transition-colors group-hover:text-silver-300" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-silver-500 transition-colors group-hover:text-silver-300">
              Mansour
            </span>
          </Link>
          <span className="text-carbon-600">/</span>
          <Link to="/mansour-motors" className="flex items-center gap-2 group">
            <Car01Icon className="h-4 w-4 text-cyan-400 transition-transform duration-300 group-hover:scale-110" />
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-cyan-400">
              Motors
            </span>
          </Link>
        </div>

        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const isActive = currentPath === link.to || (link.to !== '/' && currentPath.startsWith(link.to.split('#')[0]) && link.to.split('#')[0] !== '/mansour-motors' && link.to.split('#')[0] !== '/')
            return (
              <Link
                key={link.to}
                to={link.to.split('#')[0] as any}
                hash={link.to.includes('#') ? link.to.split('#')[1] : undefined}
                className={cn(
                  'relative px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] transition-colors',
                  isActive
                    ? 'text-cyan-400'
                    : 'text-silver-500 hover:text-white'
                )}
              >
                {link.label}
                {isActive && (
                  <motion.span
                    layoutId="nav-indicator-motors"
                    className="absolute bottom-0 left-4 right-4 h-px bg-cyan-500"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            )
          })}
          <div className="ml-4 h-4 w-px bg-carbon-700" />
          <Link
            to="/login"
            className="ml-3 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-silver-500 transition-colors hover:text-white"
          >
            Connexion
          </Link>
          <Link
            to="/dashboard"
            className="ml-2 border border-cyan-500/40 bg-cyan-500/10 px-5 py-2 text-[9px] font-bold uppercase tracking-[0.2em] text-cyan-400 transition-all hover:bg-cyan-500 hover:text-carbon-950 hover:shadow-cyan-sm"
          >
            Espace Pro
          </Link>
        </div>

        <button
          className="relative z-50 flex h-11 w-11 items-center justify-center text-white md:hidden"
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

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 flex flex-col justify-between bg-carbon-950 px-6 pb-12 pt-28 font-motors md:hidden"
          >
            <div>
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="mb-8 flex items-center gap-3 border-b border-carbon-800 pb-4"
              >
                <Car01Icon className="h-5 w-5 text-cyan-400" />
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-400">Mansour Motors</span>
              </motion.div>

              <div className="flex flex-col gap-2">
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
                      className="block py-3 font-motors-display text-2xl font-bold uppercase tracking-wider text-white transition-colors hover:text-cyan-400"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="space-y-4"
            >
              <div className="cyan-divider mb-6" />
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-3 text-center text-xs font-bold uppercase tracking-[0.2em] text-silver-500 transition-colors hover:text-white"
              >
                Connexion
              </Link>
              <Link
                to="/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block border border-cyan-500 bg-cyan-500/10 px-6 py-4 text-center text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-400 transition-all active:bg-cyan-500 active:text-carbon-950"
              >
                Espace Pro
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
