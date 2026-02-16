import { Link, useParams } from '@tanstack/react-router'
import {
  ArrowLeft,
  Building2,
  Fuel,
  Gauge,
  Calendar,
  Palette,
  Settings2,
  Hash,
  Phone,
  Mail,
  MessageSquare,
} from 'lucide-react'
import { formatPrice, formatNumber } from '@/lib/utils'
import { vehicles } from '@/data/mock'

export function PublicVehicleDetail() {
  const { vehicleId } = useParams({ strict: false })
  const vehicle = vehicles.find((v) => v.id === vehicleId)

  if (!vehicle) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <p className="text-lg font-medium text-primary-950">Véhicule non trouvé</p>
        <Link
          to="/vehicules"
          className="mt-4 text-sm font-medium text-primary-600 hover:text-primary-700"
        >
          Retour aux véhicules
        </Link>
      </div>
    )
  }

  const specs = [
    { label: 'Année', value: vehicle.year.toString(), icon: Calendar },
    { label: 'Kilométrage', value: `${formatNumber(vehicle.mileage)} km`, icon: Gauge },
    { label: 'Carburant', value: vehicle.fuelType, icon: Fuel },
    { label: 'Transmission', value: vehicle.transmission, icon: Settings2 },
    { label: 'Couleur', value: vehicle.color, icon: Palette },
    { label: 'VIN', value: vehicle.vin, icon: Hash },
  ]

  return (
    <div className="min-h-screen bg-surface-dim">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <Building2 className="h-7 w-7 text-primary-600" />
            <span className="text-lg font-bold text-primary-950">Mansour Motors</span>
          </Link>
          <a
            href="tel:+221331234567"
            className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 transition-colors"
          >
            <Phone className="h-4 w-4" />
            <span className="hidden sm:inline">Appelez-nous</span>
          </a>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        {/* Back */}
        <Link
          to="/vehicules"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-primary-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour aux véhicules
        </Link>

        <div className="grid gap-8 lg:grid-cols-5">
          {/* Left - Image & Description */}
          <div className="lg:col-span-3 space-y-6">
            <div className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
              <img
                src={vehicle.image}
                alt={`${vehicle.make} ${vehicle.model}`}
                className="h-72 w-full object-cover sm:h-96"
              />
            </div>

            <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-primary-950">Description</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted">{vehicle.description}</p>
            </div>

            <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-primary-950">Caractéristiques</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {specs.map((spec) => (
                  <div key={spec.label} className="flex items-center gap-3 rounded-lg bg-surface-dim p-3">
                    <spec.icon className="h-5 w-5 text-muted" />
                    <div>
                      <p className="text-xs text-muted">{spec.label}</p>
                      <p className="text-sm font-medium text-primary-900">{spec.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right - Price & Contact */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
              <h1 className="text-2xl font-bold text-primary-950">
                {vehicle.make} {vehicle.model}
              </h1>
              <p className="mt-1 text-sm text-muted">{vehicle.year} · {vehicle.color}</p>
              <p className="mt-4 text-3xl font-extrabold text-primary-600">
                {formatPrice(vehicle.price)}
              </p>
            </div>

            <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-primary-950">Intéressé ?</h2>
              <p className="mt-2 text-sm text-muted">
                Remplissez le formulaire et notre équipe vous contactera rapidement.
              </p>
              <form className="mt-5 space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label className="block text-sm font-medium text-primary-900">Nom complet</label>
                  <input
                    type="text"
                    placeholder="Votre nom"
                    className="mt-1.5 w-full rounded-lg border border-border bg-white px-4 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary-900">Téléphone</label>
                  <input
                    type="tel"
                    placeholder="+221 77 123 45 67"
                    className="mt-1.5 w-full rounded-lg border border-border bg-white px-4 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary-900">Email</label>
                  <input
                    type="email"
                    placeholder="votre@email.com"
                    className="mt-1.5 w-full rounded-lg border border-border bg-white px-4 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary-900">Message</label>
                  <textarea
                    rows={3}
                    placeholder="Je suis intéressé par ce véhicule..."
                    className="mt-1.5 w-full rounded-lg border border-border bg-white px-4 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 transition-colors"
                >
                  Envoyer ma demande
                </button>
              </form>
            </div>

            <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-primary-950">Contact direct</h2>
              <div className="mt-4 space-y-3">
                <a
                  href="tel:+221331234567"
                  className="flex items-center gap-3 rounded-lg p-3 text-sm text-primary-900 hover:bg-surface-dim transition-colors"
                >
                  <Phone className="h-5 w-5 text-primary-600" />
                  +221 33 123 45 67
                </a>
                <a
                  href="mailto:motors@mansourholding.com"
                  className="flex items-center gap-3 rounded-lg p-3 text-sm text-primary-900 hover:bg-surface-dim transition-colors"
                >
                  <Mail className="h-5 w-5 text-primary-600" />
                  motors@mansourholding.com
                </a>
                <a
                  href="https://wa.me/221771234567"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-lg p-3 text-sm text-primary-900 hover:bg-surface-dim transition-colors"
                >
                  <MessageSquare className="h-5 w-5 text-emerald-600" />
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
