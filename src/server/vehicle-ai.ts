'use server'

import { requireUser } from './session'
import { openRouterChat } from './openrouter'
import { getAssistModelOptions, resolveAssistModelId } from './openrouter-models'
import {
  featureExtrasForPrompt,
  normalizeSuggestPayload,
  parseJsonFromLlm,
  vehicleDescriptionSchema,
  type VehicleDescriptionFacts,
  type VehicleSuggestPayload,
} from './vehicle-ai-parse'

const CATALOGUE_EXTRA_KEYS = [
  'Motorisation',
  'Version',
  'Genre',
  'Energie',
  'Moteur',
  'Puissance',
  'Cylindrée',
  'Places',
]

function suggestSystemPrompt() {
  return `Tu es l'assistant inventaire de Mansour Motors (Dakar, Sénégal).
À partir d'un titre de fiche véhicule (souvent en anglais), extrais des champs structurés.
Réponds UNIQUEMENT en JSON valide, sans markdown.

Clés autorisées:
- make (marque, ex. Toyota)
- model (modèle + finition, ex. Land Cruiser 300 GR Sport)
- year (nombre entier)
- fuelType: "gasoline" | "diesel" | "hybrid" | "electric"
- transmission: "manual" | "automatic" | "cvt"
- extras: objet clé/valeur en français pour la fiche client. Préfère ces libellés quand c'est pertinent: ${CATALOGUE_EXTRA_KEYS.join(', ')}.
  Exemples: Motorisation "3.5L Twin Turbo", Puissance "409 ch", Cylindrée "3445 cm³", Energie "Essence".

Règles:
- N'invente pas de chiffres techniques absents du titre.
- Si le titre ne permet pas de déduire un champ, omets-le.
- Essence → gasoline, Diesel → diesel, Hybride → hybrid, Électrique → electric.`
}

function descriptionSystemPrompt() {
  return `Tu rédiges la description courte d'un véhicule pour le site Mansour Motors (français, Sénégal).
Réponds UNIQUEMENT en JSON: {"description":"..."}.

Règles:
- 2 à 4 phrases, ton professionnel et chaleureux.
- Utilise UNIQUEMENT les faits fournis (marque, modèle, année, km, carburant, transmission, couleur, caractéristiques).
- N'ajoute pas d'équipements, de prix, ni de garanties non mentionnés.
- Si kilométrage 0, dis « véhicule neuf »; sinon mentionne le km.
- Termine par une phrase du type « Disponible au showroom Mansour Motors » si le statut n'est pas fourni.`
}

export async function listVehicleAiModels() {
  await requireUser()
  return getAssistModelOptions()
}

export async function suggestVehicleFromTitle(
  title: string,
  modelId?: string,
): Promise<VehicleSuggestPayload> {
  await requireUser()
  const trimmed = title.trim()
  if (trimmed.length < 3) throw new Error('Titre trop court (3 caractères minimum).')
  const model = await resolveAssistModelId(modelId)

  const content = await openRouterChat(
    [
      { role: 'system', content: suggestSystemPrompt() },
      { role: 'user', content: `Titre:\n${trimmed}` },
    ],
    { model, jsonObject: true },
  )

  try {
    return normalizeSuggestPayload(parseJsonFromLlm(content))
  } catch {
    throw new Error('Impossible de lire la suggestion IA. Réessayez ou changez de modèle OpenRouter.')
  }
}

export async function generateVehicleDescription(
  facts: VehicleDescriptionFacts,
  modelId?: string,
): Promise<{ description: string }> {
  await requireUser()
  if (!facts.make.trim() || !facts.model.trim()) {
    throw new Error('Marque et modèle requis pour générer la description.')
  }
  const model = await resolveAssistModelId(modelId)

  const extras = featureExtrasForPrompt(facts.extras)
  const fuelFr: Record<string, string> = {
    gasoline: 'Essence',
    diesel: 'Diesel',
    hybrid: 'Hybride',
    electric: 'Électrique',
  }
  const transFr: Record<string, string> = {
    manual: 'Manuelle',
    automatic: 'Automatique',
    cvt: 'CVT',
  }

  const lines = [
    `Marque: ${facts.make.trim()}`,
    `Modèle: ${facts.model.trim()}`,
    `Année: ${facts.year}`,
    `Kilométrage: ${facts.mileage} km`,
    `Carburant: ${fuelFr[facts.fuelType] ?? facts.fuelType}`,
    `Transmission: ${transFr[facts.transmission] ?? facts.transmission}`,
  ]
  if (facts.color?.trim()) lines.push(`Couleur: ${facts.color.trim()}`)
  if (Object.keys(extras).length) {
    lines.push('Caractéristiques:')
    for (const [k, v] of Object.entries(extras)) lines.push(`- ${k}: ${v}`)
  }

  const content = await openRouterChat(
    [
      { role: 'system', content: descriptionSystemPrompt() },
      { role: 'user', content: lines.join('\n') },
    ],
    { model, jsonObject: true, maxTokens: 1024 },
  )

  try {
    return vehicleDescriptionSchema.parse(parseJsonFromLlm(content))
  } catch {
    throw new Error('Impossible de lire la description IA. Réessayez.')
  }
}
