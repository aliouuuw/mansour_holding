import { useState } from 'react'
import { Link, useRouterState } from '@tanstack/react-router'
import { useScroll, useAnimationFrame, motion, AnimatePresence } from 'framer-motion'
import { Menu01Icon, Cancel01Icon } from 'hugeicons-react'
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

  const hasDarkHero = darkHeroPages.includes(currentPath)
  const showSolidBg = isScrolled || !hasDarkHero

  useAnimationFrame(() => {
    if (scrollY.get() > 60 && !isScrolled) setIsScrolled(true)
    if (scrollY.get() <= 60 && isScrolled) setIsScrolled(false)
  })

  return (
    <>
      <motion.nav
        className={cn(
          'fixed left-0 right-0 top-0 z-50 flex items-center justify-between px-6 py-5 transition-all duration-500 lg:px-12',
          showSolidBg || isMobileMenuOpen
            ? 'py-3 backdrop-blur-2xl border-b'
            : 'bg-transparent',
          showSolidBg && !isMobileMenuOpen
            ? 'bg-carbon-950/90 border-white/[0.04]'
            : isMobileMenuOpen
              ? 'bg-carbon-950/98 border-white/[0.04]'
              : 'border-transparent'
        )}
      >
        {/* Brand */}
        <div className="flex items-center gap-5">
          <Link to="/" className="group flex items-center gap-2 opacity-50 hover:opacity-80 transition-opacity">
            <span className="text-[10px] font-motors font-medium uppercase tracking-[0.2em] text-silver-400">
              Mansour
            </span>
          </Link>

          <span className="text-silver-700">/</span>

          <Link to="/mansour-motors" className="group flex items-center gap-2.5">
            <span className="font-motors-display text-[13px] font-bold uppercase tracking-[0.08em] text-white transition-colors group-hover:text-cyan-400">
              Motors
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const linkBase = link.to.split('#')[0]
            const isActive = currentPath === linkBase || (linkBase !== '/mansour-motors' && currentPath.startsWith(linkBase))
            return (
              <Link
                key={link.to}
                to={linkBase as any}
                hash={link.to.includes('#') ? link.to.split('#')[1] : undefined}
                className={cn(
                  'relative px-4 py-2 font-motors text-[11px] font-medium uppercase tracking-[0.15em] transition-all duration-300',
                  isActive
                    ? 'text-cyan-400'
                    : 'text-silver-400 hover:text-white'
                )}
              >
                {link.label}
                {isActive && (
                  <motion.span
                    layoutId="motors-nav-indicator"
                    className="absolute bottom-0 left-4 right-4 h-px bg-cyan-400"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            )
          })}

          <div className="ml-5 h-4 w-px bg-white/10" />

          <Link
            to="/login"
            className="ml-3 px-4 py-2 font-motors text-[11px] font-medium uppercase tracking-[0.15em] text-silver-500 transition-colors hover:text-white"
          >
            Connexion
          </Link>

          <Link
            to="/dashboard"
            className="btn-motors btn-motors-primary ml-2 px-5 py-2 text-[10px] font-bold tracking-[0.2em] rounded-sm"
          >
            Espace Pro
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
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

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 flex flex-col justify-between bg-carbon-950 px-6 pb-12 pt-28 md:hidden"
          >
            <div className="mb-8 flex items-center gap-3 border-b border-cyan-400/20 pb-4">
              <span className="font-motors-display text-xs font-bold uppercase tracking-[0.1em] text-cyan-400">
                Mansour Motors
              </span>
            </div>

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
                    className="block py-3 font-motors-display text-2xl font-bold uppercase tracking-wide text-white transition-colors hover:text-cyan-400"
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
              <div className="cyan-divider mb-6" />
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-3 text-center font-motors text-xs font-medium uppercase tracking-[0.2em] text-silver-500 transition-colors hover:text-white"
              >
                Connexion
              </Link>
              <Link
                to="/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className="btn-motors btn-motors-primary block w-full py-4 text-center text-xs font-bold tracking-[0.25em] rounded-sm"
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
