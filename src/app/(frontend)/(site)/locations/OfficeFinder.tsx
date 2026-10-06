'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useMemo, useState } from 'react'

export type OfficeView = {
  slug: string
  name: string
  region: string
  street: string
  city: string
  phone: string | null
  note: string | null
  photo: { url: string; alt: string; width: number; height: number } | null
  lat: number | null
  lng: number | null
  care: { slug: string; tag: string }[]
}

type Props = { offices: OfficeView[]; cares: { slug: string; tag: string }[]; initialQuery?: string; initialCare?: string }

// Design groups: San Francisco · Peninsula, South Bay & North Bay · East Bay
const GROUPS: [string, string[]][] = [
  ['San Francisco', ['San Francisco']],
  ['Peninsula, South Bay & North Bay', ['Peninsula', 'South Bay', 'North Bay']],
  ['East Bay', ['East Bay']],
]

// Approximate centres of Bay Area ZIP prefixes, so a ZIP code can be matched to the nearest office without an external geocoder.
const ZIP3: Record<string, [number, number]> = {
  '940': [37.55, -122.3], '941': [37.77, -122.43], '943': [37.44, -122.14], '944': [37.55, -122.31], '945': [37.93, -122.04],
  '946': [37.8, -122.25], '947': [37.87, -122.27], '948': [37.94, -122.35], '949': [38.0, -122.54], '950': [37.32, -121.95],
  '951': [37.34, -121.89], '954': [38.4, -122.68],
}

const MAP = { minLat: 37.3, maxLat: 38.36, minLng: -122.72, maxLng: -121.62 }
// Labels drawn to the left of the pin, where a right-hand label would run into a neighbour.
const LABEL_LEFT = new Set(['Pleasant Hill'])
const LABEL_BELOW = new Set(['Walnut Creek'])

function km(a: [number, number], b: [number, number]) {
  const r = Math.PI / 180
  const dLat = (b[0] - a[0]) * r
  const dLng = (b[1] - a[1]) * r
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a[0] * r) * Math.cos(b[0] * r) * Math.sin(dLng / 2) ** 2
  return 12742 * Math.asin(Math.sqrt(h))
}

const cityOf = (o: OfficeView) => o.city.split(',')[0]

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
      setStatus(at ? '' : `We couldn’t place ZIP ${zip}. Try a city name, or call (415) 362-5443.`)
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

  // One map pin per city, so San Francisco's offices share a pin.
  const pins = useMemo(() => {
    const byCity = new Map<string, OfficeView[]>()
    for (const o of visible) if (o.lat != null) byCity.set(cityOf(o), [...(byCity.get(cityOf(o)) || []), o])
    return [...byCity.entries()].map(([city, list]) => {
      const lat = list.reduce((s, o) => s + o.lat!, 0) / list.length
      const lng = list.reduce((s, o) => s + o.lng!, 0) / list.length
      return {
        city,
        count: list.length,
        slug: list[0].slug,
        x: ((lng - MAP.minLng) / (MAP.maxLng - MAP.minLng)) * 100,
        y: ((MAP.maxLat - lat) / (MAP.maxLat - MAP.minLat)) * 100,
      }
    })
  }, [visible])

  const card = (o: OfficeView, distance?: number) => (
    <article key={o.slug} id={o.slug} className={`loc-card${o.photo ? ' with-photo' : ''}`}>
      {o.photo ? (
        <div className="loc-photo-box">
          <Image src={o.photo.url} alt={o.photo.alt} fill sizes="(max-width: 680px) 100vw, 320px" style={{ objectFit: 'cover' }} />
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
              Twelve offices, <em>close to home.</em>
            </h1>
            <p className="lede">From Sonoma to Sunnyvale. Every office is open Monday to Friday, 8am to 5pm.</p>
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
              <div className="chips" role="group" aria-label="Filter by care">
                {[{ slug: '', tag: 'All care' }, ...cares].map((c) => (
                  <button key={c.slug || 'all'} type="button" className="pill" aria-pressed={care === c.slug} onClick={() => setCare(c.slug)}>
                    {c.tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="loc-map" role="img" aria-label="Map of SH Medical offices across the San Francisco Bay Area">
            {pins.map((p) => (
              <a key={p.city} className={`pin${LABEL_BELOW.has(p.city) ? ' pin--below' : p.x > 72 || LABEL_LEFT.has(p.city) ? ' pin--left' : ''}`} href={`#${p.slug}`} style={{ left: `${p.x}%`, top: `${p.y}%` }}>
                <i />
                <span>
                  {p.city}
                  {p.count > 1 ? ` · ${p.count}` : ''}
                </span>
              </a>
            ))}
            <span className="map-note">Schematic map · select a pin to jump to the office</span>
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
