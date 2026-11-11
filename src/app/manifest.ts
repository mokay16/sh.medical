import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'SH Medical',
    short_name: 'SH Medical',
    description: 'Care for the senses since 1940.',
    start_url: '/',
    display: 'browser',
    background_color: '#f4efe8',
    theme_color: '#28696d',
    icons: [
      { src: '/icon.png', sizes: '512x512', type: 'image/png' },
      { src: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  }
}
