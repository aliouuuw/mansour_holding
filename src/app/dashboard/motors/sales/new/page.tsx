'use client'

import { Link, useNavigate } from '@/lib/router'
import { motion } from 'framer-motion'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { ArrowLeft01Icon } from 'hugeicons-react'
import { vehiclesApi, customersApi, dealsApi, invalidateMotorsQueries, type DealStatus } from '@/lib/api'
import { useToast } from '@/components/ui/Toast'
import { formatPrice } from '@/lib/utils'
import {
  DashButton,
  mmInputClass,
  mmLabelClass,
  mmSelectClass,
  mmTextareaClass,
} from '@/components/dashboard'

interface DealFormValues {
  vehicleId: string
  customerId: string
  price: number
  status: DealStatus
  notes: string
}

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
      invalidateMotorsQueries(qc)
      toast('Affaire créée avec succès')
      void navigate({ to: '/dashboard/motors/sales' })
    },
    onError: (e) => toast((e as Error).message, 'error'),
  })

  if (loadingVehicles || loadingCustomers) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="mm-spinner" role="status" aria-label="Chargement" />
      </div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
      className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/dashboard/motors/sales" className="mm-icon-btn" aria-label="Retour aux ventes">
          <ArrowLeft01Icon className="h-5 w-5" aria-hidden="true" />
        </Link>
        <div>
          <h1 className="mm-title">Nouvelle affaire</h1>
          <p className="mm-lead">Associez un véhicule à un client</p>
        </div>
      </div>

      <div className="mm-panel mm-panel-pad">
        {createMutation.error && (
          <div className="mm-alert-error">
            {(createMutation.error as Error).message}
          </div>
        )}
        <form onSubmit={handleSubmit((v) => createMutation.mutate(v))} className="space-y-6">
          <div>
            <label className={mmLabelClass}>Véhicule</label>
            <select
              {...register('vehicleId', { required: 'Requis' })}
              className={mmSelectClass}
              onChange={(e) => {
                const v = vehicles.find((veh) => veh.id === e.target.value)
                if (v?.price != null) setValue('price', v.price)
                register('vehicleId').onChange(e)
              }}
            >
              <option value="">Sélectionner un véhicule</option>
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.make} {v.model} {v.year} — {formatPrice(v.price)}
                </option>
              ))}
            </select>
            {errors.vehicleId && <p className="mm-field-error">{errors.vehicleId.message}</p>}
          </div>

          <div>
            <label className={mmLabelClass}>Client</label>
            <select {...register('customerId', { required: 'Requis' })} className={mmSelectClass}>
              <option value="">Sélectionner un client</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.firstName} {c.lastName} — {c.phone}
                </option>
              ))}
            </select>
            {errors.customerId && <p className="mm-field-error">{errors.customerId.message}</p>}
            <Link to="/dashboard/motors/customers/new" className="mm-link mt-2 inline-block">
              + Créer un nouveau client
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={mmLabelClass}>Prix proposé (F CFA)</label>
              <input
                type="number"
                {...register('price', { required: 'Requis', valueAsNumber: true, min: { value: 1, message: 'Invalide' } })}
                className={mmInputClass}
              />
              {errors.price && <p className="mm-field-error">{errors.price.message}</p>}
            </div>
            <div>
              <label className={mmLabelClass}>Statut initial</label>
              <select {...register('status')} className={mmSelectClass}>
                <option value="lead">Prospect</option>
                <option value="negotiation">Négociation</option>
              </select>
            </div>
          </div>

          <div>
            <label className={mmLabelClass}>Notes (optionnel)</label>
            <textarea {...register('notes')} rows={3} className={`${mmTextareaClass} resize-none`}
              placeholder="Détails sur l'affaire..." />
          </div>

          <DashButton type="submit" disabled={createMutation.isPending} full>
            {createMutation.isPending ? 'Enregistrement…' : "Créer l'affaire"}
          </DashButton>
        </form>
      </div>
    </motion.div>
  )
}

export default MotorsDealNew
