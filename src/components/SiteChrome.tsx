import Image from 'next/image'
import Link from 'next/link'
import { NavLinks } from './NavLinks'
import { StickyHeader } from './StickyHeader'
import { MAIN_PHONE, MYCHART_URL, getDepartments, tel } from '@/lib/content'
import { Icon } from './ui'

export type SocialAccount = { name: 'Facebook' | 'Instagram' | 'X'; href: string }

/** SH Medical's own social accounts. */
export const SH_SOCIAL: SocialAccount[] = [
  { name: 'Facebook', href: 'https://www.facebook.com/people/SH-Medical/61576082266115' },
  { name: 'Instagram', href: 'https://www.instagram.com/sh__medical' },
]

function SocialIcon({ name }: { name: SocialAccount['name'] }) {
  if (name === 'X') {
    return (
      <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">
        <path fill="currentColor" d="M17.8 3h3.1l-6.8 7.8L22 21h-6.2l-4.9-6.4L5.3 21H2.2l7.3-8.3L2 3h6.4l4.4 5.8zm-1.1 16.2h1.7L7.4 4.7H5.6z" />
      </svg>
    )
  }
  if (name === 'Facebook') {
    return (
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
        <path fill="currentColor" d="M13.5 22v-8h2.7l.4-3.2h-3.1V8.8c0-.9.3-1.6 1.6-1.6h1.7V4.4c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.3H7.3V14h2.8v8z" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function SocialLinks({ className, accounts = SH_SOCIAL, owner = 'SH Medical' }: { className?: string; accounts?: SocialAccount[]; owner?: string }) {
  return (
    <nav aria-label={`${owner} on social media`} className={className}>
      {accounts.map((s) => (
        <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={`${owner} on ${s.name} (opens in a new tab)`}>
          <SocialIcon name={s.name} />
        </a>
      ))}
    </nav>
  )
}

export function SiteHeader() {
  return (
    <>
      <div className="utility">
        <div className="wrap">
          <div className="utility-group utility-contact">
            <a className="utility-phone" href={tel(MAIN_PHONE)}>
              <Icon name="call" size={18} />
              <span className="visually-hidden">Call SH Medical: </span>
              {MAIN_PHONE}
            </a>
            <span className="utility-hours">Mon–Fri 8am–5pm</span>
            <span className="utility-divider" aria-hidden="true" />
            <SocialLinks className="utility-social" />
          </div>
          <div className="utility-group utility-links">
            <a href={MYCHART_URL}>
              <span className="utility-long">Patient portal (MyChart)</span>
              <span className="utility-short">MyChart</span>
            </a>
            <Link className="utility-extra" href="/patients#records">
              Medical records
            </Link>
            <Link className="utility-extra" href="/patients#insurance">
              Insurance
            </Link>
          </div>
        </div>
      </div>
      <StickyHeader className="site-header">
        <div className="wrap">
          <Link className="site-logo" href="/" aria-label="SH Medical home">
            <Image src="/brand/sh-medical-logo.png" alt="SH Medical" width={120} height={120} priority />
            <Image className="site-logo-light" src="/brand/sh-medical-logo-white.png" alt="" width={120} height={120} />
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
      </StickyHeader>
    </>
  )
}

export async function SiteFooter() {
  const departments = await getDepartments()
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-top">
          <div className="stack" style={{ width: 320, gap: 16 }}>
            <Image src="/brand/sh-medical-logo-white.png" alt="SH Medical" width={144} height={144} />
            <p className="muted" style={{ color: 'var(--on-dark)', margin: 0, fontSize: 15 }}>
              Comprehensive care for the senses since 1940.
            </p>
            <SocialLinks className="footer-social" />
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
