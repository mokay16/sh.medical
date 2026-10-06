import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Department, Office, Specialist } from '@/payload-types'
import { CtaBand } from '@/components/sections'
import { Img, Initials } from '@/components/ui'
import { docs, getDepartments, getSpecialists, media, tel } from '@/lib/content'

/** Specialist profile, following the canvas artboard "Specialist profile". */

type Props = { params: Promise<{ slug: string }> }
type Section = NonNullable<Specialist['sections']>[number]

async function load(slug: string) {
  const [all, departments] = await Promise.all([getSpecialists(), getDepartments()])
  const s = all.find((x) => x.slug === slug)
  if (!s) return null
  const depts = departments.filter((d) => docs<Specialist>(d.team?.members).some((m) => m.id === s.id))
  return { s, depts }
}

export async function generateStaticParams() {
  return (await getSpecialists()).map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const r = await load((await params).slug)
  return r ? { title: r.s.name, description: r.s.bio?.[0]?.text || r.s.role } : {}
}

/** "Dr. Johnson" for doctors of medicine, audiology and philosophy; otherwise the name without credentials. */
function shortName(name: string) {
  const [person, ...creds] = name.split(',')
  const isDoctor = creds.some((c) => /\b(MD|M\.D\.|Au\.D|Ph\.D)/.test(c))
  const words = person.replace(/\s+\(.*?\)/g, '').trim().split(/\s+/)
  return isDoctor ? `Dr. ${words[words.length - 1]}` : person.trim()
}

const find = (sections: Section[], re: RegExp) => sections.filter((s) => re.test(s.heading))
const clean = (s: string) => s.replace(/\s+/g, ' ').replace(/\s*[-–]\s*$/, '').trim()

/** Split "University of California, SF-Resident Physician, … 1997 – 2001" into years and text. */
function dated(item: string) {
  const m = item.match(/(\d{4})\s*[–-]\s*(\d{4}|present)|(\d{4})\s*$/i)
  if (!m) return { years: '', text: clean(item) }
  const years = m[3] || `${m[1]}–${m[2]}`
  return { years, text: clean(item.replace(m[0], '')) }
}

