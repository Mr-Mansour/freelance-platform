import { Injectable } from '@nestjs/common'
import { DatabaseService } from '../database/database.service'
import { TrustLevel } from '@prisma/client'

interface TrustMetrics {
  reviewScore: number
  deliveryRate: number
  disputeRate: number
  clientRetention: number
  accountAge: number
  portfolioQuality: number
  verificationScore: number
}

@Injectable()
export class TrustService {
  constructor(private db: DatabaseService) {}

  // Weight multipliers for each metric
  private readonly WEIGHTS = {
    reviewScore: 0.2,
    deliveryRate: 0.2,
    disputeRate: 0.15,
    clientRetention: 0.1,
    accountAge: 0.1,
    portfolioQuality: 0.1,
    verificationScore: 0.15,
  }

  async calculateTrustScore(userId: string): Promise<{
    overallScore: number
    level: TrustLevel
    metrics: TrustMetrics
  }> {
    const user = await this.db.user.findUnique({
      where: { id: userId },
      include: {
        reviewsReceived: true,
        freelancer: {
          include: {
            portfolios: true,
            verificationBadges: true,
          },
        },
      },
    })

    if (!user) throw new Error('User not found')

    // 1. Review Score (0-100)
    const reviewScore = this.calculateReviewScore(user.reviewsReceived)

    // 2. Delivery Rate (0-100)
    const deliveryRate = await this.calculateDeliveryRate(userId)

    // 3. Dispute Rate (0-100, inverted so higher is better)
    const disputeRate = await this.calculateDisputeRate(userId)

    // 4. Client Retention (0-100)
    const clientRetention = await this.calculateClientRetention(userId)

    // 5. Account Age (0-100, older = better)
    const accountAge = this.calculateAccountAge(user.createdAt)

    // 6. Portfolio Quality (0-100)
    const portfolioQuality = this.calculatePortfolioQuality(
      user.freelancer?.portfolios || [],
      user.freelancer?.skills || [],
    )

    // 7. Verification Score (0-100)
    const verificationScore = this.calculateVerificationScore(
      user.freelancer?.verificationBadges || [],
    )

    const metrics: TrustMetrics = {
      reviewScore,
      deliveryRate,
      disputeRate,
      clientRetention,
      accountAge,
      portfolioQuality,
      verificationScore,
    }

    // Calculate weighted overall score
    const overallScore = Math.round(
      reviewScore * this.WEIGHTS.reviewScore +
      deliveryRate * this.WEIGHTS.deliveryRate +
      disputeRate * this.WEIGHTS.disputeRate +
      clientRetention * this.WEIGHTS.clientRetention +
      accountAge * this.WEIGHTS.accountAge +
      portfolioQuality * this.WEIGHTS.portfolioQuality +
      verificationScore * this.WEIGHTS.verificationScore
    )

    const level = this.determineTrustLevel(overallScore)

    // Update user's trust level and freelancer trust score
    await this.db.user.update({
      where: { id: userId },
      data: { trustLevel: level },
    })

    if (user.freelancer) {
      await this.db.freelancer.update({
        where: { id: user.freelancer.id },
        data: { trustScore: overallScore },
      })
    }

    return { overallScore, level, metrics }
  }

  private calculateReviewScore(reviews: { rating: number }[]): number {
    if (reviews.length === 0) return 0
    const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    return Math.round((avg / 5) * 100)
  }

  private async calculateDeliveryRate(userId: string): Promise<number> {
    const contracts = await this.db.contract.findMany({
      where: {
        OR: [{ freelancer: { userId } }, { client: { userId } }],
      },
    })

    if (contracts.length === 0) return 0

    const completed = contracts.filter(c => c.status === 'COMPLETED').length
    return Math.round((completed / contracts.length) * 100)
  }

