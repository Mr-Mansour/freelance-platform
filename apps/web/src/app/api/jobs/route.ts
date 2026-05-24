import { NextRequest, NextResponse } from 'next/server'
import { getJobs, addJob } from '@/lib/store'
import type { Job } from '@/lib/store'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const search = searchParams.get('search')?.toLowerCase()
  const category = searchParams.get('category')
  const level = searchParams.get('level')
  const status = searchParams.get('status')
  const budgetMin = searchParams.get('budgetMin')
  const budgetMax = searchParams.get('budgetMax')

  let result = getJobs()

  if (search) {
    result = result.filter(j =>
      j.title.toLowerCase().includes(search) ||
      j.description.toLowerCase().includes(search) ||
      j.skills.some(s => s.toLowerCase().includes(search))
    )
  }

  if (category && category !== 'All') {
    result = result.filter(j =>
      j.skills.some(s => s.toLowerCase().includes(category.toLowerCase())) ||
      j.category?.toLowerCase() === category.toLowerCase()
    )
  }

  if (level && level !== 'All Levels') {
    result = result.filter(j => j.experienceLevel === level)
  }

  if (status && status !== 'All') {
    result = result.filter(j => j.status === status)
  }

  if (budgetMin) {
    const min = parseInt(budgetMin)
    result = result.filter(j => (j.budgetMin || 0) >= min)
  }

  if (budgetMax) {
    const max = parseInt(budgetMax)
    result = result.filter(j => (j.budgetMax || Infinity) <= max)
  }

  return NextResponse.json(result)
}

export async function POST(request: Request) {
  const body = await request.json()
  const job: Job = {
    id: `j_${Date.now()}`,
    title: body.title,
    clientName: body.clientName || 'Anonymous',
    clientAvatar: null,
    budget: `$${body.budgetMin} - $${body.budgetMax}`,
    budgetType: body.budgetType?.toLowerCase() || 'fixed',
    duration: body.duration || 'TBD',
    description: body.description,
    skills: body.skills ? body.skills.split(',').map((s: string) => s.trim()) : [],
    proposals: 0,
    maxProposals: 20,
    experienceLevel: body.experienceLevel || 'INTERMEDIATE',
    postedAt: 'Just now',
    clientRating: 0,
    clientHires: 0,
    category: body.category || 'Web Development',
    status: 'open',
    budgetMin: body.budgetMin ? Number(body.budgetMin) : undefined,
    budgetMax: body.budgetMax ? Number(body.budgetMax) : undefined,
  }
  addJob(job)
  return NextResponse.json(job, { status: 201 })
}
