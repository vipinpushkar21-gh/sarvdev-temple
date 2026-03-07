import Hero from '../../components/Hero'

export default function ContactPage() {
  return (
    <>
      <Hero title="Contact Us" subtitle="We'd love to hear from you! Reach out for questions, feedback, or temple listings." />
      <main className="content-container section-sm">
      
      <div className="space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="group card-interactive p-6 flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-md shadow-primary/20 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
            </div>
            <div>
              <h3 className="text-h4 text-secondary-700 mb-1.5">Email</h3>
              <a href="mailto:info@sarvdev.com" className="text-primary-600 font-medium no-underline hover:text-primary-700 transition-colors">info@sarvdev.com</a>
              <p className="text-caption text-ink-muted mt-1">We typically respond within 24 hours</p>
            </div>
          </div>

          <div className="group card-interactive p-6 flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-accent to-primary flex items-center justify-center shadow-md shadow-accent/20 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>
            </div>
            <div>
              <h3 className="text-h4 text-secondary-700 mb-1.5">Phone</h3>
              <a href="tel:+911234567890" className="text-primary-600 font-medium no-underline hover:text-primary-700 transition-colors">+91 123 456 7890</a>
              <p className="text-caption text-ink-muted mt-1">Mon–Sat, 9 AM – 6 PM IST</p>
            </div>
          </div>
        </div>

        <div className="relative card overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary" />
          <div className="p-6 md:p-8">
            <h3 className="text-h3 font-serif text-secondary-700 mb-6">Send us a Message</h3>
            <form className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="label">Name</label>
                  <input type="text" className="input" placeholder="Your name" />
                </div>
                <div>
                  <label className="label">Email</label>
                  <input type="email" className="input" placeholder="your@email.com" />
                </div>
              </div>
              <div>
                <label className="label">Message</label>
                <textarea rows={5} className="input" placeholder="Your message..."></textarea>
              </div>
              <button type="submit" className="btn btn-primary btn-lg group">
                Send Message
                <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" /></svg>
              </button>
            </form>
          </div>
        </div>
      </div>
      </main>
    </>
  )
}
