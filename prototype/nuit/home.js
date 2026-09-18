import { cars, brands, modelsOf, FUEL, fcfa, km, pad2, esc, $, $$, card, chrome, detailUrl, reduceMotion, waLink } from './common.js'

chrome()

/* ── search: the model list follows the brand ──────────────────────── */
const makeSel = $('[data-make]')
const modelSel = $('[data-model]')
makeSel.innerHTML = '<option value="">Toutes les marques</option>' + brands.map((b) => `<option>${esc(b)}</option>`).join('')
const fillModels = () => {
  const make = makeSel.value
  modelSel.disabled = !make
  modelSel.innerHTML = `<option value="">${make ? 'Tous les modèles' : 'Choisir une marque'}</option>` +
    (make ? modelsOf(make).map((m) => `<option>${esc(m)}</option>`).join('') : '')
}
makeSel.addEventListener('change', fillModels)
fillModels()
// empty fields stay out of the URL
$('[data-search]').addEventListener('formdata', (e) => {
  for (const [k, v] of [...e.formData.entries()]) if (!v) e.formData.delete(k)
})

/* ── featured stage: the four highest-priced machines in stock ─────── */
const available = cars.filter((c) => c.status === 'available')
const featured = [...available].sort((a, b) => b.price - a.price).slice(0, 4)
const zoomOf = (c) => (1 + (c.zoom - 1) * 0.35).toFixed(3)

$('[data-slides]').innerHTML = featured.map((c, i) => {
  const img = `style="--pos:${c.pos};--zoom:${zoomOf(c)}" loading="${i === 0 ? 'eager' : 'lazy'}" decoding="async"`
  return `
  <article class="slide${i === 0 ? ' is-active' : ''}" style="--chars:${c.model.length}" aria-roledescription="diapositive" aria-label="${i + 1} sur ${featured.length}"${i === 0 ? '' : ' aria-hidden="true"'}>
    <div class="slide-head">
      <p class="make">${esc(c.make)}</p>
      <h2 class="slide-model"><span>${esc(c.model)}</span></h2>
    </div>
    <div class="slide-car">
      <div class="viewfinder" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
      <div class="car-stack">
        <a class="frame car-frame" href="${detailUrl(c)}" tabindex="-1" aria-hidden="true">
          <img src="${esc(c.img)}" alt="" ${img}>
          <span class="sweep"></span>
        </a>
        <div class="reflection" aria-hidden="true"><div class="flip"><img src="${esc(c.img)}" alt="" ${img}></div></div>
      </div>
      <p class="plate"><b>N° ${pad2(c.n)}</b><span><i style="background:${c.swatch}"></i>${esc(c.color)}</span></p>
      <div class="readout">
        <dl>
          <dt>Année</dt><dd>${c.year}</dd>
          <dt>Kilométrage</dt><dd>${km(c.km)}</dd>
          <dt>Énergie</dt><dd>${FUEL[c.fuel]}</dd>
        </dl>
        <p class="price">${fcfa(c.price)}</p>
        <a class="btn" href="${detailUrl(c)}"${i === 0 ? '' : ' tabindex="-1"'}>Voir le véhicule <span class="arr" aria-hidden="true">↗</span></a>
      </div>
    </div>
  </article>`
}).join('')

const slides = $$('.slide')
const countEl = $('[data-count]')
const progressEl = $('[data-progress]')
const stage = $('[data-stage]')
const DWELL = 7000
const EASE = 'cubic-bezier(.16, 1, .3, 1)'
// light travels at an even, deliberate pace: ease in and out, not a snap
const SWEEP = { duration: 1400, easing: 'cubic-bezier(.65, 0, .3, 1)' }
let index = 0
let elapsed = 0
let last = 0
let paused = false

/* the arrival: the house light sweeps across the plinth and reveals the car behind
   it, the name rises into place, and the viewfinder locks onto the frame. Every
   element's resting state is fully visible; this only plays on top of it. */
