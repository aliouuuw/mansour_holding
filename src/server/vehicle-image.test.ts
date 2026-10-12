import { expect, test } from 'bun:test'
import { coverFor, spotlightIsCutout, spotlightSrc, vehicleImageMeta } from './vehicle-image'

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

test('coverFor keeps the cutout while the first photo is unchanged', () => {
  const extras = { cover: '/c.webp', Places: '5' }
  expect(coverFor(extras, ['a', 'b'], ['a'])).toBe(extras)
})

test('coverFor drops the cutout when the first photo changes', () => {
  expect(coverFor({ cover: '/c.webp', Places: '5' }, ['a', 'b'], ['b'])).toEqual({ Places: '5' })
})

test('spotlightSrc prefers the staff choice over the studio cutout', () => {
  expect(spotlightSrc({ cover: '/c.webp', spot: 'b' }, ['a', 'b'])).toBe('b')
  expect(spotlightIsCutout({ cover: '/c.webp', spot: 'b' }, ['a', 'b'])).toBe(false)
})

test('spotlightSrc falls back when the chosen photo is gone', () => {
  expect(spotlightSrc({ cover: '/c.webp', spot: 'gone' }, ['a'])).toBe('/c.webp')
  expect(spotlightIsCutout({ cover: '/c.webp', spot: 'gone' }, ['a'])).toBe(true)
})

test('coverFor keeps the choice on the replaced file and drops a deleted one', () => {
  expect(coverFor({ spot: 'b', cover: '/c.webp' }, ['a', 'b'], ['a', 'b2'])).toEqual({
    spot: 'b2',
    cover: '/c.webp',
  })
  expect(coverFor({ spot: 'a', cover: '/c.webp' }, ['a', 'b'], ['a2', 'b'])).toEqual({ spot: 'a2' })
  expect(coverFor({ spot: 'b', Places: '5' }, ['a', 'b'], ['a'])).toEqual({ Places: '5' })
})
