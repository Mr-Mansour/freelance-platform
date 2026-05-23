export enum UserRole {
  GUEST = 'GUEST',
  FREELANCER = 'FREELANCER',
  CLIENT = 'CLIENT',
  MODERATOR = 'MODERATOR',
  ADMIN = 'ADMIN',
  OWNER = 'OWNER',
}

export enum TrustLevel {
  ROOKIE = 'ROOKIE',
  VERIFIED = 'VERIFIED',
  TRUSTED = 'TRUSTED',
  ELITE = 'ELITE',
  TITAN = 'TITAN',
  LEGENDARY = 'LEGENDARY',
}

export type User = {
  id: string
  email: string
  username: string
  firstName: string
  lastName: string
  avatarUrl?: string
  role: UserRole
  trustLevel: TrustLevel
  isVerified: boolean
  isTwoFactorEnabled: boolean
  isOnboarded: boolean
  createdAt: string
  updatedAt: string
}

export type UserProfile = {
  id: string
  userId: string
  bio?: string
  title?: string
  location?: string
  website?: string
  hourlyRate?: number
  availability: 'AVAILABLE' | 'BUSY' | 'UNAVAILABLE'
  languages: string[]
  skills: string[]
  experience: ExperienceEntry[]
  education: EducationEntry[]
  certificates: Certificate[]
}

export type ExperienceEntry = {
  id: string
  company: string
  role: string
  description?: string
  startDate: string
  endDate?: string
  isCurrent: boolean
}

export type EducationEntry = {
  id: string
  institution: string
  degree: string
  field: string
  startDate: string
  endDate?: string
}

export type Certificate = {
  id: string
  name: string
  issuer: string
  url?: string
  issuedDate: string
}
