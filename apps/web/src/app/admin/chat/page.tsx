'use client'

import TeamChat from '@/components/admin/TeamChat'
import { useAuth } from '@/lib/auth-context'

export default function ChatPage() {
  const { user } = useAuth()
  if (!user) return null

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">💬 Team Messages</h1>
        <p className="text-sm text-gray-500 mt-1">Real-time team communication</p>
      </div>
      <TeamChat currentUser={{ id: user.id, name: user.name }} />
    </div>
  )
}
