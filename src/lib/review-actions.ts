'use server'

import { headers } from 'next/headers'
import { getPayloadClient } from './content'

export type ReviewFormState = { ok: boolean; message: string }

const text = (v: FormDataEntryValue | null, max: number) => String(v ?? '').trim().slice(0, max)

// Spam limits: three reviews an hour from one address, and thirty an hour in total.
const PER_VISITOR = 3
const PER_HOUR = 30
const HOUR = 60 * 60 * 1000
const recent = new Map<string, number[]>()

async function tooMany(): Promise<boolean> {
  const ip = (await headers()).get('x-forwarded-for')?.split(',')[0].trim() || 'unknown'
  const now = Date.now()
  const times = (recent.get(ip) || []).filter((t) => now - t < HOUR)
  if (times.length >= PER_VISITOR) return true
  recent.set(ip, [...times, now])
  const payload = await getPayloadClient()
  const { totalDocs } = await payload.count({
    collection: 'reviews',
    where: { and: [{ status: { equals: 'pending' } }, { createdAt: { greater_than: new Date(now - HOUR).toISOString() } }] },
  })
  return totalDocs >= PER_HOUR
}

/** Saves a review from a department's Reviews page as Pending; staff publish it in /admin. */
export async function submitReview(_prev: ReviewFormState, form: FormData): Promise<ReviewFormState> {
  // Bots fill in the hidden "website" field; quietly accept and drop those.
  if (text(form.get('website'), 200)) return { ok: true, message: 'Thank you for your review.' }

  const department = Number(form.get('department'))
  const rating = Number(form.get('rating'))
  const name = text(form.get('name'), 60)
  const location = text(form.get('location'), 80)
  const email = text(form.get('email'), 120)
  const quote = text(form.get('quote'), 2000)

  if (!Number.isInteger(department) || department <= 0) return { ok: false, message: 'Something went wrong. Please try again.' }
  if (!(rating >= 1 && rating <= 5)) return { ok: false, message: 'Please choose a star rating.' }
  if (!name) return { ok: false, message: 'Please add your first name.' }
  if (quote.length < 20) return { ok: false, message: 'Please write a little more about your experience (at least 20 characters).' }
  if (form.get('consent') !== 'on') return { ok: false, message: 'Please confirm we may publish your review.' }

  try {
    if (await tooMany()) return { ok: false, message: 'We’ve had a lot of reviews just now. Please try again in an hour.' }
    const payload = await getPayloadClient()
    await payload.create({
      collection: 'reviews',
      data: { department, rating, name, location: location || undefined, email: email || undefined, quote, status: 'pending', date: new Date().toISOString() },
      overrideAccess: true,
    })
  } catch {
    return { ok: false, message: 'We couldn’t save your review just now. Please try again in a moment.' }
  }
  return { ok: true, message: 'Thank you! Your review will appear here once our team has checked it.' }
}
