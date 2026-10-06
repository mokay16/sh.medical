'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

type Item = { href: string; label: string; exact?: boolean }

/** Navigation links that mark the current page with aria-current. */
export function NavLinks({ items, className, label }: { items: Item[]; className: string; label: string }) {
  const pathname = usePathname()
  return (
    <nav aria-label={label} className={className}>
      {items.map((item) => {
        const current = item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(item.href + '/')
        return (
          <Link key={item.href} href={item.href} aria-current={current ? 'page' : undefined}>
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