  private async calculateDisputeRate(userId: string): Promise<number> {
    const contracts = await this.db.contract.findMany({
      where: {
        OR: [{ freelancer: { userId } }, { client: { userId } }],
        status: 'DISPUTED',
      },
    })

    const totalContracts = await this.db.contract.count({
      where: {
        OR: [{ freelancer: { userId } }, { client: { userId } }],
      },
    })

    if (totalContracts === 0) return 100
    // Invert: fewer disputes = higher score
    return Math.round((1 - contracts.length / totalContracts) * 100)
  }

  private async calculateClientRetention(userId: string): Promise<number> {
    const contracts = await this.db.contract.findMany({
      where: { client: { userId } },
      include: { client: true },
    })

    if (contracts.length < 2) return 50

    // Check for repeat clients
    const clientIds = [...new Set(contracts.map(c => c.clientId))]
    const repeatClients = clientIds.filter(
      id => contracts.filter(c => c.clientId === id).length > 1
    ).length

    return Math.round((repeatClients / clientIds.length) * 100)
  }

  private calculateAccountAge(createdAt: Date): number {
    const ageInDays = (Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24)
    // Max score at 2 years (730 days)
    return Math.min(100, Math.round((ageInDays / 730) * 100))
  }

  private calculatePortfolioQuality(
    portfolios: { images: string[]; description: string | null }[],
    skills: { name: string }[],
  ): number {
    let score = 0

    // Have portfolio items
    if (portfolios.length > 0) score += 30
    if (portfolios.length >= 3) score += 10
    if (portfolios.length >= 5) score += 10

    // Portfolio completeness
    const hasDescriptions = portfolios.every(p => p.description)
    if (hasDescriptions && portfolios.length > 0) score += 20

    // Have images in portfolios
    const hasImages = portfolios.some(p => p.images.length > 0)
    if (hasImages) score += 15

    // Have skills listed
    if (skills.length >= 5) score += 15
    else if (skills.length >= 3) score += 10
    else if (skills.length > 0) score += 5

    return Math.min(100, score)
  }

  private calculateVerificationScore(badges: { type: string }[]): number {
    const badgeValues: Record<string, number> = {
      ID_VERIFIED: 30,
      SKILL_VERIFIED: 30,
      PORTFOLIO_VERIFIED: 25,
      ELITE: 15,
    }

    const score = badges.reduce((sum, badge) => sum + (badgeValues[badge.type] || 0), 0)
    return Math.min(100, score)
  }

  private determineTrustLevel(score: number): TrustLevel {
    if (score >= 95) return 'LEGENDARY'
    if (score >= 85) return 'TITAN'
    if (score >= 70) return 'ELITE'
    if (score >= 50) return 'TRUSTED'
    if (score >= 30) return 'VERIFIED'
    return 'ROOKIE'
  }

  async getUserTrustData(userId: string) {
    const user = await this.db.user.findUnique({
      where: { id: userId },
      include: {
        trustHistory: {
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
      },
    })

    if (!user) throw new Error('User not found')

    const trustData = await this.calculateTrustScore(userId)

    return {
      userId: user.id,
      username: user.username,
      trustLevel: trustData.level,
      overallScore: trustData.overallScore,
      metrics: trustData.metrics,
      history: user.trustHistory,
    }
  }

  async addTrustEvent(userId: string, event: string, scoreDelta: number, reason: string) {
    await this.db.trustEvent.create({
      data: { userId, event, scoreDelta, reason },
    })

    // Recalculate trust score
    return this.calculateTrustScore(userId)
  }

  async getLeaderboard(page = 1, limit = 50) {
    const skip = (page - 1) * limit
    const [data, total] = await Promise.all([
      this.db.freelancer.findMany({
        orderBy: { trustScore: 'desc' },
        skip,
        take: limit,
        where: { isVerified: true },
        select: {
          id: true,
          trustScore: true,
          rating: true,
          jobSuccessRate: true,
          completedJobs: true,
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatarUrl: true,
              username: true,
              trustLevel: true,
            },
          },
        },
      }),
      this.db.freelancer.count({ where: { isVerified: true } }),
    ])

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) }
  }
}
