import type { ComponentProps, ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function Field({
  label,
  className,
  children,
  ...rest
}: { label: string; children: ReactNode } & Omit<ComponentProps<'label'>, 'children'>) {
  return (
    <label className={cn('field', className)} {...rest}>
      <span>{label}</span>
      {children}
    </label>
  )
}

export function Fieldset({
  legend,
  className,
  children,
  ...rest
}: { legend: string; children: ReactNode } & Omit<ComponentProps<'fieldset'>, 'children'>) {
  return (
    <fieldset className={cn('field', className)} {...rest}>
      <legend>{legend}</legend>
      {children}
    </fieldset>
  )
}
