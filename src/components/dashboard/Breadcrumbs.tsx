'use client'

import { Link } from '@/lib/router'

export type DashCrumb = {
  label: string
  to?: string
  params?: Record<string, string>
}

export function DashBreadcrumbs({ items }: { items: DashCrumb[] }) {
  if (items.length === 0) return null
  return (
    <nav className="mm-breadcrumb" aria-label="Fil d'Ariane">
      <ol className="mm-breadcrumb-list">
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          return (
            <li key={`${item.label}-${index}`} className="mm-breadcrumb-item">
              {item.to && !isLast ? (
                <Link to={item.to} params={item.params} className="mm-breadcrumb-link">{item.label}</Link>
              ) : (
                <span className="mm-breadcrumb-current" aria-current={isLast ? 'page' : undefined}>
                  {item.label}
                </span>
              )}
              {!isLast ? <span className="mm-breadcrumb-sep" aria-hidden="true">/</span> : null}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
