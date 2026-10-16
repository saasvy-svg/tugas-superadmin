import { login } from './actions'
import LoginForm from './LoginForm'

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
          <LoginForm loginAction={login} errorMessage={errorMessage} />
        </div>
      </div>

      {/* ── Footer ── */}
      <p className="mt-10 text-xs text-slate-400 font-medium text-center">
        &copy; {new Date().getFullYear()} Vylogix Studio. Super Admin Only.
      </p>
    </div>
  )
}

