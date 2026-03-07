import Hero from '../../components/Hero'
import Link from 'next/link'

const faqs = [
  {
    q: 'How do I list my temple?',
    a: 'Visit the <a href="/list-temple" class="text-primary-600 font-semibold hover:text-primary-700 transition-colors">List Temple</a> page and fill out the form with your temple details. Our team will review and approve it within 2-3 business days.',
    icon: '🏛️',
  },
  {
    q: 'How can I search for temples?',
    a: 'Use the search bar on the homepage or visit our <a href="/temples" class="text-primary-600 font-semibold hover:text-primary-700 transition-colors">Temples</a> page to browse all listed temples. You can filter by location, deity, and more.',
    icon: '🔍',
  },
  {
    q: 'Can I edit temple information?',
    a: 'Temple administrators can log in to edit their temple details. If you\'re the temple representative, please <a href="/contact" class="text-primary-600 font-semibold hover:text-primary-700 transition-colors">contact us</a> to get admin access.',
    icon: '✏️',
  },
  {
    q: 'Is the service free?',
    a: 'Yes! Sarvdev Temple Directory is completely free for temple listings and visitors. Our mission is to make spiritual resources accessible to everyone.',
    icon: '🆓',
  },
  {
    q: 'How do I report incorrect information?',
    a: 'If you notice any incorrect temple information, please <a href="/contact" class="text-primary-600 font-semibold hover:text-primary-700 transition-colors">contact us</a> with the details and we\'ll update it promptly.',
    icon: '🚩',
  },
]

export default function HelpPage() {
  return (
    <>
      <Hero title="Help Center" subtitle="Find answers to common questions about Sarvdev Temple Directory" />
      <main className="content-container section-sm">
        <div className="space-y-10">
          <div className="text-center">
            <h2 className="section-title">Frequently Asked Questions</h2>
            <div className="mt-3 mx-auto w-16 h-1 rounded-full bg-gradient-to-r from-primary to-accent" />
          </div>

          <div className="space-y-4 max-w-3xl mx-auto">
            {faqs.map((faq, i) => (
              <div key={i} className="group card-interactive p-5 md:p-6">
                <div className="flex items-start gap-4">
                  <span className="text-xl flex-shrink-0 mt-0.5">{faq.icon}</span>
                  <div>
                    <h3 className="text-h4 text-secondary-700 group-hover:text-primary-600 transition-colors mb-2">{faq.q}</h3>
                    <p className="text-body-sm text-ink-muted leading-relaxed" dangerouslySetInnerHTML={{ __html: faq.a }} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="relative card overflow-hidden max-w-3xl mx-auto">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary" />
            <div className="p-6 md:p-8 text-center">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/20">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" /></svg>
              </div>
              <h3 className="text-h3 font-serif text-secondary-700 mb-2">Still have questions?</h3>
              <p className="text-body-sm text-ink-muted mb-5">
                Can&apos;t find what you&apos;re looking for? Our support team is here to help!
              </p>
              <Link href="/contact" className="btn btn-primary no-underline hover:no-underline group">
                Contact Support
                <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
