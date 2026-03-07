'use client'

import { createContext, useContext, useState, useCallback, useEffect } from 'react'

type ToastType = 'success' | 'error' | 'info' | 'warning'

interface Toast {
  id: number
  message: string
  type: ToastType
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType) => void
  success: (message: string) => void
  error: (message: string) => void
  info: (message: string) => void
  warning: (message: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

let nextId = 0

const ICONS: Record<ToastType, string> = {
  success: '✓',
  error: '✕',
  info: 'ℹ',
  warning: '⚠',
}

const STYLES: Record<ToastType, string> = {
  success: 'bg-green-800 text-green-50 border-green-600',
  error: 'bg-red-900 text-red-50 border-red-600',
  info: 'bg-secondary-800 text-secondary-50 border-secondary-600',
  warning: 'bg-amber-800 text-amber-50 border-amber-600',
}

const ICON_BG: Record<ToastType, string> = {
  success: 'bg-green-600',
  error: 'bg-red-600',
  info: 'bg-secondary-600',
  warning: 'bg-amber-600',
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: number) => void }) {
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setExiting(true)
      setTimeout(() => onDismiss(toast.id), 300)
    }, 4000)
    return () => clearTimeout(timer)
  }, [toast.id, onDismiss])

  return (
    <div
      role="alert"
      className={`flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg max-w-sm w-full transition-all duration-300 ${STYLES[toast.type]} ${
        exiting ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'
      }`}
      style={{ animation: exiting ? undefined : 'toastIn 300ms ease both' }}
    >
      <span
        className={`flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full text-white text-xs font-bold ${ICON_BG[toast.type]}`}
      >
        {ICONS[toast.type]}
      </span>
      <p className="text-sm font-medium flex-1">{toast.message}</p>
      <button
        onClick={() => {
          setExiting(true)
          setTimeout(() => onDismiss(toast.id), 300)
        }}
        className="flex-shrink-0 text-current opacity-60 hover:opacity-100 transition-opacity"
        aria-label="Dismiss"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const addToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = ++nextId
    setToasts((prev) => [...prev.slice(-4), { id, message, type }])
  }, [])

  const value: ToastContextValue = {
    toast: addToast,
    success: useCallback((msg: string) => addToast(msg, 'success'), [addToast]),
    error: useCallback((msg: string) => addToast(msg, 'error'), [addToast]),
    info: useCallback((msg: string) => addToast(msg, 'info'), [addToast]),
    warning: useCallback((msg: string) => addToast(msg, 'warning'), [addToast]),
  }

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* Toast container — fixed top-right */}
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto">
            <ToastItem toast={t} onDismiss={dismiss} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) {
    // Fallback for pages that are outside provider (shouldn't happen)
    return {
      toast: (msg) => typeof window !== 'undefined' && window.alert(msg),
      success: (msg) => typeof window !== 'undefined' && window.alert(msg),
      error: (msg) => typeof window !== 'undefined' && window.alert(msg),
      info: (msg) => typeof window !== 'undefined' && window.alert(msg),
      warning: (msg) => typeof window !== 'undefined' && window.alert(msg),
    }
  }
  return ctx
}
