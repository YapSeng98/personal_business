import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { SNCredentials, Session, AppUser } from '../types'
import { authLogin, authRegister, authLogout } from '../services/servicenow'

interface AuthContextType {
  credentials: SNCredentials | null
  user: AppUser | null
  isAuthenticated: boolean
  isDemo: boolean
  login: (instance: string, username: string, password: string) => Promise<void>
  register: (instance: string, data: { username: string; password: string; display_name: string; email: string }) => Promise<void>
  loginDemo: () => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

const STORAGE_KEY = 'biz_session'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  })

  useEffect(() => {
    if (session) localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
    else localStorage.removeItem(STORAGE_KEY)
  }, [session])

  async function login(instance: string, username: string, password: string) {
    const inst = instance.trim().replace(/^https?:\/\//, '').replace(/\/$/, '')
    const { token, user } = await authLogin(inst, username, password)
    setSession({ instance: inst, token, user })
  }

  async function register(instance: string, data: { username: string; password: string; display_name: string; email: string }) {
    const inst = instance.trim().replace(/^https?:\/\//, '').replace(/\/$/, '')
    const { token, user } = await authRegister(inst, data)
    setSession({ instance: inst, token, user })
  }

  function loginDemo() {
    setSession({
      instance: 'demo',
      token: 'demo',
      user: { sys_id: 'demo', username: 'demo', display_name: 'Demo User', email: 'demo@biztrack.app' },
    })
  }

  function logout() {
    if (session && session.token !== 'demo') authLogout(session.instance, session.token)
    setSession(null)
  }

  return (
    <AuthContext.Provider
      value={{
        credentials: session ? { instance: session.instance, token: session.token } : null,
        user: session?.user ?? null,
        isAuthenticated: !!session,
        isDemo: session?.token === 'demo',
        login,
        register,
        loginDemo,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
