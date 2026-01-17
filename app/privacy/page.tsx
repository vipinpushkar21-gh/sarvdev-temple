export default function PrivacyPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-primary mb-6">Privacy Policy</h1>
      
      <div className="space-y-6 bg-background p-8 rounded-2xl shadow-lg border border-accent text-text">
        <p className="text-sm text-text">Last Updated: December 2025</p>

        <div>
          <h2 className="text-2xl font-semibold text-primary mb-3">1. Information We Collect</h2>
          <p className="leading-relaxed">
            When you use Sarvdev Temple Directory, we may collect the following information:
          </p>
          <ul className="list-disc ml-6 mt-2 space-y-1">
            <li>Temple information submitted through our listing form</li>
            <li>Contact details (name, email, phone) when you reach out to us</li>
            <li>Usage data and analytics to improve our services</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-primary mb-3">2. How We Use Your Information</h2>
          <p className="leading-relaxed">
            We use the collected information to:
          </p>
          <ul className="list-disc ml-6 mt-2 space-y-1">
            <li>Provide and maintain our temple directory service</li>
            <li>Review and approve temple listings</li>
            <li>Respond to your inquiries and support requests</li>
            <li>Improve user experience and website functionality</li>
            <li>Send important updates about your submissions</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-primary mb-3">3. Data Security</h2>
          <p className="leading-relaxed">
            We implement appropriate security measures to protect your personal information from unauthorized access, alteration, or disclosure. Your data is stored securely in our database with encryption.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-primary mb-3">4. Information Sharing</h2>
          <p className="leading-relaxed">
            We do not sell, trade, or rent your personal information to third parties. Temple information submitted for public listing will be displayed on our website for visitors to view.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-primary mb-3">5. Your Rights</h2>
          <p className="leading-relaxed">
            You have the right to:
          </p>
          <ul className="list-disc ml-6 mt-2 space-y-1">
            <li>Access and review your submitted information</li>
            <li>Request corrections to inaccurate data</li>
            <li>Request deletion of your personal information</li>
            <li>Opt-out of communications</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-primary mb-3">6. Cookies</h2>
          <p className="leading-relaxed">
            We use cookies to enhance your browsing experience and analyze website traffic. You can disable cookies in your browser settings, though some features may not function properly.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-primary mb-3">7. Contact Us</h2>
          <p className="leading-relaxed">
            If you have questions about this Privacy Policy, please <a href="/contact" className="hover:underline">contact us</a>.
          </p>
        </div>
      </div>
    </main>
  )
}
