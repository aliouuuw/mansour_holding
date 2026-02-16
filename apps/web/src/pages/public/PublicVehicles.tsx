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
  ArrowRight,
  X,
  Funnel,
} from '@phosphor-icons/react'
import { vehicles } from '@/data/mock'
import { formatPrice } from '@/lib/utils'
import { PublicNavbar } from '@/components/public/PublicNavbar'
import { PublicFooter } from '@/components/public/PublicFooter'
import { cn } from '@/lib/utils'

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
        className="w-full appearance-none rounded-lg border border-noir-200 bg-white px-4 py-3 pr-10 text-sm font-medium text-noir-900 focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-400/20"
      >
        <option value="">{label}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <CaretDown
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gold-600"
        weight="bold"
      />
    </div>
  )
}

function VehicleCard({ vehicle }: { vehicle: typeof vehicles[0] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative flex flex-col overflow-hidden rounded-lg border border-noir-200 bg-white shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={vehicle.image}
          alt={`${vehicle.make} ${vehicle.model}`}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        
        <div className="absolute top-4 right-4">
           {vehicle.status === 'available' ? (
             <span className="bg-jade-500 text-white px-3 py-1 text-xs font-bold uppercase tracking-widest rounded-sm shadow-sm">
               Disponible
             </span>
           ) : (
             <span className="bg-white/90 text-noir-950 px-3 py-1 text-xs font-bold uppercase tracking-widest rounded-sm shadow-sm backdrop-blur-sm">
                {vehicle.status === 'reserved' ? 'Réservé' : 'Vendu'}
             </span>
           )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="mb-4">
          <h3 className="font-serif text-xl text-noir-950 italic">
            {vehicle.make} <span className="text-gold-600 not-italic font-semibold">{vehicle.model}</span>
          </h3>
          <div className="mt-2 flex flex-wrap gap-4 text-xs font-medium uppercase tracking-wider text-noir-600">
            <span className="flex items-center gap-1">
              <CalendarBlank className="text-gold-600" weight="fill" /> {vehicle.year}
            </span>
            <span className="flex items-center gap-1">
              <GasPump className="text-gold-600" weight="fill" /> {vehicle.fuelType}
            </span>
            <span className="flex items-center gap-1">
              <SteeringWheel className="text-gold-600" weight="fill" /> {vehicle.transmission}
            </span>
          </div>
        </div>

        <p className="mb-6 line-clamp-2 text-sm font-light leading-relaxed text-noir-600">
          {vehicle.description}
        </p>

        <div className="mt-auto flex items-center justify-between border-t border-noir-200 pt-6">
          <span className="text-xl font-bold text-noir-950">
            {formatPrice(vehicle.price)}
          </span>
          
          <Link
            to="/vehicules/$vehicleId"
            params={{ vehicleId: vehicle.id }}
            className="group/btn flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gold-600 transition-colors hover:text-gold-700"
          >
            Détails <ArrowRight className="transition-transform group-hover/btn:translate-x-1" weight="bold" />
          </Link>
        </div>
      </div>
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
      // Search
      const q = search.toLowerCase()
      const matchesSearch = 
        v.make.toLowerCase().includes(q) || 
        v.model.toLowerCase().includes(q) || 
        v.year.toString().includes(q)

      // Filters
      const matchesMake = make ? v.make === make : true
      const matchesYear = year ? v.year.toString() === year : true
      const matchesFuel = fuelType ? v.fuelType === fuelType : true
      const matchesTransmission = transmission ? v.transmission === transmission : true
      const matchesPrice = priceMax ? v.price <= parseInt(priceMax) : true
      
      return matchesSearch && matchesMake && matchesYear && matchesFuel && matchesTransmission && matchesPrice
    }).sort((a, b) => {
        // Sort available first
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
    <div className="min-h-screen bg-surface-dim font-sans text-noir-900 selection:bg-gold-400 selection:text-noir-950">
      <PublicNavbar />
      
      {/* Hero Section */}
      <section className="relative bg-noir-950 px-6 py-16 lg:px-12 lg:py-24">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="mb-4 block text-xs font-bold uppercase tracking-[0.2em] text-gold-400">
              Mansour Motors
            </span>
            <h1 className="font-serif text-4xl font-medium text-white md:text-6xl italic mb-6">
              Véhicules <span className="text-gold-400 not-italic">d'Exception</span>
            </h1>
            <p className="max-w-2xl text-lg font-light text-silver-300">
              Découvrez notre sélection de véhicules premium, neufs et d'occasion certifiés, pour une clientèle exigeante.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters & Content */}
      <section className="px-6 py-12 lg:px-12 bg-white">
        {/* Controls */}
        <div className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="relative w-full max-w-md">
            <MagnifyingGlass className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-noir-400" />
            <input
              type="text"
              placeholder="Rechercher une marque, un modèle..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-noir-200 bg-white py-3 pl-12 pr-4 text-base text-noir-900 placeholder-noir-400 focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-400/20"
            />
          </div>

          <div className="flex items-center gap-4">
             <span className="text-sm font-medium text-noir-600">
                {filteredVehicles.length} véhicules
             </span>
             <button
               onClick={() => setIsFiltersOpen(!isFiltersOpen)}
               className={cn(
                 "flex items-center gap-2 rounded-lg border px-6 py-3 text-xs font-bold uppercase tracking-widest transition-colors",
                 isFiltersOpen || activeFiltersCount > 0
                   ? "border-gold-400 bg-gold-400 text-noir-950" 
                   : "border-noir-200 bg-white text-noir-900 hover:bg-surface-dim"
               )}
             >
               <Faders size={16} weight="bold" />
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
              className="mb-12 overflow-hidden"
            >
              <div className="grid grid-cols-1 gap-4 rounded-lg border border-noir-200 bg-surface-dim p-6 md:grid-cols-2 lg:grid-cols-5">
                <FilterSelect
                  label="Marque"
                  value={make}
                  onChange={setMake}
                  options={makes}
                />
                <FilterSelect
                  label="Année"
                  value={year}
                  onChange={setYear}
                  options={years.map(String)}
                />
                <FilterSelect
                  label="Carburant"
                  value={fuelType}
                  onChange={setFuelType}
                  options={fuelTypes}
                />
                <FilterSelect
                  label="Transmission"
                  value={transmission}
                  onChange={setTransmission}
                  options={transmissions}
                />
                 <div className="relative group w-full">
                    <input
                        type="number"
                        placeholder="Prix max (FCFA)"
                        value={priceMax}
                        onChange={(e) => setPriceMax(e.target.value)}
                         className="w-full appearance-none rounded-lg border border-noir-200 bg-white px-4 py-3 text-sm font-medium text-noir-900 focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-400/20 placeholder-noir-400"
                    />
                 </div>
              </div>
              <div className="mt-4 flex justify-end">
                <button 
                    onClick={clearFilters}
                    className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-noir-500 hover:text-noir-900"
                >
                    <X size={14} weight="bold" /> Réinitialiser
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Grid */}
        <div className="min-h-[400px]">
          {filteredVehicles.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {filteredVehicles.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <Funnel className="mb-6 h-12 w-12 text-noir-200" weight="duotone" />
              <h3 className="text-xl font-medium text-noir-950">Aucun résultat</h3>
              <p className="mt-2 text-noir-600">
                Essayez de modifier vos filtres ou votre recherche.
              </p>
              <button
                  onClick={clearFilters}
                  className="mt-6 text-xs font-bold uppercase tracking-widest text-gold-600 hover:text-gold-700"
              >
                  Effacer les filtres
              </button>
            </div>
          )}
        </div>
      </section>

      <PublicFooter />
    </div>
  )
}
