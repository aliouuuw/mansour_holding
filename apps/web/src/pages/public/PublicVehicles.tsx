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
  ArrowUpRight01Icon,
  Cancel01Icon,
  Car01Icon,
} from 'hugeicons-react'
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
        className="w-full appearance-none border border-carbon-700 bg-carbon-900 px-4 py-3 pr-10 text-sm font-medium text-silver-200 focus:border-cyan-500 focus:outline-none transition-all"
      >
        <option value="">{label}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <ArrowDown01Icon
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-silver-600 h-3.5 w-3.5"
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
        <div className="overflow-hidden border border-carbon-800 bg-carbon-900 transition-all duration-500 hover:border-cyan-500/30 hover:shadow-[0_0_40px_rgba(0,229,255,0.06)]">
          <div className="relative aspect-[16/10] overflow-hidden bg-carbon-800">
            <img
              src={vehicle.image}
              alt={`${vehicle.make} ${vehicle.model}`}
              className="h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-carbon-950/90 via-carbon-950/30 to-transparent" />

            {/* Corner accents on hover */}
            <div className="absolute top-3 right-3 h-5 w-5 border-t border-r border-cyan-500/40 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <div className="absolute bottom-3 left-3 h-5 w-5 border-b border-l border-cyan-500/40 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

            <div className="absolute top-4 right-4">
              {vehicle.status === 'available' ? (
                <span className="inline-flex items-center gap-1.5 bg-carbon-950/70 backdrop-blur-md px-3 py-1 text-[9px] font-bold uppercase tracking-widest text-emerald-400 border border-emerald-500/30">
                  <span className="h-1.5 w-1.5 bg-emerald-400 animate-pulse" />
                  Disponible
                </span>
              ) : (
                <span className="bg-carbon-950/70 backdrop-blur-md text-silver-400 px-3 py-1 text-[9px] font-bold uppercase tracking-widest border border-carbon-700">
                  {vehicle.status === 'reserved' ? 'Réservé' : 'Vendu'}
                </span>
              )}
            </div>
          </div>

          <div className="p-6 border-t border-carbon-800">
            <div className="mb-4">
              <h3 className="font-motors-display text-base font-bold uppercase tracking-wider text-white">
                {vehicle.make}
              </h3>
              <span className="text-sm font-bold text-cyan-400">{vehicle.model}</span>
              <div className="mt-3 flex flex-wrap gap-4 text-[9px] font-bold uppercase tracking-[0.15em] text-silver-600">
                <span className="flex items-center gap-1.5">
                  <Calendar01Icon className="text-cyan-500/50 h-3 w-3" /> {vehicle.year}
                </span>
                <span className="flex items-center gap-1.5">
                  <Fuel01Icon className="text-cyan-500/50 h-3 w-3" /> {vehicle.fuelType}
                </span>
                <span className="flex items-center gap-1.5">
                  <SteeringIcon className="text-cyan-500/50 h-3 w-3" /> {vehicle.transmission}
                </span>
              </div>
            </div>

            <p className="mb-5 line-clamp-2 text-sm font-light leading-relaxed text-silver-500">
              {vehicle.description}
            </p>

            <div className="flex items-center justify-between border-t border-carbon-800 pt-5">
              <span className="text-lg font-bold text-white">
                {formatPrice(vehicle.price)}
              </span>
              <span className="flex h-8 w-8 items-center justify-center border border-carbon-700 text-silver-500 transition-all duration-500 group-hover:border-cyan-500 group-hover:bg-cyan-500 group-hover:text-carbon-950">
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
    <div className="min-h-screen bg-carbon-950 font-motors text-white motors-theme">
      <PublicNavbar />

      {/* Header */}
      <section className="relative px-6 pt-32 pb-16 lg:px-12 lg:pt-40 lg:pb-20">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-10 bg-cyan-500" />
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-500">
                Mansour Motors — Catalogue
              </span>
            </div>
            <h1 className="font-motors-display text-4xl font-bold uppercase tracking-tight text-white md:text-5xl lg:text-7xl">
              Catalogue <span className="text-cyan-400">Exclusif</span>
            </h1>
            <p className="mt-4 max-w-xl text-base font-light text-silver-500 md:text-lg">
              Découvrez notre sélection de véhicules premium, neufs et d'occasion certifiés.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters & Content */}
      <section className="px-6 pb-24 lg:px-12">
        <div className="mx-auto max-w-7xl">
          {/* Controls */}
          <div className="mb-10 flex flex-col gap-4 border-b border-carbon-800 pb-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full max-w-md">
              <Search01Icon className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-silver-600" />
              <input
                type="text"
                placeholder="Rechercher une marque, un modèle..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border border-carbon-700 bg-carbon-900 py-3 pl-11 pr-4 text-sm text-silver-200 placeholder-silver-600 focus:border-cyan-500 focus:outline-none transition-all"
              />
            </div>

            <div className="flex items-center gap-4">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-silver-600">
                {filteredVehicles.length} véhicule{filteredVehicles.length !== 1 ? 's' : ''}
              </span>
              <button
                onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                className={cn(
                  'flex items-center gap-2 border px-6 py-3 text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-300',
                  isFiltersOpen || activeFiltersCount > 0
                    ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400 shadow-[0_0_15px_rgba(0,229,255,0.15)]'
                    : 'border-carbon-700 bg-carbon-900 text-silver-400 hover:border-cyan-500/50 hover:text-cyan-400'
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
                <div className="grid grid-cols-1 gap-3 border border-carbon-800 bg-carbon-900 p-6 md:grid-cols-2 lg:grid-cols-5">
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
                      className="w-full border border-carbon-700 bg-carbon-900 px-4 py-3 text-sm font-medium text-silver-200 placeholder-silver-600 focus:border-cyan-500 focus:outline-none transition-all"
                    />
                  </div>
                </div>
                {activeFiltersCount > 0 && (
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={clearFilters}
                      className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-silver-500 hover:text-cyan-400 transition-colors"
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
                <div className="mb-6 flex h-20 w-20 items-center justify-center border border-carbon-800 bg-carbon-900">
                  <Car01Icon className="h-8 w-8 text-carbon-600" />
                </div>
                <h3 className="font-motors-display text-xl font-bold uppercase tracking-wider text-white">Aucun résultat</h3>
                <p className="mt-3 max-w-sm text-sm text-silver-500">
                  Aucun véhicule ne correspond à vos critères. Modifiez vos filtres ou votre recherche.
                </p>
                <button
                  onClick={clearFilters}
                  className="mt-8 border border-carbon-700 bg-carbon-900 px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-silver-400 transition-all hover:border-cyan-500 hover:text-cyan-400"
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
