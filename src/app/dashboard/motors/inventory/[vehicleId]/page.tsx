'use client'

import { useState, useRef } from 'react'
import { Link, useParams, useNavigate } from '@/lib/router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  ArrowLeft01Icon, ArrowRight01Icon,
  Fuel01Icon, DashboardSpeed01Icon, Calendar01Icon,
  PaintBoardIcon, Settings02Icon, HashtagIcon,
  Edit01Icon, Delete01Icon,
  Upload01Icon, Cancel01Icon, Delete02Icon,
} from 'hugeicons-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn, formatDate, formatPrice, formatNumber } from '@/lib/utils'
import { vehiclesApi, invalidateMotorsQueries } from '@/lib/api'
import { VehicleForm, arrivedAtFromForm, arrivedAtToForm, featureEntries, formExtras, toExtras, type VehicleFormValues } from '@/components/motors/VehicleForm'
import { useToast } from '@/components/ui/Toast'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { DashBreadcrumbs, DashButton, DashStatus } from '@/components/dashboard'
const fuelLabels: Record<string, string> = { gasoline: 'Essence', diesel: 'Diesel', hybrid: 'Hybride', electric: 'Électrique' }
const transLabels: Record<string, string> = { manual: 'Manuelle', automatic: 'Automatique', cvt: 'CVT' }

