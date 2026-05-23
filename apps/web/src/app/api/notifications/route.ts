import { NextRequest, NextResponse } from 'next/server'

const NOTIFICATIONS = [
  { id: 'n1', type: 'milestone', text: 'Milestone approved — $2,500 released from escrow for SaaS Dashboard', time: '2 hours ago', read: false, actionable: true },
  { id: 'n2', type: 'message', text: 'New message from Sarah Wilson about the analytics project', time: '4 hours ago', read: false, actionable: true },
  { id: 'n3', type: 'review', text: 'You received a 5-star review from TechCorp Inc.!', time: '1 day ago', read: false, actionable: true },
  { id: 'n4', type: 'payment', text: 'Payment of $1,800 has been deposited to your account', time: '2 days ago', read: true, actionable: false },
  { id: 'n5', type: 'proposal', text: 'Your proposal for "AI Chatbot" has been viewed by the client', time: '3 days ago', read: true, actionable: true },
  { id: 'n6', type: 'trust', text: 'Trust score increased from 92 to 94 — keep up the great work!', time: '5 days ago', read: true, actionable: false },
  { id: 'n7', type: 'alert', text: 'Reminder: Milestone deadline approaching in 2 days', time: '6 days ago', read: true, actionable: true },
  { id: 'n8', type: 'message', text: 'Marcus Johnson accepted your collaboration request', time: '1 week ago', read: true, actionable: true },
  { id: 'n9', type: 'milestone', text: 'New milestone ready for review: API Integration', time: '1 week ago', read: true, actionable: true },
  { id: 'n10', type: 'proposal', text: 'New job match: Senior React Developer — 94% match', time: '1 week ago', read: true, actionable: true },
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const filter = searchParams.get('filter')

  let result = NOTIFICATIONS
  if (filter === 'unread') {
    result = result.filter(n => !n.read)
  }

  return NextResponse.json({
    notifications: result,
    unreadCount: NOTIFICATIONS.filter(n => !n.read).length,
  })
}
