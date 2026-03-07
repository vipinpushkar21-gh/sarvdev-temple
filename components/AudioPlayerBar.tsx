"use client"

import { useAudioPlayer } from '../lib/audio-player'

function formatTime(sec: number) {
  if (!sec || !isFinite(sec)) return '0:00'
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${m}:${String(s).padStart(2, '0')}`
}

export default function AudioPlayerBar() {
  const { track, playing, currentTime, duration, pause, resume, stop, seek } = useAudioPlayer()

  if (!track) return null

  const pct = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div
      className="fixed bottom-0 inset-x-0 z-50 bg-secondary-800 text-white border-t border-secondary-700 shadow-elevated"
      role="region"
      aria-label="Audio player"
    >
      <div className="page-container flex items-center gap-3 py-2">
        {/* Play / Pause */}
        <button
          onClick={playing ? pause : resume}
          className="flex-shrink-0 w-9 h-9 rounded-full bg-primary flex items-center justify-center hover:bg-primary-600 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-400"
          aria-label={playing ? 'Pause' : 'Play'}
        >
          {playing ? (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            <svg className="w-4 h-4 ml-0.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        {/* Track info */}
        <div className="flex-1 min-w-0">
          <p className="text-body-sm text-white truncate">{track.title}</p>
          {track.deity && <p className="text-caption text-secondary-300 truncate">{track.deity}</p>}
        </div>

        {/* Progress */}
        <div className="hidden sm:flex items-center gap-2 flex-shrink-0 w-48">
          <span className="text-caption text-secondary-300 tabular-nums w-10 text-right">{formatTime(currentTime)}</span>
          <input
            type="range"
            min={0}
            max={duration || 0}
            step={0.5}
            value={currentTime}
            onChange={(e) => seek(Number(e.target.value))}
            className="flex-1 h-1 accent-primary cursor-pointer"
            aria-label="Seek"
          />
          <span className="text-caption text-secondary-300 tabular-nums w-10">{formatTime(duration)}</span>
        </div>

        {/* Close */}
        <button
          onClick={stop}
          className="flex-shrink-0 p-1.5 rounded-btn text-secondary-300 hover:text-white hover:bg-secondary-700 transition-colors"
          aria-label="Close player"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Mobile progress bar */}
      <div className="sm:hidden h-0.5 bg-secondary-700">
        <div className="h-full bg-primary transition-all duration-200" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
