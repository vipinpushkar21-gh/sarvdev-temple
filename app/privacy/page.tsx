import Hero from '../../components/Hero'

export default function PrivacyPage() {
  return (
    <>
      <Hero title="Privacy Policy" subtitle="Our commitment to your privacy" />
      <main className="content-container section-sm">
      
      <div className="relative card overflow-hidden max-w-3xl mx-auto">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary" />
        <div className="p-6 md:p-8 space-y-8 text-ink">
          <p className="text-caption text-ink-faint">Last Updated: March 2026</p>

          <div>
            <h2 className="text-h3 font-serif text-secondary-700 mb-3">1. Information We Collect</h2>
            <p className="text-body-sm text-ink-muted leading-relaxed">
              When you use Sarvdev Temple Directory, we may collect the following information:
            </p>
            <ul className="list-disc ml-6 mt-2 space-y-1 text-body-sm text-ink-muted">
              <li>Temple information submitted through our listing form</li>
              <li>Contact details (name, email, phone) when you reach out to us</li>
              <li>Usage data and analytics to improve our services</li>
            </ul>
          </div>

          <div>
            <h2 className="text-h3 font-serif text-secondary-700 mb-3">2. How We Use Your Information</h2>
            <p className="text-body-sm text-ink-muted leading-relaxed">We use the collected information to:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1 text-body-sm text-ink-muted">
              <li>Provide and maintain our temple directory service</li>
              <li>Review and approve temple listings</li>
              <li>Respond to your inquiries and support requests</li>
              <li>Improve user experience and website functionality</li>
              <li>Send important updates about your submissions</li>
            </ul>
          </div>

          <div>
            <h2 className="text-h3 font-serif text-secondary-700 mb-3">3. Data Security</h2>
            <p className="text-body-sm text-ink-muted leading-relaxed">
              We implement appropriate security measures to protect your personal information from unauthorized access, alteration, or disclosure. Your data is stored securely in our database with encryption.
            </p>
          </div>

          <div>
            <h2 className="text-h3 font-serif text-secondary-700 mb-3">4. Information Sharing</h2>
            <p className="text-body-sm text-ink-muted leading-relaxed">
              We do not sell, trade, or rent your personal information to third parties. Temple information submitted for public listing will be displayed on our website for visitors to view.
            </p>
          </div>

          <div>
            <h2 className="text-h3 font-serif text-secondary-700 mb-3">5. Your Rights</h2>
            <p className="text-body-sm text-ink-muted leading-relaxed">You have the right to:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1 text-body-sm text-ink-muted">
              <li>Access and review your submitted information</li>
              <li>Request corrections to inaccurate data</li>
              <li>Request deletion of your personal information</li>
              <li>Opt-out of communications</li>
            </ul>
          </div>

          <div>
            <h2 className="text-h3 font-serif text-secondary-700 mb-3">6. Cookies</h2>
            <p className="text-body-sm text-ink-muted leading-relaxed">
              We use cookies to enhance your browsing experience and analyze website traffic. You can disable cookies in your browser settings, though some features may not function properly.
            </p>
          </div>

          <div>
            <h2 className="text-h3 font-serif text-secondary-700 mb-3">7. Contact Us</h2>
            <p className="text-body-sm text-ink-muted leading-relaxed">
              If you have questions about this Privacy Policy, please <a href="/contact" className="text-primary-600 font-semibold hover:text-primary-700 transition-colors">contact us</a>.
            </p>
          </div>
        </div>
      </div>
      </main>
    </>
  )
}
