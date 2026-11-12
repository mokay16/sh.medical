'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'

export type CareStop = { key: string; label: string; short: string; count: number; href: string }

/**
 * A control knob for the kind of care: the names sit on a strip that slides left and right under a fixed pointer.
 * Drag or swipe the strip, use the arrows, click a name or press ←/→; it snaps to the name under the pointer.
 */
export function CareDial({ stops, current }: { stops: CareStop[]; current: string }) {
  const router = useRouter()
  const view = useRef<HTMLDivElement>(null)
  const items = useRef<(HTMLButtonElement | null)[]>([])
  const start = Math.max(0, stops.findIndex((s) => s.key === current))
  const [index, setIndex] = useState(start)
  const [drag, setDrag] = useState<{ x0: number; base: number; dx: number; moved: boolean } | null>(null)
  const [centers, setCenters] = useState<number[]>([])
  const [widths, setWidths] = useState<number[]>([])
  const [width, setWidth] = useState(0)
  const committed = useRef(start)
  const last = stops.length - 1

  // Follow the page when the filter changes another way (the form, the back button)
  useEffect(() => {
    setIndex(start) // eslint-disable-line react-hooks/set-state-in-effect -- keep the knob in step with the URL
    committed.current = start
  }, [start])

  // Where each name's centre sits on the strip
  const measure = useCallback(() => {
    setCenters(items.current.map((el) => (el ? el.offsetLeft + el.offsetWidth / 2 : 0)))
    setWidths(items.current.map((el) => el?.offsetWidth || 0))
    setWidth(view.current?.clientWidth || 0)
  }, [])
  useLayoutEffect(() => {
    measure()
    const ro = new ResizeObserver(measure)
    if (view.current) ro.observe(view.current)
    document.fonts?.ready.then(measure)
    return () => ro.disconnect()
  }, [measure])

  const offsetFor = (i: number) => width / 2 - (centers[i] ?? 0)
  const offset = drag ? drag.base + drag.dx : offsetFor(index)
  const nearest = (off: number) => {
    const at = width / 2 - off
    let best = 0
    centers.forEach((c, i) => {
      if (Math.abs(c - at) < Math.abs(centers[best] - at)) best = i
    })
    return best
  }
  const live = drag ? nearest(offset) : index

  const go = (i: number) => {
    const n = Math.min(Math.max(i, 0), last)
    setIndex(n)
    if (n === committed.current) return
    committed.current = n
    router.push(stops[n].href, { scroll: false })
  }

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return
    view.current!.setPointerCapture(e.pointerId)
    setDrag({ x0: e.clientX, base: offsetFor(index), dx: 0, moved: false })
  }
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag) return
    const dx = e.clientX - drag.x0
    setDrag({ ...drag, dx, moved: drag.moved || Math.abs(dx) > 6 })
  }
  const onPointerUp = (e: React.PointerEvent) => {
    if (!drag) return
    const { moved } = drag
    setDrag(null)
    if (moved) {
      go(nearest(drag.base + drag.dx))
      return
    }
    // A tap: pick the name that was tapped
    const hit = items.current.findIndex((el) => el?.contains(document.elementFromPoint(e.clientX, e.clientY)))
    if (hit >= 0) go(hit)
  }
  const onKeyDown = (e: React.KeyboardEvent) => {
    const next =
      e.key === 'ArrowRight' ? index + 1 : e.key === 'ArrowLeft' ? index - 1 : e.key === 'Home' ? 0 : e.key === 'End' ? last : null
    if (next === null) return
    e.preventDefault()
    go(next)
  }

  const s = stops[live]
  return (
    <div className="care-knob">
      <button type="button" className="care-knob-arrow" aria-label="Previous" disabled={index === 0} onClick={() => go(index - 1)}>
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
          <path fill="currentColor" d="M15.4 7.4 14 6l-6 6 6 6 1.4-1.4L10.8 12z" />
        </svg>
      </button>
      <div
        ref={view}
        className={`care-knob-view${drag ? ' is-dragging' : ''}`}
        role="slider"
        tabIndex={0}
        aria-label="Kind of care"
        aria-valuemin={0}
        aria-valuemax={last}
        aria-valuenow={live}
        aria-valuetext={`${s.label}, ${s.count}`}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={() => setDrag(null)}
      >
        <span className="care-knob-pointer" aria-hidden="true" style={widths[live] ? { width: widths[live] } : undefined} />
        <div className="care-knob-strip" style={{ transform: `translateX(${offset}px)` }}>
          {stops.map((st, i) => {
            // Names fade and shrink the further they are from the pointer, like a dial
            const d = centers.length ? Math.abs(centers[i] + offset - width / 2) : 0
            const k = Math.min(d / Math.max(width * 0.55, 1), 1)
            return (
              <button
                key={st.key}
                ref={(el) => {
                  items.current[i] = el
                }}
                type="button"
                tabIndex={-1}
                className={`care-knob-item${i === live && (!drag || d < 18) ? ' on' : ''}`}
                style={{ opacity: 1 - k * 0.75, transform: `scale(${1 - k * 0.22})` }}
              >
                {st.label}
                <span className="count">{st.count}</span>
              </button>
            )
          })}
        </div>
      </div>
      <button type="button" className="care-knob-arrow" aria-label="Next" disabled={index === last} onClick={() => go(index + 1)}>
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
          <path fill="currentColor" d="M8.6 16.6 10 18l6-6-6-6-1.4 1.4 4.6 4.6z" />
        </svg>
      </button>
    </div>
  )
}
