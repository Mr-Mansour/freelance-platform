export type Freelancer = {
  id: string
  userId: string
  title: string
  bio: string
  hourlyRate: number
  availability: 'FULL_TIME' | 'PART_TIME' | 'HOURLY'
  skills: string[]
  portfolios: PortfolioItem[]
  rating: number
  reviewCount: number
  jobSuccessRate: number
  completedJobs: number
  totalEarned: number
  verificationBadges: VerificationBadge[]
  isVerified: boolean
  trustScore: number
}

export type PortfolioItem = {
  id: string
  title: string
  description?: string
  images: string[]
  url?: string
  category: string
  createdAt: string
}

export type VerificationBadge = {
  id: string
  type: 'ID_VERIFIED' | 'SKILL_VERIFIED' | 'PORTFOLIO_VERIFIED' | 'ELITE'
  issuedAt: string
  expiresAt?: string
}
