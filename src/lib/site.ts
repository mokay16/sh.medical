/** The site's public address. Set NEXT_PUBLIC_SITE_URL in Vercel when the custom domain goes live. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://shmedical.vercel.app').replace(/\/$/, '')
export const SITE_NAME = 'SH Medical'
