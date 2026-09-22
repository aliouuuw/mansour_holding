import {
  $, $$, esc, fcfa, km, pad2, detailUrl, status, reduceMotion, segThumb,
} from './dom.js'

const TAU = Math.PI * 2

function clamp(n, a, b) { return Math.min(b, Math.max(a, n)) }

/* Lenis-style exponential damp. Site Lenis uses duration 1.2; lambda = 10 / duration. */
function damp(cur, next, lambda, dt) {
  const t = Math.min(0.064, dt * 16.67 / 1000)
  return cur + (next - cur) * (1 - Math.exp(-lambda * t))
}

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
uniform float uReflect;
varying vec2 vUv;
void main() {
  float a = uAberration * (0.55 + 0.45 * (1.0 - uFocus));
  float r = texture2D(uTex, vUv + vec2(a, 0.0)).r;
  float g = texture2D(uTex, vUv).g;
  float b = texture2D(uTex, vUv - vec2(a, 0.0)).b;
  vec3 col = vec3(r, g, b) * mix(0.4, 1.0, uFocus);
  /* mirrored copy on the showroom floor: strong at the contact line, gone by mid-height */
  gl_FragColor = uReflect > 0.0 ? vec4(col, pow(1.0 - vUv.y, 2.6) * uReflect) : vec4(col, 1.0);
}`

/* the studio: a gloss floor lit by one overhead softbox that sits above the selected car */
const STUDIO_VS = `
attribute vec3 aPos;
attribute vec2 aUv;
uniform mat4 uViewProj;
uniform mat4 uModel;
varying vec2 vUv;
varying vec3 vW;
void main() {
  vec4 w = uModel * vec4(aPos, 1.0);
  vW = w.xyz;
  vUv = aUv;
  gl_Position = uViewProj * w;
}`

const STUDIO_FS = `
precision highp float;
uniform float uMode;
uniform float uLightX;
uniform vec2 uSize;
uniform vec3 uTint;
uniform vec3 uBase;
varying vec2 vUv;
varying vec3 vW;
float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
void main() {
  if (uMode < 0.5) {
    vec2 d = vec2((vW.x - uLightX) / 2.8, (vW.z - 0.45) / 2.1);
    float pool = exp(-dot(d, d));
    float near = smoothstep(-10.0, 2.0, vW.z);
    vec3 col = uBase * (1.0 + 0.9 * near) + uTint * 0.12 * pool;
    gl_FragColor = vec4(col + (hash(gl_FragCoord.xy) - 0.5) * 2.5 / 255.0, 1.0);
  } else {
    /* underside of a flat softbox: diffuser brightest in the middle, soft rounded rim */
    vec2 p = (vUv - 0.5) * uSize;
    float r = 0.12;
    float d = length(max(abs(p) - (uSize * 0.5 - r), 0.0)) - r;
    float x = abs(vUv.x - 0.5) * 2.0;
    float lum = smoothstep(0.03, -0.05, d) * (0.5 + 0.38 * (1.0 - x * x));
    gl_FragColor = vec4(uTint * lum, 1.0);
  }
}`

function bake(img, pos, cutout) {
  const W = 1024, H = 768
  const c = document.createElement('canvas')
  c.width = W
  c.height = H
  const ctx = c.getContext('2d')
  ctx.fillStyle = '#050505'
  ctx.fillRect(0, 0, W, H)
  const [fx, fy] = parsePos(pos)
  const ir = img.width / img.height
  const cr = W / H
  let dw, dh
  if (cutout) {
    /* contain: keep the whole car on the plate */
    if (ir > cr) { dw = W * 0.92; dh = dw / ir } else { dh = H * 0.86; dw = dh * ir }
    ctx.drawImage(img, (W - dw) / 2, H - dh - H * 0.06, dw, dh)
  } else {
    if (ir > cr) { dh = H; dw = H * ir } else { dw = W; dh = W / ir }
    ctx.drawImage(img, (W - dw) * fx, (H - dh) * fy, dw, dh)
  }
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
    uReflect: gl.getUniformLocation(prog, 'uReflect'),
  }
  const studio = program(gl, STUDIO_VS, STUDIO_FS)
  const sLoc = {
    aPos: gl.getAttribLocation(studio, 'aPos'),
    aUv: gl.getAttribLocation(studio, 'aUv'),
    uViewProj: gl.getUniformLocation(studio, 'uViewProj'),
    uModel: gl.getUniformLocation(studio, 'uModel'),
    uMode: gl.getUniformLocation(studio, 'uMode'),
    uLightX: gl.getUniformLocation(studio, 'uLightX'),
    uSize: gl.getUniformLocation(studio, 'uSize'),
    uTint: gl.getUniformLocation(studio, 'uTint'),
    uBase: gl.getUniformLocation(studio, 'uBase'),
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
  const unit = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, unit)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    -0.5, -0.5, 0, 0, 0,
     0.5, -0.5, 0, 1, 0,
    -0.5,  0.5, 0, 0, 1,
     0.5,  0.5, 0, 1, 1,
  ]), gl.STATIC_DRAW)

  /* floor sits at the bottom edge of the panels; the softbox hangs above the front one */
  const FLOOR = -PH / 2
  const LIGHT = { w: 3, d: 1.5, y: PH / 2 + 0.78, z: 0.2 }
  const TINT = [1, 0.965, 0.92]
  const BASE = [0.02, 0.02, 0.02]
  const mirror = identity(new Float32Array(16))
  mirror[5] = -1
  mirror[13] = 2 * FLOOR
  const floorM = new Float32Array(16)
  const lightM = new Float32Array(16)
  const reflM = new Float32Array(16)

  const view = new Float32Array(16)
  const proj = new Float32Array(16)
  const vp = new Float32Array(16)
  const model = new Float32Array(16)
  const ry = new Float32Array(16)
  const tr = new Float32Array(16)
  const sc = identity(new Float32Array(16))

  let cars = []
  let textures = []
  let angle = 0
  let bend = 0
  let aberr = 0
  let magI = 0
  let mag = 0
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
    const x0 = i * g - pan
    const hx = magI * g - pan
    const slot = Math.abs(i - magI)
    const k = mag * Math.exp(-slot * slot * 0.55)
    const pull = (hx - x0) * 0.32 * k
    return {
      pan,
      x: x0 + pull,
      y: 0,
      z: 0.95 / (1 + d * d) - 0.03 * d * d + 0.16 * k,
      yaw: -d * 0.16 - Math.sign(hx - x0 || 1) * 0.05 * k,
      d,
    }
  }

  /* 1 shows the photo as shot, -1 mirrors it. Side cars point their nose at the front car;
     the front car is never mirrored. The turn happens between 0.35 and 0.85 of a step out,
     so a car crossing sides turns around on the way instead of flipping in one frame. */
  function facing(i, d) {
    const toRight = cars[i]?.face === 'right'
    return toRight ? clamp((0.6 - d) / 0.25, -1, 1) : clamp((d + 0.6) / 0.25, -1, 1)
  }

  function placeModel(i) {
    const p = pose(i)
    rotateY(ry, p.yaw)
    translate(tr, p.x, p.y, p.z)
    multiply(model, tr, ry)
    sc[0] = facing(i, p.d)
    multiply(model, model, sc)
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
        const baked = bake(img, c.pos, c.cutout)
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
    let best = -1, dist = 1e9
    for (let i = 0; i < cars.length; i++) {
      const r = planeRect(i)
      const pad = 12
      if (cx < r.left - pad || cy < r.top - pad || cx > r.left + r.width + pad || cy > r.top + r.height + pad) continue
      const dx = r.left + r.width / 2 - cx
      const dy = r.top + r.height / 2 - cy
      const d = Math.hypot(dx, dy)
      if (d < dist) { dist = d; best = i }
    }
    return best
  }

  function attrib(l, b) {
    gl.bindBuffer(gl.ARRAY_BUFFER, b)
    gl.enableVertexAttribArray(l.aPos)
    gl.vertexAttribPointer(l.aPos, 3, gl.FLOAT, false, 20, 0)
    gl.enableVertexAttribArray(l.aUv)
    gl.vertexAttribPointer(l.aUv, 2, gl.FLOAT, false, 20, 12)
  }

  function drawStudio(lightX) {
    gl.useProgram(studio)
    attrib(sLoc, unit)
    gl.uniformMatrix4fv(sLoc.uViewProj, false, vp)
    gl.uniform3fv(sLoc.uTint, TINT)
    gl.uniform3fv(sLoc.uBase, BASE)
    gl.uniform1f(sLoc.uLightX, lightX)
    /* floor: unit quad laid flat, x across, y into depth */
    identity(floorM)
    floorM[0] = 60; floorM[5] = 0; floorM[6] = 24; floorM[10] = 1
    floorM[13] = FLOOR; floorM[14] = -2
    gl.uniformMatrix4fv(sLoc.uModel, false, floorM)
    gl.uniform1f(sLoc.uMode, 0)
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    /* softbox: a flat panel hung above the car, seen from below.
       Portrait has no free band between the page head and the cars, so the floor light carries it alone. */
    if (pixel[0] < pixel[1]) return
    identity(lightM)
    lightM[0] = LIGHT.w; lightM[5] = 0; lightM[6] = LIGHT.d
    lightM[12] = lightX; lightM[13] = LIGHT.y; lightM[14] = LIGHT.z
    gl.uniformMatrix4fv(sLoc.uModel, false, lightM)
    gl.uniform2f(sLoc.uSize, LIGHT.w, LIGHT.d)
    gl.uniform1f(sLoc.uMode, 1)
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.ONE, gl.ONE)
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
  }

  function draw() {
    resize()
    gl.clearColor(BASE[0], BASE[1], BASE[2], 1)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    gl.disable(gl.DEPTH_TEST)

    const n = cars.length
    lookAt(view, [0, 0.16, CAM_Z], [0, -0.12, 0.22], [0, 1, 0])
    perspective(proj, FOVY, pixel[0] / pixel[1], 0.15, 40)
    multiply(vp, proj, view)

    const s = selected()
    drawStudio(n ? s * gap() - pose(0).pan : 0)

    gl.useProgram(prog)
    attrib(loc, buf)
    gl.uniformMatrix4fv(loc.uViewProj, false, vp)
    gl.uniform1i(loc.uTex, 0)
    gl.uniform1f(loc.uBend, bend)
    gl.uniform1f(loc.uAberration, aberr)
    gl.activeTexture(gl.TEXTURE0)

    if (!n) { gl.disable(gl.BLEND); return }
    const order = cars.map((_, i) => i).sort((a, b) => pose(a).z - pose(b).z)
    const focusOf = (d) => clamp(1 / (1 + d ** 2 * 0.42), 0, 1) ** 1.15

    /* reflections first, blended into the floor */
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
    for (const i of order) {
      const p = placeModel(i)
      multiply(reflM, mirror, model)
      gl.uniformMatrix4fv(loc.uModel, false, reflM)
      gl.uniform1f(loc.uFocus, focusOf(p.d))
      gl.uniform1f(loc.uReflect, 0.34)
      gl.bindTexture(gl.TEXTURE_2D, textures[i] || blank)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    }
    gl.disable(gl.BLEND)

    gl.enable(gl.DEPTH_TEST)
    gl.uniform1f(loc.uReflect, 0)
    for (const i of order) {
      const p = placeModel(i)
      gl.uniformMatrix4fv(loc.uModel, false, model)
      gl.uniform1f(loc.uFocus, focusOf(p.d))
      gl.bindTexture(gl.TEXTURE_2D, textures[i] || blank)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    }
  }

  return {
    setCars,
    setPose(a, velocity, hover, amount) {
      angle = a
      bend = clamp(velocity * (hover != null ? 0.55 : 1.15), -1.15, 1.15)
      aberr = clamp(Math.abs(velocity) * (hover != null ? 0.014 : 0.034), 0, 0.028)
      if (hover != null) magI = hover
      if (amount != null) mag = amount
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
      gl.deleteBuffer(unit)
      gl.deleteProgram(prog)
      gl.deleteProgram(studio)
    },
  }
}

function flyTo(car, rect, href, go) {
  if (reduceMotion.matches || !rect || rect.width < 8) {
    go(href)
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
  setTimeout(() => go(href), 780)
}

export function mountTurntable(root, {
  drive = 'scroll',
  modes = ['ring', 'list'],
  hint = '',
  navigate = (href) => { location.href = href },
} = {}) {
  /* every window listener is tied to this, so destroy() leaves no trace on other pages */
  const life = new AbortController()
  const signal = life.signal
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
  const ticksEl = $('[data-ticks]', root)
  const liveEl = $('[data-live]', root)

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
  let settleT = 0
  let liveT = 0
  let touching = false
  let snapping = false
  let magWant = 0
  let magIWant = 0
  let magI = 0
  let mag = 0
  let pointer = null
  let scrolling = false
  let scrollT = 0
  let lastPx = NaN
  let lastPy = NaN
  const LAMBDA = 10 / 1.2
  const REST = 8e-4
  const atelier = $('[data-atelier]', root)
  const phone = () => matchMedia('(max-width: 860px)').matches
  const swipeHintKey = 'mm-atelier-swipe-hint'
  let swipeHintOff = false
  try { swipeHintOff = sessionStorage.getItem(swipeHintKey) === '1' } catch { /* ponytail: private mode */ }
  if (atelier && swipeHintOff) atelier.dataset.swipeHint = 'off'

  if (hintEl && hint) hintEl.textContent = hint

  function dismissSwipeHint() {
    if (!atelier || swipeHintOff) return
    swipeHintOff = true
    atelier.dataset.swipeHint = 'off'
    try { sessionStorage.setItem(swipeHintKey, '1') } catch { /* noop */ }
  }

  function syncSwipeHint() {
    if (!atelier) return
    const media = $('[data-atelier-media]', atelier)
    const hint = $('[data-atelier-swipe-hint]', atelier)
    const can = cars.length > 1 && phone() && mode === 'atelier' && !atelier.hidden
    if (media) media.classList.toggle('is-swipeable', can)
    if (hint) hint.hidden = !can || swipeHintOff
  }

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
    root.classList.toggle('is-grid', mode === 'grid')
    root.classList.toggle('is-list', mode === 'list')
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
    else syncSwipeHint()
    if (mode === 'ring') start()
    else stop()
  }

  function layout() {
    if (drive !== 'scroll') return
    if (mode !== 'ring') {
      root.style.height = ''
      return
    }
    const extra = Math.max(cars.length - 1, 1) * innerHeight * 0.6
    root.style.height = `${pin.offsetHeight + extra}px`
  }

  function scrollTarget() {
    if (drive !== 'scroll' || mode !== 'ring') return
    const extra = root.offsetHeight - pin.offsetHeight
    const top = root.getBoundingClientRect().top
    const p = extra > 0 ? clamp(-top / extra, 0, 1) : 0
    target = p * maxAngle()
  }

  /* page scroll that puts car i in front */
  function carY(i) {
    const extra = root.offsetHeight - pin.offsetHeight
    const n = cars.length
    return root.getBoundingClientRect().top + scrollY + (n > 1 ? i / (n - 1) : 0) * extra
  }

  function goTo(i) {
    if (!cars.length) return
    i = clamp(i, 0, cars.length - 1)
    magIWant = i
    if (drive !== 'scroll') { target = i * TAU / cars.length; start(); return }
    snapping = true
    scrollTo({ top: carY(i), behavior: reduceMotion.matches ? 'auto' : 'smooth' })
  }

  function hoverAt(cx, cy) {
    if (!ring || !cars.length) return
    const i = ring.pick(cx, cy)
    if (i < 0) {
      magWant = 0
      return
    }
    magIWant = i
    magWant = reduceMotion.matches ? 0 : 1
    target = i * TAU / cars.length
  }

  /* when the scroll rests inside the plateau, finish the move to the nearest car */
  function settle() {
    if (drive !== 'scroll' || mode !== 'ring' || touching || cars.length < 2) return
    const extra = root.offsetHeight - pin.offsetHeight
    const top = -root.getBoundingClientRect().top
    if (top <= 1 || top >= extra - 1) return
    const i = Math.round(top / extra * (cars.length - 1))
    if (Math.abs(carY(i) - scrollY) > 2) goTo(i)
  }

  function renderTicks() {
    if (!ticksEl) return
    ticksEl.innerHTML = cars.map((c, i) =>
      `<button type="button" data-i="${i}" aria-label="${pad2(i + 1)}, ${esc(c.make)} ${esc(c.model)}"></button>`).join('')
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
    if (ticksEl) for (const b of ticksEl.children) {
      if (Number(b.dataset.i) === i) b.setAttribute('aria-current', 'true')
      else b.removeAttribute('aria-current')
    }
    /* read the car once the plateau rests, not every car it passes */
    /* only the plateau speaks; on the stock page the same region reports the filter count */
    if (liveEl && mode === 'ring') {
      clearTimeout(liveT)
      liveT = setTimeout(() => {
        liveEl.textContent = `Véhicule ${i + 1} sur ${cars.length} : ${c.make} ${c.model}, ${fcfa(c.price)}`
      }, 450)
    }
  }

  function tick(t) {
    if (!running) return
    raf = requestAnimationFrame(tick)
    if (!visible || mode !== 'ring' || !ring) return
    if (drive === 'scroll') scrollTarget()
    if (drive === 'hover' && pointer && !scrolling && (pointer.x !== lastPx || pointer.y !== lastPy)) {
      lastPx = pointer.x
      lastPy = pointer.y
      hoverAt(pointer.x, pointer.y)
    }
    const dt = prev ? Math.min(32, t - prev) / 16.67 : 1
    prev = t
    const fluid = drive === 'hover' && !reduceMotion.matches
    mag = fluid ? damp(mag, magWant, LAMBDA, dt) : mag + (magWant - mag) * (1 - Math.pow(0.78, dt))
    magI = fluid ? damp(magI, magIWant, LAMBDA, dt) : magIWant
    const next = fluid
      ? damp(angle, target, LAMBDA, dt)
      : angle + (target - angle) * (1 - Math.pow(0.72, dt))
    vel += ((next - angle) - vel) * (fluid ? 0.12 : 0.35)
    angle = next
    ring.setPose(angle, vel, magI, mag)
    ring.draw()
    hud()
    if (drive !== 'scroll' && rest()) stop()
  }

  function rest() {
    return Math.abs(target - angle) < REST
      && Math.abs(magWant - mag) < REST
      && Math.abs(magIWant - magI) < REST
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
          <img src="${esc(c.img)}" alt="" class="idx-shot${c.cutout ? ' is-cutout' : ''}" style="--pos:${c.pos}">
        </a>
      </li>`).join('')
  }

  function setFeatured(i) {
    if (!cars[i]) return
    featured = i
    if (mode === 'atelier') renderAtelier()
  }

  function stepFeatured(step) {
    if (!cars.length) return
    setFeatured((featured + step + cars.length) % cars.length)
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
        img.classList.toggle('is-cutout', !!c.cutout)
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
    for (const button of $$('[data-atelier-step]', atelier)) button.hidden = cars.length < 2
    if (strip) {
      strip.innerHTML = cars.map((car, i) => `
        <button type="button" data-i="${i}" aria-pressed="${i === featured}" aria-label="${esc(car.make)} ${esc(car.model)}">
          <img src="${esc(car.img)}" alt="" class="${car.cutout ? 'is-cutout' : ''}" style="--pos:${car.pos}" decoding="async">
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
    syncSwipeHint()
  }

  function openIndex(i, rect) {
    const c = cars[i]
    if (!c) return
    flyTo(c, rect, detailUrl(c), navigate)
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
    renderTicks()
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
    if (mode !== 'ring') return
    if (drive === 'hover') {
      if (e.pointerType !== 'mouse') return
      pointer = { x: e.clientX, y: e.clientY }
      start()
      return
    }
    if (drive === 'scroll') return
    canvas.setPointerCapture(e.pointerId)
    didDrag = false
    drag = { x: e.clientX, a: target }
  })
  canvas?.addEventListener('pointermove', (e) => {
    if (mode === 'ring' && drive === 'hover' && ring) {
      if (e.pointerType !== 'mouse' || scrolling) return
      pointer = { x: e.clientX, y: e.clientY }
      start()
      return
    }
    if (!drag) return
    if (Math.abs(e.clientX - drag.x) > 6) didDrag = true
    target = clamp(drag.a - (e.clientX - drag.x) / innerWidth * TAU * 1.15, 0, maxAngle())
  })
  canvas?.addEventListener('pointerleave', () => {
    if (drive !== 'hover') return
    pointer = null
    magWant = 0
    start()
  })
  const endDrag = () => {
    if (drag) snapTarget()
    drag = null
  }
  canvas?.addEventListener('pointerup', endDrag)
  canvas?.addEventListener('pointercancel', endDrag)
  canvas?.addEventListener('wheel', (e) => {
    if (mode !== 'ring' || drive === 'scroll' || drive === 'hover') return
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
    if (i < 0) return
    openIndex(i, ring.planeRect(i))
  })
  canvas?.addEventListener('keydown', (e) => {
    if (mode !== 'ring' || !cars.length) return
    const at = ring ? ring.frontIndex() : 0
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault()
      goTo(at + 1)
    }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault()
      goTo(at - 1)
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
  ticksEl?.addEventListener('click', (e) => {
    const b = e.target.closest('[data-i]')
    if (b) goTo(Number(b.dataset.i))
  })
  if (drive === 'hover') {
    addEventListener('scroll', () => {
      scrolling = true
      pointer = null
      magWant = 0
      lastPx = NaN
      lastPy = NaN
      start()
      clearTimeout(scrollT)
      scrollT = setTimeout(() => { scrolling = false }, 140)
    }, { passive: true, signal })
  }
  if (drive === 'scroll') {
    addEventListener('scroll', () => {
      clearTimeout(settleT)
      settleT = setTimeout(() => {
        if (snapping) { snapping = false; return }
        settle()
      }, 160)
    }, { passive: true, signal })
    addEventListener('touchstart', () => { touching = true }, { passive: true, signal })
    addEventListener('touchend', () => { touching = false; clearTimeout(settleT); settleT = setTimeout(settle, 160) }, { passive: true, signal })
  }
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
  let swipeX = 0
  let swipeY = 0
  let swiping = false
  let didSwipe = false
  const resetSwipeDrag = (img) => {
    if (!img) return
    img.classList.remove('is-dragging')
    img.style.transform = ''
  }
  atelier?.addEventListener('pointerdown', (e) => {
    if (mode !== 'atelier') return
    const media = e.target.closest('[data-atelier-media]')
    if (!media) return
    if (cars.length < 2) return
    swipeX = e.clientX
    swipeY = e.clientY
    swiping = true
    didSwipe = false
    media.setPointerCapture?.(e.pointerId)
  }, { signal })
  atelier?.addEventListener('pointermove', (e) => {
    if (!swiping || mode !== 'atelier') return
    const dx = e.clientX - swipeX
    const dy = e.clientY - swipeY
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 6) e.preventDefault()
    const img = $('[data-atelier-img]', atelier)
    if (!img || reduceMotion.matches) return
    const shift = Math.max(-28, Math.min(28, dx * 0.22))
    img.classList.add('is-dragging')
    img.style.transform = `translate3d(${shift}px, 0, 0)`
  }, { signal })
  const endSwipe = (e) => {
    if (!swiping) return
    swiping = false
    const img = $('[data-atelier-img]', atelier)
    resetSwipeDrag(img)
    if (mode !== 'atelier' || !cars.length) return
    const dx = e.clientX - swipeX
    if (Math.abs(dx) < 40) return
    didSwipe = true
    dismissSwipeHint()
    stepFeatured(dx < 0 ? 1 : -1)
  }
  atelier?.addEventListener('pointerup', endSwipe, { signal })
  atelier?.addEventListener('pointercancel', endSwipe, { signal })
  matchMedia('(max-width: 860px)').addEventListener('change', () => syncSwipeHint(), { signal })
  atelier?.addEventListener('click', (e) => {
    const step = e.target.closest('[data-atelier-step]')
    if (step) {
      e.preventDefault()
      stepFeatured(Number(step.dataset.atelierStep))
      return
    }
    const b = e.target.closest('[data-i]')
    if (b) {
      e.preventDefault()
      didSwipe = false
      setFeatured(Number(b.dataset.i))
      return
    }
    const hero = e.target.closest('[data-atelier-hero]')
    if (!hero || !cars[featured]) return
    e.preventDefault()
    if (didSwipe) { didSwipe = false; return }
    const img = $('[data-atelier-img]', atelier)
    openIndex(featured, img?.getBoundingClientRect())
  })
  addEventListener('keydown', (e) => {
    if (mode !== 'atelier' || !cars.length) return
    if (e.target.closest('input, select, textarea, .filterbar, .custom-select')) return
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault()
      stepFeatured(1)
    }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault()
      stepFeatured(-1)
    }
    if (e.key === 'Enter' && document.activeElement === document.body) {
      e.preventDefault()
      const img = $('[data-atelier-img]', atelier)
      openIndex(featured, img?.getBoundingClientRect())
    }
  }, { signal })

  addEventListener('resize', () => { layout(); setPressed() }, { signal })
  let io = null
  if (stage && 'IntersectionObserver' in window) {
    io = new IntersectionObserver(([e]) => {
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
      life.abort()
      io?.disconnect()
      clearTimeout(settleT)
      clearTimeout(liveT)
      clearTimeout(scrollT)
      ring?.destroy()
    },
  }
}
