import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { AppRoutes } from '../App'
import { resetMockAuthDatabase } from '../services/authService'
import { useAuthStore } from '../store/authStore'

function renderWithRoute(initialEntry = '/') {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <AppRoutes />
    </MemoryRouter>,
  )
}

describe('Wibu Never Die — User Authentication Suite (CAP-1..CAP-7)', () => {
  beforeEach(() => {
    resetMockAuthDatabase()
    useAuthStore.getState().clearSession()
  })

  it('CAP-3: redirects unauthenticated visitors from / to /login', async () => {
    renderWithRoute('/')
    expect(await screen.findByRole('heading', { name: /welcome/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in with google/i })).toBeInTheDocument()
  })

  it('CAP-4: navigates between /login, /register, and /forgot-password and toggles password visibility', async () => {
    const user = userEvent.setup()
    renderWithRoute('/login')

    const passwordInput = screen.getByLabelText(/^password$/i)
    expect(passwordInput).toHaveAttribute('type', 'password')

    const toggleBtn = screen.getByRole('button', { name: /show password/i })
    await user.click(toggleBtn)
    expect(passwordInput).toHaveAttribute('type', 'text')

    await user.click(screen.getByRole('link', { name: /create an account/i }))
    expect(await screen.findByRole('heading', { name: /create your/i })).toBeInTheDocument()

    await user.click(screen.getByRole('link', { name: /sign in/i }))
    expect(await screen.findByRole('heading', { name: /welcome/i })).toBeInTheDocument()

    await user.click(screen.getByRole('link', { name: /forgot password\?/i }))
    expect(await screen.findByRole('heading', { name: /reset your/i })).toBeInTheDocument()
  })

  it('CAP-1 & CAP-2 & CAP-3: validates registration with live password chips, redirects to /login with pre-filled email, signs in to /, persists session, and signs out', async () => {
    const user = userEvent.setup()
    renderWithRoute('/register')

    const chip8Chars = screen.getByTestId('chip-length')
    const chipLetter = screen.getByTestId('chip-letter')
    const chipNumber = screen.getByTestId('chip-number')
    expect(chip8Chars).toHaveAttribute('data-met', 'false')

    await user.type(screen.getByLabelText(/full name/i), 'Minh Nguyen')
    await user.type(screen.getByLabelText(/^email$/i), 'minh@wibu.dev')

    const passwordField = screen.getByLabelText(/^password$/i)
    await user.type(passwordField, 'Wibu2026!')

    expect(chip8Chars).toHaveAttribute('data-met', 'true')
    expect(chipLetter).toHaveAttribute('data-met', 'true')
    expect(chipNumber).toHaveAttribute('data-met', 'true')

    await user.type(screen.getByLabelText(/confirm password/i), 'WrongPass123')
    await user.click(screen.getByRole('button', { name: /create account/i }))
    expect(await screen.findByText(/passwords do not match/i)).toBeInTheDocument()

    const confirmField = screen.getByLabelText(/confirm password/i)
    await user.clear(confirmField)
    await user.type(confirmField, 'Wibu2026!')
    await user.click(screen.getByRole('button', { name: /create account/i }))

    expect(
      await screen.findByText(/account created — please sign in to continue\./i),
    ).toBeInTheDocument()

    const loginEmailInput = screen.getByLabelText(/^email$/i) as HTMLInputElement
    expect(loginEmailInput.value).toBe('minh@wibu.dev')

    await user.type(screen.getByLabelText(/^password$/i), 'WrongPassword9')
    await user.click(screen.getByRole('button', { name: /^sign in$/i }))
    expect(
      await screen.findByText(/invalid email or password\. please check your details and try again\./i),
    ).toBeInTheDocument()
    expect((screen.getByLabelText(/^email$/i) as HTMLInputElement).value).toBe('minh@wibu.dev')

    const loginPasswordInput = screen.getByLabelText(/^password$/i)
    await user.clear(loginPasswordInput)
    await user.type(loginPasswordInput, 'Wibu2026!')
    await user.click(screen.getByRole('button', { name: /^sign in$/i }))

    expect(await screen.findByText(/continue watching & reading/i)).toBeInTheDocument()
    expect(screen.getByText('Minh Nguyen')).toBeInTheDocument()
    expect(useAuthStore.getState().accessToken).toBeTruthy()

    await user.click(screen.getByRole('button', { name: /sign out/i }))
    expect(await screen.findByRole('heading', { name: /welcome/i })).toBeInTheDocument()
    expect(useAuthStore.getState().accessToken).toBeNull()
  })

  it('CAP-5 & CAP-7: requests password reset link and completes password reset via /reset-password?token=...', async () => {
    const user = userEvent.setup()
    renderWithRoute('/forgot-password')

    await user.type(screen.getByLabelText(/^email$/i), 'demo@wibu.dev')
    await user.click(screen.getByRole('button', { name: /send reset link/i }))

    expect(await screen.findByText(/check your inbox/i)).toBeInTheDocument()

    const mockResetLink = screen.getByRole('link', { name: /open reset password link/i })
    await user.click(mockResetLink)

    expect(await screen.findByRole('heading', { name: /choose a new/i })).toBeInTheDocument()

    await user.type(screen.getByLabelText(/^new password$/i), 'NewWibu2027!')
    await user.type(screen.getByLabelText(/confirm new password/i), 'NewWibu2027!')
    await user.click(screen.getByRole('button', { name: /update password/i }))

    expect(
      await screen.findByText(/password updated — sign in with your new password\./i),
    ).toBeInTheDocument()

    await user.type(screen.getByLabelText(/^email$/i), 'demo@wibu.dev')
    await user.type(screen.getByLabelText(/^password$/i), 'NewWibu2027!')
    await user.click(screen.getByRole('button', { name: /^sign in$/i }))

    expect(await screen.findByText(/continue watching & reading/i)).toBeInTheDocument()
  })

  it('CAP-7: blocks completion when /reset-password has missing or invalid token', async () => {
    renderWithRoute('/reset-password?token=invalid_or_expired_token')
    expect(
      await screen.findByText(/this reset link is invalid or has expired/i),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /request new reset link/i })).toBeInTheDocument()
  })

  it('CAP-6: completes Google OAuth sign-in callback and lands on Protected Home Hub', async () => {
    const user = userEvent.setup()
    renderWithRoute('/login')

    await user.click(screen.getByRole('button', { name: /sign in with google/i }))

    await waitFor(() => {
      expect(screen.getByText(/continue watching & reading/i)).toBeInTheDocument()
    })
    expect(useAuthStore.getState().isAuthenticated).toBe(true)
  })
})
