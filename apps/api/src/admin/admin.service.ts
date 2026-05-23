import { Injectable } from '@nestjs/common'
import { DatabaseService } from '../database/database.service'

@Injectable()
export class AdminService {
  constructor(private db: DatabaseService) {}

  async getDashboard() {
    const [
      totalUsers,
      totalFreelancers,
      totalClients,
      totalJobs,
      totalContracts,
      totalRevenue,
      recentUsers,
      recentReports,
    ] = await Promise.all([
      this.db.user.count(),
      this.db.freelancer.count(),
      this.db.client.count(),
      this.db.job.count(),
      this.db.contract.count(),
      this.db.transaction.aggregate({ _sum: { amount: true }, where: { status: 'COMPLETED' } }),
      this.db.user.findMany({ take: 10, orderBy: { createdAt: 'desc' } }),
      this.db.report.findMany({ take: 10, orderBy: { createdAt: 'desc' }, include: { reporter: { select: { id: true, firstName: true, lastName: true } } } }),
    ])

    return {
      stats: {
        totalUsers,
        totalFreelancers,
        totalClients,
        totalJobs,
        totalContracts,
        totalRevenue: totalRevenue._sum.amount || 0,
      },
      recentUsers,
      recentReports,
    }
  }

  async getUsers(page = 1, limit = 20) {
    const skip = (page - 1) * limit
    const [data, total] = await Promise.all([
      this.db.user.findMany({ skip, take: limit, orderBy: { createdAt: 'desc' } }),
      this.db.user.count(),
    ])
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) }
  }

  async suspendUser(userId: string, reason: string, adminId: string) {
    await this.db.user.update({ where: { id: userId }, data: { isVerified: false } })
    return this.db.adminAction.create({
      data: {
        adminId,
        action: 'SUSPEND_USER',
        targetId: userId,
        targetType: 'USER',
        reason,
      },
    })
  }

  async verifyFreelancer(freelancerId: string, adminId: string) {
    const freelancer = await this.db.freelancer.update({
      where: { id: freelancerId },
      data: { isVerified: true },
    })

    await this.db.adminAction.create({
      data: {
        adminId,
        action: 'VERIFY_FREELANCER',
        targetId: freelancerId,
        targetType: 'FREELANCER',
      },
    })

    await this.db.user.update({
      where: { id: freelancer.userId },
      data: { isVerified: true },
    })

    return freelancer
  }

  async getReports(page = 1, limit = 20) {
    const skip = (page - 1) * limit
    const [data, total] = await Promise.all([
      this.db.report.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { reporter: { select: { id: true, firstName: true, lastName: true } } },
      }),
      this.db.report.count(),
    ])
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) }
  }

  async resolveReport(reportId: string, resolvedBy: string) {
    return this.db.report.update({
      where: { id: reportId },
      data: { status: 'RESOLVED', resolvedBy, resolvedAt: new Date() },
    })
  }
}
