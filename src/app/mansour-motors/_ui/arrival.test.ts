import { expect, test } from 'bun:test'
import { arrivalMs } from './car'

test('arrivalMs prefers arrivedAt over createdAt', () => {
  const v = {
    arrivedAt: '2025-06-01T12:00:00.000Z',
    createdAt: '2024-01-01T12:00:00.000Z',
  }
  expect(arrivalMs(v)).toBe(Date.parse(v.arrivedAt))
})

test('arrivalMs falls back to createdAt', () => {
  const v = { arrivedAt: '', createdAt: '2024-03-15T08:00:00.000Z' }
  expect(arrivalMs(v)).toBe(Date.parse(v.createdAt))
})
