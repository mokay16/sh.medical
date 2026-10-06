import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { BookingForm } from './BookingForm'
import { Icon } from '@/components/ui'
import { getDepartments, getOffices } from '@/lib/content'

export const metadata: Metadata = { title: 'Book an appointment' }

type Props = { searchParams: Promise<{ care?: string }> }

export default async function Book({ searchParams }: Props) {
  const { care } = await searchParams
  const [departments, offices] = await Promise.all([getDepartments(), getOffices()])

  return (
    <>
      <header className="site-header">
        <div className="wrap" style={{ minHeight: 84 }}>
          <Link href="/" aria-label="SH Medical home">
            <Image src="/brand/sh-medical-logo.png" alt="SH Medical" width={64} height={64} priority />
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 28, fontSize: 15 }}>
            <span className="muted">
              Prefer to talk?{' '}
              <a href="tel:4153625443" style={{ fontWeight: 600, textDecoration: 'none' }}>
                (415) 362-5443
              </a>
            </span>
            <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--ink)', fontWeight: 600, textDecoration: 'none' }}>
              <Icon name="close" size={18} className="ms--sm" />
              Exit
            </Link>
          </div>
        </div>
      </header>
      <main id="main">
        <BookingForm
          initialCare={care}
          cares={[
            ...departments.map((d) => ({ id: d.slug, label: d.name, hint: (d.home?.chips || []).slice(0, 3).join(', '), phone: d.phone })),
            { id: 'not-sure', label: 'I’m not sure', hint: 'We’ll match you with the right specialist', phone: '(415) 362-5443' },
          ]}
          offices={[
            ...offices.map((o) => ({ id: o.slug, label: o.name, hint: `${o.street}, ${o.city.split(',')[0]}` })),
            { id: 'any', label: 'Soonest available', hint: 'Any office that offers this care' },
          ]}
          officesByCare={Object.fromEntries(
            departments.map((d) => [d.slug, (d.offices || []).map((o) => (typeof o === 'object' ? o.slug : '')).filter(Boolean)]),
          )}
        />
      </main>
    </>
  )
}
