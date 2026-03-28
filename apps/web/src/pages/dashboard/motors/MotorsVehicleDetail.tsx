import { useState, useEffect, useRef } from 'react'
import { Link, useParams, useNavigate } from '@tanstack/react-router'
import {
  ArrowLeft01Icon, ArrowRight01Icon,
  Fuel01Icon, DashboardSpeed01Icon, Calendar01Icon,
  PaintBoardIcon, Settings02Icon, HashtagIcon,
  Loading03Icon, Edit01Icon, Delete01Icon,
  Upload01Icon, Cancel01Icon, Delete02Icon,
} from 'hugeicons-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn, formatPrice, formatNumber } from '@/lib/utils'
import { vehiclesApi, type ApiVehicle, type VehicleStatus } from '@/lib/api'
import { VehicleForm, type VehicleFormValues } from '@/components/motors/VehicleForm'
import { useToast } from '@/components/ui/Toast'

const statusLabels: Record<VehicleStatus, string> = {
  available: 'Disponible', reserved: 'Réservé', sold: 'Vendu',
}
const statusColors: Record<VehicleStatus, string> = {
  available: 'bg-emerald-100 text-emerald-800',
  reserved: 'bg-amber-100 text-amber-800',
  sold: 'bg-slate-100 text-slate-600',
}
const fuelLabels: Record<string, string> = {
  gasoline: 'Essence', diesel: 'Diesel', hybrid: 'Hybride', electric: 'Électrique',
}
const transLabels: Record<string, string> = {
  manual: 'Manuelle', automatic: 'Automatique', cvt: 'CVT',
}

