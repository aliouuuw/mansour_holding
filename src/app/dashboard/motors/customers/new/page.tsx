'use client'

import { useNavigate } from '@/lib/router'
import { motion } from 'framer-motion'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { ArrowLeft01Icon } from 'hugeicons-react'
import { customersApi, invalidateMotorsQueries, type CustomerSource } from '@/lib/api'
import { useToast } from '@/components/ui/Toast'
import {
  DashButton,
  mmInputClass,
  mmLabelClass,
  mmSelectClass,
  mmTextareaClass,
} from '@/components/dashboard'
import { Link } from '@/lib/router'

interface CustomerFormValues {
  firstName: string
  lastName: string
  email: string
  phone: string
  source: CustomerSource
  address: string
  notes: string
}

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
      invalidateMotorsQueries(qc)
      toast('Client créé avec succès')
      void navigate({ to: '/dashboard/motors/customers/$customerId', params: { customerId: customer.id } })
    },
    onError: (e) => toast((e as Error).message, 'error'),
  })

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
      className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/dashboard/motors/customers" className="mm-icon-btn" aria-label="Retour aux clients">
          <ArrowLeft01Icon className="h-5 w-5" aria-hidden="true" />
        </Link>
        <div>
          <h1 className="mm-title">Nouveau client</h1>
          <p className="mm-lead">Remplissez les informations du client</p>
        </div>
      </div>

      <div className="mm-panel mm-panel-pad">
        {createMutation.error && (
          <div className="mm-alert-error">
            {(createMutation.error as Error).message}
          </div>
        )}
        <form onSubmit={handleSubmit((v) => createMutation.mutate(v))} className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={mmLabelClass}>Prénom</label>
              <input {...register('firstName', { required: 'Requis' })} className={mmInputClass} placeholder="Amadou" />
              {errors.firstName && <p className="mm-field-error">{errors.firstName.message}</p>}
            </div>
            <div>
              <label className={mmLabelClass}>Nom</label>
              <input {...register('lastName', { required: 'Requis' })} className={mmInputClass} placeholder="Diallo" />
              {errors.lastName && <p className="mm-field-error">{errors.lastName.message}</p>}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={mmLabelClass}>Email</label>
              <input type="email" {...register('email', { required: 'Requis' })} className={mmInputClass} placeholder="amadou@email.com" />
              {errors.email && <p className="mm-field-error">{errors.email.message}</p>}
            </div>
            <div>
              <label className={mmLabelClass}>Téléphone</label>
              <input {...register('phone', { required: 'Requis' })} className={mmInputClass} placeholder="+221 77 123 45 67" />
              {errors.phone && <p className="mm-field-error">{errors.phone.message}</p>}
            </div>
          </div>

          <div>
            <label className={mmLabelClass}>Source</label>
            <select {...register('source')} className={mmSelectClass}>
              <option value="walk-in">Passage en boutique</option>
              <option value="referral">Référence</option>
              <option value="online">En ligne</option>
              <option value="phone">Téléphone</option>
            </select>
          </div>

          <div>
            <label className={mmLabelClass}>Adresse (optionnel)</label>
            <input {...register('address')} className={mmInputClass} placeholder="Dakar, Sénégal" />
          </div>

          <div>
            <label className={mmLabelClass}>Notes (optionnel)</label>
            <textarea {...register('notes')} rows={3} className={`${mmTextareaClass} resize-none`} placeholder="Notes sur le client..." />
          </div>

          <DashButton type="submit" disabled={createMutation.isPending} full>
            {createMutation.isPending ? 'Enregistrement…' : 'Créer le client'}
          </DashButton>
        </form>
      </div>
    </motion.div>
  )
}

export default MotorsCustomerNew
