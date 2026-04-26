"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Tab = 'login' | 'register'
type RegRole = 'user' | 'temple' | 'pandit'

const ROLE_CONFIG = [
  {
    key: 'user' as RegRole,
    icon: '👤',
    label: 'Devotee / User',
    labelHi: 'श्रद्धालु',
    desc: 'Bookmark temples, reviews, personal profile',
  },
  {
    key: 'temple' as RegRole,
    icon: '🛕',
    label: 'Temple Manager',
    labelHi: 'मंदिर प्रबंधक',
    desc: 'Manage your temple listing, upload darshan photos',
  },
  {
    key: 'pandit' as RegRole,
    icon: '🕉️',
    label: 'Pandit / Pujari',
    labelHi: 'पंडित / पुजारी',
    desc: 'Create pandit profile, list puja services',
  },
]

const PANDIT_SERVICES = ['Griha Pravesh', 'Satyanarayan Katha', 'Havan', 'Vivah Sanskar', 'Mundan', 'Namkaran', 'Annaprashan', 'Shradh / Pind Daan', 'Rudrabhishek', 'Sunderkand Path']
const PANDIT_LANGS = ['Hindi', 'Sanskrit', 'English', 'Gujarati', 'Marathi', 'Bengali', 'Tamil', 'Telugu', 'Punjabi']

