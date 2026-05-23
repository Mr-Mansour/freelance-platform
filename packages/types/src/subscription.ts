export type Subscription = {
  id: string
  userId: string
  plan: 'FREE' | 'PRO' | 'PREMIUM' | 'ENTERPRISE'
  status: 'ACTIVE' | 'CANCELLED' | 'EXPIRED' | 'PAST_DUE'
  currentPeriodStart: string
  currentPeriodEnd: string
  stripeSubscriptionId?: string
  features: SubscriptionFeatures
  createdAt: string
}

export type SubscriptionFeatures = {
  advancedAnalytics: boolean
  prioritySupport: boolean
  customBranding: boolean
  teamMembers: number
  aiProposals: boolean
  featuredListings: boolean
  verificationBadge: boolean
  apiAccess: boolean
}
