import { expect, test } from 'bun:test'
import { parseJsonFromLlm, normalizeSuggestPayload, featureExtrasForPrompt } from './vehicle-ai-parse'

test('parseJsonFromLlm strips markdown fences', () => {
  const raw = parseJsonFromLlm('```json\n{"make":"Toyota"}\n```')
  expect(raw).toEqual({ make: 'Toyota' })
})

test('normalizeSuggestPayload trims extras', () => {
  const out = normalizeSuggestPayload({
    make: 'Toyota',
    extras: { ' Puissance ': ' 409 ch ' },
  })
  expect(out.extras).toEqual({ Puissance: '409 ch' })
})

test('featureExtrasForPrompt drops photo keys', () => {
  expect(featureExtrasForPrompt({ cover: '/x', Puissance: '300 ch' })).toEqual({
    Puissance: '300 ch',
  })
})
