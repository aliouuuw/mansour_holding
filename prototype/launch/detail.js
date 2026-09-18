import { cars, FUEL, GEARBOX, STATE, fcfa, km, pad2, esc, $, $$, card, chrome, slotPicker, waLink, status, segThumb, focusOnTouch } from './common.js?v=4'

const id = Number(new URLSearchParams(location.search).get('id'))
const car = cars.find((c) => c.n === id) || cars[0]
const title = `${car.make} ${car.model}`
const sold = car.status === 'sold'
const question = `Bonjour Mansour Motors, une question sur le ${title} (${car.year}).`

chrome({ waText: question })
document.title = `${title}, Mansour Motors`

/* ── head and summary panel ────────────────────────────────────────── */
$('[data-crumb]').textContent = title
$('[data-make]').textContent = car.make
$('[data-model]').textContent = car.model
$('[data-price]').textContent = fcfa(car.price)
$('[data-stock]').innerHTML = status(car)
$('[data-keyspecs]').innerHTML = `
  <div><dt>Année</dt><dd>${car.year}</dd></div>
  <div><dt>Kilométrage</dt><dd>${km(car.km)}</dd></div>
  <div><dt>Énergie</dt><dd>${FUEL[car.fuel]}</dd></div>`
$('[data-actions]').innerHTML = sold
  ? `<a class="btn" href="../#alerte">Être prévenu d'un modèle similaire <span class="arr" aria-hidden="true">→</span></a>`
  : `<a class="btn" href="#visite">Réserver une visite <span class="arr" aria-hidden="true">→</span></a>
     <div class="pair">
       <a class="soft" href="${waLink(question)}" target="_blank" rel="noopener">WhatsApp</a>
       <a class="soft" href="tel:+221331234567">Appeler</a>
     </div>`

/* ── photos: in colour here, this is the car you came for. The data holds
   one photograph per car for now, so the gallery shows three framings. ── */
const framings = [
  { pos: car.pos, zoom: 1, alt: `${title}, ${car.color}` },
  { pos: '24% 58%', zoom: 1.7, alt: `${title}, détail avant` },
  { pos: '76% 60%', zoom: 1.8, alt: `${title}, détail arrière` },
]
const photosEl = $('[data-photos]')
photosEl.innerHTML = framings.map((f, i) => `
  <figure class="media photo is-colour"${i ? '' : ` style="view-transition-name:car-${car.n}"`}>
    <img src="${esc(car.img)}" alt="${esc(f.alt)}" style="--pos:${f.pos};--zoom:${f.zoom}" loading="${i ? 'lazy' : 'eager'}" decoding="async">
  </figure>`).join('')
const photos = $$('.photo', photosEl)
const showPhoto = (i) => {
  $('[data-photo-count]').innerHTML = `<b>${pad2(i + 1)}</b> / ${pad2(photos.length)}`
  $('[data-photo-progress]').style.setProperty('--p', String((i + 1) / photos.length))
}
showPhoto(0)
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

/* ── facts: only what the record holds; figures large and light ────── */
const fact = (label, value, small = false) => `<div><dt>${label}</dt><dd${small ? ' class="small"' : ''}>${value}</dd></div>`
$('[data-facts]').innerHTML = [
  fact('Année', car.year),
  fact('Kilométrage', km(car.km)),
  fact('Énergie', FUEL[car.fuel]),
  fact('Boîte', GEARBOX[car.gearbox]),
  fact('Couleur', `<span class="swatch" style="background:${car.swatch}" aria-hidden="true"></span>${esc(car.color)}`, true),
  fact('Statut', STATE[car.status], true),
  fact('Référence', `N° ${pad2(car.n)}`, true),
  car.vin && fact('VIN', esc(car.vin), true),
].filter(Boolean).join('')
$('[data-desc]').textContent = car.note

/* ── the section tabs follow your reading position ──────────────────── */
const tabsEl = $('[data-tabs]')
const tabs = $$('a', tabsEl)
const setTab = (hash) => {
  const on = tabs.find((a) => a.hash === hash)
  if (!on) return
  for (const a of tabs) if (a === on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current')
  segThumb(tabsEl)
}
if (sold) {
  // a sold car cannot be visited: the section and its tab leave the page
  $('#visite').hidden = true
  tabs.find((a) => a.hash === '#visite').remove()
  tabs.pop()
}
const spy = new IntersectionObserver((entries) => {
  for (const e of entries) if (e.isIntersecting) setTab(`#${e.target.id}`)
}, { rootMargin: '-35% 0px -60% 0px' })
tabs.map((a) => $(a.hash)).forEach((s) => s && spy.observe(s))
setTab('#photos')
document.fonts?.ready.then(() => segThumb(tabsEl))
addEventListener('resize', () => segThumb(tabsEl))

/* ── visit request ─────────────────────────────────────────────────── */
if (!sold) {
  const visit = $('[data-visit]')
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
if (sold) { barCta.textContent = 'Être prévenu'; barCta.href = '../#alerte' }
new IntersectionObserver(([e]) => {
  const on = !e.isIntersecting && e.boundingClientRect.top < 0
  bar.classList.toggle('is-on', on)
  bar.setAttribute('aria-hidden', String(!on))
  barCta.tabIndex = on ? 0 : -1
}).observe($('[data-price-anchor]'))

/* ── other cars: the nearest in price ──────────────────────────────── */
const others = cars.filter((c) => c !== car).sort((a, b) => Math.abs(a.price - car.price) - Math.abs(b.price - car.price)).slice(0, 3)
const othersEl = $('[data-others]')
othersEl.innerHTML = others.map((c) => card(c)).join('')
focusOnTouch($$('.card', othersEl))
