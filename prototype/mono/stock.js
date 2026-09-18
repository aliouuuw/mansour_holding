import { cars, brands, modelsOf, FUEL, esc, $, $$, card, chrome, reduceMotion, segThumb, focusOnTouch } from './common.js'

chrome()

const form = $('[data-filter-form]')
const grid = $('[data-grid]')
const sortSel = $('[data-sort]')
const makeSel = $('[data-make]')
const modelSel = $('[data-model]')
const fuelSeg = $('[data-fuel]')
const params = new URLSearchParams(location.search)

/* ── controls, filled from the data ────────────────────────────────── */
makeSel.innerHTML = '<option value="">Toutes marques</option>' + brands.map((b) => `<option>${esc(b)}</option>`).join('')
function fillModels(keep) {
  const make = makeSel.value
  modelSel.disabled = !make
  modelSel.innerHTML = `<option value="">${make ? 'Tous modèles' : 'Modèle'}</option>` +
    (make ? modelsOf(make).map((m) => `<option${m === keep ? ' selected' : ''}>${esc(m)}</option>`).join('') : '')
}
const STEPS = [30, 50, 70, 100]
$('[data-max]').innerHTML = '<option value="">Tous budgets</option>' + STEPS.map((m) => `<option value="${m * 1e6}">${m} M FCFA max.</option>`).join('')

const fuels = [...new Set(cars.map((c) => c.fuel))]
fuelSeg.innerHTML = [['', 'Toutes'], ...fuels.map((f) => [f, FUEL[f]])]
  .map(([v, label]) => `<button type="button" data-value="${v}" aria-pressed="false">${label}</button>`).join('')
let fuel = ''
const pressFuel = () => {
  for (const b of $$('button', fuelSeg)) b.setAttribute('aria-pressed', String(b.dataset.value === fuel))
  segThumb(fuelSeg)
}

/* ── state in from the URL (the home search lands here) ────────────── */
makeSel.value = params.get('marque') || ''
fillModels(params.get('modele'))
form.elements.budget.value = params.get('budget') || ''
form.elements.km.value = params.get('km') || ''
form.elements.dispo.checked = params.get('dispo') === '1'
fuel = params.get('energie') || ''
sortSel.value = params.get('tri') || ''

const filters = $('[data-filters]')
filters.open = !matchMedia('(max-width: 860px)').matches
filters.addEventListener('toggle', () => segThumb(fuelSeg))
pressFuel()
addEventListener('resize', () => segThumb(fuelSeg))
document.fonts?.ready.then(() => segThumb(fuelSeg))

/* ── the cards, rendered once; filtering only moves and hides them ─── */
grid.innerHTML = cars.map((c) => card(c, { eager: true })).join('')
const nodes = new Map($$('.card', grid).map((el) => [Number(el.dataset.n), el]))
focusOnTouch([...nodes.values()])

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
  // newest arrivals first by default: the highest stock number is the latest in
  list = [...list].sort(SORTS[s.tri] || ((a, b) => b.n - a.n))

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

  $('[data-total]').textContent = list.length === cars.length ? String(cars.length) : `${list.length}/${cars.length}`
  $('[data-live]').textContent = `${list.length} véhicule${list.length > 1 ? 's' : ''}`
  $('[data-empty]').hidden = list.length > 0
  const active = ['marque', 'modele', 'energie', 'budget', 'km', 'dispo'].filter((k) => s[k]).length
  $('[data-active-count]').textContent = active ? `${active} actif${active > 1 ? 's' : ''}` : ''

  // the URL always describes what is on screen, so it can be shared as is
  const q = new URLSearchParams(Object.entries(s).filter(([, v]) => v))
  history.replaceState(null, '', q.toString() ? `?${q}` : location.pathname)
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
$('[data-reset]').addEventListener('click', () => {
  form.reset()
  makeSel.value = ''
  fillModels()
  fuel = ''
  sortSel.value = ''
  pressFuel()
  update()
})

/* only the clicked card's photograph carries into the next page */
grid.addEventListener('click', (e) => {
  const a = e.target.closest('a')
  if (!a) return
  for (const el of $$('.card-media', grid)) el.style.viewTransitionName = ''
  const m = $('.card-media', a)
  m.style.viewTransitionName = `car-${a.closest('.card').dataset.n}`
})

update({ animate: false })
