import { useRef, useState, useEffect } from 'react'
import { Link } from '@tanstack/react-router'
import { motion, useScroll, useTransform } from 'framer-motion'
import {
  ArrowRight01Icon,
  ArrowUpRight01Icon,
  Car01Icon,
  Wrench01Icon,
  CreditCardIcon,
  TelephoneIcon,
  Location01Icon,
  Clock01Icon,
  Mail01Icon,
} from 'hugeicons-react'
import { MotorsNavbar } from '@/components/motors/MotorsNavbar'
import { MotorsFooter } from '@/components/motors/MotorsFooter'
import { publicVehiclesApi, type ApiVehicle } from '@/lib/api'
import { formatPrice, cn } from '@/lib/utils'

const services = [
  {
    icon: Car01Icon,
    title: 'Vente',
    description: 'Véhicules neufs et d\'occasion certifiés. Garantie d\'excellence sur chaque modèle.',
    stat: '200+',
  },
  {
    icon: Wrench01Icon,
    title: 'Après-Vente',
    description: 'Entretien et réparations par techniciens qualifiés. 100+ points de contrôle.',
    stat: '100+',
  },
  {
    icon: CreditCardIcon,
    title: 'Financement',
    description: 'Plans flexibles et partenariats bancaires. Réponse sous 48h garantie.',
    stat: '48h',
  },
  {
    icon: Car01Icon,
    title: 'Location',
    description: 'Courte et longue durée. Véhicules de prestige disponibles 24/7.',
    stat: '24/7',
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
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })

  const heroImageScale = useTransform(scrollYProgress, [0, 1], [1, 1.15])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])
  const heroTextY = useTransform(scrollYProgress, [0, 0.5], [0, 80])

  const [featuredVehicles, setFeaturedVehicles] = useState<ApiVehicle[]>([])

  useEffect(() => {
    publicVehiclesApi.list({ limit: 5, status: 'available' })
      .then((res) => setFeaturedVehicles(res.data))
      .catch(console.error)
  }, [])

  return (
    <div ref={containerRef} className="motors-theme font-motors">
      <MotorsNavbar />

      {/* ══════════════════════════════════════════════════════════
          HERO — Full-viewport cinematic with parallax image (DARK)
      ══════════════════════════════════════════════════════════ */}
      <section ref={heroRef} className="relative h-screen w-full overflow-hidden bg-carbon-950">
        {/* Background Video */}
        <motion.div style={{ scale: heroImageScale }} className="absolute inset-0">
          <div className="absolute inset-0 overflow-hidden">
            <iframe
              className="absolute top-1/2 left-1/2 w-[300%] h-[300%] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              src="https://www.youtube.com/embed/DfBrE9E1DCk?autoplay=1&mute=1&loop=1&playlist=DfBrE9E1DCk&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1"
              title="Mansour Motors Background"
              allow="autoplay; encrypted-media"
              style={{ border: 'none' }}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-carbon-950 via-carbon-950/80 to-carbon-950/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-carbon-950 via-transparent to-carbon-950/30" />
        </motion.div>

        {/* Hero Content */}
        <motion.div
          style={{ opacity: heroOpacity, y: heroTextY }}
          className="relative z-10 flex h-full flex-col justify-end px-6 pb-20 lg:px-16 lg:pb-28"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="mb-6 flex items-center gap-4">
              <span className="h-px w-12 bg-gold-400" />
              <span className="font-motors text-[11px] font-medium uppercase tracking-[0.3em] text-gold-400">
                Dakar, Sénégal
              </span>
            </div>

            <h1 className="max-w-4xl font-motors-display text-[2.2rem] uppercase leading-[0.95] tracking-[0.04em] text-white sm:text-[3rem] md:text-[4.5rem] lg:text-[6rem]">
              <span className="block">Performance</span>
              <span className="block text-silver-400">Redéfinie</span>
            </h1>

            <p className="mt-6 max-w-lg font-motors text-base font-light leading-relaxed text-silver-400 md:text-lg">
              Concessionnaire premium. Véhicules d'exception.
              Standards sans compromis.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                to="/mansour-motors/vehicules"
                className="group inline-flex items-center justify-center gap-3 bg-gold-400 px-8 py-4 font-motors text-[12px] font-bold uppercase tracking-[0.2em] text-noir-950 transition-all duration-300 hover:bg-gold-300 hover:shadow-gold"
              >
                Explorer le Catalogue
                <ArrowRight01Icon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <a
                href="#contact"
                className="group inline-flex items-center justify-center gap-3 border border-white/15 bg-white/5 px-8 py-4 font-motors text-[12px] font-bold uppercase tracking-[0.2em] text-silver-200 backdrop-blur-sm transition-all duration-300 hover:border-white/30 hover:bg-white/10"
              >
                Showroom
              </a>
            </div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-8 right-6 flex flex-col items-center gap-3 lg:right-16"
          >
            <span className="font-motors text-[9px] uppercase tracking-[0.3em] text-silver-500 [writing-mode:vertical-lr]">
              Scroll
            </span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="h-8 w-px bg-gradient-to-b from-gold-400 to-transparent"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          STATS — Light section with large numbers
      ══════════════════════════════════════════════════════════ */}
      <section className="relative border-y border-noir-100 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: index * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className={cn(
                'group flex flex-col items-center justify-center px-6 py-14 text-center transition-colors duration-500 hover:bg-gold-50/50',
                index < stats.length - 1 && 'border-r border-noir-100'
              )}
            >
              <span className="font-motors-display text-3xl text-noir-950 md:text-4xl lg:text-5xl transition-transform duration-500 group-hover:scale-110">
                {stat.value}
              </span>
              <span className="mt-3 font-motors text-[10px] font-medium uppercase tracking-[0.25em] text-noir-400 transition-colors duration-300 group-hover:text-gold-600">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          FEATURED VEHICLES — Dark section, horizontal scroll gallery
      ══════════════════════════════════════════════════════════ */}
      <section className="relative bg-carbon-950 py-24 lg:py-32 overflow-hidden">
        <div className="px-6 lg:px-16">
          <div className="mx-auto max-w-7xl mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <motion.span
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="mb-4 block font-motors text-[10px] font-medium uppercase tracking-[0.3em] text-gold-400"
              >
                Sélection
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="font-motors-display text-3xl uppercase tracking-[0.04em] text-white md:text-4xl lg:text-5xl"
              >
                Véhicules <span className="text-silver-500">en vedette</span>
              </motion.h2>
            </div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Link
                to="/mansour-motors/vehicules"
                className="group inline-flex items-center gap-3 font-motors text-[11px] font-bold uppercase tracking-[0.2em] text-silver-400 transition-all duration-300 hover:text-white"
              >
                Tout voir
                <span className="flex h-9 w-9 items-center justify-center border border-white/10 transition-all duration-300 group-hover:border-gold-400 group-hover:bg-gold-400 group-hover:text-noir-950">
                  <ArrowUpRight01Icon className="h-3.5 w-3.5" />
                </span>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Horizontal Scroll Track */}
        <div className="relative">
          <div className="flex gap-5 overflow-x-auto pl-6 pr-12 pb-4 motors-scroll-track snap-x snap-mandatory lg:pl-16 lg:pr-24">
            {featuredVehicles.map((vehicle, index) => (
              <motion.div
                key={vehicle.id}
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="group w-[320px] flex-shrink-0 snap-start md:w-[400px] lg:w-[440px]"
              >
                <Link
                  to="/mansour-motors/vehicules/$vehicleId"
                  params={{ vehicleId: vehicle.id }}
                  className="block"
                >
                  <div className="relative overflow-hidden bg-carbon-900 border border-white/[0.06] transition-all duration-500 hover:border-gold-400/30">
                    <div className="relative aspect-[16/10] overflow-hidden">
                      {vehicle.images?.[0] ? (
                        <img
                          src={vehicle.images[0]}
                          alt={`${vehicle.make} ${vehicle.model}`}
                          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                      ) : (
                        <div className="h-full w-full bg-carbon-800 flex items-center justify-center">
                          <Car01Icon className="h-12 w-12 text-silver-700" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-carbon-950 via-carbon-950/30 to-transparent" />
                      <div className="absolute bottom-4 left-5 right-5 z-10">
                        <h3 className="font-motors text-lg font-bold text-white">
                          {vehicle.make}{' '}
                          <span className="text-silver-400">{vehicle.model}</span>
                        </h3>
                        <p className="mt-1 font-motors text-[10px] font-medium uppercase tracking-[0.15em] text-silver-500">
                          {vehicle.year} · {vehicle.transmission === 'automatic' ? 'Automatique' : vehicle.transmission === 'manual' ? 'Manuelle' : 'CVT'} · {vehicle.fuelType === 'diesel' ? 'Diesel' : vehicle.fuelType === 'gasoline' ? 'Essence' : vehicle.fuelType === 'hybrid' ? 'Hybride' : 'Électrique'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between px-5 py-4">
                      <p className="font-motors text-lg font-bold text-white">
                        {formatPrice(vehicle.price)}
                      </p>
                      <span className="flex h-8 w-8 items-center justify-center border border-white/10 text-silver-500 transition-all duration-300 group-hover:border-gold-400 group-hover:bg-gold-400 group-hover:text-noir-950">
                        <ArrowRight01Icon className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-rotate-45" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Fade edges */}
          <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-carbon-950 to-transparent" />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          SERVICES — Light section with gold accents
      ══════════════════════════════════════════════════════════ */}
      <section id="services" className="relative bg-surface-dim px-6 py-24 lg:px-16 lg:py-32 page-grain">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <motion.span
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="mb-4 block font-motors text-[10px] font-medium uppercase tracking-[0.3em] text-gold-600"
              >
                Expertise
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="font-motors-display text-3xl uppercase tracking-[0.04em] text-noir-950 md:text-4xl lg:text-5xl"
              >
                Nos <span className="text-noir-400">Services</span>
              </motion.h2>
            </div>
          </div>

          <div className="grid gap-px bg-noir-100 md:grid-cols-2">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="group relative bg-white p-8 transition-all duration-500 hover:bg-gold-50/50 lg:p-12"
              >
                <div className="mb-8 flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center border border-noir-100 text-noir-400 transition-all duration-500 group-hover:border-gold-400/60 group-hover:text-gold-600">
                    <service.icon className="h-5 w-5" />
                  </div>
                  <span className="font-motors-display text-2xl text-noir-100 transition-colors duration-500 group-hover:text-gold-400/30">
                    {service.stat}
                  </span>
                </div>
                <h3 className="mb-3 font-motors text-xl font-bold text-noir-950 transition-colors duration-500 group-hover:text-gold-700">
                  {service.title}
                </h3>
                <p className="font-motors text-sm font-light leading-relaxed text-noir-500 transition-colors duration-500 group-hover:text-noir-600">
                  {service.description}
                </p>
                <div className="mt-6 h-px w-8 bg-noir-100 transition-all duration-700 ease-out group-hover:w-16 group-hover:bg-gold-400" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          SHOWROOM / CONTACT — Dark split screen
      ══════════════════════════════════════════════════════════ */}
      <section id="contact" className="relative bg-carbon-950 overflow-hidden">
        <div className="grid lg:grid-cols-2 min-h-[700px]">
          {/* Left: Image */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="relative overflow-hidden group"
          >
            <img
              src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=2070&auto=format&fit=crop"
              alt="Mansour Motors Showroom"
              className="h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105 min-h-[400px] lg:min-h-full"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-carbon-950/20 via-transparent to-carbon-950 lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-carbon-950" />
            <div className="absolute inset-0 bg-gradient-to-t from-carbon-950 via-transparent to-transparent lg:hidden" />
          </motion.div>

          {/* Right: Contact Info */}
          <div className="relative flex items-center px-6 py-16 lg:px-16 lg:py-24">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="w-full max-w-lg"
            >
              <span className="mb-4 block font-motors text-[10px] font-medium uppercase tracking-[0.3em] text-gold-400">
                Rendez-nous visite
              </span>
              <h2 className="mb-4 font-motors-display text-3xl uppercase tracking-[0.04em] text-white md:text-4xl">
                Showroom
              </h2>
              <p className="mb-12 font-motors text-base font-light leading-relaxed text-silver-500">
                Notre équipe est à votre disposition pour vous accompagner
                dans le choix du véhicule parfait.
              </p>

              <div className="space-y-8">
                {[
                  { icon: Location01Icon, title: 'Adresse', content: 'Avenue Cheikh Anta Diop, Dakar, Sénégal' },
                  { icon: Clock01Icon, title: 'Horaires', content: 'Lun–Ven: 8h–18h · Sam: 9h–17h' },
                  { icon: TelephoneIcon, title: 'Téléphone', content: '+221 33 123 45 67', href: 'tel:+221331234567' },
                  { icon: Mail01Icon, title: 'Email', content: 'motors@mansour.sn', href: 'mailto:motors@mansour.sn' },
                ].map((item, i) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 + 0.4, duration: 0.6 }}
                    className="group flex items-start gap-4"
                  >
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center border border-white/[0.08] text-silver-500 transition-all duration-500 group-hover:border-gold-400/40 group-hover:text-gold-400">
                      <item.icon className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="mb-1 font-motors text-[10px] font-medium uppercase tracking-[0.2em] text-silver-600 transition-colors group-hover:text-gold-400">
                        {item.title}
                      </h4>
                      {item.href ? (
                        <a href={item.href} className="font-motors text-sm font-medium text-silver-200 transition-colors hover:text-white">
                          {item.content}
                        </a>
                      ) : (
                        <p className="font-motors text-sm font-medium text-silver-200">{item.content}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* CTA */}
              <div className="mt-12 flex flex-col gap-3 sm:flex-row">
                <a
                  href="tel:+221331234567"
                  className="group inline-flex items-center justify-center gap-3 bg-gold-400 px-6 py-3.5 font-motors text-[11px] font-bold uppercase tracking-[0.2em] text-noir-950 transition-all duration-300 hover:bg-gold-300 hover:shadow-gold-sm"
                >
                  <TelephoneIcon className="h-3.5 w-3.5" />
                  Appeler
                </a>
                <a
                  href="mailto:motors@mansour.sn"
                  className="inline-flex items-center justify-center gap-3 border border-white/10 px-6 py-3.5 font-motors text-[11px] font-bold uppercase tracking-[0.2em] text-silver-300 transition-all duration-300 hover:border-white/25 hover:text-white"
                >
                  Envoyer un Email
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <MotorsFooter />
    </div>
  )
}
