import { NextResponse } from 'next/server'
import { getJob } from '@/lib/store'

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const job = getJob(id)

  if (!job) {
    return NextResponse.json({ error: 'Job not found' }, { status: 404 })
  }

  return NextResponse.json({
    ...job,
    description: 'We are looking for a talented professional to join our team. This is a remote-friendly position with flexible hours. You will be working on cutting-edge projects with a supportive team.',
    proposals: [
      { id: 'pr1', freelancerName: 'Alex Chen', bidAmount: 7500, duration: '10 weeks', status: 'PENDING', submittedAt: '2 days ago', matchScore: 94 },
      { id: 'pr2', freelancerName: 'Emily Rodriguez', bidAmount: 8000, duration: '8 weeks', status: 'PENDING', submittedAt: '3 days ago', matchScore: 82 },
    ],
    client: {
      name: job.clientName,
      rating: job.clientRating,
      totalHires: job.clientHires,
      memberSince: '2022',
      responseTime: 'Within 2 hours',
    },
  })
}
