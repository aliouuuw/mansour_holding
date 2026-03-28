import { Hono, type Context, type Next } from 'hono'
import { eq, and, ilike, sql } from 'drizzle-orm'
import { db } from '../db/index'
import { vehicles } from '../db/schema'
import { auth } from '../auth'

const vehiclesRoute = new Hono()

// Upload a file to R2 using the S3-compatible REST API with AWS Signature V4
async function uploadToR2(key: string, body: Uint8Array, contentType: string): Promise<void> {
  const endpoint = process.env.R2_ENDPOINT!
  const bucket = process.env.R2_BUCKET_NAME!
  const accessKeyId = process.env.R2_ACCESS_KEY_ID!
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY!
  const region = 'auto'
  const service = 's3'

  const url = `${endpoint}/${bucket}/${key}`
  const now = new Date()
  const dateStamp = now.toISOString().slice(0, 10).replace(/-/g, '')
  const amzDate = now.toISOString().replace(/[:-]/g, '').slice(0, 15) + 'Z'

  // Hash the payload
  const payloadHash = await crypto.subtle.digest('SHA-256', body.buffer as ArrayBuffer)
  const payloadHashHex = Array.from(new Uint8Array(payloadHash)).map(b => b.toString(16).padStart(2, '0')).join('')

  const host = new URL(url).host
  const canonicalHeaders = `content-type:${contentType}\nhost:${host}\nx-amz-content-sha256:${payloadHashHex}\nx-amz-date:${amzDate}\n`
  const signedHeaders = 'content-type;host;x-amz-content-sha256;x-amz-date'
  const canonicalRequest = `PUT\n/${bucket}/${key}\n\n${canonicalHeaders}\n${signedHeaders}\n${payloadHashHex}`

  const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`
  const canonicalRequestHash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(canonicalRequest))
  const canonicalRequestHashHex = Array.from(new Uint8Array(canonicalRequestHash)).map(b => b.toString(16).padStart(2, '0')).join('')
  const stringToSign = `AWS4-HMAC-SHA256\n${amzDate}\n${credentialScope}\n${canonicalRequestHashHex}`

  // Derive signing key
  async function hmac(key: ArrayBuffer | Uint8Array, data: string): Promise<ArrayBuffer> {
    const k = await crypto.subtle.importKey('raw', key instanceof Uint8Array ? key.buffer as ArrayBuffer : key, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
    return crypto.subtle.sign('HMAC', k, new TextEncoder().encode(data))
  }
  const kDate = await hmac(new TextEncoder().encode(`AWS4${secretAccessKey}`), dateStamp)
  const kRegion = await hmac(kDate, region)
  const kService = await hmac(kRegion, service)
  const kSigning = await hmac(kService, 'aws4_request')
  const signatureBuffer = await hmac(kSigning, stringToSign)
  const signature = Array.from(new Uint8Array(signatureBuffer)).map(b => b.toString(16).padStart(2, '0')).join('')

  const authorization = `AWS4-HMAC-SHA256 Credential=${accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`

  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': contentType,
      'x-amz-content-sha256': payloadHashHex,
      'x-amz-date': amzDate,
      Authorization: authorization,
    },
    body: body.buffer as ArrayBuffer,
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`R2 upload failed: ${res.status} ${text}`)
  }
}

// Auth middleware — applied selectively to write routes only
async function requireAuth(c: Context, next: Next) {
  const session = await auth.api.getSession({ headers: c.req.raw.headers })
  if (!session) return c.json({ error: 'Unauthorized' }, 401)
  c.set('session' as never, session)
  await next()
}

// GET /api/vehicles — public, list with pagination and filters
vehiclesRoute.get('/', async (c) => {
  const { page = '1', limit = '20', status, search } = c.req.query()
  const pageNum = Math.max(1, parseInt(page))
  const limitNum = Math.min(100, Math.max(1, parseInt(limit)))
  const offset = (pageNum - 1) * limitNum

  const conditions = []
  if (status) conditions.push(eq(vehicles.status, status as 'available' | 'sold' | 'reserved'))
  if (search) conditions.push(
    sql`(${vehicles.make} ilike ${'%' + search + '%'} or ${vehicles.model} ilike ${'%' + search + '%'})`
  )

  const where = conditions.length > 0 ? and(...conditions) : undefined

  const [rows, [{ count }]] = await Promise.all([
    db.select().from(vehicles).where(where).limit(limitNum).offset(offset),
    db.select({ count: sql<number>`count(*)::int` }).from(vehicles).where(where),
  ])

  return c.json({
    data: rows,
    pagination: { page: pageNum, limit: limitNum, total: count, pages: Math.ceil(count / limitNum) },
  })
})

// GET /api/vehicles/:id — public
vehiclesRoute.get('/:id', async (c) => {
  const id = c.req.param('id') as string
  const [vehicle] = await db.select().from(vehicles).where(eq(vehicles.id, id))
  if (!vehicle) return c.json({ error: 'Vehicle not found' }, 404)
  return c.json(vehicle)
})

// POST /api/vehicles
vehiclesRoute.post('/', requireAuth, async (c) => {
  const body = await c.req.json()
  const session = c.get('session' as never) as Awaited<ReturnType<typeof auth.api.getSession>>

  const [vehicle] = await db
    .insert(vehicles)
    .values({ ...body, createdBy: session?.user.id })
    .returning()

  return c.json(vehicle, 201)
})

// PUT /api/vehicles/:id
vehiclesRoute.put('/:id', requireAuth, async (c) => {
  const id = c.req.param('id') as string
  const body = await c.req.json()

  // strip immutable fields
  const { id: _id, createdAt: _ca, createdBy: _cb, ...updates } = body

  const [vehicle] = await db
    .update(vehicles)
    .set({ ...updates, updatedAt: new Date() })
    .where(eq(vehicles.id, id))
    .returning()

  if (!vehicle) return c.json({ error: 'Vehicle not found' }, 404)
  return c.json(vehicle)
})

// DELETE /api/vehicles/:id
vehiclesRoute.delete('/:id', requireAuth, async (c) => {
  const id = c.req.param('id') as string
  const [deleted] = await db.delete(vehicles).where(eq(vehicles.id, id)).returning()
  if (!deleted) return c.json({ error: 'Vehicle not found' }, 404)
  return c.json({ success: true })
})

// POST /api/vehicles/:id/images — multipart upload to R2
vehiclesRoute.post('/:id/images', requireAuth, async (c) => {
  const id = c.req.param('id') as string
  const [vehicle] = await db.select().from(vehicles).where(eq(vehicles.id, id))
  if (!vehicle) return c.json({ error: 'Vehicle not found' }, 404)

  const formData = await c.req.formData()
  const file = formData.get('file') as File | null
  if (!file) return c.json({ error: 'No file provided' }, 400)

  const ext = file.name.split('.').pop() ?? 'jpg'
  const key = `vehicles/${id}/${Date.now()}.${ext}`
  const buffer = await file.arrayBuffer()

  try {
    await uploadToR2(key, new Uint8Array(buffer), file.type)
  } catch (err) {
    console.error('R2 upload error:', err)
    return c.json({ error: 'Upload failed', detail: String(err) }, 500)
  }

  const publicUrl = `${process.env.R2_PUBLIC_URL}/${key}`
  const updatedImages = [...(vehicle.images ?? []), publicUrl]

  const [updated] = await db
    .update(vehicles)
    .set({ images: updatedImages, updatedAt: new Date() })
    .where(eq(vehicles.id, id))
    .returning()

  return c.json({ url: publicUrl, images: updated.images })
})

export default vehiclesRoute
