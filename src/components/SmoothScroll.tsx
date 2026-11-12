'use client'

import Lenis from 'lenis'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

/** What fades up into view as you scroll. Kept to content blocks; never the header, nav or anything sticky. */
const TARGETS = [
  '.section-head',
  '.section h2.h2',
  '.grid > *',
  '.dept-card',
  '.loc-card',
  '.ins-grid > li',
  '.ins-marquee',
  '.about-photo',
  '.patients-photo',
  '.timeline li',
  '.archive-photo',
  '.apart-grid > *',
  '.loc-band',
  '.research',
  '.glance',
  '.cta-band',
].join(',')

const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Smooth, eased scrolling (Lenis) and a gentle fade-up for content as it enters the screen.
 * Both are skipped for people who ask their device for reduced motion, and content is never hidden without JavaScript.
 */
export function SmoothScroll() {
  const pathname = usePathname()

  // Eased wheel scrolling and in-page links that glide to their target below the sticky header
  useEffect(() => {
    if (reduceMotion()) return
    const header = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 88
    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.1,
      smoothWheel: true,
      // Lists, menus and the map keep their own native scrolling
      allowNestedScroll: true,
      anchors: { offset: -(header + 16) },
    })
    return () => lenis.destroy()
  }, [])

  // Fade-up on scroll; re-run on each page, since client navigation renders new content
  useEffect(() => {
    if (reduceMotion() || !('IntersectionObserver' in window)) return
    const root = document.documentElement
    root.classList.add('motion')
    const all = [...document.querySelectorAll<HTMLElement>(`#main :is(${TARGETS})`)]
    const picked = new Set(all)
    // Animate the outermost block only (a card grid inside an animated band moves with it), and never anything holding the map
    const insidePicked = (el: HTMLElement) => {
      for (let p = el.parentElement; p; p = p.parentElement) if (picked.has(p)) return true
      return false
    }
    const els = all.filter((el) => !insidePicked(el) && !el.querySelector('.loc-map, .live-map'))
    const vh = window.innerHeight
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue
          e.target.classList.add('is-in')
          io.unobserve(e.target)
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    )
    for (const el of els) {
      // Already on screen at load: show at once, no animation
      if (el.getBoundingClientRect().top < vh * 0.92) continue
      // Stagger siblings in a row (cards, tiles) a little
      const i = el.parentElement ? [...el.parentElement.children].indexOf(el) : 0
      el.style.setProperty('--reveal-delay', `${Math.min(i % 4, 3) * 80}ms`)
      el.classList.add('reveal')
      io.observe(el)
    }
    return () => {
      io.disconnect()
      for (const el of els) el.classList.remove('reveal', 'is-in')
    }
  }, [pathname])

  return null
}
