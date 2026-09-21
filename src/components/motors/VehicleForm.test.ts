import { expect, test } from 'bun:test'
import { featureEntries, formExtras, toExtras, type VehicleFormValues } from './VehicleForm'

test('photo settings round-trip through extras without becoming features', () => {
  const stored = { Toit: 'Panoramique', face: 'right', pos: '35% 52%' }
  const form = formExtras(stored)
  expect(form).toEqual({ extras: [{ key: 'Toit', value: 'Panoramique' }], photoFace: 'right', photoFocus: '35% 52%' })
  expect(toExtras({ ...form } as VehicleFormValues)).toEqual(stored)
  expect(featureEntries(stored)).toEqual([['Toit', 'Panoramique']])
})

test('defaults are not written', () => {
  expect(toExtras({ extras: [], photoFace: 'left', photoFocus: '' } as unknown as VehicleFormValues)).toEqual({})
})

test('cover and source stay hidden and survive a save', () => {
  const stored = { Toit: 'Panoramique', cover: '/mansour-motors/covers/x.webp', source: 'catalogue-2026-09' }
  const form = formExtras(stored)
  expect(form.extras).toEqual([{ key: 'Toit', value: 'Panoramique' }])
  expect(toExtras({ ...form } as VehicleFormValues, stored)).toEqual(stored)
  expect(featureEntries(stored)).toEqual([['Toit', 'Panoramique']])
})
