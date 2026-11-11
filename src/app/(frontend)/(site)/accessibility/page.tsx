import type { Metadata } from 'next'
import { MAIN_PHONE, tel } from '@/lib/content'

export const metadata: Metadata = {
  title: 'Accessibility',
  description: 'How SH Medical makes this website usable for everyone, and how to get help or report a problem.',
}

export default function Accessibility() {
  return (
    <>
      <section className="page-heading">
        <div className="wrap">
          <p className="eyebrow">Accessibility</p>
          <h1 className="h1">Accessibility</h1>
          <p className="lede">We want everyone to be able to use this website, whatever device or assistive technology they use.</p>
        </div>
      </section>
      <section className="section">
        <div className="wrap prose">
          <h2>Our aim</h2>
          <p>We aim to meet the Web Content Accessibility Guidelines (WCAG) 2.1 at level AA, and we keep improving the site toward that goal.</p>

          <h2>What we’ve done</h2>
          <ul>
            <li>Every page can be used with a keyboard, and starts with a “Skip to content” link.</li>
            <li>Photos have text descriptions, and form fields have labels.</li>
            <li>Pages reflow on phones and when text is enlarged, without scrolling sideways.</li>
            <li>Animations are reduced when your device asks for less motion.</li>
          </ul>

          <h2>Need help, or found a problem?</h2>
          <p>
            If something on this site is hard to use, or you need information in another format, call us at <a href={tel(MAIN_PHONE)}>{MAIN_PHONE}</a>,
            Monday to Friday, 8am to 5pm. Tell us the page and what happened, and we’ll help you directly and fix the problem.
          </p>

          <h2>Visiting our offices</h2>
          <p>If you need an accommodation for a visit, such as an interpreter or help with access, please tell us when you book.</p>
        </div>
      </section>
    </>
  )
}
