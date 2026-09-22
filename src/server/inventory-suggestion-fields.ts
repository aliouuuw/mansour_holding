/** Shared field keys for inventory combobox suggestions (not a server module). */
export const INVENTORY_SUGGESTION_FIELDS = [
  'make',
  'model',
  'year',
  'mileage',
  'price',
  'vin',
  'arrivedAt',
] as const

export type InventorySuggestionField = (typeof INVENTORY_SUGGESTION_FIELDS)[number]
