/* The stock page, ported from prototype/launch/stock.js. React renders the markup and every
   card once; this module filters, sorts and moves the cards (FLIP), drives the atelier and
   keeps the URL describing what is on screen. Client only: loaded with a dynamic import. */
import { $, $$, reduceMotion, segThumb, focusOnTouch } from './dom.js'
import { mountSelectbox } from './selectbox.js'
import { mountTurntable } from './turntable.js'

const VUES = { atelier: 'atelier', anneau: 'atelier', liste: 'list', grille: 'grid', ring: 'atelier', list: 'list', grid: 'grid' }
const VUE_Q = { atelier: 'atelier', list: 'liste', grid: 'grille' }
/* an unknown price is not a cheap one: those cars sort to the end either way */
const LAST = Number.POSITIVE_INFINITY
const SORTS = {
  'price-asc': (a, b) => (a.price ?? LAST) - (b.price ?? LAST),
  'price-desc': (a, b) => (b.price ?? -LAST) - (a.price ?? -LAST),
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
  table.setMode(VUES[params.get('vue')] || 'grid')

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
  for (const select of $$('select', root)) mountSelectbox(select, { signal })

  const filters = $('[data-filters]', root)
  const sheet = $('.filter-sheet', root)
  const summary = $('summary', filters)
  const phone = () => matchMedia('(max-width: 860px)').matches
  const behind = () => $$('.mm > .header, .mm > .sign, .mm > .wa, .mm main > :not(.filterbar)')
  let trapped = false
  let trapFrame = 0
  const sheetItems = () => $$('button, a, input, select, textarea, [tabindex]', sheet)
    .filter((el) => !el.disabled && !el.hidden && el.tabIndex >= 0 && el.getClientRects().length > 0)
  const syncTrap = () => {
    const on = phone() && filters.open
    for (const el of behind()) el.inert = on
    const token = ++trapFrame
    if (on) {
      trapped = true
      requestAnimationFrame(() => { if (token === trapFrame) sheetItems()[0]?.focus() })
    } else if (trapped) {
      trapped = false
      requestAnimationFrame(() => { if (token === trapFrame) summary?.focus() })
    }
  }
  filters.open = !phone()
  filters.addEventListener('toggle', () => {
    requestAnimationFrame(() => segThumb(fuelSeg))
    syncTrap()
  }, { signal })
  filters.addEventListener('click', (e) => {
    if (phone() && e.target === filters) filters.open = false
  }, { signal })
  addEventListener('keydown', (e) => {
    if (!phone() || !filters.open) return
    if (e.key === 'Escape') { filters.open = false; return }
    if (e.key !== 'Tab') return
    const items = sheetItems()
    if (!items.length) return
    const first = items[0]
    const last = items[items.length - 1]
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
  }, { signal })
  pressFuel()
  addEventListener('resize', () => segThumb(fuelSeg), { signal })
  document.fonts?.ready.then(() => segThumb(fuelSeg))

  const nodes = new Map($$('.card', grid).map((el) => [el.dataset.n, el]))
  const touch = focusOnTouch([...nodes.values()])
  const tapHintKey = 'mm-catalog-tap-hint'
  let tapHintOff = false
  try {
    tapHintOff = sessionStorage.getItem(tapHintKey) === '1'
      || sessionStorage.getItem('mm-catalog-card-hint') === '1'
  } catch { /* ponytail: private mode */ }
  if (tapHintOff) root.dataset.cardHint = 'off'

  function dismissTapHint() {
    if (tapHintOff) return
    tapHintOff = true
    root.dataset.cardHint = 'off'
    try { sessionStorage.setItem(tapHintKey, '1') } catch { /* noop */ }
    for (const el of nodes.values()) el.removeAttribute('data-open-hint')
    const indexEl = $('[data-index]', root)
    if (indexEl) for (const a of $$('a', indexEl)) a.removeAttribute('data-open-hint')
  }

  function syncTapHints(list) {
    for (const el of nodes.values()) el.removeAttribute('data-open-hint')
    const indexEl = $('[data-index]', root)
    if (indexEl) for (const a of $$('a', indexEl)) a.removeAttribute('data-open-hint')
    if (tapHintOff || !list[0]) return
    if (table.mode === 'grid') nodes.get(list[0].n)?.setAttribute('data-open-hint', '')
    else if (table.mode === 'list' && indexEl) $('a', indexEl)?.setAttribute('data-open-hint', '')
  }

  root.addEventListener('click', (e) => {
    if (e.target.closest('.card-link, .index a')) dismissTapHint()
  }, { signal })

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
      (!s.budget || c.price == null || c.price <= Number(s.budget)) &&
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

    $('[data-live]', root).textContent = `${list.length} véhicule${list.length > 1 ? 's' : ''}`
    $('[data-empty]', root).hidden = list.length > 0
    const active = ['marque', 'modele', 'energie', 'budget', 'km', 'dispo'].filter((k) => s[k]).length
    $('[data-active-count]', root).textContent = active ? `${active} actif${active > 1 ? 's' : ''}` : ''
    $('[data-active-label]', root).textContent = active ? `· ${active} filtre${active > 1 ? 's' : ''}` : ''
    $('[data-reset]', root).hidden = !active && !s.tri
    table.setCars(list)
    syncTapHints(list)

    // the URL always describes what is on screen, so it can be shared as is
    const q = new URLSearchParams(Object.entries(s).filter(([, v]) => v))
    if (table.mode !== 'grid') q.set('vue', VUE_Q[table.mode])
    history.replaceState(history.state, '', q.toString() ? `?${q}` : location.pathname)
  }

  makeSel.addEventListener('change', () => { fillModels(); update() }, { signal })
  form.addEventListener('change', (e) => { if (e.target !== makeSel) update() }, { signal })
  sortSel.addEventListener('change', update, { signal })
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
    sortSel.dispatchEvent(new Event('change', { bubbles: true }))
  })
  $('[data-view]', root).addEventListener('click', () => {
    requestAnimationFrame(() => update({ animate: false }))
  })

  update({ animate: false })

  return () => {
    life.abort()
    for (const el of behind()) el.inert = false
    touch?.disconnect()
    table.destroy()
  }
}
