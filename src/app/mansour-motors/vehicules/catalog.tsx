'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useRouter } from 'next/navigation'
import type { ApiVehicle } from '@/lib/api'
import { AtelierSwipeHint, Button, Card, Shell } from '../_ui'
import { toCar } from '../_ui/car'
import { BUDGETS, FUEL } from '../_ui/shared'

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
            <p className="lead catalog-intro">Stock au showroom de Dakar.</p>
          </div>
        </header>

        <div className="filterbar">
          <div className="wrap catalog-tools">
              <details className="filters" data-filters>
              <summary>
                <span>Filtrer</span>
                <span className="filter-summary-count" data-active-count />
              </summary>
              <div className="filter-sheet">
                <div className="viewbar-tools">
                  <div className="seg" role="group" aria-label="Affichage" data-view>
                    <button type="button" data-mode="grid" aria-pressed="true">Grille</button>
                    <button type="button" data-mode="list" aria-pressed="false">Liste</button>
                    <button type="button" data-mode="atelier" aria-pressed="false">Atelier</button>
                  </div>
                  <select aria-label="Trier par" data-sort defaultValue="">
                    <option value="">Arrivée récente</option>
                    <option value="price-asc">Prix croissant</option>
                    <option value="price-desc">Prix décroissant</option>
                    <option value="km-asc">Kilométrage croissant</option>
                    <option value="year-desc">Année, plus récente</option>
                  </select>
                  <button type="button" className="reset" data-reset hidden>
                    <svg width="9" height="9" viewBox="0 0 10 10" fill="none" aria-hidden="true"><path d="M1.5 1.5L8.5 8.5M8.5 1.5L1.5 8.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
                    <span>Effacer</span>
                  </button>
                </div>
                <form className="filters-body" data-filter-form>
                  <select name="marque" aria-label="Marque" data-make defaultValue="">
                    <option value="" data-count={vehicles.length}>Toutes marques</option>
                    {makes.map((m) => <option key={m} data-count={makeCounts[m]}>{m}</option>)}
                  </select>
                  <select name="modele" aria-label="Modèle" data-model disabled><option value="">Modèle</option></select>
                  <select name="budget" aria-label="Budget maximum" data-max defaultValue="">
                    <option value="">Tous budgets</option>
                    {BUDGETS.map((b) => <option key={b} value={b * 1_000_000}>{b} M FCFA max.</option>)}
                  </select>
                  <select name="km" aria-label="Kilométrage maximum" defaultValue="">
                    <option value="">Tous kilométrages</option>
                    {KMS.map((k) => <option key={k} value={k}>{k.toLocaleString('fr-FR').replace(/ /g, ' ')} km max.</option>)}
                  </select>
                  <div className="seg" role="group" aria-label="Énergie" data-fuel>
                    {[['', 'Toutes'] as const, ...fuels.map((f) => [f, FUEL[f]] as const)].map(([v, label]) => (
                      <button key={v} type="button" data-value={v} aria-pressed="false">{label}</button>
                    ))}
                  </div>
                  <label className="switch"><input type="checkbox" name="dispo" value="1" /> Disponibles</label>
                </form>
              </div>
            </details>

            <div className="viewbar">
              <div className="dock-lead">
                <p className="dock-title">Véhicules</p>
                <p className="catalog-count" aria-live="polite">
                  <span data-live /> <span data-active-label />
                </p>
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
              href="#"
              data-atelier-hero
              aria-describedby="catalog-atelier-instructions"
            >
              <span className="crop" aria-hidden="true" />
              <div className="atelier-hero-media" data-atelier-media>
                <AtelierSwipeHint />
                {/* eslint-disable-next-line @next/next/no-img-element -- filled by stock.js */}
                <img data-atelier-img alt="" decoding="async" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'/%3E" />
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
