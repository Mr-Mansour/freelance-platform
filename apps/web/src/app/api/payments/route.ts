import { NextRequest, NextResponse } from 'next/server'
import { getPayments, addPayment, updatePayment, getContracts, updateContract } from '@/lib/store'

export async function GET() {
  return NextResponse.json(getPayments())
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const payment = {
      id: `pay${Date.now()}`,
      ...body,
      status: 'held',
      fee: Math.round(body.amount * 0.05),
      createdAt: new Date().toISOString(),
    }
    addPayment(payment)
    return NextResponse.json(payment, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, status } = await req.json()
    const existing = getPayments().find(p => p.id === id)
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    updatePayment(id, {
      status,
      ...(status === 'released' ? { releasedAt: new Date().toISOString() } : {}),
    })
    return NextResponse.json(getPayments().find(p => p.id === id))
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
