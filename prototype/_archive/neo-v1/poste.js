import { waypoints, FR } from '../data.js'

const $  = s => document.querySelector(s)
const $$ = s => [...document.querySelectorAll(s)]
const num = n => n.toLocaleString('fr-FR').replace(/ | /g, ' ')
const pad = n => String(n).padStart(2, '0')
const clamp = (v, a, b) => Math.min(b, Math.max(a, v))
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches

const N = waypoints.length
const avail = waypoints.filter(v => v.status === 'available')
const totalKm = waypoints.reduce((s, v) => s + v.km, 0)
const maxKm = Math.max(...waypoints.map(v => v.km))
const prices = avail.map(v => v.price)

/* ══ 1. DEMARRAGE ═════════════════════════════════════════════ */

const lead = waypoints[1]                       // dark, reflective: real glass to refract
$('#start-img').src = lead.img
$('#start-img').alt = `${lead.make} ${lead.model}`
$('#start-date').textContent = new Date().getFullYear()

/* The ignition self-test. A real cluster sweeps its needles to full scale on
   start-up, then drops to the true reading. That is the only reason this
   animation exists — and the value it lands on is the real one. */
function ignite() {
  const settle = avail.length / N
  const fill = $('#gauge-fill')
  const out = $('#gauge-n')

  if (reduce) {
    fill.style.setProperty('--fill', settle)
    out.textContent = avail.length
    $('#r-from').textContent = num(Math.min(...prices))
    $('#r-to').textContent = num(Math.max(...prices))
    $('#r-km').textContent = num(totalKm)
    return
  }

  const t0 = performance.now()
  const SWEEP = 780, HOLD = 160, FALL = 520
  const step = now => {
    const e = now - t0
    let f
    if (e < SWEEP) {
      const p = e / SWEEP
      f = 1 - Math.pow(1 - p, 3)
    } else if (e < SWEEP + HOLD) {
      f = 1
    } else {
      const p = Math.min(1, (e - SWEEP - HOLD) / FALL)
      f = 1 - (1 - settle) * (1 - Math.pow(1 - p, 3))
    }
    fill.style.setProperty('--fill', f.toFixed(4))
    out.textContent = Math.round(f * N)
    if (e < SWEEP + HOLD + FALL) requestAnimationFrame(step)
    else { fill.style.setProperty('--fill', settle); out.textContent = avail.length }
  }
  requestAnimationFrame(step)

  count($('#r-from'), Math.min(...prices), 900, 240)
  count($('#r-to'), Math.max(...prices), 1000, 320)
  count($('#r-km'), totalKm, 1100, 400)
}

