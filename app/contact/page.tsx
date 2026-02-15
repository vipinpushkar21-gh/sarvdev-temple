import Hero from '../../components/Hero'

export default function ContactPage() {
  return (
    <>
      <Hero title="Contact Us" subtitle="We'd love to hear from you!" />
      <main className="content-container section-sm">
      
      <div className="space-y-8">
        <div>
          <h2 className="text-h2 font-serif text-secondary-700 mb-3">Get in Touch</h2>
          <p className="text-body text-ink-muted leading-relaxed">
            Whether you have questions, feedback, or want to list your temple on our platform, feel free to reach out.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="card p-5">
            <h3 className="text-h4 text-secondary-700 mb-2">Email</h3>
            <a href="mailto:info@sarvdev.com" className="text-primary-600 no-underline hover:underline">info@sarvdev.com</a>
          </div>

          <div className="card p-5">
            <h3 className="text-h4 text-secondary-700 mb-2">Phone</h3>
            <a href="tel:+911234567890" className="text-primary-600 no-underline hover:underline">+91 123 456 7890</a>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-h3 font-serif text-secondary-700 mb-4">Send us a Message</h3>
          <form className="space-y-4">
            <div>
              <label className="label">Name</label>
              <input type="text" className="input" placeholder="Your name" />
            </div>
            <div>
              <label className="label">Email</label>
              <input type="email" className="input" placeholder="your@email.com" />
            </div>
            <div>
              <label className="label">Message</label>
              <textarea rows={5} className="input" placeholder="Your message..."></textarea>
            </div>
            <button type="submit" className="btn btn-primary">
              Send Message
            </button>
          </form>
        </div>
      </div>
      </main>
    </>
  )
}
