import { NextResponse } from 'next/server'
import { getContract } from '@/lib/store'

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const c = getContract(id)

  if (!c) {
    return NextResponse.json({ error: 'Contract not found' }, { status: 404 })
  }

  const contract = {
    id: c.id,
    title: c.title,
    description: 'Development of a comprehensive analytics dashboard with real-time data visualization, user auth, and API integrations.',
    amount: c.amount,
    status: c.status,
    escrowAmount: c.amount,
    escrowStatus: c.escrowStatus,
    startDate: c.startDate,
    endDate: c.endDate,
    freelancer: { name: 'Alex Chen', avatar: null, rating: 4.9, trustLevel: 'ELITE' },
    client: { name: c.clientName, avatar: null, rating: 4.8, trustLevel: 'TRUSTED' },
    milestones: [
      { id: 'ms1', title: 'Project Setup & Architecture', description: 'Set up repository, CI/CD pipeline, database schema.', amount: Math.round(c.amount * 0.2), status: 'APPROVED', dueDate: 'Jan 25, 2026', completedAt: 'Jan 22, 2026' },
      { id: 'ms2', title: 'Authentication & User Management', description: 'Implement user auth, roles, and permissions.', amount: Math.round(c.amount * 0.27), status: 'COMPLETED', dueDate: 'Feb 10, 2026', completedAt: 'Feb 8, 2026' },
      { id: 'ms3', title: 'Dashboard & Data Visualization', description: 'Build main dashboard with real-time data updates.', amount: Math.round(c.amount * 0.33), status: 'IN_PROGRESS', dueDate: 'Mar 5, 2026', completedAt: null },
      { id: 'ms4', title: 'API Integration & Final Polish', description: 'Integrate third-party APIs and final testing.', amount: Math.round(c.amount * 0.2), status: 'PENDING', dueDate: 'Mar 25, 2026', completedAt: null },
    ],
  }

  return NextResponse.json(contract)
}
