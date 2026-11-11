// Run in `npm run vercel-build` when MEDIA_STORAGE=blob: copy any photo in public/uploads that
// Vercel Blob doesn't have yet, so photos added in code are served from Blob like uploaded ones.
import fs from 'fs'
import path from 'path'
import { list, put } from '@vercel/blob'

const token = process.env.BLOB_READ_WRITE_TOKEN
if (process.env.MEDIA_STORAGE !== 'blob' || !token) {
  console.log('Photos are served from public/uploads; nothing to copy to Blob')
  process.exit(0)
}

const TYPES = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.avif': 'image/avif' }
const dir = path.resolve('public/uploads')

const inBlob = new Map()
let cursor
do {
  const page = await list({ token, cursor, limit: 1000 })
  for (const b of page.blobs) inBlob.set(b.pathname, b.size)
  cursor = page.hasMore ? page.cursor : undefined
} while (cursor)

let copied = 0
for (const file of fs.readdirSync(dir)) {
  const contentType = TYPES[path.extname(file).toLowerCase()]
  if (!contentType) continue
  const full = path.join(dir, file)
  if (inBlob.get(file) === fs.statSync(full).size) continue
  await put(file, fs.readFileSync(full), { access: 'public', addRandomSuffix: false, allowOverwrite: true, contentType, token })
  copied++
}
console.log(`Blob: copied ${copied} photo${copied === 1 ? '' : 's'}; ${inBlob.size + copied} in the store`)