/* instruments settle onto a value; they never scroll past it */
function count(el, target, dur = 700, delay = 0) {
  if (reduce) { el.textContent = num(target); return }
  const from = Number(String(el.textContent).replace(/\D/g, '')) || 0
  const t0 = performance.now() + delay
  const step = now => {
    if (now < t0) return requestAnimationFrame(step)
    const p = Math.min(1, (now - t0) / dur)
    const e = 1 - Math.pow(1 - p, 4)
    el.textContent = num(Math.round(from + (target - from) * e))
    if (p < 1) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}

/* ══ 2. LE PARC ═══════════════════════════════════════════════ */

const track = $('#parc-track')
const stage = $('#stage')
const stageImg = $('#stage-img')
const sats = $('#sats')

const stepVh = () => Number(getComputedStyle(document.documentElement)
  .getPropertyValue('--step-vh').trim()) || 62

function sizeTrack() { track.style.height = `${N * stepVh() + 100}vh` }
sizeTrack()

sats.innerHTML = waypoints.map((v, i) => `
  <button class="sat" role="tab" type="button" data-i="${i}" aria-selected="${i === 0}"
          aria-label="Point ${pad(i + 1)}, ${v.make} ${v.model}">
    <span class="sat__plate">
      <img class="sat__img" src="${v.img}" alt="" loading="${i < 4 ? 'eager' : 'lazy'}"
           decoding="async" style="object-position:${v.pos}">
      ${v.status !== 'available' ? `<span class="sat__flag">${FR.status[v.status]}</span>` : ''}
    </span>
    <span class="sat__body">
      <span class="sat__n">${pad(i + 1)}</span>
      <span class="sat__name">${v.model}</span>
    </span>
  </button>`).join('')

const GLYPH = { odo: 'g-odo', year: 'g-year', fuel: 'g-fuel', box: 'g-box', paint: 'g-paint', vin: 'g-vin' }
const dial = (g, k, v, u = '') => `
  <div class="dial">
    <svg viewBox="0 0 24 24" aria-hidden="true"><use href="#${GLYPH[g]}"/></svg>
    <div class="dial__t"><dt>${k}</dt><dd>${v}${u ? `<span class="u">${u}</span>` : ''}</dd></div>
  </div>`

let current = -1

function select(i) {
  if (i === current) return
  const v = waypoints[i]
  const first = current === -1
  current = i

  $$('.sat').forEach((b, n) => b.setAttribute('aria-selected', String(n === i)))
  $('#step-n').textContent = pad(i + 1)

  const swap = () => {
    stageImg.src = v.img
    stageImg.alt = `${v.make} ${v.model}, ${v.color}`
    stageImg.style.objectPosition = v.pos
    stageImg.style.opacity = '1'
    if (!reduce) { stage.classList.remove('is-lit'); void stage.offsetWidth; stage.classList.add('is-lit') }
  }
  if (first || reduce) swap()
  else { stageImg.style.opacity = '0'; setTimeout(swap, 170) }

  $('#s-make').textContent = v.make
  $('#s-model').textContent = v.model
  const st = $('#s-state')
  st.textContent = FR.status[v.status]
  st.dataset.s = v.status

  $('#s-dials').innerHTML =
    dial('odo',   'Compteur',  num(v.km), 'km') +
    dial('year',  'Annee',     v.year) +
    dial('fuel',  'Carburant', FR.fuel[v.fuel]) +
    dial('box',   'Boite',     FR.gearbox[v.gearbox]) +
    dial('paint', 'Couleur',   v.color) +
    dial('vin',   'Chassis',   v.vin)

  $('#s-note').textContent = v.note
  $('#c-km').textContent = `${num(v.km)} km`
  $('#c-year').textContent = v.year
  $('#c-box').textContent = FR.gearbox[v.gearbox]

  $('#s-call').style.display = v.status === 'sold' ? 'none' : ''

  count($('#s-price'), v.price, first ? 0 : 640)
}

/* a satellite is a menu entry: pressing it drives the scroll to that step,
   so the pinned sequence and the control never disagree */
function goToStep(i) {
  const h = track.offsetHeight - innerHeight
  const y = track.offsetTop + ((i + 0.5) / N) * h
  scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' })
}

sats.addEventListener('click', e => {
  const b = e.target.closest('.sat')
  if (b) goToStep(Number(b.dataset.i))
})
sats.addEventListener('keydown', e => {
  const b = e.target.closest('.sat')
  if (!b) return
  const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0
  if (!d) return
  e.preventDefault()
  const n = clamp(Number(b.dataset.i) + d, 0, N - 1)
  const t = sats.querySelector(`.sat[data-i="${n}"]`)
  t.focus(); goToStep(n)
})

/* ══ 3. PARCOURS ══════════════════════════════════════════════ */

$('#bars').innerHTML = waypoints.map((v, i) => `
  <li class="bar ${v.status === 'sold' ? 'bar--sold' : ''}" style="--w:${(v.km / maxKm).toFixed(4)}">
    <span class="bar__n">${pad(i + 1)}</span>
    <span class="bar__mid">
      <span class="bar__name">${v.make} ${v.model}</span>
      <span class="bar__track"><span class="bar__fill"></span></span>
    </span>
    <span class="bar__v">${num(v.km)}<i>km</i></span>
  </li>`).join('')

const bars = $$('.bar')
let barsDone = false

/* ══ the cabin light, the road, the sequence ══════════════════ */

const lights = $$('[data-near]')
const startSec = $('#demarrage')
const railItems = $$('.rail__i')
const sections = railItems.map(a => document.getElementById(a.dataset.sec))
const leads = $$('.callouts .lead')

let ticking = false

function frame() {
  ticking = false
  const mid = innerHeight / 2

  for (const el of lights) {
    const r = el.getBoundingClientRect()
    const d = Math.abs(r.top + r.height / 2 - mid) / (innerHeight * 0.9)
    el.style.setProperty('--near', (1 - Math.min(1, d)).toFixed(3))
  }

  /* the road runs under the cabin, slower than the scroll */
  if (!reduce) {
    const r = startSec.getBoundingClientRect()
    const p = clamp(-r.top / (r.height || 1), 0, 1)
    startSec.style.setProperty('--road-y', `${(-r.top * 0.13).toFixed(1)}px`)
    startSec.style.setProperty('--road-scale', (1.1 + p * 0.07).toFixed(3))
  }

  /* the cluster steps through the parc under the driver's hand */
  const h = track.offsetHeight - innerHeight
  const raw = clamp((scrollY - track.offsetTop) / (h || 1), 0, 1) * N
  const i = clamp(Math.floor(raw), 0, N - 1)
  const t = clamp(raw - i, 0, 1)
  select(i)

  /* the HUD draws its leader lines onto the machine as it settles */
  const draw = reduce ? 1 : clamp(t / 0.34, 0, 1)
  for (const l of leads) l.style.setProperty('--draw', draw.toFixed(3))

  /* the parcours instruments settle one after another, once */
  if (!barsDone) {
    const br = $('#parcours').getBoundingClientRect()
    if (br.top < innerHeight * 0.75) {
      barsDone = true
      bars.forEach((b, n) => {
        if (reduce) return b.style.setProperty('--p', 1)
        setTimeout(() => b.style.setProperty('--p', 1), n * 70)
      })
      count($('#tot-km'), totalKm, 1200)
    }
  }

  /* where you are in the sequence */
  let cur = 0
  sections.forEach((s, n) => { if (s && s.getBoundingClientRect().top <= innerHeight * 0.45) cur = n })
  railItems.forEach((a, n) => a.setAttribute('aria-current', String(n === cur)))
}

function onScroll() {
  if (ticking) return
  ticking = true
  requestAnimationFrame(frame)
}

addEventListener('scroll', onScroll, { passive: true })
addEventListener('resize', () => { sizeTrack(); onScroll() }, { passive: true })

/* the bar fills animate from 0; declare the transition only after first paint
   so nothing is mid-flight on load */
requestAnimationFrame(() => {
  bars.forEach(b => {
    b.style.setProperty('--p', 0)
    b.querySelector('.bar__fill').style.transition = 'width .9s cubic-bezier(.22,1,.36,1)'
  })
})

select(0)
frame()
ignite()
