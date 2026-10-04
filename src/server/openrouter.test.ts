import { expect, test } from 'bun:test'
import { assistantText } from './openrouter'

test('assistantText prefers message content', () => {
  expect(assistantText({ content: ' {"a":1} ', reasoning: '{"a":2}' })).toBe('{"a":1}')
})

test('assistantText recovers JSON from reasoning when content is empty', () => {
  expect(assistantText({ content: null, reasoning: 'think...\n{"description":"ok"}' })).toBe(
    '{"description":"ok"}',
  )
})
