import { NextRequest, NextResponse } from 'next/server'
import { getDisputes, addDispute } from '@/lib/store'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status')
  let disputes = getDisputes()
  if (status) disputes = disputes.filter(d => d.status === status)
  return NextResponse.json(disputes)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const now = new Date().toISOString()
    const dispute = {
      id: `dis${Date.now()}`,
      ...body,
      messages: body.messages || [],
      status: 'open',
      createdAt: now,
      updatedAt: now,
    }
    addDispute(dispute)
    return NextResponse.json(dispute, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
