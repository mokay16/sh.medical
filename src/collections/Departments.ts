import type { CollectionConfig, Field } from 'payload'

/** Text fields accept *italic* and **bold** markers, rendered on the site. */
const formattingHint = 'Use *asterisks* for italic and **double asterisks** for bold.'

const titleDescription = (name: string, label?: string): Field => ({
  name,
  type: 'array',
  labels: label ? { singular: label, plural: `${label}s` } : undefined,
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'description', type: 'textarea', required: true },
  ],
})

const paragraphs = (name: string): Field => ({
  name,
  type: 'array',
  labels: { singular: 'Paragraph', plural: 'Paragraphs' },
  fields: [{ name: 'text', type: 'textarea', required: true }],
})

const navLabel = (defaultValue: string): Field => ({
  name: 'navLabel',
  type: 'text',
  defaultValue,
  admin: { description: 'Name of this page in the department menu; the page address is made from it.' },
})

export const Departments: CollectionConfig = {
  slug: 'departments',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'brand', 'phone', 'order'],
  },
  access: {
    read: () => true,
  },
  defaultSort: 'order',
  fields: [
    { name: 'name', type: 'text', required: true, admin: { description: 'e.g. Allergy, asthma & immunology' } },
    { name: 'slug', type: 'text', required: true, unique: true, index: true, admin: { position: 'sidebar', description: 'Page address: /care/<slug>' } },
    { name: 'order', type: 'number', defaultValue: 0, admin: { position: 'sidebar' } },
    { name: 'tag', type: 'text', required: true, admin: { position: 'sidebar', description: 'Short label for office cards and filters, e.g. ENT' } },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Brand & hero',
          fields: [
            { name: 'brand', type: 'text', required: true, admin: { description: 'e.g. SH Allergy, Asthma & Immunology' } },
            { name: 'shortBrand', type: 'text', required: true, admin: { description: 'Shown in the department header, e.g. SH Allergy' } },
            { name: 'logo', type: 'upload', relationTo: 'media', admin: { description: 'White logo on transparent background. Without one, a placeholder badge is shown.' } },
            {
              type: 'row',
              fields: [
                { name: 'phone', type: 'text', required: true },
                { name: 'phoneLabel', type: 'text', required: true, admin: { description: 'e.g. Allergy' } },
                { name: 'bookLabel', type: 'text', required: true, admin: { description: 'e.g. Book an allergy appointment' } },
              ],
            },
            { name: 'eyebrow', type: 'text', required: true },
            { name: 'headline', type: 'text', required: true, admin: { description: formattingHint } },
            { name: 'intro', type: 'textarea', required: true },
            { name: 'photo', type: 'upload', relationTo: 'media', required: true },
            { name: 'photoPosition', type: 'text', defaultValue: 'center', admin: { description: 'CSS object-position, e.g. center 30%' } },
            {
              type: 'row',
              fields: [
                { name: 'heroSecondaryLabel', type: 'text', admin: { description: 'Second hero button; defaults to calling the department' } },
                { name: 'heroSecondaryHref', type: 'text' },
              ],
            },
            {
              name: 'facts',
              type: 'array',
              maxRows: 3,
              fields: [
                { name: 'big', type: 'text', required: true },
                { name: 'small', type: 'text', required: true },
              ],
            },
          ],
        },
        {
          label: 'Home page card',
          fields: [
            {
              name: 'home',
              type: 'group',
              fields: [
                { name: 'short', type: 'text', required: true, admin: { description: 'Used in “Explore …” on the home page' } },
                { name: 'summary', type: 'textarea', required: true },
                { name: 'chips', type: 'text', hasMany: true },
                { name: 'photo', type: 'upload', relationTo: 'media' },
                { name: 'photoPosition', type: 'text', defaultValue: 'center' },
              ],
            },
          ],
        },
        {
          label: 'Overview',
          fields: [
            {
              name: 'overview',
              type: 'group',
              fields: [
                { name: 'eyebrow', type: 'text' },
                { name: 'heading', type: 'text', required: true },
                paragraphs('paras'),
                { name: 'glanceTitle', type: 'text' },
                { name: 'glance', type: 'text', hasMany: true },
                { name: 'note', type: 'textarea' },
              ],
            },
            {
              name: 'reviews',
              type: 'array',
              fields: [
                { name: 'quote', type: 'textarea', required: true },
                { name: 'attribution', type: 'text' },
              ],
            },
          ],
        },
        {
          label: 'Conditions',
          fields: [
            {
              name: 'conditions',
              type: 'group',
              fields: [
                navLabel('Conditions'),
                { name: 'eyebrow', type: 'text' },
                { name: 'heading', type: 'text', required: true },
                { name: 'lede', type: 'textarea' },
                titleDescription('items', 'Condition'),
                {
                  name: 'programs',
                  type: 'array',
                  admin: { description: 'Optional sub-specialty panels (used by ENT and Surgery) instead of simple cards' },
                  fields: [
                    { name: 'title', type: 'text', required: true },
                    { name: 'summary', type: 'textarea', required: true },
                    { name: 'conditions', type: 'text', hasMany: true },
                    { name: 'procedures', type: 'text', hasMany: true },
                    { name: 'procLabel', type: 'text', defaultValue: 'Treatments and procedures' },
                    { name: 'more', type: 'text' },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Treatments',
          fields: [
            {
              name: 'treatments',
              type: 'group',
              fields: [
                { name: 'enabled', type: 'checkbox', defaultValue: false },
                navLabel('Treatments'),
                { name: 'eyebrow', type: 'text' },
                { name: 'heading', type: 'text' },
                { name: 'lede', type: 'textarea' },
                titleDescription('items', 'Treatment'),
              ],
            },
          ],
        },
        {
          label: 'Feature page',
          fields: [
            {
              name: 'feature',
              type: 'group',
              admin: { description: 'A page of its own, such as Shot clinic or Hearing aids' },
              fields: [
                { name: 'enabled', type: 'checkbox', defaultValue: false },
                { name: 'onPatientsPage', type: 'checkbox', defaultValue: false, admin: { description: 'Show on the Patients page instead of as its own page' } },
                navLabel(''),
                { name: 'eyebrow', type: 'text' },
                { name: 'heading', type: 'text' },
                paragraphs('paras'),
                { name: 'chips', type: 'text', hasMany: true },
                { name: 'bullets', type: 'array', fields: [{ name: 'text', type: 'textarea', required: true }] },
                { name: 'links', type: 'text', hasMany: true },
                { name: 'image', type: 'upload', relationTo: 'media' },
              ],
            },
          ],
        },
        {
          label: 'Patients',
          fields: [
            {
              name: 'visit',
              type: 'group',
              fields: [
                { name: 'eyebrow', type: 'text', defaultValue: 'Your care, step by step' },
                { name: 'heading', type: 'text', required: true },
                titleDescription('steps', 'Step'),
                { name: 'note', type: 'textarea' },
                { name: 'linkLabel', type: 'text' },
              ],
            },
            {
              name: 'resources',
              type: 'array',
              fields: [
                { name: 'icon', type: 'text', admin: { description: 'Material Symbols icon name, e.g. description' } },
                { name: 'title', type: 'text', required: true },
                { name: 'description', type: 'textarea' },
                { name: 'href', type: 'text' },
              ],
            },
            {
              name: 'faq',
              type: 'array',
              labels: { singular: 'Question', plural: 'Questions' },
              fields: [
                { name: 'question', type: 'text', required: true },
                { name: 'answer', type: 'textarea', required: true, admin: { description: 'Start lines with “- ” for a bulleted list.' } },
              ],
            },
            { name: 'faqOpen', type: 'number', defaultValue: 2, admin: { description: 'How many answers start open' } },
          ],
        },
        {
          label: 'Team & locations',
          fields: [
            {
              name: 'team',
              type: 'group',
              fields: [
                { name: 'eyebrow', type: 'text', defaultValue: 'Your care team' },
                { name: 'heading', type: 'text', defaultValue: 'Meet the team' },
                { name: 'members', type: 'relationship', relationTo: 'specialists', hasMany: true },
                { name: 'emptyNote', type: 'textarea' },
              ],
            },
            { name: 'offices', type: 'relationship', relationTo: 'offices', hasMany: true },
            { name: 'officePhone', type: 'text', admin: { description: 'Phone shown for every office on the department pages' } },
            { name: 'whereHeading', type: 'text', required: true },
            { name: 'whereNote', type: 'textarea' },
            { name: 'ctaHeading', type: 'text', required: true },
          ],
        },
      ],
    },
  ],
}
