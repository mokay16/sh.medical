import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'

// Content only: acupuncture (Wellness) is offered at Union Square, where Felix Meier, L.Ac. practises.
export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  const [{ docs: depts }, { docs: offices }] = await Promise.all([
    payload.find({ collection: 'departments', where: { slug: { equals: 'wellness' } }, depth: 0, limit: 1, req }),
    payload.find({ collection: 'offices', where: { slug: { equals: 'union' } }, depth: 0, limit: 1, req }),
  ])
  const d = depts[0]
  const union = offices[0]
  if (!d || !union) return
  const current = (d.offices || []).map((o) => (typeof o === 'object' ? o.id : o))
  if (!current.includes(union.id)) await payload.update({ collection: 'departments', id: d.id, data: { offices: [...current, union.id] }, req })
}

export async function down(_args: MigrateDownArgs): Promise<void> {
  // Content only.
}
