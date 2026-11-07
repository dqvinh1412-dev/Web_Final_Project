import type {
  AuthResponse,
  AuthService,
  ForgotPasswordResponse,
  LoginPayload,
  RegisterPayload,
  ResetPasswordPayload,
  User,
} from '../types/auth'

const MOCK_USERS_STORAGE_KEY = 'wnd_mock_users_v1'
const MOCK_RESET_TOKENS_KEY = 'wnd_mock_reset_tokens_v1'

interface StoredMockUser extends User {
  passwordHash: string
}

interface StoredResetToken {
  email: string
  token: string
  expiresAt: number
}

export class AuthApiError extends Error {
  status: number

  constructor(message: string, status = 400) {
    super(message)
    this.name = 'AuthApiError'
    this.status = status
  }
}

function encodeMockSecret(raw: string): string {
  // Simple deterministic encoding so raw passwords are not stored verbatim in mock storage
  return `sim_${btoa(encodeURIComponent(raw))}`
}

function getDefaultMockUsers(): StoredMockUser[] {
  return [
    {
      id: 'usr_demo_01',
      fullName: 'Kaito Haruki',
      email: 'demo@wibu.dev',
      provider: 'credentials',
      passwordHash: encodeMockSecret('Wibu2026!'),
    },
  ]
}

function readMockUsers(): StoredMockUser[] {
  try {
    const raw = localStorage.getItem(MOCK_USERS_STORAGE_KEY)
    if (!raw) {
      const defaults = getDefaultMockUsers()
      localStorage.setItem(MOCK_USERS_STORAGE_KEY, JSON.stringify(defaults))
      return defaults
    }
    return JSON.parse(raw) as StoredMockUser[]
  } catch {
    return getDefaultMockUsers()
  }
}

function writeMockUsers(users: StoredMockUser[]): void {
  localStorage.setItem(MOCK_USERS_STORAGE_KEY, JSON.stringify(users))
}

function readResetTokens(): StoredResetToken[] {
  try {
    const raw = localStorage.getItem(MOCK_RESET_TOKENS_KEY)
    if (!raw) return []
    return JSON.parse(raw) as StoredResetToken[]
  } catch {
    return []
  }
}

function writeResetTokens(tokens: StoredResetToken[]): void {
  localStorage.setItem(MOCK_RESET_TOKENS_KEY, JSON.stringify(tokens))
}

function createMockJwt(user: User): string {
  const payload = btoa(
    encodeURIComponent(
      JSON.stringify({
        sub: user.id,
        email: user.email,
        fullName: user.fullName,
        provider: user.provider,
        iat: Date.now(),
      }),
    ),
  )
  return `mock_jwt.${payload}.sig`
}

function decodeMockJwt(token: string): User | null {
  if (!token.startsWith('mock_jwt.')) return null
  try {
    const [, encodedPayload] = token.split('.')
    if (!encodedPayload) return null
    const parsed = JSON.parse(decodeURIComponent(atob(encodedPayload))) as {
      sub: string
      email: string
      fullName: string
      provider?: 'credentials' | 'google'
    }
    if (!parsed.sub || !parsed.email) return null
    return {
      id: parsed.sub,
      email: parsed.email,
      fullName: parsed.fullName || 'Anime Explorer',
      provider: parsed.provider ?? 'credentials',
    }
  } catch {
    return null
  }
}

export function resetMockAuthDatabase(): void {
  localStorage.removeItem(MOCK_USERS_STORAGE_KEY)
  localStorage.removeItem(MOCK_RESET_TOKENS_KEY)
}

