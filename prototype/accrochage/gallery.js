import { waypoints as works } from '../data.js'

/* ── vocabulary ─────────────────────────────────────────────────────── */
const FUEL = { diesel: 'Diesel', gasoline: 'Essence', hybrid: 'Hybride', electric: 'Électrique' }
const GEARBOX = { automatic: 'boîte automatique', manual: 'boîte manuelle', cvt: 'boîte CVT' }
const STATE = { available: 'Disponible', reserved: 'Réservée', sold: 'Vendue' }
const WORDS = ['Zéro', 'Une', 'Deux', 'Trois', 'Quatre', 'Cinq', 'Six', 'Sept', 'Huit', 'Neuf', 'Dix', 'Onze', 'Douze']
const DAY = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi']
// Dakar is UTC+0 all year, so UTC getters give showroom time.
const HOURS = { 1: [8, 18], 2: [8, 18], 3: [8, 18], 4: [8, 18], 5: [8, 18], 6: [9, 17] }
const WHATSAPP = '221771234567' // placeholder number from the current site

const nf = new Intl.NumberFormat('fr-FR')
const price = (n) => `${nf.format(n)} FCFA`
const km = (n) => `${nf.format(n)} km`
const pad2 = (n) => String(n).padStart(2, '0')
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])
const plural = (n, word) => `${n} ${word}${n > 1 ? 's' : ''}`
const $ = (sel) => document.querySelector(sel)

/* ── entrée ─────────────────────────────────────────────────────────── */
const total = works.length
$('[data-title]').textContent = `${WORDS[total] ?? total} machine${total > 1 ? 's' : ''}`

const tally = (status) => works.filter((w) => w.status === status).length
const counts = [
  [tally('available'), 'disponible'],
  [tally('reserved'), 'réservée'],
  [tally('sold'), 'vendue'],
].filter(([n]) => n).map(([n, w]) => plural(n, w))
$('[data-count]').textContent = `${counts.join(', ')}.`

function openState(now = new Date()) {
  const d = now.getUTCDay()
  const h = now.getUTCHours() + now.getUTCMinutes() / 60
  const today = HOURS[d]
  if (today && h >= today[0] && h < today[1]) return { open: true, text: `Ouvert, jusqu'à ${today[1]}h` }
  for (let i = 0; i < 8; i++) {
    const day = (d + i) % 7
    const hh = HOURS[day]
    if (!hh || (i === 0 && h >= hh[0])) continue
    const when = i === 0 ? "aujourd'hui" : i === 1 ? 'demain' : DAY[day]
    return { open: false, text: `Fermé, ouvre ${when} à ${hh[0]}h` }
  }
}
const openEl = $('[data-open]')
const open = openState()
openEl.textContent = open.text
openEl.dataset.state = open.open ? 'open' : 'closed'

/* ── l'accrochage ───────────────────────────────────────────────────── */
const hang = $('[data-hang]')
hang.innerHTML = works.map((w, i) => {
  const n = pad2(w.n)
  const side = i % 2 ? 'right' : 'left'
  const size = i % 3 === 0 ? 'l' : 'm'
  const zoom = (1 + (w.zoom - 1) * 0.5).toFixed(3)
  const sold = w.status === 'sold'
  const action = sold
    ? `<p class="cartel-state">${STATE.sold}</p>`
    : `<a class="cartel-cta" href="#visite" data-book="${w.n}">Demander une visite privée <span aria-hidden="true">→</span></a>`
  return `
  <article class="oeuvre" id="oeuvre-${n}" data-n="${n}" data-side="${side}" data-size="${size}" data-status="${w.status}"
    style="--pos:${w.pos};--zoom:${zoom}">
    <figure class="niche">
      <div class="cadre">
        <img src="${esc(w.img)}" alt="${esc(`${w.make} ${w.model}, ${w.color}`)}" loading="${i < 2 ? 'eager' : 'lazy'}" decoding="async">
        <span class="verre" aria-hidden="true"></span>
      </div>
    </figure>
    <div class="cartel">
      <p class="cartel-n">N° ${n}</p>
      <h2><span class="cartel-make">${esc(w.make)}</span><span class="cartel-title">${esc(w.model)}, ${w.year}</span></h2>
      <p>${FUEL[w.fuel]}, ${GEARBOX[w.gearbox]}<br>${esc(w.color)}</p>
      <p class="cartel-dim">${km(w.km)}</p>
      <p class="cartel-note">${esc(w.note)}</p>
      <p class="cartel-price"><span class="dot" data-status="${w.status}"></span>${price(w.price)}<span class="vh">, ${STATE[w.status]}</span></p>
      ${action}
    </div>
  </article>`
}).join('')

