import Image from 'next/image'
import Link from 'next/link'
import type { Department, Media, Office, Review, Specialist } from '@/payload-types'
import { docs, media, sitePages, tel, deptOffices } from '@/lib/content'
import { Inline, RichText } from '@/lib/format'
import { DeptBadge } from './DeptChrome'
import { Icon, Img, Initials } from './ui'
import { TiltCard } from './TiltCard'
import { BeforeAfter } from './BeforeAfter'
import { StoryCarousel } from './StoryCarousel'
import { Stethoscope } from './Stethoscope'

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

const reviewDate = (iso?: string | null) => (iso ? new Date(iso).toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' }) : '')
const reviewWho = (r: Review) => (r.location ? `${r.name} (${r.location})` : r.name)

function ReviewStars({ rating }: { rating: number }) {
  const n = Math.round(rating)
  return (
    <span className="stars" aria-label={`${n} out of 5 stars`} style={{ letterSpacing: 2 }}>
      {'★'.repeat(n)}
      <span style={{ opacity: 0.25 }}>{'★'.repeat(5 - n)}</span>
    </span>
  )
}

/** The home page's "Patient stories" layout: one featured review beside smaller ones. */
/** Shown on a department's overview until it has published reviews. */
export function FirstReviewPrompt({ d, href }: D & { href: string }) {
  return (
    <section className="section" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <div className="first-review">
          <span className="stars" aria-hidden="true" style={{ fontSize: 22, letterSpacing: 3 }}>
            ★★★★★
          </span>
          <div className="stack" style={{ gap: 6 }}>
            <p className="serif" style={{ margin: 0, fontSize: 26, lineHeight: 1.15 }}>
              Been a patient of {d.shortBrand}?
            </p>
            <p className="muted" style={{ margin: 0 }}>
              Share your experience and help others find the right care.
            </p>
          </div>
          <Link className="btn btn--outline" href={`${href}#leave-a-review`}>
            Leave a review
          </Link>
        </div>
      </div>
    </section>
  )
}

export function PatientStories({ d, reviews, allHref }: D & { reviews: Review[]; allHref?: string }) {
  if (!reviews.length) return null
  const stories = reviews.map((r) => ({ id: r.id, quote: r.quote, rating: r.rating, who: [reviewWho(r), reviewDate(r.date)].filter(Boolean).join(' · ') }))
  return (
    <section className="section">
      <StoryCarousel stories={stories} allHref={allHref} allLabel={`Read all ${reviews.length} reviews of ${d.shortBrand}`} />
    </section>
  )
}

/** Every published review, for a department's Reviews page. */
export function ReviewList({ reviews }: { reviews: Review[] }) {
  if (!reviews.length) return <p className="muted">No reviews yet. Be the first to share your experience.</p>
  return (
    <div className="review-list">
      {reviews.map((r) => (
        <figure key={r.id} className="mini-review">
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
            <ReviewStars rating={r.rating} />
            <span className="muted" style={{ fontSize: 14 }}>
              {reviewDate(r.date)}
            </span>
          </div>
          <blockquote>“{r.quote}”</blockquote>
          <figcaption>{reviewWho(r)}</figcaption>
        </figure>
      ))}
    </div>
  )
}

const anchor = (title: string) =>
  title
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

/** Image cards (e.g. Voice & Swallowing, Airway) that jump to full write-ups further down the page. */
function ConditionCategories({ d }: D) {
  const cats = d.conditions?.categories || []
  return (
    <>
      <section className="section" style={{ paddingTop: 72, paddingBottom: 24 }}>
        <div className="wrap cat-cards">
          {cats.map((c) => (
            <a key={c.id} href={`#${anchor(c.title)}`} className="cat-card">
              {media(c.image) ? <Img media={media(c.image)} sizes="(max-width: 760px) 100vw, 620px" /> : null}
              <span className="serif">{c.title}</span>
            </a>
          ))}
        </div>
      </section>
      {cats.map((c) => (
        <section key={c.id} id={anchor(c.title)} className="section cat-section" style={{ scrollMarginTop: 'var(--header-h)' }}>
          <div className="wrap">
            <div className="stack" style={{ gap: 14, maxWidth: 820, marginBottom: 40 }}>
              <p className="eyebrow">{c.title}</p>
              <h2 className="h2">{c.heading || c.title}</h2>
              {c.intro ? <p className="lede">{c.intro}</p> : null}
            </div>
            {(c.groups || []).map((g) => (
              <div key={g.id} className="cat-group">
                {g.heading ? <h3 className="cat-group-title">{g.heading}</h3> : null}
                <div className="cat-items">
                  {(g.items || []).map((it) => (
                    <article key={it.id} className="cat-item">
                      <h4 className="h3">{it.title}</h4>
                      {it.body.split(/\n\s*\n/).map((para, i) => (
                        <p key={i}>{para}</p>
                      ))}
                    </article>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </>
  )
}

/** A wide photo under a page heading. */
export function PageBanner({ image, position }: { image?: number | Media | null; position?: string | null }) {
  const m = media(image)
  if (!m?.url) return null
  return (
    <section className="page-banner">
      <div className="wrap">
        <Img media={m} sizes="(max-width: 1248px) 100vw, 1248px" position={position} className="page-banner-img" />
      </div>
    </section>
  )
}

/** Photo mosaic on a department overview. */
export function Gallery({ d }: D) {
  const photos = (d.gallery?.photos || []).filter((p) => media(p.image)?.url)
  if (!photos.length) return null
  return (
    <section className="section" style={{ paddingTop: 0 }}>
      <div className="wrap stack" style={{ gap: 32 }}>
        {d.gallery?.heading ? (
          <div className="stack" style={{ gap: 10, maxWidth: 760 }}>
            {d.gallery.eyebrow ? <p className="eyebrow">{d.gallery.eyebrow}</p> : null}
            <h2 className="h2">{d.gallery.heading}</h2>
          </div>
        ) : null}
        <div className={`mosaic mosaic--${Math.min(photos.length, 5)}`}>
          {photos.map((p, i) => (
            <figure key={p.id} className="mosaic-item">
              <Img media={media(p.image)} sizes={i === 0 ? '(max-width: 900px) 100vw, 620px' : '(max-width: 900px) 50vw, 320px'} position={p.position} />
              {p.caption ? <figcaption>{p.caption}</figcaption> : null}
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}

export function ConditionsBody({ d }: D) {
  const c = d.conditions
  if (c?.categories?.length) return <ConditionCategories d={d} />
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
  const items = d.treatments?.items || []
  const withPhotos = items.some((t) => media(t.image)?.url)
  if (withPhotos) {
    return (
      <section className="section" style={{ paddingTop: 72 }}>
        <div className="wrap tx-cards">
          {items.map((t) => (
            <article key={t.id} className="tx-card">
              <div className="tx-card-img">{media(t.image)?.url ? <Img media={media(t.image)} sizes="(max-width: 680px) 100vw, (max-width: 1100px) 50vw, 300px" position={t.imagePosition} /> : null}</div>
              <div className="tx-card-body">
                <h2 className="h3">{t.title}</h2>
                <p>{t.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    )
  }
  return (
    <section className="section section--dark" style={{ paddingTop: 96 }}>
      <div className="wrap tx-grid">
        {items.map((t) => (
          <div key={t.id} className="tx">
            <h2 className="h3">{t.title}</h2>
            <p>{t.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

/** The department's team with photos, full names and every office they see patients at. */
export function TeamPreview({ d, teamHref }: D & { teamHref?: string }) {
  const people = docs<Specialist>(d.team?.members)
  if (!d.teamOnOverview || !people.length) return null
  return (
    <section className="section" style={{ paddingTop: 0 }}>
      <div className="wrap stack" style={{ gap: 32 }}>
        <div className="section-head">
          <div className="stack" style={{ gap: 10 }}>
            <p className="eyebrow">{d.team?.eyebrow || 'Your care team'}</p>
            <h2 className="h2">{d.team?.heading || 'Meet the team'}</h2>
          </div>
          {teamHref ? (
            <Link className="link-arrow" href={teamHref} style={{ display: 'inline-flex', gap: 8, alignItems: 'center' }}>
              Offices and directions <Icon name="arrow_forward" size={18} className="ms--sm" />
            </Link>
          ) : null}
        </div>
        <div className="team-preview">
          {people.map((p) => {
            const where = deptOffices({ ...d, offices: p.offices } as Department).map((o) => o.name)
            return (
              <Link key={p.id} href={`/specialists/${p.slug}`} className="team-card">
                <div className="team-card-img">{media(p.photo) ? <Img media={media(p.photo)} alt={p.name} sizes="(max-width: 760px) 100vw, 260px" /> : <Initials name={p.name} />}</div>
                <div className="team-card-body">
                  <span className="serif team-card-name">{p.name}</span>
                  <span className="meta">{p.role}</span>
                  {where.length ? (
                    <span className="team-card-where">
                      <Icon name="location_on" size={18} />
                      {where.join(' · ')}
                    </span>
                  ) : null}
                  <span className="link-arrow" style={{ display: 'inline-flex', gap: 6, alignItems: 'center', color: 'var(--teal)' }}>
                    View profile <Icon name="arrow_forward" size={16} className="ms--sm" />
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/** Before-and-after results. Real, consented patient photos only; until then, a short note. */
export function Results({ d }: D) {
  const r = d.results
  if (!r?.heading) return null
  const pairs = (r.pairs || []).filter((p) => media(p.before)?.url && media(p.after)?.url)
  const src = (m: Media) => ({ src: `/img?src=${encodeURIComponent(m.url!)}&w=1200`, width: m.width || 1200, height: m.height || 900 })
  return (
    <section id="results" className="section section--paper" style={{ scrollMarginTop: 'var(--header-h)' }}>
      <div className="wrap stack" style={{ gap: 32 }}>
        <div className="stack" style={{ gap: 12, maxWidth: 760 }}>
          {r.eyebrow ? <p className="eyebrow">{r.eyebrow}</p> : null}
          <h2 className="h2">{r.heading}</h2>
          {r.intro ? <p className="lede">{r.intro}{pairs.length ? ' Drag the handle on each photo to compare.' : ''}</p> : null}
        </div>
        {pairs.length ? (
          <div className="ba-grid">
            {pairs.map((p) => (
              <figure key={p.id} className="ba-figure">
                <BeforeAfter before={src(media(p.before)!)} after={src(media(p.after)!)} alt={p.caption || 'treatment result'} />
                {p.caption ? <figcaption>{p.caption}</figcaption> : null}
              </figure>
            ))}
          </div>
        ) : (
          <div className="ba-pending">
            <div className="ba-pending-demo" aria-hidden="true">
              <span>Before</span>
              <span className="ba-pending-line" />
              <span>After</span>
            </div>
            <p style={{ margin: 0 }}>{r.pendingNote || 'Before-and-after photos are coming soon.'}</p>
          </div>
        )}
        {pairs.length ? (
          <p className="muted" style={{ margin: 0, fontSize: 14 }}>
            Photos are of real SH patients, shared with their permission. Individual results vary.
          </p>
        ) : null}
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
              <Img media={media(p.photo)} alt={p.name} className="portrait" quality={90} sizes="(max-width: 680px) 50vw, 300px" />
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

type CtaPhoto = { src: string; alt: string; position?: string }

/** Photo for the main site's closing call to action. */
const CTA_DEFAULT_PHOTO: CtaPhoto = { src: '/images/golden-gate.jpg', alt: 'The Golden Gate Bridge over San Francisco Bay', position: '30% 45%' }

/** A 3D card: the photo sits deep inside, the words and buttons float in front, and it tilts toward the pointer. */
export function CtaBand({
  heading,
  text,
  primary,
  secondary,
  photo = CTA_DEFAULT_PHOTO,
}: {
  heading: string
  text: string
  primary: { label: string; href: string }
  secondary?: { label: string; href: string }
  photo?: CtaPhoto
}) {
  return (
    <section className="cta-3d">
      <div className="wrap">
        <TiltCard className="cta-3d-card">
          <div className="cta-3d-bg">
            <div className="cta-3d-photo">
              <Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 1248px) 100vw, 1248px" style={{ objectFit: 'cover', objectPosition: photo.position || 'center' }} />
            </div>
            <div className="cta-3d-shade" aria-hidden="true" />
          </div>
          <Stethoscope className="cta-3d-tool" />
          <div className="cta-3d-content">
            <div className="stack" style={{ gap: 14, maxWidth: 640 }}>
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
        </TiltCard>
      </div>
    </section>
  )
}

/** Departments whose closing photo differs from their own hero photo. */
const CTA_PHOTOS: Record<string, CtaPhoto> = {
  'facial-plastics': { src: '/images/golden-gate.jpg', alt: 'The Golden Gate Bridge over San Francisco Bay', position: '30% 45%' },
}

export function DeptCta({ d }: D) {
  const hero = media(d.photo)
  const photo = CTA_PHOTOS[d.slug] ?? (hero?.url ? { src: hero.url, alt: hero.alt || '', position: d.photoPosition || 'center' } : undefined)
  return (
    <CtaBand
      photo={photo}
      heading={d.ctaHeading}
      text={`Book online, or call ${d.phoneLabel} at ${d.phone}, Monday to Friday, 8am to 5pm.`}
      primary={{ label: d.bookLabel, href: `/book?care=${d.slug}` }}
      secondary={{ label: `Call ${d.phoneLabel}`, href: tel(d.phone)! }}
    />
  )
}