export function MotorsVehicleDetail() {
  const { vehicleId } = useParams({ strict: false })
  const navigate = useNavigate()
  const qc = useQueryClient()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const toast = useToast()

  const [activeIdx, setActiveIdx] = useState(0)
  const [direction, setDirection] = useState(0)
  const [editing, setEditing] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const { data: vehicle, isLoading, error } = useQuery({
    queryKey: ['vehicle', vehicleId],
    queryFn: () => vehiclesApi.get(vehicleId!),
    enabled: !!vehicleId,
  })

  const updateMutation = useMutation({
    mutationFn: (values: VehicleFormValues) => vehiclesApi.update(vehicle!.id, {
      ...values,
      vin: values.vin || null,
      description: values.description || null,
      extras: toExtras(values, vehicle?.extras ?? {}),
      arrivedAt: arrivedAtFromForm(values.arrivedAt),
    }),
    onSuccess: (updated) => {
      qc.setQueryData(['vehicle', vehicleId], updated)
      invalidateMotorsQueries(qc)
      qc.invalidateQueries({ queryKey: ['public-vehicle', vehicleId] })
      setEditing(false)
      toast('Véhicule mis à jour')
    },
    onError: (e) => toast((e as Error).message, 'error'),
  })

  const deleteMutation = useMutation({
    mutationFn: () => vehiclesApi.delete(vehicle!.id),
    onSuccess: async () => {
      invalidateMotorsQueries(qc)
      qc.removeQueries({ queryKey: ['vehicle', vehicleId] })
      qc.removeQueries({ queryKey: ['public-vehicle', vehicleId] })
      setShowDeleteDialog(false)
      toast('Véhicule supprimé')
      void navigate({ to: '/dashboard/motors/inventory' })
    },
    onError: (e) => {
      toast((e as Error).message, 'error')
      setShowDeleteDialog(false)
    },
  })

  const uploadMutation = useMutation({
    mutationFn: (file: File) => vehiclesApi.uploadImage(vehicle!.id, file),
    onSuccess: (result) => {
      qc.setQueryData(['vehicle', vehicleId], (old: typeof vehicle) => old ? { ...old, images: result.images } : old)
      invalidateMotorsQueries(qc)
      setActiveIdx(result.images.length - 1)
      toast('Photo ajoutée')
      if (fileInputRef.current) fileInputRef.current.value = ''
    },
    onError: (e) => toast((e as Error).message, 'error'),
  })

  const removeImageMutation = useMutation({
    mutationFn: (idx: number) => vehiclesApi.update(vehicle!.id, { images: vehicle!.images.filter((_, i) => i !== idx) }),
    onSuccess: (updated) => {
      qc.setQueryData(['vehicle', vehicleId], updated)
      invalidateMotorsQueries(qc)
      setActiveIdx(i => Math.min(i, updated.images.length - 1))
      toast('Photo supprimée')
    },
    onError: (e) => toast((e as Error).message, 'error'),
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="mm-spinner" role="status" aria-label="Chargement" />
      </div>
    )
  }

  if (error || !vehicle) return (
    <div className="flex flex-col items-center justify-center py-20">
      <p className="mm-title">{(error as Error)?.message ?? 'Véhicule non trouvé'}</p>
      <Link to="/dashboard/motors/inventory" className="mm-link mt-4 inline-block">Retour à l&apos;inventaire</Link>
    </div>
  )

  const images = vehicle.images ?? []
  const extras = vehicle.extras ?? {}

  // ── Edit mode ──
  if (editing) {
    const defaultValues: Partial<VehicleFormValues> = {
      make: vehicle.make, model: vehicle.model, year: vehicle.year,
      mileage: vehicle.mileage, price: vehicle.price ?? undefined, status: vehicle.status,
      fuelType: vehicle.fuelType, transmission: vehicle.transmission,
      color: vehicle.color, vin: vehicle.vin ?? '', description: vehicle.description ?? '',
      arrivedAt: arrivedAtToForm(vehicle.arrivedAt),
      ...formExtras(extras),
    }
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <DashBreadcrumbs
          items={[
            { label: 'Mansour Motors', to: '/dashboard/motors' },
            { label: 'Inventaire', to: '/dashboard/motors/inventory' },
            { label: `${vehicle.make} ${vehicle.model}`, to: `/dashboard/motors/inventory/${vehicle.id}` },
            { label: 'Modifier' },
          ]}
        />
        <div className="flex items-center gap-4">
          <button type="button" onClick={() => setEditing(false)} className="mm-icon-btn" aria-label="Annuler">
            <Cancel01Icon className="h-5 w-5" aria-hidden="true" />
          </button>
          <div>
            <h1 className="mm-title">Modifier le véhicule</h1>
            <p className="mm-lead">{vehicle.make} {vehicle.model}</p>
          </div>
        </div>
        <div className="mm-panel mm-panel-pad">
          {updateMutation.error && <div className="mm-alert-error mb-4">{(updateMutation.error as Error).message}</div>}
          <VehicleForm defaultValues={defaultValues} onSubmit={async (v) => { await updateMutation.mutateAsync(v) }} submitLabel="Enregistrer les modifications" loading={updateMutation.isPending} />
        </div>
      </div>
    )
  }

  // ── View mode ──
  const slideVariants = {
    enter: (d: number) => ({ x: d > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d < 0 ? '100%' : '-100%', opacity: 0 }),
  }

  const navImage = (dir: 1 | -1) => {
    setDirection(dir)
    setActiveIdx(i => (i + dir + images.length) % images.length)
  }

  return (
    <div className="space-y-6">
      <DashBreadcrumbs
        items={[
          { label: 'Mansour Motors', to: '/dashboard/motors' },
          { label: 'Inventaire', to: '/dashboard/motors/inventory' },
          { label: `${vehicle.make} ${vehicle.model}` },
        ]}
      />
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex-1 min-w-0">
          <h1 className="mm-title">{vehicle.make} {vehicle.model}</h1>
          <p className="mm-lead">{vehicle.year}{vehicle.vin ? ` · ${vehicle.vin}` : ''}</p>
        </div>
        <DashStatus status={vehicle.status} />
        <DashButton type="button" variant="soft" onClick={() => setEditing(true)}>
          <Edit01Icon className="h-4 w-4" aria-hidden="true" /> Modifier
        </DashButton>
        <button type="button" onClick={() => setShowDeleteDialog(true)}
          disabled={deleteMutation.isPending}
          className="mm-danger-soft disabled:opacity-50">
          <Delete01Icon className="h-4 w-4" aria-hidden="true" /> Supprimer
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3 space-y-3">
          <div className="mm-media-frame">
            {images.length > 0 ? (
              <>
                <AnimatePresence initial={false} custom={direction} mode="popLayout">
                  <motion.img key={activeIdx} custom={direction} variants={slideVariants}
                    initial="enter" animate="center" exit="exit"
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    src={images[activeIdx]} alt={`${vehicle.make} ${vehicle.model}`}
                    className="absolute inset-0 h-full w-full object-cover"
                    loading="lazy" decoding="async"
                  />
                </AnimatePresence>
                {images.length > 1 && (
                  <>
                    <button type="button" onClick={() => navImage(-1)} className="mm-icon-btn absolute left-3 top-1/2 z-10 -translate-y-1/2 bg-[var(--mm-black)]/60 text-white hover:bg-[var(--mm-black)]/90" aria-label="Photo précédente">
                      <ArrowLeft01Icon className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <button type="button" onClick={() => navImage(1)} className="mm-icon-btn absolute right-3 top-1/2 z-10 -translate-y-1/2 bg-[var(--mm-black)]/60 text-white hover:bg-[var(--mm-black)]/90" aria-label="Photo suivante">
                      <ArrowRight01Icon className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <div className="absolute bottom-3 right-3 rounded-[var(--mm-r)] bg-[var(--mm-black)]/60 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">{activeIdx + 1} / {images.length}</div>
                    <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
                      {images.map((_, i) => (
                        <button key={i} type="button" onClick={() => { setDirection(i > activeIdx ? 1 : -1); setActiveIdx(i) }}
                          className={cn('mm-media-dot w-1.5', i === activeIdx && 'is-active')} aria-label={`Photo ${i + 1}`} />
                      ))}
                    </div>
                  </>
                )}
                <button onClick={() => removeImageMutation.mutate(activeIdx)}
                  className="absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center bg-red-600/80 text-white backdrop-blur-sm hover:bg-red-600 transition-colors">
                  <Delete02Icon className="h-3.5 w-3.5" />
                </button>
              </>
            ) : (
              <div className="flex h-full items-center justify-center text-sm mm-muted">Aucune photo</div>
            )}
          </div>

          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {images.map((src, i) => (
                <button key={i} type="button" onClick={() => { setDirection(i > activeIdx ? 1 : -1); setActiveIdx(i) }}
                  className={cn('mm-thumb', i === activeIdx && 'is-active')}>
                  <img src={src} alt="" className="h-full w-full object-cover" loading="lazy" decoding="async" />
                </button>
              ))}
            </div>
          )}

          <div>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadMutation.mutate(f) }} />
            <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploadMutation.isPending}
              className="mm-soft flex w-full items-center justify-center gap-2 border border-dashed disabled:opacity-50">
              <Upload01Icon className="h-4 w-4" />
              {uploadMutation.isPending ? 'Upload en cours...' : 'Ajouter une photo'}
            </button>
          </div>

          {vehicle.description && (
            <div className="mm-panel mm-panel-pad">
              <h2 className="mm-section-label mb-2">Description</h2>
              <p className="text-sm leading-relaxed mm-muted">{vehicle.description}</p>
            </div>
          )}
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="mm-panel mm-panel-pad">
            <p className="mm-section-label mb-1">Prix</p>
            <p className="text-3xl font-semibold tracking-tight">{formatPrice(vehicle.price)}</p>
          </div>

          <div className="mm-panel mm-panel-pad">
            <h2 className="mm-section-label mb-4">Caractéristiques</h2>
            <div className="space-y-3">
              {[
                { label: 'Arrivée showroom', value: formatDate(vehicle.arrivedAt), icon: Calendar01Icon },
                { label: 'Année', value: vehicle.year.toString(), icon: Calendar01Icon },
                { label: 'Kilométrage', value: `${formatNumber(vehicle.mileage)} km`, icon: DashboardSpeed01Icon },
                { label: 'Carburant', value: fuelLabels[vehicle.fuelType] ?? vehicle.fuelType, icon: Fuel01Icon },
                { label: 'Transmission', value: transLabels[vehicle.transmission] ?? vehicle.transmission, icon: Settings02Icon },
                { label: 'Couleur', value: vehicle.color, icon: PaintBoardIcon },
                ...(vehicle.vin ? [{ label: 'VIN', value: vehicle.vin, icon: HashtagIcon }] : []),
              ].map((spec) => (
                <div key={spec.label} className="mm-meta-row">
                  <div className="flex items-center gap-2.5">
                    <div className="rounded-[var(--mm-r)] bg-[var(--mm-off)] p-1.5"><spec.icon className="h-3.5 w-3.5 text-[var(--mm-grey-muted)]" aria-hidden="true" /></div>
                    <span>{spec.label}</span>
                  </div>
                  <span className="font-medium">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>

          {featureEntries(extras).length > 0 && (
            <div className="mm-panel mm-panel-pad">
              <h2 className="mm-section-label mb-4">Équipements</h2>
              <div className="space-y-2">
                {featureEntries(extras).map(([key, value]) => (
                  <div key={key} className="mm-meta-row">
                    <span>{key}</span>
                    <span className="font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mm-panel mm-panel-pad">
            <h2 className="mm-panel-title">Actions rapides</h2>
            <div className="mt-4 space-y-2">
              <DashButton to="/dashboard/motors/sales/new" full>Créer une affaire</DashButton>
              <DashButton type="button" variant="soft" full disabled>Programmer un essai</DashButton>
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={() => deleteMutation.mutate()}
        title="Supprimer ce véhicule"
        message={`Êtes-vous sûr de vouloir supprimer ${vehicle?.make} ${vehicle?.model} ? Cette action est irréversible.`}
        confirmText="Supprimer"
        cancelText="Annuler"
        variant="danger"
        isLoading={deleteMutation.isPending}
      />
    </div>
  )
}

export default MotorsVehicleDetail
