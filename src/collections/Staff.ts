import type { CollectionConfig } from 'payload'
import { refreshHooks } from '../lib/revalidate'

/** Administrative team (practice leadership, managers, coordinators), shown on the About page. Clinicians belong in Specialists. */
export const Staff: CollectionConfig = {
  slug: 'staff',
  labels: { singular: 'Staff member', plural: 'Administrative staff' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'jobTitle', 'order'],
    description: 'The administrative team shown on the About page. Lower “order” numbers appear first.',
  },
  access: {
    read: () => true,
  },
  hooks: refreshHooks,
  defaultSort: 'order',
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    { name: 'jobTitle', type: 'text', admin: { description: 'e.g. Human Resources Manager' } },
    { name: 'photo', type: 'upload', relationTo: 'media' },
    {
      name: 'bio',
      type: 'array',
      labels: { singular: 'Paragraph', plural: 'Paragraphs' },
      fields: [{ name: 'text', type: 'textarea', required: true }],
    },
    { name: 'order', type: 'number', defaultValue: 0, admin: { position: 'sidebar' } },
  ],
}
