import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'

// Content only: SH Medical no longer has offices in Sunnyvale or Brentwood.
const GONE = ['sunny', 'brent', 'brent-sand-creek']
const FACIAL_PLASTICS = {
  "facts2": {
    "big": "2 locations",
    "small": "Union Square · San Mateo"
  },
  "note": "Available at Union Square, SF · San Mateo",
  "step": "See Dr. Challapalli or Dr. Kazi at Union Square, or Dr. Challapalli in San Mateo.",
  "where": "Union Square: 450 Sutter St., Suite 933 (Dr. Challapalli · Dr. Kazi). San Mateo: 100 S. Ellsworth Ave., Suite 303, (415) 362-2901 (Dr. Challapalli). Surgery at Campus Surgery Center, Pacific Heights, SF Surgery Center, Presidio, CPMC, UCSF and MarinHealth."
}

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  const { docs: gone } = await payload.find({ collection: 'offices', where: { slug: { in: GONE } }, depth: 0, limit: 10, req })
  if (!gone.length) return
  const ids = new Set(gone.map((o) => o.id))
  const keep = (list?: (number | { id: number })[] | null) => (list || []).map((o) => (typeof o === 'object' ? o.id : o)).filter((id) => !ids.has(id))

  for (const collection of ['departments', 'specialists'] as const) {
    const { docs } = await payload.find({ collection, depth: 0, limit: 500, req })
    for (const doc of docs) {
      const before = (doc.offices || []).length
      const offices = keep(doc.offices)
      if (offices.length !== before) await payload.update({ collection, id: doc.id, data: { offices }, req })
    }
  }

  const { docs: fp } = await payload.find({ collection: 'departments', where: { slug: { equals: 'facial-plastics' } }, depth: 0, limit: 1, req })
  if (fp[0]) {
    const d = fp[0]
    const facts = (d.facts || []).map((x, i) => (i === 2 ? { ...x, ...FACIAL_PLASTICS.facts2 } : x))
    const steps = (d.visit?.steps || []).map((x, i) => (i === 1 ? { ...x, description: FACIAL_PLASTICS.step } : x))
    await payload.update({
      collection: 'departments',
      id: d.id,
      data: { facts, overview: { ...d.overview, note: FACIAL_PLASTICS.note }, visit: { ...d.visit, steps }, whereNote: FACIAL_PLASTICS.where },
      req,
    })
  }

  // Sleep's intro said "from Sonoma to the South Bay"; there's no South Bay office now.
  const { docs: sleep } = await payload.find({ collection: 'departments', where: { slug: { equals: 'sleep' } }, depth: 0, limit: 1, req })
  if (sleep[0]) {
    const text = JSON.stringify(sleep[0].overview)
    if (text.includes('from Sonoma to the South Bay'))
      await payload.update({ collection: 'departments', id: sleep[0].id, data: { overview: JSON.parse(text.replace('from Sonoma to the South Bay', 'from Sonoma to the Peninsula')) }, req })
  }

  for (const o of gone) await payload.delete({ collection: 'offices', id: o.id, req })
}

export async function down(_args: MigrateDownArgs): Promise<void> {
  // The offices were removed for good; restore them from the seed content if ever needed.
}
