import { DEITY_FAQS } from './deity-faq-data'

export default function DeityFaq() {
  return (
    <section className="border-t border-surface-border py-section-sm">
      <div className="page-container max-w-3xl">
        <h2 className="font-display text-h2 text-secondary-800">Questions devotees ask</h2>
        <div className="mt-6 divide-y divide-surface-border border-y border-surface-border">
          {DEITY_FAQS.map((faq) => (
            <details key={faq.qEn} className="group py-4">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-4">
                <span>
                  <span className="block font-devanagari text-body text-secondary-800">{faq.q}</span>
                  <span className="mt-0.5 block text-caption text-ink-muted">{faq.qEn}</span>
                </span>
                <span className="mt-1 text-ink-muted transition-transform group-open:rotate-180" aria-hidden="true">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m6 9 6 6 6-6" />
                  </svg>
                </span>
              </summary>
              <p className="mt-3 font-devanagari text-body-sm leading-relaxed text-ink-muted">{faq.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
