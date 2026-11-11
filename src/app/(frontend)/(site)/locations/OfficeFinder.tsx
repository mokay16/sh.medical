'use client'

import Image from 'next/image'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useMemo, useState } from 'react'
import { MAIN_PHONE } from '@/lib/phone'

export type OfficeView = {
  slug: string
  name: string
  region: string
  street: string
  city: string
  phone: string | null
  fax: string | null
  parking: string | null
  note: string | null
  photo: { url: string; alt: string; width: number; height: number } | null
  lat: number | null
  lng: number | null
  care: { slug: string; tag: string }[]
}

type Props = { offices: OfficeView[]; cares: { slug: string; tag: string }[]; initialQuery?: string; initialCare?: string }

// Groups: San Francisco · Peninsula & North Bay · East Bay
const GROUPS: [string, string[]][] = [
  ['San Francisco', ['San Francisco']],
  ['Peninsula & North Bay', ['Peninsula', 'North Bay']],
  ['East Bay', ['East Bay']],
]

// Approximate centres of Bay Area ZIP prefixes, so a ZIP code can be matched to the nearest office without an external geocoder.
const ZIP3: Record<string, [number, number]> = {
  '940': [37.55, -122.3], '941': [37.77, -122.43], '943': [37.44, -122.14], '944': [37.55, -122.31], '945': [37.93, -122.04],
  '946': [37.8, -122.25], '947': [37.87, -122.27], '948': [37.94, -122.35], '949': [38.0, -122.54], '950': [37.32, -121.95],
  '951': [37.34, -121.89], '954': [38.4, -122.68],
}


function km(a: [number, number], b: [number, number]) {
  const r = Math.PI / 180
  const dLat = (b[0] - a[0]) * r
  const dLng = (b[1] - a[1]) * r
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a[0] * r) * Math.cos(b[0] * r) * Math.sin(dLng / 2) ** 2
  return 12742 * Math.asin(Math.sqrt(h))
}


// The map needs the browser, so it loads after the page; the office list works without it.
const LiveMap = dynamic(() => import('./LiveMap'), { ssr: false, loading: () => <div className="live-map live-map--loading">Loading map…</div> })

