import fs from 'fs'
import path from 'path'
import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'

// Content only: providers sh.health no longer lists come off the site, and the Mountain View office is added.
const GONE = ["virginia-smith-bronstein-md", "michelle-griffin-au-d", "nicole-schmidt-au-d", "isabel-leyritana-au-d", "hannah-torok-au-d", "robert-gilligan-had"]
const OFFICE = {"slug": "mtnview", "name": "Mountain View", "region": "Peninsula", "street": "2500 Hospital Drive, Building 2, Suite A", "city": "Mountain View, CA 94040", "phone": "(415) 362-2901", "lat": 37.3675483, "lng": -122.0821822} as const
const PHOTO = { file: 'office-mtnview.jpg', alt: 'Mountain View City Hall and the Center for the Performing Arts' }
const DEPARTMENTS = ["ent", "audiology", "facial-plastics"]

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  const { docs: gone } = await payload.find({ collection: 'specialists', where: { slug: { in: GONE } }, depth: 0, limit: 20, req })
  const goneIds = new Set(gone.map((s) => s.id))
  const { docs: depts } = await payload.find({ collection: 'departments', depth: 0, limit: 50, req })
  for (const d of depts) {
    const members = (d.team?.members || []).map((m) => (typeof m === 'object' ? m.id : m))
    const kept = members.filter((id) => !goneIds.has(id))
    if (kept.length !== members.length) await payload.update({ collection: 'departments', id: d.id, data: { team: { ...d.team, members: kept } }, req })
  }
  for (const s of gone) await payload.delete({ collection: 'specialists', id: s.id, req })

  const { docs: existing } = await payload.find({ collection: 'offices', where: { slug: { equals: OFFICE.slug } }, depth: 0, limit: 1, req })
  let officeId = existing[0]?.id
  if (!officeId) {
    const { docs: all } = await payload.find({ collection: 'offices', depth: 0, limit: 100, sort: 'order', req })
    const mateo = all.find((o) => o.slug === 'mateo')
    // make room right after San Mateo
    if (mateo?.order != null) {
      for (const o of all) if ((o.order ?? 0) > mateo.order) await payload.update({ collection: 'offices', id: o.id, data: { order: (o.order ?? 0) + 1 }, req })
    }
    const filePath = path.resolve(process.cwd(), 'public/uploads', PHOTO.file)
    const photo = fs.existsSync(filePath) ? await payload.create({ collection: 'media', data: { alt: PHOTO.alt }, filePath, req }) : null
    const doc = await payload.create({
      collection: 'offices',
      data: { ...OFFICE, ...(mateo?.order != null ? { order: mateo.order + 1 } : {}), ...(photo ? { photo: photo.id } : {}) },
      req,
    })
    officeId = doc.id
  }
  for (const d of depts) {
    if (!DEPARTMENTS.includes(d.slug)) continue
    const offices = (d.offices || []).map((o) => (typeof o === 'object' ? o.id : o))
    if (!offices.includes(officeId)) await payload.update({ collection: 'departments', id: d.id, data: { offices: [...offices, officeId] }, req })
  }
}

export async function down(_args: MigrateDownArgs): Promise<void> {
  // Content changes; earlier versions stay in the admin's version history.
}
