/* photo and import keys are not buyer-facing features */
const HIDDEN = new Set(['face', 'pos', 'cover', 'source', 'spot'])

/** Lines for the public fiche. Drops photo metadata and a leading ": " left by the catalogue import. */
export function featureLines(extras: Record<string, string>): [string, string][] {
  const lines: [string, string][] = []
  for (const [key, raw] of Object.entries(extras)) {
    if (HIDDEN.has(key)) continue
    const value = raw.replace(/^\s*:\s*/, '').trim()
    if (key.trim() && value) lines.push([key.trim(), value])
  }
  return lines
}
