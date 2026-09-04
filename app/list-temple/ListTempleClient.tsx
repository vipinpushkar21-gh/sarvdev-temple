"use client"

import { useState } from 'react'
import { getGroupedCategories } from '../../lib/sacred-categories'

const steps = ['Temple', 'Location', 'Details', 'Photos', 'Review']
const states = ['Andhra Pradesh', 'Assam', 'Bihar', 'Delhi', 'Gujarat', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Odisha', 'Rajasthan', 'Tamil Nadu', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal']
const deities = ['Shiva', 'Vishnu', 'Durga', 'Ganesha', 'Hanuman', 'Krishna', 'Rama', 'Lakshmi', 'Other']
type Values = Record<string, string | string[]>
const initial: Values = { title: '', titleHi: '', deity: '', templeType: '', description: '', city: '', district: '', state: '', streetAddress: '', pincode: '', country: 'India', mapsLink: '', timings: '', phone: '', email: '', website: '', primaryImage: '', templeFestivals: '', nearestAirport: '', nearestRailwayStation: '', nearestBusStand: '', localTransport: '', sacredCategories: [] }

export default function ListTempleClient({ faqs: _faqs }: { faqs?: Array<{ question: string; answer: string }> }) {
  const [step, setStep] = useState(0)
  const [values, setValues] = useState<Values>(initial)
  const [matches, setMatches] = useState<any[]>([])
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const groups = getGroupedCategories()
  const value = (key: string) => String(values[key] || '')
  const set = (key: string, next: string | string[]) => setValues((current) => ({ ...current, [key]: next }))

  async function next() {
    setError('')
    if (step === 0 && !value('title').trim()) return setError('Temple name is required.')
    if (step === 1) {
      if (!value('city').trim() || !value('state').trim()) return setError('City, town or village and state are required.')
      try {
        const params = new URLSearchParams({ submissionCheck: '1', title: value('title'), city: value('city'), state: value('state') })
        const response = await fetch(`/api/temples?${params}`)
        const data = await response.json()
        setMatches(Array.isArray(data.matches) ? data.matches : [])
      } catch { setMatches([]) }
    }
    if (step === 2 && value('description').trim().length < 20) return setError('Please add a meaningful description of at least 20 characters.')
    setStep((current) => Math.min(current + 1, steps.length - 1))
  }

  async function submit() {
    setSubmitting(true); setError('')
    try {
      const response = await fetch('/api/temples', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(values) })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data.error || 'Your submission could not be received.')
      setSuccess(true)
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Your submission could not be received.') } finally { setSubmitting(false) }
  }

  if (success) return <main className="bg-surface py-12 sm:py-16"><div className="page-container max-w-2xl"><section className="border border-surface-border bg-surface-raised p-8"><p className="text-overline font-semibold uppercase tracking-[.15em] text-primary">Submission received</p><h1 className="mt-3 font-display text-h2 text-secondary-800">Thank you for sharing this sacred place.</h1><p className="mt-4 text-body text-ink-muted">Your temple submission is pending review. Sarvdev will assess it before any publication decision.</p></section></div></main>

  return <main className="bg-surface py-10 sm:py-14"><div className="page-container max-w-3xl"><header className="border-b border-surface-border pb-7"><p className="text-overline font-semibold uppercase tracking-[.15em] text-primary">Community contribution</p><h1 className="mt-2 font-display text-display-sm text-secondary-800">List a Temple</h1><p className="mt-3 max-w-2xl text-body text-ink-muted">Help preserve and share a sacred place. Submissions are reviewed before publication and do not guarantee a listing.</p></header><ol className="mt-6 flex gap-3 overflow-x-auto border-b border-surface-border pb-3">{steps.map((label, index) => <li key={label} className={`shrink-0 text-caption font-semibold ${index === step ? 'text-primary' : index < step ? 'text-secondary-800' : 'text-ink-faint'}`}>{index + 1}. {label}</li>)}</ol>
    <section className="mt-7 border border-surface-border bg-surface-raised p-5 sm:p-7">{error && <p role="alert" className="mb-5 border-l-2 border-primary bg-surface px-4 py-3 text-body-sm text-ink-muted">{error}</p>}
      {step === 0 && <div className="space-y-5"><Heading title="Tell us about the temple" text="Start with the details devotees will recognize." /><Field label="Temple name" required><input value={value('title')} onChange={(e) => set('title', e.target.value)} className="input" /></Field><Field label="Temple name in Hindi"><input value={value('titleHi')} onChange={(e) => set('titleHi', e.target.value)} className="input" /></Field><div className="grid gap-4 sm:grid-cols-2"><Field label="Primary deity"><select value={value('deity')} onChange={(e) => set('deity', e.target.value)} className="input"><option value="">Select if known</option>{deities.map((item) => <option key={item}>{item}</option>)}</select></Field><Field label="Temple type"><input value={value('templeType')} onChange={(e) => set('templeType', e.target.value)} placeholder="For example, ancient, hill or village temple" className="input" /></Field></div></div>}
      {step === 1 && <div className="space-y-5"><Heading title="Where is it located?" text="A precise place helps us review and distinguish similar temples." /><div className="grid gap-4 sm:grid-cols-2"><Field label="City, town or village" required><input value={value('city')} onChange={(e) => set('city', e.target.value)} className="input" /></Field><Field label="State" required><select value={value('state')} onChange={(e) => set('state', e.target.value)} className="input"><option value="">Select state</option>{states.map((item) => <option key={item}>{item}</option>)}</select></Field><Field label="District"><input value={value('district')} onChange={(e) => set('district', e.target.value)} className="input" /></Field><Field label="Pincode"><input value={value('pincode')} onChange={(e) => set('pincode', e.target.value)} className="input" /></Field></div><Field label="Address"><input value={value('streetAddress')} onChange={(e) => set('streetAddress', e.target.value)} className="input" /></Field><Field label="Google Maps URL"><input value={value('mapsLink')} onChange={(e) => set('mapsLink', e.target.value)} placeholder="Optional map link" className="input" /></Field>{matches.length > 0 && <div className="border-l-2 border-gold bg-[#fbf6eb] p-4 text-body-sm text-ink-muted"><p className="font-semibold text-secondary-800">Possible existing temple records</p><ul className="mt-2 space-y-1">{matches.map((match) => <li key={String(match._id)}>{match.title} · {match.city}, {match.state} · {match.status}</li>)}</ul><p className="mt-2">This is only a warning. Continue if this is a different temple.</p></div>}</div>}
      {step === 2 && <div className="space-y-5"><Heading title="Add useful details" text="Share only what you know. Timings and contact details are optional." /><Field label="Description" required><textarea value={value('description')} onChange={(e) => set('description', e.target.value)} className="input min-h-36" placeholder="What makes this temple meaningful? Include traditions, history or practical visitor information if known." /></Field><Field label="Darshan timings"><input value={value('timings')} onChange={(e) => set('timings', e.target.value)} className="input" /></Field><div className="grid gap-4 sm:grid-cols-2"><Field label="Temple phone"><input value={value('phone')} onChange={(e) => set('phone', e.target.value)} className="input" /></Field><Field label="Temple email"><input value={value('email')} onChange={(e) => set('email', e.target.value)} className="input" /></Field></div><Field label="Temple website"><input value={value('website')} onChange={(e) => set('website', e.target.value)} className="input" /></Field><p className="text-caption text-ink-faint">Contact details must be for the temple and may appear publicly if the listing is approved.</p><Field label="Sacred categories"><div className="mt-2 space-y-3">{groups.slice(0, 3).map(({ group, categories }) => <div key={group.key}><p className="text-caption text-ink-muted">{group.label}</p><div className="mt-2 flex flex-wrap gap-2">{categories.map((category) => <label key={category.slug} className="inline-flex items-center gap-2 text-caption text-ink-muted"><input type="checkbox" checked={(values.sacredCategories as string[]).includes(category.name)} onChange={() => { const current = values.sacredCategories as string[]; set('sacredCategories', current.includes(category.name) ? current.filter((item) => item !== category.name) : [...current, category.name]) }} />{category.name}</label>)}</div></div>)}</div></Field></div>}
      {step === 3 && <div className="space-y-5"><Heading title="Add a photo link" text="Optional: share one publicly accessible HTTP(S) image URL. Image uploads are reviewed separately." /><Field label="Temple photo URL"><input value={value('primaryImage')} onChange={(e) => set('primaryImage', e.target.value)} placeholder="https://…" className="input" /></Field><Field label="Temple festivals"><input value={value('templeFestivals')} onChange={(e) => set('templeFestivals', e.target.value)} placeholder="Optional, separated by commas" className="input" /></Field></div>}
      {step === 4 && <div className="space-y-5"><Heading title="Review your submission" text="Please check the information before sending it for review." /><Review label="Temple" value={value('title')} /><Review label="Location" value={[value('city'), value('district'), value('state')].filter(Boolean).join(', ')} /><Review label="Description" value={value('description')} /><Review label="Contact" value={[value('phone'), value('email'), value('website')].filter(Boolean).join(' · ') || 'Not provided'} /><p className="border-l-2 border-primary bg-surface px-4 py-3 text-body-sm text-ink-muted">Submitting creates a pending record for Sarvdev review. It is not published automatically.</p></div>}
      <div className="mt-8 flex items-center justify-between border-t border-surface-border pt-5"><button type="button" onClick={() => setStep((current) => Math.max(0, current - 1))} disabled={step === 0} className="text-body-sm font-semibold text-ink-muted disabled:opacity-40">Back</button>{step < 4 ? <button type="button" onClick={next} className="btn btn-primary">Continue</button> : <button type="button" onClick={submit} disabled={submitting} className="btn btn-primary">{submitting ? 'Sending…' : 'Submit for review'}</button>}</div>
    </section></div></main>
}

function Heading({ title, text }: { title: string; text: string }) { return <div><h2 className="font-display text-h2 text-secondary-800">{title}</h2><p className="mt-2 text-body-sm text-ink-muted">{text}</p></div> }
function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) { return <label className="block text-body-sm font-semibold text-secondary-800">{label}{required && <span className="ml-1 text-primary">*</span>}<span className="mt-2 block">{children}</span></label> }
function Review({ label, value }: { label: string; value: string }) { return <div className="border-b border-surface-border pb-4"><p className="text-overline uppercase tracking-[.13em] text-ink-faint">{label}</p><p className="mt-1 whitespace-pre-wrap text-body-sm text-secondary-800">{value || 'Not provided'}</p></div> }
