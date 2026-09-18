import { cars, brands, modelsOf, fcfa, km, pad2, esc, $, $$, card, chrome, detailUrl, reduceMotion, waLink } from './common.js'

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
const firstSentence = (s) => (s.match(/^[^.]+\./) || [s])[0]

$('[data-slides]').innerHTML = featured.map((c, i) => `
  <article class="slide${i === 0 ? ' is-active' : ''}" aria-roledescription="diapositive" aria-label="${i + 1} sur ${featured.length}"${i === 0 ? '' : ' aria-hidden="true"'}>
    <div class="slide-text">
      <p class="make">${esc(c.make)}</p>
      <h2 class="model">${esc(c.model)}</h2>
      <p class="slide-tag">${esc(firstSentence(c.note))}</p>
      <dl class="specs">
        <div><dt>Année</dt><dd>${c.year}</dd></div>
        <div><dt>Kilométrage</dt><dd>${km(c.km)}</dd></div>
        <div><dt>Prix</dt><dd>${fcfa(c.price)}</dd></div>
      </dl>
      <a class="btn" href="${detailUrl(c)}"${i === 0 ? '' : ' tabindex="-1"'}>Voir le véhicule <span class="arr" aria-hidden="true">↗</span></a>
    </div>
    <div class="frame slide-img">
      <img src="${esc(c.img)}" alt="${esc(`${c.make} ${c.model}, ${c.color}`)}" style="--pos:${c.pos};--zoom:${(1 + (c.zoom - 1) * 0.35).toFixed(3)}" loading="${i === 0 ? 'eager' : 'lazy'}" decoding="async">
    </div>
  </article>`).join('')

const slides = $$('.slide')
const countEl = $('[data-count]')
const progressEl = $('[data-progress]')
const stage = $('[data-stage]')
const DWELL = 7000
let index = 0
let elapsed = 0
let last = 0
let paused = false

function show(next, dir = 1) {
  index = (next + slides.length) % slides.length
  slides.forEach((s, i) => {
    const on = i === index
    s.classList.toggle('is-active', on)
    s.style.setProperty('--dir', String(dir))
    s.toggleAttribute('aria-hidden', !on)
    const link = $('a', s)
    if (on) link.removeAttribute('tabindex'); else link.setAttribute('tabindex', '-1')
  })
  countEl.innerHTML = `<b>${pad2(index + 1)}</b> / ${pad2(slides.length)}`
  elapsed = 0
  progressEl.style.setProperty('--p', reduceMotion.matches ? String((index + 1) / slides.length) : '0')
}
$('[data-prev]').addEventListener('click', () => show(index - 1, -1))
$('[data-next]').addEventListener('click', () => show(index + 1, 1))
stage.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') show(index - 1, -1)
  if (e.key === 'ArrowRight') show(index + 1, 1)
})
// the progress line is the time left on this car; it pauses while you look or read
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
show(0)
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
