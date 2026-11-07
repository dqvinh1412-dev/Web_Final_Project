import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import {
  AuthDivider,
  AuthStatusBanner,
  AuthTextInput,
  GoogleOAuthButton,
  PasswordInput,
  PasswordRequirementChips,
  PrimaryCtaButton,
  SplitStageAuthShell,
} from '../components/ui/auth-primitives'
import { EMAIL_PATTERN, evaluatePasswordRules } from '../lib/utils'
import { authService, isMockAuthMode } from '../services/authService'

interface RegisterFormValues {
  fullName: string
  email: string
  password: string
  confirmPassword: string
}

export function RegisterPage() {
  const navigate = useNavigate()
  const [errorBanner, setErrorBanner] = useState<string | null>(null)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    mode: 'onTouched',
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const passwordValue = useWatch({
    control,
    name: 'password',
    defaultValue: '',
  })

  const onSubmit = async (values: RegisterFormValues) => {
    setErrorBanner(null)
    try {
      await authService.register({
        fullName: values.fullName,
        email: values.email,
        password: values.password,
      })
      navigate('/login', {
        state: {
          registeredEmail: values.email.trim().toLowerCase(),
          statusMessage: 'Account created — please sign in to continue.',
        },
      })
    } catch (err) {
      setErrorBanner(
        err instanceof Error ? err.message : 'Registration could not be completed. Please try again.',
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
          Build your personal{' '}
          <span className="font-serif-accent text-[#67E8F9]">library</span> in seconds.
        </>
      }
    >
      <div className="space-y-5">
        <header className="space-y-1.5">
          <h1 className="text-[28px] font-bold leading-[1.15] tracking-[-0.025em] text-[#EEF6FA]">
            Create your <span className="font-serif-accent text-[#67E8F9]">account</span>
          </h1>
          <p className="text-sm text-[#8FA3B3]">
            Join Wibu Never Die to bookmark episodes, chapters, and custom lists.
          </p>
        </header>

        {errorBanner ? <AuthStatusBanner variant="error" message={errorBanner} /> : null}

        <GoogleOAuthButton
          onClick={handleGoogleSignIn}
          isLoading={isGoogleLoading}
          disabled={isSubmitting}
        />

        <AuthDivider label="or register with email" />

        <form
          onSubmit={handleSubmit(onSubmit)}
          onChange={() => {
            if (errorBanner) setErrorBanner(null)
          }}
          noValidate
          className="space-y-2.5"
        >
          <AuthTextInput
            id="register-full-name"
            label="Full Name"
            type="text"
            autoComplete="name"
            placeholder="Minh Nguyen"
            error={errors.fullName?.message}
            {...register('fullName', {
              required: 'Please enter your full name.',
              validate: (v) =>
                v.trim().length >= 2 || 'Full name must be at least 2 characters.',
            })}
          />

          <AuthTextInput
            id="register-email"
            label="Email"
            type="email"
            autoComplete="email"
            placeholder="minh@wibu.dev"
            error={errors.email?.message}
            {...register('email', {
              required: 'Please enter your email address.',
              pattern: {
                value: EMAIL_PATTERN,
                message: 'Please enter a valid email address.',
              },
            })}
          />

          <div className="space-y-1">
            <PasswordInput
              id="register-password"
              label="Password"
              autoComplete="new-password"
              placeholder="Create a strong password"
              describedById="register-password-chips"
              error={errors.password?.message}
              {...register('password', {
                required: 'Please create a password.',
                validate: (value) =>
                  evaluatePasswordRules(value).isValid ||
                  'Password must be at least 8 characters and include 1 letter and 1 number.',
              })}
            />
            <PasswordRequirementChips
              id="register-password-chips"
              password={passwordValue}
            />
          </div>

          <PasswordInput
            id="register-confirm-password"
            label="Confirm Password"
            autoComplete="new-password"
            placeholder="Re-enter your password"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword', {
              required: 'Please confirm your password.',
              validate: (value) =>
                value === passwordValue || 'Passwords do not match.',
            })}
          />

          <div className="pt-1.5">
            <PrimaryCtaButton
              type="submit"
              isLoading={isSubmitting}
              loadingText="Creating account..."
              disabled={isGoogleLoading}
            >
              Create Account
            </PrimaryCtaButton>
          </div>
        </form>

        <p className="text-center text-xs text-[#8FA3B3]">
          Already have an account?{' '}
          <Link
            to="/login"
            className="auth-transition font-semibold text-[#67E8F9] hover:text-[#38BDF8] focus-visible:outline-none focus-visible:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </SplitStageAuthShell>
  )
}
