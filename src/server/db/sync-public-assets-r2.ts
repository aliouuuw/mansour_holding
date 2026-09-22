/**
 * Upload gitignored catalogue assets from public/mansour-motors/{vehicles,covers} to R2.
 * Keys mirror site paths: mansour-motors/vehicles/... (no leading slash).
 */
import { readdir, readFile, stat } from 'node:fs/promises'
import { join, relative } from 'node:path'
import { config } from 'dotenv'
import { contentTypeForPath, uploadToR2 } from '../r2-upload'

config({ path: '.env.local' })
config({ path: '.env' })

const ROOT = join(process.cwd(), 'public/mansour-motors')
const DIRS = ['vehicles', 'covers'] as const

async function walk(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true })
  const files: string[] = []
  for (const ent of entries) {
    const p = join(dir, ent.name)
    if (ent.isDirectory()) files.push(...await walk(p))
    else if (ent.isFile() && !ent.name.startsWith('.')) files.push(p)
  }
  return files
}

function requireEnv(name: string): string {
  const v = process.env[name]
  if (!v) throw new Error(`Missing ${name}`)
  return v
}

async function main() {
  requireEnv('R2_ENDPOINT')
  requireEnv('R2_ACCESS_KEY_ID')
  requireEnv('R2_SECRET_ACCESS_KEY')
  requireEnv('R2_BUCKET_NAME')
  const publicUrl = requireEnv('R2_PUBLIC_URL')

  let uploaded = 0
  let failed = 0

  for (const sub of DIRS) {
    const base = join(ROOT, sub)
    try {
      await stat(base)
    } catch {
      console.warn(`skip missing ${base}`)
      continue
    }
    const files = await walk(base)
    for (const file of files) {
      const rel = relative(join(ROOT, '..'), file).replace(/\\/g, '/')
      const key = rel.startsWith('/') ? rel.slice(1) : rel
      const body = new Uint8Array(await readFile(file))
      const type = contentTypeForPath(file)
      try {
        await uploadToR2(key, body, type)
        uploaded++
        if (uploaded % 25 === 0) console.log(`uploaded ${uploaded}…`)
      } catch (err) {
        failed++
        console.error(key, err instanceof Error ? err.message : err)
      }
    }
  }

  console.log(`done: ${uploaded} uploaded, ${failed} failed`)
  console.log(`public base: ${publicUrl}/mansour-motors/`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
