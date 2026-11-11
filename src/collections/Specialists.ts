import type { CollectionConfig } from 'payload'
import { refreshHooks } from '../lib/revalidate'

export const Specialists: CollectionConfig = {
  slug: 'specialists',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'role', 'offices'],
  },
  access: {
    read: () => true,
  },
  hooks: refreshHooks,
  // Keeps the last 25 saved versions of each entry, so a change can be compared or restored.
  versions: { maxPerDoc: 25 },
  defaultSort: 'name',
  fields: [
    { name: 'name', type: 'text', required: true, admin: { description: 'With credentials, e.g. Jacob Johnson, MD' } },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    { name: 'role', type: 'text', required: true, admin: { description: 'One short line shown on cards' } },
    { name: 'title', type: 'text', admin: { description: 'Full professional title for the profile page' } },
    { name: 'photo', type: 'upload', relationTo: 'media' },
    { name: 'offices', type: 'relationship', relationTo: 'offices', hasMany: true },
    { name: 'languages', type: 'text', hasMany: true, admin: { description: 'Languages spoken, e.g. English, Spanish. Shown on the profile when filled in.' } },
    {
      name: 'newPatients',
      type: 'select',
      options: [
        { label: 'Accepting new patients', value: 'yes' },
        { label: 'Not accepting new patients', value: 'no' },
      ],
      admin: { description: 'Leave empty if unknown; nothing is shown.' },
    },
    {
      name: 'bio',
      type: 'array',
      labels: { singular: 'Paragraph', plural: 'Paragraphs' },
      fields: [{ name: 'text', type: 'textarea', required: true }],
    },
    {
      name: 'sections',
      type: 'array',
      admin: { description: 'Education, memberships, hospital affiliations and similar lists' },
      fields: [
        { name: 'heading', type: 'text', required: true },
        { name: 'items', type: 'text', hasMany: true },
      ],
    },
  ],
}
