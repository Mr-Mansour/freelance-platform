import { Injectable } from '@nestjs/common'
import { DatabaseService } from '../database/database.service'

@Injectable()
export class ClientsService {
  constructor(private db: DatabaseService) {}

  async create(userId: string, data: { companyName?: string; companySize?: string; industry?: string }) {
    const existing = await this.db.client.findUnique({ where: { userId } })
    if (existing) throw new Error('Client profile already exists')

    return this.db.client.create({ data: { userId, ...data } })
  }

  async findById(id: string) {
    return this.db.client.findUnique({
      where: { id },
      include: { user: true, jobs: true },
    })
  }
}
