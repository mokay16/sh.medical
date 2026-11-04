import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'

// Content only: rename the Facial Plastics team heading on a site that's already loaded.
const set = async ({ payload, req }: MigrateUpArgs, eyebrow: string, heading: string) => {
  const { docs } = await payload.find({ collection: 'departments', where: { slug: { equals: 'facial-plastics' } }, depth: 0, limit: 1, req })
  if (!docs[0]) return
  await payload.update({ collection: 'departments', id: docs[0].id, data: { team: { ...docs[0].team, eyebrow, heading } }, req })
}

export async function up(args: MigrateUpArgs): Promise<void> {
  await set(args, 'Our providers', 'Meet your providers')
}

export async function down(args: MigrateDownArgs): Promise<void> {
  await set(args, 'Our surgeons', 'Fellowship-trained. Board-certified.')
}
