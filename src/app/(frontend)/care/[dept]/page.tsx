import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { DeptCta, DeptHero, Overview, Quicklinks, Reviews } from '@/components/sections'
import { getDepartment } from '@/lib/content'

type Props = { params: Promise<{ dept: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const d = await getDepartment((await params).dept)
  return d ? { title: d.brand, description: d.intro } : {}
}

export default async function DepartmentOverview({ params }: Props) {
  const d = await getDepartment((await params).dept)
  if (!d) notFound()
  return (
    <>
      <DeptHero d={d} />
      <Quicklinks d={d} />
      <Overview d={d} />
      <Reviews d={d} />
      <DeptCta d={d} />
    </>
  )
}
