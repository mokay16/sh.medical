import path from 'path'
import { fileURLToPath } from 'url'
import type { CollectionConfig } from 'payload'

const dirname = path.dirname(fileURLToPath(import.meta.url))

// Photos are served straight from the site's code (public/uploads) unless MEDIA_STORAGE=blob:
// Payload keeps each photo's details, the file itself ships with every deploy.
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
