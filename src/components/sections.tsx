import Link from 'next/link'
import type { Department, Office, Specialist } from '@/payload-types'
import { docs, media, sitePages, tel } from '@/lib/content'
import { Inline, RichText } from '@/lib/format'
import { DeptBadge } from './DeptChrome'
import { Icon, Img, Initials } from './ui'

type D = { d: Department }

export function DeptHero({ d }: D) {
  const secondary = d.heroSecondaryLabel
    ? { label: d.heroSecondaryLabel, href: d.heroSecondaryHref || '#' }
    : { label: `Call ${d.phoneLabel} ${d.phone}`, href: tel(d.phone)! }
  return (
    <section className="hero">
      <div className="wrap">
        <div className="hero-copy">
          <nav aria-label="Breadcrumb" className="breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <Link href="/care">Care</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{d.name}</span>
          </nav>
          <p className="eyebrow" style={{ marginTop: 30 }}>
            {d.eyebrow}
          </p>
          <h1 className="h1">
            <Inline text={d.headline} />
          </h1>
          <p className="lede" style={{ fontSize: 20, maxWidth: 560 }}>
            {d.intro}
          </p>
          <div className="btn-row">
            <Link className="btn btn--clay" href={`/book?care=${d.slug}`}>
              {d.bookLabel}
            </Link>
            <a className="btn btn--outline" href={secondary.href}>
              {secondary.label}
            </a>
          </div>
          {d.facts?.length ? (
            <div className="facts">
              {d.facts.map((f) => (
                <div key={f.id}>
                  <div className="serif">{f.big}</div>
                  <small>{f.small}</small>
                </div>
              ))}
            </div>
          ) : null}
        </div>
        <div className="hero-photo">
          <Img media={media(d.photo)} sizes="(max-width: 900px) 100vw, 520px" position={d.photoPosition} priority />
          {d.logo ? (
            <div className="logo-tile">
              <DeptBadge d={d} size={104} />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}

export function PageHeading({ d, label, eyebrow, title, lede }: D & { label: string; eyebrow?: string | null; title: string; lede?: string | null }) {
  return (
    <section className="page-heading">
      <div className="wrap">
        <nav aria-label="Breadcrumb" className="breadcrumb">
          <Link href="/">SH Medical</Link>
          <span aria-hidden="true">/</span>
          <Link href={`/care/${d.slug}`}>{d.name}</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{label}</span>
        </nav>
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h1 className="h1">
          <Inline text={title} />
        </h1>
        {lede ? (
          <p className="lede">
            <Inline text={lede} />
          </p>
        ) : null}
      </div>
    </section>
  )
}

const firstSentence = (s?: string | null) => (s || '').replace(/\*/g, '').match(/^.+?[.!?](\s|$)/)?.[0].trim() || s || ''

export function Quicklinks({ d }: D) {
  const team = docs<Specialist>(d.team?.members)
  const offices = docs<Office>(d.offices)
  const desc: Record<string, string> = {
    conditions: firstSentence(d.conditions?.lede) || 'Everything we treat.',
    treatments: firstSentence(d.treatments?.lede),
    feature: firstSentence(d.feature?.paras?.[0]?.text),
    patients: 'Forms, insurance, what to bring and answers to common questions.',
    team: team.length ? `Meet our ${team.length} specialists.` : 'Meet the team.',
    locations: offices.length ? `${offices.length} office${offices.length === 1 ? '' : 's'}, with addresses and phone numbers.` : 'Where we see patients.',
  }
  return (
    <section className="section" style={{ paddingBottom: 0 }}>
      <div className="wrap">
        <div className="section-head">
          <div>
            <p className="eyebrow">Explore</p>
            <h2 className="h2">Everything at {d.brand}</h2>
          </div>
        </div>
        <div className="grid">
          {sitePages(d)
            .filter((p) => p.key !== 'home')
            .map((p) => (
              <Link key={p.href} href={p.href} className="card quicklink">
                <span className="top">
                  <span className="h3">{p.label}</span>
                  <span className="arrow-dot">
                    <Icon name="arrow_forward" />
                  </span>
                </span>
                <p>{desc[p.key]}</p>
              </Link>
            ))}
        </div>
      </div>
    </section>
  )
}

export function Overview({ d }: D) {
  const o = d.overview
  if (!o) return null
  return (
    <section className="section">
      <div className="wrap overview">
        <div className="stack">
          {o.eyebrow ? <p className="eyebrow">{o.eyebrow}</p> : null}
          <h2 className="h2">{o.heading}</h2>
          {o.paras?.map((p) => (
            <p key={p.id} className="lede">
              <Inline text={p.text} />
            </p>
          ))}
        </div>
        {o.glance?.length ? (
          <aside className="glance">
            <h3 className="h3" style={{ fontSize: 26 }}>
              {o.glanceTitle}
            </h3>
            <Checks items={o.glance} />
            {o.note ? <p className="note">{o.note}</p> : null}
          </aside>
        ) : null}
      </div>
    </section>
  )
}

export function Checks({ items, two }: { items: string[]; two?: boolean }) {
  return (
    <ul className={`checks${two ? ' checks--2' : ''}`}>
      {items.map((it, i) => (
        <li key={i}>
          <Icon name="check" />
          <span>
            <Inline text={it} />
          </span>
        </li>
      ))}
    </ul>
  )
}

export function Reviews({ d }: D) {
  if (!d.reviews?.length) return null
  return (
    <section className="section">
      <div className="wrap">
        <div className="section-head">
          <div>
            <p className="eyebrow">Patient reviews</p>
            <h2 className="h2">What our patients say</h2>
          </div>
          <Link className="link-arrow" href="/about#reviews">
            Read all reviews →
          </Link>
        </div>
        <div className="grid">
          {d.reviews.map((r) => (
            <figure key={r.id} className="review">
              <Icon name="format_quote" className="ms--fill" size={40} />
              <blockquote>{r.quote}</blockquote>
              <figcaption>
                <span className="stars" aria-label="5 out of 5 stars">
                  ★★★★★
                </span>{' '}
                {r.attribution}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}

export function ConditionsBody({ d }: D) {
  const c = d.conditions
  if (c?.programs?.length) {
    return (
      <section className="section" style={{ paddingTop: 72 }}>
        <div className="wrap grid" style={{ ['--cols' as string]: 2, gap: 24 }}>
          {c.programs.map((p) => (
            <article key={p.id} className="card program">
              <h2 className="h3" style={{ fontSize: 30 }}>
                {p.title}
              </h2>
              <p style={{ fontSize: 16 }}>{p.summary}</p>
              {p.conditions?.length ? (
                <div>
                  <h3 className="label">Conditions</h3>
                  <div className="list">{p.conditions.join(' · ')}</div>
                </div>
              ) : null}
              {p.procedures?.length ? (
                <div>
                  <h3 className="label">{p.procLabel || 'Treatments and procedures'}</h3>
                  <div className="list">{p.procedures.join(' · ')}</div>
                </div>
              ) : null}
            </article>
          ))}
        </div>
      </section>
    )
  }
  return (
    <section className="section" style={{ paddingTop: 72 }}>
      <div className="wrap grid">
        {c?.items?.map((it) => (
          <article key={it.id} className="card">
            <h2 className="h3">{it.title}</h2>
            <p>{it.description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

export function TreatmentsBody({ d }: D) {
  return (
    <section className="section section--dark" style={{ paddingTop: 96 }}>
      <div className="wrap tx-grid">
        {d.treatments?.items?.map((t) => (
          <div key={t.id} className="tx">
            <h2 className="h3">{t.title}</h2>
            <p>{t.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export function FeatureBody({ d, withHeading }: D & { withHeading?: boolean }) {
  const f = d.feature
  if (!f) return null
  const paras = withHeading ? f.paras || [] : (f.paras || []).slice(1)
  const image = media(f.image)
  const bullets = (f.bullets || []).map((b) => b.text)
  return (
    <section className="section" style={withHeading ? undefined : { paddingTop: 72 }}>
      <div className="wrap feature">
        {image ? <Img media={image} sizes="(max-width: 860px) 100vw, 520px" /> : null}
        <div className="stack" style={{ gap: 24, flex: 1 }}>
          {withHeading ? (
            <>
              <p className="eyebrow">{f.eyebrow}</p>
              <h2 className="h2">{f.heading}</h2>
            </>
          ) : null}
          {paras.map((p) => (
            <p key={p.id} className="lede">
              <Inline text={p.text} />
            </p>
          ))}
          {f.chips?.length ? (
            <div className="chips">
              {f.chips.map((c) => (
                <span key={c} className="chip">
                  {c}
                </span>
              ))}
            </div>
          ) : null}
          {bullets.length ? <Checks items={bullets} two={!image && bullets.length > 4} /> : null}
          {f.links?.length ? (
            <div className="btn-row" style={{ gap: '12px 28px' }}>
              {f.links.map((l) => (
                <span key={l} className="link-arrow" style={{ color: 'var(--teal)' }}>
                  {l} →
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}

export function Visit({ d }: D) {
  const v = d.visit
  if (!v) return null
  const steps = v.steps || []
  return (
    <section className="section section--mist">
      <div className="wrap">
        <div className="section-head">
          <div>
            <p className="eyebrow" style={{ color: 'var(--teal)' }}>
              {v.eyebrow || 'Your care, step by step'}
            </p>
            <h2 className="h2">{v.heading}</h2>
          </div>
          <Link className="link-arrow" href={`/book?care=${d.slug}`}>
            {v.linkLabel || 'Book your first visit →'}
          </Link>
        </div>
        <ol className="steps" style={{ ['--cols' as string]: steps.length }}>
          {steps.map((s, i) => (
            <li key={s.id}>
              <span className="num">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="h3" style={{ fontSize: 26 }}>
                {s.title}
              </h3>
              <p>{s.description}</p>
            </li>
          ))}
        </ol>
        {v.note ? (
          <p style={{ margin: '40px 0 0', maxWidth: 900, color: '#34504d' }}>
            <Inline text={v.note} />
          </p>
        ) : null}
      </div>
    </section>
  )
}

export function Resources({ d }: D) {
  if (!d.resources?.length) return null
  return (
    <section className="section" style={{ paddingBottom: 0 }}>
      <div className="wrap">
        <div className="section-head">
          <div>
            <p className="eyebrow">For patients</p>
            <h2 className="h2">Before and after your visit</h2>
          </div>
        </div>
        <div className="grid" style={{ ['--cols' as string]: 4 }}>
          {d.resources.map((r) => (
            <div key={r.id} className="resource">
              {r.icon ? <Icon name={r.icon} size={28} /> : null}
              <strong>{r.title}</strong>
              {r.description ? (
                <span>
                  <Inline text={r.description} />
                </span>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Faq({ d }: D) {
  if (!d.faq?.length) return null
  const open = d.faqOpen ?? 2
  return (
    <section className="section">
      <div className="wrap faq-layout">
        <div className="stack" style={{ gap: 16 }}>
          <p className="eyebrow">FAQ</p>
          <h2 className="h2" style={{ fontSize: 'clamp(32px, 3vw, 44px)' }}>
            Questions we hear often
          </h2>
        </div>
        <div className="faq-list">
          {d.faq.map((q, i) => (
            <details key={q.id} open={i < open}>
              <summary>{q.question}</summary>
              <RichText text={q.answer} />
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

export function TeamGrid({ people, empty }: { people: Specialist[]; empty?: string | null }) {
  if (!people.length) {
    return (
      <div className="card" style={{ border: '1.5px dashed var(--field)', background: 'transparent' }}>
        <p style={{ fontSize: 17 }}>{empty || 'Specialists for this department will be listed here.'}</p>
      </div>
    )
  }
  return (
    <div className="grid team-grid" style={{ ['--cols' as string]: 4, gap: '40px 24px' }}>
      {people.map((p) => {
        const where = docs<Office>(p.offices).map((o) => o.name)
        return (
          <Link key={p.id} href={`/specialists/${p.slug}`} className="person">
            {media(p.photo) ? (
              <Img media={media(p.photo)} alt={p.name} className="portrait" sizes="(max-width: 680px) 50vw, 300px" />
            ) : (
              <Initials name={p.name} />
            )}
            <span className="name">{p.name}</span>
            <span className="meta">{p.role}</span>
            <span className="meta meta--teal">{where.length ? where.join(' · ') : 'Office to confirm'}</span>
          </Link>
        )
      })}
    </div>
  )
}

export function OfficeGrid({ offices, phone }: { offices: Office[]; phone?: string | null }) {
  if (!offices.length) {
    return (
      <div className="card" style={{ border: '1.5px dashed var(--field)', background: 'transparent' }}>
        <p style={{ fontSize: 17 }}>[Offices offering this care to be confirmed by SH Medical]</p>
      </div>
    )
  }
  return (
    <div className="grid" style={{ gap: 24 }}>
      {offices.map((o) => {
        const ph = phone || o.phone
        const directions = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${o.street}, ${o.city}`)}`
        return (
          <article key={o.id} className="office-card">
            <span className="region">{o.region}</span>
            <h2 className="h3" style={{ fontSize: 26 }}>
              {o.name}
            </h2>
            <address>
              {o.street}
              <br />
              {o.city}
            </address>
            <span className="muted" style={{ fontSize: 15 }}>
              {o.hours}
            </span>
            <div className="actions">
              {ph ? <a href={tel(ph)}>{ph}</a> : <span>Phone to confirm</span>}
              <a href={directions}>Directions →</a>
            </div>
          </article>
        )
      })}
    </div>
  )
}

export function CtaBand({ heading, text, primary, secondary }: { heading: string; text: string; primary: { label: string; href: string }; secondary?: { label: string; href: string } }) {
  return (
    <section className="cta-band">
      <div className="wrap">
        <div className="stack" style={{ gap: 14, maxWidth: 760 }}>
          <h2 className="h2">
            <Inline text={heading} />
          </h2>
          <p className="lede">{text}</p>
        </div>
        <div className="btn-row">
          <Link className="btn btn--clay" href={primary.href}>
            {primary.label}
          </Link>
          {secondary ? (
            <a className="btn btn--outline" href={secondary.href}>
              {secondary.label}
            </a>
          ) : null}
        </div>
      </div>
    </section>
  )
}

export function DeptCta({ d }: D) {
  return (
    <CtaBand
      heading={d.ctaHeading}
      text={`Book online, or call ${d.phoneLabel} at ${d.phone}, Monday to Friday, 8am to 5pm.`}
      primary={{ label: d.bookLabel, href: `/book?care=${d.slug}` }}
      secondary={{ label: `Call ${d.phoneLabel}`, href: tel(d.phone)! }}
    />
  )
}
