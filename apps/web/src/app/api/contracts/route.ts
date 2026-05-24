import { NextRequest, NextResponse } from 'next/server'
import { getContracts, addContract, addPlatformEvent } from '@/lib/store'
import type { Contract } from '@/lib/store'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const search = searchParams.get('search')?.toLowerCase()
  const status = searchParams.get('status')

  let result = getContracts()

  if (search) {
    result = result.filter(c =>
      c.title.toLowerCase().includes(search) ||
      c.clientName.toLowerCase().includes(search)
    )
  }

  if (status && status !== 'ALL') {
    result = result.filter(c => c.status === status)
  }

  return NextResponse.json({
    contracts: result,
    stats: {
      active: result.filter(c => c.status === 'ACTIVE').length,
      completed: result.filter(c => c.status === 'COMPLETED').length,
      totalVolume: result.reduce((s, c) => s + c.amount, 0),
      inEscrow: result.filter(c => c.escrowStatus === 'FUNDED').reduce((s, c) => s + c.amount, 0),
    },
  })
}

export async function POST(request: Request) {
  const body = await request.json()
  const contract: Contract = {
    id: `c_${Date.now()}`,
    title: body.title || 'New Contract',
    clientName: body.clientName || 'Client',
    amount: body.amount || 0,
    escrowStatus: 'PENDING',
    status: 'ACTIVE',
    progress: 0,
    totalMilestones: body.totalMilestones || 1,
    completedMilestones: 0,
    startDate: body.startDate || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    endDate: body.endDate || 'TBD',
    freelancerId: body.freelancerId,
    clientId: body.clientId,
  }
  addContract(contract)
  addPlatformEvent({
    id: `evt${Date.now()}`,
    type: 'contract',
    description: `Contract "${contract.title}" created for $${contract.amount}`,
    amount: contract.amount,
    createdAt: new Date().toISOString(),
  })
  return NextResponse.json(contract, { status: 201 })
}
