import { Injectable, NotFoundException } from '@nestjs/common'
import { DatabaseService } from '../database/database.service'

@Injectable()
export class JobsService {
  constructor(private db: DatabaseService) {}

  async findAll(page = 1, limit = 20, filters?: { category?: string; status?: string; minBudget?: number; maxBudget?: number }) {
    const skip = (page - 1) * limit
    const where: Record<string, unknown> = {}

    if (filters?.category) where.category = filters.category
    if (filters?.status) where.status = filters.status
    if (filters?.minBudget) where.budgetMin = { gte: filters.minBudget }
    if (filters?.maxBudget) where.budgetMax = { lte: filters.maxBudget }

    const [data, total] = await Promise.all([
      this.db.job.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          client: {
            include: { user: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } } },
          },
        },
      }),
      this.db.job.count({ where }),
    ])
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) }
  }

  async findById(id: string) {
    const job = await this.db.job.findUnique({
      where: { id },
      include: {
        client: { include: { user: true } },
        proposals: {
          include: {
            freelancer: { include: { user: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } } } },
          },
        },
      },
    })
    if (!job) throw new NotFoundException('Job not found')
    return job
  }

  async create(data: {
    clientId: string
    title: string
    description: string
    category: string
    skills: string[]
    budgetMin: number
    budgetMax: number
    budgetType: 'FIXED' | 'HOURLY'
    experienceLevel: 'ENTRY' | 'INTERMEDIATE' | 'EXPERT'
    duration?: string
  }) {
    return this.db.job.create({ data })
  }

  async search(query: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit
    const [data, total] = await Promise.all([
      this.db.job.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
            { skills: { has: query } },
          ],
          status: 'OPEN',
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          client: { include: { user: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } } } },
        },
      }),
      this.db.job.count({
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
          ],
          status: 'OPEN',
        },
      }),
    ])
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) }
  }
}
