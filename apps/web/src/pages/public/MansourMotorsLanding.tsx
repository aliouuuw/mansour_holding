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
  Shield01Icon,
} from 'hugeicons-react'
import { MotorsNavbar } from '@/components/motors/MotorsNavbar'
import { MotorsFooter } from '@/components/motors/MotorsFooter'
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
        initial={{ y: '110%' }}
        whileInView={{ y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay }}
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
    title: 'Vente Premium',
    description: 'Sélection rigoureuse de véhicules neufs et d\'occasion certifiés. Chaque modèle passe notre inspection 100+ points.',
    stat: '200+',
    statLabel: 'véhicules vendus',
  },
  {
    icon: Wrench01Icon,
    title: 'Service Technique',
    description: 'Atelier équipé des dernières technologies. Techniciens certifiés pour l\'entretien et la réparation de toutes marques.',
    stat: '100+',
    statLabel: 'points de contrôle',
  },
  {
    icon: CreditCardIcon,
    title: 'Financement',
    description: 'Solutions de financement sur mesure. Partenariats bancaires exclusifs avec réponse garantie sous 48h.',
    stat: '48h',
    statLabel: 'réponse garantie',
  },
  {
    icon: Shield01Icon,
    title: 'Garantie Étendue',
    description: 'Programmes de garantie complets pour votre tranquillité. Couverture mécanique, électrique et carrosserie.',
    stat: '24',
    statLabel: 'mois de garantie',
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
  const heroRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })

  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])
  const heroScale = useTransform(scrollYProgress, [0, 0.6], [1, 1.05])
  const heroY = useTransform(scrollYProgress, [0, 0.6], [0, 80])

  const featuredVehicles = vehicles.filter((v) => v.status === 'available').slice(0, 3)

  return (
    <div ref={containerRef} className="motors-theme relative bg-carbon-950">
      <MotorsNavbar />

      {/* ═══ HERO — Full-Screen Cinematic ═══ */}
      <motion.section
        ref={heroRef}
        className="relative h-screen w-full overflow-hidden"
      >
        {/* Background Video with heavier overlay */}
        <motion.div style={{ scale: heroScale }} className="absolute inset-0">
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
          <div className="absolute inset-0 bg-carbon-950/20" />
        </motion.div>

        {/* Subtle scan line effect */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-[2] opacity-[0.03]">
          <div className="absolute inset-0" style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,229,255,0.1) 2px, rgba(0,229,255,0.1) 4px)',
            backgroundSize: '100% 4px',
          }} />
        </div>

        <motion.div style={{ opacity: heroOpacity, y: heroY }} className="relative z-10 flex h-screen flex-col justify-end px-6 pb-16 lg:px-12 lg:pb-20">
          <div className="max-w-6xl">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="mb-6 flex items-center gap-4"
            >
              <span className="h-px w-12 bg-cyan-400" />
              <span className="font-motors text-xs font-bold uppercase tracking-[0.3em] text-cyan-400">
                Mansour Motors — Dakar
              </span>
            </motion.div>

            <h1 className="max-w-5xl pb-2">
              <RevealText delay={0.1} className="block font-motors-display text-[2.2rem] font-bold uppercase leading-[0.95] tracking-[-0.02em] text-white sm:text-[3rem] md:text-[4.5rem] lg:text-[6rem]">
                L'Excellence
              </RevealText>
              <RevealText delay={0.2} className="block font-motors-display text-[2.2rem] font-bold uppercase leading-[0.95] tracking-[-0.02em] text-white sm:text-[3rem] md:text-[4.5rem] lg:text-[6rem]">
                Automobile
              </RevealText>
              <RevealText delay={0.3} className="block font-motors text-[1.8rem] font-light lowercase text-cyan-400 sm:text-[2.5rem] md:text-[3.5rem] lg:text-[4.5rem] mt-1">
                à Dakar
              </RevealText>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="mb-10 max-w-xl font-motors text-base font-light leading-relaxed text-silver-300 md:text-lg"
            >
              Concessionnaire premium — véhicules neufs et d'occasion certifiés,
              financement sur mesure et service après-vente d'exception.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col gap-4 sm:flex-row"
            >
              <Link
                to="/mansour-motors/vehicules"
                className="group relative inline-flex items-center justify-center gap-3 overflow-hidden bg-cyan-400 px-8 py-4 font-motors text-[12px] font-bold uppercase tracking-[0.2em] text-carbon-950 transition-all hover:shadow-[0_0_40px_rgba(0,229,255,0.3)] rounded-sm"
              >
                <span className="relative z-10 flex items-center gap-3">
                  Explorer le Catalogue
                  <ArrowRight01Icon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Link>
              <a
                href="#contact"
                className="group inline-flex items-center justify-center gap-3 border border-white/15 bg-white/5 px-8 py-4 font-motors text-[12px] font-bold uppercase tracking-[0.2em] text-white backdrop-blur-sm transition-all hover:border-cyan-400/40 hover:bg-cyan-400/5 rounded-sm"
              >
                Prendre Rendez-vous
              </a>
            </motion.div>
          </div>

          {/* Bottom Stats Bar — overlaid on hero */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="absolute bottom-0 left-0 right-0 border-t border-white/[0.06] bg-carbon-950/60 backdrop-blur-xl"
          >
            <div className="mx-auto grid max-w-7xl grid-cols-2 lg:grid-cols-4">
              {stats.map((stat, index) => (
                <div
                  key={stat.label}
                  className={cn(
                    'flex items-center gap-4 px-6 py-5 lg:px-8',
                    index < stats.length - 1 && 'border-r border-white/[0.06]'
                  )}
                >
                  <span className="font-motors-display text-xl font-bold text-cyan-400 md:text-2xl">
                    {stat.value}
                  </span>
                  <span className="font-motors text-[10px] font-medium uppercase tracking-[0.15em] text-silver-500">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* ═══ FEATURED VEHICLES — Dark showcase ═══ */}
      <section className="relative bg-carbon-900 px-6 py-24 lg:px-12 lg:py-32 overflow-hidden">
        {/* Decorative accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-cyan-400/[0.03] rounded-full blur-[120px] pointer-events-none" />

        <div className="mx-auto max-w-7xl relative z-10">
          <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center gap-3 mb-4"
              >
                <span className="h-px w-8 bg-cyan-400" />
                <span className="font-motors text-[11px] font-bold uppercase tracking-[0.25em] text-cyan-400">
                  Sélection
                </span>
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="font-motors-display text-3xl font-bold uppercase tracking-tight text-white md:text-4xl lg:text-5xl"
              >
                Véhicules{' '}
                <span className="gradient-text-cyan">en Vedette</span>
              </motion.h2>
            </div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link
                to="/mansour-motors/vehicules"
                className="group inline-flex items-center gap-3 font-motors text-[12px] font-bold uppercase tracking-[0.2em] text-silver-400 transition-all duration-300 hover:text-cyan-400"
              >
                Tout voir
                <div className="flex h-9 w-9 items-center justify-center border border-white/10 transition-all duration-300 group-hover:border-cyan-400/50 group-hover:shadow-[0_0_15px_rgba(0,229,255,0.2)] rounded-sm">
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
                viewport={{ once: true, margin: "-80px" }}
                transition={{ delay: index * 0.12, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link
                  to="/mansour-motors/vehicules/$vehicleId"
                  params={{ vehicleId: vehicle.id }}
                  className="group block h-full"
                >
                  <div className="flex flex-col h-full overflow-hidden border border-white/[0.06] bg-carbon-800 transition-all duration-500 hover:border-cyan-400/20 hover:shadow-[0_0_40px_rgba(0,229,255,0.08)] rounded-sm">
                    <div className="relative aspect-[16/10] overflow-hidden bg-carbon-700">
                      <img
                        src={vehicle.image}
                        alt={`${vehicle.make} ${vehicle.model}`}
                        className="h-full w-full object-cover transition-all duration-700 ease-out group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-carbon-950 via-carbon-950/20 to-transparent opacity-70 group-hover:opacity-80 transition-opacity duration-500" />

                      {/* Hover overlay */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-400 group-hover:opacity-100">
                        <span className="translate-y-3 bg-cyan-400/10 border border-cyan-400/30 px-5 py-2.5 font-motors text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-300 backdrop-blur-md transition-transform duration-400 group-hover:translate-y-0 rounded-sm">
                          Découvrir
                        </span>
                      </div>

                      <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
                        <h3 className="font-motors text-lg font-bold text-white">
                          {vehicle.make}{' '}
                          <span className="text-cyan-400">{vehicle.model}</span>
                        </h3>
                        <p className="mt-1.5 font-motors text-[10px] font-medium uppercase tracking-[0.15em] text-silver-400">
                          {vehicle.year} <span className="text-cyan-400/40 px-1">·</span> {vehicle.transmission} <span className="text-cyan-400/40 px-1">·</span> {vehicle.fuelType}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-1 items-end justify-between p-5 border-t border-white/[0.04]">
                      <div>
                        <p className="font-motors text-[9px] font-bold uppercase tracking-[0.2em] text-silver-600 mb-1">Prix</p>
                        <p className="font-motors text-xl font-bold text-white">
                          {formatPrice(vehicle.price)}
                        </p>
                      </div>
                      <span className="flex h-10 w-10 items-center justify-center border border-white/[0.08] text-silver-500 transition-all duration-400 group-hover:border-cyan-400 group-hover:text-cyan-400 group-hover:shadow-[0_0_15px_rgba(0,229,255,0.2)] rounded-sm">
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

      {/* ═══ SERVICES — Alternating dark/darker ═══ */}
      <section id="services" className="relative bg-carbon-950 px-6 py-24 lg:px-12 lg:py-32 overflow-hidden">
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.015]" style={{
          backgroundImage: 'linear-gradient(rgba(0,229,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.3) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }} />

        <div className="relative mx-auto max-w-7xl z-10">
          <div className="mb-16 text-center flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-4 mb-5"
            >
              <span className="h-px w-10 bg-cyan-400/50" />
              <span className="font-motors text-[11px] font-bold uppercase tracking-[0.25em] text-cyan-400">
                Nos Services
              </span>
              <span className="h-px w-10 bg-cyan-400/50" />
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="font-motors-display text-3xl font-bold uppercase tracking-tight text-white md:text-4xl lg:text-5xl"
            >
              L'Excellence à chaque{' '}
              <span className="gradient-text-cyan">étape</span>
            </motion.h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: index * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="group relative bg-carbon-800/50 border border-white/[0.04] p-8 lg:p-10 transition-all duration-500 hover:border-cyan-400/20 hover:bg-carbon-800 rounded-sm overflow-hidden"
              >
                {/* Cyan glow on hover */}
                <div className="absolute -right-16 -top-16 h-32 w-32 rounded-full bg-cyan-400/0 blur-[40px] transition-all duration-700 group-hover:bg-cyan-400/10 group-hover:scale-200" />

                <div className="mb-8 flex items-start justify-between relative z-10">
                  <div className="flex h-14 w-14 items-center justify-center border border-white/[0.06] bg-carbon-700/50 text-cyan-400 transition-all duration-500 group-hover:border-cyan-400/30 group-hover:shadow-[0_0_20px_rgba(0,229,255,0.15)] rounded-sm">
                    <service.icon className="h-6 w-6" />
                  </div>
                  <div className="text-right">
                    <span className="font-motors-display text-2xl font-bold text-white/10 transition-colors duration-500 group-hover:text-cyan-400/20">
                      {service.stat}
                    </span>
                    <p className="font-motors text-[9px] font-medium uppercase tracking-[0.15em] text-silver-700 transition-colors duration-500 group-hover:text-silver-500">
                      {service.statLabel}
                    </p>
                  </div>
                </div>

                <div className="relative z-10">
                  <h3 className="mb-3 font-motors text-xl font-bold text-white transition-colors duration-500 group-hover:text-cyan-400">
                    {service.title}
                  </h3>
                  <p className="font-motors text-sm leading-relaxed text-silver-500 transition-colors duration-500 group-hover:text-silver-300">
                    {service.description}
                  </p>
                </div>

                {/* Bottom accent line */}
                <div className="mt-8 h-px w-10 bg-white/[0.06] transition-all duration-700 ease-out group-hover:w-full group-hover:bg-cyan-400/40" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CONTACT / SHOWROOM ═══ */}
      <section id="contact" className="relative bg-carbon-900 px-6 py-24 lg:px-12 lg:py-32 overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-400/[0.03] rounded-full blur-[120px] pointer-events-none -translate-y-1/3 translate-x-1/4" />

        <div className="mx-auto max-w-7xl relative z-10">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex items-center gap-3 mb-5">
                <span className="h-px w-8 bg-cyan-400" />
                <span className="font-motors text-[11px] font-bold uppercase tracking-[0.25em] text-cyan-400">
                  Rendez-nous visite
                </span>
              </div>
              <h2 className="mb-6 font-motors-display text-3xl font-bold uppercase tracking-tight text-white md:text-4xl lg:text-5xl">
                Notre{' '}
                <span className="gradient-text-cyan">Showroom</span>
              </h2>
              <p className="mb-10 font-motors text-base font-light leading-relaxed text-silver-400">
                Notre équipe d'experts vous accompagne dans le choix du véhicule parfait.
                Venez découvrir notre showroom et profitez d'un service d'exception.
              </p>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {[
                  { icon: Location01Icon, title: 'Adresse', content: 'Avenue Cheikh Anta Diop\nDakar, Sénégal' },
                  { icon: Clock01Icon, title: 'Horaires', content: 'Lun–Ven: 8h–18h\nSam: 9h–17h' },
                  { icon: TelephoneIcon, title: 'Téléphone', content: '+221 33 123 45 67', href: 'tel:+221331234567' },
                  { icon: Mail01Icon, title: 'Email', content: 'motors@mansour.sn', href: 'mailto:motors@mansour.sn' },
                ].map((item, i) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 + 0.2, duration: 0.6 }}
                    className="flex items-start gap-4 group"
                  >
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center border border-white/[0.06] bg-carbon-800 text-cyan-400/60 transition-all duration-500 group-hover:border-cyan-400/30 group-hover:text-cyan-400 group-hover:shadow-[0_0_15px_rgba(0,229,255,0.15)] rounded-sm">
                      <item.icon className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="mb-1 font-motors text-[10px] font-bold uppercase tracking-[0.2em] text-silver-600 transition-colors group-hover:text-cyan-400">
                        {item.title}
                      </h4>
                      {item.href ? (
                        <a href={item.href} className="font-motors text-sm font-medium text-silver-200 transition-colors hover:text-cyan-400 whitespace-pre-line block">
                          {item.content}
                        </a>
                      ) : (
                        <p className="font-motors text-sm font-medium text-silver-200 whitespace-pre-line">
                          {item.content}
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="relative overflow-hidden group rounded-sm"
            >
              <div className="absolute inset-0 border border-white/[0.06] z-10 pointer-events-none rounded-sm transition-colors duration-500 group-hover:border-cyan-400/20" />
              <div className="aspect-[4/5] md:aspect-[4/3] overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=2070&auto=format&fit=crop"
                  alt="Mansour Motors Showroom"
                  className="h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-carbon-950 via-carbon-950/30 to-transparent opacity-70" />

                {/* Status overlay */}
                <div className="absolute bottom-6 left-6 right-6 z-20 translate-y-3 opacity-0 transition-all duration-600 ease-out group-hover:translate-y-0 group-hover:opacity-100">
                  <div className="inline-flex items-center gap-3 backdrop-blur-xl bg-carbon-950/60 border border-cyan-400/20 px-5 py-2.5 rounded-sm">
                    <div className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(0,229,255,0.6)]" />
                    <span className="font-motors text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-300">Showroom Ouvert</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <MotorsFooter />
    </div>
  )
}
