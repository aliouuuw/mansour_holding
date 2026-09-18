import type { ApiVehicle } from '@/lib/api'

/* ── the house: one place for contact details (still the current site's placeholders) ── */
export const CONTACT = {
  phone: '+221 33 123 45 67',
  tel: 'tel:+221331234567',
  email: 'motors@mansour.sn',
  whatsapp: '221771234567',
  address: 'Route de la Corniche Ouest, Almadies, Dakar',
  maps: 'https://www.google.com/maps/search/?api=1&query=PFPR%2B9J7%20Dakar',
}

export const FUEL = { diesel: 'Diesel', gasoline: 'Essence', hybrid: 'Hybride', electric: 'Électrique' } as const
export const GEARBOX = { automatic: 'Automatique', manual: 'Manuelle', cvt: 'CVT' } as const
export const STATE = { available: 'Disponible', reserved: 'Réservé', sold: 'Vendu' } as const

const nf = new Intl.NumberFormat('fr-FR')
const clean = (s: string) => s.replace(/[  ]/g, ' ')
export const fcfa = (n: number) => `${clean(nf.format(n))} FCFA`
export const km = (n: number) => `${clean(nf.format(n))} km`
export const pad2 = (n: number) => String(n).padStart(2, '0')
export const waLink = (text: string) => `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(text)}`
export const vehicleUrl = (v: Pick<ApiVehicle, 'id'>) => `/mansour-motors/vehicules/${v.id}`

/* photo metadata lives in extras: which way the car's nose points, and the focal point */
export const face = (v: ApiVehicle): 'left' | 'right' => (v.extras.face === 'right' ? 'right' : 'left')
export const focal = (v: ApiVehicle) => v.extras.pos || '50% 52%'
export const cover = (v: ApiVehicle) => v.images[0] ?? ''

/* ── hours: Dakar is UTC+0 all year, so UTC getters give showroom time ── */
export const HOURS: Record<number, [number, number]> = { 1: [8, 18], 2: [8, 18], 3: [8, 18], 4: [8, 18], 5: [8, 18], 6: [9, 17] }
export const DAY = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi']

export function openState(now = new Date()) {
  const d = now.getUTCDay()
  const h = now.getUTCHours() + now.getUTCMinutes() / 60
  const today = HOURS[d]
  if (today && h >= today[0] && h < today[1]) return { open: true, text: `Ouvert jusqu'à ${today[1]}h` }
  for (let i = 0; i < 8; i++) {
    const day = (d + i) % 7
    const hh = HOURS[day]
    if (!hh || (i === 0 && h >= hh[0])) continue
    const when = i === 0 ? "aujourd'hui" : i === 1 ? 'demain' : DAY[day]
    return { open: false, text: `Fermé, ouvre ${when} à ${hh[0]}h` }
  }
  return { open: false, text: 'Fermé' }
}

/* visit slots: the next opening days, whole hours inside the hours, today only from the next hour */
export function bookingDays(now = new Date(), count = 6) {
  const h = now.getUTCHours() + now.getUTCMinutes() / 60
  const out: { date: Date; slots: number[]; today: boolean }[] = []
  for (let i = 0; out.length < count && i < 14; i++) {
    const date = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + i))
    const hh = HOURS[date.getUTCDay()]
    if (!hh) continue
    const slots = []
    for (let s = hh[0]; s < hh[1]; s++) if (i > 0 || s >= h + 1) slots.push(s)
    if (slots.length) out.push({ date, slots, today: i === 0 })
  }
  return out
}
