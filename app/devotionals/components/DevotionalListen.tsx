'use client'

import { useState } from 'react'
import { useAudioPlayer } from '@/lib/audio-player'
import { TextToSpeech } from './TextToSpeech'

/**
 * Recorded audio is routed through the site-wide player so playback continues across navigation.
 * Speech synthesis is offered separately and never presented as a recorded recitation.
 */
export default function DevotionalListen({
  id,
  title,
  deity,
  audioSrc,
  text,
  speechLang,
}: {
  id: string
  title: string
  deity?: string
  audioSrc?: string
  text: string
  speechLang: string
}) {
  const { play, pause, track, playing } = useAudioPlayer()
  const [assisted, setAssisted] = useState(false)

  const isCurrent = Boolean(audioSrc) && track?.id === id
  const canSpeak = text.trim().length > 0

  if (!audioSrc && !canSpeak) return null

  return (
    <section aria-label="Listening options" className="border-t border-surface-border pt-6">
      {audioSrc && (
        <button
          type="button"
          onClick={() => (isCurrent && playing ? pause() : play({ id, title, src: audioSrc, deity }))}
          className="border border-primary bg-primary px-5 py-2.5 text-body-sm font-semibold text-white transition hover:bg-maroon"
        >
          {isCurrent && playing ? 'Pause recitation' : 'Play recitation'}
        </button>
      )}

      {canSpeak && (
        <div className={audioSrc ? 'mt-5' : ''}>
          <button
            type="button"
            onClick={() => setAssisted((current) => !current)}
            className="text-body-sm font-semibold text-primary-700 underline-offset-4 hover:text-maroon hover:underline"
            aria-expanded={assisted}
          >
            {assisted ? 'Hide assisted reading' : 'Assisted reading (text-to-speech)'}
          </button>
          <p className="mt-2 max-w-2xl text-caption text-ink-muted">
            Your device reads the text aloud with a synthetic voice. This is a reading aid, not a recorded recitation.
          </p>
          {assisted && (
            <div className="mt-4">
              <TextToSpeech text={text} lang={speechLang} />
            </div>
          )}
        </div>
      )}
    </section>
  )
}
