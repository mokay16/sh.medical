import sharp from 'sharp'

/**
 * Resizes the site's own images for the device asking for them, keeping their format:
 * JPEG stays JPEG at quality 90 with full colour detail (no WebP), PNG stays PNG.
 * Each version is cached for a year by browsers and the CDN, so it's only made once.
 */

// next/image's default device and image sizes: the only widths the loader ever asks for.
const WIDTHS = new Set([32, 48, 64, 96, 128, 256, 384, 640, 750, 828, 1080, 1200, 1920, 2048, 3840])
// Only our own images, never arbitrary URLs.
const ALLOWED = /^\/(api\/media\/file|uploads|images|brand)\/[^?#]+\.(jpe?g|png|webp)$/i
const CACHE = 'public, max-age=31536000, immutable'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const src = url.searchParams.get('src') || ''
  const width = Number(url.searchParams.get('w'))
  if (!ALLOWED.test(src) || src.includes('..') || !WIDTHS.has(width)) {
    return new Response('Bad image request', { status: 400 })
  }

  const source = await fetch(new URL(src, url.origin), { cache: 'no-store' })
  if (!source.ok) return new Response('Image not found', { status: 404 })
  const input = Buffer.from(await source.arrayBuffer())

  const image = sharp(input, { failOn: 'none' }).rotate()
  const meta = await image.metadata()
  const resized = image.resize({ width, withoutEnlargement: true })
  const png = meta.format === 'png'
  const body = png
    ? await resized.png({ compressionLevel: 9, adaptiveFiltering: true }).toBuffer()
    : await resized.jpeg({ quality: 90, chromaSubsampling: '4:4:4', mozjpeg: true, progressive: true }).toBuffer()

  return new Response(new Uint8Array(body), {
    headers: {
      'Content-Type': png ? 'image/png' : 'image/jpeg',
      'Cache-Control': CACHE,
      'CDN-Cache-Control': CACHE,
    },
  })
}