export default async function SpecialistProfile({ params }: Props) {
  const r = await load((await params).slug)
  if (!r) notFound()
  const { s, depts } = r
  const offices = docs<Office>(s.offices)
  const primary: Department | undefined = depts[0]
  const sections = s.sections || []
  const education = find(sections, /educ|training|residency|fellowship|post-graduate/i)
  const teaching = find(sections, /teach|academic|current position/i)
  const hospitals = find(sections, /hospital/i)
  const memberships = find(sections, /member|societ/i)
  const other = sections.filter((x) => ![...education, ...teaching, ...hospitals, ...memberships].includes(x))
  const call = primary?.phone || '(415) 362-5443'
  const sn = shortName(s.name)
  const bookHref = `/book${primary ? `?care=${primary.slug}` : ''}`

  const facts = [
    teaching[0]?.items?.[0] ? ['Academic', teaching[0].items[0]] : null,
    offices.length ? ['Offices', offices.map((o) => o.name).join(' · ')] : null,
    hospitals[0]?.items?.length ? ['Hospitals', hospitals[0].items.slice(0, 3).join(' · ')] : null,
    s.title && s.title !== s.role ? ['Title', s.title] : null,
  ].filter(Boolean) as [string, string][]

  return (
    <>
      <section className="section" style={{ paddingTop: 32 }}>
        <div className="wrap">
          <nav aria-label="Breadcrumb" className="breadcrumb" style={{ marginBottom: 32 }}>
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <Link href="/specialists">Find a specialist</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{s.name}</span>
          </nav>
          <div className="profile-hero">
            <div className="portrait-frame">
              {media(s.photo) ? <Img media={media(s.photo)} alt={`Portrait of ${s.name}`} sizes="(max-width: 900px) 100vw, 400px" priority /> : <div className="person"><Initials name={s.name} /></div>}
            </div>
            <div className="stack" style={{ gap: 20 }}>
              {depts.length ? <p className="eyebrow">{depts.map((d) => d.name).join(' · ')}</p> : null}
              <h1 className="h1">{s.name}</h1>
              <p className="lede">{s.role}</p>
              {facts.length ? (
                <dl className="profile-facts">
                  {facts.map(([k, v]) => (
                    <div key={k}>
                      <dt>{k}</dt>
                      <dd>{v}</dd>
                    </div>
                  ))}
                </dl>
              ) : null}
              <div className="btn-row">
                <Link className="btn btn--clay" href={bookHref}>
                  Book with {sn}
                </Link>
                <a className="btn btn--outline" href={tel(call)}>
                  Call {call}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 24 }}>
        <div className="wrap profile-body">
          <div className="stack" style={{ gap: 64 }}>
            <div className="stack">
              <h2 className="h2" style={{ fontSize: 'clamp(28px, 2.4vw, 34px)' }}>
                About {sn}
              </h2>
              {s.bio?.length ? (
                s.bio.map((p) => (
                  <p key={p.id} className="lede" style={{ fontSize: 17 }}>
                    {p.text}
                  </p>
                ))
              ) : (
                <p className="lede" style={{ fontSize: 17 }}>
                  [Biography to be supplied by SH Medical.]
                </p>
              )}
            </div>

            {education.length ? (
              <div className="stack">
                <h2 className="h2" style={{ fontSize: 'clamp(28px, 2.4vw, 34px)' }}>
                  Education &amp; training
                </h2>
                <ol className="edu">
                  {education.flatMap((sec) =>
                    (sec.items || []).map((item) => {
                      const { years, text } = dated(item)
                      return (
                        <li key={item}>
                          <span className="serif">{years}</span>
                          <span>{text}</span>
                        </li>
                      )
                    }),
                  )}
                </ol>
              </div>
            ) : null}

            {teaching.length || hospitals.length ? (
              <div className="two-lists">
                {[
                  ['Teaching', teaching],
                  ['Hospital affiliations', hospitals],
                ].map(([title, secs]) =>
                  (secs as Section[]).length ? (
                    <div key={title as string} className="stack" style={{ gap: 12 }}>
                      <h2 className="h3">{title as string}</h2>
                      <ul className="plain-list">
                        {(secs as Section[]).flatMap((sec) => sec.items || []).map((it) => (
                          <li key={it}>{clean(it)}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null,
                )}
              </div>
            ) : null}

            {memberships.length ? (
              <div className="stack" style={{ gap: 16 }}>
                <h2 className="h3">Memberships</h2>
                <div className="chips">
                  {memberships.flatMap((sec) => sec.items || []).map((it) => (
                    <span key={it} className="chip" style={{ fontWeight: 500, fontSize: 14, minHeight: 34 }}>
                      {clean(it)}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            {other.map((sec) => (
              <div key={sec.id} className="stack" style={{ gap: 12 }}>
                <h2 className="h3">{sec.heading}</h2>
                <ul className="plain-list">
                  {(sec.items || []).map((it) => (
                    <li key={it}>{clean(it)}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <aside className="profile-rail">
            <div className="rail-book">
              <p className="serif" style={{ margin: 0, fontSize: 26 }}>
                See {sn}
              </p>
              <p style={{ margin: 0, color: 'var(--on-dark)', fontSize: 15 }}>Request a visit online and our team will confirm a time with you.</p>
              <Link className="btn btn--light" href={bookHref}>
                Request an appointment
              </Link>
              <a href={tel(call)} style={{ color: '#fff', textAlign: 'center', textDecoration: 'none', fontSize: 15 }}>
                or call <b>{call}</b>
              </a>
            </div>
            {offices.length ? (
              <div className="rail-offices">
                <p className="eyebrow" style={{ color: 'var(--muted-2)', fontSize: 12 }}>
                  Where to book
                </p>
                {offices.map((o) => (
                  <Link key={o.id} href={`/locations#${o.slug}`}>
                    <strong>{o.name}</strong>
                    <span>
                      {o.street}
                      <br />
                      {o.city}
                    </span>
                  </Link>
                ))}
                <p className="meta" style={{ margin: 0 }}>
                  All offices open Mon–Fri, 8:00am–5:00pm
                </p>
              </div>
            ) : null}
          </aside>
        </div>
      </section>

      <CtaBand
        heading={`Book with ${sn}`}
        text={primary ? `Book online, or call ${primary.phoneLabel} at ${primary.phone}, Monday to Friday, 8am to 5pm.` : 'Book online, or call (415) 362-5443.'}
        primary={{ label: 'Book an appointment', href: bookHref }}
      />
    </>
  )
}
