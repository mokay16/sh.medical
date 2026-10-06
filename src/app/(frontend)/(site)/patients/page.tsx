import type { Metadata } from 'next'
import Link from 'next/link'
import { Checks, CtaBand } from '@/components/sections'
import { Icon } from '@/components/ui'
import { MYCHART_URL, getDepartment } from '@/lib/content'

export const metadata: Metadata = { title: 'Patients' }

const BRING = [
  'Your insurance card',
  'A list of all the medicines you take',
  'A list of your questions or concerns',
  'Copies of X-rays or CT scans (the actual images on CD, not just the reports)',
  'Records from other doctors related to your visit',
]

const FORMS: [string, string, string][] = [
  ['Release of records from SH Medical', 'Authorize us to send your records to another provider.', '/forms/medical-records-release-from-sh.pdf'],
  ['Request records be sent to SH Medical', 'Ask another provider to send your records to us.', '/forms/medical-records-release-to-sh.pdf'],
  ['Notice of Privacy Practices', 'How we use and protect your health information.', '/forms/notice-of-privacy-practices.pdf'],
]

export default async function Patients() {
  // Insurance details come from the ENT department, whose billing page lists the plans for the group.
  const ent = await getDepartment('ent')
  const plans = (ent?.feature?.bullets || []).map((b) => b.text)

  return (
    <>
      <section className="page-heading">
        <div className="wrap">
          <p className="eyebrow">Patients</p>
          <h1 className="h1">Everything you need, before and after your visit.</h1>
          <p className="lede">New patient information, insurance, forms and records, video visits and the patient portal.</p>
          <nav aria-label="On this page" className="chips">
            {[
              ['#new', 'New patients'],
              ['#insurance', 'Insurance'],
              ['#records', 'Forms & records'],
              ['#video', 'Video visits'],
              ['#portal', 'Patient portal'],
            ].map(([href, label]) => (
              <a key={href} className="chip" href={href} style={{ color: 'var(--ink)', textDecoration: 'none' }}>
                {label}
              </a>
            ))}
          </nav>
        </div>
      </section>

      <section id="new" className="section">
        <div className="wrap overview">
          <div className="stack">
            <p className="eyebrow">New patients</p>
            <h2 className="h2">Your first visit</h2>
            <p className="lede">
              Please complete your registration and health history forms before you arrive; your department will send them when you book. Arrive a
              few minutes early, and if you need to cancel, let us know at least 24 hours ahead.
            </p>
            <p className="lede">Patients under 18 must come with a parent or legal guardian to their first visit.</p>
          </div>
          <aside className="glance">
            <h3 className="h3" style={{ fontSize: 26 }}>
              What to bring
            </h3>
            <Checks items={BRING} />
          </aside>
        </div>
      </section>

      <section id="insurance" className="section section--paper">
        <div className="wrap overview">
          <div className="stack">
            <p className="eyebrow">Insurance and billing</p>
            <h2 className="h2">Plans we accept</h2>
            {ent?.feature?.paras?.map((p) => (
              <p key={p.id} className="lede">
                {p.text}
              </p>
            ))}
            <p className="lede">We don’t participate with Medi-Cal or its managed care plans. Your department’s page lists any differences for its services.</p>
          </div>
          <aside className="glance" style={{ background: 'var(--white)' }}>
            <h3 className="h3" style={{ fontSize: 26 }}>
              Participating plans
            </h3>
            <Checks items={plans} />
          </aside>
        </div>
      </section>

      <section id="records" className="section">
        <div className="wrap">
          <div className="section-head">
            <div>
              <p className="eyebrow">Forms and records</p>
              <h2 className="h2">Download a form</h2>
            </div>
          </div>
          <div className="grid">
            {FORMS.map(([t, d, href]) => (
              <a key={href} href={href} className="resource">
                <Icon name="description" size={28} />
                <strong>{t}</strong>
                <span>{d} PDF.</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section id="video" className="section section--mist">
        <div className="wrap overview">
          <div className="stack">
            <p className="eyebrow" style={{ color: 'var(--teal)' }}>
              Video visits
            </p>
            <h2 className="h2">See your specialist from home</h2>
            <p className="lede">
              Many visits can happen by video on your phone, tablet or computer, when no physical exam or testing is needed. Your care team will tell
              you if a video visit suits your appointment and send you a link and any forms beforehand.
            </p>
          </div>
          <aside className="glance" style={{ background: 'var(--white)' }}>
            <h3 className="h3" style={{ fontSize: 26 }}>
              What you’ll need
            </h3>
            <Checks items={['A phone, tablet or laptop with a camera and microphone', 'A reliable internet connection', 'A quiet room']} />
          </aside>
        </div>
      </section>

      <section id="portal" className="section">
        <div className="wrap overview" style={{ alignItems: 'center' }}>
          <div className="stack">
            <p className="eyebrow">Patient portal</p>
            <h2 className="h2">Messages, results and appointments in MyChart</h2>
            <p className="lede">SH Medical uses UCSF MyChart. Sign in to message your care team, see test results and manage appointments.</p>
          </div>
          <div className="btn-row">
            <a className="btn btn--teal" href={MYCHART_URL}>
              Sign in to MyChart
            </a>
            <Link className="btn btn--outline" href="/care">
              Find your department
            </Link>
          </div>
        </div>
      </section>

      <CtaBand
        heading="Ready when *you* are."
        text="Request an appointment online, or call us Monday to Friday, 8am to 5pm."
        primary={{ label: 'Book an appointment', href: '/book' }}
        secondary={{ label: 'Call (415) 362-5443', href: 'tel:4153625443' }}
      />
    </>
  )
}
