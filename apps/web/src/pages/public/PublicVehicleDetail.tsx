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
} from '@phosphor-icons/react'
import { vehicles } from '@/data/mock'
import { formatPrice, formatNumber } from '@/lib/utils'
import { PublicNavbar } from '@/components/public/PublicNavbar'
import { PublicFooter } from '@/components/public/PublicFooter'
import { motion } from 'framer-motion'

export function PublicVehicleDetail() {
  const { vehicleId } = useParams({ strict: false })
  const vehicle = vehicles.find((v) => v.id === vehicleId)

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-noir-950 font-sans text-silver-200 selection:bg-gold-400 selection:text-noir-950 flex flex-col">
        <PublicNavbar />
        <div className="flex flex-1 flex-col items-center justify-center">
          <p className="text-2xl font-serif italic text-white">Véhicule non trouvé</p>
          <Link
            to="/vehicules"
            className="mt-6 text-xs font-bold uppercase tracking-widest text-gold-400 hover:text-white transition-colors"
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
    <div className="min-h-screen bg-noir-950 font-sans text-silver-200 selection:bg-gold-400 selection:text-noir-950">
      <PublicNavbar />

      <main className="pt-32 pb-24 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb / Back */}
          <Link
            to="/vehicules"
            className="mb-12 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-silver-500 hover:text-gold-400 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" weight="bold" />
            Retour au portfolio
          </Link>

          <div className="grid gap-16 lg:grid-cols-12">
            {/* Left Column: Images & Specs */}
            <div className="lg:col-span-8 space-y-12">
              {/* Main Image */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative overflow-hidden rounded-sm bg-noir-900 aspect-[16/10]"
              >
                <img
                  src={vehicle.image}
                  alt={`${vehicle.make} ${vehicle.model}`}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-noir-950/50 to-transparent pointer-events-none" />
              </motion.div>

              {/* Description */}
              <div className="space-y-6">
                <h2 className="font-serif text-3xl italic text-white">
                  L'Excellence <span className="text-gold-400 not-italic">Détaillée</span>
                </h2>
                <div className="prose prose-invert prose-lg max-w-none text-silver-300 font-light leading-relaxed">
                  <p>{vehicle.description}</p>
                  <p>
                    Ce véhicule incarne le standard de qualité Mansour Motors. Inspecté rigoureusement 
                    sur plus de 100 points de contrôle, il bénéficie de notre garantie d'excellence. 
                    Une opportunité rare d'acquérir une pièce d'exception.
                  </p>
                </div>
              </div>

              {/* Specs Grid */}
              <div className="border-t border-white/10 pt-12">
                <h3 className="mb-8 text-xs font-bold uppercase tracking-[0.2em] text-white">
                  Caractéristiques Techniques
                </h3>
                <div className="grid grid-cols-2 gap-8 md:grid-cols-3">
                  {specs.map((spec) => (
                    <div key={spec.label} className="group flex items-start gap-4">
                      <div className="mt-1 rounded-full bg-white/5 p-2 text-gold-400 group-hover:bg-gold-400 group-hover:text-noir-950 transition-colors">
                        <spec.icon size={20} weight="fill" />
                      </div>
                      <div>
                        <p className="text-xs text-silver-500 uppercase tracking-wider mb-1">{spec.label}</p>
                        <p className="text-lg font-medium text-white">{spec.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Sticky Sidebar */}
            <div className="lg:col-span-4">
              <div className="sticky top-32 space-y-8">
                {/* Header Info */}
                <div>
                    <h1 className="font-serif text-4xl text-white italic leading-tight">
                        {vehicle.make} <span className="block not-italic text-gold-400">{vehicle.model}</span>
                    </h1>
                    <p className="mt-4 text-3xl font-bold text-white tracking-tight">
                        {formatPrice(vehicle.price)}
                    </p>
                    <div className="mt-4 flex items-center gap-2">
                        {vehicle.status === 'available' ? (
                            <span className="inline-flex items-center gap-1.5 rounded-sm bg-emerald-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-emerald-400 border border-emerald-500/20">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                Disponible immédiatement
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-1.5 rounded-sm bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white border border-white/20">
                                {vehicle.status === 'reserved' ? 'Réservé' : 'Vendu'}
                            </span>
                        )}
                    </div>
                </div>

                {/* Contact Form */}
                <div className="rounded-sm border border-white/10 bg-noir-900 p-8">
                  <h3 className="mb-2 font-serif text-2xl italic text-white">Acquérir ce véhicule</h3>
                  <p className="mb-6 text-sm font-light text-silver-400">
                    Laissez-nous vos coordonnées, un conseiller privé vous recontactera sous 24h.
                  </p>
                  
                  <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                    <div className="space-y-4">
                        <input
                            type="text"
                            placeholder="Nom complet"
                            className="w-full rounded-sm border border-white/10 bg-noir-950 px-4 py-3 text-sm text-white placeholder-white/30 focus:border-gold-400 focus:outline-none focus:ring-1 focus:ring-gold-400 transition-all"
                        />
                        <input
                            type="tel"
                            placeholder="Téléphone"
                            className="w-full rounded-sm border border-white/10 bg-noir-950 px-4 py-3 text-sm text-white placeholder-white/30 focus:border-gold-400 focus:outline-none focus:ring-1 focus:ring-gold-400 transition-all"
                        />
                        <input
                            type="email"
                            placeholder="Email professionnel"
                            className="w-full rounded-sm border border-white/10 bg-noir-950 px-4 py-3 text-sm text-white placeholder-white/30 focus:border-gold-400 focus:outline-none focus:ring-1 focus:ring-gold-400 transition-all"
                        />
                        <textarea
                            rows={3}
                            placeholder="Message (facultatif)"
                            className="w-full rounded-sm border border-white/10 bg-noir-950 px-4 py-3 text-sm text-white placeholder-white/30 focus:border-gold-400 focus:outline-none focus:ring-1 focus:ring-gold-400 transition-all resize-none"
                        />
                    </div>
                    
                    <button
                        type="submit"
                        className="w-full rounded-sm bg-gold-400 px-6 py-4 text-xs font-bold uppercase tracking-[0.2em] text-noir-950 hover:bg-gold-300 transition-colors"
                    >
                        Demander un rendez-vous
                    </button>
                  </form>
                </div>

                {/* Direct Contact */}
                <div className="space-y-4 border-t border-white/5 pt-8">
                    <p className="text-xs font-bold uppercase tracking-widest text-silver-500">
                        Contact Direct
                    </p>
                    <div className="space-y-4">
                        <a
                            href="tel:+221331234567"
                            className="flex items-center gap-4 group"
                        >
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-gold-400 group-hover:bg-gold-400 group-hover:text-noir-950 transition-colors">
                                <Phone weight="fill" />
                            </div>
                            <span className="text-sm font-medium text-white group-hover:text-gold-400 transition-colors">
                                +221 33 123 45 67
                            </span>
                        </a>
                        <a
                            href="mailto:motors@mansour.sn"
                            className="flex items-center gap-4 group"
                        >
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-gold-400 group-hover:bg-gold-400 group-hover:text-noir-950 transition-colors">
                                <Envelope weight="fill" />
                            </div>
                            <span className="text-sm font-medium text-white group-hover:text-gold-400 transition-colors">
                                motors@mansour.sn
                            </span>
                        </a>
                        <a
                            href="https://wa.me/221771234567"
                            className="flex items-center gap-4 group"
                        >
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-gold-400 group-hover:bg-gold-400 group-hover:text-noir-950 transition-colors">
                                <WhatsappLogo weight="fill" />
                            </div>
                            <span className="text-sm font-medium text-white group-hover:text-gold-400 transition-colors">
                                WhatsApp
                            </span>
                        </a>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  )
}
