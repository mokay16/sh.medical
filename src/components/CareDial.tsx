'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

export type CareStop = { key: string; label: string; short: string; count: number; href: string }

/**
 * A slider for picking the kind of care: drag the knob along the track (or click a stop, or use the arrow keys);
 * it snaps to each option and the page updates when you let go.
 */
export function CareDial({ stops, current }: { stops: CareStop[]; current: string }) {
  const router = useRouter()
  const track = useRef<HTMLDivElement>(null)
  const start = Math.max(0, stops.findIndex((s) => s.key === current))
  const [index, setIndex] = useState(start)
  const [dragging, setDragging] = useState(false)
  const committed = useRef(start)

  // Follow the page when the filter changes some other way (the form, the back button)
  useEffect(() => {
    setIndex(start) // eslint-disable-line react-hooks/set-state-in-effect -- keep the knob in step with the URL
    committed.current = start
  }, [start])

  const last = stops.length - 1
  const pct = (i: number) => (last ? (i / last) * 100 : 0)
  const indexAt = (clientX: number) => {
    const r = track.current!.getBoundingClientRect()
    const x = Math.min(Math.max(clientX - r.left, 0), r.width)
    return Math.round((x / r.width) * last)
  }
  const go = (i: number) => {
    setIndex(i)
    if (i === committed.current) return
    committed.current = i
    router.push(stops[i].href, { scroll: false })
  }

  const onPointerDown = (e: React.PointerEvent) => {
    e.preventDefault()
    track.current!.setPointerCapture(e.pointerId)
    setDragging(true)
    setIndex(indexAt(e.clientX))
  }
  const onPointerMove = (e: React.PointerEvent) => {
    if (dragging) setIndex(indexAt(e.clientX))
  }
  const onPointerUp = (e: React.PointerEvent) => {
    if (!dragging) return
    setDragging(false)
    go(indexAt(e.clientX))
  }
  const onKeyDown = (e: React.KeyboardEvent) => {
    const next =
      e.key === 'ArrowRight' || e.key === 'ArrowUp' ? Math.min(index + 1, last)
      : e.key === 'ArrowLeft' || e.key === 'ArrowDown' ? Math.max(index - 1, 0)
      : e.key === 'Home' ? 0
      : e.key === 'End' ? last
      : null
    if (next === null) return
    e.preventDefault()
    go(next)
  }

  const s = stops[index]
  return (
    <div className="care-dial">
      <div className="care-dial-readout" aria-hidden="true">
        <span className="care-dial-label">{s.label}</span>
        <span className="care-dial-count">
          {s.count} {s.key === 'staff' ? 'staff' : s.count === 1 ? 'person' : 'people'}
        </span>
      </div>
      <div
        ref={track}
        className={`care-dial-track${dragging ? ' is-dragging' : ''}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={() => setDragging(false)}
      >
        <div className="care-dial-fill" style={{ width: `${pct(index)}%` }} />
        {stops.map((st, i) => (
          <span key={st.key} className={`care-dial-tick${i <= index ? ' on' : ''}`} style={{ left: `${pct(i)}%` }} />
        ))}
        <div
          className="care-dial-knob"
          style={{ left: `${pct(index)}%` }}
          role="slider"
          tabIndex={0}
          aria-label="Kind of care"
          aria-valuemin={0}
          aria-valuemax={last}
          aria-valuenow={index}
          aria-valuetext={`${s.label}, ${s.count}`}
          onKeyDown={onKeyDown}
        />
      </div>
      <ol className="care-dial-stops">
        {stops.map((st, i) => (
          <li key={st.key} style={{ left: `${pct(i)}%` }}>
            <button type="button" tabIndex={-1} className={i === index ? 'on' : undefined} onClick={() => go(i)}>
              {st.short}
            </button>
          </li>
        ))}
      </ol>
    </div>
  )
}
