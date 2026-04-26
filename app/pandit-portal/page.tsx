'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

type PanditUser = {
  _id: string; name: string; email: string; role: string; status: string
  phone?: string; city?: string; state?: string; bio?: string
  specialization?: string[]; services?: string[]; languages?: string[]
  experience?: number; createdAt: string
}

export default function PanditPortalPage() {
  const [user, setUser] = useState<PanditUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(data => { if (data.user) setUser(data.user) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 rounded-full border-4 border-purple-500 border-t-transparent" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center px-4">
        <div>
          <p className="text-lg font-semibold mb-2">Session expired</p>
          <Link href="/login" className="text-purple-600 font-medium">Login again →</Link>
        </div>
      </div>
    )
  }

  const serviceLinks = [
    { href: '/contact', icon: '📞', label: 'Contact Admin', desc: 'Get support' },
    { href: '/temples', icon: '🛕', label: 'Browse Temples', desc: 'Find temples' },
    { href: '/devotionals', icon: '🎵', label: 'Devotionals', desc: 'Bhajans & Aarti' },
    { href: '/panchang', icon: '📅', label: 'Panchang', desc: 'Muhurat & Tithi' },
  ]

  return (
    <main className="min-h-screen py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-serif font-bold text-gray-900">🕉️ Pandit Portal</h1>
            <p className="text-sm text-gray-500 mt-0.5">Namaste, Pandit {user.name}!</p>
          </div>
          <Link href="/api/auth/logout" className="text-sm text-gray-500 hover:text-red-500 transition-colors">Logout →</Link>
        </div>

        {/* Status banner */}
        {user.status === 'approved' ? (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-200">
            <span className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-sm">✓</span>
            <div>
              <p className="font-semibold text-emerald-800 text-sm">Profile Approved & Active</p>
              <p className="text-xs text-emerald-600">Your pandit profile is live. Devotees can find and contact you.</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200">
            <span className="text-2xl">⏳</span>
            <div>
              <p className="font-semibold text-amber-800 text-sm">Profile Under Review</p>
              <p className="text-xs text-amber-600">Admin is verifying your credentials. Approval within 24–48 hours.</p>
            </div>
          </div>
        )}

        {/* Profile + Services */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Profile */}
          <div className="card p-6">
            <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><span>👤</span> My Profile</h2>
            <div className="space-y-1.5 text-sm">
              {[
                { label: 'Name', value: 'Pandit ' + user.name },
                { label: 'Email', value: user.email },
                { label: 'Phone', value: user.phone || '—' },
                { label: 'City', value: user.city || '—' },
                { label: 'State', value: user.state || '—' },
                { label: 'Experience', value: user.experience ? `${user.experience} years` : '—' },
                { label: 'Member since', value: new Date(user.createdAt).toLocaleDateString('en-IN') },
              ].map(item => (
                <div key={item.label} className="flex justify-between py-1.5 border-b border-gray-100">
                  <span className="text-gray-500">{item.label}</span>
                  <span className="font-medium text-gray-800 text-right max-w-[60%]">{item.value}</span>
                </div>
              ))}
            </div>
            {user.bio && (
              <div className="mt-3 p-3 rounded-lg bg-gray-50 text-xs text-gray-600 italic">"{user.bio}"</div>
            )}
          </div>

          {/* Services & Languages */}
          <div className="space-y-4">
            <div className="card p-6">
              <h2 className="font-bold text-gray-900 mb-3 flex items-center gap-2"><span>🙏</span> Services Offered</h2>
              {user.services && user.services.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {user.services.map(s => (
                    <span key={s} className="text-[11px] px-2.5 py-1 rounded-full bg-orange-100 text-orange-700 font-medium">{s}</span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400">No services listed yet</p>
              )}
            </div>

            <div className="card p-6">
              <h2 className="font-bold text-gray-900 mb-3 flex items-center gap-2"><span>🗣️</span> Languages</h2>
              {user.languages && user.languages.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {user.languages.map(l => (
                    <span key={l} className="text-[11px] px-2.5 py-1 rounded-full bg-purple-100 text-purple-700 font-medium">{l}</span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400">No languages listed</p>
              )}
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="card p-6">
          <h2 className="font-bold text-gray-900 mb-4">Quick Links</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {serviceLinks.map(link => (
              <Link key={link.href} href={link.href}
                className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all text-center">
                <span className="text-2xl">{link.icon}</span>
                <span className="text-xs font-bold text-gray-800">{link.label}</span>
                <span className="text-[10px] text-gray-400">{link.desc}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="card p-6 bg-purple-50/50 border-purple-100">
          <h3 className="font-bold text-purple-800 text-sm mb-2">ℹ️ Pandit Profile — Coming Features</h3>
          <ul className="text-xs text-purple-700 space-y-1 list-disc list-inside">
            <li>Public pandit profile page visible to devotees</li>
            <li>Online booking — devotees can request your services</li>
            <li>Service area / city-wise visibility</li>
            <li>Reviews and ratings from clients</li>
            <li>Panchang & muhurat calculator tools</li>
            <li>WhatsApp / phone enquiry integration</li>
          </ul>
        </div>

      </div>
    </main>
  )
}
