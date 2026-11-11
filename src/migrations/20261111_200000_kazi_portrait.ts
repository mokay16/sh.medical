import fs from 'fs'
import path from 'path'
import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'

// Content only: give Dr. Kazi's profile his new, high-resolution portrait.
const FILE = 'specialist-aasif-kazi-md-pharm-d-portrait.jpg'

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  const { docs } = await payload.find({ collection: 'specialists', where: { slug: { equals: 'aasif-kazi-md-pharm-d' } }, depth: 0, limit: 1, req })
  const filePath = path.resolve(process.cwd(), 'public/uploads', FILE)
  if (!docs[0] || !fs.existsSync(filePath)) return
  const photo = await payload.create({ collection: 'media', data: { alt: 'Aasif Kazi, MD, Pharm.D.' }, filePath, req })
  await payload.update({ collection: 'specialists', id: docs[0].id, data: { photo: photo.id }, req })
}

export async function down(_args: MigrateDownArgs): Promise<void> {
  // The earlier photo record is left in place, so there is nothing to undo.
}
