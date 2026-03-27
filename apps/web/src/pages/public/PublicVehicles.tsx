import { useState, useMemo } from 'react'
import { Link } from '@tanstack/react-router'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search01Icon,
  FilterIcon,
  ArrowDown01Icon,
  Calendar01Icon,
  Fuel01Icon,
  SteeringIcon,
  ArrowRight01Icon,
  Cancel01Icon,
  Car01Icon,
  ArrowLeft01Icon,
  ArrowRight02Icon,
} from 'hugeicons-react'
import { vehicles } from '@/data/mock'
import { formatPrice, cn } from '@/lib/utils'
import { MotorsNavbar } from '@/components/motors/MotorsNavbar'
import { MotorsFooter } from '@/components/motors/MotorsFooter'

// Cinematic hero background for the vehicles page
const HERO_IMAGE = 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2800&auto=format&fit=crop'

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  options: string[]
}) {
  return (
    <div className="relative group w-full">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none border border-noir-200 bg-white px-4 py-3 pr-10 font-motors text-sm font-medium text-noir-900 focus:border-gold-400 focus:outline-none focus:ring-1 focus:ring-gold-400/20 transition-all"
      >
        <option value="">{label}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <ArrowDown01Icon
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-noir-400 h-3.5 w-3.5 group-hover:text-gold-600 transition-colors"
      />
    </div>
  )
}

function VehicleCard({ vehicle, index }: { vehicle: typeof vehicles[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        delay: index * 0.08,
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1]
      }}
      className="group"
    >
      <Link
        to="/mansour-motors/vehicules/$vehicleId"
        params={{ vehicleId: vehicle.id }}
        className="block"
      >
        <div className="relative overflow-hidden bg-white transition-all duration-500 hover:shadow-2xl">
          {/* Image container with cinematic aspect */}
          <div className="relative aspect-[16/10] overflow-hidden">
            <motion.img
              src={vehicle.image}
              alt={`${vehicle.make} ${vehicle.model}`}
              className="h-full w-full object-cover"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            />

            {/* Cinematic gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-noir-950/80 via-noir-950/20 to-transparent" />

            {/* Status badge - floating */}
            <div className="absolute top-4 right-4">
              {vehicle.status === 'available' ? (
                <span className="inline-flex items-center gap-1.5 bg-emerald-500/90 px-3 py-1.5 font-motors text-[10px] font-bold uppercase tracking-[0.15em] text-white backdrop-blur-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                  Disponible
                </span>
              ) : vehicle.status === 'reserved' ? (
                <span className="bg-amber-500/90 text-white px-3 py-1.5 font-motors text-[10px] font-bold uppercase tracking-[0.15em] backdrop-blur-sm">
                  Réservé
                </span>
              ) : (
                <span className="bg-noir-500/90 text-white px-3 py-1.5 font-motors text-[10px] font-bold uppercase tracking-[0.15em] backdrop-blur-sm">
                  Vendu
                </span>
              )}
            </div>

            {/* Vehicle info overlay - bottom */}
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <h3 className="font-motors-display text-xl font-medium text-white tracking-wide">
                {vehicle.make}{' '}
                <span className="text-white/70">{vehicle.model}</span>
              </h3>
              <div className="mt-2 flex flex-wrap items-center gap-4 font-motors text-[10px] font-medium uppercase tracking-[0.12em] text-white/60">
                <span className="flex items-center gap-1.5">
                  <Calendar01Icon className="h-3 w-3" /> {vehicle.year}
                </span>
                <span className="w-1 h-1 rounded-full bg-white/30" />
                <span className="flex items-center gap-1.5">
                  <Fuel01Icon className="h-3 w-3" /> {vehicle.fuelType}
                </span>
                <span className="w-1 h-1 rounded-full bg-white/30" />
                <span className="flex items-center gap-1.5">
                  <SteeringIcon className="h-3 w-3" /> {vehicle.transmission}
                </span>
              </div>
            </div>

            {/* Hover reveal - price and CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileHover={{ opacity: 1, y: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-noir-950/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              <span className="flex items-center gap-2 font-motors text-[11px] font-bold uppercase tracking-[0.2em] text-white">
                Voir les détails
                <ArrowRight01Icon className="h-4 w-4" />
              </span>
            </motion.div>
          </div>

          {/* Card footer - price */}
          <div className="flex items-center justify-between px-5 py-4 bg-white border-t border-noir-100">
            <div>
              <p className="font-motors text-[10px] font-medium uppercase tracking-[0.15em] text-noir-400 mb-0.5">Prix</p>
              <span className="font-motors-display text-xl font-medium text-noir-950">
                {formatPrice(vehicle.price)}
              </span>
            </div>
            <span className="flex h-10 w-10 items-center justify-center bg-gold-50 text-gold-600 transition-all duration-300 group-hover:bg-gold-400 group-hover:text-noir-950">
              <ArrowRight01Icon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

