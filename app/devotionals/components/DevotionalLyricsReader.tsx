"use client"

import { useMemo, useState } from 'react'
import { FileText, Languages } from 'lucide-react'
import { isDevanagari } from '../utils/bilingual'

type Props = {
  title: string
  lyrics?: string
  language?: string
  names?: { sanskrit?: string; mantra?: string; english?: string }[]
}

type ViewMode = 'combined' | 'indic' | 'english'

export default function DevotionalLyricsReader({ title, lyrics, language, names }: Props) {
  const [open, setOpen] = useState(true)
  const [mode, setMode] = useState<ViewMode>('combined')

  const parsed = useMemo(() => {
    const lines = (lyrics || '').split(/\r?\n/).map((line) => line.trim()).filter(Boolean)
    return {
      all: lines,
      indic: lines.filter((line) => isDevanagari(line)),
      english: lines.filter((line) => !isDevanagari(line)),
    }
  }, [lyrics])

  const visibleLines = mode === 'indic' ? parsed.indic : mode === 'english' ? parsed.english : parsed.all
  const hasLyrics = Boolean(lyrics?.trim())
  const hasNames = Boolean(names?.length)

  if (!hasLyrics && !hasNames) {
    return (
      <section className="rounded-2xl border border-stone-200 bg-white p-6 text-center shadow-sm">
        <FileText className="mx-auto h-8 w-8 text-stone-400" />
        <p className="mt-3 font-semibold text-stone-700">Lyrics are not available yet.</p>
      </section>
    )
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-amber-200 bg-white shadow-[0_18px_50px_rgba(92,64,51,0.08)]">
      <div className="border-b border-amber-200/70 bg-gradient-to-r from-orange-50 to-amber-50 p-5">
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="flex items-center gap-3 text-left"
          aria-expanded={open}
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-600 text-white">
            <FileText className="h-5 w-5" />
          </span>
          <span>
            <span className="block text-xs font-bold uppercase tracking-[0.18em] text-orange-700">Lyrics Reader</span>
            <span className="block text-xl font-black text-stone-900">{title}</span>
          </span>
        </button>
      </div>

      {open && (
        <div className="p-5 sm:p-7">
          {hasLyrics && (
            <>
              <div className="mb-6 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 text-sm font-bold text-stone-700">
                  <Languages className="h-4 w-4 text-orange-600" />
                  View
                </span>
                {(['combined', 'indic', 'english'] as ViewMode[]).map((option) => {
                  const disabled = option === 'indic' ? parsed.indic.length === 0 : option === 'english' ? parsed.english.length === 0 : false
                  return (
                    <button
                      key={option}
                      type="button"
                      disabled={disabled}
                      onClick={() => setMode(option)}
                      className="rounded-full border px-3 py-1.5 text-xs font-bold capitalize transition disabled:cursor-not-allowed disabled:opacity-40"
                      data-active={mode === option ? 'true' : 'false'}
                      style={{
                        background: mode === option ? '#FF9933' : '#FFFFFF',
                        borderColor: mode === option ? '#FF9933' : '#E5E0D5',
                        color: mode === option ? '#FFFFFF' : '#5C4033',
                      }}
                    >
                      {option === 'indic' ? language || 'Hindi / Sanskrit' : option}
                    </button>
                  )
                })}
              </div>

              <div className="lyrics-content rounded-2xl border border-orange-100 bg-orange-50/35 p-5 sm:p-8">
                <div className="mx-auto max-w-3xl space-y-4 text-center">
                  {visibleLines.map((line, index) => (
                    <p
                      key={`${line}-${index}`}
                      className={`${isDevanagari(line) ? 'font-devanagari text-[1.35rem] leading-[2.25rem] sm:text-[1.55rem] sm:leading-[2.65rem]' : 'text-base leading-8 sm:text-lg'} text-stone-900`}
                    >
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            </>
          )}

          {hasNames && (
            <div className="mt-6 rounded-2xl border border-stone-200 bg-stone-50 p-5">
              <h3 className="mb-4 text-lg font-black text-stone-900">{names!.length} Sacred Names</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {names!.map((name, index) => (
                  <div key={`${name.english || name.sanskrit || index}`} className="rounded-xl bg-white p-3 shadow-sm">
                    <span className="text-xs font-bold text-stone-400">{index + 1}</span>
                    {name.sanskrit && <p className="font-devanagari text-lg font-bold text-stone-900">{name.sanskrit}</p>}
                    {name.english && <p className="text-sm font-semibold text-stone-700">{name.english}</p>}
                    {name.mantra && <p className="mt-1 text-xs font-medium text-orange-700">{name.mantra}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  )
}
