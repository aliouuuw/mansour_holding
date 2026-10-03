import { expect, test } from 'bun:test'
import { assertReorderIds } from './vehicle-order'

test('assertReorderIds accepts a full permutation', () => {
  expect(() => assertReorderIds(['b', 'a'], ['a', 'b'])).not.toThrow()
})

test('assertReorderIds rejects a partial list', () => {
  expect(() => assertReorderIds(['a'], ['a', 'b'])).toThrow('Le parc a changé')
})
