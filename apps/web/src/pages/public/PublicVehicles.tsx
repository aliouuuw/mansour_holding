import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import {
  Search,
  Building2,
  Fuel,
  Gauge,
  Calendar,
  ArrowRight,
  Phone,
  SlidersHorizontal,
} from 'lucide-react'
import { formatPrice, formatNumber } from '@/lib/utils'
import { vehicles } from '@/data/mock'

export function PublicVehicles() {
  const [search, setSearch] = useState('')
  const availableVehicles = vehicles.filter((v) => v.status === 'available')

  const filtered = availableVehicles.filter((v) => {
    const q = search.toLowerCase()
    return (
      v.make.toLowerCase().includes(q) ||
      v.model.toLowerCase().includes(q) ||
      v.year.toString().includes(q)
    )
  })

  return (
    <div className="min-h-screen bg-surface-dim">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <Building2 className="h-7 w-7 text-primary-600" />
            <div>
              <span className="text-lg font-bold text-primary-950">Mansour Motors</span>
              <span className="ml-2 text-xs text-muted">par Mansour Holding</span>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <a
              href="tel:+221331234567"
              className="hidden items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted hover:text-primary-900 sm:flex"
            >
              <Phone className="h-4 w-4" />
              +221 33 123 45 67
            </a>
            <Link
              to="/login"
              className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 transition-colors"
            >
              Espace pro
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-950 to-primary-800 px-4 py-16 text-center lg:py-20">
        <h1 className="text-3xl font-extrabold text-white lg:text-5xl">
          Trouvez votre véhicule idéal
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-primary-200">
          Découvrez notre sélection de véhicules premium neufs et d'occasion, soigneusement
          inspectés et garantis.
        </p>
        <div className="mx-auto mt-8 max-w-2xl">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
            <input
              type="text"
              placeholder="Rechercher par marque, modèle ou année..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border-0 bg-white py-4 pl-12 pr-4 text-base shadow-lg outline-none transition-shadow focus:ring-4 focus:ring-primary-300/30"
            />
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-muted">
            <span className="font-semibold text-primary-900">{filtered.length}</span> véhicules disponibles
          </p>
          <button className="inline-flex items-center gap-2 rounded-lg border border-border bg-white px-3 py-2 text-sm text-muted hover:bg-surface-dim transition-colors">
            <SlidersHorizontal className="h-4 w-4" />
            Filtres
          </button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((vehicle) => (
            <Link
              key={vehicle.id}
              to="/vehicules/$vehicleId"
              params={{ vehicleId: vehicle.id }}
              className="group overflow-hidden rounded-xl border border-border bg-white shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={vehicle.image}
                  alt={`${vehicle.make} ${vehicle.model}`}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute bottom-3 left-3">
                  <span className="rounded-lg bg-white/90 px-3 py-1 text-sm font-bold text-primary-900 backdrop-blur-sm shadow-sm">
                    {formatPrice(vehicle.price)}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold text-primary-950">
                  {vehicle.make} {vehicle.model}
                </h3>
                <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {vehicle.year}
                  </span>
                  <span className="flex items-center gap-1">
                    <Gauge className="h-3.5 w-3.5" />
                    {formatNumber(vehicle.mileage)} km
                  </span>
                  <span className="flex items-center gap-1">
                    <Fuel className="h-3.5 w-3.5" />
                    {vehicle.fuelType}
                  </span>
                </div>
                <p className="mt-3 text-sm text-muted line-clamp-2">{vehicle.description}</p>
                <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-primary-600 group-hover:text-primary-700">
                  Voir les détails <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-lg font-medium text-primary-950">Aucun véhicule trouvé</p>
            <p className="mt-2 text-sm text-muted">Essayez de modifier vos critères de recherche</p>
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="border-t border-border bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 text-center lg:px-8">
          <h2 className="text-2xl font-bold text-primary-950">Vous ne trouvez pas ce que vous cherchez ?</h2>
          <p className="mx-auto mt-3 max-w-lg text-muted">
            Contactez-nous et notre équipe vous aidera à trouver le véhicule parfait pour vos besoins.
          </p>
          <a
            href="tel:+221331234567"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-3 text-sm font-semibold text-white hover:bg-primary-700 transition-colors"
          >
            <Phone className="h-4 w-4" />
            Appelez-nous
          </a>
        </div>
      </section>
    </div>
  )
}
