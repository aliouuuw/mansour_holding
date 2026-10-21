import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

export function Chapter({
  tone = 'light',
  className,
  ...rest
}: { tone?: 'light' | 'dark' } & ComponentProps<'section'>) {
  return <section className={cn(tone === 'dark' ? 'ch-dark' : 'ch-light', className)} {...rest} />
}
