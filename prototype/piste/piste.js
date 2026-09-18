import { waypoints, FR } from '../data.js'

const $ = s => document.querySelector(s)
const num = n => n.toLocaleString('fr-FR').replace(/ | /g, ' ')
const pad = n => String(n).padStart(2, '0')
const clamp = (v, a, b) => Math.min(b, Math.max(a, v))
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches

const N = waypoints.length

/* ══════════════════════════════════════════════════════════════════
   THE SHADER
   Heat rises off the tar: layered value noise displaces the sampled
   image, strongest low in the frame where the air is hottest. Below
   the mirage line the image is sampled inverted and dissolved into
   the tar, which is what a real mirage is — the sky and the car
   reflected by a layer of hot air, not a wobble filter.
   ══════════════════════════════════════════════════════════════════ */

const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}`

const FRAG = `
precision highp float;
varying vec2 vUv;

uniform sampler2D uTexA;
uniform sampler2D uTexB;
uniform float uMix;
uniform float uHeat;
uniform float uTime;
uniform float uAC;      // canvas aspect
uniform float uAA;      // image A aspect
uniform float uAB;      // image B aspect
uniform vec2  uOffA;
uniform vec2  uOffB;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}
float vnoise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int k = 0; k < 4; k++) { v += a * vnoise(p); p *= 2.03; a *= 0.5; }
  return v;
}

/* cover-fit: the image fills the frame and the excess is cropped */
vec2 coverUV(vec2 uv, float aI, vec2 off) {
  vec2 c = uv - 0.5;
  if (aI > uAC) c.x *= uAC / aI;
  else          c.y *= aI / uAC;
  return c + 0.5 + off;
}

vec3 pair(vec2 uv) {
  vec3 a = texture2D(uTexA, clamp(coverUV(uv, uAA, uOffA), 0.001, 0.999)).rgb;
  vec3 b = texture2D(uTexB, clamp(coverUV(uv, uAB, uOffB), 0.001, 0.999)).rgb;
  return mix(a, b, uMix);
}

