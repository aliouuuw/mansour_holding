import { useRef, useEffect } from 'react'
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
import Lenis from 'lenis'
import { PublicNavbar } from '@/components/public/PublicNavbar'
import { PublicFooter } from '@/components/public/PublicFooter'
import { vehicles } from '@/data/mock'
import { formatPrice, cn } from '@/lib/utils'
import { scrollToTopOnMount } from '@/lib/scroll'

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

  useEffect(() => {
    scrollToTopOnMount(50)
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
    <div ref={containerRef} className="relative bg-surface-dim page-grain">
      <PublicNavbar />

      {/* Hero Section — Cinematic with Background Video */}
      <motion.section
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative h-screen w-full overflow-hidden"
      >
        {/* Background Video */}
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
          <div className="absolute inset-0 bg-gradient-to-t from-noir-950 via-noir-950/60 to-noir-950/20" />
          <div className="absolute inset-0 bg-noir-950/30" />
        </motion.div>

        <div className="relative z-10 flex h-screen flex-col justify-between px-6 pb-12 pt-32 lg:px-12">
          <div className="max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="mb-8 flex items-center gap-4"
            >
              <span className="h-px w-16 bg-gradient-to-r from-gold-400 to-transparent" />
              <span className="text-xs font-black uppercase tracking-[0.3em] text-gold-400">
                Mansour Motors — Dakar
              </span>
            </motion.div>

            <h1 className="max-w-5xl font-sans text-[2.5rem] font-black uppercase leading-[0.88] tracking-[-0.03em] text-white sm:text-[3.5rem] md:text-[5.8rem] lg:text-[8rem] pb-4">
              <RevealText delay={0.1} className="block text-white">L'Excellence</RevealText>
              <RevealText delay={0.2} className="block">Automobile</RevealText>
              <RevealText delay={0.3} className="block font-serif italic lowercase text-gold-400 normal-case text-[0.85em]">
                à Dakar
              </RevealText>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="mb-8 max-w-2xl text-lg font-light leading-relaxed text-white/80 md:text-xl"
            >
              Concessionnaire automobile premium offrant une sélection exclusive de véhicules
              neufs et d'occasion certifiés, accompagnée de services de financement et
              d'entretien de qualité supérieure.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col gap-5 sm:flex-row"
            >
              <Link
                to="/mansour-motors/vehicules"
                className="group relative inline-flex items-center justify-center gap-3 overflow-hidden bg-gold-400 px-8 py-4 text-[13px] font-black uppercase tracking-[0.2em] text-noir-950 transition-all hover:bg-gold-300 hover:shadow-lg hover:shadow-gold-400/20"
              >
                <span className="relative z-10 flex items-center gap-3">
                  Voir le Catalogue
                  <ArrowRight01Icon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Link>
              <a
                href="#contact"
                className="group inline-flex items-center justify-center gap-3 border border-white/20 bg-white/5 px-8 py-4 text-[13px] font-bold uppercase tracking-[0.2em] text-white backdrop-blur-sm transition-all hover:border-white/50 hover:bg-white/10"
              >
                Nous Contacter
              </a>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Stats Strip */}
      <section className="relative border-y border-gold-200/30 bg-gradient-to-b from-gold-50 to-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay"></div>
        <div className="mx-auto grid max-w-7xl grid-cols-2 lg:grid-cols-4 relative z-10">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className={cn(
                'group flex flex-col items-center justify-center px-6 py-12 text-center lg:py-16 transition-colors duration-500 hover:bg-gold-100/50',
                index < stats.length - 1 && 'border-r border-gold-200/50'
              )}
            >
              <span className="font-serif text-4xl italic text-transparent bg-clip-text bg-gradient-to-br from-gold-600 to-gold-400 md:text-5xl lg:text-6xl transition-transform duration-500 group-hover:scale-110 group-hover:-translate-y-1">
                {stat.value}
              </span>
              <span className="mt-3 text-[11px] font-black uppercase tracking-[0.2em] text-noir-400 transition-colors duration-300 group-hover:text-gold-800">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Vehicles Section */}
      <section className="relative bg-surface-dim px-6 py-24 lg:px-12 lg:py-32 overflow-hidden">
        {/* Decorative background blur */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] bg-gold-400/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="mx-auto max-w-7xl relative z-10">
          <div className="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center gap-3 mb-4"
              >
                <span className="h-px w-8 bg-gold-500" />
                <span className="block text-[11px] font-black uppercase tracking-[0.25em] text-gold-600">
                  Sélection Premium
                </span>
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="font-serif text-5xl italic text-noir-950 md:text-6xl lg:text-7xl"
              >
                Véhicules <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-600 to-gold-400 not-italic font-sans font-black uppercase text-[0.7em] tracking-tighter">en Vedette</span>
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
                className="group inline-flex items-center gap-3 text-[13px] font-black uppercase tracking-[0.2em] text-noir-950 transition-all duration-300 hover:text-gold-600"
              >
                Tout voir
                <div className="relative flex h-10 w-10 items-center justify-center rounded-full border border-noir-200 bg-white transition-all duration-300 group-hover:border-gold-400 group-hover:bg-gold-50 group-hover:scale-110">
                  <ArrowUpRight01Icon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </Link>
            </motion.div>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
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
                  <div className="flex flex-col h-full overflow-hidden border border-noir-100 bg-white shadow-sm transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 hover:border-gold-300/50 rounded-sm">
                    <div className="relative aspect-[4/3] overflow-hidden bg-noir-100">
                      <img
                        src={vehicle.image}
                        alt={`${vehicle.make} ${vehicle.model}`}
                        className="h-full w-full object-cover transition-all duration-1000 ease-out group-hover:scale-110 group-hover:rotate-1"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-noir-950/90 via-noir-950/20 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-90" />
                      
                      {/* Delightful Hover Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 bg-noir-950/20 backdrop-blur-[2px] transition-all duration-500 group-hover:opacity-100">
                        <span className="translate-y-4 rounded-full bg-white/10 px-6 py-3 text-xs font-bold uppercase tracking-widest text-white backdrop-blur-md transition-transform duration-500 group-hover:translate-y-0 border border-white/20">
                          Découvrir
                        </span>
                      </div>

                      <div className="absolute bottom-0 left-0 right-0 p-6 transform transition-transform duration-500 group-hover:-translate-y-2 z-10">
                        <h3 className="font-serif text-2xl italic text-white drop-shadow-md">
                          {vehicle.make}{' '}
                          <span className="font-sans font-black not-italic text-gold-300 transition-colors duration-300 group-hover:text-gold-400">
                            {vehicle.model}
                          </span>
                        </h3>
                        <p className="mt-2 text-xs font-bold uppercase tracking-[0.2em] text-white/80">
                          {vehicle.year} <span className="text-gold-500 px-1">•</span> {vehicle.transmission} <span className="text-gold-500 px-1">•</span> {vehicle.fuelType}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-1 items-end justify-between p-6 bg-white relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-gold-50/0 via-gold-50/40 to-gold-50/0 translate-x-[-100%] transition-transform duration-1000 ease-out group-hover:translate-x-[100%]" />
                      <div className="relative z-10">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-noir-400 mb-1">Prix à partir de</p>
                        <p className="text-2xl font-black text-noir-950">
                          {formatPrice(vehicle.price)}
                        </p>
                      </div>
                      <span className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-surface-dim text-noir-400 transition-all duration-500 group-hover:bg-gold-400 group-hover:text-noir-950 group-hover:shadow-[0_0_20px_rgba(207,181,59,0.4)]">
                        <ArrowRight01Icon className="h-5 w-5 transition-transform duration-300 group-hover:-rotate-45" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="relative bg-white px-6 py-24 lg:px-12 lg:py-32 overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gold-50 rounded-full blur-[150px] pointer-events-none -translate-y-1/2 translate-x-1/3" />
        
        <div className="relative mx-auto max-w-7xl z-10">
          <div className="mb-20 text-center flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-3 mb-6"
            >
              <span className="h-px w-12 bg-gold-500" />
              <span className="block text-[11px] font-black uppercase tracking-[0.25em] text-gold-600">
                Ce que nous offrons
              </span>
              <span className="h-px w-12 bg-gold-500" />
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-2xl font-serif text-5xl italic text-noir-950 md:text-6xl"
            >
              Nos <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-600 to-gold-400 not-italic font-sans font-black uppercase text-[0.7em] tracking-tighter">Services Exclusifs</span>
            </motion.h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 relative">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: index * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="group relative bg-white p-10 transition-all duration-500 hover:bg-noir-950 hover:shadow-2xl lg:p-14 hover:-translate-y-2 rounded-sm border border-noir-100 hover:border-noir-900 overflow-hidden"
              >
                <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gold-400/10 blur-[30px] transition-all duration-500 group-hover:bg-gold-400/20 group-hover:scale-150" />
                
                <div className="mb-10 flex items-start justify-between relative z-10">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gold-50 text-gold-600 transition-all duration-500 group-hover:bg-gold-500/10 group-hover:text-gold-400 group-hover:-rotate-6 group-hover:scale-110">
                    <service.icon className="h-8 w-8" />
                  </div>
                  <span className="font-serif text-3xl italic text-noir-200 transition-colors duration-500 group-hover:text-white/20">
                    {service.stat}
                  </span>
                </div>
                <div className="relative z-10">
                  <h3 className="mb-4 text-2xl font-black text-noir-950 transition-colors duration-500 group-hover:text-white">
                    {service.title}
                  </h3>
                  <p className="text-base leading-relaxed text-noir-500 transition-colors duration-500 group-hover:text-white/70">
                    {service.description}
                  </p>
                </div>
                <div className="mt-8 h-1 w-12 bg-gold-200 transition-all duration-700 ease-out group-hover:w-full group-hover:bg-gold-500 rounded-full" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact/Showroom Section */}
      <section id="contact" className="relative bg-noir-950 px-6 py-24 lg:px-12 lg:py-32 overflow-hidden text-white">
        {/* Dark theme background elements */}
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 mix-blend-overlay"></div>
        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gold-900/20 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/4" />

        <div className="mx-auto max-w-7xl relative z-10">
          <div className="grid gap-16 lg:grid-cols-2 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="h-px w-8 bg-gold-500" />
                <span className="block text-[11px] font-black uppercase tracking-[0.25em] text-gold-500">
                  Rendez-nous visite
                </span>
              </div>
              <h2 className="mb-8 font-serif text-5xl italic text-white md:text-6xl lg:text-7xl">
                Notre <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-400 to-gold-600 not-italic font-sans font-black uppercase text-[0.7em] tracking-tighter">Showroom</span>
              </h2>
              <p className="mb-12 text-lg font-light leading-relaxed text-white/70">
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
                    className="flex items-start gap-5 group"
                  >
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-white/5 text-gold-400 transition-all duration-500 group-hover:bg-gold-400 group-hover:text-noir-950 group-hover:scale-110 border border-white/10 group-hover:border-gold-400">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="mb-1.5 text-[11px] font-black uppercase tracking-[0.2em] text-white/50 transition-colors group-hover:text-gold-400">{item.title}</h4>
                      {item.href ? (
                        <a href={item.href} className="text-sm font-medium text-white transition-colors hover:text-gold-400 whitespace-pre-line block">{item.content}</a>
                      ) : (
                        <p className="text-sm font-medium text-white whitespace-pre-line">{item.content}</p>
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
              className="relative overflow-hidden rounded-sm shadow-2xl group"
            >
              <div className="absolute inset-0 border border-white/10 z-10 pointer-events-none rounded-sm" />
              <div className="aspect-[4/5] md:aspect-[4/3] overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=2070&auto=format&fit=crop"
                  alt="Mansour Motors Showroom"
                  className="h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-noir-950 via-transparent to-transparent opacity-80" />
                
                {/* Delight Overlay on Image */}
                <div className="absolute bottom-8 left-8 right-8 z-20 translate-y-4 opacity-0 transition-all duration-700 ease-out group-hover:translate-y-0 group-hover:opacity-100">
                  <div className="inline-flex items-center gap-3 backdrop-blur-md bg-white/10 border border-white/20 px-6 py-3 rounded-full">
                    <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-widest text-white">Showroom Ouvert</span>
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
