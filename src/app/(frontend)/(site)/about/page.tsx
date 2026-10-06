import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { CtaBand } from '@/components/sections'
import { Icon, Img } from '@/components/ui'
import { getDepartments, getSpecialists, media } from '@/lib/content'

export const metadata: Metadata = { title: 'Our story' }

/** About, following the canvas artboard "About · Our story". */

const VALUES: [string, string][] = [
  ['Patients first', 'Our primary value is to put patient needs first.'],
  ['Compassion', 'For patients, loved ones, colleagues and coworkers alike.'],
  ['Excellence & integrity', 'Superior clinical care and honest health education.'],
  ['Teamwork', 'And responsible stewardship of the resources we share.'],
]

const TIMELINE: [string, string][] = [
  ['1940', 'Dr. Meyer Schindler begins seeing patients at 490 Post Street, invited into practice by Lewis F. Morrison, MD, UCSF’s Chief of Otolaryngology.'],
  ['1942', 'Serves as Chief of ENT for the Army’s 30th General Hospital in England, a unit made up entirely of UCSF physicians, nurses and staff.'],
  ['1945', 'Reopens his practice at 450 Sutter Street, the 1929 Art Deco landmark that is still our home.'],
  ['1970', 'Helps form UCSF’s Association of the Clinical Faculty to strengthen teaching and patient care.'],
  ['1973', 'His sons join him: David Schindler, MD, in 1973 and Brian Schindler, MD, in 1979, both trained at UCSF.'],
  ['2001', 'Jacob Johnson, MD, joins after his UCSF residency. The practice grows to more than 35 providers.'],
  ['2025', 'San Francisco Otolaryngology, San Francisco Audiology and their affiliated practices unite under one name: SH Medical.'],
]

// Two of these restate claims the plan marks for re-verification (after-hours coverage, charitable care).
const APART: [string, string][] = [
  ['UCSF faculty', 'Our physicians hold academic appointments at the University of California, San Francisco.'],
  ['Testing under one roof', 'In-house allergy and audiology testing for adults and children, plus on-site sinus CT.'],
  ['Our own doctors, after hours', 'Off-hours calls are never sent off-site. They are covered by our own physicians.'],
  ['Charitable care', 'A share of our physicians’ time is devoted to charitable care in our community.'],
  ['Trusted hospital partners', 'UCSF Medical Center, CPMC, St. Francis, and the Campus, Presidio and San Francisco surgery centers.'],
  ['Connected records', 'Fully electronic medical records, with results and messages in MyChart.'],
]

