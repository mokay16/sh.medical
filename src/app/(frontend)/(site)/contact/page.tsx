import type { Metadata } from 'next'
import Link from 'next/link'
import { MAIN_PHONE, MYCHART_URL, getDepartments, tel } from '@/lib/content'

export const metadata: Metadata = {
  title: 'Contact us',
  description: 'Phone numbers for every SH Medical department, our hours, and how to message your care team.',
}

export default async function Contact() {
  const departments = await getDepartments()
  return (
    <>
      <section className="page-heading">
        <div className="wrap">
          <p className="eyebrow">Contact</p>
          <h1 className="h1">Contact us</h1>
          <p className="lede">
            Call <a href={tel(MAIN_PHONE)}>{MAIN_PHONE}</a>, Monday to Friday, 8am to 5pm. If this is a medical emergency, call 911.
          </p>
          <div className="btn-row" style={{ marginTop: 24 }}>
            <Link className="btn btn--clay" href="/book">
              Book an appointment
            </Link>
            <a className="btn btn--outline" href={MYCHART_URL}>
              Message your care team in MyChart
            </a>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="wrap">
          <h2 className="h2" style={{ marginBottom: 24 }}>
            Call a department
          </h2>
          <div className="grid">
            {departments.map((d) => (
              <div key={d.slug} className="card">
                <h3 className="h3">{d.name}</h3>
                {d.phone ? (
                  <p style={{ margin: 0 }}>
                    Phone: <a href={tel(d.phone)}>{d.phone}</a>
                  </p>
                ) : null}
                {d.fax ? <p style={{ margin: 0 }}>Fax: {d.fax}</p> : null}
                <Link className="more" href={`/care/${d.slug}`}>
                  About {d.home?.short || d.name}
                </Link>
              </div>
            ))}
          </div>
          <p className="muted" style={{ marginTop: 32 }}>
            Looking for an address or directions? See all <Link href="/locations">locations</Link>. For records and forms, see{' '}
            <Link href="/patients">Patients</Link>.
          </p>
        </div>
      </section>
    </>
  )
}
