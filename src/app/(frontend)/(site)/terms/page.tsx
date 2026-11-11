import type { Metadata } from 'next'
import { MAIN_PHONE, tel } from '@/lib/content'

export const metadata: Metadata = {
  title: 'Terms of use',
  description: 'The terms for using the SH Medical website. The site gives general information and is not medical advice.',
}

export default function Terms() {
  return (
    <>
      <section className="page-heading">
        <div className="wrap">
          <p className="eyebrow">Terms</p>
          <h1 className="h1">Terms of use</h1>
          <p className="lede">By using this website you agree to these terms.</p>
        </div>
      </section>
      <section className="section">
        <div className="wrap prose">
          <h2>General information, not medical advice</h2>
          <p>
            This website describes SH Medical’s services, specialists and offices. It gives general information only. It isn’t medical advice and doesn’t
            replace a visit with a clinician. Using the site doesn’t make you a patient of SH Medical.
          </p>

          <h2>Emergencies</h2>
          <p>If you think you have a medical emergency, call 911 or go to the nearest emergency room. Don’t use this website to ask for urgent help.</p>

          <h2>Results vary</h2>
          <p>
            Reviews and before-and-after photos describe individual experiences. They don’t promise a particular result; outcomes differ from person to
            person.
          </p>

          <h2>Accuracy</h2>
          <p>
            We work to keep hours, locations, insurance and provider details current, but they can change. Please call your office to confirm before a
            visit.
          </p>

          <h2>Content and links</h2>
          <p>
            The text, photos and logos on this site belong to SH Medical or are used with permission. Links to other websites are provided for convenience;
            we aren’t responsible for their content.
          </p>

          <h2>Changes</h2>
          <p>We may update these terms from time to time. The current version is always on this page.</p>

          <h2>Questions</h2>
          <p>
            Call us at <a href={tel(MAIN_PHONE)}>{MAIN_PHONE}</a>.
          </p>
        </div>
      </section>
    </>
  )
}
