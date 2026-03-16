import { useState, useMemo } from 'react'
import { Link } from '@tanstack/react-router'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MagnifyingGlass,
  Faders,
  CaretDown,
  CalendarBlank,
  GasPump,
  SteeringWheel,
  ArrowUpRight,
  X,
  CarProfile,
} from '@phosphor-icons/react'
import { vehicles } from '@/data/mock'
import { formatPrice, cn } from '@/lib/utils'
import { PublicNavbar } from '@/components/public/PublicNavbar'
import { PublicFooter } from '@/components/public/PublicFooter'

// --- Components ---

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
        className="w-full appearance-none border border-white/10 bg-white/5 px-4 py-3 pr-10 text-sm font-medium text-white focus:border-gold-400 focus:outline-none focus:ring-1 focus:ring-gold-400/30 transition-all"
      >
        <option value="" className="bg-noir-900 text-white">{label}</option>
        {options.map((opt) => (
          <option key={opt} value={opt} className="bg-noir-900 text-white">
            {opt}
          </option>
        ))}
      </select>
      <CaretDown
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gold-400/60"
        weight="bold"
        size={14}
      />
    </div>
  )
}

function VehicleCard({ vehicle, index }: { vehicle: typeof vehicles[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06, duration: 0.5 }}
      className="group relative"
    >
      <Link
        to="/mansour-motors/vehicules/$vehicleId"
        params={{ vehicleId: vehicle.id }}
        className="block"
      >
        <div className="relative overflow-hidden border border-white/[0.06] bg-noir-900 transition-colors hover:border-white/10">
          <div className="relative aspect-[16/10] overflow-hidden">
            <img
              src={vehicle.image}
              alt={`${vehicle.make} ${vehicle.model}`}
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-noir-900 via-noir-900/20 to-transparent" />

            <div className="absolute top-4 right-4">
              {vehicle.status === 'available' ? (
                <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-emerald-400 border border-emerald-500/20 backdrop-blur-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Disponible
                </span>
              ) : (
                <span className="bg-white/10 text-white/70 px-3 py-1 text-[10px] font-bold uppercase tracking-widest border border-white/10 backdrop-blur-sm">
                  {vehicle.status === 'reserved' ? 'Réservé' : 'Vendu'}
                </span>
              )}
            </div>
          </div>

          <div className="p-6">
            <div className="mb-4">
              <h3 className="font-serif text-xl italic text-white">
                {vehicle.make} <span className="text-gold-400 not-italic font-sans font-semibold">{vehicle.model}</span>
              </h3>
              <div className="mt-2.5 flex flex-wrap gap-4 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/40">
                <span className="flex items-center gap-1.5">
                  <CalendarBlank className="text-gold-400/50" weight="fill" size={12} /> {vehicle.year}
                </span>
                <span className="flex items-center gap-1.5">
                  <GasPump className="text-gold-400/50" weight="fill" size={12} /> {vehicle.fuelType}
                </span>
                <span className="flex items-center gap-1.5">
                  <SteeringWheel className="text-gold-400/50" weight="fill" size={12} /> {vehicle.transmission}
                </span>
              </div>
            </div>

            <p className="mb-5 line-clamp-2 text-sm font-light leading-relaxed text-white/35">
              {vehicle.description}
            </p>

            <div className="flex items-center justify-between border-t border-white/[0.06] pt-5">
              <span className="text-lg font-bold text-gold-400">
                {formatPrice(vehicle.price)}
              </span>
              <span className="flex h-8 w-8 items-center justify-center bg-white/5 text-white/40 transition-all group-hover:bg-gold-400 group-hover:text-noir-950">
                <ArrowUpRight className="h-4 w-4" weight="bold" />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export function PublicVehicles() {
  const [search, setSearch] = useState('')
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)

  // Filters state
  const [make, setMake] = useState('')
  const [year, setYear] = useState('')
  const [fuelType, setFuelType] = useState('')
  const [transmission, setTransmission] = useState('')
  const [priceMax, setPriceMax] = useState('')

  // Derived options
  const makes = useMemo(() => Array.from(new Set(vehicles.map(v => v.make))).sort(), [])
  const years = useMemo(() => Array.from(new Set(vehicles.map(v => v.year))).sort((a, b) => b - a), [])
  const fuelTypes = useMemo(() => Array.from(new Set(vehicles.map(v => v.fuelType))).sort(), [])
  const transmissions = useMemo(() => Array.from(new Set(vehicles.map(v => v.transmission))).sort(), [])

  // Filtering logic
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

  const activeFiltersCount = [make, year, fuelType, transmission, priceMax].filter(Boolean).length

  const clearFilters = () => {
    setMake('')
    setYear('')
    setFuelType('')
    setTransmission('')
    setPriceMax('')
  }

  return (
    <div className="min-h-screen bg-noir-950 font-sans text-white selection:bg-gold-400 selection:text-noir-950 page-grain">
      <PublicNavbar />

      {/* Hero Section */}
      <section className="relative px-6 pt-32 pb-16 lg:px-12 lg:pt-40 lg:pb-20">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-10 bg-gold-400" />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-gold-400">
                Mansour Motors — Catalogue
              </span>
            </div>
            <h1 className="font-serif text-4xl italic text-white md:text-6xl">
              Véhicules <span className="text-gold-400 not-italic font-sans font-extrabold uppercase text-[0.75em] tracking-tight">d'Exception</span>
            </h1>
            <p className="mt-4 max-w-xl text-base font-light text-white/50 md:text-lg">
              Découvrez notre sélection de véhicules premium, neufs et d'occasion certifiés.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters & Content */}
      <section className="px-6 pb-24 lg:px-12">
        <div className="mx-auto max-w-7xl">
          {/* Controls */}
          <div className="mb-10 flex flex-col gap-4 border-b border-white/[0.06] pb-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full max-w-md">
              <MagnifyingGlass className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
              <input
                type="text"
                placeholder="Rechercher une marque, un modèle..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm text-white placeholder-white/30 focus:border-gold-400 focus:outline-none focus:ring-1 focus:ring-gold-400/30 transition-all"
              />
            </div>

            <div className="flex items-center gap-4">
              <span className="text-xs font-semibold text-white/30 uppercase tracking-wider">
                {filteredVehicles.length} véhicule{filteredVehicles.length !== 1 ? 's' : ''}
              </span>
              <button
                onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                className={cn(
                  'flex items-center gap-2 border px-5 py-2.5 text-[10px] font-bold uppercase tracking-[0.15em] transition-all',
                  isFiltersOpen || activeFiltersCount > 0
                    ? 'border-gold-400 bg-gold-400 text-noir-950'
                    : 'border-white/10 bg-white/5 text-white/60 hover:border-white/20 hover:text-white'
                )}
              >
                <Faders size={14} weight="bold" />
                Filtres {activeFiltersCount > 0 && `(${activeFiltersCount})`}
              </button>
            </div>
          </div>

          {/* Filter Panel */}
          <AnimatePresence>
            {isFiltersOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="mb-10 overflow-hidden"
              >
                <div className="grid grid-cols-1 gap-3 border border-white/[0.06] bg-noir-900/50 p-6 md:grid-cols-2 lg:grid-cols-5">
                  <FilterSelect label="Marque" value={make} onChange={setMake} options={makes} />
                  <FilterSelect label="Année" value={year} onChange={setYear} options={years.map(String)} />
                  <FilterSelect label="Carburant" value={fuelType} onChange={setFuelType} options={fuelTypes} />
                  <FilterSelect label="Transmission" value={transmission} onChange={setTransmission} options={transmissions} />
                  <div className="relative w-full">
                    <input
                      type="number"
                      placeholder="Prix max (FCFA)"
                      value={priceMax}
                      onChange={(e) => setPriceMax(e.target.value)}
                      className="w-full border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white placeholder-white/30 focus:border-gold-400 focus:outline-none focus:ring-1 focus:ring-gold-400/30 transition-all"
                    />
                  </div>
                </div>
                {activeFiltersCount > 0 && (
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={clearFilters}
                      className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-gold-400 transition-colors"
                    >
                      <X size={12} weight="bold" /> Réinitialiser
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Grid */}
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
                className="flex flex-col items-center justify-center py-32 text-center"
              >
                <div className="mb-6 flex h-20 w-20 items-center justify-center border border-white/[0.06] bg-white/[0.02]">
                  <CarProfile className="h-8 w-8 text-white/15" weight="duotone" />
                </div>
                <h3 className="font-serif text-2xl italic text-white/60">Aucun résultat</h3>
                <p className="mt-3 max-w-sm text-sm text-white/30">
                  Aucun véhicule ne correspond à vos critères. Modifiez vos filtres ou votre recherche.
                </p>
                <button
                  onClick={clearFilters}
                  className="mt-8 border border-white/10 bg-white/5 px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-white/60 transition-all hover:border-gold-400 hover:text-gold-400"
                >
                  Effacer les filtres
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  )
}
