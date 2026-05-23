import { NextRequest, NextResponse } from 'next/server'
import { getJobs, addJob } from '@/lib/store'
import type { Job } from '@/lib/store'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const search = searchParams.get('search')?.toLowerCase()
  const category = searchParams.get('category')
  const level = searchParams.get('level')

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
      j.skills.some(s => s.toLowerCase().includes(category.toLowerCase()))
    )
  }

  if (level && level !== 'All Levels') {
    result = result.filter(j => j.experienceLevel === level)
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
  }
  addJob(job)
  return NextResponse.json(job, { status: 201 })
}
