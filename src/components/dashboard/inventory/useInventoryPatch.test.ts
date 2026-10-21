import { expect, test } from 'bun:test'
import { parseInventoryPatch, validateInventoryPatch } from './useInventoryPatch'

test('prices keep every digit, whatever the separator', () => {
  expect(parseInventoryPatch('price', '25.000.000')).toEqual({ price: 25_000_000 })
  expect(parseInventoryPatch('price', '25 000 000 F CFA')).toEqual({ price: 25_000_000 })
  expect(parseInventoryPatch('price', '  ')).toEqual({ price: null })
})

test('text with no digit is rejected, not sent as NaN', () => {
  expect(validateInventoryPatch('year', parseInventoryPatch('year', 'abc'))).toBe('Année invalide.')
  expect(validateInventoryPatch('mileage', parseInventoryPatch('mileage', 'km'))).toBe('Kilométrage invalide.')
  expect(validateInventoryPatch('price', parseInventoryPatch('price', 'sur demande'))).toBe('Prix invalide.')
})

test('valid values pass', () => {
  expect(validateInventoryPatch('year', parseInventoryPatch('year', '2024'))).toBeNull()
  expect(validateInventoryPatch('mileage', parseInventoryPatch('mileage', '45 000 km'))).toBeNull()
})
