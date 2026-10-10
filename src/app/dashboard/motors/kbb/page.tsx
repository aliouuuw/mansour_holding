'use client'

import { useState, type ReactNode } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ArrowDown01Icon, ArrowUpRight01Icon, Copy01Icon, RefreshIcon } from 'hugeicons-react'
import { DashButton, DashPageHeader, mmInputClass, mmLabelClass } from '@/components/dashboard'
import { useToast } from '@/components/ui/Toast'
import { cn, formatNumber, formatPrice } from '@/lib/utils'
import {
  DD_RATE,
  KBB_URL,
  KBB_ZIP,
  REMISE_RATE,
  USD_TO_FCFA,
  buildKbbLink,
  computeKbbDuties,
  isSuvBodyClass,
  kbbMileage,
  kbbModelKey,
} from '@/lib/kbb'
import { getKbbLink, saveKbbLink } from '@/server/kbb-links'
import { decodeVin, type DecodedVin } from '@/server/vin-decode'

const VIN_LENGTH = 17
const percent = (rate: number) => `${formatNumber(Math.round(rate * 10000) / 100)} %`
const usd = (n: number) => `${formatNumber(n)} $`

// NHTSA returns "MERCEDES-BENZ"; keep short acronyms (BMW, GMC, KIA) as they are.
const brandCase = (s: string) =>
  s.length <= 3 ? s : s.toLowerCase().replace(/(^|[\s-])\p{L}/gu, (m) => m.toUpperCase())

/** Exact English label shown on kbb.com. */
function Ui({ children }: { children: ReactNode }) {
  return <span lang="en" className="mm-kbb-ui">{children}</span>
}

function useCopy() {
  const toast = useToast()
  return (value: string, what: string) => {
    navigator.clipboard.writeText(value).then(
      () => toast(`${what} copié`),
      () => toast('Copie impossible. Sélectionnez le texte à la main.', 'error'),
    )
  }
}

function CopyButton({ value, what }: { value: string; what: string }) {
  const copy = useCopy()
  return (
    <button type="button" className="mm-icon-btn" onClick={() => copy(value, what)} aria-label={`Copier ${what.toLowerCase()}`}>
      <Copy01Icon className="h-4 w-4" aria-hidden="true" />
    </button>
  )
}

function More({ label, className, children }: { label: string; className?: string; children: ReactNode }) {
  return (
    <details className={cn('mm-kbb-more', className)}>
      <summary>
        {label} <ArrowDown01Icon className="h-4 w-4" aria-hidden="true" />
      </summary>
      {children}
    </details>
  )
}

