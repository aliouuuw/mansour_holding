import { cars, brands, modelsOf, FUEL, HOURS, DAY, fcfa, km, pad2, esc, $, $$, chrome, detailUrl, status, reduceMotion, waLink } from './common.js'

chrome()

/* ── search dock: the model list follows the brand ─────────────────── */
const makeSel = $('[data-make]')
const modelSel = $('[data-model]')
makeSel.innerHTML = '<option value="">Toutes</option>' + brands.map((b) => `<option>${esc(b)}</option>`).join('')
const fillModels = () => {
  const make = makeSel.value
  modelSel.disabled = !make
  modelSel.innerHTML = `<option value="">${make ? 'Tous' : 'Marque d\'abord'}</option>` +
    (make ? modelsOf(make).map((m) => `<option>${esc(m)}</option>`).join('') : '')
}
makeSel.addEventListener('change', fillModels)
fillModels()
$('[data-search]').addEventListener('formdata', (e) => {
  for (const [k, v] of [...e.formData.entries()]) if (!v) e.formData.delete(k)
})

/* ── hero: the four highest-priced cars in stock ───────────────────── */
const available = cars.filter((c) => c.status === 'available')
const featured = [...available].sort((a, b) => b.price - a.price).slice(0, 4)
const media = $('[data-hero-media]')
const dots = $('[data-hero-dots]')
const zoomOf = (c) => (1 + (c.zoom - 1) * 0.3).toFixed(3)

media.insertAdjacentHTML('afterbegin', featured.map((c, i) => `
  <figure class="hero-slide${i === 0 ? ' is-on' : ''}" data-n="${c.n}">
    <img src="${esc(c.img)}" alt="${esc(`${c.make} ${c.model}, ${c.color}`)}" style="--pos:${c.pos};--zoom:${zoomOf(c)}" decoding="async">
  </figure>`).join(''))
dots.innerHTML = featured.map((c, i) => `<button type="button" aria-label="${esc(`${c.make} ${c.model}`)}" aria-current="${i === 0}"><i></i></button>`).join('')

const slides = $$('.hero-slide', media)
const dotBtns = $$('button', dots)
const brandEl = $('[data-hero-brand]')
const modelEl = $('[data-hero-model]')
const priceEl = $('[data-hero-price]')
const EASE = 'cubic-bezier(.16, 1, .3, 1)'
const DWELL = 7000
let index = 0
let elapsed = 0
let last = 0
let paused = false

// words change by sliding up out of their line, the new ones rising in behind
function swap(el, text, delay = 0) {
  if (el.textContent === text) return
  el.textContent = text
  if (reduceMotion.matches || document.hidden) return
  el.animate([{ transform: 'translateY(105%)' }, { transform: 'none' }], { duration: 850, delay, easing: EASE, fill: 'backwards' })
}

function show(i, animate = true) {
  index = (i + featured.length) % featured.length
  const c = featured[index]
  slides.forEach((s, k) => s.classList.toggle('is-on', k === index))
  dotBtns.forEach((b, k) => b.setAttribute('aria-current', String(k === index)))
  const run = animate ? swap : (el, t) => { el.textContent = t }
  run(brandEl, c.make)
  run(modelEl, c.model, 70)
  priceEl.textContent = fcfa(c.price)
  $('[data-hero-specs]').innerHTML = `
    <dt>Année</dt><dd>${c.year}</dd>
    <dt>Kilométrage</dt><dd>${km(c.km)}</dd>
    <dt>Énergie</dt><dd>${FUEL[c.fuel]}</dd>`
  $('[data-hero-status]').innerHTML = status(c)
  $('[data-hero-link]').href = detailUrl(c)
  elapsed = 0
  dotBtns[index].style.setProperty('--p', reduceMotion.matches ? '1' : '0')
}
dotBtns.forEach((b, k) => b.addEventListener('click', () => show(k)))
const hero = $('[data-hero]')
hero.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') show(index - 1)
  if (e.key === 'ArrowRight') show(index + 1)
})
// the dot fills with the time left on this car, and holds while you look
media.addEventListener('pointerenter', () => { paused = true })
media.addEventListener('pointerleave', () => { paused = false })
hero.addEventListener('focusin', () => { paused = true })
hero.addEventListener('focusout', () => { paused = false })
function tick(t) {
  const dt = last ? t - last : 0
  last = t
  if (!paused && !document.hidden) {
    elapsed += dt
    if (elapsed >= DWELL) show(index + 1)
    else dotBtns[index].style.setProperty('--p', (elapsed / DWELL).toFixed(4))
  }
  requestAnimationFrame(tick)
}
show(0, false)
if (!reduceMotion.matches) requestAnimationFrame(tick)

/* ── the line-up: every car in stock, sold last ────────────────────── */
const order = { available: 0, reserved: 1, sold: 2 }
const lineupCars = [...cars].sort((a, b) => order[a.status] - order[b.status] || b.price - a.price)
const lineup = $('[data-lineup]')
const pin = $('.lineup-pin', lineup)
const track = $('[data-track]')
track.innerHTML = lineupCars.map((c) => `
  <a class="slot" href="${detailUrl(c)}" data-n="${c.n}">
    <div class="media"><img src="${esc(c.img)}" alt="${esc(`${c.make} ${c.model}`)}" style="--pos:${c.pos}" decoding="async"></div>
    <div class="slot-body">
      <p class="brand">${esc(c.make)}</p>
      <h3 class="slot-model">${esc(c.model)}</h3>
      <p class="meta"><span>${c.year}</span><span>${km(c.km)}</span><span>${FUEL[c.fuel]}</span></p>
      <p class="slot-foot"><span class="slot-price">${fcfa(c.price)}</span>${status(c)}</p>
    </div>
  </a>`).join('')
