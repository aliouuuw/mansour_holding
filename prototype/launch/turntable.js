import {
  $, $$, esc, fcfa, km, pad2, detailUrl, status, reduceMotion, segThumb,
} from './common.js?v=4'

const TAU = Math.PI * 2

function clamp(n, a, b) { return Math.min(b, Math.max(a, n)) }

function parsePos(pos) {
  const p = String(pos || '50% 55%').split(/\s+/)
  return [parseFloat(p[0]) / 100 || 0.5, parseFloat(p[1]) / 100 || 0.55]
}

function compile(gl, type, src) {
  const s = gl.createShader(type)
  gl.shaderSource(s, src)
  gl.compileShader(s)
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) || 'shader')
  return s
}

function program(gl, vs, fs) {
  const p = gl.createProgram()
  gl.attachShader(p, compile(gl, gl.VERTEX_SHADER, vs))
  gl.attachShader(p, compile(gl, gl.FRAGMENT_SHADER, fs))
  gl.linkProgram(p)
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p) || 'program')
  return p
}

function identity(o) {
  o.fill(0)
  o[0] = o[5] = o[10] = o[15] = 1
  return o
}
function multiply(o, a, b) {
  const r = new Float32Array(16)
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      r[i * 4 + j] = a[j] * b[i * 4] + a[4 + j] * b[i * 4 + 1] + a[8 + j] * b[i * 4 + 2] + a[12 + j] * b[i * 4 + 3]
    }
  }
  o.set(r)
  return o
}
function perspective(o, fovy, aspect, near, far) {
  const f = 1 / Math.tan(fovy / 2)
  o.fill(0)
  o[0] = f / aspect
  o[5] = f
  o[10] = (far + near) / (near - far)
  o[11] = -1
  o[14] = (2 * far * near) / (near - far)
  return o
}
function lookAt(o, ey, tar, up) {
  let zx = ey[0] - tar[0], zy = ey[1] - tar[1], zz = ey[2] - tar[2]
  let zl = 1 / Math.hypot(zx, zy, zz)
  zx *= zl; zy *= zl; zz *= zl
  let xx = up[1] * zz - up[2] * zy
  let xy = up[2] * zx - up[0] * zz
  let xz = up[0] * zy - up[1] * zx
  let xl = Math.hypot(xx, xy, xz) || 1
  xx /= xl; xy /= xl; xz /= xl
  const yx = zy * xz - zz * xy
  const yy = zz * xx - zx * xz
  const yz = zx * xy - zy * xx
  o.fill(0)
  o[0] = xx; o[1] = yx; o[2] = zx
  o[4] = xy; o[5] = yy; o[6] = zy
  o[8] = xz; o[9] = yz; o[10] = zz
  o[12] = -(xx * ey[0] + xy * ey[1] + xz * ey[2])
  o[13] = -(yx * ey[0] + yy * ey[1] + yz * ey[2])
  o[14] = -(zx * ey[0] + zy * ey[1] + zz * ey[2])
  o[15] = 1
  return o
}
function rotateY(o, a) {
  const c = Math.cos(a), s = Math.sin(a)
  identity(o)
  o[0] = c; o[2] = s; o[8] = -s; o[10] = c
  return o
}
function translate(o, x, y, z) {
  identity(o)
  o[12] = x; o[13] = y; o[14] = z
  return o
}

const VS = `
attribute vec3 aPos;
attribute vec2 aUv;
uniform mat4 uViewProj;
uniform mat4 uModel;
uniform float uBend;
varying vec2 vUv;
void main() {
  vec3 p = aPos;
  float k = uBend;
  p.z += k * p.x * p.x * 0.55;
  p.x += k * p.x * 0.12;
  gl_Position = uViewProj * uModel * vec4(p, 1.0);
  vUv = aUv;
}`

