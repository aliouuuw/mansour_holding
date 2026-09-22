'use client'

import { useEffect, useId, useRef } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Cancel01Icon } from 'hugeicons-react'

interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'warning' | 'info'
  isLoading?: boolean
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmer',
  cancelText = 'Annuler',
  variant = 'danger',
  isLoading = false,
}: ConfirmDialogProps) {
  const reduceMotion = useReducedMotion()
  const titleId = useId()
  const descId = useId()
  const cancelRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isLoading) onClose()
    }
    document.addEventListener('keydown', onKey)
    cancelRef.current?.focus()
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [isOpen, isLoading, onClose])

  const motionProps = reduceMotion
    ? { initial: false, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, scale: 0.98, y: 12 },
        animate: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 0.98, y: 12 },
      }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="mm-dialog-root" role="presentation">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.2 }}
            onClick={isLoading ? undefined : onClose}
            className="mm-dialog-backdrop"
            aria-hidden="true"
          />

          <div className="mm-dialog-viewport">
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              aria-describedby={descId}
              {...motionProps}
              transition={{ duration: reduceMotion ? 0 : 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="mm-dialog"
            >
              <div className="mm-dialog-head">
                <h3 id={titleId} className="mm-dialog-title">{title}</h3>
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isLoading}
                  className="mm-icon-btn mm-dialog-close"
                  aria-label="Fermer"
                >
                  <Cancel01Icon className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>

              <p id={descId} className="mm-dialog-message">{message}</p>

              <div className="mm-dialog-actions">
                <button
                  ref={cancelRef}
                  type="button"
                  onClick={onClose}
                  disabled={isLoading}
                  className="mm-soft mm-dialog-cancel"
                >
                  {cancelText}
                </button>
                <button
                  type="button"
                  onClick={onConfirm}
                  disabled={isLoading}
                  className="mm-btn mm-dialog-confirm"
                  data-variant={variant}
                >
                  {isLoading ? 'En cours…' : confirmText}
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  )
}
