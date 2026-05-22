"use client"

import { useMemo, useState } from 'react'
import { Download, Headphones, Loader2, Share2, Volume2 } from 'lucide-react'
import { TextToSpeech } from './TextToSpeech'

type Props = {
  title: string
  text: string
  audio?: string
  lang: string
}

export default function DevotionalAudioPlayer({ title, text, audio, lang }: Props) {
  const [generatedAudioUrl, setGeneratedAudioUrl] = useState<string | null>(null)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState('')

  const activeAudio = generatedAudioUrl || audio || ''
  const canGenerate = text.trim().length > 0

  const shareTitle = useMemo(() => `Listen to ${title} on Sarvdev`, [title])

  async function generateServerAudio() {
    if (!canGenerate || generating) return
    setGenerating(true)
    setError('')
    try {
      const resp = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, lang }),
      })
      if (!resp.ok) {
        setError('Server audio is not available right now.')
        return
      }
      const contentType = resp.headers.get('Content-Type') || ''
      if (contentType.includes('text/html') || contentType.includes('application/json')) {
        setError('Server audio is not configured yet.')
        return
      }
      const blob = await resp.blob()
      setGeneratedAudioUrl(URL.createObjectURL(blob))
    } catch {
      setError('Could not generate audio. Please try again.')
    } finally {
      setGenerating(false)
    }
  }

  async function shareAudio() {
    const url = typeof window !== 'undefined' ? window.location.href : ''
    if (typeof navigator !== 'undefined' && 'share' in navigator) {
      try {
        await navigator.share({ title: shareTitle, url })
        return
      } catch {}
    }
    if (typeof navigator !== 'undefined' && navigator.clipboard && url) await navigator.clipboard.writeText(url)
  }

  return (
    <>
      <section className="overflow-hidden rounded-2xl border border-amber-200 bg-gradient-to-br from-white via-orange-50/70 to-amber-50 shadow-[0_18px_50px_rgba(92,64,51,0.1)]">
        <div className="border-b border-amber-200/70 bg-white/75 p-5 backdrop-blur">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-700">Premium Audio</p>
              <h2 className="mt-1 flex items-center gap-2 text-xl font-black text-stone-900">
                <Headphones className="h-5 w-5 text-orange-600" />
                Listen and Chant
              </h2>
            </div>
            <button
              type="button"
              onClick={shareAudio}
              className="rounded-full border border-amber-200 bg-white p-2 text-stone-700 shadow-sm transition hover:border-orange-300 hover:text-orange-700"
              aria-label="Share devotional"
            >
              <Share2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="space-y-5 p-5">
          {activeAudio ? (
            <div className="space-y-3">
              <audio controls src={activeAudio} className="w-full rounded-xl" />
              <div className="flex flex-wrap gap-2">
                <a
                  href={activeAudio}
                  download
                  className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white px-3 py-1.5 text-xs font-bold text-stone-700 no-underline transition hover:border-orange-300 hover:text-orange-700"
                >
                  <Download className="h-3.5 w-3.5" />
                  Download
                </a>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-amber-300 bg-white/70 p-4 text-sm font-medium text-stone-600">
              No recorded audio is attached yet. TTS can still read the lyrics aloud.
            </div>
          )}

          <div className="rounded-xl border border-orange-100 bg-white/80 p-4">
            <p className="mb-3 flex items-center gap-2 text-sm font-black text-stone-800">
              <Volume2 className="h-4 w-4 text-orange-600" />
              Text to Speech
            </p>
            <TextToSpeech text={text} lang={lang} />
          </div>

          <button
            type="button"
            onClick={generateServerAudio}
            disabled={!canGenerate || generating}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-stone-900 px-4 py-3 text-sm font-bold text-white transition hover:bg-orange-800 disabled:cursor-not-allowed disabled:opacity-55"
          >
            {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Volume2 className="h-4 w-4" />}
            {generating ? 'Generating audio...' : 'Generate Server Audio'}
          </button>
          {error && <p className="text-sm font-medium text-red-600">{error}</p>}
        </div>
      </section>

      {activeAudio && (
        <div className="fixed inset-x-3 bottom-20 z-40 rounded-2xl border border-amber-200 bg-white/95 p-3 shadow-2xl backdrop-blur lg:hidden">
          <div className="mb-2 flex items-center gap-2 text-xs font-bold text-stone-700">
            <Headphones className="h-4 w-4 text-orange-600" />
            {title}
          </div>
          <audio controls src={activeAudio} className="h-9 w-full" />
        </div>
      )}
    </>
  )
}
