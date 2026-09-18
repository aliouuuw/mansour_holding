import { cars, FUEL, GEARBOX, STATE, fcfa, km, pad2, esc, $, $$, card, chrome, slotPicker, waLink, reduceMotion } from './common.js'

const id = Number(new URLSearchParams(location.search).get('id'))
const car = cars.find((c) => c.n === id) || cars[0]
const title = `${car.make} ${car.model}`
const sold = car.status === 'sold'

chrome({ waText: `Bonjour Mansour Motors, une question sur le ${title} (${car.year}).` })
document.title = `${title}, Mansour Motors`

/* ── the sticky info column ────────────────────────────────────────── */
$('[data-crumb]').textContent = title
$('[data-make]').textContent = car.make
$('[data-model]').textContent = car.model
$('[data-keyspecs]').innerHTML = `
  <div><dt>Année</dt><dd>${car.year}</dd></div>
  <div><dt>Kilométrage</dt><dd>${km(car.km)}</dd></div>
  <div><dt>Énergie</dt><dd>${FUEL[car.fuel]}</dd></div>`
$('[data-price]').textContent = fcfa(car.price)
const stateEl = $('[data-stock]')
stateEl.dataset.status = car.status
stateEl.textContent = { available: 'Disponible au showroom', reserved: 'Réservé, visite possible', sold: 'Vendu' }[car.status]

$('[data-actions]').innerHTML = sold
  ? `<a class="btn" href="index.html#alerte">Être prévenu d'un modèle similaire <span class="arr" aria-hidden="true">↗</span></a>`
  : `<a class="btn" href="#visite">Réserver une visite <span class="arr" aria-hidden="true">↗</span></a>
     <a class="link" href="${waLink(`Bonjour Mansour Motors, une question sur le ${title} (${car.year}).`)}" target="_blank" rel="noopener">Poser une question sur WhatsApp</a>
     <a class="link" href="tel:+221331234567">Appeler le showroom</a>`

/* ── photos: the data holds one photograph per car for now, so the
   gallery shows three framings of it to exercise the counter ──────── */
const framings = [
  { pos: car.pos, zoom: 1, alt: `${title}, ${car.color}` },
  { pos: '24% 58%', zoom: 1.7, alt: `${title}, détail avant` },
  { pos: '76% 60%', zoom: 1.8, alt: `${title}, détail arrière` },
]
const photosEl = $('[data-photos]')
photosEl.innerHTML = framings.map((f, i) => `
  <figure class="frame photo"${i ? '' : ` style="view-transition-name:car-${car.n}"`}>
    <img src="${esc(car.img)}" alt="${esc(f.alt)}" style="--pos:${f.pos};--zoom:${f.zoom}" loading="${i ? 'lazy' : 'eager'}" decoding="async">
    <span class="sweep" aria-hidden="true"></span>
  </figure>`).join('')
const photos = $$('.photo', photosEl)
const photoCount = $('[data-photo-count]')
const photoProgress = $('[data-photo-progress]')
const showPhoto = (i) => {
  photoCount.innerHTML = `<b>${pad2(i + 1)}</b> / ${pad2(photos.length)}`
  photoProgress.style.setProperty('--p', String((i + 1) / photos.length))
}
showPhoto(0)
// on desktop the photos stack and the page scrolls; on phones they sit in a swipe
// strip. Either way the counter follows the photo that fills the view.
const strip = matchMedia('(max-width: 860px)').matches
const ratios = new Map()
const photoIO = new IntersectionObserver((entries) => {
  for (const e of entries) ratios.set(e.target, e.intersectionRatio)
  let best = 0
  let bestRatio = -1
  photos.forEach((p, i) => { const r = ratios.get(p) ?? 0; if (r > bestRatio) { bestRatio = r; best = i } })
  showPhoto(best)
}, { root: strip ? photosEl : null, threshold: [0, .25, .5, .75, 1] })
photos.forEach((p) => photoIO.observe(p))
if (!reduceMotion.matches) {
  const lit = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue
      $('.sweep', e.target).animate([
        { transform: 'translateX(-50%)', opacity: 1 },
        { transform: 'translateX(42%)', opacity: 1, offset: .8 },
        { transform: 'translateX(50%)', opacity: 0 },
      ], { duration: 1300, delay: 150, easing: 'cubic-bezier(.16, 1, .3, 1)' })
      lit.unobserve(e.target)
    }
  }, { root: strip ? photosEl : null, threshold: .6 })
  photos.forEach((p) => lit.observe(p))
}

