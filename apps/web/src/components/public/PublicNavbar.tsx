import { useState } from 'react'
import { Link, useRouterState } from '@tanstack/react-router'
import { useScroll, useAnimationFrame, motion, AnimatePresence } from 'framer-motion'
import { Buildings, List, X, CarProfile } from '@phosphor-icons/react'
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

export function PublicNavbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { scrollY } = useScroll()
  const routerState = useRouterState()
  const currentPath = routerState.location.pathname

  const isMotorsSection = currentPath.startsWith('/mansour-motors')
  const navLinks = isMotorsSection ? motorsLinks : holdingLinks

  useAnimationFrame(() => {
    if (scrollY.get() > 50 && !isScrolled) setIsScrolled(true)
    if (scrollY.get() <= 50 && isScrolled) setIsScrolled(false)
  })

  return (
    <>
      <motion.nav
        className={cn(
          'fixed left-0 right-0 top-0 z-50 flex items-center justify-between px-6 py-5 transition-all duration-500 lg:px-12',
          isScrolled || isMobileMenuOpen
            ? 'bg-noir-950/90 py-3.5 backdrop-blur-xl border-b border-white/[0.04]'
            : 'bg-transparent'
        )}
      >
        {/* Brand */}
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2.5 hover-trigger group">
            <Buildings className="h-5 w-5 text-gold-400 transition-transform duration-300 group-hover:scale-110" weight="duotone" />
            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-white">
              Mansour
            </span>
          </Link>

          {isMotorsSection && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              className="hidden items-center gap-2.5 md:flex"
            >
              <span className="text-white/20">/</span>
              <Link to="/mansour-motors" className="flex items-center gap-1.5 hover-trigger group">
                <CarProfile className="h-4 w-4 text-gold-400" weight="fill" />
                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-gold-400">
                  Motors
                </span>
              </Link>
            </motion.div>
          )}
        </div>

        {/* Desktop Navigation */}
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
                  isActive ? 'text-gold-400' : 'text-white/70 hover:text-white'
                )}
              >
                {link.label}
                {isActive && (
                  <motion.span
                    layoutId="nav-indicator"
                    className="absolute bottom-0 left-4 right-4 h-px bg-gold-400"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            )
          })}
          <div className="ml-4 h-4 w-px bg-white/10" />
          <Link
            to="/login"
            className="ml-3 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/70 transition-colors hover:text-white hover-trigger"
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

        {/* Mobile Menu Toggle */}
        <button
          className="relative z-50 flex h-11 w-11 items-center justify-center text-white md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
        >
          <AnimatePresence mode="wait">
            {isMobileMenuOpen ? (
              <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                <X className="h-6 w-6" weight="bold" />
              </motion.div>
            ) : (
              <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                <List className="h-6 w-6" weight="bold" />
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
            className="fixed inset-0 z-40 flex flex-col justify-between bg-noir-950 px-6 pb-12 pt-28 md:hidden"
          >
            {isMotorsSection && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="mb-8 flex items-center gap-2 border-b border-white/10 pb-4"
              >
                <CarProfile className="h-5 w-5 text-gold-400" weight="fill" />
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-gold-400">Mansour Motors</span>
              </motion.div>
            )}

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
