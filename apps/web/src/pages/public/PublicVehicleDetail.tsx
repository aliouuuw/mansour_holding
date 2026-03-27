import { Link, useParams } from '@tanstack/react-router'
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  ArrowUpRight01Icon,
  Calendar01Icon,
  Fuel01Icon,
  DashboardSpeed01Icon,
  PaintBoardIcon,
  HashtagIcon,
  SteeringIcon,
  TelephoneIcon,
  Mail01Icon,
  WhatsappIcon,
  ArrowRight02Icon,
  Car01Icon,
} from 'hugeicons-react'
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
      <div className="min-h-screen bg-carbon-950 font-motors text-white motors-theme flex flex-col">
        <PublicNavbar />
        <div className="flex flex-1 flex-col items-center justify-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center border border-carbon-800 bg-carbon-900">
            <Car01Icon className="h-8 w-8 text-carbon-600" />
          </div>
          <p className="font-motors-display text-xl font-bold uppercase tracking-wider text-white">Véhicule non trouvé</p>
          <Link
            to="/mansour-motors/vehicules"
            className="mt-4 text-xs font-bold uppercase tracking-widest text-cyan-400 hover:text-white transition-colors"
          >
            Retour au catalogue
          </Link>
        </div>
        <PublicFooter />
      </div>
    )
  }

  const specs = [
    { label: 'Année', value: vehicle.year.toString(), icon: Calendar01Icon },
    { label: 'Kilométrage', value: `${formatNumber(vehicle.mileage)} km`, icon: DashboardSpeed01Icon },
    { label: 'Carburant', value: vehicle.fuelType, icon: Fuel01Icon },
    { label: 'Transmission', value: vehicle.transmission, icon: SteeringIcon },
    { label: 'Couleur', value: vehicle.color, icon: PaintBoardIcon },
    { label: 'VIN', value: vehicle.vin, icon: HashtagIcon },
  ]

  return (
    <div className="min-h-screen bg-carbon-950 font-motors text-white motors-theme">
      <PublicNavbar />

      <main className="pt-28 pb-24 px-6 lg:px-12 lg:pt-32">
        <div className="mx-auto max-w-7xl">
          {/* Breadcrumb */}
          <nav className="mb-10 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.15em]">
            <Link to="/mansour-motors" className="text-silver-600 hover:text-cyan-400 transition-colors">
              Motors
            </Link>
            <ArrowRight02Icon className="h-3 w-3 text-carbon-600" />
            <Link to="/mansour-motors/vehicules" className="text-silver-600 hover:text-cyan-400 transition-colors">
              Véhicules
            </Link>
            <ArrowRight02Icon className="h-3 w-3 text-carbon-600" />
            <span className="text-silver-300">{vehicle.make} {vehicle.model}</span>
          </nav>

          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            {/* Left Column: Images & Specs */}
            <div className="lg:col-span-8 space-y-12">
              {/* Main Image */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative overflow-hidden aspect-[16/10] border border-carbon-800"
              >
                <img
                  src={vehicle.image}
                  alt={`${vehicle.make} ${vehicle.model}`}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-carbon-950/40 to-transparent pointer-events-none" />
                {/* Corner accents */}
                <div className="absolute top-4 right-4 h-8 w-8 border-t border-r border-cyan-500/30 pointer-events-none" />
                <div className="absolute bottom-4 left-4 h-8 w-8 border-b border-l border-cyan-500/30 pointer-events-none" />
                {/* Back button overlay */}
                <Link
                  to="/mansour-motors/vehicules"
                  className="absolute top-5 left-5 flex items-center gap-2 bg-carbon-950/80 backdrop-blur-md border border-carbon-800 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-silver-300 transition-all hover:border-cyan-500/50 hover:text-cyan-400"
                >
                  <ArrowLeft01Icon className="h-3.5 w-3.5" />
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
                <div className="flex items-center gap-3 mb-2">
                  <span className="h-px w-8 bg-cyan-500" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-500">À propos</span>
                </div>
                <h2 className="font-motors-display text-2xl font-bold uppercase tracking-tight text-white md:text-3xl">
                  L'Excellence <span className="text-cyan-400">Détaillée</span>
                </h2>
                <div className="space-y-4 text-sm font-light leading-relaxed text-silver-400">
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
                className="border-t border-carbon-800 pt-10"
              >
                <h3 className="mb-8 text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-500">
                  Caractéristiques Techniques
                </h3>
                <div className="grid grid-cols-2 gap-px md:grid-cols-3 bg-carbon-800 border border-carbon-800">
                  {specs.map((spec, index) => (
                    <motion.div
                      key={spec.label}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.05 }}
                      className="group flex items-start gap-3 bg-carbon-900 p-5 cursor-default transition-colors duration-300 hover:bg-carbon-800"
                    >
                      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center border border-carbon-700 text-silver-500 transition-all duration-300 group-hover:border-cyan-500 group-hover:text-cyan-400">
                        <spec.icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-silver-600 mb-1 transition-colors duration-300 group-hover:text-cyan-400">{spec.label}</p>
                        <p className="text-sm font-medium text-silver-200 break-all">{spec.value}</p>
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
                  <h1 className="font-motors-display text-3xl font-bold uppercase tracking-tighter text-white leading-none mb-2">
                    {vehicle.make}
                  </h1>
                  <span className="block text-xl font-bold text-cyan-400 tracking-wide mb-6">{vehicle.model}</span>
                  <p className="text-2xl font-bold text-white tracking-tight lg:text-3xl">
                    {formatPrice(vehicle.price)}
                  </p>
                  <div className="mt-4">
                    {vehicle.status === 'available' ? (
                      <span className="inline-flex items-center gap-1.5 bg-carbon-900 px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest text-emerald-400 border border-emerald-500/30">
                        <span className="h-1.5 w-1.5 bg-emerald-400 animate-pulse" />
                        Disponible immédiatement
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 bg-carbon-900 px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest text-silver-500 border border-carbon-700">
                        {vehicle.status === 'reserved' ? 'Réservé' : 'Vendu'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Contact Form */}
                <div className="border border-carbon-800 bg-carbon-900 p-7">
                  <h3 className="mb-1.5 font-bold text-lg text-white">Acquérir ce véhicule</h3>
                  <p className="mb-6 text-xs font-light text-silver-500">
                    Un conseiller privé vous recontactera sous 24h.
                  </p>

                  <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
                    <input
                      type="text"
                      placeholder="Nom complet"
                      className="w-full border border-carbon-700 bg-carbon-800 px-4 py-3 text-sm text-silver-200 placeholder-silver-600 focus:border-cyan-500 focus:outline-none transition-all"
                    />
                    <input
                      type="tel"
                      placeholder="Téléphone"
                      className="w-full border border-carbon-700 bg-carbon-800 px-4 py-3 text-sm text-silver-200 placeholder-silver-600 focus:border-cyan-500 focus:outline-none transition-all"
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      className="w-full border border-carbon-700 bg-carbon-800 px-4 py-3 text-sm text-silver-200 placeholder-silver-600 focus:border-cyan-500 focus:outline-none transition-all"
                    />
                    <textarea
                      rows={3}
                      placeholder="Message (facultatif)"
                      className="w-full border border-carbon-700 bg-carbon-800 px-4 py-3 text-sm text-silver-200 placeholder-silver-600 focus:border-cyan-500 focus:outline-none transition-all resize-none"
                    />
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="btn-motors btn-motors-primary w-full py-4 text-[10px] mt-2"
                    >
                      Demander un rendez-vous
                    </motion.button>
                  </form>
                </div>

                {/* Direct Contact */}
                <div className="space-y-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-500">
                    Contact Direct
                  </p>
                  <div className="space-y-3">
                    <a href="tel:+221331234567" className="flex items-center gap-3 group">
                      <div className="flex h-9 w-9 items-center justify-center border border-carbon-700 text-silver-500 transition-all duration-300 group-hover:border-cyan-500 group-hover:text-cyan-400">
                        <TelephoneIcon className="h-4 w-4" />
                      </div>
                      <span className="text-sm text-silver-400 transition-colors duration-300 group-hover:text-cyan-400 font-medium">
                        +221 33 123 45 67
                      </span>
                    </a>
                    <a href="mailto:motors@mansour.sn" className="flex items-center gap-3 group">
                      <div className="flex h-9 w-9 items-center justify-center border border-carbon-700 text-silver-500 transition-all duration-300 group-hover:border-cyan-500 group-hover:text-cyan-400">
                        <Mail01Icon className="h-4 w-4" />
                      </div>
                      <span className="text-sm text-silver-400 transition-colors duration-300 group-hover:text-cyan-400 font-medium">
                        motors@mansour.sn
                      </span>
                    </a>
                    <a href="https://wa.me/221771234567" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 group">
                      <div className="flex h-9 w-9 items-center justify-center border border-carbon-700 text-silver-500 transition-all duration-300 group-hover:border-cyan-500 group-hover:text-cyan-400">
                        <WhatsappIcon className="h-4 w-4" />
                      </div>
                      <span className="text-sm text-silver-400 transition-colors duration-300 group-hover:text-cyan-400 font-medium">
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
      <section className="bg-carbon-900 border-t border-carbon-800 px-6 py-16 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <motion.span
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="mb-2 block text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-500"
              >
                Découvrir plus
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="font-motors-display text-2xl font-bold uppercase tracking-tight text-white md:text-3xl"
              >
                Autres <span className="text-cyan-400">Véhicules</span>
              </motion.h2>
            </div>
            <Link
              to="/mansour-motors/vehicules"
              className="group hidden items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-silver-400 transition-colors hover:text-cyan-400 sm:inline-flex"
            >
              Voir tout le catalogue
              <ArrowRight01Icon className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="relative">
            <div className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory" style={{ scrollbarWidth: 'none' }}>
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
                      <div className="overflow-hidden border border-carbon-800 bg-carbon-950 transition-all duration-500 hover:border-cyan-500/30">
                        <div className="relative aspect-[4/3] overflow-hidden bg-carbon-800">
                          <img
                            src={otherVehicle.image}
                            alt={`${otherVehicle.make} ${otherVehicle.model}`}
                            className="h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-carbon-950/80 via-carbon-950/20 to-transparent" />
                          <div className="absolute bottom-0 left-0 right-0 p-4">
                            <h3 className="font-motors-display text-sm font-bold uppercase tracking-wider text-white">
                              {otherVehicle.make}
                            </h3>
                            <span className="text-xs font-bold text-cyan-400">{otherVehicle.model}</span>
                            <p className="text-[9px] font-bold uppercase tracking-wider text-silver-600 mt-1">
                              {otherVehicle.year} · {otherVehicle.transmission}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between p-4 border-t border-carbon-800">
                          <p className="text-sm font-bold text-white">
                            {formatPrice(otherVehicle.price)}
                          </p>
                          <span className="flex h-7 w-7 items-center justify-center border border-carbon-700 text-silver-500 transition-all duration-500 group-hover:border-cyan-500 group-hover:bg-cyan-500 group-hover:text-carbon-950">
                            <ArrowUpRight01Icon className="h-3.5 w-3.5" />
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
              className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-cyan-400 transition-colors hover:text-white"
            >
              Voir tout le catalogue
              <ArrowRight01Icon className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  )
}
