"use client"

import { useRouter } from 'next/navigation'
import TempleForm from '../../../../components/temples/TempleForm'

export default function AdminNewTemplePage() {
  const router = useRouter()
  return (
    <div className="space-y-6">
      <div><h1 className="admin-page-title">Add Temple</h1><p className="admin-section-subtitle">Create a temple using the Sarvdev master temple standard.</p></div>
      <TempleForm mode="admin-create" onSaved={(temple) => router.push(`/admin/temples/edit/${temple._id}`)} />
    </div>
  )
}
