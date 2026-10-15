import { login } from './actions'

export const metadata = {
  title: 'Masuk — Vylogix CRM & Client Portal',
  description: 'Masuk ke portal Vylogix Studio untuk mengelola proyek dan melihat laporan perkembangan.',
}

/**
 * LoginPage renders a clean, full-screen portal access form.
 *
 * Authentication flow:
 *   1. User submits email + password via a Server Action form.
 *   2. `login()` server action authenticates with Supabase, reads the role
 *      from the `profiles` table, and redirects to the correct dashboard.
 *   3. If already authenticated, the middleware intercepts and redirects
 *      before this page component is ever rendered.
 */
export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>
}) {
  const resolvedParams = await searchParams
  const errorMessage = resolvedParams?.message

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4 py-8 sm:py-12">
      {/* ── Brand Header ── */}
      <div className="mb-8 text-center select-none">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-slate-900 shadow-md shadow-slate-900/20 mb-5">
          {/* Crown Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-8 h-8 text-amber-400"
            aria-hidden="true"
          >
            <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14" />
          </svg>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          SaaS Master <span className="text-amber-500">Console</span>
        </h1>
        <p className="mt-2 text-sm text-slate-500 font-medium tracking-wide uppercase">
          Pusat Kontrol Ekosistem Multi-Tenant
        </p>
      </div>

      {/* ── Container with Fast Account Switcher & Login Form ── */}
      <div className="w-full max-w-4xl flex flex-col items-center">

        {/* ── Card ── */}
        <div className="w-full max-w-md bg-white rounded-none border-t-4 border-t-slate-900 shadow-2xl p-8">
          <form action={login} className="space-y-6">
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
              placeholder="admin@vylogix.com"
              className="w-full px-4 py-3 rounded-md bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-all duration-150"
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
              placeholder="••••••••••"
              className="w-full px-4 py-3 rounded-md bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-all duration-150"
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
              className="w-full bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white font-bold tracking-wide uppercase text-sm py-3.5 rounded-md transition-all duration-150 mt-2 focus:outline-none focus:ring-2 focus:ring-slate-900/50"
            >
              Akses Sistem
            </button>
          </form>
        </div>
      </div>

      {/* ── Footer ── */}
      <p className="mt-10 text-xs text-slate-400 font-medium text-center">
        &copy; {new Date().getFullYear()} Vylogix Studio. Super Admin Only.
      </p>
    </div>
  )
}

