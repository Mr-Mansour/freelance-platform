import { NextResponse } from 'next/server'

const USER = {
  id: 'u1', name: 'Alex Chen', email: 'alex@cybrion.io', avatar: null,
  role: 'FREELANCER', title: 'Senior Full-Stack Developer',
  bio: 'Passionate full-stack developer with 8+ years of experience building scalable SaaS platforms.',
  location: 'San Francisco, CA', hourlyRate: 85, website: 'https://alexchen.dev',
  skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'AWS', 'Docker', 'GraphQL', 'Next.js'],
  rating: 4.9, reviewCount: 47, completedJobs: 86,
  trustLevel: 'ELITE', trustScore: 94,
  verifiedBadges: ['ID_VERIFIED', 'SKILL_VERIFIED', 'PORTFOLIO_VERIFIED'],
  createdAt: '2023-06-15T00:00:00Z',
}

export async function GET() {
  return NextResponse.json(USER)
}

export async function PUT(request: Request) {
  const body = await request.json()
  return NextResponse.json({ ...USER, ...body, updatedAt: new Date().toISOString() })
}
