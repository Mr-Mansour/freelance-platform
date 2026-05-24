import { NextRequest, NextResponse } from 'next/server'
import { getDispute, updateDispute } from '@/lib/store'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const dispute = getDispute(id)
  if (!dispute) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(dispute)
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json()
  const existing = getDispute(id)
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  updateDispute(id, { ...body, updatedAt: new Date().toISOString() })
  return NextResponse.json(getDispute(id))
}
