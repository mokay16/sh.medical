'use client'

import { useState } from 'react'

/**
 * A before/after comparison: the "after" photo sits on top and a handle reveals it.
 * Works with a mouse, touch (drag) and the keyboard (the handle is a range input).
 */
export function BeforeAfter({
  before,
  after,
  alt,
}: {
  before: { src: string; width: number; height: number }
  after: { src: string; width: number; height: number }
  alt: string
}) {
  const [pos, setPos] = useState(50)
  return (
    <div className="ba" style={{ ['--pos' as string]: `${pos}%`, aspectRatio: `${after.width} / ${after.height}` }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="ba-img" src={before.src} alt={`Before: ${alt}`} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="ba-img ba-after" src={after.src} alt={`After: ${alt}`} />
      <span className="ba-tag ba-tag--before">Before</span>
      <span className="ba-tag ba-tag--after">After</span>
      <span className="ba-line" aria-hidden="true">
        <span className="ba-knob">‹ ›</span>
      </span>
      <input
        className="ba-range"
        type="range"
        min={0}
        max={100}
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        aria-label={`Compare before and after: ${alt}`}
      />
    </div>
  )
}
