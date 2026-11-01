import Image from 'next/image'
import Link from 'next/link'
import type { Department } from '@/payload-types'
import { MYCHART_URL, deptOffices, media, sitePages, tel } from '@/lib/content'
import type { Office } from '@/payload-types'
import { NavLinks } from './NavLinks'
import { SH_SOCIAL, SocialLinks, type SocialAccount } from './SiteChrome'
import { Icon } from './ui'

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

/** Departments' own social accounts, from their former websites. Others show SH Medical's. */
const DEPT_SOCIAL: Record<string, SocialAccount[]> = {
  ent: [
    { name: 'Facebook', href: 'https://www.facebook.com/sfotomed' },
    { name: 'Instagram', href: 'https://www.instagram.com/sf_otolaryngology' },
  ],
  allergy: [
    { name: 'Facebook', href: 'https://www.facebook.com/sfallergy' },
    { name: 'Instagram', href: 'https://www.instagram.com/sfallergy' },
  ],
  audiology: [
    { name: 'Facebook', href: 'https://www.facebook.com/sfaudiology' },
    { name: 'X', href: 'https://x.com/sfaudiology' },
  ],
  voice: [
    { name: 'Facebook', href: 'https://www.facebook.com/sfvoiceandswallowing' },
    { name: 'Instagram', href: 'https://www.instagram.com/sfvoiceandswallowing' },
  ],
}

export function DeptHeader({ d }: { d: Department }) {
  const pages = sitePages(d)
  return (
    <>
      <div className="utility utility--dept">
        <div className="wrap">
          <div className="utility-group utility-contact">
            <a className="utility-phone" href={tel(d.phone)}>
              <Icon name="call" size={18} />
              <span className="visually-hidden">Call {d.brand}: </span>
              {d.phone}
            </a>
            <span className="utility-hours">Mon–Fri 8am–5pm</span>
            <span className="utility-divider" aria-hidden="true" />
            <SocialLinks className="utility-social" accounts={DEPT_SOCIAL[d.slug] ?? SH_SOCIAL} owner={DEPT_SOCIAL[d.slug] ? d.brand : 'SH Medical'} />
          </div>
          <div className="utility-group utility-links">
            <a href={MYCHART_URL}>
              <span className="utility-long">Patient portal (MyChart)</span>
              <span className="utility-short">MyChart</span>
            </a>
            <Link className="utility-extra utility-home" href="/">
              <Image src="/brand/sh-medical-logo.png" alt="" width={22} height={22} />
              Part of SH Medical
            </Link>
          </div>
        </div>
      </div>
      <header className={`dept-header dept-header--${d.slug}`}>
        <div className="wrap">
          <Link className="dept-brand" href={`/care/${d.slug}`} aria-label={`${d.brand} home`}>
            <DeptBadge d={d} size={76} />
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
  const first = deptOffices(d)[0]
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
            <div className="footer-contact">
              <a href={tel(d.phone)} className="footer-phone">
                <Icon name="call" size={20} />
                <span className="visually-hidden">Phone: </span>
                {d.phone}
              </a>
              {d.fax ? (
                <p className="footer-fax">
                  <Icon name="fax" size={20} />
                  <span className="visually-hidden">Fax: </span>
                  {d.fax}
                </p>
              ) : null}
            </div>
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
