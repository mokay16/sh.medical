import path from 'path'
import { fileURLToPath } from 'url'
import type { CollectionConfig } from 'payload'

const dirname = path.dirname(fileURLToPath(import.meta.url))

// With MEDIA_STORAGE=blob (set in Vercel), photos are stored in and served from Vercel Blob, and uploads
// in /admin are kept. Without it (local development), they're served from public/uploads.
export const mediaInBlob = process.env.MEDIA_STORAGE === 'blob' && Boolean(process.env.BLOB_READ_WRITE_TOKEN)

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  // Payload never touches public/uploads: it points at an empty folder, so deleting a photo record
  // (as a reload does) can't delete the photo file, and names never get a "-1" added.
  upload: mediaInBlob ? true : { staticDir: path.resolve(dirname, '../../.media-records-only'), disableLocalStorage: true },
  hooks: mediaInBlob
    ? undefined
    : {
        afterRead: [({ doc }) => (doc?.filename ? { ...doc, url: `/uploads/${doc.filename}` } : doc)],
      },
}
