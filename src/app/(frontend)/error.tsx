'use client'

import { MAIN_PHONE } from '@/lib/phone'

/** Shown if a page fails to load; lets the visitor retry without losing the site. */
export default function PageError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main id="main" className="page-heading" style={{ minHeight: '70vh' }}>
      <div className="wrap">
        <p className="eyebrow">Something went wrong</p>
        <h1 className="h1">This page didn’t load.</h1>
        <p className="lede">
          Please try again. If you need care now, call us at <a href={`tel:${MAIN_PHONE.replace(/\D/g, '')}`}>{MAIN_PHONE}</a>. In an emergency, call 911.
        </p>
        <div className="btn-row" style={{ marginTop: 24 }}>
          <button className="btn btn--teal" type="button" onClick={reset}>
            Try again
          </button>
          {/* A full page load, so the site starts fresh after an error. */}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a className="btn btn--outline" href="/">
            Go to the home page
          </a>
        </div>
      </div>
    </main>
  )
}
