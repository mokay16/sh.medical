'use client'

import Link from 'next/link'
import { useMemo, useRef, useState } from 'react'

type Option = { id: string; label: string; hint: string; phone?: string }

/**
 * Four-step appointment request. Nothing is sent yet: patient details must only
 * go to a HIPAA-compliant form service covered by a BAA, which hasn't been chosen.
 * Wire submit() to that service, then set NEXT_PUBLIC_BOOKING_ENABLED=true.
 */
const SENDING_ENABLED = process.env.NEXT_PUBLIC_BOOKING_ENABLED === 'true'

const FIELDS = [
  { id: 'first', label: 'First name', type: 'text', autoComplete: 'given-name' },
  { id: 'last', label: 'Last name', type: 'text', autoComplete: 'family-name' },
  { id: 'phone', label: 'Mobile phone', type: 'tel', autoComplete: 'tel' },
  { id: 'email', label: 'Email', type: 'email', autoComplete: 'email' },
  { id: 'dob', label: 'Date of birth', type: 'text', autoComplete: 'bday', placeholder: 'MM / DD / YYYY' },
] as const

type FieldId = (typeof FIELDS)[number]['id']

function validate(values: Record<FieldId, string>) {
  const errors: Partial<Record<FieldId, string>> = {}
  if (!values.first.trim()) errors.first = 'Enter your first name.'
  if (!values.last.trim()) errors.last = 'Enter your last name.'
  if (values.phone.replace(/\D/g, '').length < 10) errors.phone = 'Enter a 10-digit phone number.'
  if (!/^\S+@\S+\.\S+$/.test(values.email)) errors.email = 'Enter an email address, like name@example.com.'
  if (!/^\d{1,2}\s*\/\s*\d{1,2}\s*\/\s*\d{4}$/.test(values.dob.trim())) errors.dob = 'Enter your date of birth as MM / DD / YYYY.'
  return errors
}

