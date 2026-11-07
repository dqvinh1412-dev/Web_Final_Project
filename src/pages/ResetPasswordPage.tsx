import { ArrowLeft } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import {
  AuthStatusBanner,
  PasswordInput,
  PasswordRequirementChips,
  PrimaryCtaButton,
  SplitStageAuthShell,
} from '../components/ui/auth-primitives'
import { evaluatePasswordRules } from '../lib/utils'
import { authService } from '../services/authService'

interface ResetPasswordFormValues {
  newPassword: string
  confirmPassword: string
}

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token')?.trim() ?? ''

  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(token ? null : false)
  const [errorBanner, setErrorBanner] = useState<string | null>(
    token ? null : 'This reset link is invalid or has expired. Request a new link to continue.',
  )

  useEffect(() => {
    if (!token) {
      return
    }
    let active = true
    authService
      .validateResetToken(token)
      .then((valid) => {
        if (!active) return
        setIsTokenValid(valid)
        if (!valid) {
          setErrorBanner(
            'This reset link is invalid or has expired. Request a new link to continue.',
          )
        }
      })
      .catch(() => {
        if (!active) return
        setIsTokenValid(false)
        setErrorBanner('This reset link is invalid or has expired. Request a new link to continue.')
      })

    return () => {
      active = false
    }
  }, [token])

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    mode: 'onTouched',
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  })

  const newPasswordValue = useWatch({
    control,
    name: 'newPassword',
    defaultValue: '',
  })

  const onSubmit = async (values: ResetPasswordFormValues) => {
    setErrorBanner(null)
    try {
      await authService.resetPassword({
        token,
        newPassword: values.newPassword,
      })
      navigate('/login', {
        replace: true,
        state: {
          statusMessage: 'Password updated — sign in with your new password.',
        },
      })
    } catch (err) {
      setIsTokenValid(false)
      setErrorBanner(
        err instanceof Error
          ? err.message
          : 'This reset link is invalid or has expired. Request a new link to continue.',
      )
    }
  }

  return (
    <SplitStageAuthShell
      showcaseTitle={
        <>
          Secure your <span className="font-serif-accent text-[#67E8F9]">gateway</span> back to the
          screen.
        </>
      }
    >
      <div className="space-y-6">
        <header className="space-y-1.5">
          <h1 className="text-[28px] font-bold leading-[1.15] tracking-[-0.025em] text-[#EEF6FA]">
            Choose a new <span className="font-serif-accent text-[#67E8F9]">password</span>
          </h1>
          <p className="text-sm text-[#8FA3B3]">
            Create a strong password to restore access to your Wibu Never Die account.
          </p>
        </header>

        {errorBanner ? <AuthStatusBanner variant="error" message={errorBanner} /> : null}

        {isTokenValid === false ? (
          <div className="space-y-3">
            <Link
              to="/forgot-password"
              className="auth-transition cta-glow inline-flex h-[44px] w-full items-center justify-center rounded-[12px] bg-[#FFFFFF] px-5 text-sm font-extrabold text-[#02060B] hover:bg-[#EEF6FA]"
            >
              Request New Reset Link
            </Link>
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
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-3">
            <div className="space-y-1">
              <PasswordInput
                id="reset-new-password"
                label="New Password"
                autoComplete="new-password"
                placeholder="Enter your new password"
                describedById="reset-password-chips"
                error={errors.newPassword?.message}
                {...register('newPassword', {
                  required: 'Please enter a new password.',
                  validate: (value) =>
                    evaluatePasswordRules(value).isValid ||
                    'Password must be at least 8 characters and include 1 letter and 1 number.',
                })}
              />
              <PasswordRequirementChips
                id="reset-password-chips"
                password={newPasswordValue}
              />
            </div>

            <PasswordInput
              id="reset-confirm-password"
              label="Confirm New Password"
              autoComplete="new-password"
              placeholder="Re-enter your new password"
              error={errors.confirmPassword?.message}
              {...register('confirmPassword', {
                required: 'Please confirm your new password.',
                validate: (value) =>
                  value === newPasswordValue || 'Passwords do not match.',
              })}
            />

            <div className="pt-1">
              <PrimaryCtaButton
                type="submit"
                isLoading={isSubmitting}
                loadingText="Updating password..."
                disabled={isTokenValid === null}
              >
                Update Password
              </PrimaryCtaButton>
            </div>
          </form>
        )}
      </div>
    </SplitStageAuthShell>
  )
}