const mockAuthService: AuthService = {
  async register({ fullName, email, password }: RegisterPayload) {
    const normalizedEmail = email.trim().toLowerCase()
    const users = readMockUsers()
    if (users.some((u) => u.email.toLowerCase() === normalizedEmail)) {
      throw new AuthApiError('An account with this email already exists.', 409)
    }

    const newUser: StoredMockUser = {
      id: `usr_${Date.now()}`,
      fullName: fullName.trim(),
      email: normalizedEmail,
      provider: 'credentials',
      passwordHash: encodeMockSecret(password),
    }
    writeMockUsers([...users, newUser])

    return {
      user: {
        id: newUser.id,
        fullName: newUser.fullName,
        email: newUser.email,
        provider: newUser.provider,
      },
    }
  },

  async login({ email, password }: LoginPayload) {
    const normalizedEmail = email.trim().toLowerCase()
    const users = readMockUsers()
    const matched = users.find(
      (u) =>
        u.email.toLowerCase() === normalizedEmail &&
        u.passwordHash === encodeMockSecret(password),
    )

    if (!matched) {
      throw new AuthApiError(
        'Invalid email or password. Please check your details and try again.',
        401,
      )
    }

    const publicUser: User = {
      id: matched.id,
      fullName: matched.fullName,
      email: matched.email,
      provider: matched.provider,
    }

    return {
      user: publicUser,
      accessToken: createMockJwt(publicUser),
    }
  },

  async logout() {
    return Promise.resolve()
  },

  async requestPasswordReset(email: string) {
    const normalizedEmail = email.trim().toLowerCase()
    const token = `rst_${Math.random().toString(36).slice(2, 10)}`
    const existing = readResetTokens().filter((t) => t.email !== normalizedEmail)
    writeResetTokens([
      ...existing,
      {
        email: normalizedEmail,
        token,
        expiresAt: Date.now() + 1000 * 60 * 30,
      },
    ])

    return {
      message: `Check your inbox — if an account exists for ${normalizedEmail}, we've sent a password reset link.`,
      mockResetToken: token,
    }
  },

  async validateResetToken(token: string) {
    const trimmed = token.trim()
    if (!trimmed) return false
    const record = readResetTokens().find((t) => t.token === trimmed)
    if (!record) return false
    return record.expiresAt > Date.now()
  },

  async resetPassword({ token, newPassword }: ResetPasswordPayload) {
    const trimmed = token.trim()
    const tokens = readResetTokens()
    const record = tokens.find((t) => t.token === trimmed)

    if (!record || record.expiresAt <= Date.now()) {
      throw new AuthApiError(
        'This reset link is invalid or has expired. Request a new link to continue.',
        400,
      )
    }

    const users = readMockUsers()
    const targetIndex = users.findIndex((u) => u.email.toLowerCase() === record.email)

    if (targetIndex >= 0) {
      users[targetIndex] = {
        ...users[targetIndex],
        passwordHash: encodeMockSecret(newPassword),
      }
      writeMockUsers(users)
    }

    writeResetTokens(tokens.filter((t) => t.token !== trimmed))
  },

  getGoogleOAuthRedirectUrl() {
    const googleUser: User = {
      id: 'usr_google_01',
      fullName: 'Khoa Tran',
      email: 'khoa.google@wibu.dev',
      provider: 'google',
    }
    const token = createMockJwt(googleUser)
    return `/auth/callback?token=${encodeURIComponent(token)}`
  },

  async resolveOAuthCallbackToken(token: string) {
    const decoded = decodeMockJwt(token)
    if (!decoded) {
      throw new AuthApiError('Google sign-in could not be completed. Please try again.', 401)
    }
    return {
      user: decoded,
      accessToken: token,
    }
  },

  async getCurrentUser(accessToken: string) {
    const decoded = decodeMockJwt(accessToken)
    if (!decoded) {
      throw new AuthApiError('Your session expired. Please sign in again.', 401)
    }
    return decoded
  },
}

function getApiBaseUrl(): string {
  const base = import.meta.env.VITE_API_BASE_URL as string | undefined
  return (base || 'http://localhost:8080/api').replace(/\/+$/, '')
}

async function requestJson<T>(
  path: string,
  options: RequestInit = {},
  accessToken?: string | null,
): Promise<T> {
  const headers = new Headers(options.headers)
  if (!headers.has('Content-Type') && options.body) {
    headers.set('Content-Type', 'application/json')
  }
  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`)
  }

  let response: Response
  try {
    response = await fetch(`${getApiBaseUrl()}${path}`, {
      ...options,
      headers,
    })
  } catch {
    throw new AuthApiError(
      'Unable to reach the authentication server. Please check your connection and try again.',
      0,
    )
  }

  let body: Record<string, unknown>
  try {
    body = (await response.json()) as Record<string, unknown>
  } catch {
    body = {}
  }

  if (!response.ok) {
    const message =
      (typeof body.message === 'string' && body.message) ||
      (response.status === 401
        ? 'Invalid email or password. Please check your details and try again.'
        : 'Request could not be completed. Please try again.')
    throw new AuthApiError(message, response.status)
  }

  return body as T
}

const restAuthService: AuthService = {
  async register(payload: RegisterPayload) {
    return requestJson<{ user: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },

  async login(payload: LoginPayload) {
    return requestJson<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },

  async logout(accessToken?: string | null) {
    if (!accessToken) return
    try {
      await requestJson<unknown>('/auth/logout', { method: 'POST' }, accessToken)
    } catch {
      // Client still clears local JWT state even if remote logout endpoint is unreachable
    }
  },

  async requestPasswordReset(email: string): Promise<ForgotPasswordResponse> {
    const normalizedEmail = email.trim().toLowerCase()
    const res = await requestJson<{ message?: string }>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email: normalizedEmail }),
    })
    return {
      message:
        res.message ||
        `Check your inbox — if an account exists for ${normalizedEmail}, we've sent a password reset link.`,
    }
  },

  async validateResetToken(token: string) {
    return Boolean(token && token.trim().length > 0)
  },

  async resetPassword(payload: ResetPasswordPayload) {
    await requestJson<unknown>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },

  getGoogleOAuthRedirectUrl() {
    return `${getApiBaseUrl()}/auth/google`
  },

  async resolveOAuthCallbackToken(token: string) {
    if (!token.trim()) {
      throw new AuthApiError('Google sign-in could not be completed. Please try again.', 401)
    }
    const user = await this.getCurrentUser(token)
    return {
      user,
      accessToken: token,
    }
  },

  async getCurrentUser(accessToken: string) {
    const data = await requestJson<{ user?: User } & Partial<User>>(
      '/auth/me',
      { method: 'GET' },
      accessToken,
    )
    if (data.user) return data.user
    if (data.id && data.email) {
      return {
        id: data.id,
        email: data.email,
        fullName: data.fullName || data.email,
        provider: data.provider || 'credentials',
      }
    }
    throw new AuthApiError('Your session expired. Please sign in again.', 401)
  },
}

export function isMockAuthMode(): boolean {
  return import.meta.env.VITE_USE_MOCK_AUTH !== 'false'
}

export const authService: AuthService = isMockAuthMode() ? mockAuthService : restAuthService
