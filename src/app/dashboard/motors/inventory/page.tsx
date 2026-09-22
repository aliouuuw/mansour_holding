'use client'

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Search01Icon, Add01Icon, Download01Icon } from 'hugeicons-react'
import { downloadCsv } from '@/lib/csv'
import { useToast } from '@/components/ui/Toast'
import { formatDate } from '@/lib/utils'
import {
  DashBreadcrumbs,
  DashButton,
  DashPageHeader,
  dashVehicleStatusLabels,
} from '@/components/dashboard'
import { InventoryGrid } from '@/components/dashboard/inventory/InventoryGrid'
import { InventoryMobileList } from '@/components/dashboard/inventory/InventoryMobileList'
import {
  overviewApi,
  vehiclesApi,
  inventorySuggestionsApi,
  type VehicleSortDir,
  type VehicleSortField,
  type VehicleStatus,
  type ApiVehicle,
} from '@/lib/api'
import { VehicleImagesModal } from '@/components/dashboard/inventory/VehicleImagesModal'
import type { InventorySuggestionField } from '@/components/dashboard/inventory/useInventoryPatch'

const statusLabels = dashVehicleStatusLabels

function parseStatus(raw: string | null): VehicleStatus | 'all' {
  if (raw === 'available' || raw === 'reserved' || raw === 'sold') return raw
  return 'all'
}

const SORT_FIELDS: VehicleSortField[] = ['make', 'year', 'mileage', 'price', 'arrivedAt']

function parseSortBy(raw: string | null): VehicleSortField {
  if (raw && SORT_FIELDS.includes(raw as VehicleSortField)) return raw as VehicleSortField
  return 'arrivedAt'
}

function parseSortDir(raw: string | null): VehicleSortDir {
  return raw === 'asc' ? 'asc' : 'desc'
}

