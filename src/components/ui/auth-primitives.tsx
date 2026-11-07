import * as LabelPrimitive from '@radix-ui/react-label'
import * as SeparatorPrimitive from '@radix-ui/react-separator'
import { AlertCircle, Check, CheckCircle2, Eye, EyeOff, Loader2, Play, Sparkles } from 'lucide-react'
import { type ButtonHTMLAttributes, forwardRef, type InputHTMLAttributes, type ReactNode, useState } from 'react'
import { isMockAuthMode } from '../../services/authService'
import { cn, evaluatePasswordRules } from '../../lib/utils'

export function BrandWordmark({ className }: { className?: string }) {
  return (
    <div className={cn('inline-flex items-center gap-2.5 select-none', className)}>
      <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#67E8F9]/30 bg-[#0F1823] text-[#67E8F9] shadow-[0_0_14px_rgba(103,232,249,0.2)]">
        <Sparkles className="h-4 w-4" aria-hidden="true" />
      </span>
      <span className="text-base font-extrabold tracking-tight text-[#EEF6FA]">
        Wibu <span className="font-serif-accent font-normal text-[#67E8F9]">Never</span> Die
      </span>
    </div>
  )
}

interface SplitStageAuthShellProps {
  children: ReactNode
  showcaseTitle?: ReactNode
  showcaseSubtitle?: string
}

export function SplitStageAuthShell({
  children,
  showcaseTitle,
  showcaseSubtitle = 'Stream 1080p simulcasts, read vertical & paged manga, and keep every episode and chapter synced across your devices.',
}: SplitStageAuthShellProps) {
  return (
    <div className="min-h-screen w-full bg-[#020509] text-[#EEF6FA] lg:grid lg:grid-cols-[55%_45%]">
      {/* Left 55% Desktop Showcase / Compact Mobile Top Banner */}
      <aside className="relative flex h-[120px] sm:h-[148px] lg:h-auto lg:min-h-screen flex-col justify-between overflow-hidden border-b lg:border-b-0 lg:border-r border-[#1B2938] bg-[#0A1017] px-5 py-4 sm:px-8 sm:py-6 lg:p-12">
        {/* Duotone Glacial Cyan Atmospheric Stage */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 22% 28%, rgba(56, 189, 248, 0.16) 0%, rgba(10, 16, 23, 0.4) 48%, #020509 100%)',
          }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(186, 230, 253, 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(186, 230, 253, 0.08) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
          aria-hidden="true"
        />

        <div className="relative z-10 flex items-center justify-between">
          <BrandWordmark />
          <span className="rounded-full border border-[#67E8F9]/25 bg-[#0F1823]/90 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#67E8F9]">
            ANIME · MANGA · SYNC
          </span>
        </div>

        <div className="relative z-10 hidden lg:block my-auto max-w-xl space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#1B2938] bg-[#0F1823]/80 px-3.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#8FA3B3]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#67E8F9]" />
            AD-FREE SIMULCAST & READER HUB
          </div>

          <h2 className="text-4xl xl:text-[42px] font-extrabold leading-[1.08] tracking-[-0.03em] text-[#EEF6FA]">
            {showcaseTitle ?? (
              <>
                Pick up right where the{' '}
                <span className="font-serif-accent text-[#67E8F9]">episode</span> ended.
              </>
            )}
          </h2>

          <p className="max-w-md text-sm leading-relaxed text-[#8FA3B3]">{showcaseSubtitle}</p>

          {/* Atmospheric Preview Card */}
          <div className="max-w-md rounded-xl border border-[#1B2938] bg-[#020509]/80 p-4 backdrop-blur-md">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#67E8F9]/30 bg-[#0F1823] text-[#67E8F9]">
                  <Play className="h-4 w-4 fill-current" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#EEF6FA]">
                    Solo Leveling: Arise from the Shadow
                  </p>
                  <p className="text-[11px] text-[#8FA3B3]">
                    Episode 14 · 18:42 / 24:00 · 1080p SUB
                  </p>
                </div>
              </div>
              <span className="rounded-full bg-[#67E8F9]/15 px-2.5 py-0.5 text-[10px] font-semibold text-[#67E8F9]">
                78%
              </span>
            </div>
            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-[#0F1823]">
              <div className="h-full w-[78%] rounded-full bg-gradient-to-r from-[#38BDF8] to-[#67E8F9]" />
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between text-xs text-[#5C7285]">
          <span className="truncate">
            {isMockAuthMode()
              ? 'Demo Ready · demo@wibu.dev / Wibu2026!'
              : 'Encrypted JWT Session Gateway'}
          </span>
          <span className="hidden sm:inline text-[#8FA3B3]">1080p HD · Zero Ads</span>
        </div>
      </aside>

      {/* Right 45% Pure Obsidian Form Stage */}
      <main className="flex flex-col items-center justify-center px-5 py-8 sm:px-8 lg:p-12">
        <div className="w-full max-w-[400px]">{children}</div>
      </main>
    </div>
  )
}

export function AuthDivider({ label = 'or continue with email' }: { label?: string }) {
  return (
    <div className="relative my-5 flex items-center justify-center">
      <SeparatorPrimitive.Root className="h-px w-full bg-[#1B2938]" />
      <span className="absolute bg-[#020509] px-3 text-[11px] font-medium uppercase tracking-wider text-[#5C7285]">
        {label}
      </span>
    </div>
  )
}

interface PrimaryCtaButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean
  loadingText?: string
}

export const PrimaryCtaButton = forwardRef<HTMLButtonElement, PrimaryCtaButtonProps>(
  ({ className, children, isLoading = false, loadingText, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'auth-transition cta-glow inline-flex h-[44px] w-full cursor-pointer items-center justify-center gap-2 rounded-[12px] bg-[#FFFFFF] px-5 text-sm font-extrabold text-[#02060B] hover:bg-[#EEF6FA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#38BDF8] focus-visible:ring-offset-2 focus-visible:ring-offset-[#020509] disabled:cursor-not-allowed disabled:opacity-60',
          className,
        )}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin text-[#02060B]" aria-hidden="true" />
            <span>{loadingText || children}</span>
          </>
        ) : (
          children
        )}
      </button>
    )
  },
)
PrimaryCtaButton.displayName = 'PrimaryCtaButton'

