import { expect, test } from 'bun:test'
import { vehicleImageMeta } from './vehicle-image'

test('vehicleImageMeta accepts a jpeg', () => {
  expect(vehicleImageMeta({ type: 'image/jpeg', name: 'photo.jpg', size: 1200 })).toEqual({
    type: 'image/jpeg',
    ext: 'jpg',
  })
})

test('vehicleImageMeta reads the extension when the browser omits the type', () => {
  expect(vehicleImageMeta({ type: '', name: 'photo.PNG', size: 80 })).toEqual({
    type: 'image/png',
    ext: 'png',
  })
})

test('vehicleImageMeta rejects HEIC and oversized files', () => {
  expect(() => vehicleImageMeta({ type: 'image/heic', name: 'IMG.HEIC', size: 400 })).toThrow(
    'Format non pris en charge'
  )
  expect(() => vehicleImageMeta({ type: 'image/jpeg', name: 'big.jpg', size: 11 * 1024 * 1024 })).toThrow(
    '10 Mo'
  )
})
