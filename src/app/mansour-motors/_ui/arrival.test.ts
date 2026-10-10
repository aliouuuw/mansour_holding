import { expect, test } from 'bun:test'
import { arrivalMs, lineup } from './car'

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

test('lineup follows the staff showroom order within a status', () => {
  const v = (id: string, status: 'available' | 'sold', sortOrder: number) =>
    ({ id, status, sortOrder, price: null }) as unknown as Parameters<typeof lineup>[0][number]
  const ids = lineup([v('a', 'available', 2), v('b', 'sold', 0), v('c', 'available', 1)]).map((x) => x.id)
  expect(ids).toEqual(['c', 'a', 'b'])
})
