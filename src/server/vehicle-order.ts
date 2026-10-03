export function assertReorderIds(orderedIds: string[], existingIds: string[]) {
  if (orderedIds.length === 0) throw new Error('Liste vide')
  const seen = new Set<string>()
  for (const id of orderedIds) {
    if (seen.has(id)) throw new Error('Doublon dans l’ordre')
    seen.add(id)
  }
  if (existingIds.length !== orderedIds.length || existingIds.some((id) => !seen.has(id))) {
    throw new Error('Le parc a changé. Rechargez la liste.')
  }
}
