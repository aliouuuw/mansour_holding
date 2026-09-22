'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useRouter } from 'next/navigation'
import type { ApiVehicle } from '@/lib/api'
import { AtelierSwipeHint, Button, Card, Shell } from '../_ui'
import { toCar } from '../_ui/car'
import { IconFilters, IconGrid, IconList, IconSwipe } from '../_ui/icons'
import { BUDGETS, FUEL, RANGES, cover, focal, isCutout, rangeOf, vehicleUrl } from '../_ui/shared'

const KMS = [1000, 5000, 10000, 20000]

/* the markup and every card are rendered once; _ui/stock.js filters, sorts and animates them */
export function PublicVehicles({ vehicles }: { vehicles: ApiVehicle[] }) {
  const ref = useRef<HTMLElement>(null)
  const router = useRouter()
  const cars = useMemo(() => vehicles.map(toCar), [vehicles])
  const makes = useMemo(() => [...new Set(vehicles.map((v) => v.make))].sort((a, b) => a.localeCompare(b, 'fr')), [vehicles])
  const makeCounts = useMemo(() => Object.fromEntries(makes.map((make) => [make, vehicles.filter((vehicle) => vehicle.make === make).length])), [makes, vehicles])
  const models = useMemo(() => Object.fromEntries(makes.map((m) => [m, [...new Set(vehicles.filter((v) => v.make === m).map((v) => v.model))]])), [makes, vehicles])
  const fuels = useMemo(() => [...new Set(vehicles.map((v) => v.fuelType))], [vehicles])
  const firstDetailHref = vehicles[0] ? vehicleUrl(vehicles[0]) : '/mansour-motors/vehicules'
  const firstVehicle = vehicles[0]
  const firstAtelierImg = firstVehicle ? cover(firstVehicle) : ''

  useEffect(() => {
    let destroy: (() => void) | undefined
    let dead = false
    import('../_ui/stock.js').then(({ mountStock }) => {
      if (dead || !ref.current) return
      destroy = mountStock(ref.current, cars, { models, navigate: (href: string) => router.push(href) })
    })
    return () => { dead = true; destroy?.() }
  }, [cars, models, router])

  return (
    <Shell>
      <main ref={ref}>
        <header className="page-head">
          <div className="wrap">
            <h1 className="display">Véhicules</h1>
            <p className="catalog-intro">Stock au showroom de Dakar.</p>
          </div>
        </header>

        <div className="filterbar">
          <div className="wrap catalog-tools">
            <div className="catalog-toolbar">
              <p className="catalog-count catalog-count--toolbar" aria-live="polite">
                <span data-live /> <span data-active-label />
              </p>
              <div className="viewbar-tools">
                <p className="catalog-count catalog-count--mobile" aria-live="polite">
                  <span data-live /> <span data-active-label />
                </p>
                <div className="seg" role="group" aria-label="Affichage" data-view>
                  <button type="button" data-mode="grid" aria-pressed="true" aria-label="Grille">
                    <IconGrid size={18} />
                    <span className="toolbar-label">Grille</span>
                  </button>
                  <button type="button" data-mode="list" aria-pressed="false" aria-label="Liste">
                    <IconList size={18} />
                    <span className="toolbar-label">Liste</span>
                  </button>
                  <button type="button" data-mode="atelier" aria-pressed="false" aria-label="Atelier">
                    <IconSwipe size={18} />
                    <span className="toolbar-label">Atelier</span>
                  </button>
                </div>
                <details className="filters" data-filters>
                  <summary aria-label="Filtres">
                    <IconFilters size={18} />
                    <span className="toolbar-label">Filtres</span>
                    <span className="filter-summary-count" data-active-count />
                  </summary>
                  <div className="filter-sheet" role="dialog" aria-label="Filtres">
                    <div className="sheet-head">
                      <div>
                        <p className="sheet-title">Filtres</p>
                        <p className="sheet-sub"><span data-live /></p>
                      </div>
                      <button type="button" data-sheet-close aria-label="Fermer">Fermer</button>
                    </div>
                    <form className="sheet-form" data-filter-form>
                      <fieldset className="sheet-row">
                        <legend>Tri</legend>
                        <div className="sheet-chips">
                          {([
                            ['', 'Arrivée récente'],
                            ['price-asc', 'Prix croissant'],
                            ['price-desc', 'Prix décroissant'],
                            ['km-asc', 'Kilométrage'],
                            ['year-desc', 'Année'],
                          ] as const).map(([value, label]) => (
                            <button key={label} type="button" data-set="tri" data-value={value} aria-pressed={value === ''}>{label}</button>
                          ))}
                        </div>
                        <select className="vh" aria-label="Trier par" data-sort defaultValue="">
                          <option value="">Arrivée récente</option>
                          <option value="price-asc">Prix croissant</option>
                          <option value="price-desc">Prix décroissant</option>
                          <option value="km-asc">Kilométrage croissant</option>
                          <option value="year-desc">Année, plus récente</option>
                        </select>
                      </fieldset>
                      <fieldset className="sheet-row">
                        <legend>Gamme</legend>
                        <div className="sheet-chips" role="group" aria-label="Gamme">
                          <button type="button" data-set="gamme" data-value="" aria-pressed="true">Toutes</button>
                          {RANGES.filter((r) => vehicles.some((v) => rangeOf(v) === r.id)).map((r) => (
                            <button key={r.id} type="button" data-set="gamme" data-value={r.id} aria-pressed="false">{r.label}</button>
                          ))}
                        </div>
                      </fieldset>
                      <fieldset className="sheet-row">
                        <legend>Marque</legend>
                        <div className="sheet-chips">
                          <button type="button" data-set="marque" data-value="" aria-pressed="true">Toutes</button>
                          {makes.map((m) => (
                            <button key={m} type="button" data-set="marque" data-value={m} aria-pressed="false">{m}</button>
                          ))}
                        </div>
                        <select className="vh" name="marque" aria-label="Marque" data-make defaultValue="">
                          <option value="">Toutes marques</option>
                          {makes.map((m) => <option key={m} data-count={makeCounts[m]}>{m}</option>)}
                        </select>
                      </fieldset>
                      <fieldset className="sheet-row" data-model-row hidden>
                        <legend>Modèle</legend>
                        <div className="sheet-chips" data-model-chips />
                        <select className="vh" name="modele" aria-label="Modèle" data-model disabled><option value="">Modèle</option></select>
                      </fieldset>
                      <fieldset className="sheet-row">
                        <legend>Budget maximum</legend>
                        <div className="sheet-chips">
                          <button type="button" data-set="budget" data-value="" aria-pressed="true">Tous</button>
                          {BUDGETS.map((b) => (
                            <button key={b} type="button" data-set="budget" data-value={String(b * 1_000_000)} aria-pressed="false">{b} M</button>
                          ))}
                        </div>
                        <select className="vh" name="budget" aria-label="Budget maximum" data-max defaultValue="">
                          <option value="">Tous budgets</option>
                          {BUDGETS.map((b) => <option key={b} value={b * 1_000_000}>{b} M FCFA max.</option>)}
                        </select>
                      </fieldset>
                      <fieldset className="sheet-row">
                        <legend>Kilométrage</legend>
                        <div className="sheet-chips">
                          <button type="button" data-set="km" data-value="" aria-pressed="true">Tous</button>
                          {KMS.map((k) => (
                            <button key={k} type="button" data-set="km" data-value={String(k)} aria-pressed="false">{k.toLocaleString('fr-FR').replace(/ /g, ' ')}</button>
                          ))}
                        </div>
                        <select className="vh" name="km" aria-label="Kilométrage maximum" defaultValue="">
                          <option value="">Tous kilométrages</option>
                          {KMS.map((k) => <option key={k} value={k}>{k.toLocaleString('fr-FR').replace(/ /g, ' ')} km max.</option>)}
                        </select>
                      </fieldset>
                      <fieldset className="sheet-row">
                        <legend>Énergie</legend>
                        <div className="sheet-chips" role="group" aria-label="Énergie" data-fuel>
                          {[['', 'Toutes'] as const, ...fuels.map((f) => [f, FUEL[f]] as const)].map(([v, label]) => (
                            <button key={v || 'all'} type="button" data-set="energie" data-value={v} aria-pressed={v === ''}>{label}</button>
                          ))}
                        </div>
                      </fieldset>
                      <label className="sheet-toggle switch">
                        <span>Disponibles seulement</span>
                        <input type="checkbox" name="dispo" value="1" />
                      </label>
                    </form>
                    <div className="sheet-foot">
                      <button type="button" className="sheet-clear" data-reset hidden>Effacer</button>
                      <button type="button" className="sheet-done" data-sheet-close>Voir le stock</button>
                    </div>
                  </div>
                </details>
              </div>
            </div>
          </div>
        </div>

        <section className="atelier" data-atelier hidden aria-label="Atelier">
          <p id="catalog-atelier-instructions" className="vh">
            Glissez la photo pour changer de véhicule. Touchez la photo pour ouvrir la fiche.
          </p>
          <div className="atelier-slide">
            <a
              className="atelier-hero ch-dark"
              href={firstDetailHref}
              data-atelier-hero
              aria-describedby="catalog-atelier-instructions"
            >
              <span className="crop" aria-hidden="true" />
              <div className="atelier-hero-media" data-atelier-media>
                <AtelierSwipeHint />
                {/* eslint-disable-next-line @next/next/no-img-element -- filled by stock.js */}
                <img
                  data-atelier-img
                  alt=""
                  decoding="async"
                  className={firstVehicle && isCutout(firstVehicle) ? 'is-cutout' : undefined}
                  style={firstVehicle ? ({ '--pos': focal(firstVehicle) } as React.CSSProperties) : undefined}
                  src={firstAtelierImg || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'/%3E"}
                />
              </div>
              <div className="atelier-meta">
                <div className="atelier-id">
                  <p className="count" data-atelier-count />
                  <p className="brand" data-atelier-brand />
                  <p className="atelier-name" data-atelier-name />
                  <p className="atelier-facts">
                    <span className="atelier-specs" data-atelier-specs />
                    <span data-atelier-status />
                  </p>
                </div>
                <p className="atelier-price" data-atelier-price />
              </div>
            </a>
            <div className="atelier-controls" aria-label="Navigation du diaporama">
              <button type="button" data-atelier-step="-1" aria-label="Véhicule précédent">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
              <button type="button" data-atelier-step="1" aria-label="Véhicule suivant">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>
          </div>
          <div className="atelier-rail wrap">
            <p className="atelier-kicker">Le stock</p>
            <div className="atelier-strip" data-atelier-strip />
          </div>
        </section>

        <section className="stock-stage ch-dark" aria-label="Résultats" data-stage hidden>
          <ol className="index wrap" data-index hidden />
        </section>

        <div className="wrap">
          <div className="grid" data-grid>
            {vehicles.map((v) => <Card key={v.id} v={v} eager />)}
          </div>
          <div className="empty" data-empty hidden>
            <p className="h2">Aucun véhicule ne correspond.</p>
            <p className="lead">Élargissez un filtre, ou dites-nous ce que vous cherchez. Le showroom vous recontacte quand un véhicule correspond.</p>
            <Button to="/mansour-motors#alerte">Être prévenu</Button>
          </div>
        </div>
      </main>
    </Shell>
  )
}