export function MotorsInventory() {
  const toast = useToast()
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const queryQ = searchParams.get('q') ?? ''
  const statusFilter = parseStatus(searchParams.get('status'))
  const page = Math.max(1, Number.parseInt(searchParams.get('page') ?? '1', 10) || 1)
  const sortBy = parseSortBy(searchParams.get('sort'))
  const sortDir = parseSortDir(searchParams.get('dir'))

  const [searchInput, setSearchInput] = useState(queryQ)
  const [mediaVehicle, setMediaVehicle] = useState<ApiVehicle | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setSearchInput(queryQ)
  }, [queryQ])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const el = e.target
      const tag = el instanceof HTMLElement ? el.tagName : ''
      const editable =
        el instanceof HTMLElement &&
        (el.isContentEditable || tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT')

      if (e.key === '/' && !editable && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault()
        searchInputRef.current?.focus()
        return
      }
      if (e.key === 'Escape' && document.activeElement === searchInputRef.current) {
        searchInputRef.current?.blur()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const patchParams = useCallback(
    (patch: Record<string, string | null>) => {
      const next = new URLSearchParams(searchParams.toString())
      for (const [key, value] of Object.entries(patch)) {
        if (value === null || value === '') next.delete(key)
        else next.set(key, value)
      }
      const qs = next.toString()
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
    },
    [pathname, router, searchParams]
  )

  const toggleSort = (field: VehicleSortField) => {
    if (sortBy === field) {
      patchParams({ dir: sortDir === 'asc' ? 'desc' : 'asc', page: null })
      return
    }
    patchParams({
      sort: field === 'arrivedAt' ? null : field,
      dir: field === 'make' ? 'asc' : 'desc',
      page: null,
    })
  }

  const handleSearch = (val: string) => {
    setSearchInput(val)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      patchParams({ q: val.trim() || null, page: null })
    }, 300)
  }

  const vehiclesQueryKey = useMemo(
    () => ['vehicles', page, statusFilter, queryQ, sortBy, sortDir],
    [page, statusFilter, queryQ, sortBy, sortDir]
  )

  const { data: suggestionMap } = useQuery({
    queryKey: ['inventory-suggestions'],
    queryFn: inventorySuggestionsApi.list,
    staleTime: 120_000,
  })

  const emptySuggestions: Record<InventorySuggestionField, string[]> = {
    make: [],
    model: [],
    year: [],
    mileage: [],
    price: [],
    vin: [],
    arrivedAt: [],
  }

  const { data: overview } = useQuery({
    queryKey: ['overview', 'motors'],
    queryFn: overviewApi.motors,
    staleTime: 60_000,
  })

  const { data, isLoading, error } = useQuery({
    queryKey: vehiclesQueryKey,
    queryFn: () => vehiclesApi.list({
      page, limit: 20,
      sortBy,
      sortDir,
      ...(statusFilter !== 'all' ? { status: statusFilter } : {}),
      ...(queryQ ? { search: queryQ } : {}),
    }),
    placeholderData: (prev) => prev,
  })

  const vehicles = data?.data ?? []
  const pagination = data?.pagination ?? { total: 0, pages: 1 }
  const mediaVehicleLive =
    mediaVehicle ? vehicles.find((v) => v.id === mediaVehicle.id) ?? mediaVehicle : null

  const totalStock = overview?.vehicleTotal ?? pagination.total
  const availableStock = overview?.availableCount ?? 0
  const lead =
    statusFilter !== 'all' || queryQ
      ? `${pagination.total} résultat${pagination.total === 1 ? '' : 's'} · ${availableStock} disponibles · édition en ligne`
      : `${totalStock} véhicules · ${availableStock} disponibles · édition en ligne`

  const hasFilters = statusFilter !== 'all' || queryQ.length > 0

  const exportMutation = useMutation({
    mutationFn: () =>
      vehiclesApi.list({
        page: 1,
        limit: 500,
        sortBy,
        sortDir,
        ...(statusFilter !== 'all' ? { status: statusFilter } : {}),
        ...(queryQ ? { search: queryQ } : {}),
      }),
    onSuccess: (res) => {
      const statusExport: Record<string, string> = {
        available: 'Disponible',
        reserved: 'Réservé',
        sold: 'Vendu',
      }
      downloadCsv(
        `inventaire-${new Date().toISOString().slice(0, 10)}.csv`,
        ['Marque', 'Modèle', 'Année', 'Kilométrage', 'Prix', 'Statut', 'VIN', 'Arrivée showroom'],
        res.data.map((v) => [
          v.make,
          v.model,
          v.year,
          v.mileage,
          v.price ?? '',
          statusExport[v.status] ?? v.status,
          v.vin ?? '',
          formatDate(v.arrivedAt),
        ])
      )
      toast(`${res.data.length} véhicules exportés`)
    },
    onError: (e) => toast((e as Error).message, 'error'),
  })

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-6">
      <DashBreadcrumbs
        items={[
          { label: 'Mansour Motors', to: '/dashboard/motors' },
          { label: 'Inventaire' },
        ]}
      />
      <DashPageHeader
        title="Inventaire"
        lead={lead}
        actions={
          <>
            <DashButton
              type="button"
              variant="soft"
              disabled={exportMutation.isPending || pagination.total === 0}
              onClick={() => exportMutation.mutate()}
            >
              <Download01Icon className="h-4 w-4" aria-hidden="true" />
              {exportMutation.isPending ? 'Export…' : 'Exporter CSV'}
            </DashButton>
            <DashButton to="/dashboard/motors/inventory/new">
              <Add01Icon className="h-4 w-4" aria-hidden="true" /> Ajouter un véhicule
            </DashButton>
          </>
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="mm-search flex-1 sm:max-w-md">
          <Search01Icon className="mm-search-icon h-4 w-4" aria-hidden="true" />
          <input
            ref={searchInputRef}
            type="search"
            placeholder="Rechercher par marque ou modèle…"
            value={searchInput}
            onChange={(e) => handleSearch(e.target.value)}
            className="mm-input mm-input--search text-sm"
            aria-keyshortcuts="/"
          />
          <span className="mm-search-kbd hidden sm:inline" aria-hidden="true">/</span>
        </div>
        <div className="mm-seg-scroll w-full sm:w-auto">
          <div className="mm-seg" role="group" aria-label="Filtrer par statut">
            {(['all', 'available', 'reserved', 'sold'] as const).map((s) => (
              <button
                key={s}
                type="button"
                aria-pressed={statusFilter === s}
                onClick={() => patchParams({ status: s === 'all' ? null : s, page: null })}
              >
                {s === 'all' ? 'Tous' : statusLabels[s]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mm-panel mm-panel--grid">
        {error && <div className="mm-alert-error border-b">{(error as Error).message}</div>}

        {!isLoading && vehicles.length === 0 ? (
          <div className="mm-empty-cta mm-panel-pad">
            <p>
              {hasFilters
                ? 'Aucun véhicule ne correspond à vos critères.'
                : 'Aucun véhicule en stock pour le moment.'}
            </p>
            {hasFilters ? (
              <DashButton
                type="button"
                variant="soft"
                onClick={() => {
                  setSearchInput('')
                  patchParams({ q: null, status: null, page: null })
                }}
              >
                Réinitialiser les filtres
              </DashButton>
            ) : (
              <DashButton to="/dashboard/motors/inventory/new">
                <Add01Icon className="h-4 w-4" aria-hidden="true" /> Ajouter un véhicule
              </DashButton>
            )}
          </div>
        ) : (
          <>
            <div className="mm-inventory-mobile-only">
              <InventoryMobileList vehicles={vehicles} vehiclesQueryKey={vehiclesQueryKey} />
            </div>
            <InventoryGrid
              vehicles={vehicles}
              vehiclesQueryKey={vehiclesQueryKey}
              suggestionMap={suggestionMap ?? emptySuggestions}
              sortBy={sortBy}
              sortDir={sortDir}
              onSort={toggleSort}
              onOpenMedia={setMediaVehicle}
              isLoading={isLoading}
            />
          </>
        )}

        {pagination.pages > 1 && (
          <div className="mm-table-foot">
            <p>Page {page} sur {pagination.pages} · {pagination.total} résultats</p>
            <div className="flex gap-2">
              <DashButton
                type="button"
                variant="soft"
                className="!min-h-0 !py-1.5 !text-xs"
                disabled={page === 1}
                onClick={() => patchParams({ page: page <= 2 ? null : String(page - 1) })}
              >
                Précédent
              </DashButton>
              <DashButton
                type="button"
                variant="soft"
                className="!min-h-0 !py-1.5 !text-xs"
                disabled={page === pagination.pages}
                onClick={() => patchParams({ page: String(page + 1) })}
              >
                Suivant
              </DashButton>
            </div>
          </div>
        )}
      </div>

      <VehicleImagesModal
        vehicle={mediaVehicleLive}
        vehiclesQueryKey={vehiclesQueryKey}
        onClose={() => setMediaVehicle(null)}
      />
    </motion.div>
  )
}

function InventoryPageFallback() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="mm-spinner" role="status" aria-label="Chargement" />
    </div>
  )
}

export default function MotorsInventoryPage() {
  return (
    <Suspense fallback={<InventoryPageFallback />}>
      <MotorsInventory />
    </Suspense>
  )
}
