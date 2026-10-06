import type { Metadata } from 'next'
import Link from 'next/link'
import { DeptBadge } from '@/components/DeptChrome'
import { Icon, Img } from '@/components/ui'
import { getDepartments, media } from '@/lib/content'

export const metadata: Metadata = { title: 'All care' }

export default async function AllCare() {
  const departments = await getDepartments()
  return (
    <>
      <section className="page-heading">
        <div className="wrap">
          <p className="eyebrow">Our care</p>
          <h1 className="h1">Specialists for how you hear, breathe, speak and sleep.</h1>
          <p className="lede">
            {departments.length} departments, one team. Every department has its own specialists, and they all work together, so start anywhere and
            we’ll connect the rest.
          </p>
        </div>
      </section>
      <section className="section">
        <div className="wrap grid">
          {departments.map((d) => (
            <Link key={d.slug} href={`/care/${d.slug}`} className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ position: 'relative', aspectRatio: '16 / 10', background: 'var(--bay)' }}>
                <Img media={media(d.home?.photo || d.photo)} sizes="(max-width: 680px) 100vw, 420px" position={d.home?.photoPosition} className="cover" />
                <span style={{ position: 'absolute', left: 16, bottom: 16, background: 'var(--bay)', borderRadius: 16, padding: 8, display: 'flex' }}>
                  <DeptBadge d={d} size={56} />
                </span>
              </div>
              <div className="stack" style={{ padding: 28, gap: 10, flex: 1 }}>
                <h2 className="h3">{d.name}</h2>
                <p>{d.home?.summary}</p>
                <span className="more" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  Explore {d.home?.short} <Icon name="arrow_forward" size={18} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}
