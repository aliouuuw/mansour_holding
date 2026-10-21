'use client'

import { useEffect, type RefObject } from 'react'

const FOCUSABLE =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

/* shared dialog behaviour: page scroll locked, focus moved in, Tab kept inside, Escape, focus given back on close */
export function useModal(
  open: boolean,
  ref: RefObject<HTMLElement | null>,
  { onEscape, initialFocus }: { onEscape?: () => void; initialFocus?: RefObject<HTMLElement | null> } = {}
) {
  useEffect(() => {
    if (!open) return
    const opener = document.activeElement as HTMLElement | null
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const target = initialFocus?.current ?? ref.current?.querySelector<HTMLElement>(FOCUSABLE) ?? ref.current
    target?.focus()
    return () => {
      document.body.style.overflow = prevOverflow
      opener?.focus?.()
    }
  }, [open, ref, initialFocus])

  useEffect(() => {
    const root = ref.current
    if (!open || !root) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onEscape) {
        e.preventDefault()
        onEscape()
        return
      }
      if (e.key !== 'Tab') return
      const els = Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE))
      if (els.length === 0) return
      const first = els[0]
      const last = els[els.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    root.addEventListener('keydown', onKey)
    return () => root.removeEventListener('keydown', onKey)
  }, [open, ref, onEscape])
}
