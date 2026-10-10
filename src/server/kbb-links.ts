'use server'

import { eq } from 'drizzle-orm'
import { db } from './db/index'
import { kbbLinks } from './db/schema'
import { requireUser } from './session'
import { parseKbbOffersUrl } from '@/lib/kbb'

export async function getKbbLink(modelKey: string): Promise<string | null> {
  await requireUser()
  const [row] = await db.select({ url: kbbLinks.url }).from(kbbLinks).where(eq(kbbLinks.modelKey, modelKey)).limit(1)
  return row?.url ?? null
}

// Returned, not thrown: Next.js hides thrown server-action messages in production.
export async function saveKbbLink(modelKey: string, raw: string): Promise<{ ok: true; url: string } | { ok: false; error: string }> {
  await requireUser()
  const url = parseKbbOffersUrl(raw)
  if (!url) return { ok: false, error: 'Adresse non reconnue : copiez l’adresse de la page des valeurs KBB (elle contient « vehicleid »).' }
  if (!modelKey) return { ok: false, error: 'Décodez d’abord le VIN.' }
  await db
    .insert(kbbLinks)
    .values({ modelKey, url })
    .onConflictDoUpdate({ target: kbbLinks.modelKey, set: { url, updatedAt: new Date() } })
  return { ok: true, url }
}
