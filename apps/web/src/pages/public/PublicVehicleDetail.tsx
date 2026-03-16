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
  CaretRight,
  CarProfile,
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
      <div className="min-h-screen bg-noir-950 font-sans text-silver-200 selection:bg-gold-400 selection:text-noir-950 flex flex-col page-grain">
        <PublicNavbar />
        <div className="flex flex-1 flex-col items-center justify-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center border border-white/[0.06] bg-white/[0.02]">
            <CarProfile className="h-8 w-8 text-white/15" weight="duotone" />
          </div>
          <p className="font-serif text-2xl italic text-white/60">Véhicule non trouvé</p>
          <Link
            to="/mansour-motors/vehicules"
            className="mt-4 text-xs font-bold uppercase tracking-widest text-gold-400 hover:text-white transition-colors"
          >
            Retour au catalogue
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
    <div className="min-h-screen bg-noir-950 font-sans text-silver-200 selection:bg-gold-400 selection:text-noir-950 page-grain">
      <PublicNavbar />

      <main className="pt-28 pb-24 px-6 lg:px-12 lg:pt-32">
        <div className="mx-auto max-w-7xl">
          {/* Breadcrumb */}
          <nav className="mb-10 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em]">
            <Link to="/mansour-motors" className="text-white/30 hover:text-gold-400 transition-colors">
              Motors
            </Link>
            <CaretRight className="h-3 w-3 text-white/15" weight="bold" />
            <Link to="/mansour-motors/vehicules" className="text-white/30 hover:text-gold-400 transition-colors">
              Véhicules
            </Link>
            <CaretRight className="h-3 w-3 text-white/15" weight="bold" />
            <span className="text-white/60">{vehicle.make} {vehicle.model}</span>
          </nav>

          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            {/* Left Column: Images & Specs */}
            <div className="lg:col-span-8 space-y-12">
              {/* Main Image */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative overflow-hidden bg-noir-900 aspect-[16/10]"
              >
                <img
                  src={vehicle.image}
                  alt={`${vehicle.make} ${vehicle.model}`}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-noir-950/40 to-transparent pointer-events-none" />
                {/* Back button overlay */}
                <Link
                  to="/mansour-motors/vehicules"
                  className="absolute top-5 left-5 flex items-center gap-2 bg-noir-950/60 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-white/70 backdrop-blur-sm transition-all hover:bg-noir-950/80 hover:text-gold-400"
                >
                  <ArrowLeft className="h-3.5 w-3.5" weight="bold" />
                  Catalogue
                </Link>
              </motion.div>

              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="space-y-5"
              >
                <h2 className="font-serif text-3xl italic text-white">
                  L'Excellence <span className="text-gold-400 not-italic font-sans font-extrabold uppercase text-[0.65em] tracking-tight">Détaillée</span>
                </h2>
                <div className="space-y-4 text-base font-light leading-relaxed text-white/45">
                  <p>{vehicle.description}</p>
                  <p>
                    Ce véhicule incarne le standard de qualité Mansour Motors. Inspecté rigoureusement
                    sur plus de 100 points de contrôle, il bénéficie de notre garantie d'excellence.
                    Une opportunité rare d'acquérir une pièce d'exception.
                  </p>
                </div>
              </motion.div>

              {/* Specs Grid */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="border-t border-white/[0.06] pt-10"
              >
                <h3 className="mb-8 text-[10px] font-bold uppercase tracking-[0.2em] text-gold-400">
                  Caractéristiques Techniques
                </h3>
                <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
                  {specs.map((spec, index) => (
                    <motion.div
                      key={spec.label}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.05 }}
                      className="group flex items-start gap-3"
                    >
                      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center bg-white/5 text-gold-400 transition-all group-hover:bg-gold-400 group-hover:text-noir-950">
                        <spec.icon size={16} weight="fill" />
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/30 mb-1">{spec.label}</p>
                        <p className="text-sm font-medium text-white">{spec.value}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Right Column: Sticky Sidebar */}
            <div className="lg:col-span-4">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="sticky top-28 space-y-8"
              >
                {/* Header Info */}
                <div>
                  <h1 className="font-serif text-3xl text-white italic leading-tight lg:text-4xl">
                    {vehicle.make} <span className="block not-italic text-gold-400 font-sans font-extrabold uppercase text-[0.65em] tracking-tight">{vehicle.model}</span>
                  </h1>
                  <p className="mt-4 text-2xl font-bold text-white tracking-tight lg:text-3xl">
                    {formatPrice(vehicle.price)}
                  </p>
                  <div className="mt-4">
                    {vehicle.status === 'available' ? (
                      <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-emerald-400 border border-emerald-500/20">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Disponible immédiatement
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white border border-white/20">
                        {vehicle.status === 'reserved' ? 'Réservé' : 'Vendu'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Contact Form */}
                <div className="border border-white/[0.06] bg-noir-900 p-7">
                  <h3 className="mb-1.5 font-serif text-xl italic text-white">Acquérir ce véhicule</h3>
                  <p className="mb-6 text-xs font-light text-white/35">
                    Un conseiller privé vous recontactera sous 24h.
                  </p>

                  <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
                    <input
                      type="text"
                      placeholder="Nom complet"
                      className="w-full border border-white/10 bg-noir-950 px-4 py-3 text-sm text-white placeholder-white/25 focus:border-gold-400 focus:outline-none focus:ring-1 focus:ring-gold-400/30 transition-all"
                    />
                    <input
                      type="tel"
                      placeholder="Téléphone"
                      className="w-full border border-white/10 bg-noir-950 px-4 py-3 text-sm text-white placeholder-white/25 focus:border-gold-400 focus:outline-none focus:ring-1 focus:ring-gold-400/30 transition-all"
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      className="w-full border border-white/10 bg-noir-950 px-4 py-3 text-sm text-white placeholder-white/25 focus:border-gold-400 focus:outline-none focus:ring-1 focus:ring-gold-400/30 transition-all"
                    />
                    <textarea
                      rows={3}
                      placeholder="Message (facultatif)"
                      className="w-full border border-white/10 bg-noir-950 px-4 py-3 text-sm text-white placeholder-white/25 focus:border-gold-400 focus:outline-none focus:ring-1 focus:ring-gold-400/30 transition-all resize-none"
                    />
                    <button
                      type="submit"
                      className="w-full bg-gold-400 px-6 py-3.5 text-[10px] font-bold uppercase tracking-[0.2em] text-noir-950 hover:bg-gold-300 transition-colors"
                    >
                      Demander un rendez-vous
                    </button>
                  </form>
                </div>

                {/* Direct Contact */}
                <div className="space-y-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold-400">
                    Contact Direct
                  </p>
                  <div className="space-y-3">
                    <a href="tel:+221331234567" className="flex items-center gap-3 group">
                      <div className="flex h-9 w-9 items-center justify-center bg-white/5 text-gold-400 group-hover:bg-gold-400 group-hover:text-noir-950 transition-colors">
                        <Phone weight="fill" size={16} />
                      </div>
                      <span className="text-sm text-white/60 group-hover:text-gold-400 transition-colors">
                        +221 33 123 45 67
                      </span>
                    </a>
                    <a href="mailto:motors@mansour.sn" className="flex items-center gap-3 group">
                      <div className="flex h-9 w-9 items-center justify-center bg-white/5 text-gold-400 group-hover:bg-gold-400 group-hover:text-noir-950 transition-colors">
                        <Envelope weight="fill" size={16} />
                      </div>
                      <span className="text-sm text-white/60 group-hover:text-gold-400 transition-colors">
                        motors@mansour.sn
                      </span>
                    </a>
                    <a href="https://wa.me/221771234567" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 group">
                      <div className="flex h-9 w-9 items-center justify-center bg-white/5 text-gold-400 group-hover:bg-gold-400 group-hover:text-noir-950 transition-colors">
                        <WhatsappLogo weight="fill" size={16} />
                      </div>
                      <span className="text-sm text-white/60 group-hover:text-gold-400 transition-colors">
                        WhatsApp
                      </span>
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
