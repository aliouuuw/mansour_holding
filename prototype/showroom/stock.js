import { cars, brands, modelsOf, FUEL, fcfa, esc, $, $$, card, chrome, reduceMotion } from './common.js'

chrome()

const form = $('[data-filter-form]')
const grid = $('[data-grid]')
const sortSel = $('[data-sort]')
const makeSel = $('[data-make]')
const modelSel = $('[data-model]')
const fuelSeg = $('[data-fuel]')
const params = new URLSearchParams(location.search)

/* ── controls, filled from the data ────────────────────────────────── */
makeSel.innerHTML = '<option value="">Toutes les marques</option>' + brands.map((b) => `<option>${esc(b)}</option>`).join('')
function fillModels(keep) {
  const make = makeSel.value
  modelSel.disabled = !make
  modelSel.innerHTML = `<option value="">${make ? 'Tous les modèles' : 'Choisir une marque'}</option>` +
    (make ? modelsOf(make).map((m) => `<option${m === keep ? ' selected' : ''}>${esc(m)}</option>`).join('') : '')
}

const STEPS = [20, 30, 40, 50, 60, 70, 80, 90, 100].map((m) => m * 1e6)
$('[data-min]').innerHTML = '<option value="">Min.</option>' + STEPS.map((v) => `<option value="${v}">${fcfa(v)}</option>`).join('')
$('[data-max]').innerHTML = '<option value="">Max.</option>' + STEPS.map((v) => `<option value="${v}">${fcfa(v)}</option>`).join('')

const fuels = [...new Set(cars.map((c) => c.fuel))]
fuelSeg.innerHTML = [['', 'Toutes'], ...fuels.map((f) => [f, FUEL[f]])]
  .map(([v, label]) => `<button type="button" data-value="${v}" aria-pressed="false">${label}</button>`).join('')
let fuel = ''
const pressFuel = () => { for (const b of fuelSeg.children) b.setAttribute('aria-pressed', String(b.dataset.value === fuel)) }

/* ── state in, from the URL (the home search lands here) ───────────── */
makeSel.value = params.get('marque') || ''
fillModels(params.get('modele'))
form.elements.min.value = params.get('min') || ''
form.elements.budget.value = params.get('budget') || ''
form.elements.km.value = params.get('km') || ''
form.elements.dispo.checked = params.get('dispo') === '1'
fuel = params.get('energie') || ''
sortSel.value = params.get('tri') || ''
pressFuel()

// filters start open on desktop, folded on phones
const filters = $('[data-filters]')
filters.open = !matchMedia('(max-width: 860px)').matches

/* ── the cards, rendered once; filtering only moves and hides them ─── */
grid.innerHTML = cars.map((c, i) => card(c, { eager: i < 3 })).join('')
const nodes = new Map($$('.card', grid).map((el) => [Number(el.dataset.n), el]))

const SORTS = {
  'price-asc': (a, b) => a.price - b.price,
  'price-desc': (a, b) => b.price - a.price,
  'km-asc': (a, b) => a.km - b.km,
  'year-desc': (a, b) => b.year - a.year || a.km - b.km,
}

function read() {
  const f = form.elements
  return {
    marque: makeSel.value, modele: modelSel.value, energie: fuel,
    min: f.min.value, budget: f.budget.value, km: f.km.value,
    dispo: f.dispo.checked ? '1' : '', tri: sortSel.value,
  }
}

function update({ animate = true } = {}) {
  const s = read()
  let list = cars.filter((c) =>
    (!s.marque || c.make === s.marque) &&
    (!s.modele || c.model === s.modele) &&
    (!s.energie || c.fuel === s.energie) &&
    (!s.min || c.price >= Number(s.min)) &&
    (!s.budget || c.price <= Number(s.budget)) &&
    (!s.km || c.km <= Number(s.km)) &&
    (!s.dispo || c.status === 'available'))
  // newest arrivals first by default: the highest stock number is the latest in
  list = [...list].sort(SORTS[s.tri] || ((a, b) => b.n - a.n))

  // FLIP: measure, reorder, measure again, then play the difference so each card
  // travels from where it was to where it now is
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
        if (dx || dy) el.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'none' }], { duration: 480, easing: 'cubic-bezier(.2,.7,.2,1)' })
      } else {
        el.animate([{ transform: 'translateY(14px) scale(.98)' }, { transform: 'none' }], { duration: 420, easing: 'cubic-bezier(.2,.7,.2,1)' })
      }
    }
  }

  $('[data-total]').textContent = list.length === cars.length ? `(${cars.length})` : `(${list.length} sur ${cars.length})`
  $('[data-live]').textContent = `${list.length} véhicule${list.length > 1 ? 's' : ''}`
  $('[data-empty]').hidden = list.length > 0
  const active = ['marque', 'modele', 'energie', 'min', 'budget', 'km', 'dispo'].filter((k) => s[k]).length
  $('[data-active-count]').textContent = active ? `${active} actif${active > 1 ? 's' : ''}` : ''

  // the URL always describes what is on screen, so it can be shared as is
  const q = new URLSearchParams(Object.entries(s).filter(([, v]) => v))
  history.replaceState(null, '', q.toString() ? `?${q}` : location.pathname)
}

makeSel.addEventListener('change', () => { fillModels(); update() })
form.addEventListener('change', (e) => { if (e.target !== makeSel) update() })
sortSel.addEventListener('change', () => update())
fuelSeg.addEventListener('click', (e) => {
  const b = e.target.closest('button')
  if (!b) return
  fuel = b.dataset.value
  pressFuel()
  update()
})
$('[data-reset]').addEventListener('click', () => {
  form.reset()
  makeSel.value = ''
  fillModels()
  fuel = ''
  pressFuel()
  update()
})

update({ animate: false })
