import { expect, test } from 'bun:test'
import { rangeOf } from './shared'

test('a car lands in one range from the live site', () => {
  expect(rangeOf({ make: 'Rolls-Royce', model: 'Cullinan Black Badge' })).toBe('luxe')
  expect(rangeOf({ make: 'Land Rover', model: 'Range Rover Vogue Autobiography P400' })).toBe('luxe')
  expect(rangeOf({ make: 'Mercedes-Benz', model: 'G 63 AMG 4MATIC+' })).toBe('sport')
  expect(rangeOf({ make: 'Mercedes-Benz', model: 'CLE 300 Coupé 4MATIC' })).toBe('sport')
  expect(rangeOf({ make: 'Toyota', model: 'Land Cruiser 79 Double Cabine' })).toBe('pickup')
  expect(rangeOf({ make: 'Toyota', model: 'Hilux GR Sport Double Cab' })).toBe('pickup')
  expect(rangeOf({ make: 'Toyota', model: 'Prado VX Limited' })).toBe('suv')
  expect(rangeOf({ make: 'Jeep', model: 'Wrangler Unlimited Sport' })).toBe('suv')
})
