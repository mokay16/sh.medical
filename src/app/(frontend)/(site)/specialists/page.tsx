import type { Metadata } from 'next'
import Link from 'next/link'
import type { Office, Specialist } from '@/payload-types'
import { TeamGrid } from '@/components/sections'
import { docs, getDepartments, getSpecialists } from '@/lib/content'

export const metadata: Metadata = { title: 'Find a specialist' }

const REGIONS = ['San Francisco', 'Peninsula', 'South Bay', 'East Bay', 'North Bay']

type Props = { searchParams: Promise<{ care?: string; region?: string; q?: string }> }

export default async function Specialists({ searchParams }: Props) {
  const { care = '', region = '', q = '' } = await searchParams
  const [departments, all] = await Promise.all([getDepartments(), getSpecialists()])

  const inRegion = (s: Specialist) => !region || docs<Office>(s.offices).some((o) => o.region === region)
  const matches = (s: Specialist) => !q || s.name.toLowerCase().includes(q.toLowerCase())
  const href = (params: Record<string, string>) => {
    const sp = new URLSearchParams(Object.entries({ care, region, q, ...params }).filter(([, v]) => v))
    return `/specialists${sp.size ? `?${sp}` : ''}`
  }

  const groups = departments
    .filter((d) => !care || d.slug === care)
    .map((d) => ({ d, people: docs<Specialist>(d.team?.members).filter((s) => inRegion(s) && matches(s)) }))
    .filter((g) => g.people.length)
  // With no filter, show a few people per department, and skip departments (Sleep, Surgery) whose people all appear above; filtering shows everyone.
  const browsing = !care && !region && !q
  const count = new Set(groups.flatMap((g) => g.people.map((p) => p.id))).size
  const seen = new Set<number>()
  const shown = browsing
    ? groups.filter((g) => {
        const fresh = g.people.some((p) => !seen.has(p.id))
        g.people.forEach((p) => seen.add(p.id))
        return fresh
      })
    : groups

  return (
    <>
      <section className="page-heading">
        <div className="wrap">
          <p className="eyebrow">Find a specialist</p>
          <div className="about-hero-row">
            <h1 className="h1">
              The right specialist, <em>close to you.</em>
            </h1>
            <p className="lede" style={{ maxWidth: 380 }}>
              {all.length} ENT physicians, audiologists, allergists, therapists and speech-language pathologists across 12 Bay Area offices.
            </p>
          </div>
          <form className="finder" action="/specialists" style={{ marginTop: 8, maxWidth: 'none' }}>
            <div className="finder-field" style={{ borderLeft: 0, paddingLeft: 0 }}>
              <label htmlFor="sp-q">Name</label>
              <input id="sp-q" name="q" defaultValue={q} placeholder="Search by name" className="finder-input" />
            </div>
            <div className="finder-field">
              <label htmlFor="sp-care">Care</label>
              <select id="sp-care" name="care" defaultValue={care}>
                <option value="">All care</option>
                {departments.map((d) => (
                  <option key={d.slug} value={d.slug}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="finder-field">
              <label htmlFor="sp-region">Near</label>
              <select id="sp-region" name="region" defaultValue={region}>
                <option value="">Any office</option>
                {REGIONS.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
            </div>
            <button className="btn btn--teal finder-go" type="submit">
              Search
            </button>
          </form>
          <nav aria-label="Filter by care" className="chips chips--scroll">
            <Link className="pill" href={href({ care: '' })} aria-current={!care ? 'true' : undefined}>
              All care <span className="count">{all.length}</span>
            </Link>
            {departments
              .filter((d) => d.team?.members?.length)
              .map((d) => (
                <Link key={d.slug} className="pill" href={href({ care: d.slug })} aria-current={care === d.slug ? 'true' : undefined}>
                  {d.name} <span className="count">{d.team?.members?.length}</span>
                </Link>
              ))}
          </nav>
        </div>
      </section>
      <section className="section">
        <div className="wrap stack" style={{ gap: 72 }}>
          <p className="muted" style={{ margin: 0 }} aria-live="polite">
            {count} specialist{count === 1 ? '' : 's'} found
          </p>
          {shown.map(({ d, people }) => (
            <div key={d.slug} className="stack" style={{ gap: 28 }}>
              <div className="section-head" style={{ marginBottom: 0 }}>
                <h2 className="h2" style={{ fontSize: 'clamp(28px, 2.6vw, 38px)' }}>
                  {d.name}
                </h2>
                {browsing && people.length > 4 ? (
                  <Link className="link-arrow" href={href({ care: d.slug })}>
                    See all {people.length} →
                  </Link>
                ) : (
                  <Link className="link-arrow" href={`/care/${d.slug}`}>
                    About {d.brand} →
                  </Link>
                )}
              </div>
              <TeamGrid people={browsing ? people.slice(0, 4) : people} />
            </div>
          ))}
          <div className="not-sure glance" style={{ background: 'var(--bay)', color: 'var(--linen)', border: 0 }}>
            <div className="stack" style={{ gap: 10 }}>
              <p className="serif" style={{ margin: 0, fontSize: 34, lineHeight: 1.1 }}>
                Not sure who to see?
              </p>
              <p style={{ margin: 0, color: 'var(--on-dark)' }}>Tell us what’s going on and our care team will match you with the right specialist and the office nearest you.</p>
            </div>
            <div className="btn-row">
              <Link className="btn btn--light" href="/book?care=not-sure">
                Get matched
              </Link>
              <a className="btn btn--outline" href="tel:4153625443" style={{ color: 'var(--linen)', boxShadow: 'inset 0 0 0 1.5px var(--linen)' }}>
                (415) 362-5443
              </a>
            </div>
          </div>
          {!groups.length ? (
            <p className="lede">
              No specialists match. <Link href="/specialists">Show everyone</Link>, or call (415) 362-5443 and we’ll match you with the right specialist.
            </p>
          ) : null}
        </div>
      </section>
    </>
  )
}
