import { Link, useParams } from '@tanstack/react-router'
import {
  ArrowLeft,
  CalendarBlank,
  GasPump,
  Gauge,
  Palette,
  Hash,
  SteeringWheel,
  Phone,
  Envelope,
  WhatsappLogo,
  ArrowUpRight,
} from '@phosphor-icons/react'
import { vehicles } from '@/data/mock'
import { formatPrice, formatNumber, cn } from '@/lib/utils'
import { PublicNavbar } from '@/components/public/PublicNavbar'
import { PublicFooter } from '@/components/public/PublicFooter'
import { motion } from 'framer-motion'

export function PublicVehicleDetail() {
  const { vehicleId } = useParams({ strict: false })
  const vehicle = vehicles.find((v) => v.id === vehicleId)

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-noir-950 font-sans text-silver-200 selection:bg-gold-400 selection:text-noir-950 flex flex-col noise-overlay">
        <PublicNavbar />
        <div className="flex flex-1 flex-col items-center justify-center">
          <p className="text-3xl font-serif italic text-white">Véhicule non trouvé</p>
          <Link
            to="/vehicules"
            className="mt-8 text-xs font-bold uppercase tracking-[0.2em] text-gold-400 hover:text-white transition-colors border-b border-gold-400/30 pb-1"
          >
            Retour au portfolio
          </Link>
        </div>
        <PublicFooter />
      </div>
    )
  }

  const specs = [
    { label: 'Année', value: vehicle.year.toString(), icon: CalendarBlank },
    { label: 'Kilométrage', value: `${formatNumber(vehicle.mileage)} km`, icon: Gauge },
    { label: 'Carburant', value: vehicle.fuelType, icon: GasPump },
    { label: 'Transmission', value: vehicle.transmission, icon: SteeringWheel },
    { label: 'Couleur', value: vehicle.color, icon: Palette },
    { label: 'VIN', value: vehicle.vin, icon: Hash },
  ]

  return (
    <div className="min-h-screen bg-noir-950 font-sans text-silver-200 selection:bg-gold-400 selection:text-noir-950 noise-overlay">
      <PublicNavbar />
      
      {/* Background gradients */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[80vw] h-[80vh] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gold-400/5 via-noir-950/0 to-noir-950/0 opacity-60" />
        <div className="absolute top-1/4 left-0 w-[40vw] h-[40vw] bg-gold-400/5 rounded-full blur-[150px] animate-pulse-glow" style={{ animationDuration: '10s' }} />
      </div>

      <main className="pt-32 pb-32 px-6 lg:px-12 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb / Back */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link
              to="/mansour-motors/vehicules"
              className="group mb-12 inline-flex items-center gap-4 text-xs font-bold uppercase tracking-[0.2em] text-silver-500 hover:text-gold-400 transition-colors"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 transition-all group-hover:bg-gold-400/10 group-hover:border-gold-400/30">
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" weight="bold" />
              </div>
              Retour au portfolio
            </Link>
          </motion.div>

          <div className="grid gap-20 lg:grid-cols-12 items-start">
            {/* Left Column: Images & Specs */}
            <div className="lg:col-span-7 xl:col-span-8 space-y-20">
              {/* Main Image */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="relative overflow-hidden bg-noir-900 aspect-[16/10] md:aspect-[2/1] lg:aspect-[16/10] border border-white/5 group"
              >
                <img
                  src={vehicle.image}
                  alt={`${vehicle.make} ${vehicle.model}`}
                  className="h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-noir-950 via-noir-950/20 to-transparent opacity-80" />
                
                {/* Decorative border */}
                <div className="absolute inset-4 border border-white/10 transition-colors duration-700 group-hover:border-gold-400/30 pointer-events-none" />
              </motion.div>

              {/* Description */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.8 }}
                className="space-y-8"
              >
                <div className="flex items-center gap-4 mb-2">
                  <span className="h-px w-8 bg-gold-400" />
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-gold-400">Présentation</span>
                </div>
                <h2 className="font-serif text-4xl italic text-white md:text-5xl">
                  L'Excellence <span className="text-gold-400 not-italic font-sans font-bold block mt-2">Détaillée</span>
                </h2>
                <div className="prose prose-invert prose-lg max-w-none text-silver-300 font-light leading-relaxed space-y-6">
                  <p className="text-xl leading-relaxed text-silver-200 border-l-2 border-gold-400/50 pl-6">{vehicle.description}</p>
                  <p>
                    Ce véhicule incarne le standard de qualité Mansour Motors. Inspecté rigoureusement 
                    sur plus de 100 points de contrôle, il bénéficie de notre garantie d'excellence. 
                    Une opportunité rare d'acquérir une pièce d'exception.
                  </p>
                </div>
              </motion.div>

              {/* Specs Grid */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.8 }}
                className="border-t border-white/10 pt-16"
              >
                <div className="flex items-center justify-between mb-12">
                  <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-white">
                    Caractéristiques Techniques
                  </h3>
                  <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent ml-8" />
                </div>
                
                <div className="grid grid-cols-2 gap-x-8 gap-y-12 md:grid-cols-3">
                  {specs.map((spec, index) => (
                    <motion.div 
                      key={spec.label} 
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="group flex flex-col items-start gap-4 border-l border-white/10 pl-6 hover:border-gold-400/50 transition-colors"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-white/5 border border-white/10 text-gold-400 transition-all duration-500 group-hover:bg-gold-400 group-hover:text-noir-950 group-hover:scale-110">
                        <spec.icon size={24} weight="duotone" />
                      </div>
                      <div>
                        <p className="text-[10px] text-silver-500 font-bold uppercase tracking-[0.2em] mb-2">{spec.label}</p>
                        <p className="text-xl font-medium text-white tracking-tight">{spec.value}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Right Column: Sticky Sidebar */}
            <div className="lg:col-span-5 xl:col-span-4">
              <motion.div 
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="sticky top-32 space-y-10"
              >
                {/* Header Info */}
                <div className="bg-noir-900 border border-white/5 p-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gold-400/10 rounded-full blur-[40px] pointer-events-none" />
                  
                  <div className="relative z-10">
                    <h1 className="font-serif text-5xl text-white italic leading-[0.9] tracking-tight mb-2">
                      {vehicle.make}
                    </h1>
                    <span className="block font-sans font-bold text-3xl text-gold-400 uppercase tracking-tight mb-8">
                      {vehicle.model}
                    </span>
                    
                    <div className="flex items-end justify-between border-t border-white/10 pt-8 mb-6">
                      <span className="text-xs font-bold uppercase tracking-[0.2em] text-silver-500">Prix</span>
                      <p className="text-4xl font-extrabold text-white tracking-tighter">
                        {formatPrice(vehicle.price)}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        {vehicle.status === 'available' ? (
                            <div className="flex w-full items-center justify-center gap-2 bg-emerald-500/10 px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400 border border-emerald-500/20">
                                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                                Disponible immédiatement
                            </div>
                        ) : (
                            <div className="flex w-full items-center justify-center gap-2 bg-white/5 px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white border border-white/10">
                                {vehicle.status === 'reserved' ? 'Réservé' : 'Vendu'}
                            </div>
                        )}
                    </div>
                  </div>
                </div>

                {/* Contact Form */}
                <div className="border border-white/5 bg-noir-900 p-8 relative">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold-400 via-gold-300 to-gold-600" />
                  
                  <h3 className="mb-3 font-serif text-3xl italic text-white tracking-tight">Acquérir ce véhicule</h3>
                  <p className="mb-8 text-sm font-light text-silver-400 leading-relaxed">
                    Laissez-nous vos coordonnées, un conseiller privé vous recontactera sous 24h pour organiser une visite.
                  </p>
                  
                  <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                    <div className="space-y-4">
                        <div className="relative group">
                          <input
                              type="text"
                              placeholder="Nom complet"
                              className="w-full border-b border-white/20 bg-transparent px-0 py-3 text-sm text-white placeholder-white/40 focus:border-gold-400 focus:outline-none transition-colors"
                          />
                          <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gold-400 transition-all duration-300 group-focus-within:w-full" />
                        </div>
                        
                        <div className="relative group">
                          <input
                              type="tel"
                              placeholder="Téléphone"
                              className="w-full border-b border-white/20 bg-transparent px-0 py-3 text-sm text-white placeholder-white/40 focus:border-gold-400 focus:outline-none transition-colors"
                          />
                          <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gold-400 transition-all duration-300 group-focus-within:w-full" />
                        </div>
                        
                        <div className="relative group">
                          <input
                              type="email"
                              placeholder="Email professionnel"
                              className="w-full border-b border-white/20 bg-transparent px-0 py-3 text-sm text-white placeholder-white/40 focus:border-gold-400 focus:outline-none transition-colors"
                          />
                          <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gold-400 transition-all duration-300 group-focus-within:w-full" />
                        </div>
                        
                        <div className="relative group pt-2">
                          <textarea
                              rows={3}
                              placeholder="Message (facultatif)"
                              className="w-full border border-white/20 bg-noir-950/50 px-4 py-3 text-sm text-white placeholder-white/40 focus:border-gold-400 focus:outline-none transition-colors resize-none"
                          />
                        </div>
                    </div>
                    
                    <button
                        type="submit"
                        className="group w-full relative overflow-hidden bg-gold-400 px-6 py-5 mt-4 flex justify-center hover-gold-glow"
                    >
                        <span className="relative z-10 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-noir-950 transition-transform group-hover:scale-105">
                          Demander un rendez-vous
                          <ArrowRight size={16} weight="bold" />
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-gold-300 to-gold-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    </button>
                  </form>
                </div>

                {/* Direct Contact */}
                <div className="space-y-6 pt-4">
                    <p className="flex items-center gap-4 text-xs font-bold uppercase tracking-[0.2em] text-silver-500">
                      <span className="h-px w-8 bg-white/20" />
                      Contact Direct
                      <span className="h-px flex-1 bg-white/20" />
                    </p>
                    <div className="grid gap-4">
                        <a
                            href="tel:+221331234567"
                            className="flex items-center gap-5 group border border-white/5 bg-white/5 p-4 transition-all hover:bg-white/10 hover:border-gold-400/30"
                        >
                            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-sm bg-white/5 border border-white/10 text-gold-400 transition-transform duration-500 group-hover:scale-110 group-hover:bg-gold-400 group-hover:text-noir-950">
                                <Phone size={20} weight="fill" />
                            </div>
                            <div>
                              <p className="text-[10px] font-bold uppercase tracking-widest text-silver-500 mb-1">Appel</p>
                              <span className="text-base font-medium text-white group-hover:text-gold-400 transition-colors">
                                  +221 33 123 45 67
                              </span>
                            </div>
                        </a>
                        <a
                            href="mailto:motors@mansour.sn"
                            className="flex items-center gap-5 group border border-white/5 bg-white/5 p-4 transition-all hover:bg-white/10 hover:border-gold-400/30"
                        >
                            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-sm bg-white/5 border border-white/10 text-gold-400 transition-transform duration-500 group-hover:scale-110 group-hover:bg-gold-400 group-hover:text-noir-950">
                                <Envelope size={20} weight="fill" />
                            </div>
                            <div>
                              <p className="text-[10px] font-bold uppercase tracking-widest text-silver-500 mb-1">Email</p>
                              <span className="text-base font-medium text-white group-hover:text-gold-400 transition-colors">
                                  motors@mansour.sn
                              </span>
                            </div>
                        </a>
                        <a
                            href="https://wa.me/221771234567"
                            className="flex items-center gap-5 group border border-white/5 bg-white/5 p-4 transition-all hover:bg-white/10 hover:border-gold-400/30"
                        >
                            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-sm bg-white/5 border border-white/10 text-gold-400 transition-transform duration-500 group-hover:scale-110 group-hover:bg-gold-400 group-hover:text-noir-950">
                                <WhatsappLogo size={20} weight="fill" />
                            </div>
                            <div>
                              <p className="text-[10px] font-bold uppercase tracking-widest text-silver-500 mb-1">Message</p>
                              <span className="text-base font-medium text-white group-hover:text-gold-400 transition-colors">
                                  WhatsApp
                              </span>
                            </div>
                        </a>
                    </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  )
}
