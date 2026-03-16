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
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex flex-col overflow-hidden bg-white shadow-sm transition-all duration-500 hover:shadow-xl hover:-translate-y-2 border border-noir-100"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-noir-50">
        <img
          src={vehicle.image}
          alt={`${vehicle.make} ${vehicle.model}`}
          className="h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-noir-950/80 via-transparent to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-80" />
        
        <div className="absolute top-4 right-4 z-10">
           {vehicle.status === 'available' ? (
             <span className="flex items-center gap-2 bg-noir-950/80 backdrop-blur-md px-3 py-1.5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-white">
               <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse" />
               Disponible
             </span>
           ) : (
             <span className="flex items-center gap-2 bg-white/90 backdrop-blur-md px-3 py-1.5 border border-noir-200/50 text-[10px] font-bold uppercase tracking-widest text-noir-900">
               <span className="w-1.5 h-1.5 rounded-full bg-noir-400" />
               {vehicle.status === 'reserved' ? 'Réservé' : 'Vendu'}
             </span>
           )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-8 relative">
        <div className="absolute top-0 right-8 transform -translate-y-1/2 bg-gold-400 text-noir-950 p-4 rounded-full opacity-0 translate-y-4 transition-all duration-500 group-hover:opacity-100 group-hover:-translate-y-1/2 shadow-lg">
          <ArrowRight size={20} weight="bold" className="-rotate-45" />
        </div>

        <div className="mb-6">
          <h3 className="font-serif text-2xl text-noir-950 italic mb-1">
            {vehicle.make} <span className="text-gold-600 not-italic font-bold font-sans tracking-tight">{vehicle.model}</span>
          </h3>
          <div className="mt-4 flex flex-wrap gap-4 text-[10px] font-bold uppercase tracking-widest text-noir-500">
            <span className="flex items-center gap-1.5">
              <CalendarBlank className="text-gold-500 w-4 h-4" weight="duotone" /> {vehicle.year}
            </span>
            <span className="w-1 h-1 rounded-full bg-noir-200" />
            <span className="flex items-center gap-1.5">
              <GasPump className="text-gold-500 w-4 h-4" weight="duotone" /> {vehicle.fuelType}
            </span>
            <span className="w-1 h-1 rounded-full bg-noir-200" />
            <span className="flex items-center gap-1.5">
              <SteeringWheel className="text-gold-500 w-4 h-4" weight="duotone" /> {vehicle.transmission}
            </span>
          </div>
        </div>

        <p className="mb-8 line-clamp-2 text-sm font-light leading-relaxed text-noir-600">
          {vehicle.description}
        </p>

        <div className="mt-auto flex items-end justify-between border-t border-noir-100 pt-6">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-noir-400 mb-1">Prix</p>
            <span className="text-2xl font-extrabold text-noir-950 tracking-tight">
              {formatPrice(vehicle.price)}
            </span>
          </div>
          
          <Link
            to="/mansour-motors/vehicules/$vehicleId"
            params={{ vehicleId: vehicle.id }}
            className="group/btn flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-gold-600 transition-colors hover:text-gold-700 pb-1 border-b border-transparent hover:border-gold-600"
          >
            Détails
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
      <section className="relative bg-noir-950 px-6 py-24 lg:px-12 lg:py-32 overflow-hidden noise-overlay">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-gold-400/10 via-noir-950 to-noir-950" />
        <div className="absolute -bottom-48 -right-48 w-96 h-96 bg-gold-400/10 rounded-full blur-[100px] animate-pulse-glow" style={{ animationDuration: '8s' }} />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center gap-4 mb-8">
              <span className="h-px w-8 bg-gold-400" />
              <span className="block text-xs font-bold uppercase tracking-[0.2em] text-gold-400">
                Mansour Motors
              </span>
            </div>
            <h1 className="font-sans text-5xl font-extrabold uppercase leading-[1.1] tracking-tight text-white md:text-[5rem] lg:text-[6rem] mb-6">
              Véhicules<br />
              <span className="font-serif italic gold-gradient-text normal-case tracking-normal block mt-2">d'Exception</span>
            </h1>
            <p className="max-w-2xl text-xl font-light text-silver-300 leading-relaxed">
              Découvrez notre sélection de véhicules premium, neufs et d'occasion certifiés, pour une clientèle exigeante.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters & Content */}
      <section className="px-6 py-16 lg:px-12 bg-surface-dim relative">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-noir-950/5 to-transparent pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Controls */}
          <div className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="relative w-full max-w-xl group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-gold-400/0 via-gold-400/20 to-gold-400/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 blur" />
              <div className="relative flex items-center bg-white border border-noir-200 focus-within:border-gold-400 transition-colors shadow-sm">
                <MagnifyingGlass className="absolute left-5 text-noir-400 h-5 w-5" weight="bold" />
                <input
                  type="text"
                  placeholder="Rechercher une marque, un modèle..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-transparent py-4 pl-14 pr-6 text-sm font-medium text-noir-900 placeholder-noir-400 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-6">
               <span className="text-sm font-bold uppercase tracking-widest text-noir-500 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-gold-400" />
                  {filteredVehicles.length} véhicules
               </span>
               <button
                 onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                 className={cn(
                   "group relative overflow-hidden flex items-center gap-3 border px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] transition-all duration-300",
                   isFiltersOpen || activeFiltersCount > 0
                     ? "border-gold-400 bg-gold-400 text-noir-950 shadow-lg shadow-gold-400/20" 
                     : "border-noir-200 bg-white text-noir-900 hover:border-gold-400 hover:bg-noir-50"
                 )}
               >
                 <Faders size={18} weight={isFiltersOpen || activeFiltersCount > 0 ? "fill" : "regular"} className="transition-transform duration-300 group-hover:rotate-90" />
                 Filtres {activeFiltersCount > 0 && `(${activeFiltersCount})`}
               </button>
            </div>
          </div>

          {/* Filter Panel */}
          <AnimatePresence>
            {isFiltersOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0, y: -10 }}
                animate={{ height: 'auto', opacity: 1, y: 0 }}
                exit={{ height: 0, opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="mb-16 overflow-hidden"
              >
                <div className="bg-white border border-noir-200 p-8 shadow-sm">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-5">
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
                            className="w-full appearance-none border-b border-noir-200 bg-transparent px-0 py-3 text-sm font-medium text-noir-900 focus:border-gold-400 focus:outline-none transition-colors placeholder-noir-400"
                        />
                     </div>
                  </div>
                  <div className="mt-8 flex justify-end border-t border-noir-100 pt-6">
                    <button 
                        onClick={clearFilters}
                        className="group flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-noir-500 hover:text-noir-950 transition-colors"
                    >
                        <X size={14} weight="bold" className="transition-transform group-hover:rotate-90" /> Réinitialiser
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Grid */}
          <div className="min-h-[400px]">
            {filteredVehicles.length > 0 ? (
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {filteredVehicles.map((vehicle, index) => (
                  <motion.div
                    key={vehicle.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <VehicleCard vehicle={vehicle} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-32 text-center bg-white border border-noir-100 shadow-sm"
              >
                <div className="w-20 h-20 bg-noir-50 rounded-full flex items-center justify-center mb-6 border border-noir-100">
                  <Funnel className="h-8 w-8 text-noir-400" weight="duotone" />
                </div>
                <h3 className="text-2xl font-serif italic text-noir-950 mb-3">Aucun véhicule trouvé</h3>
                <p className="text-noir-500 font-light max-w-md mb-8">
                  Essayez de modifier vos filtres ou d'élargir votre recherche pour voir plus de résultats.
                </p>
                <button
                    onClick={clearFilters}
                    className="group inline-flex items-center gap-3 bg-noir-950 px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] text-white transition-all hover:bg-gold-400 hover:text-noir-950"
                >
                    Effacer les filtres
                    <ArrowRight size={16} weight="bold" className="transition-transform group-hover:translate-x-1" />
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