/* ── facts: only what the record holds ─────────────────────────────── */
const fact = (label, value) => `<div><dt>${label}</dt><dd>${value}</dd></div>`
$('[data-facts]').innerHTML = [
  fact('Année', car.year),
  fact('Kilométrage', km(car.km)),
  fact('Énergie', FUEL[car.fuel]),
  fact('Boîte', GEARBOX[car.gearbox]),
  fact('Couleur', `<span class="swatch" style="background:${car.swatch}" aria-hidden="true"></span>${esc(car.color)}`),
  fact('Statut', STATE[car.status]),
  fact('Référence', `N° ${pad2(car.n)}`),
  car.vin && fact('VIN', esc(car.vin)),
].filter(Boolean).join('')
$('[data-desc]').textContent = car.note

/* ── section tabs follow the reading position ──────────────────────── */
const tabs = $$('[data-tabs] a')
const ind = $('[data-tabs] .ind')
const setTab = (hash) => {
  const on = tabs.find((a) => a.hash === hash)
  if (!on) return
  for (const a of tabs) if (a === on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current')
  // one transform, so the light slides and stretches without touching layout
  ind.style.transform = `translateX(${on.offsetLeft}px) scaleX(${on.offsetWidth / 100})`
}
const sections = tabs.map((a) => $(a.hash)).filter((s) => s && !s.hidden)
const spy = new IntersectionObserver((entries) => {
  for (const e of entries) if (e.isIntersecting) setTab(`#${e.target.id}`)
}, { rootMargin: '-35% 0px -60% 0px' })
sections.forEach((s) => spy.observe(s))
setTab('#photos')

/* ── visit request ─────────────────────────────────────────────────── */
const visit = $('[data-visit]')
if (sold) {
  // a sold car cannot be visited: the section and its tab leave the page
  $('#visite').hidden = true
  tabs.find((a) => a.hash === '#visite').hidden = true
} else {
  const msg = $('[data-msg]', visit)
  const when = slotPicker(visit, { onChange: () => { msg.textContent = '' } })
  visit.addEventListener('submit', (e) => {
    e.preventDefault()
    const slot = when()
    if (!slot) { msg.textContent = 'Choisissez un jour et une heure.'; return }
    const f = visit.elements
    const text = [
      'Bonjour Mansour Motors, je souhaite voir un véhicule au showroom.',
      `Véhicule : ${title}, ${car.year} (N° ${pad2(car.n)})`,
      `Créneau : ${slot}`,
      f.name.value.trim() && `Nom : ${f.name.value.trim()}`,
      f.tel.value.trim() && `Téléphone : ${f.tel.value.trim()}`,
    ].filter(Boolean).join('\n')
    window.open(waLink(text), '_blank', 'noopener')
  })
}

/* ── phones: the price bar arrives when the main price leaves ──────── */
const bar = $('[data-bar]')
const barCta = $('[data-bar-cta]')
$('[data-bar-name]').textContent = title
$('[data-bar-price]').textContent = fcfa(car.price)
if (sold) { barCta.textContent = 'Être prévenu'; barCta.href = 'index.html#alerte' }
new IntersectionObserver(([e]) => {
  const on = !e.isIntersecting && e.boundingClientRect.top < 0
  bar.classList.toggle('is-on', on)
  bar.setAttribute('aria-hidden', String(!on))
  barCta.tabIndex = on ? 0 : -1
}).observe($('[data-price-anchor]'))

/* ── other cars: the nearest in price ──────────────────────────────── */
const others = cars.filter((c) => c !== car).sort((a, b) => Math.abs(a.price - car.price) - Math.abs(b.price - car.price)).slice(0, 4)
$('[data-others]').innerHTML = others.map((c) => card(c)).join('')

if (reduceMotion.matches) ind.style.transition = 'none'
