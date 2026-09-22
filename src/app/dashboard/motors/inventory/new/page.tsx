'use client'

import { useNavigate } from '@/lib/router'
import { motion } from 'framer-motion'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { DashBreadcrumbs } from '@/components/dashboard'
import { vehiclesApi, invalidateMotorsQueries } from '@/lib/api'
import { VehicleForm, arrivedAtFromForm, toExtras, type VehicleFormValues } from '@/components/motors/VehicleForm'
import { useToast } from '@/components/ui/Toast'
export function MotorsVehicleNew() {
  const navigate = useNavigate()
  const qc = useQueryClient()
  const toast = useToast()

  const createMutation = useMutation({
    mutationFn: (values: VehicleFormValues) => vehiclesApi.create({
      ...values,
      vin: values.vin || null,
      description: values.description || null,
      images: [],
      extras: toExtras(values),
      arrivedAt: arrivedAtFromForm(values.arrivedAt),
    }),
    onSuccess: async (vehicle) => {
      invalidateMotorsQueries(qc)
      toast('Véhicule créé avec succès')
      void navigate({ to: '/dashboard/motors/inventory/$vehicleId', params: { vehicleId: vehicle.id } })
    },
    onError: (e) => toast((e as Error).message, 'error'),
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mx-auto max-w-2xl space-y-6"
    >
      <DashBreadcrumbs
        items={[
          { label: 'Mansour Motors', to: '/dashboard/motors' },
          { label: 'Inventaire', to: '/dashboard/motors/inventory' },
          { label: 'Nouveau véhicule' },
        ]}
      />
      <div>
        <h1 className="mm-title">Nouveau véhicule</h1>
        <p className="mm-lead">Remplissez les informations du véhicule</p>
      </div>

      <div className="mm-panel mm-panel-pad">
        {createMutation.error && (
          <div className="mm-alert-error">
            {(createMutation.error as Error).message}
          </div>
        )}
        <VehicleForm
          onSubmit={async (v) => { await createMutation.mutateAsync(v) }}
          submitLabel="Créer le véhicule"
          loading={createMutation.isPending}
        />
      </div>
    </motion.div>
  )
}

export default MotorsVehicleNew
