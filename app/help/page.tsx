import Link from 'next/link'

const questions = [
  ['How do I find a temple?', 'Use the temple directory or search by a place, deity or sacred collection.'],
  ['How can I add a temple?', 'Use List a Temple to submit the details available to you. Submissions are not a promise of publication.'],
  ['How do I save something?', 'Use the bookmark control on supported public pages. Saved items are currently stored on this device.'],
  ['How do I report an issue?', 'Send the relevant page and correction through the contact form.'],
]

export default function HelpPage() {
  return <main className="bg-surface pb-20"><div className="page-container py-12 sm:py-16"><header className="max-w-3xl border-l-2 border-primary-700 pl-5"><p className="text-overline font-semibold uppercase tracking-[.18em] text-primary-700">Help</p><h1 className="mt-3 font-serif text-4xl text-ink sm:text-5xl">Using Sarvdev.</h1><p className="mt-5 text-lg leading-8 text-ink-muted">A few practical answers for exploring the platform.</p></header><section className="mt-14 max-w-4xl divide-y divide-surface-border border-y border-surface-border">{questions.map(([question, answer], index) => <article key={question} className="grid gap-3 py-6 sm:grid-cols-[3rem_1fr]"><p className="font-serif text-primary-700">0{index + 1}</p><div><h2 className="font-serif text-2xl text-ink">{question}</h2><p className="mt-2 text-sm leading-6 text-ink-muted">{answer}</p></div></article>)}</section><section className="mt-12 border-t border-surface-border pt-7"><p className="text-sm text-ink-muted">Need to share something specific?</p><Link href="/contact" className="mt-3 inline-block text-sm font-semibold text-primary-800 underline">Contact Sarvdev</Link></section></div></main>
}
