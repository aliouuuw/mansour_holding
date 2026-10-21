import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number | null | undefined): string {
  if (price == null) return 'Prix sur demande'
  /* fr-FR currency for XOF prints "F CFA"; the showroom writes FCFA */
  const digits = new Intl.NumberFormat('fr-FR', {
    maximumFractionDigits: 0,
  }).format(price).replace(/[\u202f\u00a0]/g, ' ')
  return `${digits} FCFA`
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat('fr-FR').format(n).replace(/[\u202f\u00a0]/g, ' ')
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date))
}
