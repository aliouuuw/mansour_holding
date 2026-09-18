/* The stock page, ported from prototype/launch/stock.js. React renders the markup and every
   card once; this module filters, sorts and moves the cards (FLIP), drives the atelier and
   keeps the URL describing what is on screen. Client only: loaded with a dynamic import. */
import { $, $$, reduceMotion, segThumb, focusOnTouch } from './dom.js'
import { mountTurntable } from './turntable.js'

const VUES = { atelier: 'atelier', anneau: 'atelier', liste: 'list', grille: 'grid', ring: 'atelier', list: 'list', grid: 'grid' }
const VUE_Q = { atelier: 'atelier', list: 'liste', grid: 'grille' }
const SORTS = {
  'price-asc': (a, b) => a.price - b.price,
  'price-desc': (a, b) => b.price - a.price,
  'km-asc': (a, b) => a.km - b.km,
  'year-desc': (a, b) => b.year - a.year || a.km - b.km,
}

export function mountStock(root, cars, { models, navigate }) {
  const life = new AbortController()
  const signal = life.signal
  const form = $('[data-filter-form]', root)
  const grid = $('[data-grid]', root)
  const sortSel = $('[data-sort]', root)
  const makeSel = $('[data-make]', root)
  const modelSel = $('[data-model]', root)
  const fuelSeg = $('[data-fuel]', root)
  const params = new URLSearchParams(location.search)
  const table = mountTurntable(root, { drive: 'pointer', modes: ['atelier', 'list', 'grid'], navigate })
  table.setMode(VUES[params.get('vue')] || (reduceMotion.matches ? 'list' : 'atelier'))

  function fillModels(keep) {
    const make = makeSel.value
    modelSel.disabled = !make
    modelSel.replaceChildren(new Option(make ? 'Tous modèles' : 'Modèle', ''),
      ...(make ? models[make] ?? [] : []).map((m) => new Option(m, m, false, m === keep)))
  }

  let fuel = ''
  const pressFuel = () => {
    for (const b of $$('button', fuelSeg)) b.setAttribute('aria-pressed', String(b.dataset.value === fuel))
    segThumb(fuelSeg)
  }

  /* state in from the URL (the home search lands here) */
  makeSel.value = params.get('marque') || ''
  fillModels(params.get('modele'))
  form.elements.budget.value = params.get('budget') || ''
  form.elements.km.value = params.get('km') || ''
  form.elements.dispo.checked = params.get('dispo') === '1'
  fuel = params.get('energie') || ''
  sortSel.value = params.get('tri') || ''

  const filters = $('[data-filters]', root)
  filters.open = !matchMedia('(max-width: 860px)').matches
  filters.addEventListener('toggle', () => segThumb(fuelSeg))
  pressFuel()
  addEventListener('resize', () => segThumb(fuelSeg), { signal })
  document.fonts?.ready.then(() => segThumb(fuelSeg))

  const nodes = new Map($$('.card', grid).map((el) => [el.dataset.n, el]))
  const touch = focusOnTouch([...nodes.values()])

  function read() {
    const f = form.elements
    return {
      marque: makeSel.value, modele: modelSel.value, energie: fuel,
      budget: f.budget.value, km: f.km.value,
      dispo: f.dispo.checked ? '1' : '', tri: sortSel.value,
    }
  }

  function update({ animate = true } = {}) {
    const s = read()
    let list = cars.filter((c) =>
      (!s.marque || c.make === s.marque) &&
      (!s.modele || c.model === s.modele) &&
      (!s.energie || c.fuel === s.energie) &&
      (!s.budget || c.price <= Number(s.budget)) &&
      (!s.km || c.km <= Number(s.km)) &&
      (!s.dispo || c.status === 'available'))
    // newest arrivals first by default
    list = [...list].sort(SORTS[s.tri] || ((a, b) => b.arrived - a.arrived))

    // FLIP: each card travels from where it was to where it now is
    const before = new Map()
    for (const [n, el] of nodes) if (!el.hidden) before.set(n, el.getBoundingClientRect())
    const shown = new Set(list.map((c) => c.n))
    for (const c of list) grid.append(nodes.get(c.n))
    for (const [n, el] of nodes) el.hidden = !shown.has(n)
    if (animate && !reduceMotion.matches) {
      for (const c of list) {
        const el = nodes.get(c.n)
        const a = before.get(c.n)
        const b = el.getBoundingClientRect()
        if (a) {
          const dx = a.left - b.left
          const dy = a.top - b.top
          if (dx || dy) el.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'none' }], { duration: 650, easing: 'cubic-bezier(.16,1,.3,1)' })
        } else {
          el.animate([{ transform: 'translateY(24px) scale(.97)' }, { transform: 'none' }], { duration: 650, easing: 'cubic-bezier(.16,1,.3,1)' })
        }
      }
    }

    $('[data-total]', root).textContent = list.length === cars.length ? String(cars.length) : `${list.length}/${cars.length}`
    $('[data-live]', root).textContent = `${list.length} véhicule${list.length > 1 ? 's' : ''}`
    $('[data-empty]', root).hidden = list.length > 0
    const active = ['marque', 'modele', 'energie', 'budget', 'km', 'dispo'].filter((k) => s[k]).length
    $('[data-active-count]', root).textContent = active ? `${active} actif${active > 1 ? 's' : ''}` : ''
    table.setCars(list)

    // the URL always describes what is on screen, so it can be shared as is
    const q = new URLSearchParams(Object.entries(s).filter(([, v]) => v))
    if (table.mode !== 'atelier') q.set('vue', VUE_Q[table.mode])
    history.replaceState(history.state, '', q.toString() ? `?${q}` : location.pathname)
  }

  makeSel.addEventListener('change', () => { fillModels(); update() })
  form.addEventListener('change', (e) => { if (e.target !== makeSel) update() })
  fuelSeg.addEventListener('click', (e) => {
    const b = e.target.closest('button')
    if (!b) return
    fuel = b.dataset.value
    pressFuel()
    update()
  })
  $('[data-reset]', root).addEventListener('click', () => {
    form.reset()
    makeSel.value = ''
    fillModels()
    fuel = ''
    sortSel.value = ''
    pressFuel()
    update()
  })
  $('[data-view]', root).addEventListener('click', () => {
    requestAnimationFrame(() => update({ animate: false }))
  })

  update({ animate: false })

  return () => {
    life.abort()
    touch?.disconnect()
    table.destroy()
  }
}
