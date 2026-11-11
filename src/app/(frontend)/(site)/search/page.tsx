import type { Metadata } from 'next'
import { getDepartments, getOffices, getSpecialists, sitePages } from '@/lib/content'
import { SiteSearch, type SearchItem } from './SiteSearch'

export const metadata: Metadata = {
  title: 'Search',
  description: 'Search SH Medical for a condition, treatment, specialist or office.',
  robots: { index: false },
}

/** One list of everything searchable, built with the page; the search itself runs in the browser. */
export default async function Search({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  // ?q= lets a search be linked to.
  const { q = '' } = await searchParams
  const [departments, specialists, offices] = await Promise.all([getDepartments(), getSpecialists(), getOffices()])
  const items: SearchItem[] = []
  for (const d of departments) {
    const base = `/care/${d.slug}`
    items.push({ type: 'Department', title: d.name, text: d.home?.summary || '', href: base })
    const pages = sitePages(d)
    const href = (key: string) => pages.find((p) => p.key === key)?.href || base
    for (const it of d.conditions?.items || []) items.push({ type: d.conditions?.navLabel || 'Condition', title: it.title, text: it.description, href: href('conditions'), where: d.name })
    for (const c of d.conditions?.categories || [])
      for (const g of c.groups || []) for (const it of g.items || []) items.push({ type: 'Condition', title: it.title, text: it.body || '', href: href('conditions'), where: d.name })
    for (const it of d.treatments?.items || [])
      items.push({ type: d.treatments?.navLabel || 'Treatment', title: it.title, text: it.description, href: pages.some((p) => p.key === 'treatments') ? href('treatments') : `${href('conditions')}#treatment`, where: d.name })
    for (const q of d.faq || []) items.push({ type: 'Question', title: q.question, text: q.answer, href: href('patients'), where: d.name })
  }
  for (const s of specialists) items.push({ type: 'Specialist', title: s.name, text: [s.role, s.title].filter(Boolean).join(' · '), href: `/specialists/${s.slug}` })
  for (const o of offices) items.push({ type: 'Office', title: o.name, text: `${o.street}, ${o.city}`, href: '/locations' })

  return (
    <>
      <section className="page-heading">
        <div className="wrap">
          <p className="eyebrow">Search</p>
          <h1 className="h1">Search SH Medical</h1>
        </div>
      </section>
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <SiteSearch items={items} initialQuery={q.slice(0, 80)} />
        </div>
      </section>
    </>
  )
}
