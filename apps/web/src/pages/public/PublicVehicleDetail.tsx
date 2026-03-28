import { Link, useParams } from '@tanstack/react-router'
import { useRef, useState, useCallback, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
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
  CheckmarkCircle01Icon,
  Clock01Icon,
  Tag01Icon,
  StarIcon,
} from 'hugeicons-react'
import { vehicles as mockVehicles } from '@/data/mock'
import { vehiclesApi, publicVehiclesApi, type ApiVehicle } from '@/lib/api'
import { formatPrice, formatNumber, cn } from '@/lib/utils'
import { MotorsNavbar } from '@/components/motors/MotorsNavbar'
import { MotorsFooter } from '@/components/motors/MotorsFooter'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'

const fuelLabels: Record<string, string> = {
  gasoline: 'Essence', diesel: 'Diesel', hybrid: 'Hybride', electric: 'Électrique',
}
const transLabels: Record<string, string> = {
  manual: 'Manuelle', automatic: 'Automatique', cvt: 'CVT',
}

// Normalise mock or API vehicle into a common shape
interface NormVehicle {
  id: string
  make: string
  model: string
  year: number
  mileage: number
  price: number
  status: 'available' | 'reserved' | 'sold'
  fuelType: string
  transmission: string
  color: string
  vin: string | null
  description: string | null
  images: string[]
  extras: Record<string, string>
}

function normFromApi(v: ApiVehicle): NormVehicle {
  return { ...v, extras: v.extras ?? {} }
}

function normFromMock(v: typeof mockVehicles[0]): NormVehicle {
  return {
    id: v.id, make: v.make, model: v.model, year: v.year,
    mileage: v.mileage, price: v.price,
    status: v.status as NormVehicle['status'],
    fuelType: v.fuelType, transmission: v.transmission,
    color: v.color, vin: v.vin ?? null, description: v.description ?? null,
    images: v.images ?? (v.image ? [v.image] : []),
    extras: {},
  }
}

