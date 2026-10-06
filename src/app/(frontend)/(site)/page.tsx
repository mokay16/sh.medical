import Image from 'next/image'
import Link from 'next/link'
import { CtaBand } from '@/components/sections'
import { Icon, Img } from '@/components/ui'
import { MYCHART_URL, getDepartments, getSpecialists, media } from '@/lib/content'

/** Home page, following the canvas artboards "Home · desktop" 1–3. */

const CONCERNS: [string, string][] = [
  ['audiology', 'Hearing loss or tinnitus'],
  ['ent', 'Sinus & nasal problems'],
  ['allergy', 'Allergies & asthma'],
  ['sleep', 'Snoring & sleep'],
  ['voice', 'Voice & swallowing'],
  ['balance', 'Dizziness & balance'],
  ['', 'I’m not sure yet'],
]
const NEAR: [string, string][] = [
  ['San Francisco', 'San Francisco'],
  ['Peninsula', 'Peninsula & South Bay'],
  ['East Bay', 'East Bay'],
  ['North Bay', 'North Bay'],
]
const PILLARS: [string, string][] = [
  ['One team around you', 'ENT physicians, audiologists and allergists practice together, so a hearing test, a sinus scan and an allergy plan become one connected plan.'],
  ['Time to understand your options', 'We walk you through every treatment choice, so you decide with confidence. “I felt that I was given all the time I needed.”'],
  ['Close to home', 'Twelve offices across San Francisco, the Peninsula, the East Bay and the North Bay, open weekdays 8am–5pm.'],
  ['Always advancing', 'As a clinical research affiliate, we bring emerging diagnostic and treatment options in hearing and ENT care to our patients.'],
]
const REGIONS: [string, string][] = [
  ['San Francisco', 'Union Square · Pacific Heights · California Street · Castro'],
  ['Peninsula & South Bay', 'San Mateo · Sunnyvale'],
  ['East Bay', 'Walnut Creek · Pleasant Hill · Brentwood'],
  ['North Bay', 'San Rafael · Sonoma'],
]
const RESOURCES: [string, string, string, string][] = [
  ['description', 'New patients', 'What to bring, forms to complete and what to expect.', '/patients#new'],
  ['verified_user', 'Insurance', 'In-network plans and what to check before you come in.', '/patients#insurance'],
  ['folder_open', 'Medical records', 'Release forms to send records to us, or from us.', '/patients#records'],
  ['lock', 'Patient portal', 'Messages, results and appointments in MyChart.', MYCHART_URL],
]
const Stars = () => (
  <span className="stars" aria-label="5 out of 5 stars" style={{ letterSpacing: 2 }}>
    ★★★★★
  </span>
)

