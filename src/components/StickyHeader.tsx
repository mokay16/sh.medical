'use client'

import { useEffect, useRef, useState } from 'react'

/** A header that marks itself `data-stuck` once it has scrolled up and pinned to the top of the window. */
export function StickyHeader({ className, children }: { className?: string; children: React.ReactNode }) {
  const ref = useRef<HTMLElement>(null)
  const [stuck, setStuck] = useState(false)

  useEffect(() => {
    const update = () => {
      const el = ref.current
      if (el) setStuck(window.scrollY > 0 && el.getBoundingClientRect().top <= 0)
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