void main() {
  vec2 uv = vUv;
  float t = uTime;

  /* the air is hottest at the ground */
  float low = pow(1.0 - uv.y, 1.6);
  float amp = uHeat * (0.22 + 1.2 * low);

  vec2 q  = vec2(uv.x * 3.2, uv.y * 2.2 - t * 0.14);
  float n1 = fbm(q * 2.0);
  float n2 = fbm(q * 3.7 + vec2(5.2, -t * 0.23));
  vec2 disp = vec2(n1 - 0.5, n2 - 0.5);

  vec3 col = pair(uv + disp * amp * vec2(0.055, 0.028));

  /* the mirage: the inverted image floating on the hot layer, always
     computed, never inside a branch, so sampling stays well defined */
  float line = 0.235;
  vec2  muv  = vec2(uv.x, line + (line - uv.y) * 1.25);
  float k    = clamp((line - uv.y) / line, 0.0, 1.0);
  muv += disp * (amp + 0.045) * vec2(0.15, 0.05) * (0.35 + k);
  vec3 tar    = vec3(0.043, 0.037, 0.031);
  vec3 ground = mix(pair(muv) * 0.5, tar, clamp(k * 1.4, 0.0, 1.0));
  col = mix(col, ground, smoothstep(0.0, 0.045, line - uv.y));

  /* the light: bleached above, one gold rake from the upper left */
  float sky = smoothstep(0.55, 1.0, uv.y);
  col = mix(col, col * 1.05 + vec3(0.05, 0.04, 0.02), sky * 0.45);
  float rake = smoothstep(1.25, -0.1, uv.x + uv.y);
  col += vec3(0.36, 0.28, 0.12) * rake * 0.11;

  /* glare washes colour out of everything at speed */
  float lum = dot(col, vec3(0.299, 0.587, 0.114));
  col = mix(col, vec3(lum), uHeat * 0.26);

  col *= 1.0 - 0.34 * pow(length((uv - 0.5) * vec2(1.06, 1.0)), 2.2);

  gl_FragColor = vec4(col, 1.0);
}`

/* ══ GL boot — any failure falls back to a sharp image ═══════════ */

const canvas = $('#gl')

/* the fallback photograph is only created if the shader cannot run, so a
   working piste never downloads a second full-size copy of the machine */
let flat = null
function ensureFlat() {
  if (flat) return flat
  flat = new Image()
  flat.className = 'flat'
  flat.decoding = 'async'
  $('#stage').append(flat)
  return flat
}
let gl = null, prog = null, U = {}, texA = null, texB = null
const aspect = new Map()   // image url -> aspect ratio

function shader(type, src) {
  const s = gl.createShader(type)
  gl.shaderSource(s, src)
  gl.compileShader(s)
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    console.error('[piste] shader compile failed:\n' + gl.getShaderInfoLog(s))
    return null
  }
  return s
}

function boot() {
  try {
    gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'high-performance' })
         || canvas.getContext('experimental-webgl')
    if (!gl) throw new Error('no webgl context')

    const vs = shader(gl.VERTEX_SHADER, VERT)
    const fs = shader(gl.FRAGMENT_SHADER, FRAG)
    if (!vs || !fs) throw new Error('shader compile')

    prog = gl.createProgram()
    gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error('[piste] link failed:\n' + gl.getProgramInfoLog(prog))
      throw new Error('link')
    }
    gl.useProgram(prog)

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 3,-1, -1,3]), gl.STATIC_DRAW)
    const loc = gl.getAttribLocation(prog, 'aPos')
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)

    for (const k of ['uTexA','uTexB','uMix','uHeat','uTime','uAC','uAA','uAB','uOffA','uOffB'])
      U[k] = gl.getUniformLocation(prog, k)

    gl.uniform1i(U.uTexA, 0)
    gl.uniform1i(U.uTexB, 1)
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)

    texA = blankTex(); texB = blankTex()
    return true
  } catch (err) {
    console.warn('[piste] falling back to flat imagery:', err.message)
    document.body.classList.add('no-gl')
    gl = null
    return false
  }
}

function blankTex() {
  const t = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, t)
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
    new Uint8Array([11, 9, 8, 255]))
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
  return t
}

/* ── images: decoded once, uploaded once, then bound synchronously ──
   Nothing in the frame loop may await: a texture bound in a microtask
   lands after the draw call and you render the previous machine.      */

const ready = new Map()     // url -> HTMLImageElement
const texOf = new Map()     // url -> WebGLTexture
const pending = new Set()

function load(url) {
  if (ready.has(url) || pending.has(url)) return
  pending.add(url)
  const im = new Image()
  im.crossOrigin = 'anonymous'
  im.decoding = 'async'
  im.onload = () => {
    aspect.set(url, im.naturalWidth / im.naturalHeight)
    ready.set(url, im)
    pending.delete(url)
  }
  im.onerror = () => { console.warn('[piste] image failed:', url); pending.delete(url) }
  im.src = url
}

function texture(url) {
  if (texOf.has(url)) return texOf.get(url)
  const im = ready.get(url)
  if (!im) return null
  const t = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, t)
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, im)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
  texOf.set(url, t)
  return t
}

/* bind whatever is ready; a machine still decoding keeps the blank tar
   texture rather than stalling the piste */
function bind(unit, url, blank) {
  const t = texture(url) || blank
  gl.activeTexture(unit === 0 ? gl.TEXTURE0 : gl.TEXTURE1)
  gl.bindTexture(gl.TEXTURE_2D, t)
  return t !== blank
}

/* ══ THE PISTE — momentum, then the brake, then the reward ══════ */

const state = { pos: 0, vel: 0, heat: 0, target: null, dragging: false, lock: 0 }
let lastIdx = -1, stillFor = 0, locked = false

const stage = $('#stage')

/* wheel and trackpad: both axes push you along the piste */
addEventListener('wheel', e => {
  e.preventDefault()
  const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY
  state.vel += d * 0.00052
  state.target = null
  hideHint()
}, { passive: false })

/* drag: one to one with the pointer, so the piste feels held */
let px = 0
stage.addEventListener('pointerdown', e => {
  state.dragging = true; px = e.clientX; state.target = null
  stage.classList.add('is-drag')
  stage.setPointerCapture(e.pointerId)
  hideHint()
})
stage.addEventListener('pointermove', e => {
  if (!state.dragging) return
  const dx = e.clientX - px; px = e.clientX
  const step = dx / (innerWidth * 0.62)
  state.pos = clamp(state.pos - step, 0, N - 1)
  state.vel = -step * 0.55
})
const release = e => {
  if (!state.dragging) return
  state.dragging = false
  stage.classList.remove('is-drag')
  try { stage.releasePointerCapture(e.pointerId) } catch {}
}
stage.addEventListener('pointerup', release)
stage.addEventListener('pointercancel', release)

addEventListener('keydown', e => {
  if (e.target.closest('a, button')) return
  const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0
  if (d) { e.preventDefault(); goTo(Math.round(state.pos) + d); hideHint() }
  if (e.key === 'Home') { e.preventDefault(); goTo(0) }
  if (e.key === 'End') { e.preventDefault(); goTo(N - 1) }
})

function goTo(i) {
  state.target = clamp(i, 0, N - 1)
  state.vel = 0
  if (reduce) { state.pos = state.target; state.target = null }
}

function hideHint() { $('#hint').classList.add('is-gone') }

/* ══ the readout ═══════════════════════════════════════════════ */

const ticks = $('#ticks')
ticks.innerHTML = waypoints.map((v, i) => `
  <button class="tick" type="button" data-i="${i}" data-s="${v.status}"
          aria-current="${i === 0}" aria-label="${pad(i + 1)}. ${v.make} ${v.model}"></button>`).join('')
ticks.addEventListener('click', e => {
  const b = e.target.closest('.tick')
  if (b) { goTo(Number(b.dataset.i)); hideHint() }
})

function paint(i) {
  const v = waypoints[i]
  $('#r-i').textContent = pad(i + 1)
  $('#r-make').textContent = v.make
  $('#r-model').textContent = v.model
  $('#r-km').textContent = num(v.km)
  $('#r-year').textContent = v.year
  $('#r-box').textContent = FR.gearbox[v.gearbox]
  const st = $('#r-state')
  st.textContent = FR.status[v.status]
  st.dataset.s = v.status
  $('#r-call').hidden = v.status === 'sold'
  $('#r-price').textContent = num(v.price)
  ticks.querySelectorAll('.tick').forEach((b, n) => b.setAttribute('aria-current', String(n === i)))
  if (!gl) { const f = ensureFlat(); f.src = v.img; f.alt = `${v.make} ${v.model}, ${v.color}` }
}

/* the reward: when the machine has truly settled, the price counts on
   and a gold rule draws under its name. Stillness is what earns it. */
function lockOn(i) {
  const v = waypoints[i]
  $('#r-rule').style.setProperty('--lock', '1')
  if (reduce) { $('#r-price').textContent = num(v.price); return }
  const el = $('#r-price')
  const from = Math.round(v.price * 0.88)
  const t0 = performance.now()
  const step = now => {
    const p = Math.min(1, (now - t0) / 620)
    el.textContent = num(Math.round(from + (v.price - from) * (1 - Math.pow(1 - p, 4))))
    if (p < 1) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}

/* ══ the loop ══════════════════════════════════════════════════ */

function resize() {
  const dpr = Math.min(devicePixelRatio || 1, 2)
  const w = Math.round(innerWidth * dpr), h = Math.round(innerHeight * dpr)
  if (canvas.width !== w || canvas.height !== h) {
    canvas.width = w; canvas.height = h
    if (gl) { gl.viewport(0, 0, w, h); gl.uniform1f(U.uAC, w / h) }
  }
}
addEventListener('resize', resize, { passive: true })

let prev = performance.now()

function tick(now) {
  const dt = clamp((now - prev) / 16.667, 0.2, 3)
  prev = now

  /* momentum, then the brake into the nearest machine */
  if (!state.dragging) {
    if (state.target !== null) {
      state.pos += (state.target - state.pos) * (reduce ? 1 : 0.14 * dt)
      if (Math.abs(state.target - state.pos) < 0.001) { state.pos = state.target; state.target = null }
    } else {
      state.pos += state.vel * dt
      state.vel *= Math.pow(0.90, dt)
      if (Math.abs(state.vel) < 0.02) {
        const near = Math.round(state.pos)
        state.pos += (near - state.pos) * 0.11 * dt
        if (Math.abs(near - state.pos) < 0.0006) { state.pos = near; state.vel = 0 }
      }
    }
  }
  state.pos = clamp(state.pos, 0, N - 1)
  if (state.pos === 0 || state.pos === N - 1) state.vel *= 0.55

  /* heat follows speed; it never quite dies, because the air never does */
  const speed = Math.abs(state.vel) + (state.target !== null ? Math.abs(state.target - state.pos) * 0.35 : 0)
  const want = reduce ? 0 : clamp(speed * 9.5, 0.05, 1)
  state.heat += (want - state.heat) * clamp(0.11 * dt, 0, 1)

  const i = Math.round(state.pos)
  if (i !== lastIdx) {
    lastIdx = i
    stillFor = 0; locked = false
    $('#r-rule').style.setProperty('--lock', '0')
    paint(i)
  }

  /* the machine has resolved: hold still and it is yours */
  if (!locked && state.heat < 0.1 && !state.dragging) {
    stillFor += now - (tick.last || now)
    if (stillFor > 320) { locked = true; lockOn(i) }
  } else if (state.heat >= 0.1) stillFor = 0
  tick.last = now

  $('#heat-fill').style.setProperty('--h', state.heat.toFixed(3))

  if (gl) {
    const a = Math.floor(state.pos)
    const b = Math.min(N - 1, a + 1)
    const f = state.pos - a
    const ua = waypoints[a].img, ub = waypoints[b].img

    bind(0, ua, texA); bind(1, ub, texB)

    gl.uniform1f(U.uTime, now * 0.001)
    gl.uniform1f(U.uHeat, state.heat)
    gl.uniform1f(U.uMix, a === b ? 0 : f * f * (3 - 2 * f))
    gl.uniform1f(U.uAA, aspect.get(ua) || 1.6)
    gl.uniform1f(U.uAB, aspect.get(ub) || 1.6)
    gl.uniform2f(U.uOffA, f * 0.20, 0)
    gl.uniform2f(U.uOffB, (f - 1) * 0.20, 0)
    gl.drawArrays(gl.TRIANGLES, 0, 3)
  }

  requestAnimationFrame(tick)
}

/* ── start ───────────────────────────────────────────────────── */

const ok = boot()
resize()
paint(0)

/* the first two machines are what you see; the rest load behind you */
waypoints.slice(0, 2).forEach(v => load(v.img))
requestAnimationFrame(tick)
addEventListener('load', () => waypoints.slice(2).forEach(v => load(v.img)))
