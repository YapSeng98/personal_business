import { useState } from 'react'
import { Briefcase, Loader2, AlertCircle } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { testConnection } from '../services/servicenow'

export default function Login() {
  const { login } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!username || !password) return
    setError('')
    setLoading(true)
    const creds = { instance: 'dev405150.service-now.com', username, password }
    const ok = await testConnection(creds)
    if (ok) {
      login(creds)
    } else {
      setError('Could not connect. Check your username and password.')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-lg shadow-brand-500/40 mb-4">
            <Briefcase className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">BizTrack</h1>
          <p className="text-slate-500 text-sm mt-1">Personal Business Manager</p>
        </div>

        <div className="card">
          <h2 className="text-base font-semibold text-slate-900 mb-1">Sign in to ServiceNow</h2>
          <p className="text-sm text-slate-400 mb-6">
            Connected to <span className="font-medium text-brand-600">dev405150.service-now.com</span>
          </p>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm mb-4">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Username</label>
              <input
                className="input-field"
                type="text"
                placeholder="admin"
                value={username}
                onChange={e => setUsername(e.target.value)}
                autoFocus
              />
            </div>
            <div>
              <label className="label">Password</label>
              <input
                className="input-field"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={loading || !username || !password}
              className="btn-primary w-full justify-center py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Connecting...</>
              ) : (
                'Connect & Sign In'
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          Credentials are stored locally in your browser only.
        </p>
      </div>
    </div>
  )
}