/* ── the spotlight: one mechanism, driven by where each work sits ───── */
const bays = [...hang.querySelectorAll('.oeuvre')]
const sections = [...document.querySelectorAll('[data-section]')]
const roomEl = $('[data-room]')
const reduce = matchMedia('(prefers-reduced-motion: reduce)')
let queued = false

function light() {
  queued = false
  const vh = innerHeight
  const mid = vh / 2
  let best = null
  let bestLit = 0
  for (const el of bays) {
    const r = el.firstElementChild.getBoundingClientRect()
    const pass = Math.max(-1, Math.min(1, (r.top + r.height / 2 - mid) / (vh * 0.75)))
    const t = 1 - Math.abs(pass)
    const lit = t * t * (3 - 2 * t)
    el.style.setProperty('--lit', lit.toFixed(3))
    el.style.setProperty('--pass', reduce.matches ? '0' : pass.toFixed(3))
    if (lit > bestLit) { bestLit = lit; best = el }
  }
  let room = 'Entrée'
  if (best && bestLit > 0.35) room = `Salle ${best.dataset.n} / ${pad2(total)}`
  else {
    const here = sections.find((s) => { const r = s.getBoundingClientRect(); return r.top <= mid && r.bottom > mid })
    if (here) room = here.dataset.section
  }
  if (roomEl.textContent !== room) roomEl.textContent = room
}
const queue = () => { if (!queued) { queued = true; requestAnimationFrame(light) } }
addEventListener('scroll', queue, { passive: true })
addEventListener('resize', queue)
light()

/* ── liste des œuvres ───────────────────────────────────────────────── */
const filter = { fuel: 'all', avail: 'all', sort: 'none' }
const fuels = [...new Set(works.map((w) => w.fuel))]
$('[data-filter="fuel"]').innerHTML = [['all', 'Toutes'], ...fuels.map((f) => [f, FUEL[f]])]
  .map(([v, label], i) => `<button type="button" data-value="${v}" aria-pressed="${i === 0}">${label}</button>`).join('')

for (const group of document.querySelectorAll('[data-filter]')) {
  group.addEventListener('click', (e) => {
    const btn = e.target.closest('button')
    if (!btn) return
    for (const b of group.children) b.setAttribute('aria-pressed', String(b === btn))
    filter[group.dataset.filter] = btn.dataset.value
    renderList()
  })
}

const sortTh = $('[data-sort-th]')
const NEXT_SORT = { none: 'ascending', ascending: 'descending', descending: 'none' }
const ARROW = { none: '↕', ascending: '↑', descending: '↓' }
$('[data-sort]').addEventListener('click', () => {
  filter.sort = NEXT_SORT[filter.sort]
  sortTh.setAttribute('aria-sort', filter.sort)
  $('[data-sort-arrow]').textContent = ARROW[filter.sort]
  renderList()
})

function renderList() {
  let rows = works.filter((w) => (filter.fuel === 'all' || w.fuel === filter.fuel) && (filter.avail === 'all' || w.status === 'available'))
  if (filter.sort !== 'none') rows = [...rows].sort((a, b) => (filter.sort === 'ascending' ? a.price - b.price : b.price - a.price))
  $('[data-rows]').innerHTML = rows.map((w) => {
    const n = pad2(w.n)
    return `
    <tr data-status="${w.status}">
      <td class="c-n">${n}</td>
      <td>
        <a href="#oeuvre-${n}"><span class="t-make">${esc(w.make)}</span><span class="t-model">${esc(w.model)}</span></a>
        <span class="t-meta">${w.year} · ${km(w.km)} · ${FUEL[w.fuel]}</span>
      </td>
      <td class="c-opt">${w.year}</td>
      <td class="c-opt num">${km(w.km)}</td>
      <td class="c-opt">${FUEL[w.fuel]}</td>
      <td class="num"><span class="t-price"><span class="dot" data-status="${w.status}"></span>${price(w.price)}</span>${w.status === 'available' ? '' : `<span class="vh">, ${STATE[w.status]}</span>`}</td>
    </tr>`
  }).join('')
  $('[data-empty]').hidden = rows.length > 0
  $('[data-list-count]').textContent = `${plural(rows.length, 'machine')} sur ${total}`
}
renderList()