export default async function Home() {
  const [departments, specialists] = await Promise.all([getDepartments(), getSpecialists()])
  const lead = specialists.find((s) => s.slug === 'jacob-johnson-md')
  const portraits = ['terri-gallagher-au-d', 'angela-smith-pt-mspt', 'carey-philliposian-au-d', 'jeffrey-lampert-au-d', 'jenna-cullinan-au-d']
    .map((slug) => specialists.find((s) => s.slug === slug))
    .filter((s) => s && s.photo)

  return (
    <>
      {/* Hero */}
      <section className="home-hero">
        <div className="wrap home-hero-copy">
          <p className="eyebrow">ENT · Audiology · Allergy · Sleep · Voice</p>
          <h1 className="h1 home-h1">
            Care for the senses that <em>connect you</em> to life.
          </h1>
          <p className="lede" style={{ fontSize: 20, maxWidth: 520 }}>
            Hearing, breathing, speaking, sleeping, feeling steady. Since 1940, SH Medical’s Bay Area specialists have worked side by side to help
            patients of every age live fully.
          </p>
          <div className="btn-row">
            <Link className="btn btn--clay" href="/book">
              Book an appointment
            </Link>
            <Link className="btn btn--outline" href="/specialists">
              Find a specialist
            </Link>
          </div>
        </div>
        <div className="home-hero-photo">
          <Image src="/images/home-hero.webp" alt="Two women embracing and laughing outdoors" fill priority sizes="(max-width: 900px) 100vw, 680px" style={{ objectFit: 'cover', objectPosition: '40% center' }} />
        </div>
        <div className="wrap">
          <form action="/specialists" className="finder">
            <p className="serif finder-title">What can we help with?</p>
            <div className="finder-field">
              <label htmlFor="hero-concern">Concern or specialty</label>
              <select id="hero-concern" name="care" defaultValue="audiology">
                {CONCERNS.map(([v, l]) => (
                  <option key={l} value={v}>
                    {l}
                  </option>
                ))}
              </select>
            </div>
            <div className="finder-field finder-near">
              <label htmlFor="hero-near">Near</label>
              <select id="hero-near" name="region" defaultValue="San Francisco">
                {NEAR.map(([v, l]) => (
                  <option key={v} value={v}>
                    {l}
                  </option>
                ))}
              </select>
            </div>
            <button className="btn btn--teal finder-go" type="submit">
              Find care <Icon name="arrow_forward" size={18} className="ms--sm" />
            </button>
          </form>
        </div>
      </section>

      {/* Who we are */}
      <section className="section who">
        <div className="wrap">
          <div className="who-row">
            <p className="eyebrow who-label">Who we are</p>
            <p className="serif who-text">
              We began as a family ENT practice in San Francisco in 1940. Today our physicians, audiologists, allergists and therapists care for you{' '}
              <em>as one team</em>, so every part of your care connects.
            </p>
          </div>
          <div className="who-stats">
            {(
              [
                ['1940', '', 'Founded in San Francisco by Dr. Meyer Schindler'],
                [String(departments.length), '', 'Specialties, from ENT to dermatology'],
                ['12', '', 'Offices from Sonoma to Sunnyvale'],
                ['4.9', ' / 5', 'Average rating from patient reviews'],
              ] as const
            ).map(([big, suffix, small]) => (
              <div key={small}>
                <div className="serif stat">
                  {big}
                  {suffix ? <span>{suffix}</span> : null}
                </div>
                <p>{small}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How we care */}
      <section className="section section--dark">
        <div className="wrap care-split">
          <div className="stack" style={{ gap: 36 }}>
            <p className="eyebrow">How we care for you</p>
            <h2 className="h2" style={{ fontSize: 'clamp(36px, 3.9vw, 56px)' }}>
              Specialist care that feels <em style={{ color: 'var(--sea)' }}>personal.</em>
            </h2>
            <Image src="/images/how-we-care.webp" alt="A woman walks along a fallen log in a redwood forest, arms outstretched" width={891} height={594} sizes="(max-width: 960px) 100vw, 560px" style={{ width: '100%', height: 'auto', borderRadius: 28 }} />
          </div>
          <ol className="pillars">
            {PILLARS.map(([t, d], i) => (
              <li key={t}>
                <span className="serif num">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h3 className="h3">{t}</h3>
                  <p>{d}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Patient stories */}
      <section className="section">
        <div className="wrap stories">
          <div className="stack" style={{ gap: 28 }}>
            <p className="eyebrow">Patient stories</p>
            <Icon name="format_quote" size={56} className="ms--fill quote-mark" />
            <blockquote className="serif story-quote">One week later, after my splints were removed, I can breathe so well through both nostrils now.</blockquote>
            <p className="muted" style={{ margin: 0, display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center' }}>
              <Stars /> Patient of Dr. Andrea Yeung · deviated septum surgery · May 2025
            </p>
          </div>
          <div className="stack" style={{ gap: 18, justifyContent: 'flex-end' }}>
            {(
              [
                ['“I love the office staff and Dr. Gupta’s care team… With her wisdom and care, my lungs are at a happy place. I have never breathed better!”', 'Allergy & asthma patient · April 2025'],
                ['“Best ENT in SF! Very thorough and takes great care in explaining everything.”', 'ENT patient · February 2025'],
              ] as const
            ).map(([q, who]) => (
              <figure key={who} className="mini-review">
                <Stars />
                <blockquote>{q}</blockquote>
                <figcaption>{who}</figcaption>
              </figure>
            ))}
            <Link className="link-arrow" href="/about#reviews" style={{ display: 'inline-flex', gap: 8, alignItems: 'center' }}>
              Read patient reviews <Icon name="arrow_forward" size={18} className="ms--sm" />
            </Link>
          </div>
        </div>
      </section>

      {/* Departments */}
      <section className="section" id="care" style={{ paddingTop: 'clamp(40px, 6vw, 80px)' }}>
        <div className="wrap">
          <div className="section-head">
            <div>
              <p className="eyebrow">Our care</p>
              <h2 className="h2" style={{ fontSize: 'clamp(36px, 3.9vw, 56px)' }}>
                Specialists for how you hear, breathe, speak and sleep.
              </h2>
            </div>
            <p className="lede">Every department has its own specialists, and they all work as one team. Start anywhere and we’ll connect the rest.</p>
          </div>
          <nav aria-label="Jump to a department" className="chips" style={{ marginBottom: 40 }}>
            {departments.map((d) => (
              <a key={d.slug} className="chip" href={`#dept-${d.slug}`} style={{ textDecoration: 'none', color: 'var(--ink)', fontWeight: 500, minHeight: 44 }}>
                {d.name}
              </a>
            ))}
          </nav>
          <div className="stack" style={{ gap: 24 }}>
            {departments.map((d, i) => (
              <section key={d.slug} id={`dept-${d.slug}`} aria-labelledby={`dept-${d.slug}-h`} className={`dept-card${i % 2 ? ' flip' : ''}`}>
                <Img media={media(d.home?.photo)} sizes="(max-width: 900px) 100vw, 680px" position={d.home?.photoPosition} />
                <div className="copy">
                  <h3 id={`dept-${d.slug}-h`} className="h2">
                    {d.name}
                  </h3>
                  <p>{d.home?.summary}</p>
                  <div className="chips" style={{ gap: 8 }}>
                    {d.home?.chips?.map((c) => (
                      <span key={c} className="dchip">
                        {c}
                      </span>
                    ))}
                  </div>
                  <Link className="dept-btn" href={`/care/${d.slug}`}>
                    Explore {d.home?.short}
                    <span className="arrow-dot">
                      <Icon name="arrow_forward" />
                    </span>
                  </Link>
                </div>
              </section>
            ))}
          </div>
          <div className="glance not-sure">
            <div className="stack" style={{ gap: 10 }}>
              <p className="serif" style={{ margin: 0, fontSize: 36, lineHeight: 1.1 }}>
                Not sure where to start?
              </p>
              <p className="muted" style={{ margin: 0 }}>
                Tell us what’s going on and our care team will match you with the right specialist.
              </p>
            </div>
            <div className="btn-row">
              <Link className="btn btn--clay" href="/book?care=not-sure">
                Get matched
              </Link>
              <a className="btn btn--outline" href="tel:4153625443">
                Call (415) 362-5443
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Specialists */}
      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <div>
              <p className="eyebrow">Meet your specialists</p>
              <h2 className="h2" style={{ fontSize: 'clamp(36px, 3.9vw, 56px)' }}>
                Deep expertise. People you’ll be glad to see again.
              </h2>
            </div>
            <Link className="btn btn--outline" href="/specialists">
              Find a specialist
            </Link>
          </div>
          <div className="spec-feature">
            {lead ? (
              <Link href={`/specialists/${lead.slug}`} className="spec-lead">
                <Img media={media(lead.photo)} alt={lead.name} sizes="(max-width: 900px) 100vw, 620px" />
                <div className="stack" style={{ gap: 14, padding: 32 }}>
                  <p className="eyebrow">ENT · Head &amp; neck surgery</p>
                  <p className="serif" style={{ margin: 0, fontSize: 36, lineHeight: 1.08 }}>
                    {lead.name}
                  </p>
                  <p className="muted" style={{ margin: 0 }}>
                    Adult and pediatric ENT with a focus on sinus, ear and thyroid care. With the practice since 2001; Assistant Clinical Professor at
                    UCSF.
                  </p>
                  <blockquote className="serif" style={{ margin: 0, fontSize: 20, lineHeight: 1.35 }}>
                    “Dr. Jacob Johnson has been my ENT for over a decade, and there’s nobody better.”
                  </blockquote>
                  <span className="link-arrow" style={{ color: 'var(--teal)', display: 'inline-flex', gap: 8, alignItems: 'center' }}>
                    View profile <Icon name="arrow_forward" size={18} className="ms--sm" />
                  </span>
                </div>
              </Link>
            ) : null}
            <div className="spec-grid">
              {portraits.map((s) => (
                <Link key={s!.id} href={`/specialists/${s!.slug}`} className="person">
                  <Img media={media(s!.photo)} alt={s!.name} className="portrait" sizes="(max-width: 680px) 50vw, 240px" />
                  <span className="name" style={{ fontSize: 20 }}>
                    {s!.name}
                  </span>
                  <span className="meta">{s!.role}</span>
                </Link>
              ))}
              <Link href="/specialists" className="spec-count">
                <span className="serif">{specialists.length}</span>
                <span>ENT physicians, audiologists, allergists, therapists and speech-language pathologists</span>
                <strong>See everyone →</strong>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Locations */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="loc-band">
            <div className="stack" style={{ gap: 28 }}>
              <p className="eyebrow">Locations</p>
              <h2 className="h2" style={{ fontSize: 'clamp(36px, 3.9vw, 56px)' }}>
                Twelve offices, close to home.
              </h2>
              <dl className="loc-regions">
                {REGIONS.map(([r, list]) => (
                  <div key={r}>
                    <dt>{r}</dt>
                    <dd>{list}</dd>
                  </div>
                ))}
              </dl>
              <form action="/locations" className="loc-search">
                <label htmlFor="home-zip" className="visually-hidden">
                  ZIP code or city
                </label>
                <input id="home-zip" name="q" inputMode="text" placeholder="Enter your ZIP code or city" />
                <button className="btn btn--clay" type="submit">
                  Find nearest
                </button>
              </form>
            </div>
            <Image src="/images/east-bay-hills.webp" alt="Rolling green hills of the East Bay" width={1920} height={1140} sizes="(max-width: 960px) 100vw, 640px" className="loc-photo" />
          </div>
        </div>
      </section>

      {/* Before your visit */}
      <section id="resources" className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <h2 className="h2" style={{ marginBottom: 40 }}>
            Everything you need before your visit
          </h2>
          <div className="grid" style={{ ['--cols' as string]: 4 }}>
            {RESOURCES.map(([icon, t, d, href]) => (
              <a key={t} href={href} className="resource" style={{ minHeight: 210 }}>
                <Icon name={icon} size={32} />
                <span className="serif" style={{ fontSize: 26, color: 'var(--ink)' }}>
                  {t}
                </span>
                <span>{d}</span>
              </a>
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
