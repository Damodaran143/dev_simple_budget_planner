import { createContext, useContext, useEffect, useState } from 'react'
import { loadValue, saveValue } from '../utils/storage'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => loadValue('auth', null))

  useEffect(() => {
    saveValue('auth', user)
  }, [user])

  function login(name) {
    const cleanName = name.trim() || 'Guest'
    setUser({ name: cleanName, since: new Date().toISOString() })
  }

  function logout() {
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: Boolean(user), login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
