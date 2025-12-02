export default function HelpPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-orange-800 mb-6">Help Center</h1>
      
      <div className="space-y-8 bg-gradient-to-br from-white to-orange-50/30 p-8 rounded-2xl shadow-lg">
        <div>
          <h2 className="text-2xl font-semibold text-orange-700 mb-4">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg border border-orange-100">
            <h3 className="font-semibold text-lg text-orange-700 mb-2">How do I list my temple?</h3>
            <p className="text-slate-700">
              Visit the <a href="/list-temple" className="text-orange-600 hover:underline">List Temple</a> page and fill out the form with your temple details. Our team will review and approve it within 2-3 business days.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg border border-orange-100">
            <h3 className="font-semibold text-lg text-orange-700 mb-2">How can I search for temples?</h3>
            <p className="text-slate-700">
              Use the search bar on the homepage or visit our <a href="/temples" className="text-orange-600 hover:underline">Temples</a> page to browse all listed temples. You can filter by location, deity, and more.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg border border-orange-100">
            <h3 className="font-semibold text-lg text-orange-700 mb-2">Can I edit temple information?</h3>
            <p className="text-slate-700">
              Temple administrators can log in to edit their temple details. If you're the temple representative, please <a href="/contact" className="text-orange-600 hover:underline">contact us</a> to get admin access.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg border border-orange-100">
            <h3 className="font-semibold text-lg text-orange-700 mb-2">Is the service free?</h3>
            <p className="text-slate-700">
              Yes! Sarvdev Temple Directory is completely free for temple listings and visitors. Our mission is to make spiritual resources accessible to everyone.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg border border-orange-100">
            <h3 className="font-semibold text-lg text-orange-700 mb-2">How do I report incorrect information?</h3>
            <p className="text-slate-700">
              If you notice any incorrect temple information, please <a href="/contact" className="text-orange-600 hover:underline">contact us</a> with the details and we'll update it promptly.
            </p>
          </div>
        </div>

        <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
          <h3 className="font-semibold text-lg text-orange-700 mb-2">Still have questions?</h3>
          <p className="text-slate-700">
            Can't find what you're looking for? <a href="/contact" className="text-orange-600 hover:underline font-medium">Contact our support team</a> and we'll be happy to help!
          </p>
        </div>
      </div>
    </main>
  )
}
