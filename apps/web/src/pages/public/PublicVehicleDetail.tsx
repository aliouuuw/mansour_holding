import { Link, useParams } from '@tanstack/react-router'
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
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
import { useEffect } from 'react'
import { vehicles } from '@/data/mock'
import { formatPrice, formatNumber } from '@/lib/utils'
import { PublicNavbar } from '@/components/public/PublicNavbar'
import { PublicFooter } from '@/components/public/PublicFooter'
import { motion } from 'framer-motion'

export function PublicVehicleDetail() {
  const { vehicleId } = useParams({ strict: false })
  const vehicle = vehicles.find((v) => v.id === vehicleId)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [vehicleId])

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-surface-dim font-sans text-noir-950 selection:bg-gold-400 selection:text-noir-950 flex flex-col page-grain">
        <PublicNavbar />
        <div className="flex flex-1 flex-col items-center justify-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center border border-noir-100 bg-white">
            <CarProfile className="h-8 w-8 text-noir-200" weight="duotone" />
          </div>
          <p className="font-serif text-2xl italic text-noir-950">Véhicule non trouvé</p>
          <Link
            to="/mansour-motors/vehicules"
            className="mt-4 text-xs font-bold uppercase tracking-widest text-gold-600 hover:text-noir-950 transition-colors"
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
    <div className="min-h-screen bg-surface-dim font-sans text-noir-950 selection:bg-gold-400 selection:text-noir-950 page-grain">
      <PublicNavbar />

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
            <span className="text-noir-700">{vehicle.make} {vehicle.model}</span>
          </nav>

          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            {/* Left Column: Images & Specs */}
            <div className="lg:col-span-8 space-y-12">
              {/* Main Image */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative overflow-hidden shadow-lg aspect-[16/10]"
              >
                <img
                  src={vehicle.image}
                  alt={`${vehicle.make} ${vehicle.model}`}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-noir-950/30 to-transparent pointer-events-none" />
                {/* Back button overlay */}
                <Link
                  to="/mansour-motors/vehicules"
                  className="absolute top-5 left-5 flex items-center gap-2 bg-white/90 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-noir-700 backdrop-blur-sm transition-all hover:bg-white hover:text-gold-600 shadow-sm"
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
                <h2 className="font-serif text-3xl italic text-noir-950">
                  L'Excellence <span className="text-gold-600 not-italic font-sans font-extrabold uppercase text-[0.65em] tracking-tight">Détaillée</span>
                </h2>
                <div className="space-y-4 text-base font-light leading-relaxed text-noir-500">
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
                className="border-t border-noir-100 pt-10"
              >
                <h3 className="mb-8 text-[10px] font-bold uppercase tracking-[0.2em] text-gold-600">
                  Caractéristiques Techniques
                </h3>
                <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
                  {specs.map((spec, index) => (
                    <motion.div
                      key={spec.label}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.05 }}
                      className="group flex items-start gap-3 cursor-default"
                    >
                      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center bg-gold-50 text-gold-600 transition-all duration-300 group-hover:bg-gold-400 group-hover:text-noir-950 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-md">
                        <spec.icon size={16} weight="fill" />
                      </div>
                      <div className="transition-transform duration-300 group-hover:translate-x-1">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-noir-400 mb-1 transition-colors duration-300 group-hover:text-gold-600">{spec.label}</p>
                        <p className="text-sm font-medium text-noir-950">{spec.value}</p>
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
                  <h1 className="font-serif text-3xl text-noir-950 italic leading-tight lg:text-4xl">
                    {vehicle.make} <span className="block not-italic text-gold-600 font-sans font-extrabold uppercase text-[0.65em] tracking-tight">{vehicle.model}</span>
                  </h1>
                  <p className="mt-4 text-2xl font-bold text-noir-950 tracking-tight lg:text-3xl">
                    {formatPrice(vehicle.price)}
                  </p>
                  <div className="mt-4">
                    {vehicle.status === 'available' ? (
                      <span className="inline-flex items-center gap-1.5 bg-emerald-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-emerald-700 border border-emerald-200">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Disponible immédiatement
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 bg-noir-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-noir-600 border border-noir-200">
                        {vehicle.status === 'reserved' ? 'Réservé' : 'Vendu'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Contact Form */}
                <div className="border border-noir-100 bg-white p-7 shadow-sm">
                  <h3 className="mb-1.5 font-serif text-xl italic text-noir-950">Acquérir ce véhicule</h3>
                  <p className="mb-6 text-xs font-light text-noir-500">
                    Un conseiller privé vous recontactera sous 24h.
                  </p>

                  <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
                    <input
                      type="text"
                      placeholder="Nom complet"
                      className="w-full border border-noir-200 bg-surface-dim px-4 py-3 text-sm text-noir-900 placeholder-noir-400 focus:border-gold-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gold-400/30 transition-all hover:border-noir-300"
                    />
                    <input
                      type="tel"
                      placeholder="Téléphone"
                      className="w-full border border-noir-200 bg-surface-dim px-4 py-3 text-sm text-noir-900 placeholder-noir-400 focus:border-gold-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gold-400/30 transition-all hover:border-noir-300"
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      className="w-full border border-noir-200 bg-surface-dim px-4 py-3 text-sm text-noir-900 placeholder-noir-400 focus:border-gold-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gold-400/30 transition-all hover:border-noir-300"
                    />
                    <textarea
                      rows={3}
                      placeholder="Message (facultatif)"
                      className="w-full border border-noir-200 bg-surface-dim px-4 py-3 text-sm text-noir-900 placeholder-noir-400 focus:border-gold-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gold-400/30 transition-all hover:border-noir-300 resize-none"
                    />
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-gold-400 px-6 py-3.5 text-[10px] font-bold uppercase tracking-[0.2em] text-noir-950 transition-all hover:bg-gold-300 hover:shadow-[0_0_15px_rgba(207,181,59,0.4)] mt-2"
                    >
                      Demander un rendez-vous
                    </motion.button>
                  </form>
                </div>

                {/* Direct Contact */}
                <div className="space-y-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold-600">
                    Contact Direct
                  </p>
                  <div className="space-y-3">
                    <a href="tel:+221331234567" className="flex items-center gap-3 group">
                      <div className="flex h-9 w-9 items-center justify-center bg-gold-50 text-gold-600 transition-all duration-300 group-hover:bg-gold-400 group-hover:text-noir-950 group-hover:scale-110 group-hover:-rotate-6 group-hover:shadow-md">
                        <Phone weight="fill" size={16} />
                      </div>
                      <span className="text-sm text-noir-500 transition-all duration-300 group-hover:text-gold-600 group-hover:translate-x-1 font-medium">
                        +221 33 123 45 67
                      </span>
                    </a>
                    <a href="mailto:motors@mansour.sn" className="flex items-center gap-3 group">
                      <div className="flex h-9 w-9 items-center justify-center bg-gold-50 text-gold-600 transition-all duration-300 group-hover:bg-gold-400 group-hover:text-noir-950 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-md">
                        <Envelope weight="fill" size={16} />
                      </div>
                      <span className="text-sm text-noir-500 transition-all duration-300 group-hover:text-gold-600 group-hover:translate-x-1 font-medium">
                        motors@mansour.sn
                      </span>
                    </a>
                    <a href="https://wa.me/221771234567" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 group">
                      <div className="flex h-9 w-9 items-center justify-center bg-gold-50 text-gold-600 transition-all duration-300 group-hover:bg-gold-400 group-hover:text-noir-950 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-md">
                        <WhatsappLogo weight="fill" size={16} />
                      </div>
                      <span className="text-sm text-noir-500 transition-all duration-300 group-hover:text-gold-600 group-hover:translate-x-1 font-medium">
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

      {/* Other Vehicles Carousel */}
      <section className="bg-white px-6 py-16 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <motion.span
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-gold-600"
              >
                Découvrir plus
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="font-serif text-3xl italic text-noir-950 md:text-4xl"
              >
                Autres <span className="text-gold-600 not-italic font-sans font-extrabold uppercase text-[0.75em] tracking-tight">Véhicules</span>
              </motion.h2>
            </div>
            <Link
              to="/mansour-motors/vehicules"
              className="group hidden items-center gap-2 text-xs font-bold uppercase tracking-widest text-gold-600 transition-colors hover:text-gold-700 sm:inline-flex"
            >
              Voir tout le catalogue
              <ArrowRight className="transition-transform group-hover:translate-x-1" weight="bold" />
            </Link>
          </div>

          <div className="relative">
            <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-noir-200 scrollbar-track-transparent snap-x snap-mandatory">
              {vehicles
                .filter((v) => v.id !== vehicleId && v.status === 'available')
                .slice(0, 5)
                .map((otherVehicle, index) => (
                  <motion.div
                    key={otherVehicle.id}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.08 }}
                    className="group w-[280px] flex-shrink-0 snap-start"
                  >
                    <Link
                      to="/mansour-motors/vehicules/$vehicleId"
                      params={{ vehicleId: otherVehicle.id }}
                      className="block"
                    >
                      <div className="overflow-hidden border border-noir-100 bg-white shadow-sm transition-all duration-500 hover:shadow-xl hover:-translate-y-1 hover:border-gold-200">
                        <div className="relative aspect-[4/3] overflow-hidden">
                          <img
                            src={otherVehicle.image}
                            alt={`${otherVehicle.make} ${otherVehicle.model}`}
                            className="h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-noir-950/70 via-noir-950/20 to-transparent" />
                          <div className="absolute bottom-0 left-0 right-0 p-4">
                            <h3 className="font-serif text-lg italic text-white">
                              {otherVehicle.make}{' '}
                              <span className="font-sans font-semibold not-italic text-gold-300">
                                {otherVehicle.model}
                              </span>
                            </h3>
                            <p className="text-[10px] font-medium uppercase tracking-wider text-white/70">
                              {otherVehicle.year} · {otherVehicle.transmission}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between p-4 relative overflow-hidden">
                          <div className="absolute inset-0 bg-gold-50/0 transition-colors duration-500 group-hover:bg-gold-50/50" />
                          <p className="relative z-10 text-base font-bold text-noir-950">
                            {formatPrice(otherVehicle.price)}
                          </p>
                          <span className="relative z-10 flex h-7 w-7 items-center justify-center bg-gold-50 text-gold-600 transition-all duration-500 group-hover:bg-gold-400 group-hover:text-noir-950 group-hover:rotate-45 group-hover:shadow-[0_0_10px_rgba(207,181,59,0.4)]">
                            <ArrowUpRight className="h-3.5 w-3.5" weight="bold" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
            </div>
          </div>

          <div className="mt-6 sm:hidden">
            <Link
              to="/mansour-motors/vehicules"
              className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gold-600 transition-colors hover:text-gold-700"
            >
              Voir tout le catalogue
              <ArrowRight className="transition-transform group-hover:translate-x-1" weight="bold" />
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  )
}
