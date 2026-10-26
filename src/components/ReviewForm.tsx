'use client'

import { useActionState, useState } from 'react'
import { submitReview, type ReviewFormState } from '@/lib/review-actions'

const initial: ReviewFormState = { ok: false, message: '' }

export function ReviewForm({ departmentId, brand }: { departmentId: number; brand: string }) {
  const [state, action, pending] = useActionState(submitReview, initial)
  const [rating, setRating] = useState(0)

  if (state.ok) {
    return (
      <div className="review-form review-form--done" role="status">
        <p className="serif" style={{ fontSize: 28, margin: 0 }}>Thank you</p>
        <p style={{ margin: 0 }}>{state.message}</p>
      </div>
    )
  }

  return (
    <form action={action} className="review-form" noValidate>
      <input type="hidden" name="department" value={departmentId} />
      <fieldset className="star-input">
        <legend>Your rating *</legend>
        <div className="star-row">
          {[1, 2, 3, 4, 5].map((n) => (
            <label key={n} className={n <= rating ? 'on' : undefined}>
              <input type="radio" name="rating" value={n} checked={rating === n} onChange={() => setRating(n)} />
              <span aria-hidden="true">★</span>
              <span className="visually-hidden">
                {n} star{n === 1 ? '' : 's'}
              </span>
            </label>
          ))}
        </div>
      </fieldset>
      <label className="field field--full">
        <span>Your review *</span>
        <textarea name="quote" rows={5} maxLength={2000} required placeholder={`Tell others about your experience with ${brand}.`} />
      </label>
      <label className="field">
        <span>First name *</span>
        <input name="name" maxLength={60} required autoComplete="given-name" />
      </label>
      <label className="field">
        <span>City (optional)</span>
        <input name="location" maxLength={80} placeholder="e.g. San Francisco, CA" />
      </label>
      <label className="field field--full">
        <span>Email (optional, never shown)</span>
        <input name="email" type="email" maxLength={120} autoComplete="email" />
      </label>
      {/* Hidden from people; bots fill it in. */}
      <label className="hp" aria-hidden="true">
        Website <input name="website" tabIndex={-1} autoComplete="off" />
      </label>
      <label className="consent field--full">
        <input type="checkbox" name="consent" />
        <span>I agree that {brand} may publish my review with my first name and city. Please don’t include private medical details.</span>
      </label>
      {state.message ? (
        <p className="form-error field--full" role="alert">
          {state.message}
        </p>
      ) : null}
      <div className="field--full">
        <button className="btn btn--clay" type="submit" disabled={pending}>
          {pending ? 'Sending…' : 'Submit review'}
        </button>
      </div>
    </form>
  )
}
