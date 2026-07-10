import { useState } from 'react'
import { Briefcase, Sparkles } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const DEFAULT_INSTANCE = 'dev405150.service-now.com'

const styles = `
@keyframes lgFloat {0%,100%{transform:translate(0,0) scale(1)}40%{transform:translate(26px,-30px) scale(1.08)}70%{transform:translate(-16px,18px) scale(.93)}}
@keyframes lgGlow {0%,100%{box-shadow:0 8px 32px rgba(99,102,241,.45)}50%{box-shadow:0 8px 52px rgba(129,140,248,.75),0 0 0 8px rgba(99,102,241,.09)}}
@keyframes lgSpin {to{transform:rotate(360deg)}}
.lg-blob{position:absolute;border-radius:50%;pointer-events:none;filter:blur(90px);opacity:.32}
.lg-b1{width:500px;height:500px;background:radial-gradient(circle,#6366f1,transparent);top:-170px;right:-150px;animation:lgFloat 9s ease-in-out infinite}
.lg-b2{width:380px;height:380px;background:radial-gradient(circle,#8b5cf6,transparent);bottom:-110px;left:-90px;animation:lgFloat 12s ease-in-out infinite reverse}
.lg-b3{width:260px;height:260px;background:radial-gradient(circle,#38bdf8,transparent);top:42%;right:-70px;animation:lgFloat 7s ease-in-out infinite 2s}
.lg-grid{position:absolute;inset:0;pointer-events:none;background-image:linear-gradient(rgba(255,255,255,.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.02) 1px,transparent 1px);background-size:42px 42px}
.lg-icon{width:74px;height:74px;border-radius:22px;background:linear-gradient(135deg,#818cf8 0%,#6d28d9 100%);display:flex;align-items:center;justify-content:center;animation:lgGlow 3s ease-in-out infinite}
.lg-spin{width:12px;height:12px;border-radius:50%;border:2px solid rgba(129,140,248,.3);border-top-color:#818cf8;animation:lgSpin .7s linear infinite}
@media (prefers-reduced-motion: reduce){.lg-blob,.lg-icon{animation:none}}
`

export default function Login() {
  const { login, register, loginDemo } = useAuth()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function switchMode(m: 'login' | 'register') {
    setMode(m)
    setError('')
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    if (!username || !password) return
    setError(''); setLoading(true)
    try {
      await login(DEFAULT_INSTANCE, username, password)
    } catch (err) {
      setError((err as Error).message || 'Login failed.')
      setLoading(false)
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    if (!username || !password) return
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return }
    if (password !== confirm) { setError('Passwords do not match.'); return }
    setError(''); setLoading(true)
    try {
      await register(DEFAULT_INSTANCE, { username, password, display_name: displayName || username, email })
    } catch (err) {
      setError((err as Error).message || 'Could not create account.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden flex items-start justify-center" style={{ background: '#080a12' }}>
      <style>{styles}</style>
      <div className="lg-blob lg-b1" />
      <div className="lg-blob lg-b2" />
      <div className="lg-blob lg-b3" />
      <div className="lg-grid" />

      <div className="relative z-10 w-full max-w-[360px] px-6 py-12 m-auto flex flex-col items-center">
        {/* Brand */}
        <span className="text-[10px] font-bold tracking-[0.18em] uppercase text-brand-300 bg-brand-500/12 border border-brand-500/30 rounded-full px-3.5 py-1 mb-4">
          Personal Business
        </span>
        <div className="lg-icon mb-3">
          <Briefcase className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-[30px] font-bold tracking-tight text-white leading-none mb-1">BizTrack</h1>
        <p className="text-xs text-white/35 mb-4">Business Manager · ServiceNow</p>
        <div className="w-10 h-0.5 rounded-full bg-gradient-to-r from-transparent via-white/15 to-transparent mb-5" />

        <p className="text-[15px] font-semibold text-white/85 mb-5">
          {mode === 'login' ? 'Sign in to your account' : 'Create your account'}
        </p>

        <div className="w-full space-y-2.5">
          {mode === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-2.5">
              <input className="input-field" type="text" placeholder="Username" autoComplete="username" autoCapitalize="off" value={username} onChange={e => setUsername(e.target.value)} autoFocus />
              <input className="input-field" type="password" placeholder="Password" autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} />
              {error && <p className="text-xs text-red-400 text-center font-medium py-0.5">{error}</p>}
              <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3">
                {loading ? <><span className="lg-spin" /> Signing in…</> : 'Sign In'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-2.5">
              <input className="input-field" type="text" placeholder="Display name" autoComplete="name" value={displayName} onChange={e => setDisplayName(e.target.value)} autoFocus />
              <input className="input-field" type="text" placeholder="Username" autoComplete="username" autoCapitalize="off" value={username} onChange={e => setUsername(e.target.value)} />
              <input className="input-field" type="email" placeholder="Email (optional)" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} />
              <input className="input-field" type="password" placeholder="Password (min 6 chars)" autoComplete="new-password" value={password} onChange={e => setPassword(e.target.value)} />
              <input className="input-field" type="password" placeholder="Confirm password" autoComplete="new-password" value={confirm} onChange={e => setConfirm(e.target.value)} />
              {error && <p className="text-xs text-red-400 text-center font-medium py-0.5">{error}</p>}
              <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3">
                {loading ? <><span className="lg-spin" /> Creating…</> : 'Create Account'}
              </button>
            </form>
          )}

          <button
            type="button"
            onClick={() => switchMode(mode === 'login' ? 'register' : 'login')}
            className="w-full text-xs text-white/40 hover:text-white/70 transition-colors py-1.5"
          >
            {mode === 'login'
              ? <>No account? <span className="text-brand-300 font-semibold">Create one</span></>
              : <>Already have an account? <span className="text-brand-300 font-semibold">Sign in</span></>}
          </button>

          {/* Demo — no backend needed */}
          <div className="flex items-center gap-3 py-1">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-[10px] uppercase tracking-widest text-white/25">or</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>
          <button
            type="button"
            onClick={loginDemo}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 text-white/80 text-sm font-medium transition-colors"
          >
            <Sparkles className="w-4 h-4 text-brand-300" /> Explore the demo
          </button>
          <p className="text-[11px] text-white/25 text-center">Sample data · no ServiceNow needed</p>
        </div>

        <p className="text-[11px] text-white/20 mt-6 text-center">
          Your session is stored only in this browser.
        </p>
      </div>
    </div>
  )
}
