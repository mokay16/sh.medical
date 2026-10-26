import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import type { Office, Specialist } from '@/payload-types'
import {
  ConditionsBody,
  DeptCta,
  Faq,
  FeatureBody,
  OfficeGrid,
  PageHeading,
  Resources,
  ReviewList,
  TeamGrid,
  TreatmentsBody,
  Visit,
} from '@/components/sections'
import { deptOffices, docs, getDepartment, getDepartments, getReviews, mergedPageHref, mergedTreatments, sitePages } from '@/lib/content'
import { ReviewForm } from '@/components/ReviewForm'

type Props = { params: Promise<{ dept: string; section: string }> }

export async function generateStaticParams() {
  return (await getDepartments()).flatMap((d) =>
    sitePages(d)
      .filter((p) => p.segment)
      .map((p) => ({ dept: d.slug, section: p.segment! })),
  )
}

async function load(params: Props['params']) {
  const { dept, section } = await params
  const d = await getDepartment(dept)
  const page = d && sitePages(d).find((p) => p.segment === section)
  return d && page ? { d, page } : null
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const r = await load(params)
  return r ? { title: `${r.page.label} · ${r.d.brand}` } : {}
}

export default async function DepartmentSection({ params }: Props) {
  const r = await load(params)
  if (!r) {
    // A page merged into another one (e.g. Locations into Team) keeps working at its old address.
    const { dept, section } = await params
    const d = await getDepartment(dept)
    const href = d && mergedPageHref(d, section)
    if (href) redirect(href)
    notFound()
  }
  const { d, page } = r

  switch (page.key) {
    case 'conditions':
      return (
        <>
          <PageHeading d={d} label={page.label} eyebrow={d.conditions.eyebrow || page.label} title={d.conditions.heading} lede={d.conditions.lede} />
          <ConditionsBody d={d} />
          {mergedTreatments(d) ? (
            <div id="treatment" style={{ scrollMarginTop: 'var(--header-h)' }}>
              <section className="section section--dark" style={{ paddingBottom: 0 }}>
                <div className="wrap">
                  <div className="stack" style={{ gap: 18, maxWidth: 820 }}>
                    <p className="eyebrow">{d.treatments?.eyebrow || d.treatments?.navLabel}</p>
                    <h2 className="h2">{d.treatments?.heading}</h2>
                    {d.treatments?.lede ? <p className="lede">{d.treatments.lede}</p> : null}
                  </div>
                </div>
              </section>
              <TreatmentsBody d={d} />
            </div>
          ) : null}
          <DeptCta d={d} />
        </>
      )
    case 'treatments':
      return (
        <>
          <PageHeading d={d} label={page.label} eyebrow={d.treatments?.eyebrow || page.label} title={d.treatments?.heading || page.label} lede={d.treatments?.lede} />
          <TreatmentsBody d={d} />
          <DeptCta d={d} />
        </>
      )
    case 'feature':
      return (
        <>
          <PageHeading d={d} label={page.label} eyebrow={d.feature?.eyebrow} title={d.feature?.heading || page.label} lede={d.feature?.paras?.[0]?.text} />
          <FeatureBody d={d} />
          <DeptCta d={d} />
        </>
      )
    case 'reviews': {
      const reviews = await getReviews(d.id)
      const avg = reviews.length ? reviews.reduce((n, r) => n + r.rating, 0) / reviews.length : 0
      return (
        <>
          <PageHeading
            d={d}
            label={page.label}
            eyebrow="Patient reviews"
            title="What our patients say"
            lede={reviews.length ? `${reviews.length} review${reviews.length === 1 ? '' : 's'} · Average rating ${avg.toFixed(1)} out of 5` : 'Share your experience with our team.'}
          />
          <section className="section section--paper" style={{ paddingTop: 72 }}>
            <div className="wrap">
              <ReviewList reviews={reviews} />
            </div>
          </section>
          <section id="leave-a-review" className="section" style={{ scrollMarginTop: 'var(--header-h)' }}>
            <div className="wrap review-form-layout">
              <div className="stack" style={{ gap: 14 }}>
                <p className="eyebrow">Leave a review</p>
                <h2 className="h2">Tell us your story</h2>
                <p className="lede">Are you a patient of {d.brand}? We’d love to hear how your care went. Reviews appear here once our team has checked them.</p>
              </div>
              <ReviewForm departmentId={d.id} brand={d.brand} />
            </div>
          </section>
          <DeptCta d={d} />
        </>
      )
    }
    case 'patients':
      return (
        <>
          <PageHeading
            d={d}
            label={page.label}
            eyebrow="For patients"
            title="Your visit, made simple"
            lede="Forms, what to bring, insurance and answers to the questions we hear most."
          />
          <Visit d={d} />
          {d.feature?.enabled && d.feature.onPatientsPage ? <FeatureBody d={d} withHeading /> : null}
          <Resources d={d} />
          <Faq d={d} />
          <DeptCta d={d} />
        </>
      )
    case 'team': {
      const people = docs<Specialist>(d.team?.members)
      const count = people.length ? ` · ${people.length} specialist${people.length === 1 ? '' : 's'}` : ''
      return (
        <>
          <PageHeading d={d} label={page.label} eyebrow={(d.team?.eyebrow || 'Your care team') + count} title={d.team?.heading || 'Meet the team'} />
          <section className="section section--paper" style={{ paddingTop: 72 }}>
            <div className="wrap">
              <TeamGrid people={people} empty={d.team?.emptyNote} original={!!d.originalImages} />
            </div>
          </section>
          {d.locationsOnTeamPage ? (
            <section id="locations" className="section" style={{ scrollMarginTop: 'var(--header-h)' }}>
              <div className="wrap stack" style={{ gap: 32 }}>
                <div className="stack" style={{ gap: 14, maxWidth: 820 }}>
                  <p className="eyebrow">Where to find us</p>
                  <h2 className="h2">{d.whereHeading}</h2>
                  {d.whereNote ? <p className="lede">{d.whereNote}</p> : null}
                </div>
                <OfficeGrid offices={deptOffices(d)} phone={d.officePhone} />
              </div>
            </section>
          ) : null}
          <DeptCta d={d} />
        </>
      )
    }
    case 'locations':
      return (
        <>
          <PageHeading d={d} label={page.label} eyebrow="Where to find us" title={d.whereHeading} lede={d.whereNote} />
          <section className="section section--paper" style={{ paddingTop: 72 }}>
            <div className="wrap">
              <OfficeGrid offices={deptOffices(d)} phone={d.officePhone} />
            </div>
          </section>
          <DeptCta d={d} />
        </>
      )
    default:
      notFound()
  }
}
