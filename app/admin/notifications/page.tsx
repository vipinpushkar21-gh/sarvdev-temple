"use client"

import { useState } from 'react'

export default function AdminNotificationsPage() {
  const [form, setForm] = useState({ title: '', body: '', url: '/' })
  const [sending, setSending] = useState(false)
  const [result, setResult] = useState<{ sent?: number; failed?: number; total?: number; message?: string; error?: string } | null>(null)

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title.trim() || !form.body.trim()) return
    setSending(true)
    setResult(null)
    try {
      const res = await fetch('/api/push/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      setResult(data)
    } catch {
      setResult({ error: 'Network error. Please try again.' })
    } finally {
      setSending(false)
    }
  }

  const PRESETS = [
    { title: '🪔 Festival Alert', body: 'Aaj ka mahatvapoorn tyohar! Darshan aur puja ke liye Sarvdev visit karein.', url: '/events' },
    { title: '🔴 Live Darshan LIVE', body: 'Abhi LIVE darshan chal raha hai! Abhi dekhein.', url: '/live-darshan' },
    { title: '🕉️ Daily Panchang', body: 'Aaj ka shubh muhurat aur panchang check karein.', url: '/panchang' },
    { title: '🛕 Naya Temple Added', body: 'Ek naya mandir Sarvdev directory mein joda gaya hai!', url: '/temples' },
  ]

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="admin-page-title">Push Notifications</h1>
        <p className="admin-section-subtitle">Sabhi subscribers ko festival reminders aur alerts bhejein</p>
      </div>

      {/* VAPID setup guide */}
      <div className="admin-card p-5 space-y-3" style={{ background: '#FFF7ED', borderColor: 'rgba(234,88,12,0.2)' }}>
        <h3 className="font-semibold text-gray-800 text-sm flex items-center gap-2">
          <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" /></svg>
          Setup Required (one-time)
        </h3>
        <ol className="text-xs text-gray-600 space-y-1.5 list-decimal list-inside">
          <li>Run: <code className="bg-gray-100 px-1.5 py-0.5 rounded font-mono">npx web-push generate-vapid-keys</code></li>
          <li>Add to <code className="bg-gray-100 px-1.5 py-0.5 rounded font-mono">.env.local</code>:
            <pre className="mt-1 bg-gray-900 text-green-400 text-xs p-3 rounded-lg overflow-x-auto font-mono whitespace-pre">{`VAPID_PUBLIC_KEY=your_public_key
VAPID_PRIVATE_KEY=your_private_key
VAPID_EMAIL=mailto:admin@sarvdev.com
NEXT_PUBLIC_VAPID_PUBLIC_KEY=same_public_key`}</pre>
          </li>
          <li>Restart the dev server</li>
        </ol>
      </div>

      {/* Quick presets */}
      <div className="admin-card p-5 space-y-3">
        <h3 className="font-semibold text-gray-800 text-sm">Quick Presets</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {PRESETS.map((preset, i) => (
            <button
              key={i}
              onClick={() => setForm({ title: preset.title, body: preset.body, url: preset.url })}
              className="text-left p-3 rounded-xl border border-gray-200 hover:border-orange-300 hover:bg-orange-50/50 transition-all text-xs"
            >
              <p className="font-semibold text-gray-800">{preset.title}</p>
              <p className="text-gray-500 mt-0.5 line-clamp-1">{preset.body}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Send form */}
      <form onSubmit={handleSend} className="admin-card p-6 space-y-4">
        <h3 className="font-semibold text-gray-800">Notification Bhejein</h3>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="e.g. 🪔 Diwali ki Hardik Shubhkamnayein!"
              className="admin-input w-full"
              maxLength={80}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Message *</label>
            <textarea
              value={form.body}
              onChange={e => setForm(f => ({ ...f, body: e.target.value }))}
              placeholder="Notification ka message..."
              className="admin-input w-full resize-none"
              rows={3}
              maxLength={200}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Link (URL)</label>
            <input
              type="text"
              value={form.url}
              onChange={e => setForm(f => ({ ...f, url: e.target.value }))}
              placeholder="/events"
              className="admin-input w-full"
            />
          </div>
        </div>

        {result && (
          <div className={`p-4 rounded-xl text-sm font-medium ${result.error ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
            {result.error
              ? `❌ ${result.error}`
              : result.message
              ? `ℹ️ ${result.message}`
              : `✅ Sent to ${result.sent}/${result.total} subscribers${result.failed ? ` (${result.failed} failed)` : ''}`}
          </div>
        )}

        <button
          type="submit"
          disabled={sending || !form.title.trim() || !form.body.trim()}
          className="admin-btn admin-btn-primary w-full justify-center disabled:opacity-50"
        >
          {sending ? (
            <>
              <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              Bhej raha hai...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" /></svg>
              Notification Bhejein
            </>
          )}
        </button>
      </form>
    </div>
  )
}
