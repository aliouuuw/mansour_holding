import { useRef, useState, useEffect } from 'react'
import { Link } from '@tanstack/react-router'
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useAnimationFrame,
} from 'framer-motion'
import {
  ArrowRight,
  ArrowUpRight,
  Buildings,
  CarProfile,
  HardHat,
  House,
  Key,
  Envelope,
  MapPin,
  Phone,
  Scissors,
  Sparkle,
  CaretRight,
} from '@phosphor-icons/react'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import Lenis from 'lenis'

// --- Utility Components ---

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

function RevealText({
  children,
  className,
  delay = 0,
}: {
  children: string
  className?: string
  delay?: number
}) {
  return (
    <span className={cn('inline-block overflow-hidden', className)}>
      <motion.span
        initial={{ y: '100%' }}
        whileInView={{ y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay }}
        className="inline-block"
      >
        {children}
      </motion.span>
    </span>
  )
}

function MagneticButton({
  children,
  className,
  to,
  href,
}: {
  children: React.ReactNode
  className?: string
  to?: string
  href?: string
}) {
  const ref = useRef<HTMLButtonElement | HTMLAnchorElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e
    const { left, top, width, height } = ref.current!.getBoundingClientRect()
    const centerX = left + width / 2
    const centerY = top + height / 2
    x.set((clientX - centerX) * 0.1)
    y.set((clientY - centerY) * 0.1)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  const springConfig = { damping: 15, stiffness: 150, mass: 0.1 }
  const springX = useSpring(x, springConfig)
  const springY = useSpring(y, springConfig)

  const Component = to ? Link : href ? 'a' : 'button'
  const props = to ? { to } : href ? { href } : {}

  return (
    <motion.div
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* @ts-ignore */}
      <Component
        ref={ref as any}
        {...props}
        className={cn(
          'relative inline-flex items-center justify-center overflow-hidden rounded-sm bg-gold-400 px-8 py-4 text-sm font-semibold uppercase tracking-widest text-noir-950 transition-colors hover:bg-gold-300',
          className
        )}
      >
        {children}
      </Component>
    </motion.div>
  )
}

// --- Data ---

const businesses = [
  {
    id: 'motors',
    name: 'Mansour Motors',
    description: 'Concessionnaire automobile premium',
    longDescription:
      'Une sélection exclusive de véhicules neufs et d’occasion certifiés pour une clientèle exigeante.',
    icon: CarProfile,
    image:
      'https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=2070&auto=format&fit=crop',
    colSpan: 'md:col-span-2 lg:col-span-2',
    ready: true,
  },
  {
    id: 'immobilier',
    name: 'Mansour Immobilier',
    description: 'Biens d’exception',
    longDescription:
      'Découvrez des résidences et espaces commerciaux situés dans les quartiers les plus prisés.',
    icon: House,
    image:
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop',
    colSpan: 'md:col-span-1 lg:col-span-1',
    ready: false,
  },
  {
    id: 'location',
    name: 'Mansour Location',
    description: 'Mobilité sans contraintes',
    longDescription: 'Location courte et longue durée de véhicules de prestige.',
    icon: Key,
    image:
      'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=2070&auto=format&fit=crop',
    colSpan: 'md:col-span-1 lg:col-span-1',
    ready: false,
  },
  {
    id: 'construction',
    name: 'Mansour Construction',
    description: 'Bâtir l’avenir',
    longDescription: 'Grands projets résidentiels et commerciaux.',
    icon: HardHat,
    image:
      'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2070&auto=format&fit=crop',
    colSpan: 'md:col-span-2 lg:col-span-2',
    ready: false,
  },
  {
    id: 'grooming',
    name: 'Mansour Grooming',
    description: 'Soins pour hommes',
    longDescription: 'L’art du soin au masculin.',
    icon: Scissors,
    image:
      'https://images.unsplash.com/photo-1621607512214-68297480165e?q=80&w=2070&auto=format&fit=crop',
    colSpan: 'md:col-span-2 lg:col-span-2',
    ready: false,
  },
  {
    id: 'parfums',
    name: 'Mansour Parfums',
    description: 'Fragrances rares',
    longDescription: 'Une collection olfactive unique.',
    icon: Sparkle,
    image:
      'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=2080&auto=format&fit=crop',
    colSpan: 'md:col-span-2 lg:col-span-1',
    ready: false,
  },
]

const stats = [
  { label: 'Entreprises', value: '07' },
  { label: 'Années d’excellence', value: '10+' },
  { label: 'Collaborateurs', value: '150+' },
  { label: 'Clients satisfaits', value: '1K+' },
]

// --- Sections ---

