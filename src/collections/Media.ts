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
  upload: mediaInBlob ? true : { staticDir: path.resolve(dirname, '../../public/uploads'), disableLocalStorage: true },
  hooks: mediaInBlob
    ? undefined
    : {
        // The file is already in public/uploads, so keep its own name (Payload would add "-1" to avoid a clash).
        beforeChange: [({ data, req }) => (req.file?.name ? { ...data, filename: req.file.name } : data)],
        afterRead: [({ doc }) => (doc?.filename ? { ...doc, url: `/uploads/${doc.filename}` } : doc)],
      },
}