export function BookingForm({
  cares,
  offices,
  officesByCare,
  initialCare,
}: {
  cares: Option[]
  offices: Option[]
  officesByCare: Record<string, string[]>
  initialCare?: string
}) {
  const [step, setStep] = useState(1)
  const [care, setCare] = useState(cares.some((c) => c.id === initialCare) ? initialCare! : cares[0].id)
  const [office, setOffice] = useState('any')
  const [patient, setPatient] = useState<'new' | 'returning'>('new')
  const [insurance, setInsurance] = useState('')
  const [values, setValues] = useState<Record<FieldId, string>>({ first: '', last: '', phone: '', email: '', dob: '' })
  const [errors, setErrors] = useState<Partial<Record<FieldId, string>>>({})
  const headingRef = useRef<HTMLHeadingElement>(null)

  const careOption = cares.find((c) => c.id === care)!
  const officeChoices = useMemo(() => {
    const allowed = officesByCare[care]
    return allowed?.length ? offices.filter((o) => o.id === 'any' || allowed.includes(o.id)) : offices
  }, [care, offices, officesByCare])
  const officeLabel = offices.find((o) => o.id === office)?.label ?? 'Soonest available'

  const go = (n: number) => {
    setStep(n)
    requestAnimationFrame(() => headingRef.current?.focus())
  }

  const next = () => {
    if (step === 3) {
      const e = validate(values)
      setErrors(e)
      if (Object.keys(e).length) {
        document.getElementById(`bk-${Object.keys(e)[0]}`)?.focus()
        return
      }
      // TODO: send to the HIPAA-compliant form service once chosen (see SENDING_ENABLED).
    }
    go(Math.min(4, step + 1))
  }

  const steps = [
    { label: 'Care needed', value: step > 1 ? careOption.label : '' },
    { label: 'Office', value: step > 2 ? officeLabel : '' },
    { label: 'Your details', value: step > 3 ? (patient === 'new' ? 'New patient' : 'Returning patient') : '' },
    { label: 'Confirm', value: '' },
  ]

  return (
    <div className="book">
      <aside className="book-rail">
        <div className="stack" style={{ gap: 14 }}>
          <p className="eyebrow" style={{ color: 'var(--peach)' }}>
            Request an appointment
          </p>
          <p className="serif" style={{ fontSize: 40, lineHeight: 1.08, margin: 0 }}>
            We’ll take it from here.
          </p>
          <p style={{ margin: 0, color: 'var(--on-dark)' }}>Four quick steps. Our care team will contact you to confirm a time.</p>
        </div>
        <ol aria-label="Progress">
          {steps.map((s, i) => {
            const n = i + 1
            const done = n < step
            const current = n === step
            return (
              <li key={s.label} aria-current={current ? 'step' : undefined}>
                <span
                  className="dot"
                  style={{
                    background: done ? 'var(--sea)' : current ? 'var(--linen)' : 'transparent',
                    color: done || current ? 'var(--bay)' : 'var(--sea)',
                    boxShadow: done || current ? 'none' : 'inset 0 0 0 1.5px rgba(169,209,203,0.6)',
                  }}
                >
                  {done ? '✓' : n}
                </span>
                <span style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontWeight: 600, color: current ? '#fff' : done ? '#d9e3df' : '#8fa5a0' }}>{s.label}</span>
                  {s.value ? <span style={{ fontSize: 14, color: 'var(--sea)' }}>{s.value}</span> : null}
                </span>
              </li>
            )
          })}
        </ol>
        <p style={{ marginTop: 'auto', fontSize: 14, color: 'var(--on-dark-2)', borderTop: '1px solid rgba(244,239,231,0.18)', paddingTop: 20 }}>
          If this is a medical emergency, call 911. Existing patients can also message their care team in MyChart.
        </p>
      </aside>

      <form
        className="book-main"
        noValidate
        onSubmit={(e) => {
          e.preventDefault()
          next()
        }}
      >
        <div className="stack" style={{ gap: 10 }}>
          {step < 4 ? <p className="muted" style={{ margin: 0, fontSize: 14 }}>Step {step} of 4</p> : null}
          <h1 className="h1" style={{ fontSize: 'clamp(36px, 3.6vw, 52px)' }} tabIndex={-1} ref={headingRef}>
            {['What brings you in?', 'Where would you like to be seen?', 'A little about you', SENDING_ENABLED ? 'Request received.' : 'Almost there: please call to book.'][step - 1]}
          </h1>
        </div>

        {step === 1 ? (
          <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
            <legend className="visually-hidden">Care needed</legend>
            <div className="grid" style={{ gap: 14 }}>
              {cares.map((c) => (
                <button key={c.id} type="button" className="tile" aria-pressed={care === c.id} onClick={() => setCare(c.id)}>
                  <b>{c.label}</b>
                  <span>{c.hint}</span>
                </button>
              ))}
            </div>
          </fieldset>
        ) : null}

        {step === 2 ? (
          <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
            <legend className="visually-hidden">Office</legend>
            <div className="grid" style={{ gap: 14 }}>
              {officeChoices.map((o) => (
                <button key={o.id} type="button" className="tile" aria-pressed={office === o.id} onClick={() => setOffice(o.id)} style={{ minHeight: 88 }}>
                  <b>{o.label}</b>
                  <span>{o.hint}</span>
                </button>
              ))}
            </div>
          </fieldset>
        ) : null}

        {step === 3 ? (
          <>
            <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
              <legend className="visually-hidden">Have you been seen at SH Medical before?</legend>
              <div className="btn-row" style={{ gap: 12 }}>
                {(
                  [
                    ['new', 'I’m a new patient'],
                    ['returning', 'I’ve been seen at SH before'],
                  ] as const
                ).map(([id, label]) => (
                  <button key={id} type="button" className="tile" aria-pressed={patient === id} onClick={() => setPatient(id)} style={{ minHeight: 64, justifyContent: 'center' }}>
                    <b>{label}</b>
                  </button>
                ))}
              </div>
            </fieldset>
            <div className="grid" style={{ ['--cols' as string]: 2, gap: '20px 24px', maxWidth: 820 }}>
              {FIELDS.map((f) => (
                <div key={f.id} className="field">
                  <label htmlFor={`bk-${f.id}`}>{f.label}</label>
                  <input
                    id={`bk-${f.id}`}
                    type={f.type}
                    autoComplete={f.autoComplete}
                    placeholder={'placeholder' in f ? f.placeholder : undefined}
                    value={values[f.id]}
                    aria-invalid={errors[f.id] ? true : undefined}
                    aria-describedby={errors[f.id] ? `bk-${f.id}-error` : undefined}
                    onChange={(e) => setValues((v) => ({ ...v, [f.id]: e.target.value }))}
                  />
                  {errors[f.id] ? (
                    <span id={`bk-${f.id}-error`} className="error">
                      {errors[f.id]}
                    </span>
                  ) : null}
                </div>
              ))}
              <div className="field">
                <label htmlFor="bk-ins">Insurance</label>
                <select id="bk-ins" value={insurance} onChange={(e) => setInsurance(e.target.value)}>
                  <option value="">Select your plan</option>
                  <option>Aetna</option>
                  <option>Anthem Blue Cross</option>
                  <option>Blue Shield</option>
                  <option>Cigna</option>
                  <option>HealthNet</option>
                  <option>UnitedHealth</option>
                  <option>Medicare</option>
                  <option>Brown &amp; Toland HMO</option>
                  <option>Hill Physicians HMO</option>
                  <option>Other</option>
                  <option>I’ll pay myself</option>
                </select>
              </div>
            </div>
          </>
        ) : null}

        {step === 4 ? (
          <div className="stack" style={{ gap: 22, maxWidth: 700 }}>
            {SENDING_ENABLED ? (
              <p className="lede" style={{ fontSize: 20 }}>
                Thank you. Our care team will contact you within [response time to confirm] to find a time that works. You’ll get a confirmation by
                text and email.
              </p>
            ) : (
              <p className="notice" role="status">
                <strong>Online requests aren’t switched on yet, so this request was not sent.</strong> Please call {careOption.label} at{' '}
                <a href={`tel:${(careOption.phone || '').replace(/\D/g, '')}`}>{careOption.phone}</a> to book, Monday to Friday, 8am to 5pm.
              </p>
            )}
            <div className="glance" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 16 }}>
              <div>
                <div className="muted" style={{ fontSize: 13 }}>
                  Care
                </div>
                <div style={{ fontSize: 18, fontWeight: 600 }}>{careOption.label}</div>
              </div>
              <div>
                <div className="muted" style={{ fontSize: 13 }}>
                  Office
                </div>
                <div style={{ fontSize: 18, fontWeight: 600 }}>{officeLabel}</div>
              </div>
            </div>
            <div className="btn-row">
              <Link className="btn btn--teal" href="/">
                Back to home
              </Link>
              <Link className="btn btn--outline" href="/patients#new">
                What to bring
              </Link>
            </div>
          </div>
        ) : null}

        {step < 4 ? (
          <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 24, borderTop: '1px solid var(--sand)' }}>
            <button
              type="button"
              onClick={() => go(Math.max(1, step - 1))}
              disabled={step === 1}
              style={{ minHeight: 56, border: 0, background: 'transparent', fontFamily: 'var(--sans)', fontSize: 16, fontWeight: 600, color: step === 1 ? '#8a8174' : 'var(--ink)', cursor: step === 1 ? 'default' : 'pointer', padding: '0 8px' }}
            >
              ← Back
            </button>
            <button type="submit" className="btn btn--clay">
              {step === 3 && SENDING_ENABLED ? 'Send request' : 'Continue'}
            </button>
          </div>
        ) : null}
      </form>
    </div>
  )
}
