'use client'

import { createContext, useContext, useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { CheckmarkCircle01Icon, Alert01Icon, Cancel01Icon } from 'hugeicons-react'

type ToastType = 'success' | 'error'

interface Toast {
  id: number
  message: string
  type: ToastType
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const counter = useRef(0)
  const reduceMotion = useReducedMotion()

  const toast = useCallback((message: string, type: ToastType = 'success') => {
    const id = ++counter.current
    setToasts((t) => [...t, { id, message, type }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500)
  }, [])

  const dismiss = (id: number) => setToasts((t) => t.filter((x) => x.id !== id))

  const motionProps = reduceMotion
    ? { initial: false, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, y: 16, scale: 0.98 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: 8, scale: 0.98 },
      }

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="mm-toast-stack fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none sm:bottom-6 sm:right-6">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              {...motionProps}
              transition={{ duration: reduceMotion ? 0 : 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="mm-toast"
              data-type={t.type}
              role="status"
            >
              {t.type === 'success'
                ? <CheckmarkCircle01Icon className="h-4 w-4 shrink-0 text-[var(--mm-ok)]" aria-hidden="true" />
                : <Alert01Icon className="h-4 w-4 shrink-0 text-[var(--mm-stop)]" aria-hidden="true" />
              }
              <p className="mm-toast-message">{t.message}</p>
              <button
                type="button"
                onClick={() => dismiss(t.id)}
                className="mm-toast-dismiss"
                aria-label="Fermer la notification"
              >
                <Cancel01Icon className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx.toast
}
