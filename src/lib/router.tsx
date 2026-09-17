'use client'

import NextLink from 'next/link'
import { usePathname, useParams as useNextParams, useRouter } from 'next/navigation'
import { useEffect, type ComponentProps, type MouseEventHandler, type ReactNode } from 'react'

type LinkProps = {
  to: string
  params?: Record<string, string>
  hash?: string
  children?: ReactNode
  className?: string
  disabled?: boolean
  onClick?: MouseEventHandler<HTMLAnchorElement>
} & Omit<ComponentProps<typeof NextLink>, 'href' | 'onClick'>

function hrefFrom(to: string, params?: Record<string, string>, hash?: string) {
  let href = to
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      href = href.replace(`$${key}`, value)
    }
  }
  if (hash) href = `${href}#${hash}`
  return href
}

export function Link({ to, params, hash, disabled, ...rest }: LinkProps) {
  if (disabled) {
    return <span className={rest.className}>{rest.children}</span>
  }
  return <NextLink href={hrefFrom(to, params, hash)} {...rest} />
}

export function useNavigate() {
  const router = useRouter()
  return (opts: { to: string; params?: Record<string, string>; replace?: boolean }) => {
    const href = hrefFrom(opts.to, opts.params)
    if (opts.replace) router.replace(href)
    else router.push(href)
  }
}

export function useParams(_opts?: { strict?: boolean }) {
  return useNextParams() as Record<string, string | undefined>
}

export function useRouterState() {
  const pathname = usePathname()
  return { location: { pathname } }
}

export function useMatchRoute() {
  const pathname = usePathname()
  return ({ to, fuzzy }: { to: string; fuzzy?: boolean }) => {
    if (fuzzy) return pathname.startsWith(to)
    return pathname === to
  }
}

export function Navigate({ to, replace = true }: { to: string; replace?: boolean }) {
  const router = useRouter()
  useEffect(() => {
    if (replace) router.replace(to)
    else router.push(to)
  }, [replace, router, to])
  return null
}
