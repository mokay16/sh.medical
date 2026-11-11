import type { CollectionConfig } from 'payload'
import { refreshHooks } from '../lib/revalidate'

export const Offices: CollectionConfig = {
  slug: 'offices',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'region', 'street', 'phone'],
  },
  access: {
    read: () => true,
  },
  hooks: refreshHooks,
  // Keeps the last 25 saved versions of each entry, so a change can be compared or restored.
  versions: { maxPerDoc: 25 },
  defaultSort: 'order',
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    {
      name: 'region',
      type: 'select',
      required: true,
      options: ['San Francisco', 'Peninsula', 'South Bay', 'East Bay', 'North Bay'],
    },
    { name: 'street', type: 'text', required: true },
    { name: 'city', type: 'text', required: true, admin: { description: 'City, state and ZIP, e.g. San Francisco, CA 94108' } },
    { name: 'phone', type: 'text' },
    { name: 'fax', type: 'text' },
    { name: 'parking', type: 'text', admin: { description: 'Parking, transit or how to find the suite. Shown on the office card when filled in.' } },
    { name: 'hours', type: 'text', defaultValue: 'Monday to Friday, 8am to 5pm' },
    { name: 'note', type: 'text', admin: { description: 'One short line, e.g. Our home since 1945' } },
    { name: 'photo', type: 'upload', relationTo: 'media' },
    {
      type: 'row',
      fields: [
        { name: 'lat', type: 'number', admin: { description: 'Latitude, for the map and “nearest office”' } },
        { name: 'lng', type: 'number', admin: { description: 'Longitude' } },
      ],
    },
    { name: 'order', type: 'number', defaultValue: 0, admin: { position: 'sidebar' } },
  ],
}
