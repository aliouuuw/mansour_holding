'use client'

import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useWatch, type Control, type UseFormGetValues, type UseFormSetValue } from 'react-hook-form'
import { AiBeautifyIcon } from 'hugeicons-react'
import { DashButton, mmLabelClass, mmSelectClass } from '@/components/dashboard'
import { vehiclesAiApi } from '@/lib/api'
import { featureEntries } from '@/components/motors/VehicleForm'
import type { VehicleFormValues } from '@/components/motors/VehicleForm'

const MODEL_STORAGE_KEY = 'mansour-motors-ai-model'

type Props = {
  control: Control<VehicleFormValues>
  setValue: UseFormSetValue<VehicleFormValues>
  getValues: UseFormGetValues<VehicleFormValues>
}

export function VehicleFormAiAssist({ control, setValue, getValues }: Props) {
  const [title, setTitle] = useState('')
  const [modelId, setModelId] = useState<string>('')
  const [busy, setBusy] = useState<'suggest' | 'description' | null>(null)
  const [error, setError] = useState<string | null>(null)
  const make = useWatch({ control, name: 'make' })
  const model = useWatch({ control, name: 'model' })
  const canDescribe = Boolean(make?.trim() && model?.trim())

  const modelsQuery = useQuery({
    queryKey: ['openrouter-assist-models'],
    queryFn: () => vehiclesAiApi.listModels(),
    staleTime: 15 * 60 * 1000,
  })

  useEffect(() => {
    if (!modelsQuery.data || modelId) return
    const saved = typeof window !== 'undefined' ? localStorage.getItem(MODEL_STORAGE_KEY) : null
    const allowed = new Set(modelsQuery.data.models.map((m) => m.id))
    const initial =
      (saved && allowed.has(saved) ? saved : null)
      ?? modelsQuery.data.defaultModelId
    setModelId(initial)
  }, [modelsQuery.data, modelId])

  const onModelChange = (id: string) => {
    setModelId(id)
    try {
      localStorage.setItem(MODEL_STORAGE_KEY, id)
    } catch {
      /* private mode */
    }
  }

  const applySuggest = async () => {
    setError(null)
    setBusy('suggest')
    try {
      const data = await vehiclesAiApi.suggestFromTitle(title, modelId || undefined)
      if (data.make) setValue('make', data.make, { shouldDirty: true })
      if (data.model) setValue('model', data.model, { shouldDirty: true })
      if (data.year) setValue('year', data.year, { shouldDirty: true })
      if (data.fuelType) setValue('fuelType', data.fuelType, { shouldDirty: true })
      if (data.transmission) setValue('transmission', data.transmission, { shouldDirty: true })
      if (data.extras && Object.keys(data.extras).length) {
        const photo = getValues()
        const prev = featureEntries(
          Object.fromEntries(
            (photo.extras ?? []).map(({ key, value }) => [key, value]),
          ),
        )
        const merged = { ...Object.fromEntries(prev), ...data.extras }
        setValue(
          'extras',
          Object.entries(merged).map(([key, value]) => ({ key, value })),
          { shouldDirty: true },
        )
      }
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setBusy(null)
    }
  }

  const applyDescription = async () => {
    if (!canDescribe) {
      setError('Saisissez la marque et le modèle, ou utilisez « Compléter depuis le titre ».')
      return
    }
    setError(null)
    setBusy('description')
    try {
      const v = getValues()
      const extrasMap = Object.fromEntries(
        (v.extras ?? []).filter(({ key, value }) => key && value).map(({ key, value }) => [key, value]),
      )
      const { description } = await vehiclesAiApi.generateDescription(
        {
          make: v.make,
          model: v.model,
          year: v.year,
          mileage: v.mileage,
          fuelType: v.fuelType,
          transmission: v.transmission,
          color: v.color,
          extras: extrasMap,
        },
        modelId || undefined,
      )
      setValue('description', description, { shouldDirty: true })
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setBusy(null)
    }
  }

  const models = modelsQuery.data?.models ?? []
  const modelsLoading = modelsQuery.isLoading
  const modelsError = modelsQuery.error as Error | null

  return (
    <div className="mm-ai">
      <h2 className="mm-ai-title">
        <AiBeautifyIcon className="h-4 w-4" aria-hidden />
        Assistant IA
      </h2>
      <p className="mm-ai-note">
        Trois modèles gratuits et deux modèles payants économiques, chargés depuis OpenRouter. La description reprend uniquement les champs déjà saisis.
      </p>

      <div>
        <label className={mmLabelClass} htmlFor="ai-model">
          Modèle
        </label>
        {modelsLoading && (
          <p className="mm-ai-note">Chargement des modèles…</p>
        )}
        {modelsError && (
          <p className="mm-ai-error" role="alert">{modelsError.message}</p>
        )}
        {!modelsLoading && models.length > 0 && (
          <select
            id="ai-model"
            className={mmSelectClass}
            value={modelId}
            onChange={(e) => onModelChange(e.target.value)}
            disabled={busy !== null}
          >
            <optgroup label="Gratuit">
              {models.filter((m) => m.tier === 'free').map((m) => (
                <option key={m.id} value={m.id}>
                  {m.label} — {m.priceLabel}
                </option>
              ))}
            </optgroup>
            <optgroup label="Payant (économique)">
              {models.filter((m) => m.tier === 'paid').map((m) => (
                <option key={m.id} value={m.id}>
                  {m.label} — {m.priceLabel}
                </option>
              ))}
            </optgroup>
          </select>
        )}
      </div>

      <label className={mmLabelClass} htmlFor="ai-title">Titre complet</label>
      <textarea
        id="ai-title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        rows={2}
        className="mm-input w-full resize-none text-sm"
        placeholder="NEW 2025 TOYOTA LAND CRUISER 300 GR SPORT 3.5L ESSENCE..."
      />
      <div className="flex flex-wrap gap-2">
        <DashButton
          type="button"
          variant="soft"
          disabled={busy !== null || title.trim().length < 3 || !modelId}
          onClick={() => void applySuggest()}
        >
          {busy === 'suggest' ? 'Analyse…' : 'Compléter depuis le titre'}
        </DashButton>
        <DashButton
          type="button"
          variant="soft"
          disabled={busy !== null || !modelId || !canDescribe}
          onClick={() => void applyDescription()}
        >
          {busy === 'description' ? 'Rédaction…' : 'Générer la description'}
        </DashButton>
      </div>
      {!canDescribe && (
        <p className="mm-ai-note">La description attend une marque et un modèle.</p>
      )}
      {error && <p className="mm-ai-error" role="alert">{error}</p>}
    </div>
  )
}