$('[data-lineup-lead]').textContent = `${available.length} disponibles sur ${cars.length}. Faites défiler pour passer d'un véhicule à l'autre.`
const slots = $$('.slot', track)
const countEl = $('[data-lineup-count]')
const nameEl = $('[data-lineup-name]')
const rail = $('[data-lineup-rail]')

/* on a wide screen the section pins and your vertical scroll drives the cars
   sideways; on a phone the row is a plain swipe. Either way, the car nearest
   the middle of the screen is the one in colour. */
const pinned = () => innerWidth > 860 && !reduceMotion.matches
let shift = 0
function measure() {
  if (pinned()) {
    const lastSlot = slots[slots.length - 1]
    const pad = parseFloat(getComputedStyle(track).paddingRight)
    shift = Math.max(0, lastSlot.offsetLeft + lastSlot.offsetWidth + pad - innerWidth)
    lineup.style.height = `${pin.offsetHeight + shift}px`
  } else {
    shift = 0
    lineup.style.height = ''
    track.style.transform = ''
  }
  follow()
}
let focused = -1
function follow() {
  let p
  if (pinned()) {
    const top = lineup.getBoundingClientRect().top
    p = shift ? Math.min(1, Math.max(0, -top / shift)) : 0
    track.style.transform = `translate3d(${-p * shift}px, 0, 0)`
  } else {
    const max = track.scrollWidth - track.clientWidth
    p = max > 0 ? track.scrollLeft / max : 0
  }
  rail.style.setProperty('--p', String(Math.max(p, 1 / slots.length)))
  const mid = innerWidth / 2
  let best = 0
  let dist = Infinity
  slots.forEach((s, i) => {
    const r = s.getBoundingClientRect()
    const d = Math.abs(r.left + r.width / 2 - mid)
    if (d < dist) { dist = d; best = i }
  })
  if (best !== focused) {
    focused = best
    slots.forEach((s, i) => s.classList.toggle('is-focus', i === best))
    const c = lineupCars[best]
    countEl.innerHTML = `<b>${pad2(best + 1)}</b> / ${pad2(slots.length)}`
    nameEl.textContent = `${c.make} ${c.model}`
  }
}
let queued = false
const queue = () => { if (!queued) { queued = true; requestAnimationFrame(() => { queued = false; follow() }) } }
addEventListener('scroll', queue, { passive: true })
track.addEventListener('scroll', queue, { passive: true })
addEventListener('resize', measure)
measure()

/* ── the statement inks in, word by word, as you read down the page ── */
const ink = $('[data-ink]')
const words = ink.textContent.trim().split(/\s+/)
ink.innerHTML = words.map((w) => `<span>${esc(w)}</span> `).join('')
const inkSpans = $$('span', ink)
function inkIn() {
  if (reduceMotion.matches) { inkSpans.forEach((s) => s.classList.add('on')); return }
  const r = ink.getBoundingClientRect()
  const p = Math.min(1, Math.max(0, (innerHeight * 0.82 - r.top) / (r.height + innerHeight * 0.3)))
  const on = Math.round(p * inkSpans.length)
  inkSpans.forEach((s, i) => s.classList.toggle('on', i < on))
}
addEventListener('scroll', () => requestAnimationFrame(inkIn), { passive: true })
inkIn()

/* ── the week: the real opening hours, today raised ────────────────── */
const today = new Date().getUTCDay()
$('[data-week]').innerHTML = [1, 2, 3, 4, 5, 6, 0].map((d) => {
  const hh = HOURS[d]
  const name = DAY[d][0].toUpperCase() + DAY[d].slice(1, 3) + '.'
  return `<div class="day"${d === today ? ' aria-current="date"' : ''}${hh ? '' : ' data-closed'}>
    <b>${name}</b><span>${hh ? `${hh[0]}h<br>${hh[1]}h` : 'Fermé'}</span>
  </div>`
}).join('')

/* ── a car's photograph carries into its page: only the clicked one is named ─ */
document.addEventListener('click', (e) => {
  const a = e.target.closest('a[href*="vehicule/?id="]')
  if (!a) return
  for (const el of $$('[style*="view-transition-name"]')) el.style.viewTransitionName = ''
  const target = a.matches('[data-hero-link]') ? slides[index] : $('.media', a)
  if (target) target.style.viewTransitionName = `car-${new URL(a.href).searchParams.get('id')}`
})

/* ── not found? be notified ────────────────────────────────────────── */
const alertForm = $('[data-alert]')
const msg = $('[data-msg]', alertForm)
alertForm.addEventListener('input', () => { msg.textContent = '' })
alertForm.addEventListener('submit', (e) => {
  e.preventDefault()
  const f = alertForm.elements
  const want = f.want.value.trim()
  if (!want) { msg.textContent = 'Indiquez la marque et le modèle recherchés.'; f.want.focus(); return }
  const text = [
    'Bonjour Mansour Motors, je recherche un véhicule.',
    `Modèle : ${want}`,
    f.budget.value && `Budget maximum : ${f.budget.value}`,
    f.year.value && `Année minimum : ${f.year.value}`,
    f.name.value.trim() && `Nom : ${f.name.value.trim()}`,
    f.tel.value.trim() && `Téléphone : ${f.tel.value.trim()}`,
    'Merci de me prévenir quand un véhicule correspond.',
  ].filter(Boolean).join('\n')
  window.open(waLink(text), '_blank', 'noopener')
})
