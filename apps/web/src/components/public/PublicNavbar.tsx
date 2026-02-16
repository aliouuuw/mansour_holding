import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { useScroll, useMotionValue, useAnimationFrame, motion } from 'framer-motion'
import { Buildings, List, X } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

export function PublicNavbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { scrollY } = useScroll()

  useMotionValue(0) // Initialize

  useAnimationFrame(() => {
    if (scrollY.get() > 50 && !isScrolled) setIsScrolled(true)
    if (scrollY.get() <= 50 && isScrolled) setIsScrolled(false)
  })

  const navLinks = [
    { label: 'Portfolio', to: '/vehicules' },
    { label: 'Accès', to: '/login' },
  ]

  return (
    <>
      <motion.nav
        className={cn(
          'fixed left-0 right-0 top-0 z-50 flex items-center justify-between px-6 py-6 transition-all duration-300 lg:px-12',
          isScrolled || isMobileMenuOpen ? 'bg-noir-950/80 py-4 backdrop-blur-md' : 'bg-transparent'
        )}
      >
        <Link to="/" className="flex items-center gap-2 hover-trigger">
          <Buildings className="h-6 w-6 text-gold-400" weight="duotone" />
          <span
            className={cn(
              'text-sm font-bold uppercase tracking-widest transition-colors',
              'text-white'
            )}
          >
            Mansour Holding
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to as any}
              className="text-xs font-bold uppercase tracking-[0.2em] text-white transition-colors hover:text-gold-400 hover-trigger"
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/dashboard"
            className="rounded-sm bg-white px-6 py-2.5 text-[10px] font-bold uppercase tracking-[0.25em] text-noir-950 transition-colors hover:bg-gold-400 hover-trigger"
          >
            Espace Pro
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="flex h-10 w-10 items-center justify-center text-white md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" weight="bold" />
          ) : (
            <List className="h-6 w-6" weight="bold" />
          )}
        </button>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <motion.div
        initial={false}
        animate={isMobileMenuOpen ? { opacity: 1, x: 0 } : { opacity: 0, x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed inset-0 z-40 flex flex-col bg-noir-950 px-6 pt-32 md:hidden"
      >
        <div className="flex flex-col gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to as any}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-2xl font-bold uppercase tracking-widest text-white transition-colors hover:text-gold-400"
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/dashboard"
            onClick={() => setIsMobileMenuOpen(false)}
            className="mt-4 rounded-sm bg-gold-400 px-6 py-4 text-center text-xs font-bold uppercase tracking-[0.25em] text-noir-950"
          >
            Espace Pro
          </Link>
        </div>
      </motion.div>
    </>
  )
}
