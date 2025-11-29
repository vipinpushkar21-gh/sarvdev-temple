"use client"

import { useState } from "react"

const presetAmounts = [5, 10, 25, 50, 100]

export default function DonationPage() {
  const [amount, setAmount] = useState<number | null>(null)
  const [custom, setCustom] = useState("")
  const [message, setMessage] = useState("")
  const [errors, setErrors] = useState<{ amount?: string }>()
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  function validate() {
    setSuccess(false)
    const a = custom ? Number(custom) : amount
    const e: { amount?: string } = {}
    if (!a || Number.isNaN(a) || a <= 0) e.amount = "Please choose or enter a valid amount"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    
    setLoading(true)
    try {
      const donationAmount = custom ? Number(custom) : amount
      const res = await fetch('/api/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: donationAmount,
          message: message || undefined
        }),
      })
      
      if (res.ok) {
        setSuccess(true)
        setAmount(null)
        setCustom("")
        setMessage("")
      } else {
        alert('Failed to process donation. Please try again.')
      }
    } catch (error) {
      alert('Network error. Please check your connection.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-semibold mb-2">Donate</h1>
      <p className="text-sm text-slate-600 mb-6">Support the temple directory. Your contribution helps maintain the site and support community events.</p>

      <form onSubmit={submit} className="space-y-6 bg-white/60 dark:bg-slate-900/60 p-6 rounded-lg shadow-sm">
        <fieldset>
          <legend className="text-sm font-medium mb-3">Choose an amount</legend>
          <div className="flex flex-wrap gap-3">
            {presetAmounts.map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => { setAmount(a); setCustom(""); setErrors({}) }}
                className={`px-4 py-2 rounded-md border ${amount === a ? "bg-emerald-600 text-white border-emerald-600" : "bg-white text-slate-700 border-slate-200"}`}
              >
                ${a}
              </button>
            ))}
            <input
              aria-label="Custom amount"
              placeholder="Custom"
              value={custom}
              onChange={(e) => { setCustom(e.target.value); setAmount(null); setErrors({}) }}
              className="w-32 px-3 py-2 rounded-md border border-slate-200"
            />
          </div>
          {errors?.amount && <p className="mt-2 text-xs text-rose-600">{errors.amount}</p>}
        </fieldset>

        <div>
          <label className="block text-sm font-medium mb-1">Optional message</label>
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={4} className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-200" />
        </div>

        <div className="flex items-center justify-between">
          <button type="submit" disabled={loading} className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? 'Processing...' : 'Donate Now'}
          </button>
          {success && <div className="text-sm text-emerald-700">Thank you for your generous donation!</div>}
        </div>
      </form>
    </main>
  )
}

