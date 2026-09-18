import { waypoints } from '../data.js'

export const cars = waypoints

/* ── vocabulary ─────────────────────────────────────────────────────── */
export const FUEL = { diesel: 'Diesel', gasoline: 'Essence', hybrid: 'Hybride', electric: 'Électrique' }
export const GEARBOX = { automatic: 'Automatique', manual: 'Manuelle', cvt: 'CVT' }
export const STATE = { available: 'Disponible', reserved: 'Réservé', sold: 'Vendu' }
export const PHONE = { label: '+221 33 123 45 67', href: 'tel:+221331234567' } // placeholder from the current site
export const WHATSAPP = '221771234567' // placeholder from the current site

const nf = new Intl.NumberFormat('fr-FR')
export const fcfa = (n) => `${nf.format(n)} FCFA`
export const km = (n) => `${nf.format(n)} km`
export const pad2 = (n) => String(n).padStart(2, '0')
export const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])
export const $ = (sel, root = document) => root.querySelector(sel)
export const $$ = (sel, root = document) => [...root.querySelectorAll(sel)]
export const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)')
export const detailUrl = (c) => `vehicule.html?id=${c.n}`
export const brands = [...new Set(cars.map((c) => c.make))].sort((a, b) => a.localeCompare(b, 'fr'))
export const modelsOf = (make) => cars.filter((c) => !make || c.make === make).map((c) => c.model)

export const waLink = (text) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`

/* ── hours: Dakar is UTC+0 all year, so UTC getters give showroom time ─ */
export const HOURS = { 1: [8, 18], 2: [8, 18], 3: [8, 18], 4: [8, 18], 5: [8, 18], 6: [9, 17] }
const DAY = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi']

export function openState(now = new Date()) {
  const d = now.getUTCDay()
  const h = now.getUTCHours() + now.getUTCMinutes() / 60
  const today = HOURS[d]
  if (today && h >= today[0] && h < today[1]) return { open: true, text: `Ouvert aujourd'hui jusqu'à ${today[1]}h` }
  for (let i = 0; i < 8; i++) {
    const day = (d + i) % 7
    const hh = HOURS[day]
    if (!hh || (i === 0 && h >= hh[0])) continue
    const when = i === 0 ? "aujourd'hui" : i === 1 ? 'demain' : DAY[day]
    return { open: false, text: `Fermé, ouvre ${when} à ${hh[0]}h` }
  }
}

/* next open days with at least one bookable hour (today: one hour from now) */
export function bookingDays(now = new Date(), count = 6) {
  const h = now.getUTCHours() + now.getUTCMinutes() / 60
  const out = []
  for (let i = 0; out.length < count && i < 14; i++) {
    const date = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + i))
    const hh = HOURS[date.getUTCDay()]
    if (!hh) continue
    const slots = []
    for (let s = hh[0]; s < hh[1]; s++) if (i > 0 || s >= h + 1) slots.push(s)
    if (slots.length) out.push({ date, slots, today: i === 0 })
  }
  return out
}

/* ── card, shared by the home row, the stock grid and "autres véhicules" ─ */
export function card(c, { eager = false } = {}) {
  const sold = c.status !== 'available'
  return `
  <article class="card" data-n="${c.n}" data-status="${c.status}">
    <a class="card-link" href="${detailUrl(c)}">
      <div class="frame card-frame" style="view-transition-name:car-${c.n}">
        <img src="${esc(c.img)}" alt="${esc(`${c.make} ${c.model}`)}" style="--pos:${c.pos}" loading="${eager ? 'eager' : 'lazy'}" decoding="async">
        <span class="sweep" aria-hidden="true"></span>
      </div>
      <p class="card-make">${esc(c.make)}</p>
      <h3 class="card-model">${esc(c.model)}</h3>
      <p class="card-meta"><span>${c.year}</span><span>${km(c.km)}</span><span>${FUEL[c.fuel]}</span></p>
      <p class="card-price">${sold ? `<span class="state">${STATE[c.status]}</span>` : ''}<span class="price">${fcfa(c.price)}</span></p>
    </a>
  </article>`
}

/* ── chrome shared by every page ────────────────────────────────────── */
const WA_GLYPH = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>'

export function chrome({ waText = 'Bonjour Mansour Motors, je souhaite des informations.' } = {}) {
  // header turns to glass once the page has moved
  const header = $('.header')
  const onScroll = () => header.classList.toggle('is-scrolled', scrollY > 24)
  addEventListener('scroll', onScroll, { passive: true })
  onScroll()

  // floating WhatsApp
  const wa = document.createElement('a')
  wa.className = 'wa'
  wa.href = waLink(waText)
  wa.target = '_blank'
  wa.rel = 'noopener'
  wa.innerHTML = `${WA_GLYPH}<span>WhatsApp</span>`
  document.body.append(wa)

  // live opening state wherever it is asked for
  const open = openState()
  for (const el of $$('[data-open]')) { el.textContent = open.text; el.dataset.state = open.open ? 'open' : 'closed' }

  // sections settle 16px as they enter. Opacity is never touched, so content
  // is readable even if this never runs.
  if (!reduceMotion.matches && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) { e.target.classList.remove('is-pre'); io.unobserve(e.target) }
    }, { rootMargin: '0px 0px -8% 0px' })
    for (const el of $$('.rise')) {
      if (el.getBoundingClientRect().top > innerHeight) { el.classList.add('is-pre'); io.observe(el) }
    }
  }
}

/* ── visit / alert forms: one WhatsApp hand-off ─────────────────────── */
export function slotPicker(form, { onChange } = {}) {
  const days = bookingDays()
  const fmtShort = new Intl.DateTimeFormat('fr-FR', { weekday: 'short', timeZone: 'UTC' })
  const fmtLong = new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' })
  const daysEl = $('[data-days]', form)
  const slotsEl = $('[data-slots]', form)
  daysEl.innerHTML = days.map((d, i) => {
    const short = d.today ? 'Auj.' : fmtShort.format(d.date).replace('.', '')
    return `<span class="tile"><input type="radio" name="day" id="day-${i}" value="${i}"><label for="day-${i}" aria-label="${fmtLong.format(d.date)}">${short}<b>${d.date.getUTCDate()}</b></label></span>`
  }).join('')
  const renderSlots = () => {
    const day = days[form.elements.day.value]
    if (!day) { slotsEl.innerHTML = '<p class="hint">Choisissez d\'abord un jour.</p>'; return }
    slotsEl.innerHTML = day.slots.map((s) =>
      `<span class="tile"><input type="radio" name="slot" id="slot-${s}" value="${s}"><label for="slot-${s}">${pad2(s)}:00</label></span>`).join('')
  }
  renderSlots()
  form.addEventListener('change', (e) => { if (e.target.name === 'day') renderSlots(); onChange?.() })
  return () => {
    const day = days[form.elements.day.value]
    const slot = form.elements.slot?.value
    return day && slot ? `${fmtLong.format(day.date)} à ${pad2(slot)}:00` : ''
  }
}
