import { NextRequest, NextResponse } from 'next/server'
import { getNotifications, markNotificationRead, markAllNotificationsRead } from '@/lib/store'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const filter = searchParams.get('filter')
  const userId = searchParams.get('userId') || 'current-user'

  let result = getNotifications(userId)
  if (filter === 'unread') {
    result = result.filter(n => !n.read)
  }

  result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  return NextResponse.json({
    notifications: result,
    unreadCount: getNotifications(userId).filter(n => !n.read).length,
  })
}

export async function PATCH(request: NextRequest) {
  const body = await request.json()
  const { id, userId } = body

  if (id === 'all') {
    markAllNotificationsRead(userId || 'current-user')
  } else if (id) {
    markNotificationRead(id)
  }

  return NextResponse.json({ success: true })
}
