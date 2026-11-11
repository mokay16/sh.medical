import type { Access, CollectionConfig } from 'payload'

const isAdmin: Access = ({ req }) => req.user?.role === 'admin'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    description: 'Admins manage accounts. Editors can change content and reviews but not accounts.',
  },
  // Five wrong passwords lock the account for ten minutes.
  auth: { maxLoginAttempts: 5, lockTime: 10 * 60 * 1000 },
  access: {
    read: ({ req }) => Boolean(req.user),
    create: isAdmin,
    delete: isAdmin,
    update: ({ req }) => (req.user?.role === 'admin' ? true : req.user ? { id: { equals: req.user.id } } : false),
  },
  fields: [
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      saveToJWT: true,
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
      ],
      access: { update: ({ req }) => req.user?.role === 'admin' },
    },
  ],
}
