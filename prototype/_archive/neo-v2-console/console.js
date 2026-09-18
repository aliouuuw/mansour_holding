import { waypoints, FR } from '../data.js'

const $  = s => document.querySelector(s)
const $$ = s => [...document.querySelectorAll(s)]
const num = n => n.toLocaleString('fr-FR').replace(/ | /g, ' ')
const pad = n => String(n).padStart(2, '0')
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches

const N = waypoints.length
const avail = waypoints.filter(v => v.status === 'available')
const MODULES = ['parc', 'fiche', 'comparer', 'showroom']

const state = {
  mod: 'parc',
  sel: 0,                       // the machine the whole console is pointed at
  cmp: new Set([0, 1]),         // up to three, for Comparer
}

/* ══ instruments settle onto a value; they never drift past it ══ */
function count(el, target, dur = 750, delay = 0) {
  if (reduce) { el.textContent = num(target); return }
  const from = Number(String(el.textContent).replace(/\D/g, '')) || 0
  if (from === target) { el.textContent = num(target); return }
  const t0 = performance.now() + delay
  const step = now => {
    if (now < t0) return requestAnimationFrame(step)
    const p = Math.min(1, (now - t0) / dur)
    el.textContent = num(Math.round(from + (target - from) * (1 - Math.pow(1 - p, 4))))
    if (p < 1) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}

/* ══ MODULE: PARC ══════════════════════════════════════════════ */

$('#parc-grid').innerHTML = waypoints.map((v, i) => `
  <button class="card" type="button" data-i="${i}" aria-current="${i === state.sel}"
          aria-label="Ouvrir la fiche de ${v.make} ${v.model}">
    <span class="card__plate">
      <img class="card__img" src="${v.img}" alt="" loading="${i < 6 ? 'eager' : 'lazy'}"
           decoding="async" style="object-position:${v.pos}">
      ${v.status !== 'available' ? `<span class="card__flag">${FR.status[v.status]}</span>` : ''}
    </span>
    <span class="card__body">
      <span class="card__make">${v.make}</span>
      <span class="card__name">${v.model}</span>
      <span class="card__row">
        <span class="card__price">${num(v.price)} FCFA</span>
        <span class="card__km">${num(v.km)} km</span>
      </span>
    </span>
  </button>`).join('')

$('#parc-grid').addEventListener('click', e => {
  const b = e.target.closest('.card')
  if (!b) return
  setSel(Number(b.dataset.i))
  go('fiche')
})

let scanned = false
function runScan() {
  if (scanned) return
  scanned = true
  const soldOrHeld = N - avail.length
  $('#arc-s').style.setProperty('--v', 1)
  $('#arc-a').style.setProperty('--v', avail.length / N)
  count($('#meter-n'), avail.length, 900)
  count($('#r-val'), avail.reduce((s, v) => s + v.price, 0), 1000, 120)
  count($('#r-from'), Math.min(...avail.map(v => v.price)), 900, 220)
  count($('#r-km'), waypoints.reduce((s, v) => s + v.km, 0), 1000, 320)
  const ys = waypoints.map(v => v.year)
  $('#r-yr').textContent = `${Math.min(...ys)}–${Math.max(...ys)}`
  $('#badge-parc').textContent = N
  if (soldOrHeld === 0) $('#arc-s').style.setProperty('--v', 0)
}

/* ══ MODULE: FICHE ═════════════════════════════════════════════ */

const GLYPH = { odo: 'g-odo', year: 'g-year', fuel: 'g-fuel', box: 'g-box', paint: 'g-paint', vin: 'g-vin' }
const spec = (g, k, v, u = '') => `
  <div class="spec">
    <svg viewBox="0 0 24 24" aria-hidden="true"><use href="#${GLYPH[g]}"/></svg>
    <div class="spec__t"><dt>${k}</dt><dd>${v}${u ? `<i>${u}</i>` : ''}</dd></div>
  </div>`

function paintFiche() {
  const v = waypoints[state.sel]

  $('#f-make').textContent = v.make
  $('#f-model').textContent = v.model
  const st = $('#f-state')
  st.textContent = FR.status[v.status]
  st.dataset.s = v.status

  const img = $('#f-img')
  if (img.src !== v.img && !reduce) {
    img.style.opacity = '0'
    setTimeout(() => { img.src = v.img; img.alt = `${v.make} ${v.model}, ${v.color}`; img.style.opacity = '1' }, 150)
  } else {
    img.src = v.img; img.alt = `${v.make} ${v.model}, ${v.color}`; img.style.opacity = '1'
  }
  img.style.objectPosition = v.pos

  $('#f-swatch').style.background = v.swatch
  $('#f-color').textContent = v.color
  $('#f-vin').textContent = `Chassis ${v.vin}`

  $('#f-specs').innerHTML =
    spec('odo',  'Compteur',  num(v.km), 'km') +
    spec('year', 'Annee',     v.year) +
    spec('fuel', 'Carburant', FR.fuel[v.fuel]) +
    spec('box',  'Boite',     FR.gearbox[v.gearbox]) +
    spec('paint','Couleur',   v.color) +
    spec('vin',  'Chassis',   v.vin)

  $('#f-note').textContent = v.note

  /* where this machine sits in the parc, by price. Real order, real numbers. */
  const max = Math.max(...waypoints.map(w => w.price))
  const order = [...waypoints].sort((a, b) => b.price - a.price)
  $('#f-rank').innerHTML = order.map((w, n) => `
    <li data-me="${w.n === v.n}">
      <span class="rank__n">${pad(n + 1)}</span>
      <span class="rank__name">${w.make} ${w.model}</span>
      <span class="rank__bar" style="--w:${(w.price / max).toFixed(4)}"><span class="rank__fill"></span></span>
      <span class="rank__v">${num(w.price)}</span>
    </li>`).join('')
}

/* the segmented control */
const seg = $('#f-seg')
function segTo(tab) {
  $$('.seg__b').forEach(b => b.setAttribute('aria-selected', String(b.dataset.tab === tab)))
  ;['donnees', 'notes', 'parc'].forEach(t => { $(`#pane-${t}`).hidden = t !== tab })
  const b = seg.querySelector(`[data-tab="${tab}"]`)
  const ind = $('#seg-ind')
  ind.style.setProperty('--seg-w', `${b.offsetWidth}px`)
  ind.style.setProperty('--seg-x', `${b.offsetLeft - 3}px`)
}
seg.addEventListener('click', e => {
  const b = e.target.closest('.seg__b')
  if (b) segTo(b.dataset.tab)
})

/* ══ MODULE: COMPARER ══════════════════════════════════════════ */

const ROWS = [
  { k: 'Prix',      get: v => v.price,               fmt: v => `${num(v.price)}<span class="u">FCFA</span>`, best: 'min' },
  { k: 'Compteur',  get: v => v.km,                  fmt: v => `${num(v.km)}<span class="u">km</span>`,      best: 'min' },
  { k: 'Annee',     get: v => v.year,                fmt: v => v.year,                                       best: 'max' },
  { k: 'Carburant', fmt: v => FR.fuel[v.fuel] },
  { k: 'Boite',     fmt: v => FR.gearbox[v.gearbox] },
  { k: 'Couleur',   fmt: v => v.color },
  { k: 'Chassis',   fmt: v => v.vin },
  { k: 'Etat',      fmt: v => FR.status[v.status] },
]

function paintPicker() {
  $('#picker').innerHTML = waypoints.map((v, i) => `
    <button class="pick" type="button" data-i="${i}" aria-pressed="${state.cmp.has(i)}"
            ${!state.cmp.has(i) && state.cmp.size >= 3 ? 'disabled' : ''}>
      ${v.make} ${v.model}
    </button>`).join('')
  $('#badge-comp').textContent = state.cmp.size
}

function paintCompare() {
  const box = $('#compare')
  const sel = [...state.cmp].sort((a, b) => a - b).map(i => waypoints[i])

  if (!sel.length) {
    box.style.gridTemplateColumns = '1fr'
    box.innerHTML = `<p class="compare__empty">Choisissez au moins une machine ci-dessus.</p>`
    return
  }

  /* one grid, fixed tracks: every column's rows share a baseline whatever
     the copy length. Alignment never depends on content. */
  box.style.gridTemplateColumns = `clamp(5.5rem, 9vw, 9rem) repeat(${sel.length}, minmax(0, 1fr))`

  let html = `<div class="cmp-c cmp-c--k cmp-c--h"></div>` +
    sel.map(v => `<div class="cmp-c cmp-c--h">
        <p class="cmp-h__make">${v.make}</p>
        <p class="cmp-h__name">${v.model}</p>
      </div>`).join('')

  for (const row of ROWS) {
    let bestVal = null
    if (row.best && row.get) {
      const vals = sel.map(row.get)
      bestVal = row.best === 'min' ? Math.min(...vals) : Math.max(...vals)
    }
    html += `<div class="cmp-c cmp-c--k">${row.k}</div>`
    html += sel.map(v => {
      const isBest = bestVal !== null && sel.length > 1 && row.get(v) === bestVal
      return `<div class="cmp-c" data-best="${isBest}"><p class="cmp-c__v">${row.fmt(v)}</p></div>`
    }).join('')
  }
  box.innerHTML = html
}

$('#picker').addEventListener('click', e => {
  const b = e.target.closest('.pick')
  if (!b) return
  const i = Number(b.dataset.i)
  if (state.cmp.has(i)) state.cmp.delete(i)
  else if (state.cmp.size < 3) state.cmp.add(i)
  paintPicker(); paintCompare()
})

/* ══ the action bar: the selection follows you everywhere ══════ */

function paintBar() {
  const v = waypoints[state.sel]
  $('#bar-img').src = v.img
  $('#bar-img').style.objectPosition = v.pos
  $('#bar-img').alt = ''
  $('#bar-name').textContent = `${v.make} ${v.model}`
  $('#bar-meta').textContent = `${v.year} · ${num(v.km)} km · ${FR.status[v.status]}`
  count($('#bar-price'), v.price, 620)
  $('#bar-call').hidden = v.status === 'sold'
}

function setSel(i) {
  state.sel = i
  $$('.card').forEach((c, n) => c.setAttribute('aria-current', String(n === i)))
  paintFiche()
  paintBar()
}

/* ══ the router ════════════════════════════════════════════════ */

function go(mod, { push = true } = {}) {
  if (!MODULES.includes(mod)) mod = 'parc'
  state.mod = mod

  MODULES.forEach(m => {
    const el = $(`#mod-${m}`)
    el.hidden = m !== mod
    el.classList.remove('is-in')
  })
  const live = $(`#mod-${mod}`)
  if (!reduce) { void live.offsetWidth; live.classList.add('is-in') }

  $$('.dock__i').forEach(a => a.setAttribute('aria-current', a.dataset.mod === mod ? 'page' : 'false'))
  $('#dock-ind').style.setProperty('--ind-y', `${MODULES.indexOf(mod) * 44}px`)

  $('#work').scrollTop = 0
  if (push && location.hash !== `#${mod}`) history.replaceState(null, '', `#${mod}`)

  if (mod === 'parc') runScan()
  if (mod === 'fiche') requestAnimationFrame(() => segTo($('.seg__b[aria-selected="true"]').dataset.tab))
  if (mod === 'comparer') { paintPicker(); paintCompare() }
}

$('#dock-nav').addEventListener('click', e => {
  const a = e.target.closest('.dock__i')
  if (!a) return
  e.preventDefault()
  go(a.dataset.mod)
})
addEventListener('hashchange', () => go(location.hash.slice(1), { push: false }))

$('#bar').addEventListener('click', e => {
  if (e.target.closest('.key')) return
  if (state.mod !== 'fiche') go('fiche')
})

addEventListener('resize', () => {
  if (state.mod === 'fiche') segTo($('.seg__b[aria-selected="true"]').dataset.tab)
}, { passive: true })

/* ── first paint ─────────────────────────────────────────────── */
setSel(0)
paintPicker()
paintCompare()
go(location.hash.slice(1) || 'parc', { push: false })
