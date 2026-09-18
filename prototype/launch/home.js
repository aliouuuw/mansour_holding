import { cars, brands, modelsOf, FUEL, HOURS, DAY, STATE, fcfa, km, pad2, esc, $, $$, chrome, detailUrl, status, reduceMotion, waLink } from './common.js?v=5'
import { mountTurntable } from './turntable.js?v=28'

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

/* ── hero: one plate, the same car that fronts the ring ────────────── */
const available = cars.filter((c) => c.status === 'available')
const order = { available: 0, reserved: 1, sold: 2 }
const lineupCars = [...cars].sort((a, b) => order[a.status] - order[b.status] || b.price - a.price)
const star = lineupCars.find((c) => c.status === 'available') || lineupCars[0]
const plateImg = $('[data-hero-img]')
const plateLink = $('[data-hero-link]')
const openLink = $('[data-hero-open]')
const href = detailUrl(star)
plateImg.src = star.img
plateImg.alt = `${star.make} ${star.model}, ${star.color}`
plateImg.style.setProperty('--pos', star.pos)
plateLink.href = href
plateLink.setAttribute('aria-label', `${star.make} ${star.model}`)
openLink.href = href
$('[data-hero-brand]').textContent = star.make
$('[data-hero-model]').textContent = star.model
$('[data-hero-price]').textContent = fcfa(star.price)
$('[data-hero-status]').innerHTML = status(star)
$('[data-hero-specs]').innerHTML = `
  <dt>Année</dt><dd>${star.year}</dd>
  <dt>Kilométrage</dt><dd>${km(star.km)}</dd>
  <dt>Énergie</dt><dd>${FUEL[star.fuel]}</dd>`

/* ── the line-up: a photo ring; scroll orbits it ───────────────────── */
$('[data-lineup-lead]').textContent = `${available.length} disponibles sur ${cars.length}. Faites défiler, ou choisissez un repère sous le plateau.`
try {
  const table = mountTurntable($('[data-lineup]'), {
    drive: 'scroll',
    modes: ['ring', 'list'],
  })
  table.setCars(lineupCars)
} catch (err) {
  $('[data-lineup-lead]').textContent = String(err)
  console.error(err)
}

/* ── the statement inks in, word by word, as you read down the page ── */
const ink = $('[data-ink]')
const words = ink.textContent.trim().split(/\s+/)
ink.innerHTML = words.map((w) => `<span>${esc(w)}</span> `).join('')
const inkSpans = $$('span', ink)

/* the floor plan beside it: one bay per car, in bay order, drawn by status */
const bays = [...cars].sort((a, b) => a.n - b.n)
$('[data-plan]').innerHTML = bays.map((c) => `
  <li><a href="${detailUrl(c)}" data-status="${c.status}" aria-label="Emplacement ${pad2(c.n)} : ${esc(c.make)} ${esc(c.model)}, ${STATE[c.status]}">
    <span class="bay-n">${pad2(c.n)}</span><svg class="bay-car" viewBox="0 0 40 84" aria-hidden="true"><use href="#car-top"/></svg><span class="bay-name">${esc(c.make.split('-')[0])}</span>
  </a></li>`).join('')
const bayLinks = $$('[data-plan] a')

function inkIn() {
  if (reduceMotion.matches) {
    inkSpans.forEach((s) => s.classList.add('on'))
    bayLinks.forEach((b) => b.classList.add('on'))
    return
  }
  const r = ink.getBoundingClientRect()
  const p = Math.min(1, Math.max(0, (innerHeight * 0.82 - r.top) / (r.height + innerHeight * 0.3)))
  const on = Math.round(p * inkSpans.length)
  inkSpans.forEach((s, i) => s.classList.toggle('on', i < on))
  /* the bays light one by one as the sentence is read */
  bayLinks.forEach((b, i) => b.classList.toggle('on', p >= (i + 1) / (bayLinks.length + 1)))
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

/* today's column: a bar that fills from opening to closing time */
function dayBar() {
  const cell = $('.day[aria-current="date"]')
  const hh = HOURS[today]
  if (!cell || !hh) return
  const now = new Date()
  const h = now.getUTCHours() + now.getUTCMinutes() / 60
  cell.style.setProperty('--day', Math.min(1, Math.max(0, (h - hh[0]) / (hh[1] - hh[0]))).toFixed(3))
}
dayBar()
setInterval(dayBar, 60_000)

/* ── the map: a car drives the Corniche and parks at the door as the chapter arrives ─ */
const visit = $('[data-visit]')
const road = $('#drive')
const mapCar = $('[data-car]')
const roadLen = road.getTotalLength()
function driveIn() {
  const r = visit.getBoundingClientRect()
  const p = reduceMotion.matches ? 1 : Math.min(1, Math.max(0, (innerHeight - r.top) / (innerHeight * 0.85)))
  const at = p * roadLen
  const a = road.getPointAtLength(Math.max(0, at - 1))
  const b = road.getPointAtLength(Math.min(roadLen, Math.max(1, at)))
  const pos = road.getPointAtLength(at)
  const deg = Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI + 90
  mapCar.setAttribute('transform', `translate(${pos.x.toFixed(1)} ${pos.y.toFixed(1)}) rotate(${deg.toFixed(1)})`)
}
addEventListener('scroll', () => requestAnimationFrame(driveIn), { passive: true })
driveIn()

/* ── a car's photograph carries into its page: only the clicked one is named ─ */
document.addEventListener('click', (e) => {
  const a = e.target.closest('a[href*="vehicule/?id="]')
  if (!a) return
  for (const el of $$('[style*="view-transition-name"]')) el.style.viewTransitionName = ''
  const plate = a.matches('[data-hero-link], [data-hero-open]')
  const target = plate ? plateImg : $('.media', a)
  if (target) target.style.viewTransitionName = `car-${new URL(a.href).searchParams.get('id')}`
})

/* ── not found? be notified ────────────────────────────────────────── */
const alertForm = $('[data-alert]')
const msg = $('[data-msg]', alertForm)
const preview = $('[data-preview]')
const f = alertForm.elements

/* one builder for the preview and for what is sent, so they never differ */
function alertText(want = f.want.value.trim()) {
  return [
    'Bonjour Mansour Motors, je recherche un véhicule.',
    `Modèle : ${want}`,
    f.budget.value && `Budget maximum : ${f.budget.value}`,
    f.year.value && `Année minimum : ${f.year.value}`,
    f.name.value.trim() && `Nom : ${f.name.value.trim()}`,
    f.tel.value.trim() && `Téléphone : ${f.tel.value.trim()}`,
    'Merci de me prévenir quand un véhicule correspond.',
  ].filter(Boolean).join('\n')
}
function showPreview() {
  const want = f.want.value.trim()
  preview.textContent = alertText(want || '…')
  preview.classList.toggle('is-draft', !want)
}
showPreview()
alertForm.addEventListener('input', () => { msg.textContent = ''; showPreview() })
alertForm.addEventListener('submit', (e) => {
  e.preventDefault()
  if (!f.want.value.trim()) { msg.textContent = 'Indiquez la marque et le modèle recherchés.'; f.want.focus(); return }
  window.open(waLink(alertText()), '_blank', 'noopener')
})