function Hero() {
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 500], [0, 200])
  const opacity = useTransform(scrollY, [0, 300], [1, 0])

  return (
    <section className="relative h-screen w-full overflow-hidden bg-noir-950">
      <motion.div style={{ y, opacity }} className="absolute inset-0 h-full w-full">
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/70 via-black/50 to-noir-950" />
        <img
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop"
          alt="Modern Architecture"
          className="h-full w-full object-cover"
        />
      </motion.div>

      <div className="relative z-20 flex h-full flex-col justify-between px-6 pb-12 pt-32 lg:px-12">
        <div className="max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8 flex items-center gap-4"
          >
            <span className="h-px w-12 bg-gold-400" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-gold-400">
              Depuis 2012
            </span>
          </motion.div>

          <h1 className="max-w-5xl font-sans text-[3.2rem] font-extrabold uppercase leading-[0.9] tracking-[-0.03em] text-white md:text-[5.4rem] lg:text-[7.5rem] pb-4">
            <RevealText delay={0.1} className="block italic font-serif lowercase text-silver-200 normal-case">
              L'Autorité
            </RevealText>
            <RevealText
              delay={0.2}
              className="block"
            >
              De l'Excellence
            </RevealText>
            <RevealText delay={0.3} className="block italic font-serif lowercase text-gold-400 normal-case">
              Durable.
            </RevealText>
          </h1>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between"
        >
          <p className="max-w-2xl border-l-2 border-gold-400/70 pl-8 text-lg font-light leading-relaxed text-silver-200 md:text-xl">
            Mansour Holding unifie un portefeuille d'entreprises d'exception. Une vision souveraine alliée à une discipline absolue pour redéfinir les standards de l'industrie.
          </p>
          <div className="flex gap-4">
            <MagneticButton href="#portfolio">Découvrir le portfolio</MagneticButton>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function Marquee() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })

  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-25%'])

  return (
    <div ref={containerRef} className="relative overflow-hidden bg-noir-950 py-24 border-y border-white/5">
      <motion.div style={{ x }} className="flex whitespace-nowrap">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center gap-20 px-10">
            {stats.map((stat, index) => (
              <div key={index} className="flex items-center gap-6 group">
                <span className="font-serif text-8xl font-thin italic text-white/50 md:text-9xl group-hover:text-gold-400 transition-colors duration-500">
                  {stat.value}
                </span>
                <span className="text-sm font-bold uppercase tracking-widest text-gold-400/80">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  )
}

function Portfolio() {
  return (
    <section id="portfolio" className="bg-surface-dim px-6 py-24 lg:px-12">
      <div className="mb-16 flex flex-col justify-between gap-8 border-b border-noir-200 pb-8 md:flex-row md:items-end">
        <div>
          <h2 className="font-serif text-4xl text-noir-950 md:text-6xl italic">Portfolio</h2>
          <p className="mt-4 max-w-xl text-lg text-noir-500 font-light">
            Une diversité d'expertises, une vision unique.
          </p>
        </div>
        <Link
          to="/vehicules"
          className="group flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-noir-950 hover-trigger"
        >
          Voir toutes les activités
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {businesses.map((biz) => (
          <motion.div
            key={biz.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
            className={cn(
              'group relative flex aspect-[4/5] flex-col justify-between overflow-hidden rounded-sm bg-noir-950 p-8 md:aspect-[16/10] hover-trigger',
              biz.colSpan.includes('lg:col-span-2') ? 'lg:aspect-[2/1]' : 'lg:aspect-square',
              biz.colSpan
            )}
          >
            <div className="absolute inset-0 z-0">
              <img
                src={biz.image}
                alt={biz.name}
                className="h-full w-full object-cover opacity-60 transition-transform duration-1000 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-noir-950 via-noir-950/50 to-transparent" />
            </div>

            <div className="relative z-10 flex justify-between">
              <div className="rounded-full bg-white/10 p-2 backdrop-blur-sm">
                <biz.icon className="h-5 w-5 text-gold-400" weight="fill" />
              </div>
              {biz.ready ? (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-noir-950 transition-transform group-hover:rotate-45">
                  <ArrowUpRight className="h-4 w-4" weight="bold" />
                </div>
              ) : (
                <span className="rounded-full bg-noir-900/50 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-silver-400 backdrop-blur-sm">
                  Bientôt
                </span>
              )}
            </div>

            <div className="relative z-10">
              <h3 className="mb-2 font-serif text-2xl text-white md:text-3xl italic">{biz.name}</h3>
              <p className="mb-4 text-silver-300 font-light text-sm">{biz.description}</p>
              <div className="h-0 overflow-hidden opacity-0 transition-all duration-500 ease-in-out group-hover:h-auto group-hover:opacity-100">
                <p className="text-sm text-silver-400">{biz.longDescription}</p>
                {biz.ready && (
                  <Link
                    to="/vehicules"
                    className="mt-4 inline-flex items-center gap-2 border-b border-gold-400 pb-1 text-xs font-bold uppercase tracking-widest text-gold-400 hover:text-white hover:border-white transition-colors"
                  >
                    Explorer <CaretRight weight="bold" />
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

function About() {
  return (
    <section className="relative overflow-hidden bg-noir-900 px-6 py-32 text-white lg:px-12">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-gold-400/10 via-noir-950/0 to-noir-950/0 opacity-50" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] mix-blend-overlay" />
        <div className="absolute bottom-0 left-0 h-[500px] w-[500px] rounded-full bg-gold-400/5 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 gap-16 lg:grid-cols-2">
        <div>
          <div className="sticky top-32">
            <span className="mb-8 block text-xs font-bold uppercase tracking-[0.2em] text-gold-400">
              Notre Philosophie
            </span>
            <h2 className="font-serif text-4xl leading-tight md:text-6xl italic">
              Créer de la <span className="text-gold-400 not-italic">valeur durable</span>.
            </h2>
          </div>
        </div>
        <div className="space-y-24 text-lg leading-relaxed text-silver-300 md:text-xl font-light">
          <p>
            Fondé avec la vision de créer un groupe d'entreprises de premier plan au Sénégal,
            Mansour Holding s'est développé dans plusieurs secteurs stratégiques. Notre approche
            combine rigueur, qualité de service et engagement envers nos communautés.
          </p>
          <div className="grid grid-cols-1 gap-12 border-t border-white/10 pt-12 md:grid-cols-2">
            <div>
              <h4 className="mb-4 text-gold-400 font-serif italic text-2xl">Vision</h4>
              <p className="text-base text-silver-400">
                Devenir la référence incontestée de l'excellence entrepreneuriale en Afrique de
                l'Ouest.
              </p>
            </div>
            <div>
              <h4 className="mb-4 text-gold-400 font-serif italic text-2xl">Mission</h4>
              <p className="text-base text-silver-400">
                Innover et bâtir des solutions pérennes qui répondent aux défis de demain.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="bg-surface-dim px-6 py-24 lg:px-12">
      <div className="mb-24 grid grid-cols-1 gap-12 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <Link to="/" className="flex items-center gap-3 hover-trigger">
            <Buildings className="h-8 w-8 text-gold-400" weight="duotone" />
            <span className="text-lg font-bold uppercase tracking-widest text-noir-950">
              Mansour Holding
            </span>
          </Link>
          <p className="mt-8 max-w-sm text-noir-500 font-light">
            Groupe diversifié basé à Dakar, Sénégal. Excellence et performance dans chaque
            secteur.
          </p>
        </div>

        <div>
          <h4 className="mb-8 text-xs font-bold uppercase tracking-widest text-noir-400">
            Navigation
          </h4>
          <ul className="space-y-4">
            {['Portfolio', 'À propos', 'Carrières', 'Contact'].map((item) => (
              <li key={item}>
                <a
                  href="#"
                  className="text-noir-600 transition-colors hover:text-gold-400 hover-trigger inline-block"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-8 text-xs font-bold uppercase tracking-widest text-noir-400">
            Contact
          </h4>
          <ul className="space-y-4 text-noir-600">
            <li className="flex items-center gap-3 hover-trigger">
              <Phone className="h-4 w-4 text-gold-400" weight="fill" />
              +221 33 123 45 67
            </li>
            <li className="flex items-center gap-3 hover-trigger">
              <Envelope className="h-4 w-4 text-gold-400" weight="fill" />
              contact@mansour.sn
            </li>
            <li className="flex items-center gap-3 hover-trigger">
              <MapPin className="h-4 w-4 text-gold-400" weight="fill" />
              Dakar, Sénégal
            </li>
          </ul>
        </div>
      </div>

      <div className="flex flex-col items-center justify-between gap-6 border-t border-noir-200 pt-8 md:flex-row">
        <p className="text-sm text-noir-400">
          © {new Date().getFullYear()} Mansour Holding. Tous droits réservés.
        </p>
        <div className="flex gap-6">
          {['LinkedIn', 'Twitter', 'Instagram'].map((social) => (
            <a
              key={social}
              href="#"
              className="text-sm font-medium text-noir-600 hover:text-gold-400 hover-trigger"
            >
              {social}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}

function Navbar() {
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
            isScrolled ? 'text-white' : 'text-white'
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

export function LandingPage() {
  useEffect(() => {
    const lenis = new Lenis()

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
    }
  }, [])

  return (
    <div className="min-h-screen bg-noir-950 font-sans selection:bg-gold-400 selection:text-noir-950">
      <Navbar />
      <Hero />
      <Marquee />
      <About />
      <Portfolio />
      <Footer />
    </div>
  )
}

