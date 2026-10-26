import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { DeptCta, DeptHero, Overview, PatientStories, Quicklinks, Reviews } from '@/components/sections'
import { getDepartment, getReviews, sitePages } from '@/lib/content'

type Props = { params: Promise<{ dept: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const d = await getDepartment((await params).dept)
  return d ? { title: d.brand, description: d.intro } : {}
}

export default async function DepartmentOverview({ params }: Props) {
  const d = await getDepartment((await params).dept)
  if (!d) notFound()
  const reviews = await getReviews(d.id)
  const reviewsPage = sitePages(d).find((p) => p.key === 'reviews')
  return (
    <>
      <DeptHero d={d} />
      <Quicklinks d={d} />
      <Overview d={d} />
      {reviews.length ? <PatientStories d={d} reviews={reviews} allHref={reviewsPage?.href} /> : <Reviews d={d} />}
      <DeptCta d={d} />
    </>
  )
}
