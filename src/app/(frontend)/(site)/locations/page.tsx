import type { Metadata } from 'next'
import type { Office } from '@/payload-types'
import { docs, getDepartments, getOffices, media } from '@/lib/content'
import { OfficeFinder, type OfficeView } from './OfficeFinder'
import { JsonLd } from '@/components/JsonLd'
import { SITE_URL } from '@/lib/site'

export const metadata: Metadata = { title: 'Locations', description: 'Find an SH Medical office near you: nine locations across San Francisco, the Peninsula, the East Bay and the North Bay.' }

type Props = { searchParams: Promise<{ q?: string; care?: string }> }

/** Locations, following the canvas artboard "Locations". */
export default async function Locations({ searchParams }: Props) {
  const { q = '', care = '' } = await searchParams
  const [offices, departments] = await Promise.all([getOffices(), getDepartments()])

  const view: OfficeView[] = offices.map((o) => {
    const photo = media(o.photo)
    return {
      slug: o.slug,
      name: o.name,
      region: o.region,
      street: o.street,
      city: o.city,
      phone: o.phone ?? null,
      fax: o.fax ?? null,
      parking: o.parking ?? null,
      note: o.note ?? null,
      photo: photo?.url ? { url: photo.url, alt: photo.alt, width: photo.width || 1200, height: photo.height || 800 } : null,
      lat: o.lat ?? null,
      lng: o.lng ?? null,
      care: departments.filter((d) => docs<Office>(d.offices).some((x) => x.id === o.id)).map((d) => ({ slug: d.slug, tag: d.tag })),
    }
  })
  const cares = departments.filter((d) => d.offices?.length).map((d) => ({ slug: d.slug, tag: d.tag }))

  return (
    <>
      <JsonLd
        data={offices.map((o) => ({
          '@context': 'https://schema.org',
          '@type': 'MedicalClinic',
          name: `SH Medical ${o.name}`,
          url: `${SITE_URL}/locations`,
          telephone: o.phone || undefined,
          address: { '@type': 'PostalAddress', streetAddress: o.street, addressLocality: o.city, addressCountry: 'US' },
          geo: o.lat && o.lng ? { '@type': 'GeoCoordinates', latitude: o.lat, longitude: o.lng } : undefined,
          openingHours: o.hours || undefined,
          parentOrganization: { '@type': 'MedicalOrganization', name: 'SH Medical', url: SITE_URL },
        }))}
      />
      <OfficeFinder offices={view} cares={cares} initialQuery={q} initialCare={care} />
    </>
  )
}
