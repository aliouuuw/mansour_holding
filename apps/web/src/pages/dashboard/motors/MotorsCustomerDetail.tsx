import { useState, useEffect } from 'react'
import { Link, useParams } from '@tanstack/react-router'
import { ArrowLeft01Icon, Mail01Icon, SmartPhone01Icon, Location01Icon, Loading03Icon } from 'hugeicons-react'
import { formatDate } from '@/lib/utils'
import { customersApi, type ApiCustomer, type CustomerSource } from '@/lib/api'

const sourceLabels: Record<CustomerSource, string> = {
  'walk-in': 'Passage en boutique',
  referral: 'Référence',
  online: 'En ligne',
  phone: 'Téléphone',
}

export function MotorsCustomerDetail() {
  const { customerId } = useParams({ strict: false })
  const [customer, setCustomer] = useState<ApiCustomer | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!customerId) return
    setLoading(true)
    customersApi.get(customerId)
      .then(setCustomer)
      .catch((e) => setError(e instanceof Error ? e.message : 'Erreur de chargement'))
      .finally(() => setLoading(false))
  }, [customerId])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loading03Icon className="h-8 w-8 animate-spin text-gold-400" />
      </div>
    )
  }

  if (error || !customer) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-lg font-medium text-noir-950">{error ?? 'Client non trouvé'}</p>
        <Link to="/dashboard/motors/customers" className="mt-4 text-sm font-medium text-gold-600 hover:text-gold-700">
          Retour aux clients
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Back + title */}
      <div className="flex items-center gap-4">
        <Link to="/dashboard/motors/customers" className="rounded-sm p-2 text-noir-600 hover:bg-surface-dim transition-colors">
          <ArrowLeft01Icon className="h-5 w-5" />
        </Link>
        <div className="flex items-center gap-4 flex-1">
          <div className="flex h-12 w-12 items-center justify-center bg-noir-950 text-sm font-bold text-white">
            {customer.firstName[0]}{customer.lastName[0]}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-noir-950">{customer.firstName} {customer.lastName}</h1>
            <p className="text-sm text-noir-500">Client depuis le {formatDate(customer.createdAt)}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Contact info */}
        <div className="lg:col-span-2 space-y-4">
          <div className="border border-noir-200 bg-white p-6 shadow-sm">
            <h2 className="font-semibold text-noir-950">Coordonnées</h2>
            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-3">
                <Mail01Icon className="h-4 w-4 text-noir-400" />
                <a href={`mailto:${customer.email}`} className="text-sm text-noir-700 hover:text-gold-600 transition-colors">
                  {customer.email}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <SmartPhone01Icon className="h-4 w-4 text-noir-400" />
                <a href={`tel:${customer.phone}`} className="text-sm text-noir-700 hover:text-gold-600 transition-colors">
                  {customer.phone}
                </a>
              </div>
              {customer.address && (
                <div className="flex items-start gap-3">
                  <Location01Icon className="h-4 w-4 text-noir-400 mt-0.5" />
                  <span className="text-sm text-noir-700">{customer.address}</span>
                </div>
              )}
            </div>
          </div>

          {customer.notes && (
            <div className="border border-noir-200 bg-white p-6 shadow-sm">
              <h2 className="font-semibold text-noir-950">Notes</h2>
              <p className="mt-3 text-sm leading-relaxed text-noir-600">{customer.notes}</p>
            </div>
          )}
        </div>

        {/* Meta */}
        <div className="space-y-4">
          <div className="border border-noir-200 bg-white p-6 shadow-sm">
            <h2 className="font-semibold text-noir-950">Informations</h2>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-noir-500">Source</span>
                <span className="font-medium text-noir-900">{sourceLabels[customer.source]}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-noir-500">Ajouté le</span>
                <span className="font-medium text-noir-900">{formatDate(customer.createdAt)}</span>
              </div>
            </div>
          </div>

          <div className="border border-noir-200 bg-white p-6 shadow-sm">
            <h2 className="font-semibold text-noir-950">Actions</h2>
            <div className="mt-4 space-y-2">
              <button className="w-full bg-noir-950 px-4 py-2.5 text-sm font-medium text-white hover:bg-noir-800 transition-colors">
                Créer une affaire
              </button>
              <button className="w-full border border-noir-200 px-4 py-2.5 text-sm font-medium text-noir-900 hover:bg-surface-dim transition-colors">
                Modifier le client
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