export default async function About() {
  const [departments, specialists] = await Promise.all([getDepartments(), getSpecialists()])
  const reviews = departments.flatMap((d) => (d.reviews || []).map((r) => ({ ...r, dept: d.name })))
  const pi = specialists.find((s) => s.slug === 'jacob-johnson-md')

  return (
    <>
      <section className="section about-hero" style={{ paddingBottom: 48 }}>
        <div className="wrap about-hero-row">
          <div className="stack" style={{ gap: 22 }}>
            <p className="eyebrow">Our story</p>
            <h1 className="h1" style={{ fontSize: 'clamp(48px, 5.8vw, 84px)', lineHeight: 1 }}>
              Rooted in San Francisco <em>since 1940.</em>
            </h1>
          </div>
          <p className="lede" style={{ maxWidth: 440 }}>
            What began as one ENT physician’s practice on Post Street is now SH Medical: more than 35 providers caring for how Bay Area families hear,
            breathe, speak and sleep.
          </p>
        </div>
      </section>
      <div className="wrap">
        <Image src="/images/bay-area-hills-morning.webp" alt="Morning light over green Bay Area hills" width={1920} height={1080} sizes="(max-width: 1440px) 100vw, 1248px" priority className="about-photo" />
      </div>

      <section className="section">
        <div className="wrap">
          <div className="who-row">
            <p className="eyebrow who-label">Our mission</p>
            <p className="serif who-text" style={{ fontSize: 'clamp(26px, 2.6vw, 38px)' }}>
              To be a community leader in otolaryngology and the care of the senses, providing comprehensive, high-quality care to every patient through{' '}
              <em>an integrated clinical practice.</em>
            </p>
          </div>
          <div className="grid values" style={{ ['--cols' as string]: 4 }}>
            {VALUES.map(([t, d]) => (
              <div key={t} className="mini-review" style={{ gap: 8 }}>
                <span className="serif" style={{ fontSize: 24, lineHeight: 1.15 }}>
                  {t}
                </span>
                <span className="muted" style={{ fontSize: 15 }}>
                  {d}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--dark">
        <div className="wrap timeline-wrap">
          <div className="stack" style={{ gap: 24 }}>
            <p className="eyebrow">Eight decades</p>
            <h2 className="h2">A family practice that kept growing.</h2>
            <div className="archival">
              <Icon name="image" size={32} />
              <strong>Archival photograph</strong>
              <span>Dr. Meyer Schindler, and 450 Sutter Street. Higher-resolution scans to be supplied by SH Medical.</span>
            </div>
          </div>
          <ol className="timeline">
            {TIMELINE.map(([year, text]) => (
              <li key={year}>
                <b className="serif">{year}</b>
                <p>{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section">
        <div className="wrap apart">
          <div className="stack" style={{ gap: 20 }}>
            <p className="eyebrow">What sets us apart</p>
            <h2 className="h2">Academic expertise, community care.</h2>
            <Link className="link-arrow" href="/specialists">
              Meet our specialists →
            </Link>
          </div>
          <div className="apart-grid">
            {APART.map(([t, d]) => (
              <div key={t}>
                <span className="serif">{t}</span>
                <p>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="research">
            <div className="stack" style={{ gap: 20, maxWidth: 640 }}>
              <p className="eyebrow" style={{ color: 'var(--teal)' }}>
                Clinical research
              </p>
              <h2 className="h2" style={{ fontSize: 'clamp(30px, 2.8vw, 40px)' }}>
                Better hearing and balance begin with better science.
              </h2>
              <p className="lede" style={{ fontSize: 17 }}>
                Through our research affiliate program, patients can take part in IRB-approved studies in ENT and audiology. We collaborate with the
                Alliston Lab at UCSF on the link between bone in the ear and hearing loss.
              </p>
              <div className="btn-row">
                <a className="btn btn--teal" href="mailto:research@sh.health?subject=Research%20registry">
                  Join the research registry
                </a>
                <a className="btn btn--outline" href="mailto:research@sh.health">
                  research@sh.health
                </a>
              </div>
            </div>
            <div className="stack" style={{ gap: 14, minWidth: 260 }}>
              {pi ? (
                <Link href={`/specialists/${pi.slug}`} className="mini-review" style={{ flexDirection: 'row', alignItems: 'center', gap: 16, background: 'var(--white)', textDecoration: 'none', color: 'var(--ink)' }}>
                  <Img media={media(pi.photo)} alt="" sizes="56px" className="pi-photo" />
                  <span>
                    <span className="muted" style={{ fontSize: 13, display: 'block' }}>
                      Principal investigator
                    </span>
                    <span className="serif" style={{ fontSize: 20 }}>
                      {pi.name}
                    </span>
                  </span>
                </Link>
              ) : null}
              <div className="mini-review" style={{ background: 'var(--white)', gap: 4 }}>
                <span className="muted" style={{ fontSize: 13 }}>
                  Current studies
                </span>
                <span>Enrollment details coming soon</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="reviews" className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="section-head">
            <div style={{ flexDirection: 'row', alignItems: 'baseline', gap: 20, flexWrap: 'wrap' }}>
              <h2 className="h2">Patient reviews</h2>
              <span className="muted">
                <span className="stars" aria-hidden="true">
                  ★★★★★
                </span>{' '}
                4.9 average
              </span>
            </div>
            <a className="btn btn--outline" href="https://www.google.com/search?q=SH+Medical+San+Francisco+reviews">
              Leave a review
            </a>
          </div>
          <div className="grid">
            {reviews.map((r) => (
              <figure key={r.id} className="mini-review" style={{ gap: 16 }}>
                <blockquote className="serif" style={{ fontSize: 20, lineHeight: 1.4 }}>
                  “{r.quote}”
                </blockquote>
                <figcaption>
                  {r.dept}
                  {r.attribution ? ` · ${r.attribution}` : ''}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        heading="Ready when *you* are."
        text="Request an appointment online, or call us Monday to Friday, 8am to 5pm."
        primary={{ label: 'Book an appointment', href: '/book' }}
        secondary={{ label: 'Call (415) 362-5443', href: 'tel:4153625443' }}
      />
    </>
  )
}
