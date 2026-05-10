import { AuthProvider, useAuth } from './auth/AuthContext'
import { ThemeProvider } from './theme/ThemeContext'
import { LoginPage } from './pages/LoginPage'
import { Dashboard } from './pages/Dashboard'

function AppRouter() {
  const { user } = useAuth()
  return user ? <Dashboard /> : <LoginPage />
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </ThemeProvider>
  )
}