function ActiveFilterPill({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="inline-flex items-center gap-2 bg-gold-50 border border-gold-200 px-3 py-1.5 font-motors text-[11px] text-noir-800"
    >
      {label}
      <button
        onClick={onRemove}
        className="text-noir-400 hover:text-noir-700 transition-colors"
      >
        <Cancel01Icon className="h-3 w-3" />
      </button>
    </motion.span>
  )
}

export function PublicVehicles() {
  const [search, setSearch] = useState('')
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)

  const [make, setMake] = useState('')
  const [year, setYear] = useState('')
  const [fuelType, setFuelType] = useState('')
  const [transmission, setTransmission] = useState('')
  const [priceMax, setPriceMax] = useState('')

  const makes = useMemo(() => Array.from(new Set(vehicles.map(v => v.make))).sort(), [])
  const years = useMemo(() => Array.from(new Set(vehicles.map(v => v.year))).sort((a, b) => b - a), [])
  const fuelTypes = useMemo(() => Array.from(new Set(vehicles.map(v => v.fuelType))).sort(), [])
  const transmissions = useMemo(() => Array.from(new Set(vehicles.map(v => v.transmission))).sort(), [])

  const filteredVehicles = useMemo(() => {
    return vehicles.filter(v => {
      const q = search.toLowerCase()
      const matchesSearch =
        v.make.toLowerCase().includes(q) ||
        v.model.toLowerCase().includes(q) ||
        v.year.toString().includes(q)

      const matchesMake = make ? v.make === make : true
      const matchesYear = year ? v.year.toString() === year : true
      const matchesFuel = fuelType ? v.fuelType === fuelType : true
      const matchesTransmission = transmission ? v.transmission === transmission : true
      const matchesPrice = priceMax ? v.price <= parseInt(priceMax) : true

      return matchesSearch && matchesMake && matchesYear && matchesFuel && matchesTransmission && matchesPrice
    }).sort((a, b) => {
      if (a.status === 'available' && b.status !== 'available') return -1
      if (a.status !== 'available' && b.status === 'available') return 1
      return 0
    })
  }, [search, make, year, fuelType, transmission, priceMax])

  const activeFilters = [
    make && { label: make, clear: () => setMake('') },
    year && { label: year, clear: () => setYear('') },
    fuelType && { label: fuelType, clear: () => setFuelType('') },
    transmission && { label: transmission, clear: () => setTransmission('') },
    priceMax && { label: `Max ${formatPrice(parseInt(priceMax))}`, clear: () => setPriceMax('') },
  ].filter(Boolean) as { label: string; clear: () => void }[]

  const clearFilters = () => {
    setMake('')
    setYear('')
    setFuelType('')
    setTransmission('')
    setPriceMax('')
  }

  return (
    <div className="motors-theme min-h-screen bg-white font-motors">
      <MotorsNavbar />

      {/* Cinematic Dark Hero */}
      <section className="relative h-[50vh] min-h-[380px] w-full overflow-hidden lg:h-[55vh]">
        {/* Background Image */}
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0"
        >
          <img
            src={HERO_IMAGE}
            alt="Premium vehicles"
            className="h-full w-full object-cover"
          />
        </motion.div>

        {/* Cinematic overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-carbon-950 via-carbon-950/60 to-carbon-950/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-carbon-950/80 via-transparent to-carbon-950/40" />

        {/* Content */}
        <div className="relative h-full flex flex-col justify-end px-6 pb-12 lg:px-16 lg:pb-16">
          <div className="mx-auto max-w-7xl w-full">
            {/* Breadcrumb */}
            <motion.nav
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-6 flex items-center gap-2 font-motors text-[11px] font-medium uppercase tracking-[0.12em]"
            >
              <Link to="/mansour-motors" className="text-silver-400 hover:text-gold-400 transition-colors">
                Motors
              </Link>
              <ArrowRight02Icon className="h-3 w-3 text-silver-600" />
              <span className="text-silver-200">Catalogue</span>
            </motion.nav>

            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="mb-3 block font-motors text-[11px] font-medium uppercase tracking-[0.3em] text-gold-400">
                Collection Premium
              </span>
              <h1 className="font-motors-display text-4xl uppercase tracking-[0.02em] text-white md:text-5xl lg:text-6xl">
                Nos <span className="text-silver-400">Véhicules</span>
              </h1>
              <p className="mt-4 max-w-md font-motors text-base font-light text-silver-300 md:text-lg">
                Une sélection rigoureuse de véhicules d'exception, inspectés et certifiés Mansour Motors.
              </p>
            </motion.div>

            {/* Back link */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-8"
            >
              <Link
                to="/mansour-motors"
                className="inline-flex items-center gap-2 font-motors text-[11px] font-medium uppercase tracking-[0.15em] text-silver-400 hover:text-white transition-colors"
              >
                <ArrowLeft01Icon className="h-3.5 w-3.5" />
                Retour à l'accueil
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Vehicle Count Bar */}
      <section className="border-b border-noir-100 bg-surface-dim">
        <div className="mx-auto max-w-7xl px-6 py-4 lg:px-16">
          <div className="flex items-center justify-between">
            <p className="font-motors text-[11px] font-medium uppercase tracking-[0.15em] text-noir-500">
              <span className="text-noir-950 font-semibold">{filteredVehicles.length}</span> véhicule{filteredVehicles.length !== 1 ? 's' : ''} disponible{filteredVehicles.length !== 1 ? 's' : ''}
            </p>
            {activeFilters.length > 0 && (
              <button
                onClick={clearFilters}
                className="font-motors text-[11px] font-medium uppercase tracking-[0.1em] text-noir-400 hover:text-gold-600 transition-colors"
              >
                Réinitialiser les filtres
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Main Content - Light Section */}
      <main className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-16 lg:py-14">
          {/* Search & Filter Controls */}
          <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Search */}
            <div className="relative w-full max-w-md">
              <Search01Icon className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-noir-400" />
              <input
                type="text"
                placeholder="Rechercher par marque ou modèle"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border border-noir-200 bg-white py-3 pl-11 pr-4 font-motors text-sm text-noir-900 placeholder-noir-400 focus:border-gold-400 focus:outline-none focus:ring-1 focus:ring-gold-400/20 transition-all"
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setIsFiltersOpen(!isFiltersOpen)}
              className={cn(
                'flex items-center gap-2 border px-5 py-3 font-motors text-[11px] font-bold uppercase tracking-[0.12em] transition-all duration-300',
                isFiltersOpen || activeFilters.length > 0
                  ? 'border-gold-400 bg-gold-400 text-noir-950'
                  : 'border-noir-200 bg-white text-noir-600 hover:border-noir-300 hover:text-noir-900'
              )}
            >
              <FilterIcon className="h-3.5 w-3.5" />
              Filtres
              {activeFilters.length > 0 && (
                <span className="ml-1 flex h-5 w-5 items-center justify-center bg-noir-950 text-white text-[10px] rounded-full">
                  {activeFilters.length}
                </span>
              )}
            </button>
          </div>

          {/* Active Filters */}
          <AnimatePresence>
            {activeFilters.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 flex flex-wrap items-center gap-2"
              >
                <span className="font-motors text-[11px] uppercase tracking-[0.1em] text-noir-400 mr-2">Filtres actifs :</span>
                {activeFilters.map((filter, i) => (
                  <ActiveFilterPill key={i} label={filter.label} onRemove={filter.clear} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Filter Panel */}
          <AnimatePresence>
            {isFiltersOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="mb-10 overflow-hidden"
              >
                <div className="border border-noir-200 bg-surface-dim p-6">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
                    <FilterSelect label="Toutes les marques" value={make} onChange={setMake} options={makes} />
                    <FilterSelect label="Toutes les années" value={year} onChange={setYear} options={years.map(String)} />
                    <FilterSelect label="Tous les carburants" value={fuelType} onChange={setFuelType} options={fuelTypes} />
                    <FilterSelect label="Toutes les transmissions" value={transmission} onChange={setTransmission} options={transmissions} />
                    <div className="relative w-full">
                      <input
                        type="number"
                        placeholder="Prix maximum (F CFA)"
                        value={priceMax}
                        onChange={(e) => setPriceMax(e.target.value)}
                        className="w-full border border-noir-200 bg-white px-4 py-3 font-motors text-sm text-noir-900 placeholder-noir-400 focus:border-gold-400 focus:outline-none focus:ring-1 focus:ring-gold-400/20 transition-all"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Vehicle Grid */}
          <div className="min-h-[400px]">
            {filteredVehicles.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredVehicles.map((vehicle, i) => (
                  <VehicleCard key={vehicle.id} vehicle={vehicle} index={i} />
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-24 text-center"
              >
                <div className="mb-6 flex h-20 w-20 items-center justify-center border border-noir-200 bg-surface-dim">
                  <Car01Icon className="h-8 w-8 text-noir-400" />
                </div>
                <h3 className="font-motors-display text-xl uppercase tracking-wide text-noir-950">Aucun résultat</h3>
                <p className="mt-3 max-w-sm font-motors text-sm text-noir-500">
                  Aucun véhicule ne correspond à vos critères actuels.
                </p>
                <button
                  onClick={clearFilters}
                  className="mt-6 border border-noir-200 bg-white px-6 py-3 font-motors text-[11px] font-bold uppercase tracking-widest text-noir-600 transition-all hover:border-gold-400 hover:text-gold-600"
                >
                  Réinitialiser les filtres
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </main>

      <MotorsFooter />
    </div>
  )
}
