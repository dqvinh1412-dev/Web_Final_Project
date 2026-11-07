import { Loader2 } from 'lucide-react'
import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { BrandWordmark } from '../components/ui/auth-primitives'
import { authService } from '../services/authService'
import { useAuthStore } from '../store/authStore'

export function SessionHydratingScreen({ label = 'Syncing session...' }: { label?: string }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#020509] px-5 text-[#EEF6FA]">
      <BrandWordmark />
      <div className="flex items-center gap-2.5 rounded-full border border-[#1B2938] bg-[#0A1017] px-4 py-2 text-xs font-medium text-[#8FA3B3]">
        <Loader2 className="h-4 w-4 animate-spin text-[#67E8F9]" aria-hidden="true" />
        <span>{label}</span>
      </div>
    </div>
  )
}

export function OAuthCallbackPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const setSession = useAuthStore((s) => s.setSession)
  const clearSession = useAuthStore((s) => s.clearSession)

  useEffect(() => {
    let active = true
    const token = searchParams.get('token')?.trim() ?? ''

    if (!token) {
      clearSession()
      navigate('/login', {
        replace: true,
        state: {
          errorMessage: 'Google sign-in could not be completed. Please try again.',
        },
      })
      return
    }

    authService
      .resolveOAuthCallbackToken(token)
      .then((res) => {
        if (!active) return
        setSession(res.user, res.accessToken)
        navigate('/', { replace: true })
      })
      .catch(() => {
        if (!active) return
        clearSession()
        navigate('/login', {
          replace: true,
          state: {
            errorMessage: 'Google sign-in could not be completed. Please try again.',
          },
        })
      })

    return () => {
      active = false
    }
  }, [clearSession, navigate, searchParams, setSession])

  return <SessionHydratingScreen label="Syncing session..." />
}
