import { NextRequest, NextResponse } from 'next/server'
import { getReviews, addReview, updateReview, addPlatformEvent } from '@/lib/store'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('userId')
  const status = searchParams.get('status')
  let reviews = getReviews()
  if (userId) reviews = reviews.filter(r => r.revieweeId === userId || r.reviewerId === userId)
  if (status) reviews = reviews.filter(r => r.status === status)
  return NextResponse.json(reviews)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const review = {
      id: `rev${Date.now()}`,
      ...body,
      status: body.status || 'pending',
      createdAt: new Date().toISOString(),
    }
    addReview(review)
    addPlatformEvent({
      id: `evt${Date.now()}`,
      type: 'review',
      description: `New review by ${review.reviewerName} for ${review.revieweeName} (${review.rating}/5)`,
      createdAt: new Date().toISOString(),
    })
    return NextResponse.json(review, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, status } = await req.json()
    const existing = getReviews().find(r => r.id === id)
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    updateReview(id, { status, respondedAt: new Date().toISOString() })
    return NextResponse.json(getReviews().find(r => r.id === id))
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
