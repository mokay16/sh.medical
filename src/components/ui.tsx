import Image from 'next/image'
import type { Media } from '@/payload-types'

/** Material Symbols Rounded icon (decorative). Names must be in the font subset loaded by the root layout. */
export function Icon({ name, size = 20, className = '' }: { name: string; size?: number; className?: string }) {
  return (
    <span className={`ms ${className}`} aria-hidden="true" style={{ fontSize: size }}>
      {name}
    </span>
  )
}

export const ICONS = ['arrow_forward', 'call', 'check', 'close', 'description', 'expand_more', 'folder_open', 'format_quote', 'image', 'lock', 'menu', 'my_location', 'search', 'verified_user']

/** A Payload media document as a responsive image. */
export function Img({
  media,
  alt,
  sizes = '100vw',
  className,
  position,
  priority,
}: {
  media: Media | null
  alt?: string
  sizes?: string
  className?: string
  position?: string | null
  priority?: boolean
}) {
  if (!media?.url) return null
  return (
    <Image
      src={media.url}
      alt={alt ?? media.alt}
      width={media.width || 1200}
      height={media.height || 800}
      sizes={sizes}
      className={className}
      priority={priority}
      style={position ? { objectPosition: position } : undefined}
    />
  )
}

export function Initials({ name }: { name: string }) {
  const words = name
    .split(',')[0]
    .replace(/\./g, '')
    .split(/\s+/)
    .filter((w) => /^[A-Z]/.test(w))
  const letters = words.length > 1 ? words[0][0] + words[words.length - 1][0] : (words[0] || '').slice(0, 2)
  return (
    <div className="mono" role="img" aria-label={`${name}, portrait to come`}>
      <b aria-hidden="true">{letters}</b>
      <small aria-hidden="true">New portrait to come</small>
    </div>
  )
}
