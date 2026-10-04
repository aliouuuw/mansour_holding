import { expect, test } from 'bun:test'
import {
  isAssistChatModel,
  isFreeModel,
  pickAssistModels,
  type OpenRouterCatalogModel,
} from './openrouter-models'

const base = (over: Partial<OpenRouterCatalogModel>): OpenRouterCatalogModel => ({
  id: 'test/model',
  name: 'Test Model',
  pricing: { prompt: '0', completion: '0' },
  architecture: { modality: 'text->text', output_modalities: ['text'] },
  supported_parameters: ['response_format'],
  ...over,
})

test('pickAssistModels returns 3 free and 2 cheap paid', () => {
  const catalog: OpenRouterCatalogModel[] = [
    base({ id: 'a/free-1', name: 'A Free 1' }),
    base({ id: 'b/free-2', name: 'B Free 2' }),
    base({ id: 'c/free-3', name: 'C Free 3' }),
    base({ id: 'd/free-4', name: 'D Free 4' }),
    base({
      id: 'google/gemini-2.5-flash-lite',
      name: 'Gemini Flash Lite',
      pricing: { prompt: '0.0000001', completion: '0.0000004' },
    }),
    base({
      id: 'obscure/cheap',
      name: 'Obscure',
      pricing: { prompt: '0.00000005', completion: '0.00000005' },
    }),
    base({
      id: 'mistralai/mistral-nemo',
      name: 'Mistral Nemo',
      pricing: { prompt: '0.00000002', completion: '0.00000002' },
    }),
  ]
  const picked = pickAssistModels(catalog)
  expect(picked.filter((m) => m.tier === 'free')).toHaveLength(3)
  expect(picked.filter((m) => m.tier === 'paid')).toHaveLength(2)
  expect(picked.some((m) => m.id === 'google/gemini-2.5-flash-lite')).toBe(true)
})

test('isAssistChatModel rejects image models', () => {
  expect(
    isAssistChatModel(
      base({
        architecture: { modality: 'text+image->text', output_modalities: ['text'] },
      }),
    ),
  ).toBe(false)
})

test('isFreeModel uses prompt and completion', () => {
  expect(isFreeModel(base({ pricing: { prompt: '0', completion: '0' } }))).toBe(true)
  expect(isFreeModel(base({ pricing: { prompt: '0.000001', completion: '0' } }))).toBe(false)
})
