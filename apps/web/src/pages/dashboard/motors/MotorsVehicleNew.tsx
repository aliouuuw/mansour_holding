import { Link, useNavigate } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft01Icon } from 'hugeicons-react'
import { vehiclesApi } from '@/lib/api'
import { VehicleForm, type VehicleFormValues } from '@/components/motors/VehicleForm'
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
      extras: Object.fromEntries(values.extras.map(({ key, value }) => [key, value])),
    }),
    onSuccess: async (vehicle) => {
      await qc.invalidateQueries({ queryKey: ['vehicles'] })
      qc.invalidateQueries({ queryKey: ['public-vehicles'] })
      qc.invalidateQueries({ queryKey: ['public-featured-vehicles'] })
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
      <div className="flex items-center gap-4">
        <Link to="/dashboard/motors/inventory" className="rounded-sm p-2 text-noir-600 hover:bg-surface-dim transition-colors">
          <ArrowLeft01Icon className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-noir-950">Nouveau véhicule</h1>
          <p className="mt-0.5 text-sm text-noir-500">Remplissez les informations du véhicule</p>
        </div>
      </div>

      <div className="border border-noir-200 bg-white p-6 shadow-sm">
        {createMutation.error && (
          <div className="mb-4 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {(createMutation.error as Error).message}
          </div>
        )}
        <VehicleForm onSubmit={async (v) => { await createMutation.mutateAsync(v) }} submitLabel="Créer le véhicule" loading={createMutation.isPending} />
      </div>
    </motion.div>
  )
}