const FS = `
precision highp float;
uniform sampler2D uTex;
uniform float uAberration;
uniform float uFocus;
varying vec2 vUv;
void main() {
  float a = uAberration * (0.55 + 0.45 * (1.0 - uFocus));
  float r = texture2D(uTex, vUv + vec2(a, 0.0)).r;
  float g = texture2D(uTex, vUv).g;
  float b = texture2D(uTex, vUv - vec2(a, 0.0)).b;
  vec3 col = vec3(r, g, b) * mix(0.4, 1.0, uFocus);
  gl_FragColor = vec4(col, 1.0);
}`

function bake(img, pos) {
  const W = 1024, H = 768
  const c = document.createElement('canvas')
  c.width = W
  c.height = H
  const ctx = c.getContext('2d')
  const [fx, fy] = parsePos(pos)
  const ir = img.width / img.height
  const cr = W / H
  let dw, dh
  if (ir > cr) { dh = H; dw = H * ir } else { dw = W; dh = W / ir }
  ctx.drawImage(img, (W - dw) * fx, (H - dh) * fy, dw, dh)
  return c
}

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('img'))
    img.src = url
  })
}

export function webglOk() {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl') || c.getContext('experimental-webgl'))
  } catch {
    return false
  }
}

function createRing(canvas) {
  const gl = canvas.getContext('webgl', { antialias: true, alpha: false, powerPreference: 'high-performance' })
    || canvas.getContext('experimental-webgl', { antialias: true, alpha: false })
  if (!gl) throw new Error('webgl')
  const prog = program(gl, VS, FS)
  const loc = {
    aPos: gl.getAttribLocation(prog, 'aPos'),
    aUv: gl.getAttribLocation(prog, 'aUv'),
    uViewProj: gl.getUniformLocation(prog, 'uViewProj'),
    uModel: gl.getUniformLocation(prog, 'uModel'),
    uBend: gl.getUniformLocation(prog, 'uBend'),
    uTex: gl.getUniformLocation(prog, 'uTex'),
    uAberration: gl.getUniformLocation(prog, 'uAberration'),
    uFocus: gl.getUniformLocation(prog, 'uFocus'),
  }
  const PW = 2.55, PH = 1.91
  const verts = new Float32Array([
    -PW / 2, -PH / 2, 0, 0, 0,
     PW / 2, -PH / 2, 0, 1, 0,
    -PW / 2,  PH / 2, 0, 0, 1,
     PW / 2,  PH / 2, 0, 1, 1,
  ])
  const buf = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buf)
  gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW)

  const view = new Float32Array(16)
  const proj = new Float32Array(16)
  const vp = new Float32Array(16)
  const model = new Float32Array(16)
  const ry = new Float32Array(16)
  const tr = new Float32Array(16)

  let cars = []
  let textures = []
  let angle = 0
  let bend = 0
  let aberr = 0
  let gen = 0
  let pixel = [1, 1]

  const blank = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, blank)
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, 1, 1, 0, gl.RGB, gl.UNSIGNED_BYTE, new Uint8Array([18, 18, 20]))
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)

  const FOVY = 0.66
  const CAM_Z = 11.1

  /* selected index is angle / TAU * n. Positive angle walks 1 → 2 → 3. */
  function selected() {
    const n = Math.max(cars.length, 1)
    return clamp(angle / TAU * n, 0, Math.max(n - 1, 0))
  }

  function delta(i) {
    return i - selected()
  }

  function viewHalf() {
    const aspect = pixel[0] / Math.max(pixel[1], 1)
    const hfov = 2 * Math.atan(Math.tan(FOVY / 2) * aspect)
    return Math.tan(hfov / 2) * (CAM_Z - 0.35)
  }

  function gap() {
    const n = Math.max(cars.length, 2)
    const fit = (viewHalf() * 2 * 0.76) / (n - 1)
    return Math.min(PW * 0.78, Math.max(0.42, fit))
  }

  function pose(i) {
    const n = Math.max(cars.length, 1)
    const d = delta(i)
    const g = gap()
    const span = (n - 1) * g
    const half = viewHalf()
    const ideal = selected() * g
    const lo = span - half
    const hi = half
    const pan = lo > hi ? clamp(ideal, hi, lo) : span / 2
    return {
      x: i * g - pan,
      y: 0,
      z: 0.95 / (1 + d * d) - 0.03 * d * d,
      yaw: -d * 0.16,
      d,
    }
  }

  function placeModel(i) {
    const p = pose(i)
    rotateY(ry, p.yaw)
    translate(tr, p.x, p.y, p.z)
    multiply(model, tr, ry)
    return p
  }

  function resize() {
    const dpr = Math.min(devicePixelRatio || 1, matchMedia('(max-width: 860px)').matches ? 1.25 : 2)
    const w = Math.max(1, canvas.clientWidth)
    const h = Math.max(1, canvas.clientHeight)
    const W = Math.round(w * dpr), H = Math.round(h * dpr)
    if (canvas.width !== W || canvas.height !== H) {
      canvas.width = W
      canvas.height = H
    }
    pixel = [w, h]
    gl.viewport(0, 0, W, H)
  }

  async function setCars(next) {
    const my = ++gen
    cars = next.slice()
    for (const t of textures) gl.deleteTexture(t)
    textures = cars.map(() => blank)
    let loaded = 0
    await Promise.all(cars.map(async (c, i) => {
      try {
        const img = await loadImage(c.img)
        if (my !== gen) return
        const baked = bake(img, c.pos)
        const tex = gl.createTexture()
        gl.bindTexture(gl.TEXTURE_2D, tex)
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1)
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, baked)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
        textures[i] = tex
        loaded++
      } catch { /* keep blank panel */ }
    }))
    if (my !== gen) return { loaded: 0, expected: 0 }
    return { loaded, expected: cars.length }
  }

  function frontIndex() {
    if (!cars.length) return 0
    let best = 0, score = 1e9
    for (let i = 0; i < cars.length; i++) {
      const a = Math.abs(delta(i))
      if (a < score) { score = a; best = i }
    }
    return best
  }

  function project(x, y, z) {
    const m = vp
    const w = m[3] * x + m[7] * y + m[11] * z + m[15]
    if (w === 0) return null
    const ndcX = (m[0] * x + m[4] * y + m[8] * z + m[12]) / w
    const ndcY = (m[1] * x + m[5] * y + m[9] * z + m[13]) / w
    return [(ndcX * 0.5 + 0.5) * pixel[0], (1 - (ndcY * 0.5 + 0.5)) * pixel[1]]
  }

  function planeRect(i) {
    const p = pose(i)
    const c = Math.cos(p.yaw), s = Math.sin(p.yaw)
    const hx = PW / 2, hy = PH / 2
    const pts = [[-hx, -hy], [hx, -hy], [-hx, hy], [hx, hy]].map(([lx, ly]) =>
      project(c * lx + p.x, ly + p.y, -s * lx + p.z)
    ).filter(Boolean)
    if (!pts.length) return canvas.getBoundingClientRect()
    const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1])
    const cr = canvas.getBoundingClientRect()
    const sx = cr.width / pixel[0], sy = cr.height / pixel[1]
    const left = cr.left + Math.min(...xs) * sx
    const top = cr.top + Math.min(...ys) * sy
    return {
      left, top,
      width: (Math.max(...xs) - Math.min(...xs)) * sx,
      height: (Math.max(...ys) - Math.min(...ys)) * sy,
    }
  }

  function pick(cx, cy) {
    const cr = canvas.getBoundingClientRect()
    const x = cx - cr.left, y = cy - cr.top
    let best = frontIndex(), dist = 1e9
    for (let i = 0; i < cars.length; i++) {
      const posei = pose(i)
      const p = project(posei.x, posei.y, posei.z)
      if (!p) continue
      const d = Math.hypot(p[0] * cr.width / pixel[0] - x, p[1] * cr.height / pixel[1] - y)
      if (d < dist) { dist = d; best = i }
    }
    return dist < Math.min(cr.width, cr.height) * 0.42 ? best : frontIndex()
  }

  function draw() {
    resize()
    gl.clearColor(0.02, 0.02, 0.02, 1)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    gl.enable(gl.DEPTH_TEST)
    gl.useProgram(prog)
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.enableVertexAttribArray(loc.aPos)
    gl.vertexAttribPointer(loc.aPos, 3, gl.FLOAT, false, 20, 0)
    gl.enableVertexAttribArray(loc.aUv)
    gl.vertexAttribPointer(loc.aUv, 2, gl.FLOAT, false, 20, 12)

    const n = cars.length
    lookAt(view, [0, 0.16, CAM_Z], [0, -0.12, 0.22], [0, 1, 0])
    perspective(proj, FOVY, pixel[0] / pixel[1], 0.15, 40)
    multiply(vp, proj, view)
    gl.uniformMatrix4fv(loc.uViewProj, false, vp)
    gl.uniform1i(loc.uTex, 0)
    gl.uniform1f(loc.uBend, bend)
    gl.uniform1f(loc.uAberration, aberr)

    if (!n) return
    const order = cars.map((_, i) => i).sort((a, b) => pose(a).z - pose(b).z)
    for (const i of order) {
      const p = placeModel(i)
      const focus = clamp(1 / (1 + p.d ** 2 * 0.42), 0, 1) ** 1.15
      gl.uniformMatrix4fv(loc.uModel, false, model)
      gl.uniform1f(loc.uFocus, focus)
      gl.activeTexture(gl.TEXTURE0)
      gl.bindTexture(gl.TEXTURE_2D, textures[i] || blank)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    }
  }

  return {
    setCars,
    setPose(a, velocity) {
      angle = a
      bend = clamp(velocity * 1.15, -1.15, 1.15)
      aberr = clamp(Math.abs(velocity) * 0.034, 0, 0.028)
    },
    draw,
    frontIndex,
    frontRect: () => planeRect(frontIndex()),
    planeRect,
    pick,
    destroy() {
      gen++
      for (const t of textures) if (t !== blank) gl.deleteTexture(t)
      gl.deleteTexture(blank)
      gl.deleteBuffer(buf)
      gl.deleteProgram(prog)
    },
  }
}

