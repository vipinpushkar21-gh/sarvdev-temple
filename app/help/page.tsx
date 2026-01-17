export default function HelpPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-primary mb-6">Help Center</h1>
      
      <div className="space-y-8 bg-background p-8 rounded-2xl shadow-lg border border-accent">
        <div>
          <h2 className="text-2xl font-semibold text-primary mb-4">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-6">
          <div className="bg-background p-6 rounded-lg border border-accent">
            <h3 className="font-semibold text-lg text-primary mb-2">How do I list my temple?</h3>
            <p className="text-text">
              Visit the <a href="/list-temple" className="font-medium">List Temple</a> page and fill out the form with your temple details. Our team will review and approve it within 2-3 business days.
            </p>
          </div>

          <div className="bg-background p-6 rounded-lg border border-accent">
            <h3 className="font-semibold text-lg text-primary mb-2">How can I search for temples?</h3>
            <p className="text-text">
              Use the search bar on the homepage or visit our <a href="/temples" className="font-medium">Temples</a> page to browse all listed temples. You can filter by location, deity, and more.
            </p>
          </div>

          <div className="bg-background p-6 rounded-lg border border-accent">
            <h3 className="font-semibold text-lg text-primary mb-2">Can I edit temple information?</h3>
            <p className="text-text">
              Temple administrators can log in to edit their temple details. If you're the temple representative, please <a href="/contact" className="font-medium">contact us</a> to get admin access.
            </p>
          </div>

          <div className="bg-background p-6 rounded-lg border border-accent">
            <h3 className="font-semibold text-lg text-primary mb-2">Is the service free?</h3>
            <p className="text-text">
              Yes! Sarvdev Temple Directory is completely free for temple listings and visitors. Our mission is to make spiritual resources accessible to everyone.
            </p>
          </div>

          <div className="bg-background p-6 rounded-lg border border-accent">
            <h3 className="font-semibold text-lg text-primary mb-2">How do I report incorrect information?</h3>
            <p className="text-text">
              If you notice any incorrect temple information, please <a href="/contact" className="font-medium">contact us</a> with the details and we'll update it promptly.
            </p>
          </div>
        </div>

        <div className="bg-background p-6 rounded-lg border border-accent">
          <h3 className="font-semibold text-lg text-primary mb-2">Still have questions?</h3>
          <p className="text-text">
            Can't find what you're looking for? <a href="/contact" className="font-medium">Contact our support team</a> and we'll be happy to help!
          </p>
        </div>
      </div>
    </main>
  )
}
