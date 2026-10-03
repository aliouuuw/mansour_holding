'use client'

import { useEffect, useId, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowDown01Icon, ArrowUp01Icon, Cancel01Icon, DragDropVerticalIcon } from 'hugeicons-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { vehiclesApi, invalidateMotorsQueries, type ApiVehicle } from '@/lib/api'
import { useToast } from '@/components/ui/Toast'
import { DashButton, dashVehicleStatusLabels } from '@/components/dashboard'

function moveItem(list: ApiVehicle[], index: number, dir: -1 | 1) {
  const next = index + dir
  if (next < 0 || next >= list.length) return list
  const copy = list.slice()
  const current = copy[index]
  const target = copy[next]
  if (!current || !target) return list
  copy[index] = target
  copy[next] = current
  return copy
}

export function VehicleOrderDialog({
  open,
  onClose,
  onSaved,
}: {
  open: boolean
  onClose: () => void
  onSaved?: () => void
}) {
  const reduceMotion = useReducedMotion()
  const toast = useToast()
  const qc = useQueryClient()
  const titleId = useId()
  const [items, setItems] = useState<ApiVehicle[] | null>(null)
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [seeded, setSeeded] = useState(false)

  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: ['vehicles', 'order'],
    queryFn: () => vehiclesApi.list({ limit: 500, sortBy: 'sortOrder', sortDir: 'asc' }),
    enabled: open,
    refetchOnWindowFocus: false,
  })

  useEffect(() => {
    if (!open) {
      setItems(null)
      setDragIndex(null)
      setSeeded(false)
      return
    }
    if (!data || isFetching || seeded) return
    setItems(data.data)
    setSeeded(true)
  }, [open, data, isFetching, seeded])

  const dirty =
    !!data &&
    !!items &&
    (items.length !== data.data.length || items.some((vehicle, index) => vehicle.id !== data.data[index]?.id))

  const saveMutation = useMutation({
    mutationFn: (orderedIds: string[]) => vehiclesApi.reorder(orderedIds),
    onSuccess: () => {
      invalidateMotorsQueries(qc)
      onSaved?.()
      toast('Ordre enregistré')
      onClose()
    },
    onError: (e) => toast((e as Error).message, 'error'),
  })

  const dropOn = (index: number) => {
    if (dragIndex === null || dragIndex === index) return
    setItems((prev) => {
      if (!prev) return prev
      const copy = prev.slice()
      const [moved] = copy.splice(dragIndex, 1)
      if (!moved) return prev
      copy.splice(index, 0, moved)
      return copy
    })
    setDragIndex(index)
  }

  return (
    <AnimatePresence>
      {open && (
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
              className="mm-dialog mm-dialog--order"
              initial={reduceMotion ? false : { opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: 8, scale: 0.98 }}
              onClick={(e) => e.stopPropagation()}
            >
              <header className="mm-dialog-head">
                <div>
                  <h2 id={titleId} className="mm-dialog-title">Ordre sur la page Véhicules</h2>
                  <p className="mm-dialog-lead">
                    Le premier de la liste apparaît en premier. Un véhicule neuf se place en tête.
                  </p>
                </div>
                <button type="button" className="mm-icon-btn" onClick={onClose} aria-label="Fermer">
                  <Cancel01Icon className="h-5 w-5" aria-hidden="true" />
                </button>
              </header>

              {error ? (
                <p className="mm-order-status">{(error as Error).message}</p>
              ) : isLoading || !items ? (
                <div className="mm-order-status">
                  <div className="mm-spinner mx-auto" role="status" aria-label="Chargement" />
                </div>
              ) : items.length === 0 ? (
                <p className="mm-order-status">Aucun véhicule en stock.</p>
              ) : (
                <ol className="mm-order-list">
                  {items.map((vehicle, index) => (
                    <li
                      key={vehicle.id}
                      className={dragIndex === index ? 'mm-order-row is-drag' : 'mm-order-row'}
                      draggable
                      onDragStart={() => setDragIndex(index)}
                      onDragOver={(e) => {
                        e.preventDefault()
                        dropOn(index)
                      }}
                      onDragEnd={() => setDragIndex(null)}
                    >
                      <span className="mm-order-handle" aria-hidden="true">
                        <DragDropVerticalIcon className="h-4 w-4" />
                      </span>
                      <span className="mm-order-pos">{index + 1}</span>
                      <span className="mm-order-name">
                        {vehicle.make} {vehicle.model}
                        <span className="mm-order-meta">
                          {vehicle.year} · {dashVehicleStatusLabels[vehicle.status]}
                        </span>
                      </span>
                      <span className="mm-order-actions">
                        <button
                          type="button"
                          className="mm-icon-btn"
                          aria-label={`Monter ${vehicle.make} ${vehicle.model}`}
                          disabled={index === 0 || saveMutation.isPending}
                          onClick={() => setItems((prev) => (prev ? moveItem(prev, index, -1) : prev))}
                        >
                          <ArrowUp01Icon className="h-4 w-4" aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          className="mm-icon-btn"
                          aria-label={`Descendre ${vehicle.make} ${vehicle.model}`}
                          disabled={index === items.length - 1 || saveMutation.isPending}
                          onClick={() => setItems((prev) => (prev ? moveItem(prev, index, 1) : prev))}
                        >
                          <ArrowDown01Icon className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </span>
                    </li>
                  ))}
                </ol>
              )}

              <footer className="mm-order-foot">
                <DashButton type="button" variant="soft" onClick={onClose}>
                  Annuler
                </DashButton>
                <DashButton
                  type="button"
                  disabled={!dirty || !items || saveMutation.isPending}
                  onClick={() => items && saveMutation.mutate(items.map((vehicle) => vehicle.id))}
                >
                  {saveMutation.isPending ? 'Enregistrement…' : 'Enregistrer l’ordre'}
                </DashButton>
              </footer>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  )
}
