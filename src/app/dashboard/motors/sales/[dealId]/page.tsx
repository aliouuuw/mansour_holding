'use client'

import { useState } from 'react'
import { Link, useParams, useNavigate } from '@/lib/router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Delete01Icon } from 'hugeicons-react'
import { formatDate, formatPrice } from '@/lib/utils'
import { DashBreadcrumbs, DashButton } from '@/components/dashboard'
import { dealsApi, invalidateMotorsQueries, type DealStatus } from '@/lib/api'
import { useToast } from '@/components/ui/Toast'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'

const STATUS_LABELS: Record<DealStatus, string> = {
  lead: 'Prospect',
  negotiation: 'Négociation',
  'closed-won': 'Conclu',
  'closed-lost': 'Perdu',
}

const MOVE_TARGETS: { status: DealStatus; label: string }[] = [
  { status: 'lead', label: 'Prospect' },
  { status: 'negotiation', label: 'Négociation' },
  { status: 'closed-won', label: 'Conclu' },
  { status: 'closed-lost', label: 'Perdu' },
]

export function MotorsDealDetail() {
  const { dealId } = useParams({ strict: false })
  const navigate = useNavigate()
  const qc = useQueryClient()
  const toast = useToast()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const { data: deal, isLoading, error } = useQuery({
    queryKey: ['deal', dealId],
    queryFn: () => dealsApi.get(dealId!),
    enabled: !!dealId,
  })

  const statusMutation = useMutation({
    mutationFn: (status: DealStatus) => dealsApi.update(deal!.id, { status }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['deal', dealId] })
      invalidateMotorsQueries(qc)
      toast('Statut mis à jour')
    },
    onError: (e) => toast((e as Error).message, 'error'),
  })

  const deleteMutation = useMutation({
    mutationFn: () => dealsApi.delete(deal!.id),
    onSuccess: () => {
      invalidateMotorsQueries(qc)
      qc.removeQueries({ queryKey: ['deal', dealId] })
      setShowDeleteDialog(false)
      toast('Affaire supprimée')
      void navigate({ to: '/dashboard/motors/sales' })
    },
    onError: (e) => {
      toast((e as Error).message, 'error')
      setShowDeleteDialog(false)
    },
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="mm-spinner" role="status" aria-label="Chargement" />
      </div>
    )
  }

  if (error || !deal) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="mm-title">{(error as Error)?.message ?? 'Affaire non trouvée'}</p>
        <Link to="/dashboard/motors/sales" className="mm-link mt-4 inline-block">Retour aux ventes</Link>
      </div>
    )
  }

  const title = deal.vehicleName ?? 'Affaire'

  return (
    <div className="space-y-6">
      <DashBreadcrumbs
        items={[
          { label: 'Mansour Motors', to: '/dashboard/motors' },
          { label: 'Ventes', to: '/dashboard/motors/sales' },
          { label: title },
        ]}
      />

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="mm-title">{title}</h1>
          <p className="mm-lead">
            {STATUS_LABELS[deal.status]} · {formatPrice(deal.price)}
          </p>
        </div>
        <button type="button" onClick={() => setShowDeleteDialog(true)} className="mm-danger-soft">
          <Delete01Icon className="h-4 w-4" aria-hidden="true" /> Supprimer
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <div className="mm-panel mm-panel-pad">
            <h2 className="mm-panel-title">Détails</h2>
            <div className="mt-4 space-y-3">
              <div className="mm-meta-row">
                <span>Créée le</span>
                <span className="font-medium">{formatDate(deal.createdAt)}</span>
              </div>
              {deal.closedAt ? (
                <div className="mm-meta-row">
                  <span>Clôturée le</span>
                  <span className="font-medium">{formatDate(deal.closedAt)}</span>
                </div>
              ) : null}
              {deal.testDriveDate ? (
                <div className="mm-meta-row">
                  <span>Essai</span>
                  <span className="font-medium">{formatDate(deal.testDriveDate)}</span>
                </div>
              ) : null}
            </div>
          </div>

          {deal.notes ? (
            <div className="mm-panel mm-panel-pad">
              <h2 className="mm-panel-title">Notes</h2>
              <p className="mt-3 text-sm leading-relaxed mm-muted">{deal.notes}</p>
            </div>
          ) : null}
        </div>

        <div className="space-y-4">
          <div className="mm-panel mm-panel-pad">
            <h2 className="mm-panel-title">Véhicule</h2>
            <p className="mt-2 text-sm font-medium">{deal.vehicleName ?? '—'}</p>
            <DashButton
              to="/dashboard/motors/inventory/$vehicleId"
              params={{ vehicleId: deal.vehicleId }}
              variant="soft"
              className="mt-4 w-full"
            >
              Voir le véhicule
            </DashButton>
          </div>

          <div className="mm-panel mm-panel-pad">
            <h2 className="mm-panel-title">Client</h2>
            <p className="mt-2 text-sm font-medium">{deal.customerName ?? '—'}</p>
            {deal.customerPhone ? <p className="text-sm mm-muted">{deal.customerPhone}</p> : null}
            <DashButton
              to="/dashboard/motors/customers/$customerId"
              params={{ customerId: deal.customerId }}
              variant="soft"
              className="mt-4 w-full"
            >
              Voir le client
            </DashButton>
          </div>

          <div className="mm-panel mm-panel-pad">
            <h2 className="mm-panel-title">Statut</h2>
            <p className="mt-1 text-sm mm-muted">Déplacer vers</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {MOVE_TARGETS.filter((t) => t.status !== deal.status).map(({ status, label }) => (
                <button
                  key={status}
                  type="button"
                  disabled={statusMutation.isPending}
                  onClick={() => statusMutation.mutate(status)}
                  className="mm-chip"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={() => deleteMutation.mutate()}
        title="Supprimer cette affaire"
        message={`Supprimer l'affaire pour ${deal.vehicleName ?? 'ce véhicule'} ? Cette action est irréversible.`}
        confirmText="Supprimer"
        variant="danger"
        isLoading={deleteMutation.isPending}
      />
    </div>
  )
}

export default MotorsDealDetail
