'use client'

import type { ReactNode } from 'react'
import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { ArrowDown01Icon } from 'hugeicons-react'
import { filterComboboxOptions, type InventoryPatchField } from './useInventoryPatch'

export function InventoryFieldCombobox({
  field,
  vehicleId,
  display,
  editing,
  draft,
  saving,
  error,
  options,
  inputType = 'text',
  inputMode,
  align = 'left',
  onStart,
  onDraft,
  onCommit,
  onCancel,
}: {
  field: InventoryPatchField
  vehicleId: string
  display: ReactNode
  editing: boolean
  draft: string
  saving: boolean
  error: string | null
  options: string[]
  inputType?: 'text'
  inputMode?: 'numeric' | 'text'
  align?: 'left' | 'right'
  onStart: () => void
  onDraft: (v: string) => void
  onCommit: (pickedValue?: string) => void
  onCancel: () => void
}) {
  const listId = useId()
  const wrapRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [open, setOpen] = useState(false)

  const filtered = useMemo(
    () => filterComboboxOptions(field, options, draft),
    [draft, field, options]
  )

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
      setOpen(true)
    }
    if (!editing) setOpen(false)
  }, [editing])

  useEffect(() => {
    if (!editing) return
    const onDoc = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [editing])

  const cellId = `${vehicleId}-${field}`

  if (!editing) {
    return (
      <td
        className={[
          'mm-grid-cell-td',
          align === 'right' ? 'mm-grid-cell-td--right' : '',
          saving ? 'mm-grid-cell-td--saving' : '',
          error ? 'mm-grid-cell-td--error' : '',
        ].filter(Boolean).join(' ')}
        data-cell={cellId}
      >
        <button type="button" className="mm-grid-cell mm-grid-cell--combo" onClick={onStart} disabled={saving}>
          <span className="mm-grid-cell-text">{display}</span>
          <ArrowDown01Icon className="mm-grid-cell-chevron h-3 w-3 shrink-0 opacity-40" aria-hidden="true" />
        </button>
        {error && <span className="mm-grid-cell-error" role="alert">{error}</span>}
      </td>
    )
  }

  return (
    <td
      className={[
        'mm-grid-cell-td',
        align === 'right' ? 'mm-grid-cell-td--right' : '',
        'mm-grid-cell-td--editing',
        saving ? 'mm-grid-cell-td--saving' : '',
        error ? 'mm-grid-cell-td--error' : '',
      ].filter(Boolean).join(' ')}
      data-cell={cellId}
    >
      <div ref={wrapRef} className="mm-grid-combo">
        <input
          ref={inputRef}
          type={inputType}
          inputMode={inputMode}
          className="mm-grid-input"
          value={draft}
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          onChange={(e) => {
            onDraft(e.target.value)
            setOpen(true)
          }}
          onInput={() => setOpen(true)}
          onFocus={() => setOpen(true)}
          onBlur={() => {
            setOpen(false)
            onCommit(undefined)
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              setOpen(false)
              onCommit(undefined)
            }
            if (e.key === 'Escape') {
              e.preventDefault()
              setOpen(false)
              onCancel()
            }
            if (e.key === 'ArrowDown' && !open) {
              e.preventDefault()
              setOpen(true)
            }
          }}
        />
        {open && filtered.length > 0 && (
          <ul id={listId} className="mm-grid-combo-list" role="listbox">
            {filtered.map((opt) => (
              <li key={opt} role="option">
                <button
                  type="button"
                  className="mm-grid-combo-option"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    onDraft(opt)
                    setOpen(false)
                    onCommit(opt)
                  }}
                >
                  {opt}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      {error && <span className="mm-grid-cell-error" role="alert">{error}</span>}
    </td>
  )
}
