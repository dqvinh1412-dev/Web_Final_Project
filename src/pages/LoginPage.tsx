import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  AuthDivider,
  AuthStatusBanner,
  AuthTextInput,
  GoogleOAuthButton,
  PasswordInput,
  PrimaryCtaButton,
  SplitStageAuthShell,
} from '../components/ui/auth-primitives'
import { EMAIL_PATTERN } from '../lib/utils'
import { authService, isMockAuthMode } from '../services/authService'
import { useAuthStore } from '../store/authStore'
import type { LoginPayload } from '../types/auth'

interface LoginLocationState {
  registeredEmail?: string
  statusMessage?: string
  errorMessage?: string
}

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const setSession = useAuthStore((s) => s.setSession)

  const navState = (location.state as LoginLocationState | null) ?? null
  const [infoBanner, setInfoBanner] = useState<string | null>(
    navState?.statusMessage ??
      (navState?.registeredEmail ? 'Account created — please sign in to continue.' : null),
  )
  const [errorBanner, setErrorBanner] = useState<string | null>(navState?.errorMessage ?? null)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)

  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm<LoginPayload>({
    mode: 'onTouched',
    defaultValues: {
      email: navState?.registeredEmail ?? '',
      password: '',
    },
  })

  useEffect(() => {
    if (navState?.registeredEmail) {
      setFocus('password')
    }
  }, [navState?.registeredEmail, setFocus])

  const onSubmit = async (values: LoginPayload) => {
    setErrorBanner(null)
    setInfoBanner(null)
    try {
      const response = await authService.login(values)
      setSession(response.user, response.accessToken)
      navigate('/', { replace: true })
    } catch (err) {
      setErrorBanner(
        err instanceof Error
          ? err.message
          : 'Invalid email or password. Please check your details and try again.',
      )
    }
  }

  const handleGoogleSignIn = () => {
    setErrorBanner(null)
    setIsGoogleLoading(true)
    const targetUrl = authService.getGoogleOAuthRedirectUrl()
    if (isMockAuthMode() || targetUrl.startsWith('/')) {
      navigate(targetUrl)
    } else {
      window.location.assign(targetUrl)
    }
  }

  return (
    <SplitStageAuthShell
      showcaseTitle={
        <>
          Pick up right where the{' '}
          <span className="font-serif-accent text-[#67E8F9]">episode</span> ended.
        </>
      }
    >
      <div className="space-y-6">
        <header className="space-y-1.5">
          <h1 className="text-[28px] font-bold leading-[1.15] tracking-[-0.025em] text-[#EEF6FA]">
            Welcome <span className="font-serif-accent text-[#67E8F9]">back</span>
          </h1>
          <p className="text-sm text-[#8FA3B3]">
            Sign in to sync your watchlist and reading progress.
          </p>
        </header>

        {infoBanner ? <AuthStatusBanner variant="info" message={infoBanner} /> : null}
        {errorBanner ? <AuthStatusBanner variant="error" message={errorBanner} /> : null}

        <GoogleOAuthButton
          onClick={handleGoogleSignIn}
          isLoading={isGoogleLoading}
          disabled={isSubmitting}
        />

        <AuthDivider label="or continue with email" />

        <form
          onSubmit={handleSubmit(onSubmit)}
          onChange={() => {
            if (errorBanner) setErrorBanner(null)
          }}
          noValidate
          className="space-y-3"
        >
          <AuthTextInput
            id="login-email"
            label="Email"
            type="email"
            autoComplete="email"
            placeholder="name@example.com"
            error={errors.email?.message}
            {...register('email', {
              required: 'Please enter your email address.',
              pattern: {
                value: EMAIL_PATTERN,
                message: 'Please enter a valid email address.',
              },
            })}
          />

          <PasswordInput
            id="login-password"
            label="Password"
            autoComplete="current-password"
            placeholder="Enter your password"
            error={errors.password?.message}
            rightLabelSlot={
              <Link
                to="/forgot-password"
                className="auth-transition text-xs font-medium text-[#67E8F9] hover:text-[#38BDF8] focus-visible:outline-none focus-visible:underline"
              >
                Forgot password?
              </Link>
            }
            {...register('password', {
              required: 'Please enter your password.',
            })}
          />

          <div className="pt-1">
            <PrimaryCtaButton
              type="submit"
              isLoading={isSubmitting}
              loadingText="Signing in..."
              disabled={isGoogleLoading}
            >
              Sign In
            </PrimaryCtaButton>
          </div>
        </form>

        <p className="text-center text-xs text-[#8FA3B3]">
          New to Wibu Never Die?{' '}
          <Link
            to="/register"
            className="auth-transition font-semibold text-[#67E8F9] hover:text-[#38BDF8] focus-visible:outline-none focus-visible:underline"
          >
            Create an account
          </Link>
        </p>
      </div>
    </SplitStageAuthShell>
  )
}
