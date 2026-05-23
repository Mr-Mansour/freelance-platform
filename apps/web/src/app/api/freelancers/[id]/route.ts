import { NextResponse } from 'next/server'
import { getFreelancer } from '@/lib/store'

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const freelancer = getFreelancer(id)

  if (!freelancer) {
    return NextResponse.json({ error: 'Freelancer not found' }, { status: 404 })
  }

  return NextResponse.json({
    ...freelancer,
    bio: 'Experienced professional with a passion for delivering high-quality work. Specializing in modern web technologies and cloud architecture.',
    portfolio: [
      { title: 'SaaS Analytics Platform', description: 'Built a real-time analytics dashboard serving 10K+ users', image: null },
      { title: 'E-Commerce Solution', description: 'Migrated monolithic app to microservices architecture', image: null },
    ],
    reviews: [
      { author: 'Sarah W.', rating: 5, text: 'Excellent work! Delivered ahead of schedule.', date: '2 weeks ago' },
      { author: 'TechCorp', rating: 5, text: 'Outstanding technical skills. Would hire again.', date: '1 month ago' },
    ],
    aiMatch: {
      score: 94,
      summary: 'Perfect match for full-stack, SaaS, and analytics projects',
      strengths: ['React', 'Node.js', 'System Design'],
    },
  })
}
