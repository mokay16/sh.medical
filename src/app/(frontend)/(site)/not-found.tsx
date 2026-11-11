import type { Metadata } from 'next'
import Link from 'next/link'
import { MAIN_PHONE, tel } from '@/lib/content'

export const metadata: Metadata = { title: 'Page not found', robots: { index: false } }

const LINKS = [
  ['/care', 'All care', 'Browse our ten departments'],
  ['/specialists', 'Find a specialist', 'Search our doctors and clinicians'],
  ['/locations', 'Locations', 'Twelve offices across the Bay Area'],
  ['/patients', 'Patients', 'Forms, insurance and medical records'],
]

export default function NotFound() {
  return (
    <>
      <section className="page-heading">
        <div className="wrap">
          <p className="eyebrow">Page not found</p>
          <h1 className="h1">We can’t find that page.</h1>
          <p className="lede">
            It may have moved, or the link may be out of date. Try one of these, <Link href="/search">search the site</Link>, or call us at{' '}
            <a href={tel(MAIN_PHONE)}>{MAIN_PHONE}</a>.
          </p>
        </div>
      </section>
      <section className="section">
        <div className="wrap grid">
          {LINKS.map(([href, title, text]) => (
            <Link key={href} href={href} className="card">
              <h2 className="h3">{title}</h2>
              <p>{text}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}