export function OfficeFinder({ offices, cares, initialQuery = '', initialCare = '' }: Props) {
  const [query, setQuery] = useState(initialQuery)
  const [submitted, setSubmitted] = useState(initialQuery)
  const [care, setCare] = useState(initialCare)
  const [origin, setOrigin] = useState<{ at: [number, number]; label: string } | null>(() => {
    const zip = initialQuery.trim().match(/^\d{5}$/)?.[0]
    return zip && ZIP3[zip.slice(0, 3)] ? { at: ZIP3[zip.slice(0, 3)], label: `ZIP ${zip}` } : null
  })
  const [status, setStatus] = useState('')

  const search = (q: string) => {
    setSubmitted(q)
    const zip = q.trim().match(/^\d{5}$/)?.[0]
    if (zip) {
      const at = ZIP3[zip.slice(0, 3)]
      setOrigin(at ? { at, label: `ZIP ${zip}` } : null)
      setStatus(at ? '' : `We couldn’t place ZIP ${zip}. Try a city name, or call ${MAIN_PHONE}.`)
    } else {
      setOrigin(null)
      setStatus('')
    }
  }

  const locate = () => {
    if (!navigator.geolocation) return setStatus('Your browser can’t share your location.')
    setStatus('Finding your location…')
    navigator.geolocation.getCurrentPosition(
      (p) => {
        setOrigin({ at: [p.coords.latitude, p.coords.longitude], label: 'your location' })
        setSubmitted('')
        setQuery('')
        setStatus('')
      },
      () => setStatus('We couldn’t get your location. Enter a ZIP code or city instead.'),
    )
  }

  const visible = useMemo(() => {
    let list = offices.filter((o) => !care || o.care.some((c) => c.slug === care))
    const q = submitted.trim().toLowerCase()
    if (q && !origin) list = list.filter((o) => [o.name, o.city, o.region, o.street].some((f) => f.toLowerCase().includes(q)))
    return list
  }, [offices, care, submitted, origin])

  const nearest = useMemo(() => {
    if (!origin) return null
    return visible
      .filter((o) => o.lat != null && o.lng != null)
      .map((o) => ({ o, d: km(origin.at, [o.lat!, o.lng!]) }))
      .sort((a, b) => a.d - b.d)
  }, [visible, origin])


  const card = (o: OfficeView, distance?: number) => (
    <article key={o.slug} id={o.slug} className={`loc-card${o.photo ? ' with-photo' : ''}`}>
      {o.photo ? (
        <div className="loc-photo-box">
          <Image src={o.photo.url} alt={o.photo.alt} fill sizes="(max-width: 680px) 100vw, (max-width: 1080px) 50vw, 420px" style={{ objectFit: 'cover' }} />
        </div>
      ) : null}
      <div className="stack" style={{ gap: 10 }}>
        <h3 className="serif">{o.name}</h3>
        <address>
          {o.street}
          <br />
          {o.city}
        </address>
        {distance != null ? <span className="meta meta--teal">About {Math.round(distance * 0.621)} miles away</span> : null}
        {o.note ? <span className="meta">{o.note}</span> : null}
        {o.parking ? <span className="meta">{o.parking}</span> : null}
        {o.fax ? <span className="meta">Fax {o.fax}</span> : null}
        <div className="care-tags">
          {o.care.length ? o.care.map((c) => <span key={c.slug}>{c.tag}</span>) : <span className="tbc">Care offered: to confirm</span>}
        </div>
        <div className="acts">
          <a href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${o.street}, ${o.city}`)}`}>Directions</a>
          {o.phone ? <a href={`tel:${o.phone.replace(/\D/g, '')}`}>Call {o.phone}</a> : null}
          <Link className="book-here" href={`/book${o.care[0] ? `?care=${o.care[0].slug}` : ''}`}>
            Book here
          </Link>
        </div>
      </div>
    </article>
  )

  return (
    <>
      <section className="section loc-hero" style={{ paddingBottom: 0 }}>
        <div className="wrap loc-hero-grid">
          <div className="stack" style={{ gap: 24 }}>
            <p className="eyebrow">Locations</p>
            <h1 className="h1">
              Nine offices, <em>close to home.</em>
            </h1>
            <p className="lede">From Sonoma to San Mateo. Every office is open Monday to Friday, 8am to 5pm.</p>
            <form
              className="stack"
              style={{ gap: 10 }}
              onSubmit={(e) => {
                e.preventDefault()
                search(query)
              }}
            >
              <label htmlFor="loc-q" style={{ fontSize: 14, fontWeight: 600 }}>
                Find the office nearest you
              </label>
              <div className="loc-search">
                <input id="loc-q" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="ZIP code or city" style={{ background: 'var(--white)', boxShadow: 'inset 0 0 0 1.5px var(--field)' }} />
                <button className="btn btn--teal" type="submit">
                  Search
                </button>
              </div>
              <button type="button" className="link-button" onClick={locate}>
                <span className="ms ms--sm" aria-hidden="true" style={{ fontSize: 18 }}>
                  my_location
                </span>
                Use my location
              </button>
              <p role="status" className="meta" style={{ margin: 0, minHeight: 21 }}>
                {status}
              </p>
            </form>
            <div className="stack" style={{ gap: 10 }}>
              <span style={{ fontSize: 14, fontWeight: 600 }}>Filter by care</span>
              <div className="chips care-filter" role="group" aria-label="Filter by care">
                {[{ slug: '', tag: 'All care' }, ...cares].map((c) => (
                  <button key={c.slug || 'all'} type="button" className="pill" aria-pressed={care === c.slug} onClick={() => setCare(c.slug)}>
                    {c.tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="loc-map">
            <LiveMap offices={visible} origin={origin} />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap stack" style={{ gap: 56 }}>
          {nearest ? (
            <div className="stack" style={{ gap: 24 }}>
              <div className="region-head">
                <h2 className="serif">Closest to {origin!.label}</h2>
                <span>{nearest.length} offices</span>
              </div>
              <div className="loc-grid">{nearest.map(({ o, d }) => card(o, d))}</div>
            </div>
          ) : (
            GROUPS.map(([label, regions]) => {
              const list = visible.filter((o) => regions.includes(o.region))
              if (!list.length) return null
              return (
                <div key={label} className="stack" style={{ gap: 24 }}>
                  <div className="region-head">
                    <h2 className="serif">{label}</h2>
                    <span>
                      {list.length} office{list.length === 1 ? '' : 's'}
                    </span>
                  </div>
                  <div className="loc-grid">{list.map((o) => card(o))}</div>
                </div>
              )
            })
          )}
          {!visible.length ? (
            <p className="lede">
              No offices match. <button type="button" className="link-button" onClick={() => { setCare(''); setSubmitted(''); setQuery(''); setOrigin(null) }}>Show all offices</button>
            </p>
          ) : null}
        </div>
      </section>
    </>
  )
}
