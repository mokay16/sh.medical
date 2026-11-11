'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'

export type SearchItem = { type: string; title: string; text: string; href: string; where?: string }

const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')

export function SiteSearch({ items, initialQuery = '' }: { items: SearchItem[]; initialQuery?: string }) {
  const [q, setQ] = useState(initialQuery)

  const results = useMemo(() => {
    const words = norm(q).split(/\s+/).filter((w) => w.length > 1)
    if (!words.length) return []
    return items
      .map((it) => {
        const title = norm(it.title)
        const rest = norm(`${it.text} ${it.where || ''} ${it.type}`)
        let score = 0
        for (const w of words) {
          if (title.includes(w)) score += title.startsWith(w) ? 6 : 4
          else if (rest.includes(w)) score += 1
          else return null
        }
        return { it, score }
      })
      .filter((r): r is { it: SearchItem; score: number } => r !== null)
      .sort((a, b) => b.score - a.score)
      .slice(0, 40)
  }, [q, items])

  return (
    <div className="search">
      <form role="search" onSubmit={(e) => e.preventDefault()}>
        <label htmlFor="site-search" className="visually-hidden">
          Search for a condition, treatment, specialist or office
        </label>
        <input
          id="site-search"
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Try “sinus”, “hearing aids” or a doctor’s name"
          autoComplete="off"
          autoFocus
        />
      </form>
      <p className="muted" role="status" aria-live="polite" style={{ margin: '16px 0 0' }}>
        {q.trim().length < 2 ? 'Type at least two letters.' : results.length ? `${results.length} result${results.length === 1 ? '' : 's'}` : 'No results. Try a different word, or call us.'}
      </p>
      <ul className="search-results">
        {results.map(({ it }, i) => (
          <li key={`${it.href}-${it.title}-${i}`}>
            <Link href={it.href}>
              <span className="search-type">
                {it.type}
                {it.where ? ` · ${it.where}` : ''}
              </span>
              <span className="search-title">{it.title}</span>
              {it.text ? <span className="search-text">{it.text.length > 160 ? `${it.text.slice(0, 157)}…` : it.text}</span> : null}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
