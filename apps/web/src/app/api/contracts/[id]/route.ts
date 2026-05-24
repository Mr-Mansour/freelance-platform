import { NextRequest, NextResponse } from 'next/server'
import { getContract, updateContract, getReviews, addReview, addPlatformEvent } from '@/lib/store'

const MILESTONE_TEMPLATES = [
  { id: '1', title: 'Project Setup & Architecture', description: 'Set up repository, CI/CD pipeline, database schema, and project architecture.', amount: 1500, status: 'APPROVED', dueDate: 'Jan 25, 2026', completedAt: 'Jan 22, 2026' },
  { id: '2', title: 'Authentication & User Management', description: 'Implement user auth, roles, permissions, and profile management.', amount: 2000, status: 'COMPLETED', dueDate: 'Feb 10, 2026', completedAt: 'Feb 8, 2026' },
  { id: '3', title: 'Dashboard & Data Visualization', description: 'Build main dashboard with charts, tables, and real-time data updates.', amount: 2500, status: 'IN_PROGRESS', dueDate: 'Mar 5, 2026', completedAt: null },
  { id: '4', title: 'API Integration & Final Polish', description: 'Integrate third-party APIs, optimize performance, and final testing.', amount: 1500, status: 'PENDING', dueDate: 'Mar 25, 2026', completedAt: null },
]

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const contract = getContract(id)
  if (!contract) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const reviews = getReviews().filter(r => r.contractId === id)

  return NextResponse.json({
    ...contract,
    description: 'Development of a comprehensive analytics dashboard with real-time data visualization, user auth, and API integrations.',
    escrowAmount: contract.amount,
    milestones: MILESTONE_TEMPLATES,
    freelancer: {
      name: contract.clientName,
      avatar: null,
      rating: 4.9,
      trustLevel: 'ELITE',
    },
    client: {
      name: 'TechCorp Inc.',
      avatar: null,
      rating: 4.8,
      trustLevel: 'TRUSTED',
    },
    reviews,
  })
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json()
  const existing = getContract(id)
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  updateContract(id, body)
  return NextResponse.json(getContract(id))
}
