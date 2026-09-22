'use client'

import { useState } from 'react'
import { Link, useParams, useNavigate } from '@/lib/router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import {
  ArrowLeft01Icon, Mail01Icon, SmartPhone01Icon, Location01Icon,
  Edit01Icon, Delete01Icon, Cancel01Icon,
} from 'hugeicons-react'
import { formatDate } from '@/lib/utils'
import {
  DashButton,
  mmInputClass,
  mmLabelClass,
  mmSelectClass,
  mmTextareaClass,
} from '@/components/dashboard'
import { customersApi, invalidateMotorsQueries, type CustomerSource } from '@/lib/api'
import { useToast } from '@/components/ui/Toast'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'

const sourceLabels: Record<CustomerSource, string> = {
  'walk-in': 'Passage en boutique',
  referral: 'Référence',
  online: 'En ligne',
  phone: 'Téléphone',
}

interface CustomerFormValues {
  firstName: string
  lastName: string
  email: string
  phone: string
  source: CustomerSource
  address: string
  notes: string
}

export function MotorsCustomerDetail() {
  const { customerId } = useParams({ strict: false })
  const navigate = useNavigate()
  const qc = useQueryClient()
  const toast = useToast()
  const [editing, setEditing] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const { data: customer, isLoading, error } = useQuery({
    queryKey: ['customer', customerId],
    queryFn: () => customersApi.get(customerId!),
    enabled: !!customerId,
  })

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CustomerFormValues>()

  const updateMutation = useMutation({
    mutationFn: (values: CustomerFormValues) => customersApi.update(customerId!, {
      ...values,
      address: values.address || null,
      notes: values.notes || null,
    }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['customer', customerId] })
      invalidateMotorsQueries(qc)
      setEditing(false)
      toast('Client mis à jour')
    },
    onError: (e) => toast((e as Error).message, 'error'),
  })

  const deleteMutation = useMutation({
    mutationFn: () => customersApi.delete(customerId!),
    onSuccess: async () => {
      invalidateMotorsQueries(qc)
      qc.removeQueries({ queryKey: ['customer', customerId] })
      setShowDeleteDialog(false)
      toast('Client supprimé')
      void navigate({ to: '/dashboard/motors/customers' })
    },
    onError: (e) => {
      toast((e as Error).message, 'error')
      setShowDeleteDialog(false)
    },
  })

  function startEditing() {
    if (!customer) return
    reset({
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: customer.email,
      phone: customer.phone,
      source: customer.source,
      address: customer.address ?? '',
      notes: customer.notes ?? '',
    })
    setEditing(true)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="mm-spinner" role="status" aria-label="Chargement" />
      </div>
    )
  }

  if (error || !customer) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="mm-title">{(error as Error)?.message ?? 'Client non trouvé'}</p>
        <Link to="/dashboard/motors/customers" className="mm-link mt-4 inline-block">
          Retour aux clients
        </Link>
      </div>
    )
  }

  // ── Edit mode ──
  if (editing) {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="flex items-center gap-4">
          <button type="button" onClick={() => setEditing(false)} className="mm-icon-btn" aria-label="Annuler">
            <Cancel01Icon className="h-5 w-5" aria-hidden="true" />
          </button>
          <div>
            <h1 className="mm-title">Modifier le client</h1>
            <p className="mm-lead">{customer.firstName} {customer.lastName}</p>
          </div>
        </div>

        <div className="mm-panel mm-panel-pad">
          {updateMutation.error && (
            <div className="mm-alert-error">
              {(updateMutation.error as Error).message}
            </div>
          )}
          <form onSubmit={handleSubmit((v) => updateMutation.mutate(v))} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={mmLabelClass}>Prénom</label>
                <input {...register('firstName', { required: 'Requis' })} className={mmInputClass} />
                {errors.firstName && <p className="mm-field-error">{errors.firstName.message}</p>}
              </div>
              <div>
                <label className={mmLabelClass}>Nom</label>
                <input {...register('lastName', { required: 'Requis' })} className={mmInputClass} />
                {errors.lastName && <p className="mm-field-error">{errors.lastName.message}</p>}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={mmLabelClass}>Email</label>
                <input type="email" {...register('email', { required: 'Requis' })} className={mmInputClass} />
                {errors.email && <p className="mm-field-error">{errors.email.message}</p>}
              </div>
              <div>
                <label className={mmLabelClass}>Téléphone</label>
                <input {...register('phone', { required: 'Requis' })} className={mmInputClass} />
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
              <input {...register('address')} className={mmInputClass} />
            </div>

            <div>
              <label className={mmLabelClass}>Notes (optionnel)</label>
              <textarea {...register('notes')} rows={3} className={`${mmTextareaClass} resize-none`} />
            </div>

            <div className="flex gap-3">
              <DashButton type="submit" disabled={updateMutation.isPending} className="flex-1">
                {updateMutation.isPending ? 'Enregistrement…' : 'Enregistrer'}
              </DashButton>
              <DashButton type="button" variant="soft" onClick={() => setEditing(false)}>
                Annuler
              </DashButton>
            </div>
          </form>
        </div>
      </div>
    )
  }

  // ── View mode ──
  return (
    <div className="space-y-6">
      {/* Back + title + actions */}
      <div className="flex items-center gap-4">
        <Link to="/dashboard/motors/customers" className="mm-icon-btn" aria-label="Retour aux clients">
          <ArrowLeft01Icon className="h-5 w-5" aria-hidden="true" />
        </Link>
        <div className="flex flex-1 items-center gap-4">
          <div className="mm-avatar h-12 w-12 text-sm">
            {customer.firstName[0]}{customer.lastName[0]}
          </div>
          <div>
            <h1 className="mm-title">{customer.firstName} {customer.lastName}</h1>
            <p className="mm-lead">Client depuis le {formatDate(customer.createdAt)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <DashButton type="button" variant="soft" onClick={startEditing}>
            <Edit01Icon className="h-4 w-4" aria-hidden="true" /> Modifier
          </DashButton>
          <button type="button" onClick={() => setShowDeleteDialog(true)} className="mm-danger-soft">
            <Delete01Icon className="h-4 w-4" aria-hidden="true" /> Supprimer
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Contact info */}
        <div className="lg:col-span-2 space-y-4">
          <div className="mm-panel mm-panel-pad">
            <h2 className="mm-panel-title">Coordonnées</h2>
            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-3">
                <Mail01Icon className="h-4 w-4 text-[var(--mm-grey-muted)]" aria-hidden="true" />
                <a href={`mailto:${customer.email}`} className="mm-link text-sm">
                  {customer.email}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <SmartPhone01Icon className="h-4 w-4 text-[var(--mm-grey-muted)]" aria-hidden="true" />
                <a href={`tel:${customer.phone}`} className="mm-link text-sm">
                  {customer.phone}
                </a>
              </div>
              {customer.address && (
                <div className="flex items-start gap-3">
                  <Location01Icon className="mt-0.5 h-4 w-4 text-[var(--mm-grey-muted)]" aria-hidden="true" />
                  <span className="text-sm">{customer.address}</span>
                </div>
              )}
            </div>
          </div>

          {customer.notes && (
            <div className="mm-panel mm-panel-pad">
              <h2 className="mm-panel-title">Notes</h2>
              <p className="mt-3 text-sm leading-relaxed mm-muted">{customer.notes}</p>
            </div>
          )}
        </div>

        {/* Meta */}
        <div className="space-y-4">
          <div className="mm-panel mm-panel-pad">
            <h2 className="mm-panel-title">Informations</h2>
            <div className="mt-4 space-y-3">
              <div className="mm-meta-row">
                <span>Source</span>
                <span className="font-medium">{sourceLabels[customer.source]}</span>
              </div>
              <div className="mm-meta-row">
                <span>Ajouté le</span>
                <span className="font-medium">{formatDate(customer.createdAt)}</span>
              </div>
            </div>
          </div>

          <div className="mm-panel mm-panel-pad">
            <h2 className="mm-panel-title">Actions rapides</h2>
            <div className="mt-4">
              <DashButton to="/dashboard/motors/sales/new" full>
                Créer une affaire
              </DashButton>
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={() => deleteMutation.mutate()}
        title="Supprimer ce client"
        message={`Êtes-vous sûr de vouloir supprimer ${customer.firstName} ${customer.lastName} ? Cette action est irréversible et supprimera également les affaires associées.`}
        confirmText="Supprimer"
        variant="danger"
        isLoading={deleteMutation.isPending}
      />
    </div>
  )
}

export default MotorsCustomerDetail
