import { useState, FormEvent } from 'react'
import { useAuth } from '../auth/AuthContext'
import { useTheme } from '../theme/ThemeContext'

export function LoginPage() {
  const { login } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const ok = await login(username, password)
    setLoading(false)
    if (!ok) setError('Invalid credentials. Try demo / demo123')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-light-950 dark:bg-dark-950 font-mono relative">
      {/* Theme toggle button */}
      <button
        onClick={toggleTheme}
        className="absolute top-4 right-4 px-3 py-2 rounded-lg border border-dark-300 dark:border-dark-700 bg-light-900 dark:bg-dark-800 text-dark-700 dark:text-dark-300 hover:bg-light-800 dark:hover:bg-dark-700 transition-colors text-lg"
        title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      >
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>

      <div className="card p-12 md:p-16 w-full max-w-sm sm:rounded-2xl shadow-lg shadow-primary/5 bg-white dark:bg-dark-900 border border-light-700 dark:border-dark-700">
        <div className="text-center mb-10">
          <div className="text-3xl font-black text-primary font-heading -tracking-tight">
            ⬡ TRADEX
          </div>
          <div className="text-dark-500 dark:text-dark-600 text-sm mt-1.5 tracking-widest">
            MOCK TRADING TERMINAL
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-dark-500 dark:text-dark-600 tracking-widest mb-1.5 font-bold">
              USERNAME
            </label>
            <input
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="demo"
              className="w-full px-3 py-2 rounded-lg border border-light-700 dark:border-dark-700 bg-white dark:bg-dark-900 text-dark-700 dark:text-dark-300 placeholder-dark-400 dark:placeholder-dark-600 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <div>
            <label className="block text-xs text-dark-500 dark:text-dark-600 tracking-widest mb-1.5 font-bold">
              PASSWORD
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="demo123"
              className="w-full px-3 py-2 rounded-lg border border-light-700 dark:border-dark-700 bg-white dark:bg-dark-900 text-dark-700 dark:text-dark-300 placeholder-dark-400 dark:placeholder-dark-600 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          {error && (
            <div className="bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-700/50 rounded-lg p-3 text-red-800 dark:text-danger text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 rounded-lg font-bold tracking-widest text-sm transition-all duration-200 ${
              loading
                ? 'bg-dark-200 dark:bg-dark-700 text-dark-500 dark:text-dark-600 cursor-not-allowed'
                : 'bg-primary text-dark-950 hover:shadow-glow active:scale-95'
            }`}
          >
            {loading ? 'AUTHENTICATING...' : 'ENTER TERMINAL'}
          </button>
        </form>

        <div className="mt-6 p-3.5 bg-light-900 dark:bg-dark-800 rounded-lg border border-light-700 dark:border-dark-700">
          <div className="text-xs text-dark-500 dark:text-dark-600 tracking-wider mb-1.5 font-bold">DEMO CREDENTIALS</div>
          <div className="text-sm text-dark-600 dark:text-dark-500 space-y-0.5">
            <div>demo / demo123</div>
            <div>trader / trade456</div>
          </div>
        </div>
      </div>
    </div>
  )
}
