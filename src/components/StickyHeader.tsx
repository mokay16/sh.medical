'use client'

import { useEffect, useRef, useState } from 'react'

/** Pixels the page must scroll back past the sticking point before the header un-sticks, so it can't flicker at the edge. */
const HYSTERESIS = 12

/** A header that marks itself `data-stuck` once it has scrolled up and pinned to the top of the window. */
export function StickyHeader({ className, children }: { className?: string; children: React.ReactNode }) {
  const ref = useRef<HTMLElement>(null)
  const [stuck, setStuck] = useState(false)

  useEffect(() => {
    let isStuck = false
    const update = () => {
      const el = ref.current
      if (!el) return
      // Where the header sits before it sticks: just below whatever comes before it (the utility strip).
      // This doesn't change when the header itself shrinks, so resizing can't feed back into the decision.
      const prev = el.previousElementSibling as HTMLElement | null
      const stickAt = prev ? prev.offsetTop + prev.offsetHeight : 0
      const y = window.scrollY
      const next = isStuck ? y > stickAt - HYSTERESIS && y > 0 : y >= stickAt && y > 0
      if (next !== isStuck) {
        isStuck = next
        setStuck(next)
      }
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  return (
    <header ref={ref} className={className} data-stuck={stuck || undefined}>
      {children}
    </header>
  )
}
