import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { SNCredentials } from '../types'

interface AuthContextType {
  credentials: SNCredentials | null
  login: (creds: SNCredentials) => void
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

const STORAGE_KEY = 'biz_sn_creds'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [credentials, setCredentials] = useState<SNCredentials | null>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  })

  useEffect(() => {
    if (credentials) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(credentials))
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [credentials])

  function login(creds: SNCredentials) {
    setCredentials(creds)
  }

  function logout() {
    setCredentials(null)
  }

  return (
    <AuthContext.Provider value={{ credentials, login, logout, isAuthenticated: !!credentials }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
