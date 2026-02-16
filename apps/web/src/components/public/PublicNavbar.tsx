import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { useScroll, useMotionValue, useAnimationFrame, motion } from 'framer-motion'
import { Buildings } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

export function PublicNavbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const { scrollY } = useScroll()

  useMotionValue(0) // Initialize

  useAnimationFrame(() => {
    if (scrollY.get() > 50 && !isScrolled) setIsScrolled(true)
    if (scrollY.get() <= 50 && isScrolled) setIsScrolled(false)
  })

  return (
    <motion.nav
      className={cn(
        'fixed left-0 right-0 top-0 z-50 flex items-center justify-between px-6 py-6 transition-all duration-300 lg:px-12',
        isScrolled ? 'bg-noir-950/80 py-4 backdrop-blur-md' : 'bg-transparent'
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

      <div className="flex items-center gap-8">
        <Link
          to="/vehicules"
          className="hidden text-xs font-bold uppercase tracking-[0.2em] text-white transition-colors hover:text-gold-400 md:block hover-trigger"
        >
          Portfolio
        </Link>
        <Link
          to="/login"
          className="hidden text-xs font-bold uppercase tracking-[0.2em] text-white transition-colors hover:text-gold-400 md:block hover-trigger"
        >
          Accès
        </Link>
        <Link
          to="/dashboard"
          className="rounded-sm bg-white px-6 py-2.5 text-[10px] font-bold uppercase tracking-[0.25em] text-noir-950 transition-colors hover:bg-gold-400 hover-trigger"
        >
          Espace Pro
        </Link>
      </div>
    </motion.nav>
  )
}