const CORNERS = [[-1, -1], [1, -1], [-1, 1], [1, 1]]
function arrive(s, dir) {
  // a background tab has no clock: skip the show rather than leave the car unlit
  if (reduceMotion.matches || !s.animate || document.hidden) return
  const from = dir > 0 ? 'inset(0 100% 0 0)' : 'inset(0 0 0 100%)'
  $('.car-stack', s).animate([{ clipPath: from }, { clipPath: 'inset(0 0 0 0)' }], SWEEP)
  $('.sweep', s).animate([
    // the band rides just inside the reveal edge, so the car is lit as it appears
    { transform: `translateX(${dir > 0 ? -54 : 54}%)`, opacity: 1 },
    { transform: `translateX(${dir > 0 ? 38 : -38}%)`, opacity: 1, offset: .8 },
    { transform: `translateX(${dir > 0 ? 46 : -46}%)`, opacity: 0 },
  ], SWEEP)
  $('.slide-model span', s).animate([{ transform: 'translateY(105%)' }, { transform: 'none' }], { duration: 900, delay: 90, easing: EASE, fill: 'backwards' })
  $('.plate', s).animate([{ transform: 'translateY(-14px)' }, { transform: 'none' }], { duration: 900, delay: 320, easing: EASE, fill: 'backwards' })
  $('.readout', s).animate([{ transform: 'translateY(14px)' }, { transform: 'none' }], { duration: 900, delay: 260, easing: EASE, fill: 'backwards' })
  $$('.viewfinder i', s).forEach((el, k) => {
    const [x, y] = CORNERS[k]
    el.animate([
      { transform: `translate(${x * 26}px, ${y * 26}px)`, opacity: 0 },
      { transform: 'none', opacity: .8 },
    ], { duration: 750, delay: 520, easing: EASE, fill: 'backwards' })
  })
}

let leaving = null
function show(next, dir = 1, animate = true) {
  const prev = slides[index]
  index = (next + slides.length) % slides.length
  if (leaving) { clearTimeout(leaving.t); leaving.el.classList.remove('is-leaving') }
  // anything still playing on the outgoing car ends at its lit, resting state
  for (const a of prev.getAnimations({ subtree: true })) a.finish()
  if (animate && !reduceMotion.matches && prev !== slides[index]) {
    prev.classList.add('is-leaving')
    leaving = { el: prev, t: setTimeout(() => prev.classList.remove('is-leaving'), SWEEP.duration) }
  }
  slides.forEach((s, i) => {
    const on = i === index
    s.classList.toggle('is-active', on)
    s.toggleAttribute('aria-hidden', !on)
    const btn = $('.readout .btn', s)
    if (on) btn.removeAttribute('tabindex'); else btn.setAttribute('tabindex', '-1')
    // only the visible car carries the name its detail page will pick up
    $('.car-frame', s).style.viewTransitionName = on ? `car-${featured[i].n}` : 'none'
  })
  countEl.innerHTML = `<b>${pad2(index + 1)}</b> / ${pad2(slides.length)}`
  elapsed = 0
  progressEl.style.setProperty('--p', reduceMotion.matches ? String((index + 1) / slides.length) : '0')
  if (animate) arrive(slides[index], dir)
}
$('[data-prev]').addEventListener('click', () => show(index - 1, -1))
$('[data-next]').addEventListener('click', () => show(index + 1, 1))
stage.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') show(index - 1, -1)
  if (e.key === 'ArrowRight') show(index + 1, 1)
})
// the lit part of the plinth is the time left on this car; it holds while you look
stage.addEventListener('pointerenter', () => { paused = true })
stage.addEventListener('pointerleave', () => { paused = false })
stage.addEventListener('focusin', () => { paused = true })
stage.addEventListener('focusout', () => { paused = false })

function tick(t) {
  const dt = last ? t - last : 0
  last = t
  if (!paused && !document.hidden) {
    elapsed += dt
    if (elapsed >= DWELL) show(index + 1, 1)
    else progressEl.style.setProperty('--p', (elapsed / DWELL).toFixed(4))
  }
  requestAnimationFrame(tick)
}
show(0, 1, false)
// the first car gets its arrival once its photograph is ready to be lit
const firstImg = $('.car-frame img', slides[0])
const firstArrival = () => { if (index === 0) arrive(slides[0], 1) }
if (firstImg.complete) firstArrival()
else firstImg.addEventListener('load', firstArrival, { once: true })
if (!reduceMotion.matches) requestAnimationFrame(tick)

/* ── in stock row: everything not already on the stage ─────────────── */
const rest = cars.filter((c) => !featured.includes(c))
$('[data-row]').innerHTML = rest.map((c) => card(c)).join('')
$('[data-stock-count]').textContent = `${available.length} disponibles sur ${cars.length} véhicules`
$('[data-all]').firstChild.textContent = `Voir les ${cars.length} véhicules `

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
