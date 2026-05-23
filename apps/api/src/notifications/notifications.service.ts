import { Injectable } from '@nestjs/common'
import { DatabaseService } from '../database/database.service'

@Injectable()
export class NotificationsService {
  constructor(private db: DatabaseService) {}

  async findByUser(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit
    const [data, total] = await Promise.all([
      this.db.notification.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.db.notification.count({ where: { userId } }),
    ])
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) }
  }

  async markAsRead(id: string) {
    return this.db.notification.update({ where: { id }, data: { read: true } })
  }

  async markAllAsRead(userId: string) {
    return this.db.notification.updateMany({ where: { userId }, data: { read: true } })
  }

  async create(data: { userId: string; type: string; title: string; message: string; data?: Record<string, unknown> }) {
    return this.db.notification.create({
      data: {
        userId: data.userId,
        type: data.type as any,
        title: data.title,
        message: data.message,
        data: data.data || undefined,
      },
    })
  }
}
