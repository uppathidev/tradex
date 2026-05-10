import { createContext, useContext, useState, ReactNode } from 'react'

interface AuthContextType {
  user: string | null
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

const MOCK_USERS: Record<string, string> = {
  'demo': 'demo123',
  'trader': 'trade456',
  'admin': 'admin789',
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<string | null>(
    sessionStorage.getItem('trading_user')
  )

  const login = async (username: string, password: string): Promise<boolean> => {
    await new Promise(r => setTimeout(r, 600))
    if (MOCK_USERS[username] === password) {
      setUser(username)
      sessionStorage.setItem('trading_user', username)
      return true
    }
    return false
  }

  const logout = () => {
    setUser(null)
    sessionStorage.removeItem('trading_user')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
