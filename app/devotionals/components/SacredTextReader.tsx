'use client'

import { useEffect, useMemo, useState } from 'react'

type ScriptView = 'all' | 'indic' | 'latin'

const FONT_STEPS = [
  { label: 'A', size: 'text-body' },
  { label: 'A', size: 'text-h4' },
  { label: 'A', size: 'text-h3' },
]

const LINE_STEPS = [
  { label: 'Compact', className: 'leading-relaxed' },
  { label: 'Comfortable', className: 'leading-loose' },
  { label: 'Spacious', className: 'leading-[2.6]' },
]

function isDevanagari(line: string) {
  return /[\u0900-\u097F]/.test(line)
}

export default function SacredTextReader({
  text,
  title,
  language,
}: {
  text: string
  title: string
  language?: string
}) {
  const [fontStep, setFontStep] = useState(1)
  const [lineStep, setLineStep] = useState(1)
  const [view, setView] = useState<ScriptView>('all')
  const [focus, setFocus] = useState(false)

  const lines = useMemo(
    () => text.split(/\r?\n/).map((line) => line.trim()),
    [text]
  )

  const hasIndic = useMemo(() => lines.some((line) => line && isDevanagari(line)), [lines])
  const hasLatin = useMemo(() => lines.some((line) => line && !isDevanagari(line)), [lines])

  const visible = useMemo(() => {
    if (view === 'indic') return lines.filter((line) => line && isDevanagari(line))
    if (view === 'latin') return lines.filter((line) => line && !isDevanagari(line))
    return lines
  }, [lines, view])

  useEffect(() => {
    if (!focus) return
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') setFocus(false)
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [focus])

  const bodyClass = `${FONT_STEPS[fontStep].size} ${LINE_STEPS[lineStep].className} font-devanagari text-secondary-800`

  const body = (
    <div className={bodyClass}>
      {visible.map((line, index) =>
        line ? (
          <p key={`${index}-${line.slice(0, 12)}`} className="whitespace-pre-wrap">{line}</p>
        ) : (
          <div key={`gap-${index}`} className="h-4" aria-hidden="true" />
        )
      )}
    </div>
  )

  const controls = (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-caption uppercase tracking-[0.12em] text-ink-muted">
      <div className="flex items-center gap-2">
        <span>Text size</span>
        <div className="flex items-center border border-surface-border">
          {FONT_STEPS.map((step, index) => (
            <button
              key={index}
              type="button"
              aria-pressed={fontStep === index}
              aria-label={`Text size ${index + 1}`}
              onClick={() => setFontStep(index)}
              className={`px-3 py-1 ${step.size} leading-none ${fontStep === index ? 'bg-primary text-white' : 'text-ink-muted hover:text-primary-700'}`}
            >
              {step.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span>Spacing</span>
        <div className="flex items-center border border-surface-border">
          {LINE_STEPS.map((step, index) => (
            <button
              key={step.label}
              type="button"
              aria-pressed={lineStep === index}
              onClick={() => setLineStep(index)}
              className={`px-3 py-1.5 text-caption normal-case tracking-normal ${lineStep === index ? 'bg-primary text-white' : 'text-ink-muted hover:text-primary-700'}`}
            >
              {step.label}
            </button>
          ))}
        </div>
      </div>

      {hasIndic && hasLatin && (
        <div className="flex items-center gap-2">
          <span>Script</span>
          <div className="flex items-center border border-surface-border">
            {([
              { key: 'all', label: 'Both' },
              { key: 'indic', label: 'Devanagari' },
              { key: 'latin', label: 'Latin' },
            ] as { key: ScriptView; label: string }[]).map((option) => (
              <button
                key={option.key}
                type="button"
                aria-pressed={view === option.key}
                onClick={() => setView(option.key)}
                className={`px-3 py-1.5 text-caption normal-case tracking-normal ${view === option.key ? 'bg-primary text-white' : 'text-ink-muted hover:text-primary-700'}`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setFocus((current) => !current)}
        className="border border-surface-border px-3 py-1.5 text-caption normal-case tracking-normal text-ink-muted transition hover:border-primary hover:text-primary-700"
      >
        {focus ? 'Exit focus reading' : 'Focus reading'}
      </button>
    </div>
  )

  if (focus) {
    return (
      <div className="fixed inset-0 z-[60] overflow-y-auto bg-surface">
        <div className="sticky top-0 border-b border-surface-border bg-surface/95 backdrop-blur">
          <div className="page-container flex flex-wrap items-center justify-between gap-4 py-4">
            <div>
              <p className="font-display text-h3 text-secondary-800">{title}</p>
              {language && <p className="text-caption text-ink-muted">{language}</p>}
            </div>
            {controls}
          </div>
        </div>
        <div className="page-container max-w-3xl py-10">{body}</div>
      </div>
    )
  }

  return (
    <section aria-label="Sacred text" className="border-t border-surface-border pt-8">
      {controls}
      <div className="mt-8 border-l-2 border-accent/50 pl-5 sm:pl-8">{body}</div>
    </section>
  )
}
