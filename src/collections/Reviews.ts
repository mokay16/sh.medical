import type { CollectionConfig } from 'payload'

/** Patient reviews. Visitors submit them from a department's Reviews page; they go live once staff publish them. */
export const Reviews: CollectionConfig = {
  slug: 'reviews',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'department', 'rating', 'status', 'date'],
    description: 'New reviews arrive as Pending. Set them to Published to show them on the site.',
  },
  access: {
    // The public sees published reviews only; submissions come in through the site's form, not the API.
    read: ({ req }) => (req.user ? true : { status: { equals: 'published' } }),
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  defaultSort: '-date',
  fields: [
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Published', value: 'published' },
        { label: 'Rejected', value: 'rejected' },
      ],
      admin: { position: 'sidebar' },
    },
    { name: 'department', type: 'relationship', relationTo: 'departments', required: true, index: true },
    { name: 'rating', type: 'number', required: true, min: 1, max: 5, defaultValue: 5 },
    { name: 'quote', type: 'textarea', required: true, label: 'Review' },
    {
      type: 'row',
      fields: [
        { name: 'name', type: 'text', required: true, admin: { description: 'First name, as it should appear' } },
        { name: 'location', type: 'text', admin: { description: 'e.g. San Francisco, CA' } },
      ],
    },
    { name: 'date', type: 'date', required: true, defaultValue: () => new Date().toISOString(), admin: { position: 'sidebar' } },
    { name: 'email', type: 'email', admin: { description: 'From the form, for follow-up only. Never shown on the site.' } },
  ],
}
