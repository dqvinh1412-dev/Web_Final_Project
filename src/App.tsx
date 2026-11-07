import { type ReactNode, useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ForgotPasswordPage } from './pages/ForgotPasswordPage'
import { LoginPage } from './pages/LoginPage'
import { OAuthCallbackPage, SessionHydratingScreen } from './pages/OAuthCallbackPage'
import { ProtectedHomePage } from './pages/ProtectedHomePage'
import { RegisterPage } from './pages/RegisterPage'
import { ResetPasswordPage } from './pages/ResetPasswordPage'
import { useAuthStore } from './store/authStore'

function ProtectedRoute({ children }: { children: ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const accessToken = useAuthStore((s) => s.accessToken)
  const isHydrating = useAuthStore((s) => s.isHydrating)
  const hydrateSession = useAuthStore((s) => s.hydrateSession)

  useEffect(() => {
    if (accessToken && !isAuthenticated) {
      void hydrateSession()
    }
  }, [accessToken, hydrateSession, isAuthenticated])

  if (isHydrating || (accessToken && !isAuthenticated)) {
    return <SessionHydratingScreen />
  }

  if (!isAuthenticated || !accessToken) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

function GuestRoute({ children }: { children: ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const accessToken = useAuthStore((s) => s.accessToken)

  if (isAuthenticated && accessToken) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

export function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <ProtectedHomePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/login"
        element={
          <GuestRoute>
            <LoginPage />
          </GuestRoute>
        }
      />
      <Route
        path="/register"
        element={
          <GuestRoute>
            <RegisterPage />
          </GuestRoute>
        }
      />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/auth/callback" element={<OAuthCallbackPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}
