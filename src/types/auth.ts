export interface User {
  id: string
  fullName: string
  email: string
  provider: 'credentials' | 'google'
}

export interface RegisterPayload {
  fullName: string
  email: string
  password: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface AuthResponse {
  user: User
  accessToken: string
}

export interface ForgotPasswordResponse {
  message: string
  mockResetToken?: string
}

export interface ResetPasswordPayload {
  token: string
  newPassword: string
}

export interface AuthService {
  register(payload: RegisterPayload): Promise<{ user: User }>
  login(payload: LoginPayload): Promise<AuthResponse>
  logout(accessToken?: string | null): Promise<void>
  requestPasswordReset(email: string): Promise<ForgotPasswordResponse>
  validateResetToken(token: string): Promise<boolean>
  resetPassword(payload: ResetPasswordPayload): Promise<void>
  getGoogleOAuthRedirectUrl(): string
  resolveOAuthCallbackToken(token: string): Promise<AuthResponse>
  getCurrentUser(accessToken: string): Promise<User>
}
