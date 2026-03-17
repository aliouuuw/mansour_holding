import { useRef } from 'react'
import { Link } from '@tanstack/react-router'
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
} from 'framer-motion'
import {
  ArrowUpRight01Icon,
  Car01Icon,
  Wrench01Icon,
  Home01Icon,
  Key01Icon,
  Scissor01Icon,
  SparklesIcon,
  ArrowRight02Icon,
} from 'hugeicons-react'
import { PublicNavbar } from '@/components/public/PublicNavbar'
import { PublicFooter } from '@/components/public/PublicFooter'
import { cn } from '@/lib/utils'

// --- Utility Components ---

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
        transition={{ duration: 0.9, ease: [0.25, 1, 0.5, 1], delay }}
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
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      {/* @ts-ignore */}
      <Component
        ref={ref as any}
        {...props}
        className={cn(
          'relative inline-flex items-center justify-center overflow-hidden bg-gold-400 px-8 py-4 text-sm font-semibold uppercase tracking-widest text-noir-950 transition-all hover:bg-gold-300 hover:shadow-lg hover:shadow-gold-400/20',
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
    icon: Car01Icon,
    image:
      'https://images.unsplash.com/photo-1563720360172-67b8f3dce741?q=80&w=2070&auto=format&fit=crop',
    colSpan: 'md:col-span-2 lg:col-span-2',
    ready: true,
    href: '/mansour-motors',
  },
  {
    id: 'immobilier',
    name: 'Mansour Immobilier',
    description: 'Biens d’exception',
    longDescription:
      'Découvrez des résidences et espaces commerciaux situés dans les quartiers les plus prisés.',
    icon: Home01Icon,
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
    icon: Key01Icon,
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
    icon: Wrench01Icon,
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
    icon: Scissor01Icon,
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
    icon: SparklesIcon,
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

          <h1 className="max-w-5xl font-sans text-[2.5rem] font-extrabold uppercase leading-[0.88] tracking-[-0.03em] text-white sm:text-[3.5rem] md:text-[5.8rem] lg:text-[8rem] pb-4">
            <RevealText delay={0.1} className="block font-serif italic lowercase text-silver-200 normal-case text-[0.85em]">
              L'Autorité
            </RevealText>
            <RevealText
              delay={0.2}
              className="block"
            >
              De l'Excellence
            </RevealText>
            <RevealText delay={0.3} className="block font-serif italic lowercase text-gold-400 normal-case text-[0.85em]">
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
        <span className="text-sm font-bold uppercase tracking-widest text-noir-400">
          {businesses.length} entreprises
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {businesses.map((biz) => {
          const Wrapper = biz.href ? Link : 'div'
          const wrapperProps = biz.href ? { to: biz.href } : {}

          return (
            <motion.div
              key={biz.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6 }}
              className={cn(
                'group relative flex aspect-[4/5] flex-col justify-between overflow-hidden   bg-noir-950 p-8 md:aspect-[16/10] hover-trigger',
                biz.colSpan.includes('lg:col-span-2') ? 'lg:aspect-[2/1]' : 'lg:aspect-square',
                biz.colSpan
              )}
            >
              <Wrapper {...(wrapperProps as any)} className="absolute inset-0 z-0">
                <img
                  src={biz.image}
                  alt={biz.name}
                  className="h-full w-full object-cover opacity-60 transition-transform duration-1000 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-noir-950 via-noir-950/50 to-transparent" />
              </Wrapper>

              <div className="relative z-10 flex justify-between pointer-events-none">
                <div className="rounded-full bg-white/10 p-2 backdrop-blur-md transition-transform duration-500 group-hover:scale-110">
                  <biz.icon className="h-5 w-5 text-gold-400" />
                </div>
                {biz.ready ? (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-noir-950 transition-all duration-500 group-hover:rotate-45 group-hover:bg-gold-400 group-hover:shadow-[0_0_15px_rgba(207,181,59,0.5)]">
                    <ArrowUpRight01Icon className="h-4 w-4" />
                  </div>
                ) : (
                  <span className="rounded-full bg-noir-900/50 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-silver-400 backdrop-blur-md">
                    Bientôt
                  </span>
                )}
              </div>

              <div className="relative z-10 pointer-events-none transition-transform duration-500 group-hover:-translate-y-2">
                <h3 className="mb-2 font-serif text-2xl text-white md:text-3xl italic">
                  {biz.name}
                </h3>
                <p className="mb-4 text-silver-300 font-light text-sm">{biz.description}</p>
                <div className="grid grid-rows-[0fr] opacity-0 transition-all duration-500 ease-in-out group-hover:grid-rows-[1fr] group-hover:opacity-100">
                  <div className="overflow-hidden">
                    <p className="text-sm text-silver-400">{biz.longDescription}</p>
                    {biz.ready && (
                      <div className="mt-4 inline-flex items-center gap-2 border-b border-gold-400 pb-1 text-xs font-bold uppercase tracking-widest text-gold-400 transition-colors group-hover:text-gold-300">
                        Explorer <ArrowRight02Icon className="transition-transform group-hover:translate-x-1" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}

function About() {
  return (
    <section id="about" className="relative overflow-hidden bg-white px-6 py-32 lg:px-12">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-gold-100/50 via-transparent to-transparent opacity-60" />
        <div className="absolute bottom-0 left-0 h-[500px] w-[500px] rounded-full bg-gold-100/40 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 gap-16 lg:grid-cols-2">
        <div>
          <div className="sticky top-32">
            <span className="mb-8 block text-xs font-bold uppercase tracking-[0.2em] text-gold-600">
              Notre Philosophie
            </span>
            <h2 className="font-serif text-4xl leading-tight text-noir-950 md:text-6xl italic">
              Créer de la <span className="text-gold-600 not-italic">valeur durable</span>.
            </h2>
          </div>
        </div>
        <div className="space-y-24 text-lg leading-relaxed text-noir-500 md:text-xl font-light">
          <p>
            Fondé avec la vision de créer un groupe d'entreprises de premier plan au Sénégal,
            Mansour Holding s'est développé dans plusieurs secteurs stratégiques. Notre approche
            combine rigueur, qualité de service et engagement envers nos communautés.
          </p>
          <div className="grid grid-cols-1 gap-12 border-t border-noir-100 pt-12 md:grid-cols-2">
            <div>
              <h4 className="mb-4 text-gold-600 font-serif italic text-2xl">Vision</h4>
              <p className="text-base text-noir-500">
                Devenir la référence incontestée de l'excellence entrepreneuriale en Afrique de
                l'Ouest.
              </p>
            </div>
            <div>
              <h4 className="mb-4 text-gold-600 font-serif italic text-2xl">Mission</h4>
              <p className="text-base text-noir-500">
                Innover et bâtir des solutions pérennes qui répondent aux défis de demain.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}



export function LandingPage() {
  return (
    <div className="min-h-screen bg-surface-dim font-sans selection:bg-gold-400 selection:text-noir-950 page-grain">
      <PublicNavbar />
      <Hero />
      <Marquee />
      <Portfolio />
      <About />
      <PublicFooter />
    </div>
  )
}

