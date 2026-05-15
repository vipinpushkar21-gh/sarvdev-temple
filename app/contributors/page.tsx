import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Contributors & Team — Sarvdev',
  description: 'Meet the Sarvdev editorial team and learn how to contribute to India\'s largest open temple directory.',
  alternates: { canonical: 'https://sarvdev.com/contributors' },
}

export default function ContributorsPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-primary-50 via-surface to-accent-50/30 border-b border-surface-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <h1 className="text-display font-serif text-secondary-800 mb-3">Contributors & Team</h1>
          <p className="text-body text-ink-muted max-w-2xl">
            Sarvdev is built by a passionate team committed to preserving and sharing India&apos;s spiritual heritage.
          </p>
        </div>
      </section>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        <section>
          <h2 className="text-h3 font-serif text-secondary-800 mb-4">Sarvdev Editorial Team</h2>
          <p className="text-body text-ink-muted leading-relaxed mb-6">
            Our editorial team researches, writes, and maintains all content on Sarvdev. Every temple listing, devotional entry, and blog article is reviewed for accuracy, cultural sensitivity, and completeness.
          </p>
          <div className="card p-6 flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-lg shrink-0">S</div>
            <div>
              <h3 className="text-body font-semibold text-ink">Sarvdev Editorial Team</h3>
              <p className="text-body-sm text-ink-muted">Spiritual Content & Temple Research</p>
              <p className="text-caption text-ink-faint mt-2">Responsible for fact-checking, content quality, and ensuring respectful representation of all Hindu traditions.</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-h3 font-serif text-secondary-800 mb-4">Community Contributors</h2>
          <p className="text-body text-ink-muted leading-relaxed mb-4">
            Sarvdev is enriched by contributions from devotees, temple committees, and spiritual communities across India. Our platform welcomes temple submissions, corrections, and suggestions from everyone.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="card p-5">
              <h3 className="text-body font-semibold text-ink mb-2">Temple Committees</h3>
              <p className="text-body-sm text-ink-muted">Official temple representatives who verify and update temple information.</p>
            </div>
            <div className="card p-5">
              <h3 className="text-body font-semibold text-ink mb-2">Devotee Contributors</h3>
              <p className="text-body-sm text-ink-muted">Devotees who submit new temples, suggest corrections, and share local knowledge.</p>
            </div>
            <div className="card p-5">
              <h3 className="text-body font-semibold text-ink mb-2">Cultural Researchers</h3>
              <p className="text-body-sm text-ink-muted">Scholars and researchers who help verify historical and mythological content.</p>
            </div>
            <div className="card p-5">
              <h3 className="text-body font-semibold text-ink mb-2">Photographers</h3>
              <p className="text-body-sm text-ink-muted">Photographers who contribute temple images and darshan photos.</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-h3 font-serif text-secondary-800 mb-4">How to Contribute</h2>
          <div className="space-y-3">
            <div className="card p-5 flex items-start gap-3">
              <span className="text-primary-500 font-bold">1.</span>
              <div>
                <h3 className="text-body font-semibold text-ink">Submit a Temple</h3>
                <p className="text-body-sm text-ink-muted">Use our <Link href="/list-temple" className="text-primary-600 hover:text-primary-700 font-medium">List a Temple</Link> form to add a new temple to the directory.</p>
              </div>
            </div>
            <div className="card p-5 flex items-start gap-3">
              <span className="text-primary-500 font-bold">2.</span>
              <div>
                <h3 className="text-body font-semibold text-ink">Report Corrections</h3>
                <p className="text-body-sm text-ink-muted">Found an error? <Link href="/contact" className="text-primary-600 hover:text-primary-700 font-medium">Contact us</Link> with details and we&apos;ll fix it promptly.</p>
              </div>
            </div>
            <div className="card p-5 flex items-start gap-3">
              <span className="text-primary-500 font-bold">3.</span>
              <div>
                <h3 className="text-body font-semibold text-ink">Share Knowledge</h3>
                <p className="text-body-sm text-ink-muted">Share local temple traditions, festival details, or devotional content ideas with our editorial team.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="card p-6 bg-primary-50 border-primary-100">
          <h2 className="text-h4 font-serif text-secondary-800 mb-2">Join Our Mission</h2>
          <p className="text-body-sm text-ink-muted mb-4">
            Help us build India&apos;s most comprehensive and accurate temple directory. Every contribution, however small, helps preserve our spiritual heritage for future generations.
          </p>
          <div className="flex gap-3">
            <Link href="/list-temple" className="btn btn-primary btn-sm no-underline hover:no-underline">Submit Temple</Link>
            <Link href="/contact" className="btn btn-outline btn-sm no-underline hover:no-underline">Contact Us</Link>
          </div>
        </section>
      </main>
    </>
  )
}
