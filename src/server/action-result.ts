/* Next.js hides thrown server-action messages in production. Actions return this instead,
   and the client (src/lib/api.ts) turns { ok: false } back into an Error with the French text. */
import { unstable_rethrow } from 'next/navigation'

export type ActionResult<T> = { ok: true; data: T } | { ok: false; error: string }

/** An error whose message is safe and useful to show to staff. */
export class UserError extends Error {}

export async function attempt<T>(run: () => Promise<T>): Promise<ActionResult<T>> {
  try {
    return { ok: true, data: await run() }
  } catch (err) {
    /* redirect(), notFound() and dynamic-rendering signals are Next.js control flow, not failures */
    unstable_rethrow(err)
    if (err instanceof UserError) return { ok: false, error: err.message }
    console.error('Server action failed:', err)
    return { ok: false, error: 'Une erreur est survenue. Réessayez.' }
  }
}

export async function unwrap<T>(result: Promise<ActionResult<T>>): Promise<T> {
  const r = await result
  if (!r.ok) throw new Error(r.error)
  return r.data
}
