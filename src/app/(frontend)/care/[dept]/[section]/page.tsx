import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import type { Office, Specialist } from '@/payload-types'
import {
  ConditionsBody,
  DeptCta,
  Faq,
  FeatureBody,
  OfficeGrid,
  PageHeading,
  Resources,
  TeamGrid,
  TreatmentsBody,
  Visit,
} from '@/components/sections'
import { docs, getDepartment, getDepartments, sitePages } from '@/lib/content'

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
  if (!r) notFound()
  const { d, page } = r

  switch (page.key) {
    case 'conditions':
      return (
        <>
          <PageHeading d={d} label={page.label} eyebrow={d.conditions.eyebrow || page.label} title={d.conditions.heading} lede={d.conditions.lede} />
          <ConditionsBody d={d} />
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
              <TeamGrid people={people} empty={d.team?.emptyNote} />
            </div>
          </section>
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
              <OfficeGrid offices={docs<Office>(d.offices)} phone={d.officePhone} />
            </div>
          </section>
          <DeptCta d={d} />
        </>
      )
    default:
      notFound()
  }
}
