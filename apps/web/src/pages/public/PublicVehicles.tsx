import { useState, useMemo, useEffect } from 'react'
import { Link } from '@tanstack/react-router'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search01Icon,
  FilterIcon,
  ArrowDown01Icon,
  Calendar01Icon,
  Fuel01Icon,
  SteeringIcon,
  ArrowUpRight01Icon,
  Cancel01Icon,
  Car01Icon,
} from 'hugeicons-react'
import { vehicles } from '@/data/mock'
import { formatPrice, cn } from '@/lib/utils'
import { scrollToTopOnMount } from '@/lib/scroll'
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
        className="w-full appearance-none border border-noir-200 bg-white px-4 py-3 pr-10 text-sm font-medium text-noir-900 focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-400/30 transition-all"
      >
        <option value="">{label}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <ArrowDown01Icon
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gold-600/60 h-3.5 w-3.5"
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
        <div className="overflow-hidden border border-noir-100 bg-white shadow-sm transition-all duration-500 hover:shadow-xl hover:-translate-y-1 hover:border-gold-200">
          <div className="relative aspect-[16/10] overflow-hidden">
            <img
              src={vehicle.image}
              alt={`${vehicle.make} ${vehicle.model}`}
              className="h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-noir-950/80 via-noir-950/20 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100" />

            <div className="absolute top-4 right-4 transform transition-transform duration-500 group-hover:-translate-y-1">
              {vehicle.status === 'available' ? (
                <span className="inline-flex items-center gap-1.5 bg-emerald-50 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-emerald-700 border border-emerald-200 backdrop-blur-md shadow-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                  Disponible
                </span>
              ) : (
                <span className="bg-white/90 text-noir-600 px-3 py-1 text-[10px] font-bold uppercase tracking-widest border border-noir-200 backdrop-blur-md shadow-sm">
                  {vehicle.status === 'reserved' ? 'Réservé' : 'Vendu'}
                </span>
              )}
            </div>
          </div>

          <div className="p-6 relative bg-white transition-colors duration-500 group-hover:bg-gold-50/10">
            <div className="mb-4 transform transition-transform duration-500 group-hover:-translate-y-1">
              <h3 className="font-serif text-xl italic text-noir-950">
                {vehicle.make} <span className="text-gold-600 not-italic font-sans font-semibold transition-colors group-hover:text-gold-700">{vehicle.model}</span>
              </h3>
              <div className="mt-2.5 flex flex-wrap gap-4 text-[10px] font-semibold uppercase tracking-[0.12em] text-noir-400">
                <span className="flex items-center gap-1.5 transition-colors group-hover:text-noir-600">
                  <Calendar01Icon className="text-gold-600/50 transition-colors group-hover:text-gold-600 h-3 w-3" /> {vehicle.year}
                </span>
                <span className="flex items-center gap-1.5 transition-colors group-hover:text-noir-600">
                  <Fuel01Icon className="text-gold-600/50 transition-colors group-hover:text-gold-600 h-3 w-3" /> {vehicle.fuelType}
                </span>
                <span className="flex items-center gap-1.5 transition-colors group-hover:text-noir-600">
                  <SteeringIcon className="text-gold-600/50 transition-colors group-hover:text-gold-600 h-3 w-3" /> {vehicle.transmission}
                </span>
              </div>
            </div>

            <p className="mb-5 line-clamp-2 text-sm font-light leading-relaxed text-noir-500 transform transition-transform duration-500 group-hover:-translate-y-1">
              {vehicle.description}
            </p>

            <div className="flex items-center justify-between border-t border-noir-100 pt-5 relative">
              <span className="text-lg font-bold text-noir-950 transform transition-transform duration-500 group-hover:-translate-y-0.5">
                {formatPrice(vehicle.price)}
              </span>
              <span className="flex h-8 w-8 items-center justify-center bg-gold-50 text-gold-600 transition-all duration-500 group-hover:bg-gold-400 group-hover:text-noir-950 group-hover:rotate-45 group-hover:shadow-[0_0_10px_rgba(207,181,59,0.4)]">
                <ArrowUpRight01Icon className="h-4 w-4" />
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

  useEffect(() => {
    scrollToTopOnMount(50)
  }, [])

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
    <div className="min-h-screen bg-surface-dim font-sans text-noir-950 selection:bg-gold-400 selection:text-noir-950 page-grain">
      <PublicNavbar />

      {/* Hero Section */}
      <section className="relative bg-surface-dim px-6 pt-32 pb-16 lg:px-12 lg:pt-40 lg:pb-20">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-10 bg-gold-500" />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-gold-600">
                Mansour Motors — Catalogue
              </span>
            </div>
            <h1 className="font-serif text-4xl italic text-noir-950 md:text-6xl">
              Véhicules <span className="text-gold-600 not-italic font-sans font-extrabold uppercase text-[0.75em] tracking-tight">d'Exception</span>
            </h1>
            <p className="mt-4 max-w-xl text-base font-light text-noir-500 md:text-lg">
              Découvrez notre sélection de véhicules premium, neufs et d'occasion certifiés.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters & Content */}
      <section className="px-6 pb-24 lg:px-12">
        <div className="mx-auto max-w-7xl">
          {/* Controls */}
          <div className="mb-10 flex flex-col gap-4 border-b border-noir-100 pb-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full max-w-md">
              <Search01Icon className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-noir-400" />
              <input
                type="text"
                placeholder="Rechercher une marque, un modèle..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border border-noir-200 bg-white py-3 pl-11 pr-4 text-sm text-noir-900 placeholder-noir-400 focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-400/30 transition-all"
              />
            </div>

            <div className="flex items-center gap-4">
              <span className="text-xs font-semibold text-noir-400 uppercase tracking-wider">
                {filteredVehicles.length} véhicule{filteredVehicles.length !== 1 ? 's' : ''}
              </span>
              <button
                onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                className={cn(
                  'flex items-center gap-2 border px-5 py-2.5 text-[10px] font-bold uppercase tracking-[0.15em] transition-all duration-300',
                  isFiltersOpen || activeFiltersCount > 0
                    ? 'border-gold-400 bg-gold-400 text-noir-950 shadow-[0_0_15px_rgba(207,181,59,0.3)]'
                    : 'border-noir-200 bg-white text-noir-600 hover:border-gold-300 hover:text-noir-950 hover:bg-gold-50'
                )}
              >
                <FilterIcon className="h-3.5 w-3.5" />
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
                <div className="grid grid-cols-1 gap-3 border border-noir-100 bg-white p-6 md:grid-cols-2 lg:grid-cols-5">
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
                      className="w-full border border-noir-200 bg-white px-4 py-3 text-sm font-medium text-noir-900 placeholder-noir-400 focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-400/30 transition-all"
                    />
                  </div>
                </div>
                {activeFiltersCount > 0 && (
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={clearFilters}
                      className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-noir-400 hover:text-gold-600 transition-colors"
                    >
                      <Cancel01Icon className="h-3 w-3" /> Réinitialiser
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
                <div className="mb-6 flex h-20 w-20 items-center justify-center border border-noir-100 bg-white">
                  <Car01Icon className="h-8 w-8 text-noir-200" />
                </div>
                <h3 className="font-serif text-2xl italic text-noir-950">Aucun résultat</h3>
                <p className="mt-3 max-w-sm text-sm text-noir-500">
                  Aucun véhicule ne correspond à vos critères. Modifiez vos filtres ou votre recherche.
                </p>
                <button
                  onClick={clearFilters}
                  className="mt-8 border border-noir-200 bg-white px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-noir-600 transition-all hover:border-gold-400 hover:text-gold-600"
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
