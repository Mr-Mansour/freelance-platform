import { NextRequest, NextResponse } from 'next/server'

let PROPOSALS: any[] = [
  { id: 'p1', jobTitle: 'Build a Full-Stack SaaS Analytics Dashboard', clientName: 'Sarah Wilson', clientAvatar: null, bidAmount: 7500, duration: '10 weeks', status: 'VIEWED', submittedAt: '2 days ago', matchScore: 94, clientRating: 4.8 },
  { id: 'p2', jobTitle: 'E-Commerce Platform Migration', clientName: 'TechCorp Inc.', clientAvatar: null, bidAmount: 12000, duration: '3 months', status: 'PENDING', submittedAt: '5 days ago', matchScore: 88, clientRating: 4.5 },
  { id: 'p3', jobTitle: 'AI-Powered Chatbot Development', clientName: 'Marcus Johnson', clientAvatar: null, bidAmount: 5000, duration: '6 weeks', status: 'ACCEPTED', submittedAt: '1 week ago', matchScore: 96, clientRating: 5.0 },
  { id: 'p4', jobTitle: 'Mobile Banking App UI Design', clientName: 'Emily Rodriguez', clientAvatar: null, bidAmount: 3500, duration: '4 weeks', status: 'DECLINED', submittedAt: '2 weeks ago', matchScore: 72, clientRating: 4.2 },
  { id: 'p5', jobTitle: 'Cloud Infrastructure Setup & Migration', clientName: 'James Kim', clientAvatar: null, bidAmount: 8000, duration: '8 weeks', status: 'WITHDRAWN', submittedAt: '3 weeks ago', matchScore: 65, clientRating: 4.0 },
  { id: 'p6', jobTitle: 'Data Analytics Pipeline Architecture', clientName: 'Priya Patel', clientAvatar: null, bidAmount: 9500, duration: '12 weeks', status: 'PENDING', submittedAt: '4 weeks ago', matchScore: 91, clientRating: 4.9 },
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const search = searchParams.get('search')?.toLowerCase()
  const status = searchParams.get('status')

  let result = PROPOSALS

  if (search) {
    result = result.filter(p =>
      p.jobTitle.toLowerCase().includes(search) ||
      p.clientName.toLowerCase().includes(search)
    )
  }

  if (status && status !== 'ALL') {
    result = result.filter(p => p.status === status)
  }

  return NextResponse.json(result)
}

export async function POST(request: Request) {
  const body = await request.json()
  const proposal = { id: `p_${Date.now()}`, ...body, status: 'PENDING', submittedAt: 'Just now' }
  PROPOSALS.unshift(proposal)
  return NextResponse.json(proposal, { status: 201 })
}
