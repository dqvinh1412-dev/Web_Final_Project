import { ArrowLeft } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import {
  AuthStatusBanner,
  AuthTextInput,
  PrimaryCtaButton,
  SplitStageAuthShell,
} from '../components/ui/auth-primitives'
import { EMAIL_PATTERN } from '../lib/utils'
import { authService } from '../services/authService'
import type { ForgotPasswordResponse } from '../types/auth'

interface ForgotPasswordFormValues {
  email: string
}

export function ForgotPasswordPage() {
  const [confirmation, setConfirmation] = useState<ForgotPasswordResponse | null>(null)
  const [errorBanner, setErrorBanner] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    mode: 'onTouched',
    defaultValues: { email: '' },
  })

  const onSubmit = async ({ email }: ForgotPasswordFormValues) => {
    setErrorBanner(null)
    try {
      const result = await authService.requestPasswordReset(email)
      setConfirmation(result)
    } catch (err) {
      setErrorBanner(
        err instanceof Error
          ? err.message
          : 'Could not send password reset instructions. Please try again.',
      )
    }
  }

  return (
    <SplitStageAuthShell
      showcaseTitle={
        <>
          Lost your key? Let&apos;s get you{' '}
          <span className="font-serif-accent text-[#67E8F9]">back</span> in.
        </>
      }
    >
      <div className="space-y-6">
        <header className="space-y-1.5">
          <h1 className="text-[28px] font-bold leading-[1.15] tracking-[-0.025em] text-[#EEF6FA]">
            Reset your <span className="font-serif-accent text-[#67E8F9]">password</span>
          </h1>
          <p className="text-sm text-[#8FA3B3]">
            Enter your registered email and we&apos;ll send a link to choose a new password.
          </p>
        </header>

        {errorBanner ? <AuthStatusBanner variant="error" message={errorBanner} /> : null}

        {confirmation ? (
          <div className="space-y-4">
            <AuthStatusBanner variant="info" message={confirmation.message}>
              {confirmation.mockResetToken ? (
                <div className="pt-1">
                  <Link
                    to={`/reset-password?token=${encodeURIComponent(confirmation.mockResetToken)}`}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[#38BDF8]/50 bg-[#0F1823] px-3 py-1 text-[11px] font-semibold text-[#67E8F9] hover:border-[#67E8F9]"
                  >
                    Open reset password link (Mock Mode)
                  </Link>
                </div>
              ) : null}
            </AuthStatusBanner>

            <Link
              to="/login"
              className="auth-transition inline-flex h-[44px] w-full items-center justify-center gap-2 rounded-[12px] border border-[#1B2938] bg-[#0A1017] px-4 text-sm font-semibold text-[#EEF6FA] hover:border-[#38BDF8]/40 hover:bg-[#0F1823]"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              <span>Back to Sign In</span>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-3">
            <AuthTextInput
              id="forgot-email"
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

            <PrimaryCtaButton
              type="submit"
              isLoading={isSubmitting}
              loadingText="Sending reset link..."
            >
              Send Reset Link
            </PrimaryCtaButton>
          </form>
        )}

        <div className="text-center">
          <Link
            to="/login"
            className="auth-transition inline-flex items-center gap-1.5 text-xs font-semibold text-[#8FA3B3] hover:text-[#67E8F9]"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Back to Sign In</span>
          </Link>
        </div>
      </div>
    </SplitStageAuthShell>
  )
}
