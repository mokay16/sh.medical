'use client'

/**
 * next/image loader: ask our own /img route for a copy resized to `width`.
 * The route keeps the original format (JPEG stays JPEG, never WebP) at full quality.
 */
export default function imageLoader({ src, width }: { src: string; width: number; quality?: number }) {
  return `/img?src=${encodeURIComponent(src)}&w=${width}`
}
