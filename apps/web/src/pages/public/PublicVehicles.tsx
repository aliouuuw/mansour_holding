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
        className="block h-full"
      >
        <div className="flex flex-col h-full overflow-hidden border border-white/10 bg-carbon-900 shadow-sm transition-all duration-500 hover:shadow-rosso hover:-translate-y-2 hover:border-rosso-500/50 rounded-sm">
          <div className="relative aspect-[16/10] overflow-hidden bg-carbon-800">
            <img
              src={vehicle.image}
              alt={`${vehicle.make} ${vehicle.model}`}
              className="h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-carbon-950/90 via-carbon-950/20 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100" />

            {/* Hover overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 bg-rosso-900/40 backdrop-blur-[2px] transition-all duration-500 group-hover:opacity-100">
              <span className="translate-y-4 btn-motors btn-motors-primary px-6 py-3 text-xs text-white backdrop-blur-md transition-transform duration-500 group-hover:translate-y-0">
                Découvrir
              </span>
            </div>

            <div className="absolute top-4 right-4 z-10 transform transition-transform duration-500 group-hover:-translate-y-1">
              {vehicle.status === 'available' ? (
                <span className="inline-flex items-center gap-1.5 bg-emerald-500/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-emerald-400 border border-emerald-500/30 backdrop-blur-md shadow-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                  Disponible
                </span>
              ) : (
                <span className="bg-white/10 text-white/80 px-3 py-1 text-[10px] font-bold uppercase tracking-widest border border-white/20 backdrop-blur-md shadow-sm">
                  {vehicle.status === 'reserved' ? 'Réservé' : 'Vendu'}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col flex-1 p-6 relative bg-carbon-900 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-rosso-900/0 via-rosso-900/20 to-rosso-900/0 translate-x-[-100%] transition-transform duration-1000 ease-out group-hover:translate-x-[100%]" />
            <div className="mb-4 transform transition-transform duration-500 group-hover:-translate-y-1 relative z-10">
              <h3 className="font-motors-display font-bold text-xl text-white">
                {vehicle.make} <span className="text-rosso-400 not-italic font-sans font-black transition-colors group-hover:text-rosso-500">{vehicle.model}</span>
              </h3>
              <div className="mt-2.5 flex flex-wrap gap-4 text-[10px] font-bold uppercase tracking-[0.12em] text-silver-400">
                <span className="flex items-center gap-1.5 transition-colors group-hover:text-white">
                  <Calendar01Icon className="text-rosso-500/70 transition-colors group-hover:text-rosso-500 h-3 w-3" /> {vehicle.year}
                </span>
                <span className="flex items-center gap-1.5 transition-colors group-hover:text-white">
                  <Fuel01Icon className="text-rosso-500/70 transition-colors group-hover:text-rosso-500 h-3 w-3" /> {vehicle.fuelType}
                </span>
                <span className="flex items-center gap-1.5 transition-colors group-hover:text-white">
                  <SteeringIcon className="text-rosso-500/70 transition-colors group-hover:text-rosso-500 h-3 w-3" /> {vehicle.transmission}
                </span>
              </div>
            </div>

            <p className="mb-5 line-clamp-2 text-sm font-light leading-relaxed text-silver-300 transform transition-transform duration-500 group-hover:-translate-y-1 relative z-10 flex-1">
              {vehicle.description}
            </p>

            <div className="flex items-center justify-between border-t border-white/10 pt-5 relative z-10">
              <span className="text-lg font-black text-white transform transition-transform duration-500 group-hover:-translate-y-0.5">
                {formatPrice(vehicle.price)}
              </span>
              <span className="flex h-8 w-8 items-center justify-center bg-carbon-800 text-rosso-500 transition-all duration-500 group-hover:bg-rosso-600 group-hover:text-white group-hover:-rotate-45 group-hover:shadow-[0_0_15px_rgba(220,38,38,0.4)] rounded-full">
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
    <div className="min-h-screen bg-carbon-950 font-sans text-white motors-theme page-grain">
      <PublicNavbar />

      {/* Hero Section */}
      <section className="relative bg-carbon-950 px-6 pt-32 pb-16 lg:px-12 lg:pt-40 lg:pb-20">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-10 bg-rosso-600" />
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-rosso-500">
                Mansour Motors — Catalogue
              </span>
            </div>
            <h1 className="font-motors-display font-bold text-4xl text-white md:text-6xl uppercase">
              Véhicules <span className="text-transparent bg-clip-text bg-gradient-to-r from-rosso-500 to-rosso-700 not-italic font-sans font-black uppercase text-[0.75em] tracking-tight">d'Exception</span>
            </h1>
            <p className="mt-4 max-w-xl text-base font-light text-silver-300 md:text-lg">
              Découvrez notre sélection de véhicules premium, neufs et d'occasion certifiés.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters & Content */}
      <section className="px-6 pb-24 lg:px-12">
        <div className="mx-auto max-w-7xl">
          {/* Controls */}
          <div className="mb-10 flex flex-col gap-4 border-b border-white/10 pb-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full max-w-md">
              <Search01Icon className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-silver-400" />
              <input
                type="text"
                placeholder="Rechercher une marque, un modèle..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border border-white/10 bg-carbon-900 py-3 pl-11 pr-4 text-sm text-white placeholder-silver-500 focus:border-rosso-500 focus:outline-none focus:ring-1 focus:ring-rosso-500/30 transition-all"
              />
            </div>

            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-silver-400 uppercase tracking-wider">
                {filteredVehicles.length} véhicule{filteredVehicles.length !== 1 ? 's' : ''}
              </span>
              <button
                onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                className={cn(
                  'flex items-center gap-2 border px-5 py-2.5 text-[10px] font-bold uppercase tracking-[0.15em] transition-all duration-300',
                  isFiltersOpen || activeFiltersCount > 0
                    ? 'border-rosso-500 bg-rosso-600 text-white shadow-rosso-sm'
                    : 'border-white/10 bg-carbon-900 text-silver-300 hover:border-rosso-500/50 hover:text-white hover:bg-carbon-800'
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
                <div className="grid grid-cols-1 gap-3 border border-white/10 bg-carbon-950 p-6 md:grid-cols-2 lg:grid-cols-5">
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
                      className="w-full border border-white/10 bg-carbon-900 px-4 py-3 text-sm font-medium text-white placeholder-silver-500 focus:border-rosso-500 focus:outline-none focus:ring-1 focus:ring-rosso-500/30 transition-all"
                    />
                  </div>
                </div>
                {activeFiltersCount > 0 && (
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={clearFilters}
                      className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-silver-400 hover:text-rosso-500 transition-colors"
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
                <div className="mb-6 flex h-20 w-20 items-center justify-center border border-white/10 bg-carbon-900">
                  <Car01Icon className="h-8 w-8 text-silver-500" />
                </div>
                <h3 className="font-motors-display font-bold text-2xl text-white">Aucun résultat</h3>
                <p className="mt-3 max-w-sm text-sm text-silver-400">
                  Aucun véhicule ne correspond à vos critères. Modifiez vos filtres ou votre recherche.
                </p>
                <button
                  onClick={clearFilters}
                  className="mt-8 border border-white/10 bg-carbon-900 px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-silver-300 transition-all hover:border-rosso-500 hover:text-white"
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
