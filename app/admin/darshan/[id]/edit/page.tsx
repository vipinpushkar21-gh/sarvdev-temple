"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import DarshanForm, { normalizeDarshanForForm, type DarshanFormValues } from '../../DarshanForm'

export default function EditDarshanPage() {
  const params = useParams()
  const id = params.id as string
  const [loading, setLoading] = useState(true)
  const [formValues, setFormValues] = useState<DarshanFormValues | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return
    let cancelled = false

    async function loadDarshan() {
      setLoading(true)
      setError('')
      try {
        const res = await fetch(`/api/darshan?admin=1&id=${encodeURIComponent(id)}`, { cache: 'no-store' })
        if (!res.ok) {
          setError('Darshan could not be loaded.')
          return
        }
        const data = await res.json()
        if (!data) {
          setError('Darshan not found.')
          return
        }
        if (!cancelled) setFormValues(normalizeDarshanForForm(data))
      } catch {
        if (!cancelled) setError('Network error while loading darshan.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadDarshan()
    return () => { cancelled = true }
  }, [id])

  if (loading) {
    return (
      <div className="max-w-5xl space-y-4">
        <div className="h-10 w-64 animate-pulse rounded-xl bg-gray-100" />
        <div className="h-80 animate-pulse rounded-2xl bg-gray-100" />
        <div className="h-80 animate-pulse rounded-2xl bg-gray-100" />
      </div>
    )
  }

  if (error || !formValues) {
    return (
      <div className="admin-card max-w-2xl p-8">
        <h1 className="admin-page-title">Darshan not found</h1>
        <p className="admin-section-subtitle mt-2">{error || 'This darshan record could not be loaded.'}</p>
        <Link href="/admin/darshan" className="admin-btn admin-btn-primary mt-5 px-4 py-2 text-sm">Back to Darshan</Link>
      </div>
    )
  }

  return <DarshanForm mode="edit" id={id} initialValues={formValues} />
}
