"use client"

import { useState, useRef } from 'react'

type UploadedImage = {
  url: string
  publicId: string
  name: string
  size: string
  uploadedAt: string
}

const FOLDERS = [
  { value: 'sarvdev/temples', label: '🛕 Temples' },
  { value: 'sarvdev/darshan', label: '🙏 Darshan' },
  { value: 'sarvdev/blogs', label: '📝 Blogs' },
  { value: 'sarvdev/events', label: '🎉 Events' },
  { value: 'sarvdev/other', label: '📁 Other' },
]

export default function AdminMediaPage() {
  const [folder, setFolder] = useState('sarvdev/temples')
  const [uploading, setUploading] = useState(false)
  const [uploaded, setUploaded] = useState<UploadedImage[]>([])
  const [dragOver, setDragOver] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const uploadFile = async (file: File): Promise<UploadedImage | { error: string }> => {
    if (!file.type.startsWith('image/')) return { error: `${file.name}: sirf image files allowed hain` }
    if (file.size > 10 * 1024 * 1024) return { error: `${file.name}: 10MB se chhoti honi chahiye` }

    const fd = new FormData()
    fd.append('file', file)
    fd.append('folder', folder)
    const res = await fetch('/api/upload', { method: 'POST', body: fd })
    const data = await res.json()
    if (!res.ok) return { error: data.error || 'Upload failed' }

    return {
      url: data.url,
      publicId: data.publicId,
      name: file.name,
      size: (file.size / 1024).toFixed(1) + ' KB',
      uploadedAt: new Date().toLocaleTimeString(),
    }
  }

  const handleFiles = async (files: FileList | File[]) => {
    const fileArr = Array.from(files)
    setError('')
    setUploading(true)
    const results: UploadedImage[] = []
    const errors: string[] = []

    for (const file of fileArr) {
      const result = await uploadFile(file)
      if ('error' in result) {
        errors.push(result.error)
      } else {
        results.push(result)
      }
    }

    setUploaded(prev => [...results, ...prev])
    if (errors.length) setError(errors.join(' | '))
    setUploading(false)
  }

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url)
    setCopied(url)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="max-w-5xl space-y-6">
      <div>
        <h1 className="admin-page-title">Media Library</h1>
        <p className="admin-section-subtitle">Photos Cloudinary pe upload karo — URL copy karke kahaan bhi use karo</p>
      </div>

      {/* Upload Card */}
      <div className="admin-card p-6 space-y-4">
        {/* Folder selector + button */}
        <div className="flex items-center gap-4 flex-wrap">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Folder</label>
            <select value={folder} onChange={e => setFolder(e.target.value)} className="admin-input text-sm py-2">
              {FOLDERS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
            </select>
          </div>
          <div className="flex-1" />
          <button
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="admin-btn admin-btn-primary px-5 py-2.5 text-sm disabled:opacity-60 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            {uploading ? 'Uploading...' : 'Photos Upload Karo'}
          </button>
        </div>

        {/* Drag & Drop Zone */}
        <div
          onDragOver={e => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={e => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files) }}
          onClick={() => !uploading && inputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-200 select-none ${
            dragOver ? 'border-orange-400 bg-orange-50' : 'border-gray-200 hover:border-orange-300 hover:bg-orange-50/30'
          }`}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-3">
              <svg className="animate-spin w-9 h-9 text-orange-500" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
              <p className="text-sm font-semibold text-orange-600">Cloudinary pe upload ho raha hai...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center">
                <svg className="w-8 h-8 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700">Photos yahan drag karo ya click karo</p>
                <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP — Max 10MB — Multiple files ek saath</p>
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50 text-red-600 text-sm">
            <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z" />
            </svg>
            {error}
          </div>
        )}
      </div>

      {/* Uploaded Images */}
      {uploaded.length > 0 && (
        <div className="admin-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="admin-section-title">Uploaded — {uploaded.length} photo{uploaded.length > 1 ? 's' : ''}</h2>
            <button onClick={() => setUploaded([])} className="text-xs text-red-500 hover:text-red-700 transition-colors">
              Clear All
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {uploaded.map(img => (
              <div key={img.url} className="rounded-xl overflow-hidden border border-gray-200 bg-gray-50 flex flex-col">
                <img src={img.url} alt={img.name} className="w-full h-28 object-cover" />
                <div className="p-2 space-y-1.5 flex-1 flex flex-col">
                  <p className="text-[11px] font-medium text-gray-700 truncate">{img.name}</p>
                  <p className="text-[10px] text-gray-400">{img.size}</p>
                  <button
                    onClick={() => copyUrl(img.url)}
                    className={`mt-auto w-full text-[11px] py-1.5 rounded-lg font-semibold transition-all ${
                      copied === img.url
                        ? 'bg-green-100 text-green-700'
                        : 'bg-orange-50 text-orange-700 hover:bg-orange-100'
                    }`}
                  >
                    {copied === img.url ? '✓ Copied!' : 'Copy URL'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <input ref={inputRef} type="file" accept="image/*" multiple onChange={e => e.target.files && handleFiles(e.target.files)} className="hidden" />
    </div>
  )
}
