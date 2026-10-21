import { UserError } from './action-result'

export function assertReorderIds(orderedIds: string[], existingIds: string[]) {
  if (orderedIds.length === 0) throw new UserError('Liste vide')
  const seen = new Set<string>()
  for (const id of orderedIds) {
    if (seen.has(id)) throw new UserError('Doublon dans l’ordre')
    seen.add(id)
  }
  if (existingIds.length !== orderedIds.length || existingIds.some((id) => !seen.has(id))) {
    throw new UserError('Le parc a changé. Rechargez la liste.')
  }
}
