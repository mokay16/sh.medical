import { cache } from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { Department, Media, Office, Specialist } from '@/payload-types'

export const getPayloadClient = cache(() => getPayload({ config }))

export const getDepartments = cache(async (): Promise<Department[]> => {
  const payload = await getPayloadClient()
  const res = await payload.find({ collection: 'departments', depth: 2, limit: 100, sort: 'order' })
  return res.docs
})

export const getDepartment = cache(async (slug: string): Promise<Department | null> => {
  const all = await getDepartments()
  return all.find((d) => d.slug === slug) ?? null
})

export const getSpecialists = cache(async (): Promise<Specialist[]> => {
  const payload = await getPayloadClient()
  const res = await payload.find({ collection: 'specialists', depth: 1, limit: 500, sort: 'name' })
  return res.docs
})

export const getOffices = cache(async (): Promise<Office[]> => {
  const payload = await getPayloadClient()
  const res = await payload.find({ collection: 'offices', depth: 1, limit: 100, sort: 'order' })
  return res.docs
})

/** Narrow a populated relationship (depth ≥ 1) to its document. */
export function doc<T extends { id: number | string }>(v: number | string | T | null | undefined): T | null {
  return v && typeof v === 'object' ? v : null
}

export function docs<T extends { id: number | string }>(v: (number | string | T)[] | null | undefined): T[] {
  return (v || []).map((x) => doc<T>(x)).filter((x): x is T => x !== null)
}

export const media = (v: number | string | Media | null | undefined) => doc<Media>(v)

export function slugify(label: string) {
  return label
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export type SitePageKey = 'home' | 'conditions' | 'treatments' | 'feature' | 'patients' | 'team' | 'locations'
export type SitePage = { key: SitePageKey; label: string; segment: string | null; href: string }

/** The pages of a department mini-site, in menu order. */
export function sitePages(d: Department): SitePage[] {
  const base = `/care/${d.slug}`
  const pages: SitePage[] = [{ key: 'home', label: 'Overview', segment: null, href: base }]
  const add = (key: SitePageKey, label: string, segment = slugify(label)) =>
    pages.push({ key, label, segment, href: `${base}/${segment}` })
  const conditions = d.conditions?.navLabel || 'Conditions'
  const treatments = d.treatments?.navLabel || 'Treatments'
  if (mergedTreatments(d)) add('conditions', `${conditions} & ${treatments.toLowerCase()}`, slugify(conditions))
  else add('conditions', conditions)
  if (d.treatments?.enabled && !mergedTreatments(d)) add('treatments', treatments)
  if (d.feature?.enabled && !d.feature.onPatientsPage && d.feature.navLabel) add('feature', d.feature.navLabel)
  add('patients', 'Patients')
  if (d.locationsOnTeamPage) {
    add('team', d.offices?.length === 1 ? 'Team & location' : 'Team & locations', 'team')
  } else {
    add('team', 'Our team', 'team')
    add('locations', 'Locations')
  }
  return pages
}

/** Treatments shown on the Conditions page instead of their own page. */
export const mergedTreatments = (d: Department) => Boolean(d.treatments?.enabled && d.treatments.onConditionsPage)

/** Where an old page address now lives when it has been merged into another page. */
export function mergedPageHref(d: Department, segment: string): string | null {
  const base = `/care/${d.slug}`
  if (mergedTreatments(d) && segment === slugify(d.treatments?.navLabel || 'Treatments')) return `${base}/${slugify(d.conditions?.navLabel || 'Conditions')}#treatment`
  if (d.locationsOnTeamPage && segment === 'locations') return `${base}/team#locations`
  return null
}

export const tel = (phone?: string | null) => (phone ? `tel:${phone.replace(/\D/g, '')}` : undefined)

export { MAIN_PHONE } from './phone'

export const MYCHART_URL = 'https://ucsfmychart.ucsfmedicalcenter.org/ucsfmychart/Authentication/Login'
