import { Link, useNavigate } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { ArrowLeft01Icon } from 'hugeicons-react'
import { customersApi, type CustomerSource } from '@/lib/api'
import { useToast } from '@/components/ui/Toast'
import { cn } from '@/lib/utils'

interface CustomerFormValues {
  firstName: string
  lastName: string
  email: string
  phone: string
  source: CustomerSource
  address: string
  notes: string
}

const inputClass = 'w-full border border-noir-200 bg-white px-3 py-2.5 text-sm text-noir-900 outline-none transition-all focus:border-gold-400 focus:ring-1 focus:ring-gold-400/20'
const labelClass = 'block text-xs font-semibold uppercase tracking-wider text-noir-500 mb-1.5'

export function MotorsCustomerNew() {
  const navigate = useNavigate()
  const qc = useQueryClient()
  const toast = useToast()
  const { register, handleSubmit, formState: { errors } } = useForm<CustomerFormValues>({
    defaultValues: { source: 'walk-in' },
  })

  const createMutation = useMutation({
    mutationFn: (values: CustomerFormValues) => customersApi.create({
      ...values,
      address: values.address || null,
      notes: values.notes || null,
    }),
    onSuccess: async (customer) => {
      await qc.invalidateQueries({ queryKey: ['customers'] })
      toast('Client créé avec succès')
      void navigate({ to: '/dashboard/motors/customers/$customerId', params: { customerId: customer.id } })
    },
    onError: (e) => toast((e as Error).message, 'error'),
  })

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
      className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/dashboard/motors/customers" className="rounded-sm p-2 text-noir-600 hover:bg-surface-dim transition-colors">
          <ArrowLeft01Icon className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-noir-950">Nouveau client</h1>
          <p className="mt-0.5 text-sm text-noir-500">Remplissez les informations du client</p>
        </div>
      </div>

      <div className="border border-noir-200 bg-white p-6 shadow-sm">
        {createMutation.error && (
          <div className="mb-4 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {(createMutation.error as Error).message}
          </div>
        )}
        <form onSubmit={handleSubmit((v) => createMutation.mutate(v))} className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Prénom</label>
              <input {...register('firstName', { required: 'Requis' })} className={inputClass} placeholder="Amadou" />
              {errors.firstName && <p className="mt-1 text-xs text-red-600">{errors.firstName.message}</p>}
            </div>
            <div>
              <label className={labelClass}>Nom</label>
              <input {...register('lastName', { required: 'Requis' })} className={inputClass} placeholder="Diallo" />
              {errors.lastName && <p className="mt-1 text-xs text-red-600">{errors.lastName.message}</p>}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Email</label>
              <input type="email" {...register('email', { required: 'Requis' })} className={inputClass} placeholder="amadou@email.com" />
              {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
            </div>
            <div>
              <label className={labelClass}>Téléphone</label>
              <input {...register('phone', { required: 'Requis' })} className={inputClass} placeholder="+221 77 123 45 67" />
              {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>}
            </div>
          </div>

          <div>
            <label className={labelClass}>Source</label>
            <select {...register('source')} className={inputClass}>
              <option value="walk-in">Passage en boutique</option>
              <option value="referral">Référence</option>
              <option value="online">En ligne</option>
              <option value="phone">Téléphone</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>Adresse (optionnel)</label>
            <input {...register('address')} className={inputClass} placeholder="Dakar, Sénégal" />
          </div>

          <div>
            <label className={labelClass}>Notes (optionnel)</label>
            <textarea {...register('notes')} rows={3} className={cn(inputClass, 'resize-none')} placeholder="Notes sur le client..." />
          </div>

          <button type="submit" disabled={createMutation.isPending}
            className="w-full bg-noir-950 px-4 py-3 text-sm font-semibold text-white hover:bg-noir-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            {createMutation.isPending ? 'Enregistrement...' : 'Créer le client'}
          </button>
        </form>
      </div>
    </motion.div>
  )
}
