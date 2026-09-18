import { waypoints, FR } from './data.js'

const roll = document.getElementById('roll')
const coordNow = document.getElementById('coord-now')
const odoOut = document.getElementById('odo')
const prevBtn = document.getElementById('prev')
const nextBtn = document.getElementById('next')
const lampBtn = document.getElementById('lamp')

const pad = n => String(n).padStart(2, '0')
const num = n => n.toLocaleString('fr-FR').replace(/ | /g, ' ')

/* The tulip is drawn from data, not decoration: the départ ball carries the
   odometer origin, the route line runs up to the arrow, and the branch is
   keyed to fuel type — diesel runs straight, essence forks once, hybride
   forks twice. A sold waypoint gets the laterite halt bar across its head. */
function tulip(v) {
  const halt = v.status === 'sold' || v.status === 'reserved'
  const branch =
    v.fuel === 'hybrid'
      ? '<path d="M24 34 L13 24"/><path d="M24 26 L35 16"/>'
      : v.fuel === 'gasoline'
        ? '<path d="M24 30 L35 19"/>'
        : v.fuel === 'electric'
          ? '<path d="M24 32 L15 26 L24 22 L15 16"/>'
          : ''
  return `<svg class="tulip" viewBox="0 0 48 64" role="img" aria-label="Diagramme du point ${pad(v.n)}">
    <circle class="ball" cx="24" cy="56" r="4"/>
    <line x1="24" y1="52" x2="24" y2="12"/>
    <polyline points="17,19 24,10 31,19"/>
    ${branch}
    ${halt ? '<line class="halt" x1="11" y1="14" x2="37" y2="14"/>' : ''}
  </svg>`
}

function stateMark(v) {
  if (v.status === 'sold') return ''
  return `<p class="state state--${v.status}">${FR.status[v.status]}</p>`
}

function waypointHTML(v) {
  return `
  <section class="wp wp--${v.status}" data-n="${v.n}" data-km="${v.km}" aria-label="Point ${pad(v.n)} — ${v.make} ${v.model}">
    <figure class="window">
      <img class="window__img" src="${v.img}" alt="${v.make} ${v.model}, ${v.color}"
           style="object-position:${v.pos}; --zoom:${v.zoom}"
           loading="${v.n <= 2 ? 'eager' : 'lazy'}" decoding="async">
      <span class="window__lamp" aria-hidden="true"></span>
      <span class="window__sweep" aria-hidden="true"></span>
    </figure>

    <div class="paper">
      ${stateMark(v)}
      ${v.status === 'sold' ? '<p class="stamp" aria-hidden="true">Vendu</p>' : ''}

      <div class="wp__head">
        <p class="wp__n">${pad(v.n)}</p>
        ${tulip(v)}
      </div>

      <div class="wp__name">
        <p class="wp__make">${v.make}</p>
        <h2 class="wp__model">${v.model}</h2>
      </div>

      <dl class="col">
        <div class="col__row col__row--dist">
          <dt class="col__k">Compteur</dt><dd class="col__v">${num(v.km)} km</dd>
        </div>
        <div class="col__row"><dt class="col__k">Annee</dt><dd class="col__v">${v.year}</dd></div>
        <div class="col__row"><dt class="col__k">Carburant</dt><dd class="col__v">${FR.fuel[v.fuel]}</dd></div>
        <div class="col__row"><dt class="col__k">Boite</dt><dd class="col__v">${FR.gearbox[v.gearbox]}</dd></div>
        <div class="col__row"><dt class="col__k">Couleur</dt><dd class="col__v">${v.color}</dd></div>
        <div class="col__row col__row--vin"><dt class="col__k">Chassis</dt><dd class="col__v">${v.vin}</dd></div>
      </dl>

      <p class="wp__note">${v.note}</p>

      <div class="wp__foot">
        <p class="price">${num(v.price)}<span class="price__u">FCFA</span></p>
        <div class="actions">
          ${v.status === 'sold'
            ? '<button class="annot" type="button" data-goto="0">revenir au premier point</button>'
            : `<a class="act" href="tel:+221331234567">
                 <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a1 1 0 0 1-1 1A16 16 0 0 1 4 5a1 1 0 0 1 1-1z"/></svg>
                 Appeler pour ce point
               </a>
               <a class="annot" href="mailto:motors@mansour.sn?subject=${encodeURIComponent(v.make + ' ' + v.model)}">ou demander la fiche complete</a>`}
        </div>
      </div>
    </div>
  </section>`
}

roll.innerHTML = waypoints.map(waypointHTML).join('')

/* ── the roll's register ─────────────────────────────────────────
   Every waypoint renders readable with no JS. This only marks which
   one is in register, so the lamp can rake across it.              */

const cards = [...roll.querySelectorAll('.wp')]
let live = 0

const io = new IntersectionObserver(
  entries => {
    entries.forEach(e => {
      if (e.intersectionRatio > 0.55) {
        e.target.classList.add('is-live')
        live = cards.indexOf(e.target)
        register(live)
      } else {
        e.target.classList.remove('is-live')
      }
    })
  },
  { root: roll, threshold: [0, 0.55, 1] }
)
cards.forEach(c => io.observe(c))

/* the distance column counts up as the roll travels */
let odoShown = 0
let raf = null
function register(i) {
  const v = waypoints[i]
  coordNow.textContent = pad(v.n)
  prevBtn.disabled = i === 0
  nextBtn.disabled = i === cards.length - 1

  const target = waypoints.slice(0, i + 1).reduce((s, w) => s + w.km, 0)
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    odoShown = target
    odoOut.textContent = num(target)
    return
  }
  cancelAnimationFrame(raf)
  const from = odoShown
  const t0 = performance.now()
  const step = now => {
    const p = Math.min(1, (now - t0) / 620)
    const eased = 1 - Math.pow(1 - p, 4)
    odoShown = Math.round(from + (target - from) * eased)
    odoOut.textContent = num(odoShown)
    if (p < 1) raf = requestAnimationFrame(step)
  }
  raf = requestAnimationFrame(step)
}

/* the knurled knobs, and the same detent from the keyboard */
/* scrollIntoView is fought by the snap engine inside a snap container;
   scrolling the roll itself lands on the detent every time. */
const goTo = i => {
  const n = Math.max(0, Math.min(cards.length - 1, i))
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
  roll.scrollTo({ top: n * roll.clientHeight, behavior: reduce ? 'auto' : 'smooth' })
}
prevBtn.addEventListener('click', () => goTo(live - 1))
nextBtn.addEventListener('click', () => goTo(live + 1))

roll.addEventListener('click', e => {
  const b = e.target.closest('[data-goto]')
  if (b) goTo(Number(b.dataset.goto))
})

addEventListener('keydown', e => {
  if (e.target.closest('a, button, input, textarea')) return
  if (e.key === 'ArrowDown' || e.key === 'PageDown') { e.preventDefault(); goTo(live + 1) }
  if (e.key === 'ArrowUp' || e.key === 'PageUp') { e.preventDefault(); goTo(live - 1) }
  if (e.key === 'Home') { e.preventDefault(); goTo(0) }
  if (e.key === 'End') { e.preventDefault(); goTo(cards.length - 1) }
})

/* the lamp */
lampBtn.addEventListener('click', () => {
  const on = lampBtn.getAttribute('aria-pressed') === 'true'
  lampBtn.setAttribute('aria-pressed', String(!on))
  document.body.classList.toggle('lamp-off', on)
})

register(0)
