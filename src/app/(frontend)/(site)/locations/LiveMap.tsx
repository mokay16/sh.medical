'use client'

import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { OfficeView } from './OfficeFinder'

const BAY_AREA: L.LatLngBoundsExpression = [
  [37.3, -122.72],
  [38.36, -121.62],
]

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)

const pinIcon = L.divIcon({ className: 'live-pin', html: '<i></i>', iconSize: [20, 20], iconAnchor: [10, 10], popupAnchor: [0, -12] })
const youIcon = L.divIcon({ className: 'live-pin live-pin--you', html: '<i></i>', iconSize: [20, 20], iconAnchor: [10, 10] })

/** A live street map (OpenStreetMap) with a pin for each office shown in the list. */
export default function LiveMap({ offices, origin }: { offices: OfficeView[]; origin: { at: [number, number]; label: string } | null }) {
  const box = useRef<HTMLDivElement>(null)
  const map = useRef<L.Map | null>(null)
  const layer = useRef<L.LayerGroup | null>(null)

  useEffect(() => {
    if (!box.current || map.current) return
    map.current = L.map(box.current, {
      scrollWheelZoom: false, // the page keeps scrolling; zoom with the buttons, a pinch or a double-click
      dragging: !L.Browser.mobile, // on phones one finger scrolls the page, two fingers move the map
      zoomSnap: 0.5,
    }).fitBounds(BAY_AREA)
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map.current)
    layer.current = L.layerGroup().addTo(map.current)
    return () => {
      map.current?.remove()
      map.current = null
    }
  }, [])

  useEffect(() => {
    const m = map.current
    const g = layer.current
    if (!m || !g) return
    g.clearLayers()
    const points: L.LatLngTuple[] = []
    for (const o of offices) {
      if (o.lat == null || o.lng == null) continue
      const at: L.LatLngTuple = [o.lat, o.lng]
      points.push(at)
      const directions = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${o.street}, ${o.city}`)}`
      L.marker(at, { icon: pinIcon, title: o.name, alt: `${o.name} office`, keyboard: true })
        .bindPopup(
          `<strong>${esc(o.name)}</strong><br>${esc(o.street)}<br>${esc(o.city)}` +
            (o.phone ? `<br><a href="tel:${o.phone.replace(/\D/g, '')}">${esc(o.phone)}</a>` : '') +
            `<div class="live-pop-acts"><a href="${directions}" target="_blank" rel="noopener noreferrer">Directions</a><a href="#${esc(o.slug)}">Office details</a></div>`,
        )
        .addTo(g)
    }
    if (origin) {
      L.marker(origin.at, { icon: youIcon, title: origin.label, keyboard: false }).addTo(g)
      points.push(origin.at)
    }
    if (points.length > 1) m.fitBounds(L.latLngBounds(points), { padding: [40, 40], maxZoom: 13 })
    else if (points.length === 1) m.setView(points[0], 14)
    else m.fitBounds(BAY_AREA)
  }, [offices, origin])

  return <div ref={box} className="live-map" role="region" aria-label="Map of SH Medical offices. The office list below has the same information." />
}
