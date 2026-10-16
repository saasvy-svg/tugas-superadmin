'use client'

import { useTransition, useRef } from 'react'
import { Loader2 } from 'lucide-react'

interface LoginFormProps {
  loginAction: (formData: FormData) => Promise<void>
  errorMessage?: string
}

export default function LoginForm({ loginAction, errorMessage }: LoginFormProps) {
  const [isPending, startTransition] = useTransition()
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (isPending) return
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      await loginAction(formData)
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      formRef.current?.requestSubmit()
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
      {/* Email */}
      <div>
        <label
          htmlFor="login-email"
          className="block text-xs font-bold uppercase tracking-widest text-slate-700 mb-2"
        >
          Email Akses
        </label>
        <input
          id="login-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          disabled={isPending}
          onKeyDown={handleKeyDown}
          placeholder="admin@vylogix.com"
          className="w-full px-4 py-3 rounded-md bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-all duration-150 disabled:opacity-50"
        />
      </div>

      {/* Password */}
      <div>
        <label
          htmlFor="login-password"
          className="block text-xs font-bold uppercase tracking-widest text-slate-700 mb-2"
        >
          Password
        </label>
        <input
          id="login-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          disabled={isPending}
          onKeyDown={handleKeyDown}
          placeholder="••••••••••"
          className="w-full px-4 py-3 rounded-md bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-all duration-150 disabled:opacity-50"
        />
      </div>

      {/* Error message */}
      {errorMessage && (
        <div
          role="alert"
          className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 text-sm p-3.5 rounded-md"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4 mt-0.5 shrink-0 text-red-600"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span>{decodeURIComponent(errorMessage)}</span>
        </div>
      )}

      {/* Submit */}
      <button
        id="login-submit-button"
        type="submit"
        disabled={isPending}
        className="w-full bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white font-bold tracking-wide uppercase text-sm py-3.5 rounded-md transition-all duration-150 mt-2 focus:outline-none focus:ring-2 focus:ring-slate-900/50 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
      >
        {isPending ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Memproses Masuk...</span>
          </>
        ) : (
          <span>Akses Sistem</span>
        )}
      </button>
    </form>
  )
}
