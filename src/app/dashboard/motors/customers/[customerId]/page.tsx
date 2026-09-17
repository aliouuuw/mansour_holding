'use client'

import { useState } from 'react'
import { Link, useParams, useNavigate } from '@/lib/router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import {
  ArrowLeft01Icon, Mail01Icon, SmartPhone01Icon, Location01Icon,
  Loading03Icon, Edit01Icon, Delete01Icon, Cancel01Icon,
} from 'hugeicons-react'
import { formatDate, cn } from '@/lib/utils'
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

const inputClass = 'w-full border border-noir-200 bg-white px-3 py-2.5 text-sm text-noir-900 outline-none transition-all focus:border-gold-400 focus:ring-1 focus:ring-gold-400/20'
const labelClass = 'block text-xs font-semibold uppercase tracking-wider text-noir-500 mb-1.5'

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
        <Loading03Icon className="h-8 w-8 animate-spin text-gold-400" />
      </div>
    )
  }

  if (error || !customer) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-lg font-medium text-noir-950">{(error as Error)?.message ?? 'Client non trouvé'}</p>
        <Link to="/dashboard/motors/customers" className="mt-4 text-sm font-medium text-gold-600 hover:text-gold-700">
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
          <button onClick={() => setEditing(false)} className="rounded-sm p-2 text-noir-600 hover:bg-surface-dim transition-colors">
            <Cancel01Icon className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-noir-950">Modifier le client</h1>
            <p className="mt-0.5 text-sm text-noir-500">{customer.firstName} {customer.lastName}</p>
          </div>
        </div>

        <div className="border border-noir-200 bg-white p-6 shadow-sm">
          {updateMutation.error && (
            <div className="mb-4 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {(updateMutation.error as Error).message}
            </div>
          )}
          <form onSubmit={handleSubmit((v) => updateMutation.mutate(v))} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Prénom</label>
                <input {...register('firstName', { required: 'Requis' })} className={inputClass} />
                {errors.firstName && <p className="mt-1 text-xs text-red-600">{errors.firstName.message}</p>}
              </div>
              <div>
                <label className={labelClass}>Nom</label>
                <input {...register('lastName', { required: 'Requis' })} className={inputClass} />
                {errors.lastName && <p className="mt-1 text-xs text-red-600">{errors.lastName.message}</p>}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Email</label>
                <input type="email" {...register('email', { required: 'Requis' })} className={inputClass} />
                {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
              </div>
              <div>
                <label className={labelClass}>Téléphone</label>
                <input {...register('phone', { required: 'Requis' })} className={inputClass} />
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
              <input {...register('address')} className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Notes (optionnel)</label>
              <textarea {...register('notes')} rows={3} className={cn(inputClass, 'resize-none')} />
            </div>

            <div className="flex gap-3">
              <button type="submit" disabled={updateMutation.isPending}
                className="flex-1 bg-noir-950 px-4 py-3 text-sm font-semibold text-white hover:bg-noir-800 disabled:opacity-50 transition-colors">
                {updateMutation.isPending ? 'Enregistrement...' : 'Enregistrer'}
              </button>
              <button type="button" onClick={() => setEditing(false)}
                className="px-4 py-3 text-sm font-medium text-noir-600 border border-noir-200 hover:bg-surface-dim transition-colors">
                Annuler
              </button>
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
        <div className="flex items-center gap-2">
          <button onClick={startEditing}
            className="inline-flex items-center gap-2 border border-noir-200 px-3 py-2 text-sm font-medium text-noir-900 hover:bg-surface-dim transition-colors">
            <Edit01Icon className="h-4 w-4" /> Modifier
          </button>
          <button onClick={() => setShowDeleteDialog(true)}
            className="inline-flex items-center gap-2 border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
            <Delete01Icon className="h-4 w-4" /> Supprimer
          </button>
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
            <h2 className="font-semibold text-noir-950">Actions rapides</h2>
            <div className="mt-4 space-y-2">
              <Link to="/dashboard/motors/sales/new"
                className="block w-full bg-noir-950 px-4 py-2.5 text-center text-sm font-medium text-white hover:bg-noir-800 transition-colors">
                Créer une affaire
              </Link>
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
