import { Injectable, NotFoundException } from '@nestjs/common'
import { DatabaseService } from '../database/database.service'

@Injectable()
export class ProposalsService {
  constructor(private db: DatabaseService) {}

  async create(data: {
    jobId: string
    freelancerId: string
    coverLetter: string
    bidAmount: number
    estimatedDuration?: string
  }) {
    const proposal = await this.db.proposal.create({ data })
    await this.db.job.update({
      where: { id: data.jobId },
      data: { proposalsCount: { increment: 1 } },
    })
    return proposal
  }

  async findByJob(jobId: string) {
    return this.db.proposal.findMany({
      where: { jobId },
      include: {
        freelancer: {
          include: { user: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  async acceptProposal(id: string) {
    const proposal = await this.db.proposal.findUnique({ where: { id } })
    if (!proposal) throw new NotFoundException('Proposal not found')

    await this.db.proposal.update({ where: { id }, data: { status: 'ACCEPTED' } })
    await this.db.job.update({ where: { id: proposal.jobId }, data: { status: 'IN_PROGRESS' } })

    return this.db.contract.create({
      data: {
        jobId: proposal.jobId,
        freelancerId: proposal.freelancerId,
        clientId: (await this.db.job.findUnique({ where: { id: proposal.jobId } }))!.clientId,
        title: (await this.db.job.findUnique({ where: { id: proposal.jobId } }))!.title,
        amount: proposal.bidAmount,
      },
    })
  }
}
