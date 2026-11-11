import { notFound } from 'next/navigation'

/** Any address that isn't a real page shows the site's own "page not found". */
export default function CatchAll() {
  notFound()
}
