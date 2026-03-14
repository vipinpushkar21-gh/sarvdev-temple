'use client'

import { useState } from 'react'

type ImportRow = Record<string, string>

export default function AdminImportPage() {
  const [entity, setEntity] = useState<'temples' | 'devotionals'>('temples')
  const [rawText, setRawText] = useState('')
  const [parsed, setParsed] = useState<ImportRow[]>([])
  const [errors, setErrors] = useState<string[]>([])
  const [importing, setImporting] = useState(false)
  const [result, setResult] = useState<{ success: number; failed: number } | null>(null)

  const parseCSV = () => {
    setErrors([])
    setResult(null)
    const lines = rawText.trim().split('\n')
    if (lines.length < 2) {
      setErrors(['Need at least a header row and one data row'])
      return
    }
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
    const required = entity === 'temples' ? ['title'] : ['title']
    const missing = required.filter(r => !headers.includes(r))
    if (missing.length > 0) {
      setErrors([`Missing required columns: ${missing.join(', ')}`])
      return
    }

    const rows: ImportRow[] = []
    const errs: string[] = []
    for (let i = 1; i < lines.length; i++) {
      const vals = lines[i].split(',').map(v => v.trim())
      if (vals.length !== headers.length) {
        errs.push(`Row ${i + 1}: column count mismatch (expected ${headers.length}, got ${vals.length})`)
        continue
      }
      const row: ImportRow = {}
      headers.forEach((h, j) => { row[h] = vals[j] })
      if (!row.title) {
        errs.push(`Row ${i + 1}: empty title`)
        continue
      }
      rows.push(row)
    }
    setParsed(rows)
    setErrors(errs)
  }

  const parseJSON = () => {
    setErrors([])
    setResult(null)
    try {
      const data = JSON.parse(rawText)
      const arr = Array.isArray(data) ? data : [data]
      const errs: string[] = []
      const valid = arr.filter((item: any, i: number) => {
        if (!item.title) { errs.push(`Item ${i + 1}: missing title`); return false }
        return true
      })
      setParsed(valid)
      setErrors(errs)
    } catch {
      setErrors(['Invalid JSON format'])
    }
  }

  const doImport = async () => {
    if (parsed.length === 0) return
    setImporting(true)
    let success = 0, failed = 0
    const apiUrl = entity === 'temples' ? '/api/temples' : '/api/devotionals'

    for (const row of parsed) {
      try {
        const body = { ...row, status: row.status || 'pending' }
        const res = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        })
        if (res.ok) success++
        else failed++
      } catch {
        failed++
      }
    }
    setResult({ success, failed })
    setImporting(false)
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="admin-page-title">Bulk Import</h1>
        <p className="admin-section-subtitle">Import temples or devotionals in bulk using CSV or JSON</p>
      </div>

      {/* Entity selector */}
      <div className="admin-card p-6">
        <h2 className="admin-section-title mb-3">1. Select Type</h2>
        <div className="flex gap-3">
          <button onClick={() => { setEntity('temples'); setParsed([]); setErrors([]) }} className={`admin-btn px-4 py-2 text-sm ${entity === 'temples' ? 'admin-btn-primary' : 'admin-btn-ghost'}`}>
            Temples
          </button>
          <button onClick={() => { setEntity('devotionals'); setParsed([]); setErrors([]) }} className={`admin-btn px-4 py-2 text-sm ${entity === 'devotionals' ? 'admin-btn-primary' : 'admin-btn-ghost'}`}>
            Devotionals
          </button>
        </div>
      </div>

      {/* Format guide */}
      <div className="admin-card p-5" style={{ background: '#EFF6FF', borderColor: 'rgba(59,130,246,0.15)' }}>
        <h3 className="font-semibold text-blue-800 mb-2">Format Guide</h3>
        {entity === 'temples' ? (
          <div className="text-sm text-blue-700 space-y-2">
            <p><strong>CSV columns:</strong> title, description, location, city, state, country, deity, type, pincode</p>
            <pre className="rounded-xl p-2 text-xs overflow-x-auto" style={{ background: 'rgba(59,130,246,0.08)' }}>
{`title,description,location,state,deity
Kashi Vishwanath,Ancient Shiva temple,Varanasi,Uttar Pradesh,Lord Shiva
Meenakshi Temple,Historic temple,Madurai,Tamil Nadu,Goddess Meenakshi`}
            </pre>
            <p><strong>JSON:</strong> Array of objects with same fields</p>
          </div>
        ) : (
          <div className="text-sm text-blue-700 space-y-2">
            <p><strong>CSV columns:</strong> title, description, category, language, deity, audio, lyrics, artist, duration</p>
            <pre className="rounded-xl p-2 text-xs overflow-x-auto" style={{ background: 'rgba(59,130,246,0.08)' }}>
{`title,category,deity,language
Shiv Tandav Stotram,Stotra,Lord Shiva,Sanskrit
Hanuman Chalisa,Chalisa,Lord Hanuman,Hindi`}
            </pre>
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="admin-card p-6">
        <h2 className="admin-section-title mb-3">2. Paste Data</h2>
        <textarea
          value={rawText}
          onChange={e => setRawText(e.target.value)}
          rows={10}
          className="admin-input w-full font-mono"
          placeholder={`Paste CSV or JSON data here...\n\nCSV example:\ntitle,description,location\nTemple Name,Description text,City Name`}
        />
        <div className="flex gap-3 mt-3">
          <button onClick={parseCSV} disabled={!rawText.trim()} className="admin-btn admin-btn-primary px-4 py-2 text-sm disabled:opacity-40">
            Parse as CSV
          </button>
          <button onClick={parseJSON} disabled={!rawText.trim()} className="admin-btn px-4 py-2 text-sm disabled:opacity-40" style={{ background: '#7C3AED', color: 'white' }}>
            Parse as JSON
          </button>
        </div>
      </div>

      {/* Errors */}
      {errors.length > 0 && (
        <div className="admin-card p-4" style={{ background: '#FEF2F2', borderColor: 'rgba(220,38,38,0.15)' }}>
          <h3 className="font-semibold text-red-700 mb-2">Errors ({errors.length})</h3>
          <ul className="text-sm text-red-600 space-y-1">
            {errors.slice(0, 10).map((e, i) => <li key={i}>- {e}</li>)}
            {errors.length > 10 && <li>...and {errors.length - 10} more</li>}
          </ul>
        </div>
      )}

      {/* Preview */}
      {parsed.length > 0 && (
        <div className="admin-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="admin-section-title">3. Preview ({parsed.length} items)</h2>
            <button
              onClick={doImport}
              disabled={importing}
              className="admin-btn admin-btn-success px-5 py-2 text-sm disabled:opacity-50"
            >
              {importing ? 'Importing...' : `Import ${parsed.length} ${entity}`}
            </button>
          </div>
          <div className="admin-table-wrap overflow-x-auto max-h-72">
            <table>
              <thead className="sticky top-0">
                <tr>
                  <th>#</th>
                  {Object.keys(parsed[0] || {}).slice(0, 6).map(k => (
                    <th key={k}>{k}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {parsed.slice(0, 20).map((row, i) => (
                  <tr key={i}>
                    <td className="text-gray-400">{i + 1}</td>
                    {Object.values(row).slice(0, 6).map((v, j) => (
                      <td key={j} className="text-gray-700 max-w-[200px] truncate">{v}</td>
                    ))}
                  </tr>
                ))}
                {parsed.length > 20 && (
                  <tr><td colSpan={7} className="px-3 py-2 text-center text-gray-400 text-xs">...and {parsed.length - 20} more rows</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="admin-card p-5" style={{ background: result.failed === 0 ? '#F0FDF4' : '#FFFBEB', borderColor: result.failed === 0 ? 'rgba(22,163,74,0.15)' : 'rgba(217,119,6,0.15)' }}>
          <h3 className={`font-semibold mb-1 ${result.failed === 0 ? 'text-green-700' : 'text-yellow-700'}`}>Import Complete</h3>
          <p className="text-sm">
            <span className="text-green-600 font-medium">{result.success} succeeded</span>
            {result.failed > 0 && <span className="text-red-600 font-medium"> · {result.failed} failed</span>}
          </p>
        </div>
      )}
    </div>
  )
}
