import { TrustLevel } from './user'

export type TrustScore = {
  userId: string
  overallScore: number
  level: TrustLevel
  metrics: TrustMetrics
  history: TrustEvent[]
}

export type TrustMetrics = {
  reviewScore: number
  deliveryRate: number
  disputeRate: number
  clientRetention: number
  accountAge: number
  portfolioQuality: number
  verificationScore: number
}

export type TrustEvent = {
  id: string
  userId: string
  event: string
  scoreDelta: number
  reason: string
  createdAt: string
}
