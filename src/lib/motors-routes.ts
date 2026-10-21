/* every public Mansour Motors URL in one place: links, canonicals, sitemap, JSON-LD, redirects */

type VehicleRef = { id: string; make: string; model: string; year: number }

/* 12 hex chars of the uuid: ~2e-7 clash odds at 10 000 cars. ponytail: raise SHORT_ID if the stock ever nears that. */
const SHORT_ID = 12
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const SLUG_TAIL = new RegExp(`(?:^|-)([0-9a-f]{${SHORT_ID}})$`)

/** « toyota-land-cruiser-300-2024-3316b5ef562f »: readable words, then the id that resolves it. */
export function vehicleSlug(v: VehicleRef) {
  const words = `${v.make} ${v.model} ${v.year}`
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return `${words}-${v.id.replace(/-/g, '').slice(0, SHORT_ID).toLowerCase()}`
}

/** A full uuid (old links) or the short id at the end of a slug. The words never decide. */
export function parseVehicleSlug(param: string): { id: string } | { prefix: string } | null {
  const raw = decodeURIComponent(param).toLowerCase()
  if (UUID.test(raw)) return { id: raw }
  const tail = SLUG_TAIL.exec(raw)
  return tail ? { prefix: tail[1] } : null
}

export const motorsRoutes = {
  home: '/',
  stock: '/vehicules',
  alert: '/#alerte',
  showroom: '/#showroom',
  vehicle: (v: VehicleRef) => `/vehicules/${vehicleSlug(v)}`,
}
