/* The few DOM helpers the plateau (turntable.js) needs, taken from prototype/launch/common.js.
   Client only: turntable.js is loaded with a dynamic import after mount. */
import { STATE, fcfa, km, pad2 } from './shared'

export { fcfa, km, pad2 }
export const $ = (sel, root = document) => root.querySelector(sel)
export const $$ = (sel, root = document) => [...root.querySelectorAll(sel)]
export const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])
export const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)')
/* plateau cars carry the vehicle id as `n` */
export const detailUrl = (c) => `/mansour-motors/vehicules/${c.n}`
export const status = (c) => `<span class="status" data-status="${c.status}">${STATE[c.status]}</span>`

/* segmented control: a soft thumb slides under the chosen option.
   Measured again whenever the control or a button resizes (web font arriving late, wrapping) */
const watched = new WeakSet()
export function segThumb(seg) {
  if (!watched.has(seg) && 'ResizeObserver' in window) {
    watched.add(seg)
    const ro = new ResizeObserver(() => segThumb(seg))
    ro.observe(seg)
    for (const b of $$('button, a', seg)) ro.observe(b)
  }
  let thumb = $('.thumb', seg)
  if (!thumb) {
    thumb = document.createElement('span')
    thumb.className = 'thumb'
    thumb.setAttribute('aria-hidden', 'true')
    thumb.innerHTML = '<i></i>'
    seg.prepend(thumb)
  }
  const on = $('[aria-pressed="true"], [aria-current="true"]', seg)
  thumb.hidden = !on
  if (!on || seg.clientWidth < 8 || on.offsetWidth < 8) return
  const t = on.offsetTop
  const l = on.offsetLeft
  thumb.style.setProperty('--t', `${t}px`)
  thumb.style.setProperty('--l', `${l}px`)
  thumb.style.setProperty('--r', `${seg.clientWidth - l - on.offsetWidth}px`)
  thumb.style.setProperty('--b', `${seg.clientHeight - t - on.offsetHeight}px`)
}

/* on touch screens there is no hover: the card nearest the middle of the screen is in colour */
export function focusOnTouch(els) {
  if (matchMedia('(hover: hover)').matches || !('IntersectionObserver' in window)) return null
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) e.target.classList.toggle('is-focus', e.isIntersecting)
  }, { rootMargin: '-40% 0px -40% 0px' })
  els.forEach((el) => io.observe(el))
  return io
}
