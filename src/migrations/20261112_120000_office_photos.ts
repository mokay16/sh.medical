import fs from 'fs'
import path from 'path'
import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'

// Content only: a photo for each office card that had none (public-domain and CC0 photos from Wikimedia Commons).
const PHOTOS: { slug: string; file: string; alt: string }[] = [
  {
    "slug": "pac",
    "file": "office-pac.jpg",
    "alt": "Grand painted houses on a sloping Pacific Heights street"
  },
  {
    "slug": "castro",
    "file": "office-castro.jpg",
    "alt": "The Castro Theatre and shops along Castro Street"
  },
  {
    "slug": "calst",
    "file": "office-calst.jpg",
    "alt": "Laurel Hill Playground lawn, with the Golden Gate Bridge in the distance"
  },
  {
    "slug": "mateo",
    "file": "office-mateo.jpg",
    "alt": "Gateway to Central Park in San Mateo"
  },
  {
    "slug": "walnut",
    "file": "office-walnut.jpg",
    "alt": "Mount Diablo rising above the Walnut Creek valley"
  },
  {
    "slug": "phill",
    "file": "office-phill.jpg",
    "alt": "A trail through spring wildflowers on Mount Diablo"
  },
  {
    "slug": "marin",
    "file": "office-marin.jpg",
    "alt": "Mission San Rafael Arcángel among palm trees"
  }
]

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  for (const p of PHOTOS) {
    const { docs } = await payload.find({ collection: 'offices', where: { slug: { equals: p.slug } }, depth: 0, limit: 1, req })
    const filePath = path.resolve(process.cwd(), 'public/uploads', p.file)
    if (!docs[0] || docs[0].photo || !fs.existsSync(filePath)) continue
    const photo = await payload.create({ collection: 'media', data: { alt: p.alt }, filePath, req })
    await payload.update({ collection: 'offices', id: docs[0].id, data: { photo: photo.id }, req })
  }
}

export async function down(_args: MigrateDownArgs): Promise<void> {
  // Photos can be removed from each office in the admin if needed.
}
