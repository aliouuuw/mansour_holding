import { Link, useParams } from '@tanstack/react-router'
import {
  ArrowLeft,
  Fuel,
  Gauge,
  Calendar,
  Palette,
  Settings2,
  Hash,
  Edit,
} from 'lucide-react'
import { cn, formatPrice, formatNumber } from '@/lib/utils'
import { vehicles, vehicleStatusLabels, vehicleStatusColors } from '@/data/mock'

export function MotorsVehicleDetail() {
  const { vehicleId } = useParams({ strict: false })
  const vehicle = vehicles.find((v) => v.id === vehicleId)

  if (!vehicle) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-lg font-medium text-primary-950">Véhicule non trouvé</p>
        <Link
          to="/dashboard/motors/inventory"
          className="mt-4 text-sm font-medium text-primary-600 hover:text-primary-700"
        >
          Retour à l'inventaire
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
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          to="/dashboard/motors/inventory"
          className="rounded-lg p-2 text-muted hover:bg-surface-bright transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-primary-950">
            {vehicle.make} {vehicle.model}
          </h1>
          <p className="mt-0.5 text-sm text-muted">{vehicle.year} · {vehicle.vin}</p>
        </div>
        <span
          className={cn(
            'rounded-full px-3 py-1 text-xs font-medium',
            vehicleStatusColors[vehicle.status]
          )}
        >
          {vehicleStatusLabels[vehicle.status]}
        </span>
        <button className="inline-flex items-center gap-2 rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-primary-900 shadow-sm hover:bg-surface-dim transition-colors">
          <Edit className="h-4 w-4" />
          Modifier
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Image */}
        <div className="lg:col-span-3">
          <div className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
            <img
              src={vehicle.image}
              alt={`${vehicle.make} ${vehicle.model}`}
              className="h-80 w-full object-cover lg:h-96"
            />
          </div>
          <div className="mt-6 rounded-xl border border-border bg-white p-6 shadow-sm">
            <h2 className="font-semibold text-primary-950">Description</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">{vehicle.description}</p>
          </div>
        </div>

        {/* Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
            <p className="text-sm text-muted">Prix</p>
            <p className="mt-1 text-3xl font-bold text-primary-950">{formatPrice(vehicle.price)}</p>
          </div>

          <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
            <h2 className="font-semibold text-primary-950">Caractéristiques</h2>
            <div className="mt-4 space-y-4">
              {specs.map((spec) => (
                <div key={spec.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-surface-dim p-2">
                      <spec.icon className="h-4 w-4 text-muted" />
                    </div>
                    <span className="text-sm text-muted">{spec.label}</span>
                  </div>
                  <span className="text-sm font-medium text-primary-900">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
            <h2 className="font-semibold text-primary-950">Actions rapides</h2>
            <div className="mt-4 space-y-2">
              <button className="w-full rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-700 transition-colors">
                Créer une affaire
              </button>
              <button className="w-full rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-primary-900 hover:bg-surface-dim transition-colors">
                Programmer un essai
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
