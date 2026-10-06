import Image from 'next/image'
import Link from 'next/link'
import type { Department } from '@/payload-types'
import { MYCHART_URL, docs, media, sitePages, tel } from '@/lib/content'
import type { Office } from '@/payload-types'
import { NavLinks } from './NavLinks'

/** The department's logo, or a placeholder in the style of the SH department logos. */
export function DeptBadge({ d, size }: { d: Department; size: number }) {
  const logo = media(d.logo)
  if (logo?.url) return <Image src={logo.url} alt="" width={size} height={size} style={{ flexShrink: 0 }} />
  return (
    <span className="badge-placeholder" style={{ width: size, height: size }} title="Logo to come" aria-hidden="true">
      <i />
      <i />
      <span style={{ fontSize: Math.round(size * 0.34) }}>SH</span>
    </span>
  )
}

export function DeptHeader({ d }: { d: Department }) {
  const pages = sitePages(d)
  return (
    <>
      <div className="dept-bar">
        <div className="wrap">
          <div className="utility-group" style={{ gap: '6px 22px' }}>
            <Link className="home-link" href="/">
              <Image src="/brand/sh-medical-logo.png" alt="" width={26} height={26} />
              Part of SH Medical
            </Link>
            <Link className="secondary" href="/care">All care</Link>
            <Link className="secondary" href="/specialists">Find a specialist</Link>
            <Link className="secondary" href="/locations">All locations</Link>
          </div>
          <div className="utility-group" style={{ gap: '6px 22px' }}>
            <span>
              {d.phoneLabel}{' '}
              <strong>
                <a href={tel(d.phone)}>{d.phone}</a>
              </strong>
            </span>
            <a className="secondary" href={MYCHART_URL}>Patient portal (MyChart)</a>
          </div>
        </div>
      </div>
      <header className="dept-header">
        <div className="wrap">
          <Link className="dept-brand" href={`/care/${d.slug}`} aria-label={`${d.brand} home`}>
            <DeptBadge d={d} size={64} />
            <span>
              <span className="name">{d.shortBrand}</span>
              <span className="sub">{d.name}</span>
            </span>
          </Link>
          <NavLinks
            label={d.brand}
            className="dept-nav"
            items={pages.map((p) => ({ href: p.href, label: p.label, exact: p.key === 'home' }))}
          />
          <Link className="btn btn--clay" href={`/book?care=${d.slug}`}>
            Book a visit
          </Link>
        </div>
      </header>
    </>
  )
}

export function DeptFooter({ d }: { d: Department }) {
  const pages = sitePages(d)
  const first = docs<Office>(d.offices)[0]
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-top">
          <div className="stack" style={{ width: 360 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <DeptBadge d={d} size={80} />
              <div className="serif" style={{ fontSize: 24, lineHeight: 1.15 }}>
                {d.brand}
              </div>
            </div>
            {first ? (
              <address style={{ fontStyle: 'normal', fontSize: 15, color: 'var(--on-dark)' }}>
                {first.street}
                <br />
                {first.city}
              </address>
            ) : null}
            <a href={tel(d.phone)} style={{ fontSize: 18, fontWeight: 600, color: '#fff' }}>
              {d.phone}
            </a>
          </div>
          <div className="footer-cols">
            <div className="footer-col">
              <p className="eyebrow">{d.name}</p>
              {pages.map((p) => (
                <Link key={p.href} href={p.href}>
                  {p.label}
                </Link>
              ))}
            </div>
            <div className="footer-col">
              <p className="eyebrow">SH Medical</p>
              <Link href="/">SH Medical home</Link>
              <Link href="/care">All care</Link>
              <Link href="/specialists">Find a specialist</Link>
              <Link href="/locations">All locations</Link>
              <Link href="/about">Our story</Link>
            </div>
            <div className="footer-col">
              <p className="eyebrow">Patients</p>
              <Link href={`/book?care=${d.slug}`}>Book an appointment</Link>
              <a href={MYCHART_URL}>MyChart</a>
              <Link href="/patients#records">Medical records</Link>
              <Link href="/patients#insurance">Insurance</Link>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Image src="/brand/sh-medical-logo-white.png" alt="SH Medical" width={36} height={36} />
            {d.brand} is part of SH Medical. If this is a medical emergency, call 911.
          </div>
          <div>Privacy · Non-discrimination · Accessibility</div>
        </div>
      </div>
    </footer>
  )
}
