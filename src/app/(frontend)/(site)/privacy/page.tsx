import type { Metadata } from 'next'
import Link from 'next/link'
import { MAIN_PHONE, tel } from '@/lib/content'

export const metadata: Metadata = {
  title: 'Website privacy',
  description: 'What the SH Medical website collects, what it doesn’t, and where to find our Notice of Privacy Practices.',
}

/** Describes what this website itself does. Health information is covered by the Notice of Privacy Practices. */
export default function Privacy() {
  return (
    <>
      <section className="page-heading">
        <div className="wrap">
          <p className="eyebrow">Privacy</p>
          <h1 className="h1">Website privacy</h1>
          <p className="lede">What this website collects, what it doesn’t, and how your health information is protected.</p>
        </div>
      </section>
      <section className="section">
        <div className="wrap prose">
          <h2>Your health information</h2>
          <p>
            How SH Medical uses and protects your medical information is set out in our{' '}
            <a href="/forms/notice-of-privacy-practices.pdf">Notice of Privacy Practices (PDF)</a>. That notice, not this page, governs your health records.
          </p>

          <h2>What this website collects</h2>
          <ul>
            <li>
              <strong>Reviews.</strong> If you send a review, we keep your first name, the review, your star rating and, if you give them, your city and
              email address. Your email is used only to follow up with you and is never shown on the site. Reviews appear only after our team has checked
              them.
            </li>
            <li>
              <strong>Server logs.</strong> Like most websites, our hosting provider records technical details of each visit, such as IP address, browser
              type and the page requested, to keep the site running and secure.
            </li>
          </ul>

          <h2>What it doesn’t collect</h2>
          <ul>
            <li>This website doesn’t use advertising or tracking cookies, and it doesn’t run analytics that follow you across sites.</li>
            <li>We don’t sell or share visitor information for marketing.</li>
          </ul>

          <h2>Please don’t send medical details here</h2>
          <p>
            Don’t include private medical information in a review. To message your care team securely, use <Link href="/patients">MyChart</Link> or call
            your office.
          </p>

          <h2>Other services</h2>
          <p>
            Links to MyChart, maps and social media take you to services run by other organizations, which have their own privacy policies. Icons on this
            site load from Google Fonts.
          </p>

          <h2>Questions</h2>
          <p>
            Call us at <a href={tel(MAIN_PHONE)}>{MAIN_PHONE}</a>, Monday to Friday, 8am to 5pm.
          </p>
        </div>
      </section>
    </>
  )
}