/* ── visite privée ──────────────────────────────────────────────────── */
const form = $('[data-form]')
const workSel = $('[data-work]')
const daysEl = $('[data-days]')
const slotsEl = $('[data-slots]')
const msgEl = $('[data-msg]')
const titleOf = (w) => `${w.make} ${w.model}, ${w.year}`
const fmtShort = new Intl.DateTimeFormat('fr-FR', { weekday: 'short', timeZone: 'UTC' })
const fmtLong = new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' })

workSel.innerHTML = `<option value="">Choisir une machine</option>` + works.map((w) =>
  `<option value="${w.n}"${w.status === 'sold' ? ' disabled' : ''}>${esc(titleOf(w))}${w.status === 'sold' ? ' (vendue)' : ''}</option>`).join('')

function bookingDays(now = new Date()) {
  const h = now.getUTCHours() + now.getUTCMinutes() / 60
  const out = []
  for (let i = 0; out.length < 6 && i < 14; i++) {
    const date = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + i))
    const hh = HOURS[date.getUTCDay()]
    if (!hh) continue
    const slots = []
    for (let s = hh[0]; s < hh[1]; s++) if (i > 0 || s >= h + 1) slots.push(s)
    if (slots.length) out.push({ date, slots, today: i === 0 })
  }
  return out
}
const days = bookingDays()

daysEl.innerHTML = days.map((d, i) => {
  const short = d.today ? 'Auj.' : fmtShort.format(d.date).replace('.', '')
  return `<div class="tile"><input type="radio" name="day" id="day-${i}" value="${i}"><label for="day-${i}" aria-label="${fmtLong.format(d.date)}">${short}<b>${d.date.getUTCDate()}</b></label></div>`
}).join('')

function renderSlots() {
  const day = days[form.day.value]
  const keep = form.slot?.value
  if (!day) { slotsEl.innerHTML = `<p class="cartel-note">Choisissez d'abord un jour.</p>`; return }
  slotsEl.innerHTML = day.slots.map((s) =>
    `<div class="tile"><input type="radio" name="slot" id="slot-${s}" value="${s}"${String(s) === keep ? ' checked' : ''}><label for="slot-${s}">${pad2(s)}:00</label></div>`).join('')
}
renderSlots()

/* the invitation: each line lands in gold ink when it changes */
const lines = Object.fromEntries([...document.querySelectorAll('[data-line]')].map((el) => [el.dataset.line, el]))
const PLACEHOLDER = { work: 'À choisir', when: 'À choisir', name: 'Votre nom' }
function write(key, value) {
  const el = lines[key]
  const text = value || PLACEHOLDER[key]
  if (el.textContent === text) return
  el.textContent = text
  el.toggleAttribute('data-empty', !value)
  el.classList.remove('ink')
  if (value) { void el.offsetWidth; el.classList.add('ink') }
}
lines.work.toggleAttribute('data-empty', true)
lines.when.toggleAttribute('data-empty', true)
lines.name.toggleAttribute('data-empty', true)

function selection() {
  const w = works.find((x) => String(x.n) === workSel.value)
  const day = days[form.day.value]
  const slot = form.slot?.value
  return {
    work: w ? titleOf(w) : '',
    when: day && slot ? `${fmtLong.format(day.date)}, ${pad2(slot)}:00` : '',
    name: $('[data-name]').value.trim(),
    tel: $('[data-tel]').value.trim(),
  }
}
function update() {
  const s = selection()
  write('work', s.work)
  write('when', s.when)
  write('name', s.name)
  if (msgEl.textContent) msgEl.textContent = ''
}

form.addEventListener('change', (e) => { if (e.target.name === 'day') renderSlots(); update() })
form.addEventListener('input', update)

document.addEventListener('click', (e) => {
  const link = e.target.closest('[data-book]')
  if (!link) return
  workSel.value = link.dataset.book
  update()
})

form.addEventListener('submit', (e) => {
  e.preventDefault()
  const s = selection()
  const missing = [!s.work && 'une machine', !s.when && 'un jour et une heure'].filter(Boolean)
  if (missing.length) { msgEl.textContent = `Choisissez ${missing.join(' et ')}.`; return }
  const text = [
    'Bonjour Mansour Motors, je souhaite une visite privée.',
    `Machine : ${s.work}`,
    `Créneau : ${s.when}`,
    s.name && `Nom : ${s.name}`,
    s.tel && `Téléphone : ${s.tel}`,
  ].filter(Boolean).join('\n')
  window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`, '_blank', 'noopener')
})
