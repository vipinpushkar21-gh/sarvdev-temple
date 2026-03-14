"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Tab = 'login' | 'register'

export default function LoginPage() {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('login')

  // shared
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // login fields
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')

  // register fields
  const [regName, setRegName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [regConfirm, setRegConfirm] = useState('')

  function switchTab(t: Tab) {
    setTab(t)
    setError('')
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
        router.push('/')
        router.refresh()
      } else {
        setError(data.error || 'Login failed')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // ─── Register ───────────────────────────────────────
  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (regPassword !== regConfirm) {
      setError('Passwords do not match')
      return
    }
    if (regPassword.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: regName, email: regEmail, password: regPassword }),
      })
      const data = await res.json()

      if (res.ok) {
        router.push('/')
        router.refresh()
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
    <main className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-gradient-to-br from-surface-sunken via-surface to-primary-50/20">
      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-[15%] w-80 h-80 bg-primary/[0.06] rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-[10%] w-64 h-64 bg-accent/[0.05] rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-dots opacity-[0.02]" />
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
            <form onSubmit={handleRegister} className="space-y-5">
              <div>
                <label htmlFor="reg-name" className="label">Full Name</label>
                <input
                  id="reg-name"
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="input"
                  placeholder="Your name"
                  required
                  autoComplete="name"
                  suppressHydrationWarning
                />
              </div>

              <div>
                <label htmlFor="reg-email" className="label">Email</label>
                <input
                  id="reg-email"
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="input"
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                  suppressHydrationWarning
                />
              </div>

              <div>
                <label htmlFor="reg-password" className="label">Password</label>
                <input
                  id="reg-password"
                  type="password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className="input"
                  placeholder="Min 6 characters"
                  required
                  minLength={6}
                  autoComplete="new-password"
                  suppressHydrationWarning
                />
              </div>

              <div>
                <label htmlFor="reg-confirm" className="label">Confirm Password</label>
                <input
                  id="reg-confirm"
                  type="password"
                  value={regConfirm}
                  onChange={(e) => setRegConfirm(e.target.value)}
                  className="input"
                  placeholder="Re-enter password"
                  required
                  minLength={6}
                  autoComplete="new-password"
                  suppressHydrationWarning
                />
              </div>

              <button type="submit" disabled={loading} suppressHydrationWarning className="w-full btn btn-primary btn-lg disabled:opacity-60">
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                    Creating account...
                  </span>
                ) : 'Create Account'}
              </button>

              <p className="text-center text-caption text-ink-faint mt-3">
                Already have an account?{' '}
                <button type="button" onClick={() => switchTab('login')} suppressHydrationWarning className="text-primary-600 font-semibold hover:text-primary-700 transition-colors">
                  Login
                </button>
              </p>
            </form>
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
