'use client'

import type { ComponentProps, ReactNode } from 'react'
import { Link } from '@/lib/router'
import { cn } from '@/lib/utils'
import type { VehicleStatus } from '@/lib/api'

export const mmLabelClass = 'mm-label'
export const mmInputClass = 'mm-input'
export const mmSelectClass = 'mm-input mm-select'
export const mmTextareaClass = 'mm-input mm-textarea'

const vehicleStatusLabels: Record<VehicleStatus, string> = {
  available: 'Disponible',
  reserved: 'Réservé',
  sold: 'Vendu',
}

type DashButtonProps = {
  variant?: 'primary' | 'soft'
  className?: string
  children: ReactNode
  full?: boolean
} & (
  | ({ to: string } & Omit<ComponentProps<typeof Link>, 'to' | 'className' | 'children'>)
  | ({ href: string } & Omit<ComponentProps<'a'>, 'href' | 'className' | 'children'>)
  | ({ type?: 'button' | 'submit' | 'reset' } & Omit<ComponentProps<'button'>, 'className' | 'children' | 'type'>)
)

function buttonClass(variant: 'primary' | 'soft', className?: string, full?: boolean) {
  return cn(variant === 'soft' ? 'mm-soft' : 'mm-btn', full && 'mm-btn--full', className)
}

export function DashButton(props: DashButtonProps) {
  const { variant = 'primary', className, children, full, ...rest } = props
  const cls = buttonClass(variant, className, full)
  if ('to' in props && props.to) {
    const { to, ...linkRest } = rest as { to: string }
    return (
      <Link to={to} className={cls} {...linkRest}>
        {children}
      </Link>
    )
  }
  if ('href' in props && props.href) {
    const { href, ...anchorRest } = rest as { href: string }
    return (
      <a href={href} className={cls} {...anchorRest}>
        {children}
      </a>
    )
  }
  const { type = 'button', ...btnRest } = rest as ComponentProps<'button'>
  return (
    <button type={type} className={cls} {...btnRest}>
      {children}
    </button>
  )
}

export function DashIconButton({
  className,
  children,
  ...props
}: ComponentProps<'button'>) {
  return (
    <button type="button" className={cn('mm-icon-btn', className)} {...props}>
      {children}
    </button>
  )
}

export function DashStatus({
  status,
  children,
  className,
}: {
  status: VehicleStatus
  children?: ReactNode
  className?: string
}) {
  return (
    <span className={cn('mm-status', className)} data-status={status}>
      {children ?? vehicleStatusLabels[status]}
    </span>
  )
}

export function DashPageHeader({
  title,
  lead,
  actions,
}: {
  title: string
  lead?: string
  actions?: ReactNode
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="mm-title">{title}</h1>
        {lead ? <p className="mm-lead">{lead}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  )
}

export { vehicleStatusLabels as dashVehicleStatusLabels }