export default function LoginPage() {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('login')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [pendingSuccess, setPendingSuccess] = useState('')

  // login fields
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')

  // register — common
  const [regRole, setRegRole] = useState<RegRole>('user')
  const [regName, setRegName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [regConfirm, setRegConfirm] = useState('')
  const [regPhone, setRegPhone] = useState('')
  const [regCity, setRegCity] = useState('')
  const [regState, setRegState] = useState('')
  // temple extra
  const [templeName, setTempleName] = useState('')
  const [designation, setDesignation] = useState('')
  // pandit extra
  const [experience, setExperience] = useState('')
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [selectedLangs, setSelectedLangs] = useState<string[]>([])
  const [panditBio, setPanditBio] = useState('')

  function switchTab(t: Tab) { setTab(t); setError(''); setPendingSuccess('') }

  function toggleService(s: string) {
    setSelectedServices(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])
  }
  function toggleLang(l: string) {
    setSelectedLangs(prev => prev.includes(l) ? prev.filter(x => x !== l) : [...prev, l])
  }

  // ─── Login ──────────────────────────────────────────
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      })
      const data = await res.json()
      if (res.ok) {
        const role = data.user?.role
        if (role === 'admin') router.push('/admin/dashboard')
        else if (role === 'temple') router.push('/temple-portal')
        else if (role === 'pandit') router.push('/pandit-portal')
        else router.push('/')
        router.refresh()
      } else {
        setError(data.error || 'Login failed')
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // ─── Register ───────────────────────────────────────
  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (regPassword !== regConfirm) { setError('Passwords do not match'); return }
    if (regPassword.length < 6) { setError('Password must be at least 6 characters'); return }
    setLoading(true)
    try {
      const body: Record<string, any> = {
        name: regName, email: regEmail, password: regPassword,
        role: regRole, phone: regPhone, city: regCity, state: regState,
      }
      if (regRole === 'temple') {
        body.templeName = templeName
        body.designation = designation
      }
      if (regRole === 'pandit') {
        body.services = selectedServices
        body.languages = selectedLangs
        body.experience = experience
        body.bio = panditBio
      }
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (res.ok) {
        if (data.pending) {
          setPendingSuccess(data.message)
        } else {
          const role = data.user?.role
          if (role === 'admin') router.push('/admin/dashboard')
          else router.push('/')
          router.refresh()
        }
      } else {
        setError(data.error || 'Registration failed')
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-start justify-center px-4 py-10 relative bg-gradient-to-br from-surface-sunken via-surface to-primary-50/20">
      {/* Decorative background */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-20 right-[15%] w-80 h-80 bg-primary/[0.06] rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-[10%] w-64 h-64 bg-accent/[0.05] rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="card p-8 md:p-10 shadow-elevated border-surface-border/50">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2.5 mb-4">
              <span className="flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/25">
                <span className="text-secondary-900 font-serif font-bold text-xl leading-none">S</span>
              </span>
            </div>
            <h1 className="text-h2 font-serif text-secondary-800">Sarvdev</h1>
            <p className="mt-1.5 text-body-sm text-ink-muted">
              {tab === 'login' ? 'Welcome back! Login to your account' : 'Join the community — create your account'}
            </p>
          </div>

          {/* Tabs */}
          <div className="flex rounded-xl bg-surface-sunken p-1 mb-7">
            <button
              type="button"
              onClick={() => switchTab('login')}
              suppressHydrationWarning
              className={`flex-1 py-2.5 text-body-sm font-semibold rounded-lg transition-all duration-200 ${
                tab === 'login'
                  ? 'bg-white text-secondary-800 shadow-md'
                  : 'text-ink-muted hover:text-ink'
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => switchTab('register')}
              suppressHydrationWarning
              className={`flex-1 py-2.5 text-body-sm font-semibold rounded-lg transition-all duration-200 ${
                tab === 'register'
                  ? 'bg-white text-secondary-800 shadow-md'
                  : 'text-ink-muted hover:text-ink'
              }`}
            >
              Register
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 flex items-center gap-2.5 border border-red-200 text-semantic-error bg-red-50 px-4 py-3 rounded-xl text-body-sm">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg>
              {error}
            </div>
          )}

          {/* ── Login Form ── */}
          {tab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label htmlFor="login-email" className="label">Email</label>
                <input
                  id="login-email"
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="input"
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                  suppressHydrationWarning
                />
              </div>

              <div>
                <label htmlFor="login-password" className="label">Password</label>
                <input
                  id="login-password"
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="input"
                  placeholder="Enter password"
                  required
                  autoComplete="current-password"
                  suppressHydrationWarning
                />
              </div>

              <button type="submit" disabled={loading} suppressHydrationWarning className="w-full btn btn-primary btn-lg disabled:opacity-60">
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                    Logging in...
                  </span>
                ) : 'Login'}
              </button>

              <p className="text-center text-caption text-ink-faint mt-3">
                Don&apos;t have an account?{' '}
                <button type="button" onClick={() => switchTab('register')} suppressHydrationWarning className="text-primary-600 font-semibold hover:text-primary-700 transition-colors">
                  Register
                </button>
              </p>
            </form>
          )}

          {/* ── Register Form ── */}
          {tab === 'register' && (
            <>
              {/* Pending success state */}
              {pendingSuccess ? (
                <div className="text-center py-4">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: '#FEF3C7' }}>
                    <span className="text-3xl">⏳</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Request Submitted!</h3>
                  <p className="text-sm text-gray-600 mb-5">{pendingSuccess}</p>
                  <button onClick={() => switchTab('login')} className="btn btn-primary px-6 py-2 text-sm">Go to Login</button>
                </div>
              ) : (
                <form onSubmit={handleRegister} className="space-y-5">
                  {/* Role selector */}
                  <div>
                    <p className="label mb-2">Register as</p>
                    <div className="grid grid-cols-3 gap-2">
                      {ROLE_CONFIG.map(r => (
                        <button
                          key={r.key}
                          type="button"
                          onClick={() => setRegRole(r.key)}
                          className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all text-center ${regRole === r.key ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'}`}
                        >
                          <span className="text-2xl">{r.icon}</span>
                          <span className={`text-[11px] font-bold leading-tight ${regRole === r.key ? 'text-primary-700' : 'text-gray-600'}`}>{r.labelHi}</span>
                          <span className="text-[9px] text-gray-400 leading-tight hidden sm:block">{r.label}</span>
                        </button>
                      ))}
                    </div>
                    {regRole !== 'user' && (
                      <p className="text-[11px] text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mt-2 flex items-start gap-1.5">
                        <span>⚠️</span>
                        <span>{regRole === 'temple' ? 'Temple Manager' : 'Pandit'} accounts need admin approval before login access.</span>
                      </p>
                    )}
                  </div>

                  {/* Common fields */}
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="label">Full Name *</label>
                      <input type="text" value={regName} onChange={e => setRegName(e.target.value)} className="input" placeholder="Your full name" required suppressHydrationWarning />
                    </div>
                    <div>
                      <label className="label">Email *</label>
                      <input type="email" value={regEmail} onChange={e => setRegEmail(e.target.value)} className="input" placeholder="you@example.com" required suppressHydrationWarning />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="label">Password *</label>
                        <input type="password" value={regPassword} onChange={e => setRegPassword(e.target.value)} className="input" placeholder="Min 6 chars" required minLength={6} suppressHydrationWarning />
                      </div>
                      <div>
                        <label className="label">Confirm *</label>
                        <input type="password" value={regConfirm} onChange={e => setRegConfirm(e.target.value)} className="input" placeholder="Re-enter" required minLength={6} suppressHydrationWarning />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="label">Phone</label>
                        <input type="tel" value={regPhone} onChange={e => setRegPhone(e.target.value)} className="input" placeholder="+91 XXXXX XXXXX" suppressHydrationWarning />
                      </div>
                      <div>
                        <label className="label">City</label>
                        <input type="text" value={regCity} onChange={e => setRegCity(e.target.value)} className="input" placeholder="City" suppressHydrationWarning />
                      </div>
                    </div>
                  </div>

                  {/* Temple-specific fields */}
                  {regRole === 'temple' && (
                    <div className="space-y-3 p-4 rounded-xl border border-orange-200 bg-orange-50/50">
                      <p className="text-xs font-bold text-orange-700 uppercase tracking-wide">🛕 Temple Details</p>
                      <div>
                        <label className="label">Temple Name *</label>
                        <input type="text" value={templeName} onChange={e => setTempleName(e.target.value)} className="input" placeholder="e.g. Shri Ram Mandir, Ayodhya" required={regRole === 'temple'} suppressHydrationWarning />
                      </div>
                      <div>
                        <label className="label">Your Designation</label>
                        <select value={designation} onChange={e => setDesignation(e.target.value)} className="input" suppressHydrationWarning>
                          <option value="">Select role</option>
                          <option>Pujari / Head Priest</option>
                          <option>Temple Manager</option>
                          <option>Trustee</option>
                          <option>Secretary</option>
                          <option>Committee Member</option>
                          <option>Owner</option>
                        </select>
                      </div>
                      <p className="text-[11px] text-gray-500">If your temple is already listed, admin will link your account after verification. You can also claim it from the temple page after approval.</p>
                    </div>
                  )}

                  {/* Pandit-specific fields */}
                  {regRole === 'pandit' && (
                    <div className="space-y-3 p-4 rounded-xl border border-purple-200 bg-purple-50/30">
                      <p className="text-xs font-bold text-purple-700 uppercase tracking-wide">🕉️ Pandit Details</p>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="label">Experience (Years)</label>
                          <input type="number" value={experience} onChange={e => setExperience(e.target.value)} className="input" placeholder="e.g. 10" min={0} max={60} suppressHydrationWarning />
                        </div>
                        <div>
                          <label className="label">State</label>
                          <input type="text" value={regState} onChange={e => setRegState(e.target.value)} className="input" placeholder="State" suppressHydrationWarning />
                        </div>
                      </div>
                      <div>
                        <label className="label mb-1">Languages you perform in</label>
                        <div className="flex flex-wrap gap-1.5">
                          {PANDIT_LANGS.map(l => (
                            <button key={l} type="button" onClick={() => toggleLang(l)}
                              className={`text-[11px] px-2.5 py-1 rounded-full border font-medium transition-all ${selectedLangs.includes(l) ? 'bg-purple-600 text-white border-purple-600' : 'border-gray-300 text-gray-600 hover:border-purple-400'}`}>
                              {l}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="label mb-1">Services Offered</label>
                        <div className="flex flex-wrap gap-1.5">
                          {PANDIT_SERVICES.map(s => (
                            <button key={s} type="button" onClick={() => toggleService(s)}
                              className={`text-[11px] px-2.5 py-1 rounded-full border font-medium transition-all ${selectedServices.includes(s) ? 'bg-orange-500 text-white border-orange-500' : 'border-gray-300 text-gray-600 hover:border-orange-400'}`}>
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="label">Short Bio</label>
                        <textarea value={panditBio} onChange={e => setPanditBio(e.target.value)} className="input resize-none" rows={2} placeholder="Brief about yourself, specialization..." suppressHydrationWarning />
                      </div>
                    </div>
                  )}

                  <button type="submit" disabled={loading} suppressHydrationWarning className="w-full btn btn-primary btn-lg disabled:opacity-60">
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                        {regRole === 'user' ? 'Creating account...' : 'Submitting for approval...'}
                      </span>
                    ) : regRole === 'user' ? 'Create Account' : 'Submit for Approval →'}
                  </button>

                  <p className="text-center text-caption text-ink-faint mt-3">
                    Already have an account?{' '}
                    <button type="button" onClick={() => switchTab('login')} suppressHydrationWarning className="text-primary-600 font-semibold hover:text-primary-700 transition-colors">Login</button>
                  </p>
                </form>
              )}
            </>
          )}
        </div>

        {/* Footer text */}
        <p className="text-center text-caption text-ink-faint mt-6">
          Temple Directory & Devotional Hub
        </p>
      </div>
    </main>
  )
}
