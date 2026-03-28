import { createContext, useContext, useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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

  const toast = useCallback((message: string, type: ToastType = 'success') => {
    const id = ++counter.current
    setToasts((t) => [...t, { id, message, type }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500)
  }, [])

  const dismiss = (id: number) => setToasts((t) => t.filter((x) => x.id !== id))

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 16, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="pointer-events-auto flex items-center gap-3 border bg-white px-4 py-3 shadow-lg min-w-[280px] max-w-sm"
              style={{ borderColor: t.type === 'success' ? '#d1fae5' : '#fee2e2' }}
            >
              {t.type === 'success'
                ? <CheckmarkCircle01Icon className="h-4 w-4 flex-shrink-0 text-emerald-500" />
                : <Alert01Icon className="h-4 w-4 flex-shrink-0 text-red-500" />
              }
              <p className="flex-1 text-sm font-medium text-noir-900">{t.message}</p>
              <button
                onClick={() => dismiss(t.id)}
                className="flex-shrink-0 text-noir-400 hover:text-noir-700 transition-colors"
              >
                <Cancel01Icon className="h-3.5 w-3.5" />
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
