const MAX_IMAGE_BYTES = 10 * 1024 * 1024

const EXT_BY_MIME: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
}

const MIME_BY_EXT: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  gif: 'image/gif',
}

export function vehicleImageMeta(file: { type: string; name: string; size: number }) {
  if (file.size <= 0) throw new Error('Fichier vide.')
  if (file.size > MAX_IMAGE_BYTES) throw new Error('Photo trop lourde. La limite est 10 Mo.')

  const mime = file.type === 'image/jpg' ? 'image/jpeg' : file.type
  const named = file.name.split('.').pop()?.toLowerCase().replace(/[^a-z0-9]/g, '') ?? ''
  const type = EXT_BY_MIME[mime] ? mime : MIME_BY_EXT[named]
  const ext = EXT_BY_MIME[type ?? ''] ?? ''
  if (!type || !ext) throw new Error('Format non pris en charge. Utilisez JPEG, PNG ou WebP.')
  return { type, ext }
}

/* the studio cutout in extras.cover stands for the first photo; once staff change that photo, the cutout is stale */
export function coverFor(extras: Record<string, string>, before: string[], after: string[]) {
  if (before[0] === after[0] || !('cover' in extras)) return extras
  const { cover: _, ...rest } = extras
  return rest
}
