"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import SpiritualIconForm, { iconToForm } from '../../SpiritualIconForm'
import type { SpiritualIconRecord } from '../../../../../lib/spiritual-icons'

export default function EditSpiritualIconPage() {
  const params = useParams()
  const id = params.id as string
  const [loading, setLoading] = useState(true)
  const [icon, setIcon] = useState<SpiritualIconRecord | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return
    let cancelled = false

    async function load() {
      setLoading(true)
      setError('')
      try {
        const res = await fetch(`/api/admin/spiritual-icons/${id}`, { cache: 'no-store' })
        if (!res.ok) {
          setError('Spiritual icon could not be loaded.')
          return
        }
        const data = await res.json()
        if (!cancelled) setIcon(data)
      } catch {
        if (!cancelled) setError('Network error while loading spiritual icon.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [id])

  if (loading) {
    return (
      <div className="max-w-5xl space-y-4">
        <div className="h-10 w-72 animate-pulse rounded-xl bg-gray-100" />
        <div className="h-96 animate-pulse rounded-2xl bg-gray-100" />
      </div>
    )
  }

  if (error || !icon) {
    return (
      <div className="admin-card max-w-2xl p-8">
        <h1 className="admin-page-title">Spiritual icon not found</h1>
        <p className="admin-section-subtitle mt-2">{error || 'This record could not be loaded.'}</p>
        <Link href="/admin/spiritual-icons" className="admin-btn admin-btn-primary mt-5 px-4 py-2 text-sm">Back to Spiritual Icons</Link>
      </div>
    )
  }

  return <SpiritualIconForm mode="edit" id={id} initialValues={iconToForm(icon)} />
}
