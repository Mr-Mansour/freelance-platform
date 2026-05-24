import { NextRequest, NextResponse } from 'next/server'
import { getFreelancer, updateFreelancer, getReviewsForUser } from '@/lib/store'

const MOCK_FREELANCER_DETAIL = {
  bio: 'Passionate full-stack developer with 8+ years of experience building scalable SaaS platforms. I specialize in React, Node.js, TypeScript, and cloud architecture.\n\nI have delivered 50+ projects for startups and enterprises alike, consistently exceeding client expectations. My approach combines clean architecture with pragmatic delivery.',
  skills: [
    { name: 'React', level: 98 }, { name: 'Node.js', level: 95 }, { name: 'TypeScript', level: 94 },
    { name: 'PostgreSQL', level: 90 }, { name: 'AWS', level: 85 }, { name: 'Docker', level: 82 },
    { name: 'GraphQL', level: 88 }, { name: 'Next.js', level: 92 }, { name: 'Tailwind CSS', level: 90 },
  ],
  portfolio: [
    { id: 'p1', title: 'SaaS Analytics Dashboard', category: 'Web App' },
    { id: 'p2', title: 'E-Commerce Platform', category: 'Web App' },
    { id: 'p3', title: 'Mobile Banking App', category: 'Mobile' },
    { id: 'p4', title: 'API Gateway Service', category: 'Backend' },
  ],
  responseTime: '< 2hrs',
  timezone: 'PST (UTC-8)',
  memberSince: 'Jan 2022',
  languages: ['English', 'Mandarin'],
  aiMatchScore: 96,
  trustScore: 94,
  trustMetrics: { identity: 98, skills: 95, reliability: 92, quality: 94, communication: 90 },
  verificationBadges: [
    { type: 'identity', label: 'Identity Verified' },
    { type: 'skills', label: 'Skills Certified' },
    { type: 'payment', label: 'Payment Verified' },
  ],
  education: [
    { degree: 'B.S. Computer Science', school: 'Stanford University', year: '2018' },
    { degree: 'M.S. Software Engineering', school: 'MIT', year: '2020' },
  ],
  certificates: [
    { name: 'AWS Solutions Architect', issuer: 'Amazon Web Services', year: '2023' },
    { name: 'Google Cloud Professional', issuer: 'Google Cloud', year: '2024' },
  ],
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const freelancer = getFreelancer(id)
  if (!freelancer) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const reviews = getReviewsForUser(id)

  return NextResponse.json({
    ...freelancer,
    ...MOCK_FREELANCER_DETAIL,
    reviews: reviews.map(r => ({
      id: r.id, client: r.reviewerName, rating: r.rating,
      content: r.content, date: new Date(r.createdAt).toLocaleDateString(),
      categories: r.categories,
    })),
    reviewCount: reviews.length,
  })
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json()
  const existing = getFreelancer(id)
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  updateFreelancer(id, body)
  return NextResponse.json(getFreelancer(id))
}
