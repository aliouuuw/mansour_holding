import type { ComponentProps, ReactNode } from 'react'
import { Link } from '@/lib/router'
import { cn } from '@/lib/utils'

export type ButtonTone = 'silver' | 'soft'

type Shared = {
  children: ReactNode
  className?: string
  tone?: ButtonTone
}

type ToButton = Shared & { to: string; href?: never; type?: never } & Omit<ComponentProps<typeof Link>, 'to' | 'className' | 'children'>
type HrefButton = Shared & { href: string; to?: never; type?: never } & Omit<ComponentProps<'a'>, 'href' | 'className' | 'children'>
type NativeButton = Shared & { to?: never; href?: never } & Omit<ComponentProps<'button'>, 'className' | 'children'>

export type ButtonProps = ToButton | HrefButton | NativeButton

function plate(tone: ButtonTone | undefined, className?: string) {
  return cn(tone === 'soft' ? 'soft' : 'btn', className)
}

export function Button(props: ButtonProps) {
  const className = plate(props.tone, props.className)
  if ('to' in props && props.to) {
    const { to, className: _c, tone: _t, ...rest } = props
    return <Link className={className} to={to} {...rest} />
  }
  if ('href' in props && props.href) {
    const { href, className: _c, tone: _t, ...rest } = props
    return <a className={className} href={href} {...rest} />
  }
  const { className: _c, tone: _t, type = 'button', ...rest } = props as NativeButton
  return <button className={className} type={type} {...rest} />
}

export function Plate({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn('btn', className)}>{children}</span>
}
