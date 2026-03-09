import Hero from '../../components/Hero'

export default function TermsPage() {
  return (
    <>
      <Hero title="Terms of Service" subtitle="Please read these terms carefully before using Sarvdev" />
      <main className="content-container section-sm">
      
      <div className="relative card overflow-hidden max-w-3xl mx-auto">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary" />
        <div className="p-6 md:p-8 space-y-8 text-ink">
          <p className="text-caption text-ink-faint">Last Updated: March 2026</p>

          <div>
            <h2 className="text-h3 font-serif text-secondary-700 mb-3">1. Acceptance of Terms</h2>
            <p className="text-body-sm text-ink-muted leading-relaxed">
              By accessing and using Sarvdev Temple Directory, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service.
            </p>
          </div>

          <div>
            <h2 className="text-h3 font-serif text-secondary-700 mb-3">2. Service Description</h2>
            <p className="text-body-sm text-ink-muted leading-relaxed">
              Sarvdev is a temple directory platform that allows users to discover temples, view temple information, and list their own temples. We provide this service free of charge to promote spiritual accessibility.
            </p>
          </div>

          <div>
            <h2 className="text-h3 font-serif text-secondary-700 mb-3">3. User Responsibilities</h2>
            <p className="text-body-sm text-ink-muted leading-relaxed">When using our service, you agree to:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1 text-body-sm text-ink-muted">
              <li>Provide accurate and truthful information when listing temples</li>
              <li>Not submit misleading, fraudulent, or offensive content</li>
              <li>Respect the religious sentiments of all communities</li>
              <li>Not use the service for any unlawful purposes</li>
              <li>Maintain the confidentiality of your account credentials</li>
            </ul>
          </div>

          <div>
            <h2 className="text-h3 font-serif text-secondary-700 mb-3">4. Content Moderation</h2>
            <p className="text-body-sm text-ink-muted leading-relaxed">
              We reserve the right to review, approve, reject, or remove any temple listing or content that violates these terms or is deemed inappropriate. All submissions are subject to approval before being published.
            </p>
          </div>

          <div>
            <h2 className="text-h3 font-serif text-secondary-700 mb-3">5. Intellectual Property</h2>
            <p className="text-body-sm text-ink-muted leading-relaxed">
              The Sarvdev platform, including its design, features, and content, is protected by copyright and other intellectual property laws. You may not copy, modify, or distribute our content without permission.
            </p>
          </div>

          <div>
            <h2 className="text-h3 font-serif text-secondary-700 mb-3">6. Disclaimer of Warranties</h2>
            <p className="text-body-sm text-ink-muted leading-relaxed">
              Sarvdev is provided &ldquo;as is&rdquo; without warranties of any kind. We do not guarantee the accuracy, completeness, or reliability of temple information. Users should verify details independently before visiting.
            </p>
          </div>

          <div>
            <h2 className="text-h3 font-serif text-secondary-700 mb-3">7. Limitation of Liability</h2>
            <p className="text-body-sm text-ink-muted leading-relaxed">
              Sarvdev and its operators shall not be liable for any damages arising from the use or inability to use our service, including but not limited to travel issues, scheduling conflicts, or inaccurate information.
            </p>
          </div>

          <div>
            <h2 className="text-h3 font-serif text-secondary-700 mb-3">8. Changes to Terms</h2>
            <p className="text-body-sm text-ink-muted leading-relaxed">
              We may update these Terms of Service from time to time. Continued use of the service after changes constitutes acceptance of the new terms.
            </p>
          </div>

          <div>
            <h2 className="text-h3 font-serif text-secondary-700 mb-3">9. Contact</h2>
            <p className="text-body-sm text-ink-muted leading-relaxed">
              For questions about these Terms of Service, please <a href="/contact" className="text-primary-600 font-semibold hover:text-primary-700 transition-colors">contact us</a>.
            </p>
          </div>
        </div>
      </div>
      </main>
    </>
  )
}