export function PublicVehicleDetail() {
  const { vehicleId } = useParams({ strict: false })
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start']
  })
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [direction, setDirection] = useState(0)

  // Try API first (UUID), fall back to mock (v1, v2…)
  const isUUID = vehicleId ? /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(vehicleId) : false

  const { data: vehicle, isLoading, isError } = useQuery({
    queryKey: ['public-vehicle', vehicleId],
    queryFn: async (): Promise<NormVehicle> => {
      if (isUUID) {
        const v = await vehiclesApi.get(vehicleId!)
        return normFromApi(v)
      }
      const mock = mockVehicles.find((v) => v.id === vehicleId)
      if (mock) return normFromMock(mock)
      throw new Error('Not found')
    },
    enabled: !!vehicleId,
    staleTime: 60_000,
  })

  // Fetch related available vehicles from API
  const { data: relatedData } = useQuery({
    queryKey: ['public-related-vehicles', vehicleId],
    queryFn: () => publicVehiclesApi.list({ limit: 6, status: 'available' }),
    staleTime: 60_000,
  })
  const relatedVehicles = (relatedData?.data ?? []).filter(v => v.id !== vehicleId).slice(0, 5)

  const allImages = useMemo(() =>
    vehicle?.images?.length ? vehicle.images : []
  , [vehicle])

  const nextImage = useCallback(() => {
    setDirection(1)
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length)
  }, [allImages.length])

  const prevImage = useCallback(() => {
    setDirection(-1)
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length)
  }, [allImages.length])

  const slideVariants = {
    enter: (direction: number) => ({ x: direction > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (direction: number) => ({ x: direction < 0 ? '100%' : '-100%', opacity: 0 }),
  }

  if (isError || (!vehicle && !isLoading)) {
    return (
      <div className="motors-theme min-h-screen bg-carbon-950 font-motors text-silver-100 flex flex-col">
        <MotorsNavbar />
        <div className="flex flex-1 flex-col items-center justify-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center border border-white/[0.06] bg-carbon-900">
            <Car01Icon className="h-8 w-8 text-silver-600" />
          </div>
          <p className="font-motors-display text-xl uppercase tracking-wide text-white">Véhicule non trouvé</p>
          <Link to="/mansour-motors/vehicules" className="mt-4 font-motors text-xs font-bold uppercase tracking-widest text-gold-600 hover:text-gold-500 transition-colors">
            Retour au catalogue
          </Link>
        </div>
        <MotorsFooter />
      </div>
    )
  }

  // Loading state
  if (isLoading || !vehicle) {
    return (
      <div className="motors-theme min-h-screen bg-carbon-950 font-motors flex flex-col">
        <MotorsNavbar />
        <div className="flex flex-1 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gold-400" />
        </div>
        <MotorsFooter />
      </div>
    )
  }

  const coreSpecs = [
    { label: 'Année', value: vehicle.year.toString(), icon: Calendar01Icon },
    { label: 'Kilométrage', value: `${formatNumber(vehicle.mileage)} km`, icon: DashboardSpeed01Icon },
    { label: 'Carburant', value: fuelLabels[vehicle.fuelType] ?? vehicle.fuelType, icon: Fuel01Icon },
    { label: 'Transmission', value: transLabels[vehicle.transmission] ?? vehicle.transmission, icon: SteeringIcon },
    { label: 'Couleur', value: vehicle.color, icon: PaintBoardIcon },
    ...(vehicle.vin ? [{ label: 'VIN', value: vehicle.vin, icon: HashtagIcon }] : []),
  ]

  const extras = Object.entries(vehicle.extras ?? {})

  const statusConfig = {
    available: {
      icon: CheckmarkCircle01Icon,
      label: 'Disponible immédiatement',
      className: 'bg-emerald-500 text-white',
      pulse: true,
    },
    reserved: {
      icon: Clock01Icon,
      label: 'Réservé',
      className: 'bg-amber-500 text-white',
      pulse: false,
    },
    sold: {
      icon: Tag01Icon,
      label: 'Vendu',
      className: 'bg-noir-500 text-white',
      pulse: false,
    },
  }
  const status = statusConfig[vehicle.status as keyof typeof statusConfig] || statusConfig.sold

  return (
    <div ref={containerRef} className="motors-theme min-h-screen bg-white font-motors">
      <MotorsNavbar />

      {/* Full-bleed Hero Image Slider with Parallax */}
      <section className="relative h-[60vh] min-h-[400px] w-full overflow-hidden lg:h-[70vh]">
        {/* Image Slider */}
        <motion.div
          style={{ y: heroY }}
          className="absolute inset-0 -top-20"
        >
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.div
              key={currentImageIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0"
            >
              <img
                src={allImages[currentImageIndex]}
                alt={`${vehicle.make} ${vehicle.model} - Image ${currentImageIndex + 1}`}
                className="h-full w-full object-cover"
              />
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Cinematic overlays with scroll-based opacity */}
        <motion.div
          style={{ opacity: heroOpacity }}
          className="absolute inset-0 bg-gradient-to-t from-carbon-950 via-carbon-950/50 to-carbon-950/30"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-carbon-950/70 via-transparent to-carbon-950/30" />

        {/* Back button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Link
            to="/mansour-motors/vehicules"
            className="absolute top-24 left-6 z-10 flex items-center gap-2 border border-white/10 bg-carbon-950/60 px-4 py-2.5 font-motors text-[10px] font-bold uppercase tracking-[0.15em] text-silver-300 backdrop-blur-sm transition-all hover:border-gold-400/50 hover:text-white lg:left-16"
          >
            <ArrowLeft01Icon className="h-3.5 w-3.5" />
            Catalogue
          </Link>
        </motion.div>

        {/* Slider Navigation - Only show when multiple images */}
        {allImages.length > 1 && (
          <>
            {/* Previous Button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 flex h-12 w-12 items-center justify-center bg-carbon-950/60 text-white backdrop-blur-sm border border-white/10 transition-all hover:bg-gold-400 hover:text-noir-950 hover:border-gold-400 lg:left-8"
            >
              <ArrowLeft01Icon className="h-5 w-5" />
            </motion.button>

            {/* Next Button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 flex h-12 w-12 items-center justify-center bg-carbon-950/60 text-white backdrop-blur-sm border border-white/10 transition-all hover:bg-gold-400 hover:text-noir-950 hover:border-gold-400 lg:right-8"
            >
              <ArrowRight01Icon className="h-5 w-5" />
            </motion.button>

            {/* Image Counter / Dots */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="absolute bottom-28 right-6 z-20 flex items-center gap-2 lg:right-16"
            >
              {allImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setDirection(index > currentImageIndex ? 1 : -1)
                    setCurrentImageIndex(index)
                  }}
                  className={cn(
                    'h-1.5 transition-all duration-300',
                    index === currentImageIndex
                      ? 'w-8 bg-gold-400'
                      : 'w-1.5 bg-white/50 hover:bg-white/80'
                  )}
                />
              ))}
            </motion.div>

            {/* Image Count Badge */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="absolute top-24 right-6 z-20 bg-carbon-950/60 px-3 py-1.5 backdrop-blur-sm border border-white/10 lg:right-16"
            >
              <span className="font-motors text-[11px] font-medium text-white">
                {currentImageIndex + 1} / {allImages.length}
              </span>
            </motion.div>
          </>
        )}

        {/* Vehicle name overlay */}
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-10 lg:px-16 lg:pb-14">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <nav className="mb-4 flex items-center gap-2 font-motors text-[11px] font-medium uppercase tracking-[0.15em]">
              <Link to="/mansour-motors" className="text-silver-500 hover:text-gold-400 transition-colors">
                Motors
              </Link>
              <ArrowRight02Icon className="h-3 w-3 text-silver-600" />
              <Link to="/mansour-motors/vehicules" className="text-silver-500 hover:text-gold-400 transition-colors">
                Véhicules
              </Link>
              <ArrowRight02Icon className="h-3 w-3 text-silver-600" />
              <span className="text-silver-300">{vehicle.make} {vehicle.model}</span>
            </nav>
            <h1 className="font-motors-display text-3xl uppercase tracking-[0.02em] text-white sm:text-4xl md:text-5xl lg:text-6xl">
              {vehicle.make}{' '}
              <span className="text-silver-400">{vehicle.model}</span>
            </h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-3 font-motors text-sm text-silver-400 uppercase tracking-[0.1em]"
            >
              {vehicle.year} · {vehicle.transmission} · {vehicle.fuelType}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Specs Strip - Refined */}
      <section className="relative bg-carbon-900">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-400/30 to-transparent" />
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 divide-x divide-white/[0.04]">
            {coreSpecs.map((spec, index) => (
              <motion.div
                key={spec.label}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.06, ease: [0.16, 1, 0.3, 1] }}
                className="group flex flex-col items-center justify-center px-4 py-7 text-center transition-all duration-300 hover:bg-white/[0.03]"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center border border-white/[0.08] transition-all duration-300 group-hover:border-gold-400/40 group-hover:bg-gold-400/10">
                  <spec.icon className="h-4 w-4 text-silver-500 transition-colors duration-300 group-hover:text-gold-400" />
                </div>
                <p className="font-motors text-[10px] font-medium uppercase tracking-[0.2em] text-silver-600 mb-1">{spec.label}</p>
                <p className="font-motors text-sm font-bold text-white">{spec.value}</p>
              </motion.div>
            ))}
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold-400/30 to-transparent" />
      </section>

      {/* Main Content — Light section */}
      <main className="px-6 py-16 lg:px-16 lg:py-24 bg-white">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            {/* Left: Description & Details */}
            <div className="lg:col-span-7 space-y-12">
              {/* Price & Status - Using status config */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-noir-100 pb-8"
              >
                <div>
                  <p className="font-motors text-[10px] font-medium uppercase tracking-[0.2em] text-noir-400 mb-1">Prix</p>
                  <p className="font-motors-display text-3xl text-noir-950 lg:text-4xl">
                    {formatPrice(vehicle.price)}
                  </p>
                </div>
                <div>
                  <span className={cn(
                    "inline-flex items-center gap-2 px-4 py-2.5 font-motors text-[10px] font-bold uppercase tracking-[0.15em]",
                    status.className
                  )}>
                    {status.pulse && <span className="h-2 w-2 rounded-full bg-white animate-pulse" />}
                    <status.icon className="h-3.5 w-3.5" />
                    {status.label}
                  </span>
                </div>
              </motion.div>

              {/* Description - Editorial styling */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-4">
                  <div className="h-px flex-1 bg-noir-200" />
                  <h2 className="font-motors-display text-lg uppercase tracking-[0.08em] text-gold-600">
                    Description
                  </h2>
                  <div className="h-px flex-1 bg-noir-200" />
                </div>
                <div className="space-y-4 font-motors text-base font-light leading-[1.8] text-noir-600">
                  <p className="text-lg text-noir-800 font-light">{vehicle.description}</p>
                  <p>
                    Ce véhicule incarne le standard de qualité Mansour Motors. Chaque unité est inspectée rigoureusement
                    sur plus de 100 points de contrôle par nos techniciens certifiés. Il bénéficie de notre garantie d'excellence
                    et d'un service après-vente premium.
                  </p>
                  <p className="text-noir-500 italic">
                    Une opportunité rare d'acquérir une pièce d'exception, disponible immédiatement dans notre showroom de Dakar.
                  </p>
                </div>
              </motion.div>

              {/* Extras / Équipements — only if present */}
              {extras.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-px flex-1 bg-noir-200" />
                    <h2 className="font-motors-display text-lg uppercase tracking-[0.08em] text-gold-600">
                      Équipements
                    </h2>
                    <div className="h-px flex-1 bg-noir-200" />
                  </div>
                  <div className="grid grid-cols-1 gap-px bg-noir-100 sm:grid-cols-2">
                    {extras.map(([key, value], i) => (
                      <motion.div
                        key={key}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.35 + i * 0.05 }}
                        className="flex items-center justify-between bg-white px-5 py-4"
                      >
                        <div className="flex items-center gap-3">
                          <StarIcon className="h-3.5 w-3.5 text-gold-400" />
                          <span className="font-motors text-sm text-noir-600">{key}</span>
                        </div>
                        <span className="font-motors text-sm font-semibold text-noir-950">{value}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Right: Sticky Sidebar */}
            <div className="lg:col-span-5">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="sticky top-28 space-y-8"
              >
                {/* Contact Form - Refined */}
                <div className="relative border border-noir-200 bg-surface-dim p-7 overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gold-400/50 to-transparent" />
                  <h3 className="mb-1.5 font-motors-display text-lg uppercase tracking-[0.04em] text-noir-950">
                    Demander des informations
                  </h3>
                  <p className="mb-6 font-motors text-xs font-light text-noir-500">
                    Un conseiller privé vous recontactera sous 24h.
                  </p>

                  <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Nom complet"
                        className="w-full border border-noir-200 bg-white px-4 py-3.5 font-motors text-sm text-noir-900 placeholder-noir-400 focus:border-gold-400 focus:outline-none focus:ring-1 focus:ring-gold-400/20 transition-all"
                      />
                    </div>
                    <div className="relative">
                      <input
                        type="tel"
                        placeholder="Téléphone"
                        className="w-full border border-noir-200 bg-white px-4 py-3.5 font-motors text-sm text-noir-900 placeholder-noir-400 focus:border-gold-400 focus:outline-none focus:ring-1 focus:ring-gold-400/20 transition-all"
                      />
                    </div>
                    <div className="relative">
                      <input
                        type="email"
                        placeholder="Email"
                        className="w-full border border-noir-200 bg-white px-4 py-3.5 font-motors text-sm text-noir-900 placeholder-noir-400 focus:border-gold-400 focus:outline-none focus:ring-1 focus:ring-gold-400/20 transition-all"
                      />
                    </div>
                    <textarea
                      rows={4}
                      placeholder="Message (facultatif)"
                      className="w-full border border-noir-200 bg-white px-4 py-3.5 font-motors text-sm text-noir-900 placeholder-noir-400 focus:border-gold-400 focus:outline-none focus:ring-1 focus:ring-gold-400/20 transition-all resize-none"
                    />
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className="w-full bg-gold-400 px-6 py-4 font-motors text-[11px] font-bold uppercase tracking-[0.2em] text-noir-950 transition-all hover:bg-gold-300 hover:shadow-gold mt-2"
                    >
                      Demander un rendez-vous
                    </motion.button>
                  </form>
                </div>

                {/* Direct Contact - Refined */}
                <div className="space-y-5">
                  <div className="flex items-center gap-4">
                    <div className="h-px flex-1 bg-noir-200" />
                    <p className="font-motors text-[11px] font-medium uppercase tracking-[0.2em] text-gold-600">
                      Contact Direct
                    </p>
                    <div className="h-px flex-1 bg-noir-200" />
                  </div>
                  <div className="space-y-4">
                    <a href="tel:+221331234567" className="flex items-center gap-4 group">
                      <div className="flex h-11 w-11 items-center justify-center border border-noir-200 text-noir-400 transition-all duration-300 group-hover:border-gold-400 group-hover:bg-gold-50 group-hover:text-gold-600">
                        <TelephoneIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-motors text-[10px] uppercase tracking-[0.1em] text-noir-400">Téléphone</p>
                        <span className="font-motors text-base text-noir-700 transition-all duration-300 group-hover:text-noir-950 font-medium">
                          +221 33 123 45 67
                        </span>
                      </div>
                    </a>
                    <a href="mailto:motors@mansour.sn" className="flex items-center gap-4 group">
                      <div className="flex h-11 w-11 items-center justify-center border border-noir-200 text-noir-400 transition-all duration-300 group-hover:border-gold-400 group-hover:bg-gold-50 group-hover:text-gold-600">
                        <Mail01Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-motors text-[10px] uppercase tracking-[0.1em] text-noir-400">Email</p>
                        <span className="font-motors text-base text-noir-700 transition-all duration-300 group-hover:text-noir-950 font-medium">
                          motors@mansour.sn
                        </span>
                      </div>
                    </a>
                    <a href="https://wa.me/221771234567" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group">
                      <div className="flex h-11 w-11 items-center justify-center border border-noir-200 text-noir-400 transition-all duration-300 group-hover:border-gold-400 group-hover:bg-gold-50 group-hover:text-gold-600">
                        <WhatsappIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-motors text-[10px] uppercase tracking-[0.1em] text-noir-400">WhatsApp</p>
                        <span className="font-motors text-base text-noir-700 transition-all duration-300 group-hover:text-noir-950 font-medium">
                          +221 77 123 45 67
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

      {/* Related Vehicles - Refined */}
      <section className="relative bg-carbon-900 px-6 py-16 lg:px-16 lg:py-24 overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-400/30 to-transparent" />
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <motion.span
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="mb-3 block font-motors text-[11px] font-medium uppercase tracking-[0.25em] text-gold-400"
              >
                Découvrir plus
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="font-motors-display text-2xl uppercase tracking-[0.02em] text-white md:text-3xl"
              >
                Autres <span className="text-silver-400">véhicules</span>
              </motion.h2>
            </div>
            <Link
              to="/mansour-motors/vehicules"
              className="group hidden items-center gap-2 font-motors text-[11px] font-bold uppercase tracking-[0.15em] text-silver-400 transition-colors hover:text-white sm:inline-flex"
            >
              Voir tout le catalogue
              <ArrowRight01Icon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="relative">
            <div className="flex gap-6 overflow-x-auto pb-4 motors-scroll-track snap-x snap-mandatory">
              {relatedVehicles.map((otherVehicle, index) => (
                  <motion.div
                    key={otherVehicle.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                    className="group w-[300px] flex-shrink-0 snap-start md:w-[340px]"
                  >
                    <Link
                      to="/mansour-motors/vehicules/$vehicleId"
                      params={{ vehicleId: otherVehicle.id }}
                      className="block"
                    >
                      <div className="relative overflow-hidden bg-carbon-950 transition-all duration-500 hover:shadow-2xl hover:shadow-gold-400/10">
                        <div className="relative aspect-[16/10] overflow-hidden">
                          {otherVehicle.images?.[0] ? (
                            <motion.img
                              src={otherVehicle.images[0]}
                              alt={`${otherVehicle.make} ${otherVehicle.model}`}
                              className="h-full w-full object-cover"
                              whileHover={{ scale: 1.05 }}
                              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                              loading="lazy"
                              decoding="async"
                            />
                          ) : (
                            <div className="h-full w-full bg-carbon-800 flex items-center justify-center">
                              <Car01Icon className="h-10 w-10 text-silver-700" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-carbon-950/90 via-carbon-950/30 to-transparent" />

                          <motion.div className="absolute inset-0 flex items-center justify-center bg-carbon-950/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <span className="flex items-center gap-2 font-motors text-[11px] font-bold uppercase tracking-[0.2em] text-white">
                              Voir détails
                              <ArrowRight01Icon className="h-4 w-4" />
                            </span>
                          </motion.div>

                          <div className="absolute bottom-0 left-0 right-0 p-5">
                            <h3 className="font-motors text-lg font-medium text-white tracking-wide">
                              {otherVehicle.make}{' '}
                              <span className="text-white/70">{otherVehicle.model}</span>
                            </h3>
                            <p className="mt-1 font-motors text-[10px] font-medium uppercase tracking-[0.12em] text-white/60">
                              {otherVehicle.year} · {transLabels[otherVehicle.transmission] ?? otherVehicle.transmission}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between px-5 py-4 bg-carbon-950 border-t border-white/[0.04]">
                          <p className="font-motors text-base font-medium text-white">
                            {formatPrice(otherVehicle.price)}
                          </p>
                          <span className="flex h-9 w-9 items-center justify-center bg-gold-400/10 text-gold-400 transition-all duration-300 group-hover:bg-gold-400 group-hover:text-carbon-950">
                            <ArrowRight01Icon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
            </div>
            <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-carbon-900 to-transparent" />
          </div>

          <div className="mt-8 sm:hidden text-center">
            <Link
              to="/mansour-motors/vehicules"
              className="group inline-flex items-center gap-2 font-motors text-[11px] font-bold uppercase tracking-[0.15em] text-gold-400 transition-colors hover:text-gold-300"
            >
              Voir tout le catalogue
              <ArrowRight01Icon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      <MotorsFooter />
    </div>
  )
}
