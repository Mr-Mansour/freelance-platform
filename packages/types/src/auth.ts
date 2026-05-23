export type AuthSession = {
  userId: string
  sessionId: string
  role: string
  expiresAt: string
}

export type LoginRequest = {
  email: string
  password: string
}

export type SignupRequest = {
  email: string
  password: string
  firstName: string
  lastName: string
  username: string
  role: 'FREELANCER' | 'CLIENT'
}

export type AuthResponse = {
  user: import('./user').User
  session: AuthSession
}

export type TwoFactorRequest = {
  code: string
  sessionId: string
}

export type PasswordResetRequest = {
  email: string
}

export type PasswordResetConfirm = {
  token: string
  newPassword: string
}