function flyTo(car, rect, href) {
  if (reduceMotion.matches || !rect || rect.width < 8) {
    location.href = href
    return
  }
  const layer = document.createElement('div')
  layer.className = 'fly'
  const img = document.createElement('img')
  img.src = car.img
  img.alt = `${car.make} ${car.model}`
  img.style.cssText = `top:${rect.top}px;left:${rect.left}px;width:${rect.width}px;height:${rect.height}px`
  img.style.viewTransitionName = `car-${car.n}`
  layer.append(img)
  document.body.append(layer)
  img.getBoundingClientRect()
  img.style.top = '0'
  img.style.left = '0'
  img.style.width = '100%'
  img.style.height = '100%'
  setTimeout(() => { location.href = href }, 780)
}

export function mountTurntable(root, {
  drive = 'scroll',
  modes = ['ring', 'list'],
  hint = '',
} = {}) {
  const pin = $('.lineup-pin', root) || root
  const stage = $('[data-stage]', root)
  const canvas = $('[data-canvas]', root)
  const indexEl = $('[data-index]', root)
  const viewEl = $('[data-view]', root)
  const countEl = $('[data-lineup-count]', root)
  const nameEl = $('[data-lineup-name]', root)
  const priceEl = $('[data-lineup-price]', root)
  const specsEl = $('[data-lineup-specs]', root)
  const openBtn = $('[data-open-front]', root)
  const hintEl = $('[data-ring-hint]', root)
  const gridHost = $('[data-grid]', root)

  let cars = []
  let mode = (reduceMotion.matches || !webglOk()) && modes.includes('list') ? 'list' : 'ring'
  if (!modes.includes(mode)) mode = modes[0]
  let ring = null
  let angle = 0
  let target = 0
  let vel = 0
  let prev = 0
  let front = -1
  let featured = 0
  let raf = 0
  let running = false
  let drag = null
  let visible = true
  let didDrag = false
  let wheelSnap = 0
  const atelier = $('[data-atelier]', root)

  if (hintEl && hint) hintEl.textContent = hint

  function setPressed() {
    if (!viewEl) return
    for (const b of $$('button', viewEl)) b.setAttribute('aria-pressed', String(b.dataset.mode === mode))
    segThumb(viewEl)
  }

  function maxAngle() {
    const n = Math.max(cars.length, 1)
    return ((n - 1) / n) * TAU
  }

  function syncChrome() {
    root.classList.toggle('is-ring', mode === 'ring')
    root.classList.toggle('is-atelier', mode === 'atelier')
    if (stage) stage.hidden = mode !== 'ring' && mode !== 'list'
    if (canvas) canvas.hidden = mode !== 'ring'
    if (indexEl) indexEl.hidden = mode !== 'list'
    if (gridHost) gridHost.hidden = mode !== 'grid'
    if (atelier) atelier.hidden = mode !== 'atelier' || !cars.length
    const hud = $('[data-hud]', root)
    if (hud) hud.hidden = mode !== 'ring'
    if (hintEl) hintEl.hidden = mode !== 'ring'
    setPressed()
    layout()
    if (mode === 'atelier') renderAtelier()
    if (mode === 'ring') start()
    else stop()
  }

  function layout() {
    if (drive !== 'scroll') return
    if (mode !== 'ring') {
      root.style.height = ''
      return
    }
    const extra = Math.max(cars.length, 2) * innerHeight * 0.85
    root.style.height = `${pin.offsetHeight + extra}px`
  }

  function scrollTarget() {
    if (drive !== 'scroll' || mode !== 'ring') return
    const extra = root.offsetHeight - pin.offsetHeight
    const top = root.getBoundingClientRect().top
    const p = extra > 0 ? clamp(-top / extra, 0, 1) : 0
    target = p * maxAngle()
  }

  function snapTarget() {
    const n = cars.length
    if (!n) return
    const a = TAU / n
    target = clamp(Math.round(target / a) * a, 0, maxAngle())
  }

  function hud() {
    if (!cars.length) return
    const i = ring ? ring.frontIndex() : 0
    if (i === front && countEl?.dataset.n === String(i)) return
    const hudEl = $('[data-hud]', root)
    if (hudEl && i !== front && front >= 0 && !reduceMotion.matches) {
      hudEl.classList.remove('is-tick')
      void hudEl.offsetWidth
      hudEl.classList.add('is-tick')
    }
    front = i
    if (countEl) {
      countEl.dataset.n = String(i)
      countEl.innerHTML = `<b>${pad2(i + 1)}</b> / ${pad2(cars.length)}`
    }
    const c = cars[i]
    if (!c) return
    if (nameEl) nameEl.textContent = `${c.make} ${c.model}`
    if (priceEl) priceEl.textContent = fcfa(c.price)
    if (specsEl) specsEl.textContent = `${c.year} · ${km(c.km)}`
    if (openBtn) {
      openBtn.href = detailUrl(c)
      openBtn.hidden = false
    }
  }

  function tick(t) {
    if (!running) return
    raf = requestAnimationFrame(tick)
    if (!visible || mode !== 'ring' || !ring) return
    if (drive === 'scroll') scrollTarget()
    const dt = prev ? Math.min(32, t - prev) / 16.67 : 1
    prev = t
    const next = angle + (target - angle) * (1 - Math.pow(0.72, dt))
    vel += ((next - angle) - vel) * 0.35
    angle = next
    ring.setPose(angle, vel)
    ring.draw()
    hud()
  }

  function start() {
    if (mode !== 'ring' || !ring) return
    if (!running) {
      running = true
      prev = 0
      raf = requestAnimationFrame(tick)
    }
  }
  function stop() {
    running = false
    cancelAnimationFrame(raf)
  }

  function renderIndex() {
    if (!indexEl) return
    indexEl.innerHTML = cars.map((c, i) => `
      <li>
        <a href="${detailUrl(c)}" data-n="${c.n}">
          <span class="idx-n">${pad2(i + 1)}</span>
          <span class="idx-body">
            <span class="idx-name">${esc(c.make)} ${esc(c.model)}</span>
            <span class="idx-meta">${c.year} · ${km(c.km)}</span>
          </span>
          <span class="idx-price">${fcfa(c.price)}</span>
          ${status(c)}
          <img src="${esc(c.img)}" alt="" class="idx-shot" style="--pos:${c.pos}">
        </a>
      </li>`).join('')
  }

  function setFeatured(i) {
    if (!cars[i]) return
    featured = i
    if (mode === 'atelier') renderAtelier()
  }

  function renderAtelier() {
    if (!atelier) return
    const img = $('[data-atelier-img]', atelier)
    const hero = $('[data-atelier-hero]', atelier)
    const strip = $('[data-atelier-strip]', atelier)
    const c = cars[featured] || cars[0]
    if (!c) return
    featured = cars.indexOf(c)
    if (img) {
      const next = c.img
      if (img.getAttribute('src') !== next) {
        img.src = next
        img.alt = `${c.make} ${c.model}`
        img.style.setProperty('--pos', c.pos)
        if (!reduceMotion.matches) {
          img.classList.remove('is-in')
          void img.offsetWidth
          img.classList.add('is-in')
        }
      }
    }
    const brand = $('[data-atelier-brand]', atelier)
    const name = $('[data-atelier-name]', atelier)
    const specs = $('[data-atelier-specs]', atelier)
    const price = $('[data-atelier-price]', atelier)
    const count = $('[data-atelier-count]', atelier)
    const st = $('[data-atelier-status]', atelier)
    if (brand) brand.textContent = c.make
    if (name) name.textContent = c.model
    if (specs) specs.textContent = `${c.year} · ${km(c.km)}`
    if (price) price.textContent = fcfa(c.price)
    if (count) count.innerHTML = `<b>${pad2(featured + 1)}</b> / ${pad2(cars.length)}`
    if (st) st.innerHTML = status(c)
    if (hero) hero.href = detailUrl(c)
    if (strip) {
      strip.innerHTML = cars.map((car, i) => `
        <button type="button" data-i="${i}" aria-pressed="${i === featured}" aria-label="${esc(car.make)} ${esc(car.model)}">
          <img src="${esc(car.img)}" alt="" style="--pos:${car.pos}" decoding="async">
          <span>${pad2(i + 1)}</span>
        </button>`).join('')
      if (mode === 'atelier' && !atelier.hidden) {
        const cur = $('[aria-pressed="true"]', strip)
        if (cur) {
          const left = cur.offsetLeft - strip.clientWidth / 2 + cur.clientWidth / 2
          strip.scrollTo({ left: Math.max(0, left), behavior: reduceMotion.matches ? 'auto' : 'smooth' })
        }
      }
    }
  }

  function openIndex(i, rect) {
    const c = cars[i]
    if (!c) return
    flyTo(c, rect, detailUrl(c))
  }

  function bindRing() {
    if (!canvas || !webglOk()) return false
    if (ring) return true
    try { ring = createRing(canvas) } catch { return false }
    if (cars.length) {
      ring.setCars(cars).then((r) => {
        if (r && !r.loaded && r.expected && mode === 'ring') setMode('list')
      })
    }
    return true
  }

  function setMode(next) {
    if (!modes.includes(next)) return
    if (next === 'ring' && !bindRing()) next = modes.find((m) => m !== 'ring') || next
    mode = next
    syncChrome()
  }

  function setCars(next) {
    const keep = cars[featured]?.n
    cars = next.slice()
    featured = cars.findIndex((c) => c.n === keep)
    if (featured < 0) featured = Math.max(0, cars.findIndex((c) => c.status === 'available'))
    renderIndex()
    renderAtelier()
    if (ring && cars.length) {
      ring.setCars(cars).then((r) => {
        if (r && !r.loaded && r.expected && mode === 'ring') setMode('list')
      })
    }
    front = -1
    target = clamp(target, 0, maxAngle())
    angle = clamp(angle, 0, maxAngle())
    if (!cars.length) {
      if (openBtn) openBtn.hidden = true
      if (nameEl) nameEl.textContent = ''
      if (priceEl) priceEl.textContent = ''
    }
    layout()
    hud()
    syncChrome()
  }

  canvas?.addEventListener('pointerdown', (e) => {
    if (mode !== 'ring' || drive === 'scroll') return
    canvas.setPointerCapture(e.pointerId)
    didDrag = false
    drag = { x: e.clientX, a: target }
  })
  canvas?.addEventListener('pointermove', (e) => {
    if (!drag) return
    if (Math.abs(e.clientX - drag.x) > 6) didDrag = true
    target = clamp(drag.a - (e.clientX - drag.x) / innerWidth * TAU * 1.15, 0, maxAngle())
  })
  const endDrag = () => {
    if (drag) snapTarget()
    drag = null
  }
  canvas?.addEventListener('pointerup', endDrag)
  canvas?.addEventListener('pointercancel', endDrag)
  canvas?.addEventListener('wheel', (e) => {
    if (mode !== 'ring' || drive === 'scroll') return
    e.preventDefault()
    target += e.deltaY * 0.0028
    target = clamp(target, 0, maxAngle())
    clearTimeout(wheelSnap)
    wheelSnap = setTimeout(snapTarget, 90)
  }, { passive: false })
  canvas?.addEventListener('click', (e) => {
    if (mode !== 'ring' || !ring || !cars.length) return
    if (didDrag) { didDrag = false; return }
    const i = ring.pick(e.clientX, e.clientY)
    openIndex(i, ring.planeRect(i))
  })
  canvas?.addEventListener('keydown', (e) => {
    if (mode !== 'ring' || !cars.length) return
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault()
      target = clamp(target + TAU / cars.length, 0, maxAngle())
    }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault()
      target = clamp(target - TAU / cars.length, 0, maxAngle())
    }
    if (e.key === 'Enter') {
      e.preventDefault()
      const i = ring?.frontIndex() || 0
      openIndex(i, ring?.frontRect())
    }
  })
  openBtn?.addEventListener('click', (e) => {
    if (mode !== 'ring' || !ring) return
    e.preventDefault()
    const i = ring.frontIndex()
    openIndex(i, ring.frontRect())
  })
  indexEl?.addEventListener('click', (e) => {
    const a = e.target.closest('a')
    if (!a) return
    e.preventDefault()
    const img = $('.idx-shot', a)
    openIndex(cars.findIndex((c) => String(c.n) === a.dataset.n), img?.getBoundingClientRect())
  })
  viewEl?.addEventListener('click', (e) => {
    const b = e.target.closest('button')
    if (b?.dataset.mode) setMode(b.dataset.mode)
  })
  atelier?.addEventListener('click', (e) => {
    const b = e.target.closest('[data-i]')
    if (b) {
      e.preventDefault()
      setFeatured(Number(b.dataset.i))
      return
    }
    const hero = e.target.closest('[data-atelier-hero]')
    if (!hero || !cars[featured]) return
    e.preventDefault()
    const img = $('[data-atelier-img]', atelier)
    openIndex(featured, img?.getBoundingClientRect())
  })
  addEventListener('keydown', (e) => {
    if (mode !== 'atelier' || !cars.length) return
    if (e.target.closest('input, select, textarea, button[data-mode]')) return
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault()
      setFeatured(Math.min(cars.length - 1, featured + 1))
    }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault()
      setFeatured(Math.max(0, featured - 1))
    }
    if (e.key === 'Enter' && document.activeElement === document.body) {
      e.preventDefault()
      const img = $('[data-atelier-img]', atelier)
      openIndex(featured, img?.getBoundingClientRect())
    }
  })

  addEventListener('resize', () => { layout(); setPressed() })
  if (stage && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      if (visible) start()
    }, { rootMargin: '20% 0px' })
    io.observe(stage)
  }

  if (mode === 'ring' && !bindRing()) mode = modes.find((m) => m !== 'ring') || 'list'
  syncChrome()
  document.fonts?.ready.then(setPressed)

  return {
    setCars,
    setMode,
    get mode() { return mode },
    destroy() {
      stop()
      ring?.destroy()
    },
  }
}
