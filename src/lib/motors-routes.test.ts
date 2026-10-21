import { expect, test } from 'bun:test'
import { motorsRoutes, parseVehicleSlug, vehicleSlug } from './motors-routes'

const car = { id: '3316b5ef-562f-4a51-b022-6f2302c4a3fc', make: 'Mercedes-Benz', model: 'Classe G 63 AMG Édition', year: 2024 }

test('the slug reads as words and ends with the short id', () => {
  expect(vehicleSlug(car)).toBe('mercedes-benz-classe-g-63-amg-edition-2024-3316b5ef562f')
  expect(motorsRoutes.vehicle(car)).toBe('/vehicules/mercedes-benz-classe-g-63-amg-edition-2024-3316b5ef562f')
})

test('a slug resolves by its short id, whatever the words say', () => {
  expect(parseVehicleSlug(vehicleSlug(car))).toEqual({ prefix: '3316b5ef562f' })
  expect(parseVehicleSlug('old-name-3316b5ef562f')).toEqual({ prefix: '3316b5ef562f' })
})

test('old uuid links still resolve', () => {
  expect(parseVehicleSlug(car.id)).toEqual({ id: car.id })
  expect(parseVehicleSlug(car.id.toUpperCase())).toEqual({ id: car.id })
})

test('anything else is not a vehicle', () => {
  expect(parseVehicleSlug('toyota-land-cruiser')).toBeNull()
  expect(parseVehicleSlug('x-3316b5ef56')).toBeNull()
})
