import { expect, test } from 'bun:test'
import { UPLOAD_LIMIT, fitImageForUpload } from './fit-image'

test('a photo under the Vercel body limit goes up untouched', async () => {
  const file = new File([new Uint8Array(1024)], 'car.jpg', { type: 'image/jpeg' })
  expect(await fitImageForUpload(file)).toBe(file)
})

test('a GIF is never re-encoded', async () => {
  const file = new File([new Uint8Array(UPLOAD_LIMIT + 1)], 'spin.gif', { type: 'image/gif' })
  expect(await fitImageForUpload(file)).toBe(file)
})

test('the limit stays under the 4.5 MB Vercel request cap', () => {
  expect(UPLOAD_LIMIT).toBeLessThan(4.5 * 1024 * 1024)
})
