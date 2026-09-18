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

/* segmented control: a soft thumb slides under the chosen option */
export function segThumb(seg) {
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
  if (!on) return
  const t = on.offsetTop
  const l = on.offsetLeft
  thumb.style.setProperty('--t', `${t}px`)
  thumb.style.setProperty('--l', `${l}px`)
  thumb.style.setProperty('--r', `${seg.clientWidth - l - on.offsetWidth}px`)
  thumb.style.setProperty('--b', `${seg.clientHeight - t - on.offsetHeight}px`)
}
