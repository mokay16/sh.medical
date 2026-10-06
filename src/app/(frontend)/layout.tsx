import React from 'react'
import type { Metadata } from 'next'
import { Figtree, Fraunces } from 'next/font/google'
import { getDepartments } from '@/lib/content'
import { ICONS } from '@/components/ui'
import './globals.css'

const serif = Fraunces({ subsets: ['latin'], axes: ['SOFT', 'opsz'], style: ['normal', 'italic'], variable: '--font-serif', display: 'swap' })
const sans = Figtree({ subsets: ['latin'], variable: '--font-sans', display: 'swap' })

/** Pages are pre-built, then refreshed from the CMS at most once a minute. */
export const revalidate = 60

export const metadata: Metadata = {
  title: { default: 'SH Medical · Care for the senses since 1940', template: '%s · SH Medical' },
  description:
    'ENT, audiology, allergy, sleep, voice, balance, facial plastics, dermatology, surgery and wellness, in 12 Bay Area offices. Since 1940.',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Load only the icons in use, including any an editor picks for a department's resources.
  const departments = await getDepartments()
  const icons = new Set(ICONS)
  for (const d of departments) for (const r of d.resources || []) if (r.icon) icons.add(r.icon)
  const iconHref =
    'https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,300..400,0..1,0' +
    `&icon_names=${[...icons].sort().join(',')}&display=block`

  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <head>
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link rel="stylesheet" href={iconHref} />
      </head>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  )
}
