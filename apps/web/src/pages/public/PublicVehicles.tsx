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
} from 'hugeicons-react'
import { vehicles } from '@/data/mock'
import { formatPrice, cn } from '@/lib/utils'
import { MotorsNavbar } from '@/components/motors/MotorsNavbar'
import { MotorsFooter } from '@/components/motors/MotorsFooter'

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
        className="w-full appearance-none border border-white/[0.06] bg-carbon-800 px-4 py-3 pr-10 font-motors text-sm font-medium text-silver-200 focus:border-cyan-400/40 focus:outline-none focus:ring-1 focus:ring-cyan-400/20 transition-all rounded-sm"
      >
        <option value="">{label}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <ArrowDown01Icon
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-cyan-400/40 h-3.5 w-3.5"
      />
    </div>
  )
}

function VehicleCard({ vehicle, index }: { vehicle: typeof vehicles[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="group relative"
    >
      <Link
        to="/mansour-motors/vehicules/$vehicleId"
        params={{ vehicleId: vehicle.id }}
        className="block"
      >
        <div className="overflow-hidden border border-white/[0.06] bg-carbon-800 transition-all duration-500 hover:border-cyan-400/20 hover:shadow-[0_0_40px_rgba(0,229,255,0.06)] rounded-sm">
          <div className="relative aspect-[16/10] overflow-hidden bg-carbon-700">
            <img
              src={vehicle.image}
              alt={`${vehicle.make} ${vehicle.model}`}
              className="h-full w-full object-cover transition-all duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-carbon-950 via-carbon-950/30 to-transparent opacity-70 group-hover:opacity-80 transition-opacity duration-500" />

            <div className="absolute top-4 right-4">
              {vehicle.status === 'available' ? (
                <span className="inline-flex items-center gap-1.5 bg-carbon-950/70 backdrop-blur-xl px-3 py-1.5 font-motors text-[10px] font-bold uppercase tracking-[0.15em] text-cyan-400 border border-cyan-400/20 rounded-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(0,229,255,0.6)]" />
                  Disponible
                </span>
              ) : (
                <span className="bg-carbon-950/70 backdrop-blur-xl text-silver-400 px-3 py-1.5 font-motors text-[10px] font-bold uppercase tracking-[0.15em] border border-white/10 rounded-sm">
                  {vehicle.status === 'reserved' ? 'Réservé' : 'Vendu'}
                </span>
              )}
            </div>

            {/* Hover overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-400 group-hover:opacity-100 z-10">
              <span className="translate-y-3 bg-cyan-400/10 border border-cyan-400/30 px-5 py-2.5 font-motors text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-300 backdrop-blur-md transition-transform duration-400 group-hover:translate-y-0 rounded-sm">
                Découvrir
              </span>
            </div>
          </div>

          <div className="p-5 border-t border-white/[0.04]">
            <div className="mb-3">
              <h3 className="font-motors text-lg font-bold text-white">
                {vehicle.make} <span className="text-cyan-400">{vehicle.model}</span>
              </h3>
              <div className="mt-2 flex flex-wrap gap-4 font-motors text-[10px] font-medium uppercase tracking-[0.12em] text-silver-500">
                <span className="flex items-center gap-1.5">
                  <Calendar01Icon className="text-cyan-400/40 h-3 w-3" /> {vehicle.year}
                </span>
                <span className="flex items-center gap-1.5">
                  <Fuel01Icon className="text-cyan-400/40 h-3 w-3" /> {vehicle.fuelType}
                </span>
                <span className="flex items-center gap-1.5">
                  <SteeringIcon className="text-cyan-400/40 h-3 w-3" /> {vehicle.transmission}
                </span>
              </div>
            </div>

            <p className="mb-4 line-clamp-2 font-motors text-sm font-light leading-relaxed text-silver-500">
              {vehicle.description}
            </p>

            <div className="flex items-center justify-between border-t border-white/[0.04] pt-4">
              <span className="font-motors text-lg font-bold text-white">
                {formatPrice(vehicle.price)}
              </span>
              <span className="flex h-9 w-9 items-center justify-center border border-white/[0.08] text-silver-500 transition-all duration-400 group-hover:border-cyan-400 group-hover:text-cyan-400 group-hover:shadow-[0_0_15px_rgba(0,229,255,0.2)] rounded-sm">
                <ArrowRight01Icon className="h-4 w-4 transition-transform duration-300 group-hover:-rotate-45" />
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
    <div className="motors-theme min-h-screen bg-carbon-950 font-motors">
      <MotorsNavbar />

      {/* Hero Section */}
      <section className="relative bg-carbon-950 px-6 pt-32 pb-16 lg:px-12 lg:pt-40 lg:pb-20 overflow-hidden">
        {/* Decorative background */}
        <div className="absolute top-0 left-1/3 w-[500px] h-[300px] bg-cyan-400/[0.03] rounded-full blur-[120px] pointer-events-none" />

        <div className="mx-auto max-w-7xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-10 bg-cyan-400" />
              <span className="font-motors text-[11px] font-bold uppercase tracking-[0.25em] text-cyan-400">
                Mansour Motors — Catalogue
              </span>
            </div>
            <h1 className="font-motors-display text-4xl font-bold uppercase tracking-tight text-white md:text-6xl">
              Véhicules <span className="gradient-text-cyan">d'Exception</span>
            </h1>
            <p className="mt-4 max-w-xl font-motors text-base font-light text-silver-400 md:text-lg">
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
              <Search01Icon className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-silver-600" />
              <input
                type="text"
                placeholder="Rechercher une marque, un modèle..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border border-white/[0.06] bg-carbon-800 py-3 pl-11 pr-4 font-motors text-sm text-silver-200 placeholder-silver-600 focus:border-cyan-400/40 focus:outline-none focus:ring-1 focus:ring-cyan-400/20 transition-all rounded-sm"
              />
            </div>

            <div className="flex items-center gap-4">
              <span className="font-motors text-xs font-medium text-silver-600 uppercase tracking-wider">
                {filteredVehicles.length} véhicule{filteredVehicles.length !== 1 ? 's' : ''}
              </span>
              <button
                onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                className={cn(
                  'flex items-center gap-2 border px-5 py-2.5 font-motors text-[10px] font-bold uppercase tracking-[0.15em] transition-all duration-300 rounded-sm',
                  isFiltersOpen || activeFiltersCount > 0
                    ? 'border-cyan-400 bg-cyan-400 text-carbon-950 shadow-[0_0_20px_rgba(0,229,255,0.3)]'
                    : 'border-white/[0.08] bg-carbon-800 text-silver-400 hover:border-cyan-400/30 hover:text-cyan-400'
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
                <div className="grid grid-cols-1 gap-3 border border-white/[0.06] bg-carbon-900 p-6 md:grid-cols-2 lg:grid-cols-5 rounded-sm">
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
                      className="w-full border border-white/[0.06] bg-carbon-800 px-4 py-3 font-motors text-sm font-medium text-silver-200 placeholder-silver-600 focus:border-cyan-400/40 focus:outline-none focus:ring-1 focus:ring-cyan-400/20 transition-all rounded-sm"
                    />
                  </div>
                </div>
                {activeFiltersCount > 0 && (
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={clearFilters}
                      className="flex items-center gap-2 font-motors text-[10px] font-bold uppercase tracking-widest text-silver-500 hover:text-cyan-400 transition-colors"
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
                <div className="mb-6 flex h-20 w-20 items-center justify-center border border-white/[0.06] bg-carbon-800 rounded-sm">
                  <Car01Icon className="h-8 w-8 text-silver-600" />
                </div>
                <h3 className="font-motors-display text-2xl font-bold uppercase text-white">Aucun résultat</h3>
                <p className="mt-3 max-w-sm font-motors text-sm text-silver-500">
                  Aucun véhicule ne correspond à vos critères. Modifiez vos filtres ou votre recherche.
                </p>
                <button
                  onClick={clearFilters}
                  className="mt-8 border border-white/[0.08] bg-carbon-800 px-6 py-3 font-motors text-[10px] font-bold uppercase tracking-widest text-silver-400 transition-all hover:border-cyan-400/30 hover:text-cyan-400 rounded-sm"
                >
                  Effacer les filtres
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      <MotorsFooter />
    </div>
  )
}
