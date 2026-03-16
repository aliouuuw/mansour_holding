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
    <div ref={containerRef} className="relative bg-noir-950 selection:bg-gold-400 selection:text-noir-950">
      <PublicNavbar />

      {/* Hero Section */}
      <motion.section
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 pt-32 pb-24 lg:px-12 noise-overlay"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gold-400/10 via-noir-950 to-noir-950" />
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-gold-400/5 rounded-full blur-[120px] animate-pulse-glow" style={{ animationDuration: '8s' }} />
        
        <div className="relative z-10 max-w-6xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8 inline-flex items-center gap-2 rounded-none border border-gold-400/20 bg-gold-400/5 px-6 py-2 backdrop-blur-md"
          >
            <Sparkle className="h-4 w-4 text-gold-400 animate-pulse" weight="fill" />
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-gold-400">
              Mansour Motors
            </span>
          </motion.div>

          <h1 className="mb-10 font-sans text-5xl font-extrabold uppercase leading-[1.1] tracking-tight text-white md:text-[6rem] lg:text-[7.5rem]">
            <RevealText delay={0.3} className="mr-4">L'Excellence</RevealText>
            <RevealText delay={0.4}>Automobile</RevealText>
            <br />
            <span className="font-serif italic gold-gradient-text normal-case tracking-normal block mt-4">
              <RevealText delay={0.5}>à Dakar</RevealText>
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mx-auto mb-14 max-w-2xl text-xl font-light leading-relaxed text-silver-200"
          >
            Concessionnaire automobile premium offrant une sélection exclusive de véhicules
            neufs et d'occasion certifiés, accompagnée de services de financement et
            d'entretien de <span className="font-medium text-white border-b border-gold-400/50 pb-1">qualité supérieure</span>.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="flex flex-col items-center justify-center gap-6 sm:flex-row"
          >
            <Link
              to="/mansour-motors/vehicules"
              className="group relative overflow-hidden inline-flex items-center gap-3 bg-gold-400 px-10 py-5 text-sm font-bold uppercase tracking-widest text-noir-950 transition-all hover:bg-gold-300 hover-gold-glow"
            >
              <span className="relative z-10 flex items-center gap-3">
                Voir le Catalogue
                <ArrowRight className="transition-transform duration-300 group-hover:translate-x-2" weight="bold" />
              </span>
            </Link>
            <a
              href="#contact"
              className="group inline-flex items-center gap-3 border border-white/20 bg-white/5 px-10 py-5 text-sm font-bold uppercase tracking-widest text-white transition-all hover:bg-white/10 hover:border-gold-400/50"
            >
              Nous Contacter
            </a>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-noir-950 via-noir-950/80 to-transparent pointer-events-none" />
      </motion.section>

      {/* Featured Vehicles Section */}
      <section className="relative px-6 py-32 lg:px-12 bg-noir-950">
        <div className="absolute top-0 right-0 w-[50vw] h-[1px] bg-gradient-to-l from-gold-400/20 to-transparent" />
        
        <div className="mx-auto max-w-7xl">
          <div className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex items-center gap-4 mb-6"
              >
                <span className="h-px w-8 bg-gold-400" />
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-gold-400">Sélection Exclusive</span>
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="font-serif text-5xl italic tracking-tight text-white md:text-7xl"
              >
                Véhicules en Vedette
              </motion.h2>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Link
                to="/mansour-motors/vehicules"
                className="group inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.15em] text-white hover-trigger"
              >
                <span className="border-b border-white/30 pb-1 group-hover:border-gold-400 transition-colors">Tous les Véhicules</span>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 border border-white/10 transition-all group-hover:bg-gold-400 group-hover:border-gold-400 group-hover:text-noir-950">
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" weight="bold" />
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
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.7, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link
                  to="/mansour-motors/vehicules/$vehicleId"
                  params={{ vehicleId: vehicle.id }}
                  className="group block"
                >
                  <div className="relative overflow-hidden bg-noir-900 border border-white/5 hover:border-gold-400/30 transition-colors duration-500">
                    <div className="aspect-[4/3] overflow-hidden relative">
                      <img
                        src={vehicle.image}
                        alt={`${vehicle.make} ${vehicle.model}`}
                        className="h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-noir-950/20 transition-opacity duration-500 group-hover:opacity-0" />
                      
                      {/* Availability badge */}
                      <div className="absolute top-4 right-4 bg-noir-950/80 backdrop-blur-md px-3 py-1.5 border border-white/10 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-white">Disponible</span>
                      </div>
                    </div>
                    
                    <div className="p-8 relative">
                      <div className="absolute top-0 right-8 transform -translate-y-1/2 bg-gold-400 text-noir-950 p-3 rounded-full opacity-0 translate-y-4 transition-all duration-500 group-hover:opacity-100 group-hover:-translate-y-1/2 shadow-lg">
                        <ArrowUpRight size={20} weight="bold" />
                      </div>
                      
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-xs font-bold uppercase tracking-widest text-silver-400">{vehicle.year}</span>
                        <span className="w-1 h-1 rounded-full bg-white/20" />
                        <span className="text-xs font-bold uppercase tracking-widest text-silver-400">{vehicle.transmission}</span>
                      </div>
                      
                      <h3 className="mb-6 font-serif text-3xl italic text-white">
                        {vehicle.make}{' '}
                        <span className="font-sans font-bold not-italic text-gold-400 block mt-1">
                          {vehicle.model}
                        </span>
                      </h3>
                      
                      <div className="flex items-end justify-between border-t border-white/10 pt-6">
                        <p className="text-sm font-bold uppercase tracking-widest text-silver-500">Prix</p>
                        <p className="text-2xl font-bold text-white tracking-tight">
                          {formatPrice(vehicle.price)}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="relative bg-noir-900 px-6 py-32 lg:px-12">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] mix-blend-overlay pointer-events-none" />
        <div className="mx-auto max-w-7xl relative z-10">
          <div className="mb-20">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col items-center text-center"
            >
              <div className="flex items-center gap-4 mb-6">
                <span className="h-px w-8 bg-gold-400" />
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-gold-400">Expertise</span>
                <span className="h-px w-8 bg-gold-400" />
              </div>
              <h2 className="mb-6 font-sans text-4xl font-extrabold uppercase tracking-tight text-white md:text-6xl">
                Nos Services
              </h2>
              <p className="max-w-2xl text-lg text-silver-300 font-light leading-relaxed">
                Une approche globale pour répondre à l'ensemble de vos exigences automobiles avec <span className="text-white font-medium">précision et raffinement</span>.
              </p>
            </motion.div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="group relative overflow-hidden bg-noir-950 p-10 transition-all duration-500 hover:-translate-y-2 border border-white/5 hover:border-gold-400/30"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gold-400/5 rounded-full blur-[50px] transition-opacity duration-500 opacity-0 group-hover:opacity-100 pointer-events-none" />
                
                <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-sm bg-white/5 border border-white/10 text-gold-400 transition-colors duration-500 group-hover:bg-gold-400/10 group-hover:text-gold-300">
                  <service.icon className="h-8 w-8" weight="duotone" />
                </div>
                
                <h3 className="mb-4 text-xl font-bold text-white tracking-wide">{service.title}</h3>
                <p className="text-sm leading-relaxed text-silver-400 font-light group-hover:text-silver-300 transition-colors duration-500">
                  {service.description}
                </p>
                
                <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-gold-400 to-gold-600 transition-all duration-500 ease-out group-hover:w-full" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact/Showroom Section */}
      <section id="contact" className="relative px-6 py-32 lg:px-12 bg-noir-950 overflow-hidden">
        <div className="absolute right-0 top-0 w-1/2 h-full bg-gold-400/5 rounded-l-full blur-[150px] pointer-events-none" />
        
        <div className="mx-auto max-w-7xl relative z-10">
          <div className="grid gap-16 lg:grid-cols-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-5"
            >
              <div className="flex items-center gap-4 mb-6">
                <span className="h-px w-8 bg-gold-400" />
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-gold-400">Rencontre</span>
              </div>
              
              <h2 className="mb-8 font-sans text-5xl font-extrabold uppercase tracking-tight text-white md:text-[4rem] leading-[0.9]">
                Visitez<br />
                Notre <span className="font-serif italic gold-gradient-text normal-case tracking-normal">Showroom</span>
              </h2>
              
              <p className="mb-12 text-lg leading-relaxed text-silver-300 font-light">
                Notre équipe d'experts est à votre disposition pour vous accompagner dans le
                choix du véhicule parfait. Venez découvrir notre espace d'exposition et profitez d'un
                <span className="text-white font-medium"> service véritablement personnalisé</span>.
              </p>

              <div className="space-y-8">
                <div className="group flex items-start gap-6 border-b border-white/10 pb-6 transition-colors hover:border-gold-400/30">
                  <div className="mt-1 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-white/5 border border-white/10 text-gold-400 transition-colors group-hover:bg-gold-400 group-hover:text-noir-950">
                    <MapPin className="h-5 w-5" weight="fill" />
                  </div>
                  <div>
                    <h4 className="mb-2 font-bold uppercase tracking-widest text-xs text-white">Adresse</h4>
                    <p className="text-silver-300 font-light leading-relaxed">
                      Avenue Cheikh Anta Diop<br />
                      Dakar, Sénégal
                    </p>
                  </div>
                </div>

                <div className="group flex items-start gap-6 border-b border-white/10 pb-6 transition-colors hover:border-gold-400/30">
                  <div className="mt-1 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-white/5 border border-white/10 text-gold-400 transition-colors group-hover:bg-gold-400 group-hover:text-noir-950">
                    <Clock className="h-5 w-5" weight="fill" />
                  </div>
                  <div>
                    <h4 className="mb-2 font-bold uppercase tracking-widest text-xs text-white">Horaires d'Ouverture</h4>
                    <p className="text-silver-300 font-light leading-relaxed">
                      Lundi - Vendredi: <span className="text-white">8h00 - 18h00</span><br />
                      Samedi: <span className="text-white">9h00 - 17h00</span><br />
                      Dimanche: Fermé
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4">
                  <a href="tel:+221331234567" className="group flex items-center gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-white/5 border border-white/10 text-gold-400 transition-transform duration-300 group-hover:scale-110">
                      <Phone className="h-4 w-4" weight="fill" />
                    </div>
                    <div>
                      <h4 className="font-bold uppercase tracking-widest text-[10px] text-silver-500 mb-1">Téléphone</h4>
                      <p className="text-white font-medium group-hover:text-gold-400 transition-colors">+221 33 123 45 67</p>
                    </div>
                  </a>

                  <a href="mailto:motors@mansour.sn" className="group flex items-center gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-white/5 border border-white/10 text-gold-400 transition-transform duration-300 group-hover:scale-110">
                      <Envelope className="h-4 w-4" weight="fill" />
                    </div>
                    <div>
                      <h4 className="font-bold uppercase tracking-widest text-[10px] text-silver-500 mb-1">Email</h4>
                      <p className="text-white font-medium group-hover:text-gold-400 transition-colors">motors@mansour.sn</p>
                    </div>
                  </a>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
              whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-7 relative"
            >
              <div className="absolute -inset-4 border border-gold-400/20 rounded-sm pointer-events-none transform translate-x-4 translate-y-4" />
              <div className="relative overflow-hidden rounded-sm group">
                <div className="aspect-[4/5] md:aspect-square lg:aspect-[4/5] bg-noir-900">
                  <img
                    src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=2070&auto=format&fit=crop"
                    alt="Mansour Motors Showroom"
                    className="h-full w-full object-cover opacity-80 transition-transform duration-1000 ease-out group-hover:scale-105 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-noir-950 via-noir-950/20 to-transparent opacity-60" />
                </div>
                
                <div className="absolute bottom-8 right-8 bg-noir-950 p-6 border border-white/10 max-w-xs backdrop-blur-sm shadow-2xl">
                  <p className="text-sm font-light text-silver-200 italic font-serif leading-relaxed">
                    "Un espace conçu pour sublimer chaque courbe, chaque détail de nos véhicules d'exception."
                  </p>
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
