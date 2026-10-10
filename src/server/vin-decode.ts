'use server'

import { requireUser } from './session'

export type DecodedVin = {
  vin: string
  year: number | null
  make: string
  model: string
  trim: string
  bodyClass: string
  /** Used when NHTSA has no trim (e.g. Ford): drive, cab and engine still tell versions apart. */
  drive: string
  cab: string
  engine: string
}

// Returned, not thrown: Next.js hides thrown server-action messages in production.
export type DecodeVinResult = { ok: true; car: DecodedVin } | { ok: false; error: string }

/** Decodes a VIN with the free NHTSA vPIC API (US / Canada market VINs). */
export async function decodeVin(vin: string): Promise<DecodeVinResult> {
  await requireUser()
  const clean = vin.trim().toUpperCase()
  if (!/^[A-HJ-NPR-Z0-9]{17}$/.test(clean)) {
    return { ok: false, error: 'VIN invalide : 17 caractères, sans les lettres I, O ni Q.' }
  }

  try {
    const res = await fetch(
      `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValues/${clean}?format=json`,
      { cache: 'force-cache', signal: AbortSignal.timeout(10000) },
    )
    if (!res.ok) throw new Error(String(res.status))
    const r = (await res.json()).Results?.[0] ?? {}
    if (!r.Make) {
      return { ok: false, error: 'VIN inconnu de la base américaine. Saisissez l’année et la catégorie à la main.' }
    }
    return {
      ok: true,
      car: {
        vin: clean,
        year: Number(r.ModelYear) || null,
        make: r.Make,
        model: r.Model ?? '',
        trim: r.Trim ?? '',
        bodyClass: r.BodyClass ?? '',
        drive: (r.DriveType ?? '').split('/')[0],
        cab: (r.BodyCabType ?? '').split('/')[0],
        engine: [r.DisplacementL && `${r.DisplacementL} L`, r.EngineCylinders && `${r.EngineCylinders} cyl.`].filter(Boolean).join(' '),
      },
    }
  } catch {
    return { ok: false, error: 'Service de décodage indisponible. Réessayez, ou saisissez l’année et la catégorie à la main.' }
  }
}
