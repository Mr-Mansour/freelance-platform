import { NextRequest, NextResponse } from 'next/server'
import {
  getFreelancers, getJobs, getContracts, getReviews,
  getDisputes, getPayments, getPlatformEvents, addPlatformEvent,
} from '@/lib/store'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    addPlatformEvent({
      id: `evt${Date.now()}`,
      type: body.type || 'event',
      description: body.description || '',
      amount: body.amount,
      userId: body.userId,
      userName: body.userName,
      createdAt: new Date().toISOString(),
    })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}

export async function GET() {
  const freelancers = getFreelancers()
  const jobs = getJobs()
  const contracts = getContracts()
  const reviews = getReviews()
  const disputes = getDisputes()
  const payments = getPayments()
  const events = getPlatformEvents()

  const totalRevenue = payments
    .filter(p => p.status === 'released')
    .reduce((s, p) => s + p.amount, 0)
  const platformFees = payments
    .filter(p => p.status === 'released')
    .reduce((s, p) => s + p.fee, 0)
  const activeContracts = contracts.filter(c => c.status === 'ACTIVE').length
  const completedContracts = contracts.filter(c => c.status === 'COMPLETED').length

  const revenueByMonth: Record<string, number> = {}
  payments.filter(p => p.status === 'released').forEach(p => {
    const month = p.createdAt.slice(0, 7)
    revenueByMonth[month] = (revenueByMonth[month] || 0) + p.amount
  })

  const jobsByCategory: Record<string, number> = {}
  jobs.forEach(j => {
    const cat = j.category || 'Other'
    jobsByCategory[cat] = (jobsByCategory[cat] || 0) + 1
  })

  const signupsByMonth: Record<string, number> = {}
  events.filter(e => e.type === 'signup').forEach(e => {
    const month = e.createdAt.slice(0, 7)
    signupsByMonth[month] = (signupsByMonth[month] || 0) + 1
  })

  return NextResponse.json({
    overview: {
      totalFreelancers: freelancers.length,
      totalJobs: jobs.length,
      totalContracts: contracts.length,
      totalRevenue,
      platformFees,
      activeContracts,
      completedContracts,
      pendingReviews: reviews.filter(r => r.status === 'pending').length,
      openDisputes: disputes.filter(d => d.status === 'open' || d.status === 'investigating').length,
    },
    revenueByMonth,
    jobsByCategory,
    signupsByMonth,
    recentEvents: events.slice(-20).reverse(),
  })
}
