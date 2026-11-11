import { postgresAdapter } from '@payloadcms/db-postgres'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media, mediaInBlob } from './collections/Media'
import { Departments } from './collections/Departments'
import { Specialists } from './collections/Specialists'
import { Offices } from './collections/Offices'
import { Reviews } from './collections/Reviews'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Postgres when DATABASE_URL is a postgres:// URL (Vercel + Neon); the local SQLite file otherwise.
const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL || ''
const usePostgres = /^postgres(ql)?:\/\//.test(databaseUrl)

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: '· SH Medical',
      icons: [
        { rel: 'icon', type: 'image/x-icon', url: '/favicon.ico' },
        { rel: 'icon', type: 'image/png', url: '/icon.png' },
        { rel: 'apple-touch-icon', url: '/apple-icon.png' },
      ],
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Departments, Specialists, Offices, Reviews, Media, Users],
  editor: lexicalEditor(),
  // The site reads content directly and the admin uses the REST API; GraphQL isn't needed.
  graphQL: { disable: true },
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: usePostgres
    ? postgresAdapter({
        pool: { connectionString: databaseUrl },
        migrationDir: path.resolve(dirname, 'migrations'),
        // Schema changes go through migrations (npm run payload migrate:create), never auto-push.
        push: false,
      })
    : sqliteAdapter({
        client: {
          url: databaseUrl,
        },
      }),
  sharp,
  plugins: [
    // Uploads go to Vercel Blob only with MEDIA_STORAGE=blob; otherwise photos come from public/uploads.
    vercelBlobStorage({
      enabled: mediaInBlob,
      collections: { media: true },
      token: process.env.BLOB_READ_WRITE_TOKEN,
    }),
  ],
})
