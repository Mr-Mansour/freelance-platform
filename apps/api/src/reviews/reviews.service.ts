import { Injectable } from '@nestjs/common'
import { DatabaseService } from '../database/database.service'

@Injectable()
export class ReviewsService {
  constructor(private db: DatabaseService) {}

  async create(data: {
    contractId: string
    reviewerId: string
    revieweeId: string
    rating: number
    content: string
    communication?: number
    quality?: number
    professionalism?: number
    deadline?: number
    value?: number
  }) {
    return this.db.review.create({ data })
  }

  async findByUser(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit
    const [data, total] = await Promise.all([
      this.db.review.findMany({
        where: { revieweeId: userId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          reviewer: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } },
        },
      }),
      this.db.review.count({ where: { revieweeId: userId } }),
    ])
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) }
  }
}
