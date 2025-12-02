export default function TermsPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-orange-800 mb-6">Terms of Service</h1>
      
      <div className="space-y-6 bg-gradient-to-br from-white to-orange-50/30 p-8 rounded-2xl shadow-lg text-slate-700">
        <p className="text-sm text-slate-500">Last Updated: December 2025</p>

        <div>
          <h2 className="text-2xl font-semibold text-orange-700 mb-3">1. Acceptance of Terms</h2>
          <p className="leading-relaxed">
            By accessing and using Sarvdev Temple Directory, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-orange-700 mb-3">2. Service Description</h2>
          <p className="leading-relaxed">
            Sarvdev is a temple directory platform that allows users to discover temples, view temple information, and list their own temples. We provide this service free of charge to promote spiritual accessibility.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-orange-700 mb-3">3. User Responsibilities</h2>
          <p className="leading-relaxed">When using our service, you agree to:</p>
          <ul className="list-disc ml-6 mt-2 space-y-1">
            <li>Provide accurate and truthful information when listing temples</li>
            <li>Not submit misleading, fraudulent, or offensive content</li>
            <li>Respect the religious sentiments of all communities</li>
            <li>Not use the service for any unlawful purposes</li>
            <li>Maintain the confidentiality of your account credentials</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-orange-700 mb-3">4. Content Moderation</h2>
          <p className="leading-relaxed">
            We reserve the right to review, approve, reject, or remove any temple listing or content that violates these terms or is deemed inappropriate. All submissions are subject to approval before being published.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-orange-700 mb-3">5. Intellectual Property</h2>
          <p className="leading-relaxed">
            The Sarvdev platform, including its design, features, and content, is protected by copyright and other intellectual property laws. You may not copy, modify, or distribute our content without permission.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-orange-700 mb-3">6. Disclaimer of Warranties</h2>
          <p className="leading-relaxed">
            Sarvdev is provided "as is" without warranties of any kind. We do not guarantee the accuracy, completeness, or reliability of temple information. Users should verify details independently before visiting.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-orange-700 mb-3">7. Limitation of Liability</h2>
          <p className="leading-relaxed">
            Sarvdev and its operators shall not be liable for any damages arising from the use or inability to use our service, including but not limited to travel issues, scheduling conflicts, or inaccurate information.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-orange-700 mb-3">8. Changes to Terms</h2>
          <p className="leading-relaxed">
            We may update these Terms of Service from time to time. Continued use of the service after changes constitutes acceptance of the new terms.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-orange-700 mb-3">9. Contact</h2>
          <p className="leading-relaxed">
            For questions about these Terms of Service, please <a href="/contact" className="text-orange-600 hover:underline">contact us</a>.
          </p>
        </div>
      </div>
    </main>
  )
}