interface GoogleOAuthButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean
}

export function GoogleOAuthButton({
  className,
  isLoading = false,
  disabled,
  ...props
}: GoogleOAuthButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled || isLoading}
      className={cn(
        'auth-transition inline-flex h-[44px] w-full cursor-pointer items-center justify-center gap-2.5 rounded-[12px] border border-[#1B2938] bg-[#0A1017] px-4 text-sm font-semibold text-[#EEF6FA] hover:border-[#38BDF8]/40 hover:bg-[#0F1823] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#38BDF8] disabled:cursor-not-allowed disabled:opacity-60',
        className,
      )}
      {...props}
    >
      <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="#EA4335"
          d="M12 10.2v3.9h5.5c-.2 1.3-1.5 3.8-5.5 3.8-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.8 3.4 14.6 2.5 12 2.5 6.8 2.5 2.5 6.8 2.5 12s4.3 9.5 9.5 9.5c5.5 0 9.1-3.9 9.1-9.3 0-.6-.1-1.1-.2-1.6H12z"
        />
        <path
          fill="#34A853"
          d="M3.6 7.4l3.2 2.3c.9-2.1 2.9-3.6 5.2-3.6 1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.8 3.4 14.6 2.5 12 2.5 8.3 2.5 5.1 4.6 3.6 7.4z"
        />
        <path
          fill="#FBBC05"
          d="M12 21.5c2.5 0 4.7-.8 6.3-2.3l-2.9-2.4c-.8.6-1.9 1-3.4 1-2.6 0-4.8-1.7-5.6-4.1l-3.2 2.5c1.5 3.1 4.8 5.3 8.8 5.3z"
        />
        <path
          fill="#4285F4"
          d="M21.1 12.2c0-.6-.1-1.1-.2-1.6H12v3.9h5.5c-.3 1.3-1 2.4-2.1 3.1l2.9 2.4c1.7-1.6 2.8-4 2.8-7.8z"
        />
      </svg>
      <span>Sign in with Google</span>
    </button>
  )
}

interface AuthTextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string
  label: string
  error?: string
  rightLabelSlot?: ReactNode
}

export const AuthTextInput = forwardRef<HTMLInputElement, AuthTextInputProps>(
  ({ id, label, error, rightLabelSlot, className, ...props }, ref) => {
    const errorId = `${id}-error`
    return (
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <LabelPrimitive.Root
            htmlFor={id}
            className="text-[13px] font-medium text-[#EEF6FA]"
          >
            {label}
          </LabelPrimitive.Root>
          {rightLabelSlot}
        </div>
        <input
          id={id}
          ref={ref}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            'auth-transition h-[44px] w-full rounded-[12px] border bg-[#0A1017] px-3.5 text-sm text-[#EEF6FA] placeholder:text-[#5C7285] focus:outline-none',
            error
              ? 'border-[#F43F5E] focus:border-[#F43F5E] focus:ring-2 focus:ring-[#F43F5E]/25'
              : 'border-[#162230] focus:border-[#38BDF8] focus:ring-2 focus:ring-[#38BDF8]/25',
            className,
          )}
          {...props}
        />
        <div className="min-h-[18px]">
          {error ? (
            <p id={errorId} className="text-xs font-medium text-[#F43F5E]">
              {error}
            </p>
          ) : null}
        </div>
      </div>
    )
  },
)
AuthTextInput.displayName = 'AuthTextInput'

