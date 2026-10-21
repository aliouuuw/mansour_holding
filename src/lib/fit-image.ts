/* Vercel rejects request bodies above 4.5 MB, and phone photos often weigh 3-8 MB.
   Shrink them in the browser before the server action receives them. */
export const UPLOAD_LIMIT = 3.5 * 1024 * 1024
const MAX_SIDE = 2560

export async function fitImageForUpload(file: File): Promise<File> {
  /* small files and animated GIFs go up untouched */
  if (file.size <= UPLOAD_LIMIT || file.type === 'image/gif') return file

  const bitmap = await createImageBitmap(file)
  /* PNG and WebP can carry transparency (studio cutouts): keep it with WebP. Safari may fall back to PNG. */
  const type = file.type === 'image/png' || file.type === 'image/webp' ? 'image/webp' : 'image/jpeg'
  let scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height))
  try {
    for (let pass = 0; pass < 4; pass++) {
      const canvas = document.createElement('canvas')
      canvas.width = Math.round(bitmap.width * scale)
      canvas.height = Math.round(bitmap.height * scale)
      canvas.getContext('2d')?.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, 0.85))
      if (blob && blob.size <= UPLOAD_LIMIT) {
        const ext = blob.type === 'image/png' ? 'png' : blob.type === 'image/webp' ? 'webp' : 'jpg'
        return new File([blob], `${file.name.replace(/\.[^.]+$/, '')}.${ext}`, { type: blob.type })
      }
      scale *= 0.75
    }
  } finally {
    bitmap.close()
  }
  throw new Error('Photo trop lourde, même réduite. Essayez une autre photo.')
}
