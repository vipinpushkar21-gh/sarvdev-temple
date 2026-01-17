export default function ContactPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-primary mb-6">Contact Us</h1>
      
      <div className="space-y-6 bg-background p-8 rounded-2xl shadow-lg border border-accent text-text">
        <div>
          <h2 className="text-2xl font-semibold text-primary mb-4">Get in Touch</h2>
          <p className="leading-relaxed">
            We'd love to hear from you! Whether you have questions, feedback, or want to list your temple on our platform, feel free to reach out.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-background p-6 rounded-lg border border-accent">
            <h3 className="font-semibold text-lg text-primary mb-2">📧 Email</h3>
            <a href="mailto:info@sarvdev.com" className="hover:underline">info@sarvdev.com</a>
          </div>

          <div className="bg-background p-6 rounded-lg border border-accent">
            <h3 className="font-semibold text-lg text-primary mb-2">📞 Phone</h3>
            <a href="tel:+911234567890" className="hover:underline">+91 123 456 7890</a>
          </div>
        </div>

        <div className="bg-background p-6 rounded-lg border border-accent">
          <h3 className="font-semibold text-lg text-primary mb-3">Send us a Message</h3>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text mb-1">Name</label>
              <input type="text" className="w-full rounded-lg border border-accent bg-background text-text px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-400" placeholder="Your name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-1">Email</label>
              <input type="email" className="w-full rounded-lg border border-accent bg-background text-text px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-400" placeholder="your@email.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-1">Message</label>
              <textarea rows={5} className="w-full rounded-lg border border-accent bg-background text-text px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-400" placeholder="Your message..."></textarea>
            </div>
            <button type="submit" className="btn btn-primary">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}