interface PasswordInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  id: string
  label: string
  error?: string
  rightLabelSlot?: ReactNode
  describedById?: string
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ id, label, error, rightLabelSlot, describedById, className, ...props }, ref) => {
    const [visible, setVisible] = useState(false)
    const errorId = `${id}-error`
    const ariaDescribedBy = [describedById, error ? errorId : undefined]
      .filter(Boolean)
      .join(' ') || undefined

    return (
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <LabelPrimitive.Root
            htmlFor={id}
            className="text-[13px] font-medium text-[#EEF6FA]"
          >
            {label}
          </LabelPrimitive.Root>
          {rightLabelSlot}
        </div>
        <div className="relative">
          <input
            id={id}
            ref={ref}
            type={visible ? 'text' : 'password'}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={ariaDescribedBy}
            className={cn(
              'auth-transition h-[44px] w-full rounded-[12px] border bg-[#0A1017] pl-3.5 pr-11 text-sm text-[#EEF6FA] placeholder:text-[#5C7285] focus:outline-none',
              error
                ? 'border-[#F43F5E] focus:border-[#F43F5E] focus:ring-2 focus:ring-[#F43F5E]/25'
                : 'border-[#162230] focus:border-[#38BDF8] focus:ring-2 focus:ring-[#38BDF8]/25',
              className,
            )}
            {...props}
          />
          <button
            type="button"
            onClick={() => setVisible((prev) => !prev)}
            aria-label={visible ? 'Hide password' : 'Show password'}
            className="auth-transition absolute right-0 top-0 flex h-[44px] w-[44px] cursor-pointer items-center justify-center rounded-r-[12px] text-[#8FA3B3] hover:text-[#EEF6FA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#38BDF8]"
          >
            {visible ? (
              <EyeOff className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Eye className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
        </div>
        <div className="min-h-[18px]">
          {error ? (
            <p id={errorId} className="text-xs font-medium text-[#F43F5E]">
              {error}
            </p>
          ) : null}
        </div>
      </div>
    )
  },
)
PasswordInput.displayName = 'PasswordInput'

export function PasswordRequirementChips({
  password,
  id = 'password-requirements',
}: {
  password: string
  id?: string
}) {
  const rules = evaluatePasswordRules(password)
  const items = [
    { key: 'chip-length', label: '8+ characters', met: rules.minLength },
    { key: 'chip-letter', label: '1 letter', met: rules.hasLetter },
    { key: 'chip-number', label: '1 number', met: rules.hasNumber },
  ]

  return (
    <div id={id} className="flex flex-wrap gap-1.5 pt-0.5" aria-live="polite">
      {items.map((item) => (
        <span
          key={item.key}
          data-testid={item.key}
          data-met={item.met ? 'true' : 'false'}
          className={cn(
            'auth-transition inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-semibold',
            item.met
              ? 'border-[#38BDF8] bg-[#67E8F9]/12 text-[#67E8F9]'
              : 'border-[#1B2938] bg-[#0F1823] text-[#8FA3B3]',
          )}
        >
          <Check
            className={cn('h-3 w-3', item.met ? 'opacity-100 text-[#67E8F9]' : 'opacity-40')}
            aria-hidden="true"
          />
          <span>{item.label}</span>
        </span>
      ))}
    </div>
  )
}

export function AuthStatusBanner({
  variant,
  message,
  children,
}: {
  variant: 'info' | 'error'
  message: string
  children?: ReactNode
}) {
  const isError = variant === 'error'
  return (
    <div
      role={isError ? 'alert' : 'status'}
      aria-live={isError ? 'assertive' : 'polite'}
      className={cn(
        'mb-4 flex items-start gap-2.5 rounded-[12px] border p-3.5 text-xs leading-relaxed',
        isError
          ? 'border-[#F43F5E]/40 bg-[#F43F5E]/10 text-[#FFF1F2]'
          : 'border-[#38BDF8]/40 bg-[#67E8F9]/10 text-[#EEF6FA]',
      )}
    >
      {isError ? (
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#F43F5E]" aria-hidden="true" />
      ) : (
        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#67E8F9]" aria-hidden="true" />
      )}
      <div className="flex-1 space-y-1.5">
        <p className="font-medium">{message}</p>
        {children}
      </div>
    </div>
  )
}
