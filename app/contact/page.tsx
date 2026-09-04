'use client'

import { useState } from 'react'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault(); setError(''); setSuccess(false); setLoading(true)
    try {
      const response = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      const data = await response.json()
      if (response.ok) { setSuccess(true); setForm({ name: '', email: '', message: '' }) } else setError(data.error || 'Unable to send your message.')
    } catch { setError('A network error occurred. Please try again.') } finally { setLoading(false) }
  }

  return <main className="bg-surface pb-20"><div className="page-container py-12 sm:py-16"><header className="max-w-3xl border-l-2 border-primary-700 pl-5"><p className="text-overline font-semibold uppercase tracking-[.18em] text-primary-700">Contact</p><h1 className="mt-3 font-serif text-4xl text-ink sm:text-5xl">Write to Sarvdev.</h1><p className="mt-5 text-lg leading-8 text-ink-muted">Share a question, correction, or considered feedback about Sarvdev.</p></header><div className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,1fr)_18rem]"><section className="border-t border-surface-border pt-6"><h2 className="font-serif text-3xl text-ink">Send a message</h2><p className="mt-2 text-sm text-ink-muted">Fields marked required help us understand your message.</p>{success && <p role="status" className="mt-6 border-l-2 border-primary-700 bg-primary-50 px-4 py-3 text-sm text-ink">Thank you. Your message has been sent.</p>}{error && <p role="alert" className="mt-6 border-l-2 border-red-700 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>}<form onSubmit={handleSubmit} className="mt-7 space-y-5"><div className="grid gap-5 sm:grid-cols-2"><label className="label">Name<input required value={form.name} onChange={event => setForm(current => ({ ...current, name: event.target.value }))} className="input mt-2" placeholder="Your name" /></label><label className="label">Email<input required type="email" value={form.email} onChange={event => setForm(current => ({ ...current, email: event.target.value }))} className="input mt-2" placeholder="you@example.com" /></label></div><label className="label">Message<textarea required minLength={10} rows={6} value={form.message} onChange={event => setForm(current => ({ ...current, message: event.target.value }))} className="input mt-2" placeholder="Your message" /></label><button disabled={loading} className="btn btn-primary disabled:opacity-60">{loading ? 'Sending…' : 'Send message'}</button></form></section><aside className="border-t border-surface-border pt-6"><p className="text-overline uppercase tracking-[.16em] text-primary-700">Email</p><a className="mt-3 inline-block font-serif text-xl text-ink no-underline hover:text-primary-700" href="mailto:info@sarvdev.com">info@sarvdev.com</a><p className="mt-4 text-sm leading-6 text-ink-muted">For temple submissions, use the dedicated List a Temple form so the right details are included.</p></aside></div></div></main>
}
