import { useRef, useEffect } from 'react'
import { Link } from '@tanstack/react-router'
import { motion, useScroll, useTransform } from 'framer-motion'
import {
  ArrowRight,
  CarProfile,
  Wrench,
  CreditCard,
  Phone,
  MapPin,
  Clock,
  Envelope,
  ArrowUpRight,
  Car,
} from '@phosphor-icons/react'
import Lenis from 'lenis'
import { PublicNavbar } from '@/components/public/PublicNavbar'
import { PublicFooter } from '@/components/public/PublicFooter'
import { vehicles } from '@/data/mock'
import { formatPrice, cn } from '@/lib/utils'

function RevealText({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode
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

const services = [
  {
    icon: CarProfile,
    title: 'Vente de Véhicules',
    description: 'Sélection exclusive de véhicules neufs et d\'occasion certifiés, avec garantie d\'excellence sur chaque modèle.',
    stat: '200+',
    statLabel: 'véhicules vendus',
  },
  {
    icon: Wrench,
    title: 'Service Après-Vente',
    description: 'Entretien et réparations par des techniciens qualifiés. Contrôle en 100+ points pour chaque véhicule.',
    stat: '100+',
    statLabel: 'points de contrôle',
  },
  {
    icon: CreditCard,
    title: 'Solutions de Financement',
    description: 'Plans de financement flexibles et partenariats bancaires pour un accompagnement personnalisé.',
    stat: '48h',
    statLabel: 'réponse garantie',
  },
  {
    icon: Car,
    title: 'Location de Véhicules',
    description: 'Location courte et longue durée de véhicules de prestige pour tous vos déplacements.',
    stat: '24/7',
    statLabel: 'disponibilité',
  },
]

const stats = [
  { value: '200+', label: 'Véhicules Vendus' },
  { value: '10+', label: 'Années d\'Expérience' },
  { value: '98%', label: 'Clients Satisfaits' },
  { value: '24h', label: 'Réponse Garantie' },
]

export function MansourMotorsLanding() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95])
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, 100])

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    })

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
    }
  }, [])

  const featuredVehicles = vehicles.filter((v) => v.status === 'available').slice(0, 3)

  return (
    <div ref={containerRef} className="relative bg-bone-50">
      {/* Navbar defaults to dark mode styling since hero is dark */}
      <PublicNavbar />

      {/* Hero Section — Cinematic with Background Image (Dark) */}
      <motion.section
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative flex min-h-screen items-end overflow-hidden pb-24 lg:pb-32 dark-grain bg-noir-950"
      >
        {/* Background Image */}
        <motion.div style={{ y: heroY }} className="absolute inset-0 -top-24">
          <img
            src="https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=2070&auto=format&fit=crop"
            alt="Luxury vehicles"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-noir-950 via-noir-950/70 to-noir-950/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-noir-950/80 via-transparent to-transparent" />
        </motion.div>

        <div className="relative z-10 w-full px-6 lg:px-12">
          <div className="mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-6 flex items-center gap-3"
            >
              <span className="h-px w-10 bg-gold-400" />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-gold-400">
                Mansour Motors — Dakar
              </span>
            </motion.div>

            <h1 className="mb-8 max-w-4xl font-sans text-[3.2rem] font-extrabold uppercase leading-[0.9] tracking-[-0.02em] text-white md:text-[5rem] lg:text-[6.5rem]">
              <RevealText delay={0.3}>L'Excellence</RevealText>
              <br />
              <RevealText delay={0.4}>Automobile</RevealText>
              <br />
              <span className="font-serif italic text-gold-400 normal-case text-[0.85em]">
                <RevealText delay={0.5}>à Dakar</RevealText>
              </span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mb-10 max-w-xl text-base font-light leading-relaxed text-white/60 md:text-lg"
            >
              Concessionnaire automobile premium offrant une sélection exclusive de véhicules
              neufs et d'occasion certifiés, accompagnée de services de financement et
              d'entretien de qualité supérieure.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="flex flex-col gap-4 sm:flex-row"
            >
              <Link
                to="/mansour-motors/vehicules"
                className="group inline-flex items-center gap-3 bg-gold-400 px-8 py-4 text-sm font-semibold uppercase tracking-widest text-noir-950 transition-all hover:bg-gold-300"
              >
                Voir le Catalogue
                <ArrowRight className="transition-transform group-hover:translate-x-1" weight="bold" />
              </Link>
              <a
                href="#contact"
                className="inline-flex items-center gap-3 border border-white/20 bg-white/5 px-8 py-4 text-sm font-semibold uppercase tracking-widest text-white backdrop-blur-sm transition-all hover:border-white/30 hover:bg-white/10"
              >
                Nous Contacter
              </a>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Stats Strip (Light) */}
      <section className="relative border-y border-bone-200 bg-white page-grain-light">
        <div className="mx-auto grid max-w-7xl grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className={cn(
                'flex flex-col items-center justify-center px-6 py-10 text-center lg:py-12',
                index < stats.length - 1 && 'border-r border-bone-200'
              )}
            >
              <span className="font-serif text-3xl italic text-gold-600 md:text-4xl">{stat.value}</span>
              <span className="mt-2 text-[10px] font-bold uppercase tracking-[0.15em] text-noir-400">{stat.label}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Vehicles Section (Dark) */}
      <section className="relative px-6 py-24 lg:px-12 lg:py-32 bg-noir-950 dark-grain">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <motion.span
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="mb-3 block text-[10px] font-bold uppercase tracking-[0.2em] text-gold-400"
              >
                Sélection Premium
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="font-serif text-4xl italic text-white md:text-5xl"
              >
                Véhicules <span className="text-gold-400 not-italic font-sans font-extrabold uppercase text-[0.75em] tracking-tight">en Vedette</span>
              </motion.h2>
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <Link
                to="/mansour-motors/vehicules"
                className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gold-400 transition-colors hover:text-gold-300"
              >
                Tout voir
                <ArrowUpRight className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" weight="bold" />
              </Link>
            </motion.div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredVehicles.map((vehicle, index) => (
              <motion.div
                key={vehicle.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to="/mansour-motors/vehicules/$vehicleId"
                  params={{ vehicleId: vehicle.id }}
                  className="group block"
                >
                  <div className="relative overflow-hidden bg-noir-900 border border-white/[0.06] transition-colors hover:border-white/10">
                    <div className="aspect-[4/3] overflow-hidden">
                      <img
                        src={vehicle.image}
                        alt={`${vehicle.make} ${vehicle.model}`}
                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-noir-950 via-noir-950/40 to-transparent pointer-events-none" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                      <h3 className="mb-1 font-serif text-2xl italic text-white">
                        {vehicle.make}{' '}
                        <span className="font-sans font-semibold not-italic text-gold-400">
                          {vehicle.model}
                        </span>
                      </h3>
                      <p className="mb-3 text-xs font-medium uppercase tracking-wider text-white/50">
                        {vehicle.year} · {vehicle.transmission} · {vehicle.fuelType}
                      </p>
                      <div className="flex items-center justify-between border-t border-white/[0.06] pt-4 mt-2">
                        <p className="text-xl font-bold text-gold-400">
                          {formatPrice(vehicle.price)}
                        </p>
                        <span className="flex h-8 w-8 items-center justify-center bg-white/5 text-white/40 transition-all group-hover:bg-gold-400 group-hover:text-noir-950">
                          <ArrowUpRight className="h-4 w-4" weight="bold" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section (Light) */}
      <section id="services" className="relative bg-bone-50 px-6 py-24 lg:px-12 lg:py-32 page-grain-light">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gold-600/[0.03] via-transparent to-transparent" />
        <div className="relative mx-auto max-w-7xl">
          <div className="mb-16">
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mb-3 block text-[10px] font-bold uppercase tracking-[0.2em] text-gold-600"
            >
              Ce que nous offrons
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-lg font-serif text-4xl italic text-noir-950 md:text-5xl"
            >
              Nos <span className="text-gold-600 not-italic font-sans font-extrabold uppercase text-[0.75em] tracking-tight">Services</span>
            </motion.h2>
          </div>

          <div className="grid gap-px overflow-hidden border border-bone-200 bg-bone-200 md:grid-cols-2">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="group relative bg-white p-8 transition-colors hover:bg-bone-50 lg:p-12"
              >
                <div className="mb-8 flex items-center justify-between">
                  <service.icon className="h-10 w-10 text-gold-600 transition-transform duration-300 group-hover:scale-110" weight="duotone" />
                  <span className="font-serif text-2xl italic text-noir-200 group-hover:text-gold-200 transition-colors">{service.stat}</span>
                </div>
                <h3 className="mb-3 text-lg font-bold text-noir-950">{service.title}</h3>
                <p className="text-sm leading-relaxed text-noir-500">{service.description}</p>
                <div className="mt-6 h-px w-0 bg-gold-400 transition-all duration-500 group-hover:w-12" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact/Showroom Section (Light) */}
      <section id="contact" className="relative px-6 py-24 lg:px-12 lg:py-32 bg-white page-grain-light border-t border-bone-200">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="mb-3 block text-[10px] font-bold uppercase tracking-[0.2em] text-gold-600">
                Rendez-nous visite
              </span>
              <h2 className="mb-6 font-serif text-4xl italic text-noir-950 md:text-5xl">
                Notre <span className="text-gold-600 not-italic font-sans font-extrabold uppercase text-[0.75em] tracking-tight">Showroom</span>
              </h2>
              <p className="mb-10 text-base leading-relaxed text-noir-600">
                Notre équipe d'experts est à votre disposition pour vous accompagner dans le
                choix du véhicule parfait. Venez découvrir notre showroom et profitez d'un
                service personnalisé.
              </p>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="flex items-start gap-4 group">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center bg-bone-100 text-gold-600 transition-colors group-hover:bg-gold-600 group-hover:text-white">
                    <MapPin weight="fill" size={18} />
                  </div>
                  <div>
                    <h4 className="mb-1 text-xs font-bold uppercase tracking-wider text-noir-900">Adresse</h4>
                    <p className="text-sm text-noir-500">
                      Avenue Cheikh Anta Diop<br />Dakar, Sénégal
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 group">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center bg-bone-100 text-gold-600 transition-colors group-hover:bg-gold-600 group-hover:text-white">
                    <Clock weight="fill" size={18} />
                  </div>
                  <div>
                    <h4 className="mb-1 text-xs font-bold uppercase tracking-wider text-noir-900">Horaires</h4>
                    <p className="text-sm text-noir-500">
                      Lun–Ven: 8h–18h<br />Sam: 9h–17h
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 group">
                  <a href="tel:+221331234567" className="flex h-10 w-10 flex-shrink-0 items-center justify-center bg-bone-100 text-gold-600 transition-colors group-hover:bg-gold-600 group-hover:text-white">
                    <Phone weight="fill" size={18} />
                  </a>
                  <div>
                    <h4 className="mb-1 text-xs font-bold uppercase tracking-wider text-noir-900">Téléphone</h4>
                    <a href="tel:+221331234567" className="text-sm text-noir-500 hover:text-gold-600 transition-colors">+221 33 123 45 67</a>
                  </div>
                </div>

                <div className="flex items-start gap-4 group">
                  <a href="mailto:motors@mansour.sn" className="flex h-10 w-10 flex-shrink-0 items-center justify-center bg-bone-100 text-gold-600 transition-colors group-hover:bg-gold-600 group-hover:text-white">
                    <Envelope weight="fill" size={18} />
                  </a>
                  <div>
                    <h4 className="mb-1 text-xs font-bold uppercase tracking-wider text-noir-900">Email</h4>
                    <a href="mailto:motors@mansour.sn" className="text-sm text-noir-500 hover:text-gold-600 transition-colors">motors@mansour.sn</a>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative overflow-hidden bg-bone-100"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=2070&auto=format&fit=crop"
                  alt="Mansour Motors Showroom"
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  )
}
