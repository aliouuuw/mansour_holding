import { Link, useParams } from '@tanstack/react-router'
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
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
import { MotorsNavbar } from '@/components/motors/MotorsNavbar'
import { MotorsFooter } from '@/components/motors/MotorsFooter'
import { motion } from 'framer-motion'

export function PublicVehicleDetail() {
  const { vehicleId } = useParams({ strict: false })
  const vehicle = vehicles.find((v) => v.id === vehicleId)

  if (!vehicle) {
    return (
      <div className="motors-theme min-h-screen bg-carbon-950 font-motors flex flex-col">
        <MotorsNavbar />
        <div className="flex flex-1 flex-col items-center justify-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center border border-white/[0.06] bg-carbon-800 rounded-sm">
            <Car01Icon className="h-8 w-8 text-silver-600" />
          </div>
          <p className="font-motors-display text-2xl font-bold uppercase text-white">Véhicule non trouvé</p>
          <Link
            to="/mansour-motors/vehicules"
            className="mt-4 font-motors text-xs font-bold uppercase tracking-widest text-cyan-400 hover:text-white transition-colors"
          >
            Retour au catalogue
          </Link>
        </div>
        <MotorsFooter />
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
    <div className="motors-theme min-h-screen bg-carbon-950 font-motors">
      <MotorsNavbar />

      <main className="pt-28 pb-24 px-6 lg:px-12 lg:pt-32">
        <div className="mx-auto max-w-7xl">
          {/* Breadcrumb */}
          <nav className="mb-10 flex items-center gap-2 font-motors text-[11px] font-medium uppercase tracking-[0.12em]">
            <Link to="/mansour-motors" className="text-silver-600 hover:text-cyan-400 transition-colors">
              Motors
            </Link>
            <ArrowRight02Icon className="h-3 w-3 text-silver-700" />
            <Link to="/mansour-motors/vehicules" className="text-silver-600 hover:text-cyan-400 transition-colors">
              Véhicules
            </Link>
            <ArrowRight02Icon className="h-3 w-3 text-silver-700" />
            <span className="text-silver-300">{vehicle.make} {vehicle.model}</span>
          </nav>

          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            {/* Left Column: Images & Specs */}
            <div className="lg:col-span-8 space-y-10">
              {/* Main Image */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative overflow-hidden aspect-[16/10] border border-white/[0.06] rounded-sm"
              >
                <img
                  src={vehicle.image}
                  alt={`${vehicle.make} ${vehicle.model}`}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-carbon-950/40 to-transparent pointer-events-none" />
                {/* Back button overlay */}
                <Link
                  to="/mansour-motors/vehicules"
                  className="absolute top-5 left-5 flex items-center gap-2 bg-carbon-950/70 backdrop-blur-xl border border-white/10 px-4 py-2 font-motors text-[10px] font-bold uppercase tracking-widest text-silver-300 transition-all hover:border-cyan-400/30 hover:text-cyan-400 rounded-sm"
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
                <h2 className="font-motors-display text-2xl font-bold uppercase tracking-tight text-white md:text-3xl">
                  À propos de ce <span className="gradient-text-cyan">véhicule</span>
                </h2>
                <div className="space-y-4 font-motors text-base font-light leading-relaxed text-silver-400">
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
                <h3 className="mb-8 font-motors text-[10px] font-bold uppercase tracking-[0.25em] text-cyan-400">
                  Caractéristiques Techniques
                </h3>
                <div className="grid grid-cols-2 gap-5 md:grid-cols-3">
                  {specs.map((spec, index) => (
                    <motion.div
                      key={spec.label}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.05 }}
                      className="group flex items-start gap-3 cursor-default"
                    >
                      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center border border-white/[0.06] bg-carbon-800 text-cyan-400/60 transition-all duration-300 group-hover:border-cyan-400/30 group-hover:text-cyan-400 group-hover:shadow-[0_0_12px_rgba(0,229,255,0.15)] rounded-sm">
                        <spec.icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-motors text-[10px] font-bold uppercase tracking-[0.15em] text-silver-600 mb-1 transition-colors duration-300 group-hover:text-cyan-400">
                          {spec.label}
                        </p>
                        <p className="font-motors text-sm font-medium text-silver-200 break-all">{spec.value}</p>
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
                className="sticky top-28 space-y-6"
              >
                {/* Header Info */}
                <div>
                  <h1 className="font-motors text-2xl font-bold text-white leading-tight lg:text-3xl">
                    {vehicle.make}{' '}
                    <span className="text-cyan-400">{vehicle.model}</span>
                  </h1>
                  <p className="mt-3 font-motors text-2xl font-bold text-white tracking-tight lg:text-3xl">
                    {formatPrice(vehicle.price)}
                  </p>
                  <div className="mt-4">
                    {vehicle.status === 'available' ? (
                      <span className="inline-flex items-center gap-1.5 bg-carbon-800 border border-cyan-400/20 px-3 py-1.5 font-motors text-[10px] font-bold uppercase tracking-[0.15em] text-cyan-400 rounded-sm">
                        <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(0,229,255,0.6)]" />
                        Disponible immédiatement
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 bg-carbon-800 border border-white/10 px-3 py-1.5 font-motors text-[10px] font-bold uppercase tracking-[0.15em] text-silver-400 rounded-sm">
                        {vehicle.status === 'reserved' ? 'Réservé' : 'Vendu'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Contact Form */}
                <div className="border border-white/[0.06] bg-carbon-900 p-6 rounded-sm">
                  <h3 className="mb-1.5 font-motors text-lg font-bold text-white">Acquérir ce véhicule</h3>
                  <p className="mb-5 font-motors text-xs font-light text-silver-500">
                    Un conseiller vous recontactera sous 24h.
                  </p>

                  <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
                    <input
                      type="text"
                      placeholder="Nom complet"
                      className="w-full border border-white/[0.06] bg-carbon-800 px-4 py-3 font-motors text-sm text-silver-200 placeholder-silver-600 focus:border-cyan-400/40 focus:outline-none focus:ring-1 focus:ring-cyan-400/20 transition-all rounded-sm"
                    />
                    <input
                      type="tel"
                      placeholder="Téléphone"
                      className="w-full border border-white/[0.06] bg-carbon-800 px-4 py-3 font-motors text-sm text-silver-200 placeholder-silver-600 focus:border-cyan-400/40 focus:outline-none focus:ring-1 focus:ring-cyan-400/20 transition-all rounded-sm"
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      className="w-full border border-white/[0.06] bg-carbon-800 px-4 py-3 font-motors text-sm text-silver-200 placeholder-silver-600 focus:border-cyan-400/40 focus:outline-none focus:ring-1 focus:ring-cyan-400/20 transition-all rounded-sm"
                    />
                    <textarea
                      rows={3}
                      placeholder="Message (facultatif)"
                      className="w-full border border-white/[0.06] bg-carbon-800 px-4 py-3 font-motors text-sm text-silver-200 placeholder-silver-600 focus:border-cyan-400/40 focus:outline-none focus:ring-1 focus:ring-cyan-400/20 transition-all resize-none rounded-sm"
                    />
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-cyan-400 px-6 py-3.5 font-motors text-[10px] font-bold uppercase tracking-[0.2em] text-carbon-950 transition-all hover:shadow-[0_0_25px_rgba(0,229,255,0.3)] mt-2 rounded-sm"
                    >
                      Demander un rendez-vous
                    </motion.button>
                  </form>
                </div>

                {/* Direct Contact */}
                <div className="space-y-4">
                  <p className="font-motors text-[10px] font-bold uppercase tracking-[0.25em] text-cyan-400">
                    Contact Direct
                  </p>
                  <div className="space-y-3">
                    <a href="tel:+221331234567" className="flex items-center gap-3 group">
                      <div className="flex h-9 w-9 items-center justify-center border border-white/[0.06] bg-carbon-800 text-cyan-400/60 transition-all duration-300 group-hover:border-cyan-400/30 group-hover:text-cyan-400 group-hover:shadow-[0_0_12px_rgba(0,229,255,0.15)] rounded-sm">
                        <TelephoneIcon className="h-4 w-4" />
                      </div>
                      <span className="font-motors text-sm text-silver-400 transition-colors duration-300 group-hover:text-cyan-400 font-medium">
                        +221 33 123 45 67
                      </span>
                    </a>
                    <a href="mailto:motors@mansour.sn" className="flex items-center gap-3 group">
                      <div className="flex h-9 w-9 items-center justify-center border border-white/[0.06] bg-carbon-800 text-cyan-400/60 transition-all duration-300 group-hover:border-cyan-400/30 group-hover:text-cyan-400 group-hover:shadow-[0_0_12px_rgba(0,229,255,0.15)] rounded-sm">
                        <Mail01Icon className="h-4 w-4" />
                      </div>
                      <span className="font-motors text-sm text-silver-400 transition-colors duration-300 group-hover:text-cyan-400 font-medium">
                        motors@mansour.sn
                      </span>
                    </a>
                    <a href="https://wa.me/221771234567" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 group">
                      <div className="flex h-9 w-9 items-center justify-center border border-white/[0.06] bg-carbon-800 text-cyan-400/60 transition-all duration-300 group-hover:border-cyan-400/30 group-hover:text-cyan-400 group-hover:shadow-[0_0_12px_rgba(0,229,255,0.15)] rounded-sm">
                        <WhatsappIcon className="h-4 w-4" />
                      </div>
                      <span className="font-motors text-sm text-silver-400 transition-colors duration-300 group-hover:text-cyan-400 font-medium">
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
      <section className="bg-carbon-900 border-t border-white/[0.04] px-6 py-16 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <motion.span
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="mb-3 flex items-center gap-3"
              >
                <span className="h-px w-6 bg-cyan-400" />
                <span className="font-motors text-[10px] font-bold uppercase tracking-[0.25em] text-cyan-400">
                  Découvrir plus
                </span>
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="font-motors-display text-2xl font-bold uppercase tracking-tight text-white md:text-3xl"
              >
                Autres <span className="gradient-text-cyan">Véhicules</span>
              </motion.h2>
            </div>
            <Link
              to="/mansour-motors/vehicules"
              className="group hidden items-center gap-2 font-motors text-xs font-bold uppercase tracking-[0.15em] text-silver-400 transition-colors hover:text-cyan-400 sm:inline-flex"
            >
              Tout voir
              <ArrowRight01Icon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
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
                    className="group w-[300px] flex-shrink-0 snap-start"
                  >
                    <Link
                      to="/mansour-motors/vehicules/$vehicleId"
                      params={{ vehicleId: otherVehicle.id }}
                      className="block"
                    >
                      <div className="overflow-hidden border border-white/[0.06] bg-carbon-800 transition-all duration-500 hover:border-cyan-400/20 hover:shadow-[0_0_30px_rgba(0,229,255,0.06)] rounded-sm">
                        <div className="relative aspect-[16/10] overflow-hidden">
                          <img
                            src={otherVehicle.image}
                            alt={`${otherVehicle.make} ${otherVehicle.model}`}
                            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-carbon-950 via-carbon-950/30 to-transparent opacity-70" />
                          <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                            <h3 className="font-motors text-base font-bold text-white">
                              {otherVehicle.make}{' '}
                              <span className="text-cyan-400">{otherVehicle.model}</span>
                            </h3>
                            <p className="font-motors text-[10px] font-medium uppercase tracking-[0.12em] text-silver-400 mt-1">
                              {otherVehicle.year} <span className="text-cyan-400/40">·</span> {otherVehicle.transmission}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between p-4 border-t border-white/[0.04]">
                          <p className="font-motors text-base font-bold text-white">
                            {formatPrice(otherVehicle.price)}
                          </p>
                          <span className="flex h-8 w-8 items-center justify-center border border-white/[0.08] text-silver-500 transition-all duration-400 group-hover:border-cyan-400 group-hover:text-cyan-400 group-hover:shadow-[0_0_10px_rgba(0,229,255,0.2)] rounded-sm">
                            <ArrowRight01Icon className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-rotate-45" />
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
              className="group inline-flex items-center gap-2 font-motors text-xs font-bold uppercase tracking-[0.15em] text-cyan-400 transition-colors hover:text-white"
            >
              Tout voir
              <ArrowRight01Icon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      <MotorsFooter />
    </div>
  )
}
