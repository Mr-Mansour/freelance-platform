import { Injectable, NotFoundException } from '@nestjs/common'
import { DatabaseService } from '../database/database.service'

@Injectable()
export class UsersService {
  constructor(private db: DatabaseService) {}

  async findAll(page = 1, limit = 20) {
    const skip = (page - 1) * limit
    const [data, total] = await Promise.all([
      this.db.user.findMany({ skip, take: limit, orderBy: { createdAt: 'desc' } }),
      this.db.user.count(),
    ])
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) }
  }

  async findById(id: string) {
    const user = await this.db.user.findUnique({
      where: { id },
      include: { profile: true, freelancer: true, client: true },
    })
    if (!user) throw new NotFoundException('User not found')
    return user
  }

  async updateProfile(id: string, data: { firstName?: string; lastName?: string; avatarUrl?: string }) {
    return this.db.user.update({ where: { id }, data })
  }
}
