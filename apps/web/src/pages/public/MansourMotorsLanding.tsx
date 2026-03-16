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
  Sparkle,
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

const services = [
  {
    icon: CarProfile,
    title: 'Vente de Véhicules',
    description: 'Sélection exclusive de véhicules neufs et d\'occasion certifiés.',
  },
  {
    icon: Wrench,
    title: 'Service Après-Vente',
    description: 'Entretien et réparations par des techniciens qualifiés.',
  },
  {
    icon: CreditCard,
    title: 'Solutions de Financement',
    description: 'Plans de financement flexibles adaptés à vos besoins.',
  },
  {
    icon: CarProfile,
    title: 'Location de Véhicules',
    description: 'Location courte et longue durée pour tous vos déplacements.',
  },
]

export function MansourMotorsLanding() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95])

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
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
    <div ref={containerRef} className="relative bg-noir-950">
      <PublicNavbar />

      {/* Hero Section */}
      <motion.section
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 pt-32 pb-24 lg:px-12"
      >
        <div className="absolute inset-0 bg-gradient-radial from-gold-400/5 via-transparent to-transparent" />
        
        <div className="relative z-10 max-w-6xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-gold-400/20 bg-gold-400/5 px-4 py-2"
          >
            <Sparkle className="h-4 w-4 text-gold-400" weight="fill" />
            <span className="text-xs font-semibold uppercase tracking-widest text-gold-400">
              Mansour Motors
            </span>
          </motion.div>

          <h1 className="mb-8 font-sans text-5xl font-extrabold uppercase leading-[1.1] tracking-tight text-white md:text-7xl lg:text-8xl">
            <RevealText delay={0.3}>L'Excellence</RevealText>
            <br />
            <RevealText delay={0.4}>Automobile</RevealText>
            <br />
            <span className="font-serif italic text-gold-400 normal-case">
              <RevealText delay={0.5}>à Dakar</RevealText>
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mx-auto mb-12 max-w-2xl text-lg font-light leading-relaxed text-white/70"
          >
            Concessionnaire automobile premium offrant une sélection exclusive de véhicules
            neufs et d'occasion certifiés, accompagnée de services de financement et
            d'entretien de qualité supérieure.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Link
              to="/mansour-motors/vehicules"
              className="group inline-flex items-center gap-3 rounded-sm bg-gold-400 px-8 py-4 text-sm font-semibold uppercase tracking-widest text-noir-950 transition-all hover:bg-gold-300"
            >
              Voir le Catalogue
              <ArrowRight className="transition-transform group-hover:translate-x-1" weight="bold" />
            </Link>
            <a
              href="#contact"
              className="inline-flex items-center gap-3 rounded-sm border border-white/20 bg-white/5 px-8 py-4 text-sm font-semibold uppercase tracking-widest text-white backdrop-blur-sm transition-all hover:bg-white/10"
            >
              Nous Contacter
            </a>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-noir-950 to-transparent" />
      </motion.section>

      {/* Featured Vehicles Section */}
      <section className="relative px-6 py-24 lg:px-12 lg:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-4 font-sans text-4xl font-extrabold uppercase tracking-tight text-white md:text-5xl"
            >
              Véhicules en Vedette
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-lg text-white/60"
            >
              Découvrez notre sélection exclusive
            </motion.p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
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
                  <div className="relative overflow-hidden rounded-lg">
                    <div className="aspect-[4/3] overflow-hidden">
                      <img
                        src={vehicle.image}
                        alt={`${vehicle.make} ${vehicle.model}`}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-noir-950 via-noir-950/50 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="mb-2 font-serif text-2xl italic text-white">
                        {vehicle.make}{' '}
                        <span className="font-sans font-semibold not-italic text-gold-400">
                          {vehicle.model}
                        </span>
                      </h3>
                      <p className="mb-3 text-sm text-white/60">
                        {vehicle.year} • {vehicle.transmission}
                      </p>
                      <p className="text-2xl font-bold text-gold-400">
                        {formatPrice(vehicle.price)}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <Link
              to="/mansour-motors/vehicules"
              className="group inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-gold-400 transition-colors hover:text-gold-300"
            >
              Voir Tous les Véhicules
              <ArrowUpRight className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" weight="bold" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="relative bg-noir-900 px-6 py-24 lg:px-12 lg:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-4 font-sans text-4xl font-extrabold uppercase tracking-tight text-white md:text-5xl"
            >
              Nos Services
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-lg text-white/60"
            >
              Une gamme complète pour tous vos besoins automobiles
            </motion.p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative overflow-hidden rounded-lg border border-white/10 bg-white/5 p-8 backdrop-blur-sm transition-all hover:border-gold-400/30 hover:bg-white/10"
              >
                <service.icon className="mb-6 h-12 w-12 text-gold-400" weight="duotone" />
                <h3 className="mb-3 text-xl font-bold text-white">{service.title}</h3>
                <p className="text-sm leading-relaxed text-white/60">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact/Showroom Section */}
      <section id="contact" className="relative px-6 py-24 lg:px-12 lg:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="mb-6 font-sans text-4xl font-extrabold uppercase tracking-tight text-white md:text-5xl">
                Visitez Notre
                <br />
                <span className="font-serif italic text-gold-400 normal-case">Showroom</span>
              </h2>
              <p className="mb-8 text-lg leading-relaxed text-white/70">
                Notre équipe d'experts est à votre disposition pour vous accompagner dans le
                choix du véhicule parfait. Venez découvrir notre showroom et profitez d'un
                service personnalisé.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <MapPin className="mt-1 h-6 w-6 flex-shrink-0 text-gold-400" weight="fill" />
                  <div>
                    <h4 className="mb-1 font-semibold text-white">Adresse</h4>
                    <p className="text-white/60">
                      Avenue Cheikh Anta Diop
                      <br />
                      Dakar, Sénégal
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Clock className="mt-1 h-6 w-6 flex-shrink-0 text-gold-400" weight="fill" />
                  <div>
                    <h4 className="mb-1 font-semibold text-white">Horaires d'Ouverture</h4>
                    <p className="text-white/60">
                      Lundi - Vendredi: 8h00 - 18h00
                      <br />
                      Samedi: 9h00 - 17h00
                      <br />
                      Dimanche: Fermé
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Phone className="mt-1 h-6 w-6 flex-shrink-0 text-gold-400" weight="fill" />
                  <div>
                    <h4 className="mb-1 font-semibold text-white">Téléphone</h4>
                    <p className="text-white/60">+221 33 123 45 67</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Envelope className="mt-1 h-6 w-6 flex-shrink-0 text-gold-400" weight="fill" />
                  <div>
                    <h4 className="mb-1 font-semibold text-white">Email</h4>
                    <p className="text-white/60">motors@mansour.sn</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative overflow-hidden rounded-lg"
            >
              <div className="aspect-[4/3] bg-gradient-to-br from-gold-400/20 to-noir-900">
                <img
                  src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=2070&auto=format&fit=crop"
                  alt="Mansour Motors Showroom"
                  className="h-full w-full object-cover opacity-80"
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
