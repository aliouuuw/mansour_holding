const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions'

export type ChatMessage = { role: 'system' | 'user' | 'assistant'; content: string }

type AssistantMessage = {
  content?: string | null
  reasoning?: string | null
  reasoning_content?: string | null
}

/** Prefer the chat reply. If a reasoning model spent the budget there, take the last JSON object. */
export function assistantText(message: AssistantMessage | undefined): string {
  const content = message?.content?.trim()
  if (content) return content
  const reasoning = (message?.reasoning ?? message?.reasoning_content)?.trim()
  if (!reasoning) return ''
  const start = reasoning.lastIndexOf('{')
  const end = reasoning.lastIndexOf('}')
  if (start >= 0 && end > start) return reasoning.slice(start, end + 1)
  return ''
}

/** Env fallback when no UI model is passed (dev/scripts). */
export function openRouterModelFromEnv() {
  return process.env.OPENROUTER_MODEL?.trim() || 'google/gemini-2.5-flash-lite'
}

function siteReferer() {
  return (
    process.env.FRONTEND_URL?.trim()
    || process.env.BETTER_AUTH_URL?.trim()
    || 'http://localhost:3000'
  )
}

export async function openRouterChat(
  messages: ChatMessage[],
  options?: { model?: string; jsonObject?: boolean; maxTokens?: number },
): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY?.trim()
  if (!apiKey) throw new Error('OPENROUTER_API_KEY manquant. Ajoutez-le dans .env.local.')

  const body: Record<string, unknown> = {
    model: options?.model?.trim() || openRouterModelFromEnv(),
    messages,
    temperature: 0.2,
    max_tokens: options?.maxTokens ?? 1024,
    /* reasoning models otherwise burn the token budget and return content: null */
    reasoning: { enabled: false, effort: 'none' },
  }
  if (options?.jsonObject) {
    body.response_format = { type: 'json_object' }
  }

  const res = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': siteReferer(),
      'X-Title': 'Mansour Motors',
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(45_000),
  })

  const raw = await res.text()
  if (!res.ok) {
    let detail = raw.slice(0, 200)
    try {
      const parsed = JSON.parse(raw) as { error?: { message?: string } }
      if (parsed.error?.message) detail = parsed.error.message
    } catch {
      /* keep slice */
    }
    throw new Error(`OpenRouter (${res.status}) : ${detail}`)
  }

  let payload: { choices?: { finish_reason?: string; message?: AssistantMessage }[] }
  try {
    payload = JSON.parse(raw) as typeof payload
  } catch {
    throw new Error('Réponse OpenRouter illisible.')
  }

  const choice = payload.choices?.[0]
  const content = assistantText(choice?.message)
  if (!content) {
    if (choice?.finish_reason === 'length') {
      throw new Error('Le modèle a été coupé avant la réponse. Choisissez un autre modèle, puis réessayez.')
    }
    throw new Error('OpenRouter a renvoyé une réponse vide. Choisissez un autre modèle, puis réessayez.')
  }
  return content
}
