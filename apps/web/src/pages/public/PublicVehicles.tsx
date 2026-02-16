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
        className="w-full appearance-none rounded-sm border border-white/10 bg-noir-900 px-4 py-3 pr-10 text-sm font-medium text-silver-200 focus:border-gold-400 focus:outline-none focus:ring-1 focus:ring-gold-400"
      >
        <option value="">{label}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <CaretDown
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gold-400"
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
      className="group relative flex flex-col overflow-hidden rounded-sm bg-noir-900 transition-all hover:bg-noir-800"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={vehicle.image}
          alt={`${vehicle.make} ${vehicle.model}`}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-noir-900 via-transparent to-transparent opacity-60" />
        
        <div className="absolute top-4 right-4">
           {vehicle.status === 'available' ? (
             <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 text-xs font-bold uppercase tracking-widest backdrop-blur-md">
               Disponible
             </span>
           ) : (
             <span className="bg-white/10 text-white border border-white/20 px-3 py-1 text-xs font-bold uppercase tracking-widest backdrop-blur-md">
                {vehicle.status === 'reserved' ? 'Réservé' : 'Vendu'}
             </span>
           )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="mb-4">
          <h3 className="font-serif text-2xl text-white italic">
            {vehicle.make} <span className="text-gold-400 not-italic">{vehicle.model}</span>
          </h3>
          <div className="mt-2 flex flex-wrap gap-4 text-xs font-medium uppercase tracking-wider text-silver-400">
            <span className="flex items-center gap-1">
              <CalendarBlank className="text-gold-400" weight="fill" /> {vehicle.year}
            </span>
            <span className="flex items-center gap-1">
              <GasPump className="text-gold-400" weight="fill" /> {vehicle.fuelType}
            </span>
            <span className="flex items-center gap-1">
              <SteeringWheel className="text-gold-400" weight="fill" /> {vehicle.transmission}
            </span>
          </div>
        </div>

        <p className="mb-6 line-clamp-2 text-sm font-light leading-relaxed text-silver-300">
          {vehicle.description}
        </p>

        <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-6">
          <span className="text-lg font-bold text-white">
            {formatPrice(vehicle.price)}
          </span>
          
          <Link
            to="/vehicules/$vehicleId"
            params={{ vehicleId: vehicle.id }}
            className="group/btn flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gold-400 transition-colors hover:text-white"
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
    <div className="min-h-screen bg-noir-950 font-sans text-silver-200 selection:bg-gold-400 selection:text-noir-950">
      <PublicNavbar />
      
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] w-full overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 z-10 bg-gradient-to-b from-noir-950/30 via-noir-950/60 to-noir-950" />
          <img
            src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2000&auto=format&fit=crop"
            alt="Luxury Cars"
            className="h-full w-full object-cover"
          />
        </div>
        
        <div className="relative z-20 flex h-full flex-col justify-end px-6 pb-12 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            <span className="mb-4 block text-xs font-bold uppercase tracking-[0.2em] text-gold-400">
              Mansour Motors
            </span>
            <h1 className="font-serif text-5xl font-medium text-white md:text-7xl italic mb-6">
              L'Art de la <span className="text-gold-400 not-italic">Mécanique</span>
            </h1>
            <p className="max-w-xl text-lg font-light text-silver-300">
              Une collection exclusive de véhicules sélectionnés pour leur excellence, leur performance et leur prestige.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters & Content */}
      <section className="px-6 py-12 lg:px-12">
        {/* Controls */}
        <div className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="relative w-full max-w-md">
            <MagnifyingGlass className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gold-400" />
            <input
              type="text"
              placeholder="Rechercher une marque, un modèle..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-sm border-b border-white/10 bg-transparent py-4 pl-12 pr-4 text-lg font-light text-white placeholder-white/30 focus:border-gold-400 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-4">
             <span className="text-sm font-medium text-silver-400">
                {filteredVehicles.length} véhicules
             </span>
             <button
               onClick={() => setIsFiltersOpen(!isFiltersOpen)}
               className={cn(
                 "flex items-center gap-2 rounded-sm border px-6 py-3 text-xs font-bold uppercase tracking-widest transition-colors",
                 isFiltersOpen || activeFiltersCount > 0
                   ? "border-gold-400 bg-gold-400 text-noir-950" 
                   : "border-white/10 bg-white/5 text-white hover:bg-white/10"
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
              <div className="grid grid-cols-1 gap-4 border-y border-white/5 bg-white/5 p-6 md:grid-cols-2 lg:grid-cols-5">
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
                         className="w-full appearance-none rounded-sm border border-white/10 bg-noir-900 px-4 py-3 text-sm font-medium text-silver-200 focus:border-gold-400 focus:outline-none focus:ring-1 focus:ring-gold-400 placeholder-silver-500"
                    />
                 </div>
              </div>
              <div className="mt-4 flex justify-end">
                <button 
                    onClick={clearFilters}
                    className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-silver-500 hover:text-white"
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
            <div className="flex h-full flex-col items-center justify-center py-24 text-center">
              <Funnel className="mb-6 h-12 w-12 text-white/10" weight="duotone" />
              <h3 className="text-xl font-medium text-white">Aucun résultat</h3>
              <p className="mt-2 text-silver-400">
                Essayez de modifier vos filtres ou votre recherche.
              </p>
              <button
                  onClick={clearFilters}
                  className="mt-6 text-xs font-bold uppercase tracking-widest text-gold-400 hover:text-white"
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
