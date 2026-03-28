import { Link, useNavigate } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { ArrowLeft01Icon, Loading03Icon } from 'hugeicons-react'
import { vehiclesApi, customersApi, dealsApi, type DealStatus } from '@/lib/api'
import { useToast } from '@/components/ui/Toast'
import { formatPrice } from '@/lib/utils'

interface DealFormValues {
  vehicleId: string
  customerId: string
  price: number
  status: DealStatus
  notes: string
}

const inputClass = 'w-full border border-noir-200 bg-white px-3 py-2.5 text-sm text-noir-900 outline-none transition-all focus:border-gold-400 focus:ring-1 focus:ring-gold-400/20'
const labelClass = 'block text-xs font-semibold uppercase tracking-wider text-noir-500 mb-1.5'

export function MotorsDealNew() {
  const navigate = useNavigate()
  const qc = useQueryClient()
  const toast = useToast()

  const { data: vehiclesData, isLoading: loadingVehicles } = useQuery({
    queryKey: ['vehicles-for-deal'],
    queryFn: () => vehiclesApi.list({ limit: 100 }),
  })

  const { data: customersData, isLoading: loadingCustomers } = useQuery({
    queryKey: ['customers-for-deal'],
    queryFn: () => customersApi.list({ limit: 100 }),
  })

  const vehicles = vehiclesData?.data ?? []
  const customers = customersData?.data ?? []

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<DealFormValues>({
    defaultValues: { status: 'lead', price: 0 },
  })

  const createMutation = useMutation({
    mutationFn: (values: DealFormValues) => dealsApi.create({
      vehicleId: values.vehicleId,
      customerId: values.customerId,
      price: values.price,
      status: values.status,
      notes: values.notes || null,
      testDriveDate: null,
      closedAt: null,
    }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['deals'] })
      qc.invalidateQueries({ queryKey: ['deals-summary'] })
      toast('Affaire créée avec succès')
      void navigate({ to: '/dashboard/motors/sales' })
    },
    onError: (e) => toast((e as Error).message, 'error'),
  })

  if (loadingVehicles || loadingCustomers) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loading03Icon className="h-8 w-8 animate-spin text-gold-400" />
      </div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
      className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/dashboard/motors/sales" className="rounded-sm p-2 text-noir-600 hover:bg-surface-dim transition-colors">
          <ArrowLeft01Icon className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-noir-950">Nouvelle affaire</h1>
          <p className="mt-0.5 text-sm text-noir-500">Associez un véhicule à un client</p>
        </div>
      </div>

      <div className="border border-noir-200 bg-white p-6 shadow-sm">
        {createMutation.error && (
          <div className="mb-4 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {(createMutation.error as Error).message}
          </div>
        )}
        <form onSubmit={handleSubmit((v) => createMutation.mutate(v))} className="space-y-6">
          {/* Vehicle */}
          <div>
            <label className={labelClass}>Véhicule</label>
            <select
              {...register('vehicleId', { required: 'Requis' })}
              className={inputClass}
              onChange={(e) => {
                const v = vehicles.find(v => v.id === e.target.value)
                if (v) setValue('price', v.price)
                register('vehicleId').onChange(e)
              }}
            >
              <option value="">Sélectionner un véhicule</option>
              {vehicles.map(v => (
                <option key={v.id} value={v.id}>
                  {v.make} {v.model} {v.year} — {formatPrice(v.price)}
                </option>
              ))}
            </select>
            {errors.vehicleId && <p className="mt-1 text-xs text-red-600">{errors.vehicleId.message}</p>}
          </div>

          {/* Customer */}
          <div>
            <label className={labelClass}>Client</label>
            <select {...register('customerId', { required: 'Requis' })} className={inputClass}>
              <option value="">Sélectionner un client</option>
              {customers.map(c => (
                <option key={c.id} value={c.id}>
                  {c.firstName} {c.lastName} — {c.phone}
                </option>
              ))}
            </select>
            {errors.customerId && <p className="mt-1 text-xs text-red-600">{errors.customerId.message}</p>}
            <Link to="/dashboard/motors/customers/new"
              className="mt-1.5 inline-block text-xs font-medium text-gold-600 hover:text-gold-700 transition-colors">
              + Créer un nouveau client
            </Link>
          </div>

          {/* Price + Status */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Prix proposé (F CFA)</label>
              <input type="number" {...register('price', { required: 'Requis', valueAsNumber: true, min: { value: 1, message: 'Invalide' } })}
                className={inputClass} />
              {errors.price && <p className="mt-1 text-xs text-red-600">{errors.price.message}</p>}
            </div>
            <div>
              <label className={labelClass}>Statut initial</label>
              <select {...register('status')} className={inputClass}>
                <option value="lead">Prospect</option>
                <option value="negotiation">Négociation</option>
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className={labelClass}>Notes (optionnel)</label>
            <textarea {...register('notes')} rows={3} className={`${inputClass} resize-none`}
              placeholder="Détails sur l'affaire..." />
          </div>

          <button type="submit" disabled={createMutation.isPending}
            className="w-full bg-noir-950 px-4 py-3 text-sm font-semibold text-white hover:bg-noir-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            {createMutation.isPending ? 'Enregistrement...' : 'Créer l\'affaire'}
          </button>
        </form>
      </div>
    </motion.div>
  )
}
