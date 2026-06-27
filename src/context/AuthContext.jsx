import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { api, getTokens, setTokens } from '../utils/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  // True while we check an existing token on first load - prevents a
  // flash-redirect to /login before we know whether the user is signed in.
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function restoreSession() {
      const tokens = getTokens()
      if (!tokens?.access) {
        setIsLoading(false)
        return
      }
      try {
        const profile = await api.get('/auth/profile/')
        if (!cancelled) setUser(profile)
      } catch {
        setTokens(null)
        if (!cancelled) setUser(null)
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    restoreSession()
    return () => {
      cancelled = true
    }
  }, [])

  // Creates a new account. Does not sign the user in - they confirm with
  // their own password on the login screen right after, same flow as most
  // real signup forms.
  const signup = useCallback(async (name, password) => {
    await api.post('/auth/register/', { name, password }, { auth: false })
  }, [])

  const login = useCallback(async (name, password) => {
    const data = await api.post('/auth/login/', { name, password }, { auth: false })
    setTokens({ access: data.access, refresh: data.refresh })
    setUser(data.user)
  }, [])

  const updateProfile = useCallback(async (name) => {
    const profile = await api.patch('/auth/profile/', { name })
    setUser(profile)
    return profile
  }, [])

  const logout = useCallback(() => {
    setTokens(null)
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: Boolean(user), isLoading, signup, login, logout, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
