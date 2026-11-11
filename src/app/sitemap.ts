import type { MetadataRoute } from 'next'
import { getDepartments, getSpecialists, sitePages } from '@/lib/content'
import { SITE_URL } from '@/lib/site'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [departments, specialists] = await Promise.all([getDepartments(), getSpecialists()])
  const page = (path: string, priority: number, lastModified?: string) => ({ url: `${SITE_URL}${path}`, priority, lastModified })
  return [
    page('/', 1),
    ...['/care', '/specialists', '/locations', '/patients', '/book'].map((p) => page(p, 0.9)),
    ...['/about', '/contact', '/privacy', '/terms', '/accessibility'].map((p) => page(p, 0.4)),
    ...departments.flatMap((d) => sitePages(d).map((p) => page(p.href, p.href === `/care/${d.slug}` ? 0.9 : 0.7, d.updatedAt))),
    ...specialists.map((s) => page(`/specialists/${s.slug}`, 0.6, s.updatedAt)),
  ]
}
