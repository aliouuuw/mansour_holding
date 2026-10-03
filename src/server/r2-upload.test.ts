import { expect, test } from 'bun:test'
import { exactBytes } from './r2-upload'

test('exactBytes keeps only the view, not the parent buffer', () => {
  const parent = new Uint8Array([1, 2, 3, 4, 5])
  const view = parent.subarray(1, 4)
  const exact = exactBytes(view)
  expect([...exact]).toEqual([2, 3, 4])
  expect(exact.buffer.byteLength).toBe(3)
})
