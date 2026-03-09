'use client'

import { useState } from 'react'
import Hero from '../../components/Hero'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess(false)
    setLoading(true)

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()

      if (res.ok) {
        setSuccess(true)
        setForm({ name: '', email: '', message: '' })
      } else {
        setError(data.error || 'Failed to send message')
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

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
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
            </div>
            <div>
              <h3 className="text-h4 text-secondary-700 mb-1.5">Email Us Directly</h3>
              <a href="mailto:info@sarvdev.com" className="text-primary-600 font-medium no-underline hover:text-primary-700 transition-colors">info@sarvdev.com</a>
              <p className="text-caption text-ink-muted mt-1">For partnerships and collaborations</p>
            </div>
          </div>
        </div>

        <div className="relative card overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary" />
          <div className="p-6 md:p-8">
            <h3 className="text-h3 font-serif text-secondary-700 mb-6">Send us a Message</h3>

            {success && (
              <div className="mb-5 flex items-center gap-2.5 border border-green-200 text-semantic-success bg-green-50 px-4 py-3 rounded-xl text-body-sm">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Message sent successfully! We will get back to you soon.
              </div>
            )}

            {error && (
              <div className="mb-5 flex items-center gap-2.5 border border-red-200 text-semantic-error bg-red-50 px-4 py-3 rounded-xl text-body-sm">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="label">Name</label>
                  <input
                    type="text"
                    className="input"
                    placeholder="Your name"
                    value={form.name}
                    onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label className="label">Email</label>
                  <input
                    type="email"
                    className="input"
                    placeholder="your@email.com"
                    value={form.email}
                    onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="label">Message</label>
                <textarea
                  rows={5}
                  className="input"
                  placeholder="Your message (minimum 10 characters)..."
                  value={form.message}
                  onChange={(e) => setForm(f => ({ ...f, message: e.target.value }))}
                  required
                  minLength={10}
                ></textarea>
              </div>
              <button type="submit" disabled={loading} className="btn btn-primary btn-lg group disabled:opacity-60">
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                    Sending...
                  </span>
                ) : (
                  <>
                    Send Message
                    <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" /></svg>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
      </main>
    </>
  )
}
