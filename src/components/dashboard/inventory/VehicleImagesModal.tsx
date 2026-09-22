'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Cancel01Icon,
  Delete02Icon,
  Upload01Icon,
} from 'hugeicons-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { vehiclesApi, invalidateMotorsQueries, type ApiVehicle, type VehicleListResponse } from '@/lib/api'
import { useToast } from '@/components/ui/Toast'
import { DashButton } from '@/components/dashboard'
import type { VehiclesQueryKey } from './useInventoryPatch'

type MediaAction = '' | 'add' | 'replace'

export function VehicleImagesModal({
  vehicle,
  vehiclesQueryKey,
  onClose,
}: {
  vehicle: ApiVehicle | null
  vehiclesQueryKey: VehiclesQueryKey
  onClose: () => void
}) {
  const open = vehicle !== null
  const reduceMotion = useReducedMotion()
  const toast = useToast()
  const qc = useQueryClient()
  const titleId = useId()
  const addInputRef = useRef<HTMLInputElement>(null)
  const replaceInputRef = useRef<HTMLInputElement>(null)
  const [activeIdx, setActiveIdx] = useState(0)
  const [direction, setDirection] = useState(0)
  const [mediaAction, setMediaAction] = useState<MediaAction>('')

  const images = vehicle?.images ?? []

  useEffect(() => {
    if (open) setActiveIdx(0)
  }, [open, vehicle?.id])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') nav(-1)
      if (e.key === 'ArrowRight') nav(1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, images.length])

  const patchListCache = (updated: ApiVehicle) => {
    qc.setQueryData<VehicleListResponse>(vehiclesQueryKey, (prev) =>
      prev ? { ...prev, data: prev.data.map((v) => (v.id === updated.id ? updated : v)) } : prev
    )
    invalidateMotorsQueries(qc)
  }

  const uploadMutation = useMutation({
    mutationFn: (file: File) => vehiclesApi.uploadImage(vehicle!.id, file),
    onSuccess: (result) => {
      if (!vehicle) return
      const next = { ...vehicle, images: result.images }
      patchListCache(next)
      setActiveIdx(result.images.length - 1)
      toast('Photo ajoutée')
      setMediaAction('')
      if (addInputRef.current) addInputRef.current.value = ''
    },
    onError: (e) => toast((e as Error).message, 'error'),
  })

  const replaceMutation = useMutation({
    mutationFn: ({ index, file }: { index: number; file: File }) =>
      vehiclesApi.replaceImage(vehicle!.id, index, file),
    onSuccess: (updated) => {
      patchListCache(updated)
      toast('Photo remplacée')
      setMediaAction('')
      if (replaceInputRef.current) replaceInputRef.current.value = ''
    },
    onError: (e) => toast((e as Error).message, 'error'),
  })

  const deleteMutation = useMutation({
    mutationFn: (index: number) =>
      vehiclesApi.update(vehicle!.id, { images: vehicle!.images.filter((_, i) => i !== index) }),
    onSuccess: (updated) => {
      patchListCache(updated)
      setActiveIdx((i) => Math.max(0, Math.min(i, updated.images.length - 1)))
      toast('Photo supprimée')
    },
    onError: (e) => toast((e as Error).message, 'error'),
  })

  const busy = uploadMutation.isPending || replaceMutation.isPending || deleteMutation.isPending

  const nav = (dir: -1 | 1) => {
    if (images.length < 2) return
    setDirection(dir)
    setActiveIdx((i) => (i + dir + images.length) % images.length)
  }

  const handleMediaAction = (value: MediaAction) => {
    setMediaAction(value)
    if (value === 'add') addInputRef.current?.click()
    if (value === 'replace') replaceInputRef.current?.click()
  }

  const slideVariants = {
    enter: (d: number) => ({ x: d > 0 ? '40%' : '-40%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d < 0 ? '40%' : '-40%', opacity: 0 }),
  }

  return (
    <AnimatePresence>
      {open && vehicle && (
        <div className="mm-dialog-root" role="presentation">
          <motion.div
            className="mm-dialog-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-hidden="true"
          />
          <div className="mm-dialog-viewport">
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              className="mm-dialog mm-dialog--media"
              initial={reduceMotion ? false : { opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: 8, scale: 0.98 }}
              onClick={(e) => e.stopPropagation()}
            >
            <header className="mm-dialog-head">
              <div>
                <h2 id={titleId} className="mm-dialog-title">
                  Photos — {vehicle.make} {vehicle.model}
                </h2>
                <p className="mm-dialog-lead">
                  {images.length === 0 ? 'Aucune photo' : `${activeIdx + 1} / ${images.length}`}
                </p>
              </div>
              <button type="button" className="mm-icon-btn" onClick={onClose} aria-label="Fermer">
                <Cancel01Icon className="h-5 w-5" aria-hidden="true" />
              </button>
            </header>

            <div className="mm-media-modal-body">
              <div className="mm-media-stage">
                {images.length === 0 ? (
                  <div className="mm-media-empty">Ajoutez une photo pour ce véhicule.</div>
                ) : (
                  <>
                    <button
                      type="button"
                      className="mm-media-nav mm-media-nav--prev"
                      onClick={() => nav(-1)}
                      disabled={images.length < 2 || busy}
                      aria-label="Photo précédente"
                    >
                      <ArrowLeft01Icon className="h-5 w-5" aria-hidden="true" />
                    </button>
                    <div className="mm-media-viewport">
                      <AnimatePresence custom={direction} mode="wait">
                        <motion.img
                          key={images[activeIdx]}
                          src={images[activeIdx]}
                          alt=""
                          className="mm-media-slide"
                          custom={direction}
                          variants={slideVariants}
                          initial={reduceMotion ? false : 'enter'}
                          animate="center"
                          exit={reduceMotion ? undefined : 'exit'}
                          transition={{ duration: reduceMotion ? 0 : 0.22 }}
                        />
                      </AnimatePresence>
                    </div>
                    <button
                      type="button"
                      className="mm-media-nav mm-media-nav--next"
                      onClick={() => nav(1)}
                      disabled={images.length < 2 || busy}
                      aria-label="Photo suivante"
                    >
                      <ArrowRight01Icon className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </>
                )}
              </div>

              {images.length > 0 && (
                <div className="mm-media-thumbs" role="tablist" aria-label="Miniatures">
                  {images.map((src, i) => (
                    <button
                      key={`${src}-${i}`}
                      type="button"
                      role="tab"
                      aria-selected={i === activeIdx}
                      className={i === activeIdx ? 'mm-media-thumb is-active' : 'mm-media-thumb'}
                      onClick={() => {
                        setDirection(i > activeIdx ? 1 : -1)
                        setActiveIdx(i)
                      }}
                    >
                      <img src={src} alt="" />
                    </button>
                  ))}
                </div>
              )}

              <div className="mm-media-toolbar">
                <label className="mm-media-select-label">
                  Médias
                  <select
                    className="mm-grid-select mm-media-action-select"
                    value={mediaAction}
                    disabled={busy}
                    onChange={(e) => handleMediaAction(e.target.value as MediaAction)}
                  >
                    <option value="">Ajouter ou remplacer…</option>
                    <option value="add">Téléverser une nouvelle photo</option>
                    <option value="replace" disabled={images.length === 0}>
                      Remplacer la photo affichée
                    </option>
                  </select>
                </label>
                <input
                  ref={addInputRef}
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) uploadMutation.mutate(file)
                  }}
                />
                <input
                  ref={replaceInputRef}
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file && images.length > 0) replaceMutation.mutate({ index: activeIdx, file })
                  }}
                />
                <DashButton
                  type="button"
                  variant="soft"
                  disabled={images.length === 0 || busy}
                  onClick={() => deleteMutation.mutate(activeIdx)}
                >
                  <Delete02Icon className="h-4 w-4" aria-hidden="true" />
                  Supprimer cette photo
                </DashButton>
                <DashButton
                  type="button"
                  variant="soft"
                  disabled={busy}
                  onClick={() => addInputRef.current?.click()}
                >
                  <Upload01Icon className="h-4 w-4" aria-hidden="true" />
                  Téléverser
                </DashButton>
              </div>
            </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  )
}
