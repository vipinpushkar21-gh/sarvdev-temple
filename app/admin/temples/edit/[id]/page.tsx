"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import TempleLiveLink from '@/components/admin/TempleLiveLink'
import TempleForm from '../../../../../components/temples/TempleForm'
import { templeMasterValuesFromRecord, type TempleMasterValues } from '../../../../../lib/temple-master'
import { useTranslation } from '../../../../../lib/translation'

export default function AdminEditTemplePage() {
  const params = useParams()
  const { language } = useTranslation()
  const id = String(params?.id || '')
  const [values, setValues] = useState<TempleMasterValues | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return
    fetch(`/api/temples/${encodeURIComponent(id)}?admin=1`, { credentials: 'include', cache: 'no-store' })
      .then(async (response) => {
        if (!response.ok) throw new Error((await response.json().catch(() => ({}))).error || 'Unable to load temple')
        return response.json()
      })
      .then((temple) => setValues(templeMasterValuesFromRecord(temple)))
      .catch((loadError) => setError(loadError instanceof Error ? loadError.message : 'Unable to load temple'))
  }, [id])

  if (error) return <div className="admin-card p-6 text-red-700">{error}</div>
  if (!values) return <div className="animate-pulse space-y-3"><div className="h-10 w-64 rounded bg-gray-100" /><div className="h-96 rounded bg-gray-100" /></div>

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="admin-page-title">Edit Temple</h1>
          <p className="admin-section-subtitle">Update this temple using the Sarvdev master temple standard.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <TempleLiveLink
            slug={values.slug}
            status={values.status}
            templeTitle={values.title}
            templeTitleHi={values.titleHi}
            language={language}
            variant="detail"
            className="admin-btn admin-btn-ghost px-4 py-2 text-sm text-green-700 border-green-200 hover:bg-green-50"
          />
          <Link href="/admin/temples" className="admin-btn admin-btn-ghost">Back to Temples</Link>
        </div>
      </div>
      <TempleForm mode="admin-edit" templeId={id} initialValues={values} />
    </div>
  )
}
