import { Injectable, NotFoundException } from '@nestjs/common'
import { DatabaseService } from '../database/database.service'

@Injectable()
export class FreelancersService {
  constructor(private db: DatabaseService) {}

  async findAll(page = 1, limit = 20, filters?: { skill?: string; category?: string; minRate?: number; maxRate?: number }) {
    const skip = (page - 1) * limit
    const where: Record<string, unknown> = { isVerified: true }

    if (filters?.skill) where.skills = { some: { name: filters.skill } }
    if (filters?.minRate) where.hourlyRate = { gte: filters.minRate }
    if (filters?.maxRate) where.hourlyRate = { ...(where.hourlyRate as object || {}), lte: filters.maxRate }

    const [data, total] = await Promise.all([
      this.db.freelancer.findMany({
        where,
        skip,
        take: limit,
        orderBy: { rating: 'desc' },
        include: {
          user: { select: { id: true, firstName: true, lastName: true, avatarUrl: true, username: true } },
          skills: true,
          verificationBadges: true,
        },
      }),
      this.db.freelancer.count({ where }),
    ])
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) }
  }

  async findById(id: string) {
    const freelancer = await this.db.freelancer.findUnique({
      where: { id },
      include: {
        user: true,
        skills: true,
        portfolios: true,
        verificationBadges: true,
      },
    })
    if (!freelancer) throw new NotFoundException('Freelancer not found')
    return freelancer
  }

  async create(userId: string, data: { title: string; bio: string; hourlyRate?: number; skills: { name: string; category: string; proficiency: string }[] }) {
    const existing = await this.db.freelancer.findUnique({ where: { userId } })
    if (existing) throw new Error('Freelancer profile already exists')

    return this.db.freelancer.create({
      data: {
        userId,
        title: data.title,
        bio: data.bio,
        hourlyRate: data.hourlyRate,
        skills: {
          create: data.skills,
        },
      },
    })
  }

  async search(query: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit
    const [data, total] = await Promise.all([
      this.db.freelancer.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { bio: { contains: query, mode: 'insensitive' } },
            { skills: { some: { name: { contains: query, mode: 'insensitive' } } } },
          ],
        },
        skip,
        take: limit,
        include: {
          user: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } },
          skills: true,
        },
      }),
      this.db.freelancer.count({
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { bio: { contains: query, mode: 'insensitive' } },
            { skills: { some: { name: { contains: query, mode: 'insensitive' } } } },
          ],
        },
      }),
    ])
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) }
  }
}
