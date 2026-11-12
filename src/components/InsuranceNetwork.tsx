'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useId, useMemo, useState } from 'react'
import { BILLING_PHONE, INSURERS, KINDS, NOT_ACCEPTED, type Insurer, type InsuranceKind } from '@/lib/insurance'

const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, ' ').trim()
const tel = (p: string) => `tel:${p.replace(/\D/g, '')}`
const matches = (i: Insurer, q: string) => [i.name, ...(i.aliases || [])].some((n) => norm(n).includes(q) || q.includes(norm(n)))

/** Patients page: filter, search and open each in-network plan. `?plan=<slug>` opens one on arrival. */
export function InsuranceExplorer() {
  const [kind, setKind] = useState<InsuranceKind | 'all'>('all')
  const [q, setQ] = useState('')
  const [open, setOpen] = useState<string | null>(null)
  const panelId = useId()

  // Arriving from a logo on the home page (/patients?plan=aetna#insurance)
  useEffect(() => {
    const plan = new URLSearchParams(window.location.search).get('plan')
    if (plan && INSURERS.some((i) => i.slug === plan)) setOpen(plan) // eslint-disable-line react-hooks/set-state-in-effect -- read once from the URL after hydration
  }, [])

  const query = norm(q)
  const refused = query.length > 2 ? NOT_ACCEPTED.find((n) => n.match.some((m) => query.includes(m))) : undefined
  const shown = useMemo(
    () => INSURERS.filter((i) => (kind === 'all' || i.kind === kind) && (!query || matches(i, query))),
    [kind, query],
  )
  const withLogo = shown.filter((i) => i.logo)
  const textOnly = shown.filter((i) => !i.logo)
  const current = INSURERS.find((i) => i.slug === open)

  return (
    <div className="ins">
      <div className="ins-bar">
        <div className="chips ins-kinds" role="group" aria-label="Show">
          {KINDS.map((k) => (
            <button key={k.id} type="button" className="chip" aria-pressed={kind === k.id} onClick={() => setKind(k.id)}>
              {k.label}
            </button>
          ))}
        </div>
        <label className="ins-search">
          <span className="visually-hidden">Check your plan</span>
          <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20">
            <path fill="currentColor" d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16a6.47 6.47 0 0 0 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5Zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14Z" />
          </svg>
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Check your plan, e.g. Aetna or AARP" autoComplete="off" />
        </label>
      </div>

      <p className="ins-status" role="status" aria-live="polite">
        {refused ? (
          <span className="ins-no">{refused.text}</span>
        ) : query && !shown.length ? (
          <>
            We couldn’t find “{q.trim()}”. You may still be covered: call billing at <a href={tel(BILLING_PHONE)}>{BILLING_PHONE}</a> to check.
          </>
        ) : query ? (
          <>
            <span className="ins-yes">In network</span> {shown.length === 1 ? shown[0].name : `${shown.length} matching plans`}. Select a plan for details.
          </>
        ) : (
          <>Select a plan to see what we accept.</>
        )}
      </p>

      {withLogo.length ? (
        <ul className="ins-grid">
          {withLogo.map((i) => (
            <li key={i.slug}>
              <button
                type="button"
                className="ins-tile"
                aria-expanded={open === i.slug}
                aria-controls={panelId}
                onClick={() => setOpen(open === i.slug ? null : i.slug)}
              >
                <Image src={i.logo!.src} alt={i.name} width={i.logo!.width} height={i.logo!.height} unoptimized />
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      {textOnly.length ? (
        <div className="ins-more">
          <span className="muted">Also accepted:</span>
          {textOnly.map((i) => (
            <button key={i.slug} type="button" className="chip" aria-expanded={open === i.slug} aria-controls={panelId} onClick={() => setOpen(open === i.slug ? null : i.slug)}>
              {i.name}
            </button>
          ))}
        </div>
      ) : null}

      <div id={panelId} className="ins-panel" hidden={!current}>
        {current ? (
          <>
            <div>
              <p className="eyebrow" style={{ margin: 0 }}>
                {KINDS.find((k) => k.id === current.kind)?.label}
              </p>
              <h3 className="h3" style={{ fontSize: 26, margin: '6px 0 0' }}>
                {current.name}
              </h3>
            </div>
            <ul className="ins-details">
              {current.details.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
            <div className="btn-row">
              <Link className="btn btn--teal" href="/book">
                Book an appointment
              </Link>
              <a className="btn btn--outline" href={tel(BILLING_PHONE)}>
                Billing {BILLING_PHONE}
              </a>
            </div>
          </>
        ) : null}
      </div>
    </div>
  )
}

/** Home page: a slow, endless row of logos; pauses on hover or focus. Each logo opens that plan on the Patients page. */
export function InsuranceMarquee() {
  const logos = INSURERS.filter((i) => i.logo)
  const row = (hidden: boolean) => (
    <ul className="ins-track" aria-hidden={hidden || undefined}>
      {logos.map((i) => (
        <li key={i.slug}>
          <Link href={`/patients?plan=${i.slug}#insurance`} tabIndex={hidden ? -1 : undefined} className="ins-logo">
            <Image src={i.logo!.src} alt={hidden ? '' : `${i.name}: in network`} width={i.logo!.width} height={i.logo!.height} unoptimized />
          </Link>
        </li>
      ))}
    </ul>
  )
  return (
    <div className="ins-marquee">
      {row(false)}
      {row(true)}
    </div>
  )
}
