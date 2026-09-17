import { useForm, useFieldArray } from 'react-hook-form'
import { cn } from '@/lib/utils'
import { Add01Icon, Delete01Icon } from 'hugeicons-react'
import type { FuelType, Transmission, VehicleStatus } from '@/lib/api'

export interface VehicleFormValues {
  make: string
  model: string
  year: number
  mileage: number
  price: number
  status: VehicleStatus
  fuelType: FuelType
  transmission: Transmission
  color: string
  vin: string
  description: string
  extras: { key: string; value: string }[]
}

interface Props {
  defaultValues?: Partial<VehicleFormValues>
  onSubmit: (values: VehicleFormValues) => Promise<void>
  submitLabel: string
  loading?: boolean
}

const inputClass = 'w-full border border-noir-200 bg-white px-3 py-2.5 text-sm text-noir-900 outline-none transition-all focus:border-gold-400 focus:ring-1 focus:ring-gold-400/20'
const labelClass = 'block text-xs font-semibold uppercase tracking-wider text-noir-500 mb-1.5'
const errorClass = 'mt-1 text-xs text-red-600'

export function VehicleForm({ defaultValues, onSubmit, submitLabel, loading }: Props) {
  const { register, handleSubmit, control, formState: { errors } } = useForm<VehicleFormValues>({
    defaultValues: {
      status: 'available',
      fuelType: 'diesel',
      transmission: 'automatic',
      extras: [],
      ...defaultValues,
    },
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'extras' })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Make / Model / Year */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className={labelClass}>Marque</label>
          <input {...register('make', { required: 'Requis' })} className={inputClass} placeholder="Toyota" />
          {errors.make && <p className={errorClass}>{errors.make.message}</p>}
        </div>
        <div>
          <label className={labelClass}>Modèle</label>
          <input {...register('model', { required: 'Requis' })} className={inputClass} placeholder="Land Cruiser 300" />
          {errors.model && <p className={errorClass}>{errors.model.message}</p>}
        </div>
        <div>
          <label className={labelClass}>Année</label>
          <input
            type="number"
            {...register('year', { required: 'Requis', valueAsNumber: true, min: { value: 1900, message: 'Invalide' }, max: { value: new Date().getFullYear() + 1, message: 'Invalide' } })}
            className={inputClass}
            placeholder="2024"
          />
          {errors.year && <p className={errorClass}>{errors.year.message}</p>}
        </div>
      </div>

      {/* Mileage / Price */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Kilométrage (km)</label>
          <input
            type="number"
            {...register('mileage', { required: 'Requis', valueAsNumber: true, min: { value: 0, message: 'Invalide' } })}
            className={inputClass}
            placeholder="0"
          />
          {errors.mileage && <p className={errorClass}>{errors.mileage.message}</p>}
        </div>
        <div>
          <label className={labelClass}>Prix (F CFA)</label>
          <input
            type="number"
            {...register('price', { required: 'Requis', valueAsNumber: true, min: { value: 0, message: 'Invalide' } })}
            className={inputClass}
            placeholder="45000000"
          />
          {errors.price && <p className={errorClass}>{errors.price.message}</p>}
        </div>
      </div>

      {/* Status / Fuel / Transmission */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className={labelClass}>Statut</label>
          <select {...register('status')} className={inputClass}>
            <option value="available">Disponible</option>
            <option value="reserved">Réservé</option>
            <option value="sold">Vendu</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Carburant</label>
          <select {...register('fuelType')} className={inputClass}>
            <option value="diesel">Diesel</option>
            <option value="gasoline">Essence</option>
            <option value="hybrid">Hybride</option>
            <option value="electric">Électrique</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Transmission</label>
          <select {...register('transmission')} className={inputClass}>
            <option value="automatic">Automatique</option>
            <option value="manual">Manuelle</option>
            <option value="cvt">CVT</option>
          </select>
        </div>
      </div>

      {/* Color / VIN */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Couleur</label>
          <input {...register('color', { required: 'Requis' })} className={inputClass} placeholder="Blanc Perle" />
          {errors.color && <p className={errorClass}>{errors.color.message}</p>}
        </div>
        <div>
          <label className={labelClass}>VIN (optionnel)</label>
          <input {...register('vin')} className={inputClass} placeholder="JTMAB3FV5RD123456" maxLength={17} />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className={labelClass}>Description (optionnel)</label>
        <textarea
          {...register('description')}
          rows={3}
          className={cn(inputClass, 'resize-none')}
          placeholder="Full options, cuir, toit ouvrant..."
        />
      </div>

      {/* Extras — custom key/value features */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className={cn(labelClass, 'mb-0')}>Caractéristiques supplémentaires</label>
          <button
            type="button"
            onClick={() => append({ key: '', value: '' })}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-gold-600 hover:text-gold-700 transition-colors"
          >
            <Add01Icon className="h-3.5 w-3.5" />
            Ajouter
          </button>
        </div>
        <p className="mb-3 text-xs text-noir-400">Ex. : Toit ouvrant → Panoramique, Sièges → Cuir massant</p>
        {fields.length === 0 && (
          <p className="text-xs text-noir-400 italic py-2">Aucune caractéristique supplémentaire.</p>
        )}
        <div className="space-y-2">
          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-2">
              <input
                {...register(`extras.${index}.key`, { required: true })}
                className={cn(inputClass, 'flex-1')}
                placeholder="Caractéristique"
              />
              <input
                {...register(`extras.${index}.value`, { required: true })}
                className={cn(inputClass, 'flex-1')}
                placeholder="Valeur"
              />
              <button
                type="button"
                onClick={() => remove(index)}
                className="flex-shrink-0 p-2.5 text-red-400 hover:text-red-600 hover:bg-red-50 border border-noir-200 transition-colors"
              >
                <Delete01Icon className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-noir-950 px-4 py-3 text-sm font-semibold text-white hover:bg-noir-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? 'Enregistrement...' : submitLabel}
      </button>
    </form>
  )
}
