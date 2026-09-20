'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Link } from '@/lib/router'
import type { ApiVehicle } from '@/lib/api'
import { Button, Card, Plate, Shell } from '../_ui'
import { toCar } from '../_ui/car'
import { BUDGETS, FUEL } from '../_ui/shared'

const KMS = [1000, 5000, 10000, 20000]

/* the markup and every card are rendered once; _ui/stock.js filters, sorts and animates them */
export function PublicVehicles({ vehicles }: { vehicles: ApiVehicle[] }) {
  const ref = useRef<HTMLElement>(null)
  const router = useRouter()
  const cars = useMemo(() => vehicles.map(toCar), [vehicles])
  const makes = useMemo(() => [...new Set(vehicles.map((v) => v.make))].sort((a, b) => a.localeCompare(b, 'fr')), [vehicles])
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
        <div className="wrap">
          <div className="page-head">
            <div>
              <p className="crumbs"><Link to="/mansour-motors">Accueil</Link> / Véhicules</p>
              <h1 className="display">Véhicules <span data-total>{vehicles.length}</span></h1>
            </div>
          </div>

          <div className="filterbar">
            <details className="filters" open data-filters>
              <summary><span>Filtres</span><span data-active-count /></summary>
              <form className="filters-body" data-filter-form>
                <select name="marque" aria-label="Marque" data-make defaultValue="">
                  <option value="">Toutes marques</option>
                  {makes.map((m) => <option key={m}>{m}</option>)}
                </select>
                <select name="modele" aria-label="Modèle" data-model disabled><option value="">Modèle</option></select>
                <div className="seg" role="group" aria-label="Énergie" data-fuel>
                  {[['', 'Toutes'] as const, ...fuels.map((f) => [f, FUEL[f]] as const)].map(([v, label]) => (
                    <button key={v} type="button" data-value={v} aria-pressed="false">{label}</button>
                  ))}
                </div>
                <select name="budget" aria-label="Budget maximum" data-max defaultValue="">
                  <option value="">Tous budgets</option>
                  {BUDGETS.map((b) => <option key={b} value={b * 1_000_000}>{b} M FCFA max.</option>)}
                </select>
                <select name="km" aria-label="Kilométrage maximum" defaultValue="">
                  <option value="">Tous kilométrages</option>
                  {KMS.map((k) => <option key={k} value={k}>{k.toLocaleString('fr-FR').replace(/ /g, ' ')} km max.</option>)}
                </select>
                <label className="switch"><input type="checkbox" name="dispo" value="1" /> Disponibles</label>
                <span className="grow" />
                <select aria-label="Trier par" data-sort defaultValue="">
                  <option value="">Arrivée récente</option>
                  <option value="price-asc">Prix croissant</option>
                  <option value="price-desc">Prix décroissant</option>
                  <option value="km-asc">Kilométrage croissant</option>
                  <option value="year-desc">Année, plus récente</option>
                </select>
                <button type="button" className="reset" data-reset>Réinitialiser</button>
              </form>
            </details>
          </div>

          <div className="viewbar">
            <p className="vh" aria-live="polite" data-live />
            <div className="seg" role="group" aria-label="Affichage" data-view>
              <button type="button" data-mode="atelier" aria-pressed="true">Atelier</button>
              <button type="button" data-mode="list" aria-pressed="false">Liste</button>
              <button type="button" data-mode="grid" aria-pressed="false">Grille</button>
            </div>
          </div>
        </div>

        <section className="atelier" data-atelier hidden>
          <a className="atelier-hero ch-dark" href="#" data-atelier-hero>
            <span className="crop" aria-hidden="true" />
            {/* eslint-disable-next-line @next/next/no-img-element -- filled by stock.js */}
            <img data-atelier-img alt="" decoding="async" />
            <div className="atelier-meta">
              <p className="count" data-atelier-count />
              <p className="brand" data-atelier-brand />
              <p className="atelier-name" data-atelier-name />
              <p className="atelier-specs" data-atelier-specs />
              <div data-atelier-status />
              <p className="atelier-price" data-atelier-price />
              <Plate>Voir le véhicule</Plate>
            </div>
          </a>
          <div className="atelier-rail wrap">
            <p className="atelier-kicker">Le stock</p>
            <div className="atelier-strip" data-atelier-strip />
          </div>
        </section>

        <section className="stock-stage ch-dark" aria-label="Résultats" data-stage hidden>
          <ol className="index wrap" data-index hidden />
        </section>

        <div className="wrap">
          <div className="grid" data-grid hidden>
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
