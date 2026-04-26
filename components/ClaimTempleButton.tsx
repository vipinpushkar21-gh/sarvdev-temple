'use client'

import { useEffect, useState } from 'react'

type Props = { templeId: string; templeName: string }

export default function ClaimTempleButton({ templeId, templeName }: Props) {
  const [role, setRole] = useState<string | null>(null)
  const [claimed, setClaimed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.user) {
          setRole(data.user.role)
          if (data.user.templeId?.toString() === templeId) setClaimed(true)
        }
      })
      .catch(() => {})
  }, [templeId])

  if (role !== 'temple' || claimed) return null

  async function handleClaim() {
    if (!confirm(`Claim "${templeName}" as your temple? Admin will verify and link your account.`)) return
    setLoading(true)
    try {
      const res = await fetch('/api/temples/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templeId, templeName }),
      })
      if (res.ok) {
        setDone(true)
        setClaimed(true)
      } else {
        const d = await res.json()
        alert(d.error || 'Failed to submit claim')
      }
    } catch {
      alert('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="bento-card p-4 flex items-center gap-3 border-emerald-200 bg-emerald-50 mb-4">
        <span className="text-xl">✅</span>
        <div>
          <p className="text-sm font-semibold text-emerald-800">Claim Request Submitted</p>
          <p className="text-xs text-emerald-600">Admin will verify and link this temple to your account within 24 hours.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bento-card p-4 flex items-center justify-between gap-4 flex-wrap mb-4 border-amber-200 bg-amber-50/50">
      <div className="flex items-center gap-3">
        <span className="text-2xl">🛕</span>
        <div>
          <p className="text-sm font-semibold text-amber-900">Are you the manager of this temple?</p>
          <p className="text-xs text-amber-700">Claim ownership to manage listings, timings &amp; darshan photos.</p>
        </div>
      </div>
      <button
        onClick={handleClaim}
        disabled={loading}
        className="text-xs font-bold px-4 py-2 rounded-xl text-white transition-all disabled:opacity-60 flex-shrink-0"
        style={{ background: 'linear-gradient(135deg, #FF9933, #D4AF37)' }}
      >
        {loading ? 'Submitting...' : 'Claim This Temple →'}
      </button>
    </div>
  )
}
