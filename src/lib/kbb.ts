// KBB valuation flow for US and Canadian imports. Rates come from the showroom process.

export const KBB_URL = 'https://www.kbb.com/whats-my-car-worth/'
export const KBB_ZIP = '12345'
export const KBB_MILES_PER_YEAR = 25000

export const USD_TO_FCFA = 600
export const FEES_SUV = 900000
export const FEES_OTHER = 700000
export const DD_RATE = 0.6438
export const REMISE_RATE = 0.35

/** Mileage to type on KBB: (current year - model year) * 25 000. */
export function kbbMileage(modelYear: number, currentYear = new Date().getFullYear()) {
  return Math.max(0, currentYear - modelYear) * KBB_MILES_PER_YEAR
}

/** Customs value from the KBB private-party value (USD), in FCFA, with each step of the breakdown. */
export function computeKbbDuties(carValueUsd: number, isSuv: boolean) {
  const valueFcfa = carValueUsd * USD_TO_FCFA
  const fees = isSuv ? FEES_SUV : FEES_OTHER
  const base = valueFcfa + fees
  const dd = Math.round(base * DD_RATE)
  return { valueFcfa, fees, base, dd, remise: Math.round(dd * (1 - REMISE_RATE)) }
}

export function isSuvBodyClass(bodyClass: string) {
  return /sport utility|\bsuv\b/i.test(bodyClass)
}

type ModelFields = { year: number | null; make: string; model: string; trim: string; drive: string; cab: string; engine: string }

/** One saved KBB link per model. Without a trim, drive, cab and engine narrow it down. */
export function kbbModelKey(car: ModelFields) {
  return [car.year ?? '', car.make, car.model, car.trim, car.drive, car.cab, car.engine].join('|').toUpperCase()
}

/** Accepts only a kbb.com values page that carries KBB's own vehicle id. */
export function parseKbbOffersUrl(raw: string) {
  try {
    const url = new URL(raw.trim())
    const ok = url.protocol === 'https:' && url.hostname === 'www.kbb.com' && url.searchParams.has('vehicleid')
    return ok ? url.toString() : null
  } catch {
    return null
  }
}

/** Saved link with this car's VIN and mileage. KBB recalculates the value on open. */
export function buildKbbLink(saved: string, car: { vin: string; mileage: number | null }) {
  const url = new URL(saved)
  url.searchParams.set('vin', car.vin.toLowerCase())
  if (car.mileage != null) url.searchParams.set('mileage', String(car.mileage))
  return url.toString()
}
