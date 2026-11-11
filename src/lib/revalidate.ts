import { revalidatePath } from 'next/cache'
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

/** Rebuild the site's pages as soon as an editor saves, instead of waiting for the next timed refresh. */
function refreshSite() {
  try {
    revalidatePath('/', 'layout')
  } catch {
    // Outside the web server (seeding, migrations) there is nothing to refresh.
  }
}

export const refreshOnChange: CollectionAfterChangeHook = ({ doc }) => {
  refreshSite()
  return doc
}
export const refreshOnDelete: CollectionAfterDeleteHook = () => refreshSite()
export const refreshHooks = { afterChange: [refreshOnChange], afterDelete: [refreshOnDelete] }
