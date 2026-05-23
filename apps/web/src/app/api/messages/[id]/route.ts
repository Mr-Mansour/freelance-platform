import { NextResponse } from 'next/server'
import { getMessages, addMessage } from '@/lib/store'
import type { Message } from '@/lib/store'

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return NextResponse.json(getMessages(id))
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await request.json()
  const msg: Message = {
    senderId: body.senderId || 'me',
    text: body.text || '',
    timestamp: body.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    status: 'sent',
  }
  addMessage(id, msg)
  return NextResponse.json(msg, { status: 201 })
}
