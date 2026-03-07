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
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Bulk Import</h1>
        <p className="text-sm text-gray-500 mt-0.5">Import temples or devotionals in bulk using CSV or JSON</p>
      </div>

      {/* Entity selector */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">1. Select Type</h2>
        <div className="flex gap-3">
          <button onClick={() => { setEntity('temples'); setParsed([]); setErrors([]) }} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${entity === 'temples' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'}`}>
            Temples
          </button>
          <button onClick={() => { setEntity('devotionals'); setParsed([]); setErrors([]) }} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${entity === 'devotionals' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'}`}>
            Devotionals
          </button>
        </div>
      </div>

      {/* Format guide */}
      <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-xl p-5">
        <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">Format Guide</h3>
        {entity === 'temples' ? (
          <div className="text-sm text-blue-700 dark:text-blue-400 space-y-2">
            <p><strong>CSV columns:</strong> title, description, location, city, state, country, deity, type, pincode</p>
            <pre className="bg-blue-100 dark:bg-blue-900 rounded p-2 text-xs overflow-x-auto">
{`title,description,location,state,deity
Kashi Vishwanath,Ancient Shiva temple,Varanasi,Uttar Pradesh,Lord Shiva
Meenakshi Temple,Historic temple,Madurai,Tamil Nadu,Goddess Meenakshi`}
            </pre>
            <p><strong>JSON:</strong> Array of objects with same fields</p>
          </div>
        ) : (
          <div className="text-sm text-blue-700 dark:text-blue-400 space-y-2">
            <p><strong>CSV columns:</strong> title, description, category, language, deity, audio, lyrics, artist, duration</p>
            <pre className="bg-blue-100 dark:bg-blue-900 rounded p-2 text-xs overflow-x-auto">
{`title,category,deity,language
Shiv Tandav Stotram,Stotra,Lord Shiva,Sanskrit
Hanuman Chalisa,Chalisa,Lord Hanuman,Hindi`}
            </pre>
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">2. Paste Data</h2>
        <textarea
          value={rawText}
          onChange={e => setRawText(e.target.value)}
          rows={10}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm font-mono focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          placeholder={`Paste CSV or JSON data here...\n\nCSV example:\ntitle,description,location\nTemple Name,Description text,City Name`}
        />
        <div className="flex gap-3 mt-3">
          <button onClick={parseCSV} disabled={!rawText.trim()} className="px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40 transition-colors">
            Parse as CSV
          </button>
          <button onClick={parseJSON} disabled={!rawText.trim()} className="px-4 py-2 text-sm font-medium rounded-lg bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-40 transition-colors">
            Parse as JSON
          </button>
        </div>
      </div>

      {/* Errors */}
      {errors.length > 0 && (
        <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-xl p-4">
          <h3 className="font-semibold text-red-700 dark:text-red-400 mb-2">Errors ({errors.length})</h3>
          <ul className="text-sm text-red-600 dark:text-red-400 space-y-1">
            {errors.slice(0, 10).map((e, i) => <li key={i}>- {e}</li>)}
            {errors.length > 10 && <li>...and {errors.length - 10} more</li>}
          </ul>
        </div>
      )}

      {/* Preview */}
      {parsed.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">3. Preview ({parsed.length} items)</h2>
            <button
              onClick={doImport}
              disabled={importing}
              className="px-5 py-2 text-sm font-medium rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              {importing ? 'Importing...' : `Import ${parsed.length} ${entity}`}
            </button>
          </div>
          <div className="overflow-x-auto max-h-72">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-700 sticky top-0">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500">#</th>
                  {Object.keys(parsed[0] || {}).slice(0, 6).map(k => (
                    <th key={k} className="px-3 py-2 text-left text-xs font-semibold text-gray-500">{k}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {parsed.slice(0, 20).map((row, i) => (
                  <tr key={i} className="border-t border-gray-100 dark:border-gray-700">
                    <td className="px-3 py-2 text-gray-400">{i + 1}</td>
                    {Object.values(row).slice(0, 6).map((v, j) => (
                      <td key={j} className="px-3 py-2 text-gray-700 dark:text-gray-300 max-w-[200px] truncate">{v}</td>
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
        <div className={`rounded-xl p-5 border ${result.failed === 0 ? 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800' : 'bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800'}`}>
          <h3 className={`font-semibold mb-1 ${result.failed === 0 ? 'text-green-700 dark:text-green-300' : 'text-yellow-700 dark:text-yellow-300'}`}>Import Complete</h3>
          <p className="text-sm">
            <span className="text-green-600 font-medium">{result.success} succeeded</span>
            {result.failed > 0 && <span className="text-red-600 font-medium"> · {result.failed} failed</span>}
          </p>
        </div>
      )}
    </div>
  )
}
