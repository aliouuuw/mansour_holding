import { useRef } from 'react'
import { Link } from '@tanstack/react-router'
import { motion, useScroll, useTransform } from 'framer-motion'
import {
  ArrowRight01Icon,
  Car01Icon,
  Wrench01Icon,
  CreditCardIcon,
  TelephoneIcon,
  Location01Icon,
  Clock01Icon,
  Mail01Icon,
  ArrowUpRight01Icon,
} from 'hugeicons-react'
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
    icon: Car01Icon,
    title: 'Vente de Véhicules',
    description: 'Sélection exclusive de véhicules neufs et d\'occasion certifiés, avec garantie d\'excellence sur chaque modèle.',
    stat: '200+',
    statLabel: 'véhicules vendus',
  },
  {
    icon: Wrench01Icon,
    title: 'Service Après-Vente',
    description: 'Entretien et réparations par des techniciens qualifiés. Contrôle en 100+ points pour chaque véhicule.',
    stat: '100+',
    statLabel: 'points de contrôle',
  },
  {
    icon: CreditCardIcon,
    title: 'Solutions de Financement',
    description: 'Plans de financement flexibles et partenariats bancaires pour un accompagnement personnalisé.',
    stat: '48h',
    statLabel: 'réponse garantie',
  },
  {
    icon: Car01Icon,
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

  const featuredVehicles = vehicles.filter((v) => v.status === 'available').slice(0, 3)

  return (
    <div ref={containerRef} className="relative bg-carbon-950 text-white font-motors motors-theme">
      <PublicNavbar />

      {/* ═══ Hero — Cinematic Video + Technical Overlay ═══ */}
      <motion.section
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative h-screen w-full overflow-hidden"
      >
        <motion.div style={{ y: heroY }} className="absolute inset-0 -top-24">
          <div className="absolute inset-0 overflow-hidden">
            <iframe
              className="absolute top-1/2 left-1/2 w-[300%] h-[300%] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              src="https://www.youtube.com/embed/DfBrE9E1DCk?autoplay=1&mute=1&loop=1&playlist=DfBrE9E1DCk&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1"
              title="Mansour Motors Background"
              allow="autoplay; encrypted-media"
              style={{ border: 'none' }}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-carbon-950 via-carbon-950/70 to-carbon-950/30" />
          <div className="absolute inset-0 bg-carbon-950/40" />
        </motion.div>

        {/* Technical grid overlay */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(var(--color-cyan-400) 1px, transparent 1px), linear-gradient(90deg, var(--color-cyan-400) 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />

        <div className="relative z-10 flex h-screen flex-col justify-end px-6 pb-16 pt-32 lg:px-12">
          <div className="max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="mb-8 flex items-center gap-4"
            >
              <span className="h-px w-16 bg-gradient-to-r from-cyan-400 to-transparent" />
              <span className="text-[10px] font-bold uppercase tracking-[0.35em] text-cyan-400">
                Mansour Motors — Dakar
              </span>
            </motion.div>

            <h1 className="mb-8 font-motors-display text-[2.5rem] font-bold uppercase leading-[0.9] tracking-tighter text-white sm:text-[3.5rem] md:text-[5rem] lg:text-[7rem] xl:text-[8.5rem]">
              <RevealText delay={0.1} className="block">L'Ingénierie</RevealText>
              <RevealText delay={0.25} className="block text-transparent bg-clip-text bg-gradient-to-r from-silver-100 via-silver-300 to-carbon-400">
                De L'Émotion
              </RevealText>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="mb-10 max-w-xl text-base font-light leading-relaxed text-silver-400 md:text-lg"
            >
              Concessionnaire automobile premium — sélection exclusive de véhicules
              neufs et certifiés, services de financement et d'entretien de qualité supérieure.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col gap-4 sm:flex-row"
            >
              <Link
                to="/mansour-motors/vehicules"
                className="btn-motors btn-motors-primary group inline-flex items-center justify-center gap-3 px-8 py-4 text-[11px]"
              >
                <span className="flex items-center gap-3">
                  Voir le Catalogue
                  <ArrowRight01Icon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Link>
              <a
                href="#contact"
                className="btn-motors btn-motors-outline group inline-flex items-center justify-center gap-3 px-8 py-4 text-[11px]"
              >
                Nous Contacter
              </a>
            </motion.div>
          </div>

          {/* Bottom stat bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 1 }}
            className="mt-16 flex items-center gap-10 border-t border-carbon-800/60 pt-6"
          >
            {stats.slice(0, 3).map((stat) => (
              <div key={stat.label} className="hidden sm:block">
                <span className="text-xl font-bold text-cyan-400 md:text-2xl">{stat.value}</span>
                <span className="ml-2 text-[10px] font-bold uppercase tracking-[0.15em] text-silver-600">{stat.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* ═══ Stats Strip — Full Width ═══ */}
      <section className="relative border-y border-carbon-800 bg-carbon-900 overflow-hidden">
        <div className="mx-auto grid max-w-7xl grid-cols-2 lg:grid-cols-4 relative z-10">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className={cn(
                'group flex flex-col items-center justify-center px-6 py-14 text-center lg:py-16 transition-colors duration-500 hover:bg-carbon-800/50',
                index < stats.length - 1 && 'border-r border-carbon-800'
              )}
            >
              <span className="font-motors-display text-3xl font-bold text-cyan-400 md:text-4xl lg:text-5xl transition-transform duration-500 group-hover:scale-105">
                {stat.value}
              </span>
              <span className="mt-3 text-[10px] font-bold uppercase tracking-[0.25em] text-silver-600 transition-colors duration-300 group-hover:text-silver-400">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══ Featured Vehicles ═══ */}
      <section className="relative bg-carbon-950 px-6 py-24 lg:px-12 lg:py-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] bg-cyan-500/3 rounded-full blur-[150px] pointer-events-none" />

        <div className="mx-auto max-w-7xl relative z-10">
          <div className="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center gap-3 mb-5"
              >
                <span className="h-px w-8 bg-cyan-500" />
                <span className="block text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-500">
                  Sélection Premium
                </span>
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="font-motors-display text-4xl font-bold uppercase tracking-tight text-white md:text-5xl lg:text-6xl"
              >
                Véhicules <span className="text-cyan-400">en Vedette</span>
              </motion.h2>
            </div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link
                to="/mansour-motors/vehicules"
                className="group inline-flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.2em] text-silver-400 transition-all duration-300 hover:text-cyan-400"
              >
                Tout voir
                <div className="flex h-10 w-10 items-center justify-center border border-carbon-700 text-silver-500 transition-all duration-300 group-hover:border-cyan-500 group-hover:text-cyan-400 group-hover:shadow-cyan-sm">
                  <ArrowUpRight01Icon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </Link>
            </motion.div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredVehicles.map((vehicle, index) => (
              <motion.div
                key={vehicle.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: index * 0.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link
                  to="/mansour-motors/vehicules/$vehicleId"
                  params={{ vehicleId: vehicle.id }}
                  className="group block h-full"
                >
                  <div className="flex flex-col h-full overflow-hidden border border-carbon-800 bg-carbon-900 transition-all duration-500 hover:border-cyan-500/30 hover:shadow-[0_0_40px_rgba(0,229,255,0.06)]">
                    <div className="relative aspect-[4/3] overflow-hidden bg-carbon-800">
                      <img
                        src={vehicle.image}
                        alt={`${vehicle.make} ${vehicle.model}`}
                        className="h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-carbon-950 via-carbon-950/30 to-transparent opacity-80" />

                      {/* Corner accent */}
                      <div className="absolute top-4 right-4 h-6 w-6 border-t border-r border-cyan-500/40 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                      <div className="absolute bottom-4 left-4 h-6 w-6 border-b border-l border-cyan-500/40 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                      <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                        <h3 className="font-motors-display text-lg font-bold uppercase tracking-wider text-white">
                          {vehicle.make}
                        </h3>
                        <span className="text-sm font-bold text-cyan-400">{vehicle.model}</span>
                        <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.2em] text-silver-500">
                          {vehicle.year} <span className="text-carbon-600 px-1">·</span> {vehicle.transmission} <span className="text-carbon-600 px-1">·</span> {vehicle.fuelType}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-1 items-end justify-between p-6 border-t border-carbon-800">
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-silver-600 mb-1">Prix</p>
                        <p className="text-xl font-bold text-white">
                          {formatPrice(vehicle.price)}
                        </p>
                      </div>
                      <span className="flex h-10 w-10 items-center justify-center border border-carbon-700 text-silver-500 transition-all duration-500 group-hover:border-cyan-500 group-hover:bg-cyan-500 group-hover:text-carbon-950">
                        <ArrowRight01Icon className="h-4 w-4 transition-transform duration-300 group-hover:-rotate-45" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Services Section ═══ */}
      <section id="services" className="relative bg-carbon-900 px-6 py-24 lg:px-12 lg:py-32 overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-cyan-500/3 rounded-full blur-[150px] pointer-events-none -translate-y-1/3 translate-x-1/4" />

        <div className="relative mx-auto max-w-7xl z-10">
          <div className="mb-20 flex flex-col items-start">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-3 mb-5"
            >
              <span className="h-px w-12 bg-cyan-500" />
              <span className="block text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-500">
                Ce que nous offrons
              </span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="font-motors-display text-4xl font-bold uppercase tracking-tight text-white md:text-5xl lg:text-6xl"
            >
              Services <span className="text-cyan-400">Exclusifs</span>
            </motion.h2>
          </div>

          <div className="grid gap-px md:grid-cols-2 bg-carbon-800 border border-carbon-800">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: index * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="group relative bg-carbon-900 p-10 transition-all duration-500 hover:bg-carbon-800 lg:p-14 overflow-hidden"
              >
                <div className="mb-10 flex items-start justify-between relative z-10">
                  <div className="flex h-14 w-14 items-center justify-center border border-carbon-700 text-silver-500 transition-all duration-500 group-hover:border-cyan-500 group-hover:text-cyan-400 group-hover:shadow-cyan-sm">
                    <service.icon className="h-6 w-6" />
                  </div>
                  <span className="font-motors-display text-2xl font-bold text-carbon-700 transition-colors duration-500 group-hover:text-cyan-500/30">
                    {service.stat}
                  </span>
                </div>
                <div className="relative z-10">
                  <h3 className="mb-4 text-xl font-bold text-white transition-colors duration-500 group-hover:text-cyan-50">
                    {service.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-silver-500 transition-colors duration-500 group-hover:text-silver-300">
                    {service.description}
                  </p>
                </div>
                <div className="mt-8 h-px w-12 bg-carbon-700 transition-all duration-700 ease-out group-hover:w-full group-hover:bg-cyan-500" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Contact / Showroom ═══ */}
      <section id="contact" className="relative bg-carbon-950 px-6 py-24 lg:px-12 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02] mix-blend-overlay pointer-events-none" />
        <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-carbon-800 to-transparent" />

        <div className="mx-auto max-w-7xl relative z-10">
          <div className="grid gap-16 lg:grid-cols-2 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="h-px w-8 bg-cyan-500" />
                <span className="block text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-500">
                  Rendez-nous visite
                </span>
              </div>
              <h2 className="mb-8 font-motors-display text-4xl font-bold uppercase tracking-tight text-white md:text-5xl lg:text-6xl">
                Notre <span className="text-cyan-400">Showroom</span>
              </h2>
              <p className="mb-12 text-base font-light leading-relaxed text-silver-500">
                Notre équipe d'experts est à votre disposition pour vous accompagner dans le
                choix du véhicule parfait. Venez découvrir notre showroom et profitez d'un
                service d'exception.
              </p>

              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                {[
                  { icon: Location01Icon, title: 'Adresse', content: 'Avenue Cheikh Anta Diop\nDakar, Sénégal' },
                  { icon: Clock01Icon, title: 'Horaires', content: 'Lun–Ven: 8h–18h\nSam: 9h–17h' },
                  { icon: TelephoneIcon, title: 'Téléphone', content: '+221 33 123 45 67', href: 'tel:+221331234567' },
                  { icon: Mail01Icon, title: 'Email', content: 'motors@mansour.sn', href: 'mailto:motors@mansour.sn' },
                ].map((item, i) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 + 0.3, duration: 0.8 }}
                    className="flex items-start gap-4 group"
                  >
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center border border-carbon-700 text-silver-500 transition-all duration-500 group-hover:border-cyan-500 group-hover:text-cyan-400">
                      <item.icon className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-silver-600 transition-colors group-hover:text-cyan-400">{item.title}</h4>
                      {item.href ? (
                        <a href={item.href} className="text-sm font-medium text-silver-300 transition-colors hover:text-cyan-400 whitespace-pre-line block">{item.content}</a>
                      ) : (
                        <p className="text-sm font-medium text-silver-300 whitespace-pre-line">{item.content}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative overflow-hidden group"
            >
              <div className="absolute inset-0 border border-carbon-800 z-10 pointer-events-none transition-colors duration-500 group-hover:border-cyan-500/20" />
              {/* Corner accents */}
              <div className="absolute top-3 right-3 h-8 w-8 border-t border-r border-cyan-500/30 z-20 pointer-events-none" />
              <div className="absolute bottom-3 left-3 h-8 w-8 border-b border-l border-cyan-500/30 z-20 pointer-events-none" />

              <div className="aspect-[4/5] md:aspect-[4/3] overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=2070&auto=format&fit=crop"
                  alt="Mansour Motors Showroom"
                  className="h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-carbon-950 via-carbon-950/20 to-transparent" />

                <div className="absolute bottom-6 left-6 right-6 z-20 translate-y-3 opacity-0 transition-all duration-700 ease-out group-hover:translate-y-0 group-hover:opacity-100">
                  <div className="inline-flex items-center gap-3 bg-carbon-950/80 backdrop-blur-md border border-carbon-800 px-5 py-2.5">
                    <div className="h-2 w-2 bg-green-400 animate-pulse" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-silver-300">Showroom Ouvert</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  )
}
