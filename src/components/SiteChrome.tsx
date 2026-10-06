import Image from 'next/image'
import Link from 'next/link'
import { NavLinks } from './NavLinks'
import { MYCHART_URL, getDepartments } from '@/lib/content'

export function SiteHeader() {
  return (
    <>
      <div className="utility">
        <div className="wrap">
          <div className="utility-group">
            <span>
              ENT &amp; Allergy <a href="tel:4153625443">(415) 362-5443</a>
            </span>
            <span>
              Audiology <a href="tel:4153622901">(415) 362-2901</a>
            </span>
          </div>
          <div className="utility-group utility-links">
            <a href={MYCHART_URL}>Patient portal (MyChart)</a>
            <Link href="/patients#records">Medical records</Link>
            <Link href="/patients#insurance">Insurance</Link>
          </div>
        </div>
      </div>
      <header className="site-header">
        <div className="wrap">
          <Link href="/" aria-label="SH Medical home">
            <Image src="/brand/sh-medical-logo.png" alt="SH Medical" width={72} height={72} priority />
          </Link>
          <NavLinks
            label="Main"
            className="site-nav"
            items={[
              { href: '/care', label: 'Care' },
              { href: '/specialists', label: 'Find a specialist' },
              { href: '/locations', label: 'Locations' },
              { href: '/patients', label: 'Patients' },
              { href: '/about', label: 'About' },
            ]}
          />
          <Link className="btn btn--clay" href="/book">
            Book an appointment
          </Link>
        </div>
      </header>
    </>
  )
}

export async function SiteFooter() {
  const departments = await getDepartments()
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-top">
          <div className="stack" style={{ width: 320, gap: 14 }}>
            <Image src="/brand/sh-medical-logo-white.png" alt="SH Medical" width={112} height={112} />
            <p className="muted" style={{ color: 'var(--on-dark)', margin: 0, fontSize: 15 }}>
              Comprehensive care for the senses since 1940.
            </p>
          </div>
          <div className="footer-cols">
            <div className="footer-col">
              <p className="eyebrow">Care</p>
              {departments.map((d) => (
                <Link key={d.slug} href={`/care/${d.slug}`}>
                  {d.name}
                </Link>
              ))}
            </div>
            <div className="footer-col">
              <p className="eyebrow">Patients</p>
              <Link href="/book">Book an appointment</Link>
              <a href={MYCHART_URL}>MyChart</a>
              <Link href="/patients#insurance">Insurance</Link>
              <Link href="/patients#records">Medical records</Link>
            </div>
            <div className="footer-col">
              <p className="eyebrow">About</p>
              <Link href="/about">Our story</Link>
              <Link href="/specialists">Specialists</Link>
              <Link href="/locations">Locations</Link>
              <a href="tel:4153625443">ENT &amp; Allergy · (415) 362-5443</a>
              <a href="tel:4153622901">Audiology · (415) 362-2901</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <div>© {new Date().getFullYear()} SH Medical. If this is a medical emergency, call 911.</div>
          <div>Privacy · Non-discrimination · Accessibility</div>
        </div>
      </div>
    </footer>
  )
}
