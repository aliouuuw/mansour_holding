/** Cheap paid cap: about $1 / 1M tokens (prompt + completion per token). */
const CHEAP_PAID_MAX = 0.000001

const MAINSTREAM_PAID = /^(google|openai|mistralai|meta-llama|qwen|nvidia|anthropic|deepseek)\//

export type OpenRouterCatalogModel = {
  id: string
  name: string
  description?: string
  context_length?: number
  pricing: { prompt: string; completion: string }
  architecture?: { modality?: string; output_modalities?: string[] }
  supported_parameters?: string[]
}

export type AssistModelOption = {
  id: string
  label: string
  tier: 'free' | 'paid'
  priceLabel: string
}

type CachedCatalog = { at: number; models: OpenRouterCatalogModel[] }

let catalogCache: CachedCatalog | null = null
const CACHE_MS = 15 * 60 * 1000

export function resetOpenRouterCatalogCacheForTests() {
  catalogCache = null
}

function unitPrice(m: OpenRouterCatalogModel) {
  return parseFloat(m.pricing.prompt || '0') + parseFloat(m.pricing.completion || '0')
}

export function isAssistChatModel(m: OpenRouterCatalogModel) {
  if (m.architecture?.modality !== 'text->text') return false
  if (!m.architecture.output_modalities?.includes('text')) return false
  const params = m.supported_parameters ?? []
  return params.includes('response_format') || params.includes('structured_outputs')
}

export function isFreeModel(m: OpenRouterCatalogModel) {
  return unitPrice(m) === 0
}

function priceLabel(m: OpenRouterCatalogModel): string {
  if (isFreeModel(m)) return 'Gratuit'
  const perM = unitPrice(m) * 1_000_000
  if (perM < 0.01) return `~$${perM.toFixed(3)}/M tokens`
  return `~$${perM.toFixed(2)}/M tokens`
}

function shortLabel(m: OpenRouterCatalogModel) {
  const name = m.name.replace(/\s*\(free\)\s*/i, '').trim()
  return name.length > 48 ? `${name.slice(0, 45)}…` : name
}

/** Pick 3 free + 2 cheap paid models from OpenRouter catalog order. */
export function pickAssistModels(catalog: OpenRouterCatalogModel[]): AssistModelOption[] {
  const index = new Map(catalog.map((m, i) => [m.id, i]))

  const free: OpenRouterCatalogModel[] = []
  for (const m of catalog) {
    if (!isAssistChatModel(m) || !isFreeModel(m)) continue
    free.push(m)
    if (free.length >= 3) break
  }

  const cheapPaid = catalog.filter(
    (m) => isAssistChatModel(m) && !isFreeModel(m) && unitPrice(m) <= CHEAP_PAID_MAX,
  )

  const mainstream = cheapPaid
    .filter((m) => MAINSTREAM_PAID.test(m.id))
    .sort((a, b) => (index.get(a.id) ?? 9999) - (index.get(b.id) ?? 9999))

  const paid: OpenRouterCatalogModel[] = []
  for (const m of mainstream) {
    paid.push(m)
    if (paid.length >= 2) break
  }
  if (paid.length < 2) {
    for (const m of cheapPaid) {
      if (paid.some((p) => p.id === m.id)) continue
      paid.push(m)
      if (paid.length >= 2) break
    }
  }

  const chosen = [...free, ...paid]
  const seen = new Set<string>()
  const out: AssistModelOption[] = []
  for (const m of chosen) {
    if (seen.has(m.id)) continue
    seen.add(m.id)
    out.push({
      id: m.id,
      label: shortLabel(m),
      tier: isFreeModel(m) ? 'free' : 'paid',
      priceLabel: priceLabel(m),
    })
  }
  return out
}

export async function fetchOpenRouterCatalog(): Promise<OpenRouterCatalogModel[]> {
  const now = Date.now()
  if (catalogCache && now - catalogCache.at < CACHE_MS) {
    return catalogCache.models
  }

  const res = await fetch('https://openrouter.ai/api/v1/models', {
    signal: AbortSignal.timeout(20_000),
    next: { revalidate: 900 },
  })
  if (!res.ok) throw new Error(`OpenRouter models (${res.status})`)

  const payload = (await res.json()) as { data?: OpenRouterCatalogModel[] }
  const models = payload.data ?? []
  catalogCache = { at: now, models }
  return models
}

export async function getAssistModelOptions(): Promise<{
  models: AssistModelOption[]
  defaultModelId: string
}> {
  const catalog = await fetchOpenRouterCatalog()
  const models = pickAssistModels(catalog)
  if (models.length === 0) {
    throw new Error('Aucun modèle OpenRouter compatible trouvé.')
  }
  const defaultModelId =
    models.find((m) => m.tier === 'free')?.id
    ?? models.find((m) => m.id.includes('gemini-2.5-flash-lite'))?.id
    ?? models[0]!.id
  return { models, defaultModelId }
}

export async function resolveAssistModelId(requested: string | undefined): Promise<string> {
  const { models, defaultModelId } = await getAssistModelOptions()
  const allowed = new Set(models.map((m) => m.id))
  const id = requested?.trim() || defaultModelId
  if (!allowed.has(id)) {
    throw new Error('Modèle IA non autorisé. Choisissez-en un dans la liste.')
  }
  return id
}
