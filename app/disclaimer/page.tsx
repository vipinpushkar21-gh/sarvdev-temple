import type { Metadata } from 'next'
import Hero from '../../components/Hero'

export const metadata: Metadata = {
  title: 'Disclaimer',
  description: 'Read the disclaimer for Sarvdev Temple Directory & Devotional Hub. Important information about the use of content and services.',
  alternates: { canonical: 'https://sarvdev.com/disclaimer' },
}

export default function DisclaimerPage() {
  return (
    <>
      <Hero title="Disclaimer" subtitle="Important information about Sarvdev content and services" />
      <main className="content-container section-sm">
        <div className="relative card overflow-hidden max-w-3xl mx-auto">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary" />
          <div className="p-6 md:p-8 space-y-8 text-ink">
            <p className="text-caption text-ink-faint">Last Updated: May 2026</p>

            <div>
              <h2 className="text-h3 font-serif text-secondary-700 mb-3">1. General Information</h2>
              <p className="text-body-sm text-ink-muted leading-relaxed">
                The information provided on Sarvdev (&ldquo;the Website&rdquo;) is for general informational and
                educational purposes only. While we strive to keep the information accurate and up-to-date,
                we make no representations or warranties of any kind, express or implied, about the completeness,
                accuracy, reliability, or availability of the website or the information contained on it.
              </p>
            </div>

            <div>
              <h2 className="text-h3 font-serif text-secondary-700 mb-3">2. Temple Information</h2>
              <p className="text-body-sm text-ink-muted leading-relaxed">
                Temple details including timings, contact information, directions, and descriptions are provided
                as a reference. These may change without notice. We recommend verifying important details directly
                with the temple authorities before planning a visit. Sarvdev is not responsible for any
                inconvenience caused by outdated or inaccurate temple information.
              </p>
            </div>

            <div>
              <h2 className="text-h3 font-serif text-secondary-700 mb-3">3. Devotional Content</h2>
              <p className="text-body-sm text-ink-muted leading-relaxed">
                Devotional content including lyrics, translations, and audio is provided for personal spiritual
                use. We make every effort to present accurate lyrics and translations, but variations may exist
                across traditions and regional practices. The content is not intended as a definitive religious
                authority.
              </p>
            </div>

            <div>
              <h2 className="text-h3 font-serif text-secondary-700 mb-3">4. No Professional Advice</h2>
              <p className="text-body-sm text-ink-muted leading-relaxed">
                Content related to panchang, astrology, vastu, or spiritual practices is for informational
                purposes only and should not be considered as professional religious, astrological, or medical
                advice. Always consult qualified professionals for specific guidance.
              </p>
            </div>

            <div>
              <h2 className="text-h3 font-serif text-secondary-700 mb-3">5. User-Submitted Content</h2>
              <p className="text-body-sm text-ink-muted leading-relaxed">
                Sarvdev accepts temple listings and content submissions from users. While we review all
                submissions, we are not responsible for the accuracy of user-submitted information. If you
                find any inaccurate information, please{' '}
                <a href="/contact" className="text-primary-600 font-semibold hover:text-primary-700 transition-colors">
                  contact us
                </a>{' '}
                for correction.
              </p>
            </div>

            <div>
              <h2 className="text-h3 font-serif text-secondary-700 mb-3">6. External Links</h2>
              <p className="text-body-sm text-ink-muted leading-relaxed">
                The Website may contain links to external websites. Sarvdev has no control over the content
                and nature of these sites. The inclusion of any links does not imply endorsement or
                recommendation.
              </p>
            </div>

            <div>
              <h2 className="text-h3 font-serif text-secondary-700 mb-3">7. Limitation of Liability</h2>
              <p className="text-body-sm text-ink-muted leading-relaxed">
                In no event shall Sarvdev or its contributors be liable for any loss or damage including,
                without limitation, indirect or consequential loss or damage arising from the use of this
                website or reliance on any information provided.
              </p>
            </div>

            <div>
              <h2 className="text-h3 font-serif text-secondary-700 mb-3">8. Contact</h2>
              <p className="text-body-sm text-ink-muted leading-relaxed">
                If you have questions about this Disclaimer, please{' '}
                <a href="/contact" className="text-primary-600 font-semibold hover:text-primary-700 transition-colors">
                  contact us
                </a>.
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
