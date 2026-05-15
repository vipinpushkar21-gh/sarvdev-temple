import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Editorial Policy — Sarvdev',
  description: 'Learn about Sarvdev\'s editorial standards, fact-checking process, and content quality guidelines for temple and devotional information.',
  alternates: { canonical: 'https://sarvdev.com/editorial-policy' },
}

export default function EditorialPolicyPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-primary-50 via-surface to-accent-50/30 border-b border-surface-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <h1 className="text-display font-serif text-secondary-800 mb-3">Editorial Policy</h1>
          <p className="text-body text-ink-muted max-w-2xl">
            Our commitment to accurate, respectful, and well-researched spiritual content.
          </p>
        </div>
      </section>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        <section>
          <h2 className="text-h3 font-serif text-secondary-800 mb-4">Our Mission</h2>
          <p className="text-body text-ink-muted leading-relaxed">
            Sarvdev is committed to providing accurate, accessible, and respectful information about Hindu temples, devotional traditions, and spiritual heritage across India and the world. Every piece of content published on our platform goes through an editorial review process to ensure quality and cultural sensitivity.
          </p>
        </section>

        <section>
          <h2 className="text-h3 font-serif text-secondary-800 mb-4">Content Standards</h2>
          <div className="space-y-3">
            {[
              { title: 'Accuracy', desc: 'All temple information including timings, location, history, and deity details are verified from multiple sources before publication.' },
              { title: 'Cultural Sensitivity', desc: 'Content is reviewed to ensure respectful representation of all Hindu traditions, deities, and spiritual practices.' },
              { title: 'Source Attribution', desc: 'Historical and mythological references are cross-referenced with established scriptures and authoritative texts.' },
              { title: 'Regular Updates', desc: 'Published content is periodically reviewed and updated to maintain accuracy, especially for timings and events.' },
              { title: 'Non-Sectarian Approach', desc: 'We cover all Hindu traditions equally — Shaiva, Vaishnava, Shakta, and Smarta — without bias or preference.' },
            ].map(item => (
              <div key={item.title} className="card p-5">
                <h3 className="text-body font-semibold text-ink mb-1">{item.title}</h3>
                <p className="text-body-sm text-ink-muted">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-h3 font-serif text-secondary-800 mb-4">Fact-Checking Process</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 rounded-lg bg-surface-sunken">
              <span className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 font-bold flex items-center justify-center text-sm shrink-0">1</span>
              <div>
                <h3 className="text-body font-semibold text-ink">Initial Research</h3>
                <p className="text-body-sm text-ink-muted">Content is drafted using primary sources including official temple websites, government tourism databases, and published scriptures.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 rounded-lg bg-surface-sunken">
              <span className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 font-bold flex items-center justify-center text-sm shrink-0">2</span>
              <div>
                <h3 className="text-body font-semibold text-ink">Editorial Review</h3>
                <p className="text-body-sm text-ink-muted">All content is reviewed by the Sarvdev Editorial Team for factual accuracy, cultural appropriateness, and completeness.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 rounded-lg bg-surface-sunken">
              <span className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 font-bold flex items-center justify-center text-sm shrink-0">3</span>
              <div>
                <h3 className="text-body font-semibold text-ink">Community Feedback</h3>
                <p className="text-body-sm text-ink-muted">Temple communities and devotees can suggest corrections through our contact form. User-submitted temples go through a moderation queue.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 rounded-lg bg-surface-sunken">
              <span className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 font-bold flex items-center justify-center text-sm shrink-0">4</span>
              <div>
                <h3 className="text-body font-semibold text-ink">Periodic Re-verification</h3>
                <p className="text-body-sm text-ink-muted">Content is periodically audited for accuracy. Timings and event information are updated seasonally.</p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-h3 font-serif text-secondary-800 mb-4">User-Submitted Content</h2>
          <p className="text-body text-ink-muted leading-relaxed mb-4">
            We welcome temple submissions from devotees and community members. All user-submitted temples enter a moderation queue where they are reviewed for accuracy, completeness, and cultural sensitivity before being published.
          </p>
          <p className="text-body text-ink-muted leading-relaxed">
            Submitters may be contacted for clarification during the review process. We reserve the right to edit submissions for accuracy and consistency with our editorial standards.
          </p>
        </section>

        <section>
          <h2 className="text-h3 font-serif text-secondary-800 mb-4">Corrections & Feedback</h2>
          <p className="text-body text-ink-muted leading-relaxed">
            If you find any inaccuracies in our content, please <Link href="/contact" className="text-primary-600 hover:text-primary-700 font-medium">contact us</Link>. We take all correction requests seriously and aim to address them within 48 hours.
          </p>
        </section>

        <div className="text-caption text-ink-faint pt-6 border-t border-surface-border">
          Last updated: May 2026
        </div>
      </main>
    </>
  )
}
