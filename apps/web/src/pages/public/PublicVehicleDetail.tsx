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
      <div className="min-h-screen bg-bone-50 font-sans text-noir-600 selection:bg-gold-400 selection:text-noir-950 flex flex-col page-grain-light">
        <PublicNavbar lightMode />
        <div className="flex flex-1 flex-col items-center justify-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-sm border border-bone-200">
            <CarProfile className="h-8 w-8 text-noir-300" weight="duotone" />
          </div>
          <p className="font-serif text-2xl italic text-noir-950">Véhicule non trouvé</p>
          <Link
            to="/mansour-motors/vehicules"
            className="mt-4 text-[10px] font-bold uppercase tracking-widest text-gold-600 hover:text-gold-400 transition-colors"
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
    <div className="min-h-screen bg-bone-50 font-sans text-noir-950 selection:bg-gold-400 selection:text-noir-950 page-grain-light">
      <PublicNavbar lightMode />

      <main className="pt-28 pb-24 px-6 lg:px-12 lg:pt-32">
        <div className="mx-auto max-w-7xl">
          {/* Breadcrumb */}
          <nav className="mb-10 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em]">
            <Link to="/mansour-motors" className="text-noir-400 hover:text-gold-600 transition-colors">
              Motors
            </Link>
            <CaretRight className="h-3 w-3 text-noir-300" weight="bold" />
            <Link to="/mansour-motors/vehicules" className="text-noir-400 hover:text-gold-600 transition-colors">
              Véhicules
            </Link>
            <CaretRight className="h-3 w-3 text-noir-300" weight="bold" />
            <span className="text-noir-900">{vehicle.make} {vehicle.model}</span>
          </nav>

          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            {/* Left Column: Images & Specs */}
            <div className="lg:col-span-8 space-y-16">
              {/* Main Image */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative overflow-hidden bg-bone-100 aspect-[16/10] border border-transparent shadow-lux-light-md"
              >
                <img
                  src={vehicle.image}
                  alt={`${vehicle.make} ${vehicle.model}`}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-noir-950/20 to-transparent pointer-events-none" />
                {/* Back button overlay */}
                <Link
                  to="/mansour-motors/vehicules"
                  className="absolute top-5 left-5 flex items-center gap-2 bg-white/90 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-noir-950 backdrop-blur-md transition-all hover:bg-white hover:text-gold-600 shadow-sm"
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
                className="space-y-6 max-w-3xl"
              >
                <h2 className="font-serif text-3xl italic text-noir-950">
                  L'Excellence <span className="text-gold-600 not-italic font-sans font-extrabold uppercase text-[0.65em] tracking-tight">Détaillée</span>
                </h2>
                <div className="space-y-5 text-base font-light leading-relaxed text-noir-600">
                  <p className="first-letter:float-left first-letter:mr-3 first-letter:text-5xl first-letter:font-serif first-letter:font-bold first-letter:text-gold-600 first-line:uppercase first-line:tracking-widest">
                    {vehicle.description}
                  </p>
                  <p>
                    Ce véhicule incarne le standard de qualité Mansour Motors. Inspecté rigoureusement
                    sur plus de 100 points de contrôle, il bénéficie de notre garantie d'excellence.
                    Une opportunité rare d'acquérir une pièce d'exception, préparée avec le plus grand soin
                    par nos experts certifiés.
                  </p>
                </div>
              </motion.div>

              {/* Specs Grid */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="border-t border-bone-200 pt-10"
              >
                <h3 className="mb-8 text-[10px] font-bold uppercase tracking-[0.2em] text-gold-600">
                  Caractéristiques Techniques
                </h3>
                <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3">
                  {specs.map((spec, index) => (
                    <motion.div
                      key={spec.label}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.05 }}
                      className="group flex items-start gap-4"
                    >
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-white shadow-sm border border-bone-200 text-gold-600 transition-all group-hover:border-gold-400 group-hover:bg-gold-50">
                        <spec.icon size={18} weight="duotone" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-noir-400 mb-1.5">{spec.label}</p>
                        <p className="text-sm font-semibold text-noir-950">{spec.value}</p>
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
                className="sticky top-28 space-y-10"
              >
                {/* Header Info */}
                <div>
                  <h1 className="font-serif text-3xl text-noir-950 italic leading-tight lg:text-4xl">
                    {vehicle.make} <span className="block not-italic text-gold-600 font-sans font-extrabold uppercase text-[0.65em] tracking-tight">{vehicle.model}</span>
                  </h1>
                  <p className="mt-4 text-3xl font-bold text-noir-950 tracking-tight lg:text-4xl">
                    {formatPrice(vehicle.price)}
                  </p>
                  <div className="mt-6">
                    {vehicle.status === 'available' ? (
                      <span className="inline-flex items-center gap-1.5 bg-success-50 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-success-600 border border-success-500/20">
                        <span className="h-1.5 w-1.5 rounded-full bg-success-500 animate-pulse" />
                        Disponible immédiatement
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 bg-noir-100 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-noir-600 border border-noir-200">
                        {vehicle.status === 'reserved' ? 'Réservé' : 'Vendu'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Contact Form */}
                <div className="bg-white p-8 shadow-lux-light-sm border border-bone-200 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-radial from-gold-400/5 to-transparent -translate-y-1/2 translate-x-1/2 rounded-full pointer-events-none" />
                  
                  <h3 className="mb-2 font-serif text-2xl italic text-noir-950">Acquérir ce véhicule</h3>
                  <p className="mb-8 text-xs font-light text-noir-500 leading-relaxed">
                    Laissez-nous vos coordonnées, un conseiller privé vous recontactera sous 24h pour organiser une visite.
                  </p>

                  <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                    <input
                      type="text"
                      placeholder="Nom complet"
                      className="w-full border-b border-bone-300 bg-transparent px-2 py-3 text-sm text-noir-950 placeholder-noir-400 focus:border-gold-600 focus:outline-none transition-colors"
                    />
                    <input
                      type="tel"
                      placeholder="Téléphone"
                      className="w-full border-b border-bone-300 bg-transparent px-2 py-3 text-sm text-noir-950 placeholder-noir-400 focus:border-gold-600 focus:outline-none transition-colors"
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      className="w-full border-b border-bone-300 bg-transparent px-2 py-3 text-sm text-noir-950 placeholder-noir-400 focus:border-gold-600 focus:outline-none transition-colors"
                    />
                    <div className="pt-2">
                      <button
                        type="submit"
                        className="w-full bg-gold-400 px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-white hover:bg-gold-500 hover:shadow-lux-glow transition-all"
                      >
                        Demander un rendez-vous
                      </button>
                    </div>
                  </form>
                </div>

                {/* Direct Contact */}
                <div className="space-y-5 pt-2">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold-600">
                    Contact Direct
                  </p>
                  <div className="space-y-4">
                    <a href="tel:+221331234567" className="flex items-center gap-4 group">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white border border-bone-200 shadow-sm text-gold-600 group-hover:bg-gold-600 group-hover:text-white transition-all">
                        <Phone weight="fill" size={16} />
                      </div>
                      <span className="text-sm font-medium text-noir-600 group-hover:text-gold-600 transition-colors">
                        +221 33 123 45 67
                      </span>
                    </a>
                    <a href="mailto:motors@mansour.sn" className="flex items-center gap-4 group">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white border border-bone-200 shadow-sm text-gold-600 group-hover:bg-gold-600 group-hover:text-white transition-all">
                        <Envelope weight="fill" size={16} />
                      </div>
                      <span className="text-sm font-medium text-noir-600 group-hover:text-gold-600 transition-colors">
                        motors@mansour.sn
                      </span>
                    </a>
                    <a href="https://wa.me/221771234567" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success-50 border border-success-200 text-success-600 group-hover:bg-success-600 group-hover:text-white group-hover:border-success-600 transition-all shadow-sm">
                        <WhatsappLogo weight="fill" size={18} />
                      </div>
                      <span className="text-sm font-medium text-noir-600 group-hover:text-success-600 transition-colors">
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
