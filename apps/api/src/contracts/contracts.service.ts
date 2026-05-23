import { Injectable, NotFoundException } from '@nestjs/common'
import { DatabaseService } from '../database/database.service'

@Injectable()
export class ContractsService {
  constructor(private db: DatabaseService) {}

  async findAll(page = 1, limit = 20) {
    const skip = (page - 1) * limit
    const [data, total] = await Promise.all([
      this.db.contract.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          freelancer: { include: { user: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } } } },
          client: { include: { user: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } } } },
        },
      }),
      this.db.contract.count(),
    ])
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) }
  }

  async findById(id: string) {
    const contract = await this.db.contract.findUnique({
      where: { id },
      include: {
        freelancer: { include: { user: true } },
        client: { include: { user: true } },
        milestones: true,
      },
    })
    if (!contract) throw new NotFoundException('Contract not found')
    return contract
  }

  async createMilestone(contractId: string, data: { title: string; description?: string; amount: number; dueDate?: string }) {
    return this.db.milestone.create({
      data: {
        contractId,
        title: data.title,
        description: data.description,
        amount: data.amount,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
      },
    })
  }

  async completeMilestone(id: string) {
    return this.db.milestone.update({
      where: { id },
      data: { status: 'COMPLETED', completedAt: new Date() },
    })
  }

  async approveMilestone(id: string) {
    return this.db.milestone.update({
      where: { id },
      data: { status: 'APPROVED' },
    })
  }
}
