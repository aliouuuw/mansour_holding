import { expect, test } from 'bun:test'
import { escapeCsvCell } from './csv'

test('cells holding the separator or a quote are quoted', () => {
  expect(escapeCsvCell('Land Cruiser; GR')).toBe('"Land Cruiser; GR"')
  expect(escapeCsvCell('12,5')).toBe('"12,5"')
  expect(escapeCsvCell('Toit "panoramique"')).toBe('"Toit ""panoramique"""')
  expect(escapeCsvCell('Toyota')).toBe('Toyota')
  expect(escapeCsvCell(null)).toBe('')
})
