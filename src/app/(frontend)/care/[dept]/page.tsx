import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { DeptCta, DeptHero, FirstReviewPrompt, Gallery, Overview, PatientStories, Quicklinks, Results, Reviews, TeamPreview } from '@/components/sections'
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
      <TeamPreview d={d} teamHref={sitePages(d).find((p) => p.key === 'team')?.href} />
      <Gallery d={d} />
      <Results d={d} />
      {reviews.length ? (
        <PatientStories d={d} reviews={reviews} allHref={reviewsPage?.href} />
      ) : reviewsPage ? (
        <FirstReviewPrompt d={d} href={reviewsPage.href} />
      ) : (
        <Reviews d={d} />
      )}
      <DeptCta d={d} />
    </>
  )
}