export function MotorsVehicleDetail() {
  const { vehicleId } = useParams({ strict: false })
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const toast = useToast()

  const [vehicle, setVehicle] = useState<ApiVehicle | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeIdx, setActiveIdx] = useState(0)
  const [direction, setDirection] = useState(0)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)

  useEffect(() => {
    if (!vehicleId) return
    setLoading(true)
    vehiclesApi.get(vehicleId)
      .then((v) => { setVehicle(v); setActiveIdx(0) })
      .catch((e) => setError(e instanceof Error ? e.message : 'Erreur de chargement'))
      .finally(() => setLoading(false))
  }, [vehicleId])

  const navigate_image = (dir: 1 | -1) => {
    if (!vehicle) return
    setDirection(dir)
    setActiveIdx((i) => (i + dir + vehicle.images.length) % vehicle.images.length)
  }

  const handleEdit = async (values: VehicleFormValues) => {
    if (!vehicle) return
    setSaving(true)
    setActionError(null)
    try {
      const updated = await vehiclesApi.update(vehicle.id, {
        ...values,
        vin: values.vin || null,
        description: values.description || null,
        extras: Object.fromEntries(values.extras.map(({ key, value }) => [key, value])),
      })
      setVehicle(updated)
      setEditing(false)
      toast('Véhicule mis à jour')
    } catch (e) {
      setActionError(e instanceof Error ? e.message : 'Erreur lors de la sauvegarde')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!vehicle || !confirm(`Supprimer ${vehicle.make} ${vehicle.model} ? Cette action est irréversible.`)) return
    setDeleting(true)
    try {
      await vehiclesApi.delete(vehicle.id)
      void navigate({ to: '/dashboard/motors/inventory' })
    } catch (e) {
      setActionError(e instanceof Error ? e.message : 'Erreur lors de la suppression')
      setDeleting(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !vehicle) return
    setUploading(true)
    setActionError(null)
    try {
      const result = await vehiclesApi.uploadImage(vehicle.id, file)
      setVehicle((v) => v ? { ...v, images: result.images } : v)
      setActiveIdx(result.images.length - 1)
      toast('Photo ajoutée')
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "Erreur lors de l'upload")
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleRemoveImage = async (idx: number) => {
    if (!vehicle) return
    const updated = vehicle.images.filter((_, i) => i !== idx)
    try {
      const result = await vehiclesApi.update(vehicle.id, { images: updated })
      setVehicle(result)
      setActiveIdx(Math.min(activeIdx, updated.length - 1))
    } catch (e) {
      setActionError(e instanceof Error ? e.message : 'Erreur lors de la suppression')
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <Loading03Icon className="h-8 w-8 animate-spin text-gold-400" />
    </div>
  )

  if (error || !vehicle) return (
    <div className="flex flex-col items-center justify-center py-20">
      <p className="text-lg font-medium text-noir-950">{error ?? 'Véhicule non trouvé'}</p>
      <Link to="/dashboard/motors/inventory" className="mt-4 text-sm font-medium text-gold-600 hover:text-gold-700">
        Retour à l'inventaire
      </Link>
    </div>
  )

  const images = vehicle.images ?? []
  const extras = vehicle.extras ?? {}

  // ---- Edit mode ----
  if (editing) {
    const defaultValues: Partial<VehicleFormValues> = {
      make: vehicle.make, model: vehicle.model, year: vehicle.year,
      mileage: vehicle.mileage, price: vehicle.price, status: vehicle.status,
      fuelType: vehicle.fuelType, transmission: vehicle.transmission,
      color: vehicle.color, vin: vehicle.vin ?? '', description: vehicle.description ?? '',
      extras: Object.entries(extras).map(([key, value]) => ({ key, value })),
    }
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="flex items-center gap-4">
          <button onClick={() => setEditing(false)} className="rounded-sm p-2 text-noir-600 hover:bg-surface-dim transition-colors">
            <Cancel01Icon className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-noir-950">Modifier le véhicule</h1>
            <p className="mt-0.5 text-sm text-noir-500">{vehicle.make} {vehicle.model}</p>
          </div>
        </div>
        <div className="border border-noir-200 bg-white p-6 shadow-sm">
          {actionError && <div className="mb-4 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{actionError}</div>}
          <VehicleForm defaultValues={defaultValues} onSubmit={handleEdit} submitLabel="Enregistrer les modifications" loading={saving} />
        </div>
      </div>
    )
  }

  // ---- View mode ----
  const slideVariants = {
    enter: (d: number) => ({ x: d > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d < 0 ? '100%' : '-100%', opacity: 0 }),
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 flex-wrap">
        <Link to="/dashboard/motors/inventory" className="rounded-sm p-2 text-noir-600 hover:bg-surface-dim transition-colors">
          <ArrowLeft01Icon className="h-5 w-5" />
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-noir-950">{vehicle.make} {vehicle.model}</h1>
          <p className="mt-0.5 text-sm text-noir-500">{vehicle.year}{vehicle.vin ? ` · ${vehicle.vin}` : ''}</p>
        </div>
        <span className={cn('px-3 py-1 text-xs font-medium uppercase tracking-wider', statusColors[vehicle.status])}>
          {statusLabels[vehicle.status]}
        </span>
        <button
          onClick={() => { setEditing(true); setActionError(null) }}
          className="inline-flex items-center gap-2 border border-noir-200 px-3 py-2 text-sm font-medium text-noir-700 hover:bg-surface-dim transition-colors"
        >
          <Edit01Icon className="h-4 w-4" />
          Modifier
        </button>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="inline-flex items-center gap-2 border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50 transition-colors"
        >
          <Delete01Icon className="h-4 w-4" />
          {deleting ? '...' : 'Supprimer'}
        </button>
      </div>

      {actionError && (
        <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{actionError}</div>
      )}

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Left: Images */}
        <div className="lg:col-span-3 space-y-3">

          {/* Main image with slider */}
          <div className="relative overflow-hidden border border-noir-200 bg-noir-100 aspect-[16/10]">
            {images.length > 0 ? (
              <>
                <AnimatePresence initial={false} custom={direction} mode="popLayout">
                  <motion.img
                    key={activeIdx}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    src={images[activeIdx]}
                    alt={`${vehicle.make} ${vehicle.model} — photo ${activeIdx + 1}`}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </AnimatePresence>

                {/* Nav arrows — only when >1 image */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => navigate_image(-1)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 z-10 flex h-9 w-9 items-center justify-center bg-noir-950/60 text-white backdrop-blur-sm hover:bg-noir-950/90 transition-colors"
                    >
                      <ArrowLeft01Icon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => navigate_image(1)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 z-10 flex h-9 w-9 items-center justify-center bg-noir-950/60 text-white backdrop-blur-sm hover:bg-noir-950/90 transition-colors"
                    >
                      <ArrowRight01Icon className="h-4 w-4" />
                    </button>
                    {/* Counter */}
                    <div className="absolute bottom-3 right-3 bg-noir-950/60 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
                      {activeIdx + 1} / {images.length}
                    </div>
                    {/* Dot indicators */}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                      {images.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => { setDirection(i > activeIdx ? 1 : -1); setActiveIdx(i) }}
                          className={cn('h-1.5 transition-all duration-300', i === activeIdx ? 'w-6 bg-gold-400' : 'w-1.5 bg-white/60 hover:bg-white')}
                        />
                      ))}
                    </div>
                  </>
                )}

                {/* Remove current image */}
                <button
                  onClick={() => handleRemoveImage(activeIdx)}
                  className="absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center bg-red-600/80 text-white backdrop-blur-sm hover:bg-red-600 transition-colors"
                  title="Supprimer cette photo"
                >
                  <Delete02Icon className="h-3.5 w-3.5" />
                </button>
              </>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-noir-400">
                Aucune photo
              </div>
            )}
          </div>

          {/* Thumbnail strip */}
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {images.map((src, i) => (
                <button
                  key={i}
                  onClick={() => { setDirection(i > activeIdx ? 1 : -1); setActiveIdx(i) }}
                  className={cn(
                    'h-16 w-24 flex-shrink-0 overflow-hidden border-2 transition-all',
                    i === activeIdx ? 'border-gold-400 opacity-100' : 'border-transparent opacity-60 hover:opacity-100'
                  )}
                >
                  <img src={src} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Upload button */}
          <div>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center gap-2 border border-dashed border-noir-300 px-4 py-2.5 text-sm font-medium text-noir-500 hover:border-gold-400 hover:text-gold-600 disabled:opacity-50 transition-colors w-full justify-center"
            >
              <Upload01Icon className="h-4 w-4" />
              {uploading ? 'Upload en cours...' : 'Ajouter une photo'}
            </button>
          </div>

          {vehicle.description && (
            <div className="border border-noir-200 bg-white p-5 shadow-sm">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-noir-500 mb-2">Description</h2>
              <p className="text-sm leading-relaxed text-noir-600">{vehicle.description}</p>
            </div>
          )}
        </div>

        {/* Right: Details */}
        <div className="lg:col-span-2 space-y-4">
          {/* Price */}
          <div className="border border-noir-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-noir-500 mb-1">Prix</p>
            <p className="text-3xl font-bold text-noir-950">{formatPrice(vehicle.price)}</p>
          </div>

          {/* Core specs */}
          <div className="border border-noir-200 bg-white p-5 shadow-sm">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-noir-500 mb-4">Caractéristiques</h2>
            <div className="space-y-3">
              {[
                { label: 'Année', value: vehicle.year.toString(), icon: Calendar01Icon },
                { label: 'Kilométrage', value: `${formatNumber(vehicle.mileage)} km`, icon: DashboardSpeed01Icon },
                { label: 'Carburant', value: fuelLabels[vehicle.fuelType] ?? vehicle.fuelType, icon: Fuel01Icon },
                { label: 'Transmission', value: transLabels[vehicle.transmission] ?? vehicle.transmission, icon: Settings02Icon },
                { label: 'Couleur', value: vehicle.color, icon: PaintBoardIcon },
                ...(vehicle.vin ? [{ label: 'VIN', value: vehicle.vin, icon: HashtagIcon }] : []),
              ].map((spec) => (
                <div key={spec.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="bg-surface-dim p-1.5">
                      <spec.icon className="h-3.5 w-3.5 text-noir-500" />
                    </div>
                    <span className="text-sm text-noir-500">{spec.label}</span>
                  </div>
                  <span className="text-sm font-medium text-noir-900">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Extras */}
          {Object.keys(extras).length > 0 && (
            <div className="border border-noir-200 bg-white p-5 shadow-sm">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-noir-500 mb-4">Équipements</h2>
              <div className="space-y-2">
                {Object.entries(extras).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-sm text-noir-500">{key}</span>
                    <span className="text-sm font-medium text-noir-900">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="border border-noir-200 bg-white p-5 shadow-sm">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-noir-500 mb-4">Actions rapides</h2>
            <div className="space-y-2">
              <button className="w-full bg-noir-950 px-4 py-2.5 text-sm font-medium text-white hover:bg-noir-800 transition-colors">
                Créer une affaire
              </button>
              <button className="w-full border border-noir-200 px-4 py-2.5 text-sm font-medium text-noir-900 hover:bg-surface-dim transition-colors">
                Programmer un essai
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