export function MotorsKbb() {
  const copy = useCopy()
  const toast = useToast()
  const qc = useQueryClient()
  const [vin, setVin] = useState('')
  const [car, setCar] = useState<DecodedVin | null>(null)
  const [vinError, setVinError] = useState<string | null>(null)
  const [year, setYear] = useState('')
  const [isSuv, setIsSuv] = useState<boolean | null>(null)
  const [cv, setCv] = useState('')
  const [linkDraft, setLinkDraft] = useState('')
  const [editingLink, setEditingLink] = useState(false)

  const decode = useMutation({
    mutationFn: decodeVin,
    onSuccess: (res) => {
      if (!res.ok) {
        setCar(null)
        setVinError(res.error)
        return
      }
      setVinError(null)
      setCar(res.car)
      if (res.car.year) setYear(String(res.car.year))
      setIsSuv(isSuvBodyClass(res.car.bodyClass))
    },
    onError: () => setVinError('Service de décodage indisponible. Réessayez.'),
  })

  const onVinChange = (raw: string) => {
    const next = raw.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, VIN_LENGTH)
    setVin(next)
    setVinError(null)
    // Decode on the 17th character: the operator usually pastes the full VIN.
    if (next.length === VIN_LENGTH && next !== car?.vin) decode.mutate(next)
  }

  const reset = () => {
    setVin('')
    setCar(null)
    setVinError(null)
    setYear('')
    setIsSuv(null)
    setCv('')
    setLinkDraft('')
    setEditingLink(false)
    decode.reset()
  }

  const modelYear = year.length === 4 ? Number(year) : null
  const mileage = modelYear ? kbbMileage(modelYear) : null
  const cvUsd = Number(cv) || 0
  const result = cvUsd > 0 && isSuv != null ? computeKbbDuties(cvUsd, isSuv) : null
  const carName = car ? `${car.year ?? ''} ${brandCase(car.make)} ${car.model}`.trim() : null
  const carVersion = car ? car.trim || [car.drive, car.engine].filter(Boolean).join(' · ') : ''
  const dirty = Boolean(vin || year || cv || isSuv != null)

  const modelKey = car ? kbbModelKey(car) : ''
  const savedLink = useQuery({
    queryKey: ['kbb-link', modelKey],
    queryFn: () => getKbbLink(modelKey),
    enabled: Boolean(modelKey),
    retry: false, // a failed lookup only means « no saved link »: show the paste field
  })
  const saveLink = useMutation({
    mutationFn: (raw: string) => saveKbbLink(modelKey, raw),
    onSuccess: (res) => {
      if (!res.ok) return
      qc.setQueryData(['kbb-link', modelKey], res.url)
      setLinkDraft('')
      setEditingLink(false)
      toast('Lien KBB enregistré pour ce modèle')
    },
  })
  const saveError = saveLink.data && !saveLink.data.ok
    ? saveLink.data.error
    : saveLink.isError ? 'Enregistrement impossible. Réessayez.' : null
  const linkFor = car && savedLink.data ? savedLink.data : null
  const kbbHref = linkFor && car ? buildKbbLink(linkFor, { vin: car.vin, mileage }) : KBB_URL

  const summary = result
    ? [
        carName ?? 'Véhicule',
        vin && `VIN : ${vin}`,
        `Valeur KBB (Private Party) : ${usd(cvUsd)}`,
        `DD (droits de douane) : ${formatPrice(result.dd)}`,
        `Remise : ${formatPrice(result.remise)}`,
      ].filter(Boolean).join('\n')
    : ''

  const kbbValues = [
    { label: 'Mileage', what: 'Kilométrage', value: mileage != null ? String(mileage) : null, display: mileage != null ? formatNumber(mileage) : null },
    { label: 'ZIP code', what: 'Code postal', value: KBB_ZIP, display: KBB_ZIP },
  ]

  return (
    <div className="space-y-6">
      <DashPageHeader
        title="Estimation KBB"
        lead="Véhicules US et Canada : valeur KBB, droits de douane et remise."
        actions={
          <DashButton variant="soft" onClick={reset} disabled={!dirty}>
            <RefreshIcon className="h-4 w-4" aria-hidden="true" /> Nouvelle estimation
          </DashButton>
        }
      />

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <div className="mm-panel divide-y divide-[var(--mm-line)]">
          <div className="mm-panel-pad space-y-5">
            <div>
              <div className="flex items-baseline justify-between gap-3">
                <label htmlFor="kbb-vin" className={mmLabelClass}>Numéro VIN</label>
                {vin.length > 0 && vin.length < VIN_LENGTH ? (
                  <span className="mm-muted text-xs tabular-nums" aria-hidden="true">{vin.length} / {VIN_LENGTH}</span>
                ) : null}
              </div>
              <div className="flex items-end gap-3">
                <input
                  id="kbb-vin"
                  className={cn(mmInputClass, 'font-mono tracking-[0.08em] placeholder:font-sans placeholder:tracking-normal')}
                  value={vin}
                  onChange={(e) => onVinChange(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && vin.length === VIN_LENGTH) decode.mutate(vin) }}
                  placeholder="Collez les 17 caractères"
                  autoComplete="off"
                  spellCheck={false}
                  aria-describedby="kbb-vin-status"
                  aria-invalid={vinError ? true : undefined}
                />
                {vinError && vin.length === VIN_LENGTH && !decode.isPending ? (
                  <DashButton variant="soft" onClick={() => decode.mutate(vin)}>Réessayer</DashButton>
                ) : null}
              </div>
              <p id="kbb-vin-status" className="mt-2 min-h-5 text-sm" aria-live="polite">
                {decode.isPending ? (
                  <span className="mm-muted">Recherche du véhicule…</span>
                ) : vinError ? (
                  <span className="text-[var(--mm-stop)]">{vinError}</span>
                ) : car ? (
                  <>
                    <strong className="font-medium">{carName}</strong>
                    {carVersion ? <span className="mm-muted"> · {carVersion}</span> : null}
                  </>
                ) : null}
              </p>
            </div>

            <div className="flex flex-wrap items-start gap-x-8 gap-y-5">
              <div className="w-32">
                <label htmlFor="kbb-year" className={mmLabelClass}>Année</label>
                <input
                  id="kbb-year"
                  className={cn(mmInputClass, 'tabular-nums')}
                  inputMode="numeric"
                  placeholder="2024"
                  value={year}
                  onChange={(e) => setYear(e.target.value.replace(/\D/g, '').slice(0, 4))}
                />
              </div>
              <fieldset>
                <legend className={mmLabelClass}>Catégorie</legend>
                <div className="mm-seg" role="group">
                  <button type="button" aria-pressed={isSuv === true} onClick={() => setIsSuv(true)}>SUV</button>
                  <button type="button" aria-pressed={isSuv === false} onClick={() => setIsSuv(false)}>Autre</button>
                </div>
              </fieldset>
            </div>
          </div>

          <div className="mm-panel-pad">
            <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
              <dl className="flex flex-wrap gap-x-10 gap-y-4">
                {kbbValues.map((v) => (
                  <div key={v.label}>
                    <dt className={mmLabelClass} lang="en">{v.label}</dt>
                    <dd className="flex min-h-[var(--mm-touch)] items-center gap-1">
                      {v.value ? (
                        <>
                          <span className="text-lg tabular-nums">{v.display}</span>
                          <CopyButton value={v.value} what={v.what} />
                        </>
                      ) : (
                        <span className="text-lg text-[var(--mm-grey-muted)]">—</span>
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
              <DashButton href={kbbHref} target="_blank" rel="noreferrer" variant="soft" className="shrink-0 whitespace-nowrap">
                {linkFor ? 'Ouvrir les valeurs KBB' : 'Ouvrir KBB'} <ArrowUpRight01Icon className="h-4 w-4" aria-hidden="true" />
              </DashButton>
            </div>

            {car && linkFor && !editingLink ? (
              <p className="mm-muted mt-3 text-sm">
                Lien enregistré pour ce modèle.{' '}
                {car.trim ? null : 'Le VIN ne donne pas la finition : vérifiez-la sur KBB. '}
                Sur KBB, cliquer <Ui>Private Party</Ui>.{' '}
                <button type="button" className="mm-link" onClick={() => setEditingLink(true)}>Remplacer le lien</button>
              </p>
            ) : car && !savedLink.isPending ? (
              <form
                className="mt-4"
                onSubmit={(e) => {
                  e.preventDefault()
                  saveLink.mutate(linkDraft)
                }}
              >
                <label htmlFor="kbb-link" className={mmLabelClass}>Adresse de la page des valeurs KBB</label>
                <div className="flex items-end gap-3">
                  <input
                    id="kbb-link"
                    className={mmInputClass}
                    value={linkDraft}
                    onChange={(e) => {
                      setLinkDraft(e.target.value)
                      saveLink.reset()
                    }}
                    placeholder="https://www.kbb.com/…/car-offers/?vehicleid=…"
                    inputMode="url"
                    autoComplete="off"
                    spellCheck={false}
                    aria-describedby="kbb-link-help"
                    aria-invalid={saveError ? true : undefined}
                  />
                  <DashButton type="submit" variant="soft" disabled={!linkDraft.trim() || saveLink.isPending}>
                    {saveLink.isPending ? 'Enregistrement…' : 'Enregistrer'}
                  </DashButton>
                  {editingLink ? (
                    <button type="button" className="mm-link shrink-0 pb-3 text-sm" onClick={() => setEditingLink(false)}>Annuler</button>
                  ) : null}
                </div>
                <p id="kbb-link-help" className="mt-2 text-sm" aria-live="polite">
                  {saveError ? (
                    <span className="text-[var(--mm-stop)]">{saveError}</span>
                  ) : (
                    <span className="mm-muted">Premier {carName} : aucun lien enregistré. Après le passage sur KBB, collez ici l’adresse de la page des valeurs. Les prochains l’ouvriront directement.</span>
                  )}
                </p>
              </form>
            ) : null}
            <More label="Étapes sur KBB">
              <ol className="mm-kbb-guide">
                <li>Cliquer sur <Ui>My Car’s Value</Ui>, coller le VIN, puis <Ui>Go</Ui>.</li>
                <li>Saisir <Ui>Mileage</Ui> et <Ui>ZIP code</Ui>.</li>
                <li><Ui>Color</Ui> <Ui>Black</Ui> · <Ui>2 keys</Ui> <Ui>No</Ui> · <Ui>Modifications</Ui> <Ui>No</Ui> · <Ui>Just curious about my value</Ui></li>
                <li><Ui>No</Ui>, puis <Ui>Continue to Get your Values</Ui>.</li>
                <li><Ui>Next</Ui>, choisir <Ui>Good</Ui>, puis <Ui>Next</Ui>.</li>
                <li><Ui>Not now, maybe later</Ui>.</li>
                <li>Onglet <Ui>Private Party</Ui> : reporter la valeur ci-dessous.</li>
                <li>Première fois pour ce modèle : copier l’adresse de la page et l’enregistrer ci-dessus.</li>
              </ol>
            </More>
          </div>

          <div className="mm-panel-pad">
            <label htmlFor="kbb-cv" className={mmLabelClass}>Valeur <span lang="en">Private Party</span></label>
            <div className="flex max-w-xs items-end gap-2">
              <input
                id="kbb-cv"
                className={cn(mmInputClass, 'text-lg tabular-nums')}
                inputMode="numeric"
                placeholder="44 790"
                value={cv ? formatNumber(Number(cv)) : ''}
                onChange={(e) => setCv(e.target.value.replace(/\D/g, '').slice(0, 7))}
                aria-describedby="kbb-cv-unit"
              />
              <span id="kbb-cv-unit" className="shrink-0 whitespace-nowrap pb-3 text-sm">$ US</span>
            </div>
            {cvUsd > 0 && isSuv == null ? (
              <p className="mt-2 text-sm text-[var(--mm-warn)]">Choisissez la catégorie.</p>
            ) : null}
          </div>
        </div>

        <section className="mm-panel mm-panel-pad space-y-5 xl:sticky xl:top-6" aria-label="Résultat">
          <dl className="grid gap-5">
            {[
              { term: 'DD', detail: 'Droits de douane', value: result?.dd },
              { term: 'Remise', detail: null, value: result?.remise },
            ].map((f) => (
              <div key={f.term} className="flex items-end justify-between gap-3">
                <div>
                  <dt className="text-sm">
                    <span className="font-medium">{f.term}</span>
                    {f.detail ? <span className="mm-muted"> · {f.detail}</span> : null}
                  </dt>
                  <dd className="mm-kbb-figure" data-empty={f.value == null || undefined}>
                    {f.value != null ? formatPrice(f.value) : '— F CFA'}
                  </dd>
                </div>
                {f.value != null ? <CopyButton value={String(f.value)} what={f.term} /> : null}
              </div>
            ))}
          </dl>

          {result ? (
            <div className="flex items-start justify-between gap-x-4 border-t border-[var(--mm-line)] pt-2">
              <More label="Détail du calcul" className="min-w-0 flex-1">
                <dl className="mm-kbb-calc">
                  <dt>Valeur KBB</dt><dd>{usd(cvUsd)}</dd>
                  <dt>× {USD_TO_FCFA}</dt><dd>{formatPrice(result.valueFcfa)}</dd>
                  <dt>+ frais {isSuv ? 'SUV' : 'autre'}</dt><dd>{formatPrice(result.fees)}</dd>
                  <dt>= base</dt><dd>{formatPrice(result.base)}</dd>
                  <dt>× {percent(DD_RATE)}</dt><dd className="font-medium">{formatPrice(result.dd)}</dd>
                  <dt>− {percent(REMISE_RATE)}</dt><dd className="font-medium">{formatPrice(result.remise)}</dd>
                </dl>
              </More>
              <button type="button" className="mm-link self-start text-sm leading-[var(--mm-touch)]" onClick={() => copy(summary, 'Résumé')}>
                Copier le résumé
              </button>
            </div>
          ) : null}
        </section>
      </div>
    </div>
  )
}

export default MotorsKbb
