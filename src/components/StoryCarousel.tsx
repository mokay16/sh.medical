'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Icon } from './ui'

export type Story = { id: string | number; quote: string; who: string; rating?: number }

/** Seconds each review stays up. */
const INTERVAL = 7

function Stars({ rating = 5 }: { rating?: number }) {
  const n = Math.max(0, Math.min(5, Math.round(rating)))
  return (
    <span className="stars" aria-label={`${n} out of 5 stars`} style={{ letterSpacing: 2 }}>
      {'★'.repeat(n)}
      <span style={{ opacity: 0.25 }}>{'★'.repeat(5 - n)}</span>
    </span>
  )
}

const clip = (q: string) => (q.length > 260 ? q.slice(0, 257).replace(/\s+\S*$/, '') + '…' : q)
const bare = (q: string) => q.replace(/^[“"]|[”"]$/g, '')

/**
 * "Patient stories": a featured review beside two smaller ones, rotating with a crossfade.
 * Every review is stacked in the same grid cell, so the section never changes height.
 * Pauses on hover, on focus, when off-screen, and when the visitor pauses it; no auto-rotate for reduced motion.
 */
export function StoryCarousel({ stories, allHref, allLabel }: { stories: Story[]; allHref?: string; allLabel?: string }) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [hold, setHold] = useState(false)
  const [visible, setVisible] = useState(true)
  const [reduced, setReduced] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const n = stories.length
  const rotating = n > 1

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const set = () => setReduced(mq.matches)
    set()
    mq.addEventListener('change', set)
    return () => mq.removeEventListener('change', set)
  }, [])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.2 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const go = useCallback((i: number) => setIndex(((i % n) + n) % n), [n])

  useEffect(() => {
    if (!rotating || paused || hold || !visible || reduced) return
    const t = setTimeout(() => go(index + 1), INTERVAL * 1000)
    return () => clearTimeout(t)
  }, [index, rotating, paused, hold, visible, reduced, go])

  if (!n) return null
  const at = (offset: number) => (index + offset) % n

  return (
    <div
      ref={ref}
      className="wrap stories story-carousel"
      onMouseEnter={() => setHold(true)}
      onMouseLeave={() => setHold(false)}
      onFocus={() => setHold(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setHold(false)
      }}
    >
      <div className="stack" style={{ gap: 28 }}>
        <p className="eyebrow">Patient stories</p>
        <Icon name="format_quote" size={56} className="ms--fill quote-mark" />
        <div className="story-stack" aria-live={paused || hold ? 'polite' : 'off'}>
          {stories.map((s, i) => (
            <div key={s.id} className="story-slide" data-active={i === index || undefined} aria-hidden={i !== index}>
              <blockquote className="serif story-quote">{bare(s.quote)}</blockquote>
              <p className="muted story-meta">
                <Stars rating={s.rating} /> {s.who}
              </p>
            </div>
          ))}
        </div>
        {rotating ? (
          <div className="story-controls">
            <button type="button" className="story-pause" onClick={() => setPaused((p) => !p)} aria-label={paused ? 'Play reviews' : 'Pause reviews'}>
              <Icon name={paused ? 'play_arrow' : 'pause'} size={20} />
            </button>
            <div className="story-dots" role="group" aria-label="Choose a review">
              {stories.map((s, i) => (
                <button key={s.id} type="button" className="story-dot" aria-current={i === index || undefined} aria-label={`Review ${i + 1} of ${n}`} onClick={() => go(i)} />
              ))}
            </div>
          </div>
        ) : null}
      </div>
      <div className="stack" style={{ gap: 18, justifyContent: 'flex-end' }}>
        {[1, 2].filter((o) => o < n).map((offset) => (
          <div key={offset} className="story-stack">
            {stories.map((s, i) => (
              <figure key={s.id} className="mini-review story-slide" data-active={i === at(offset) || undefined} aria-hidden={i !== at(offset)}>
                <Stars rating={s.rating} />
                <blockquote>“{clip(bare(s.quote))}”</blockquote>
                <figcaption>{s.who}</figcaption>
              </figure>
            ))}
          </div>
        ))}
        {allHref ? (
          <Link className="link-arrow" href={allHref} style={{ display: 'inline-flex', gap: 8, alignItems: 'center' }}>
            {allLabel || 'Read patient reviews'} <Icon name="arrow_forward" size={18} className="ms--sm" />
          </Link>
        ) : null}
      </div>
    </div>
  )
}
