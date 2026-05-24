import { NextRequest, NextResponse } from 'next/server'
import { getMessages, addMessage, notifyAndEmail } from '@/lib/store'
import type { Message } from '@/lib/store'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { searchParams } = new URL(request.url)
  const since = searchParams.get('since')

  let messages = getMessages(id)

  // Polling: only return messages after the given timestamp
  if (since) {
    messages = messages.filter(m => m.timestamp > since || !messages.indexOf(m))
  }

  return NextResponse.json({
    messages,
    latestTimestamp: messages.length > 0 ? messages[messages.length - 1].timestamp : null,
  })
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await request.json()
  const msg: Message = {
    senderId: body.senderId || 'me',
    text: body.text || '',
    timestamp: body.timestamp || new Date().toISOString(),
    status: 'sent',
    ...(body.attachment ? { attachment: body.attachment } : {}),
  }
  addMessage(id, msg)

  // Notify the other party
  notifyAndEmail(
    'other-user', 'user@example.com', 'message',
    `New message: "${msg.text.slice(0, 60)}${msg.text.length > 60 ? '...' : ''}"`,
    'You have a new message', msg.text,
    id,
  )

  return NextResponse.json(msg, { status: 201 })
}
