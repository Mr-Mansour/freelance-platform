'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Bell, CheckCircle, MessageCircle, DollarSign, Star,
  Shield, Briefcase, AlertCircle, CheckCheck, Settings, Loader2,
} from 'lucide-react'

type Notification = {
  id: string; type: string; text: string; createdAt: string
  read: boolean; actionable: boolean
}

const NOTIFICATION_ICONS: Record<string, typeof CheckCircle> = {
  milestone: CheckCircle, message: MessageCircle, payment: DollarSign,
  review: Star, trust: Shield, proposal: Briefcase, alert: AlertCircle,
}

const NOTIFICATION_COLORS: Record<string, string> = {
  milestone: 'text-emerald-400', message: 'text-cyan-400', payment: 'text-blue-400',
  review: 'text-yellow-400', trust: 'text-purple-400', proposal: 'text-emerald-400', alert: 'text-red-400',
}

export default function NotificationsPage() {
  const [loading, setLoading] = useState(true)
  const [notifData, setNotifData] = useState<{ notifications: Notification[]; unreadCount: number }>({ notifications: [], unreadCount: 0 })
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  const fetchNotifications = () => {
    fetch('/api/notifications')
      .then(r => r.json())
      .then(d => { setNotifData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }

  useEffect(() => { fetchNotifications() }, [])

  const markAllRead = async () => {
    await fetch('/api/notifications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: 'all', userId: 'current-user' }),
    })
    fetchNotifications()
  }

  const markRead = async (id: string) => {
    await fetch('/api/notifications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    fetchNotifications()
  }

  const notifications = filter === 'unread' ? notifData.notifications.filter(n => !n.read) : notifData.notifications
  const unreadCount = notifData.unreadCount

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-white">Notifications</h1>
              {unreadCount > 0 && (
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-medium border border-cyan-500/30">
                  {unreadCount} new
                </span>
              )}
            </div>
            <p className="text-gray-500 text-sm mt-1">Stay updated with your latest activity</p>
          </div>
          <a href="/settings" className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-gray-800 transition-colors">
            <Settings className="w-5 h-5" />
          </a>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="flex items-center gap-2 mb-6">
          {['all', 'unread'].map(tab => (
            <button key={tab} onClick={() => setFilter(tab as typeof filter)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                filter === tab ? 'bg-cyan-600/20 text-cyan-400 border border-cyan-500/50' : 'bg-gray-900 text-gray-400 border border-gray-800 hover:border-gray-700'
              }`}>{tab === 'all' ? 'All Notifications' : 'Unread'}</button>
          ))}
          {unreadCount > 0 && (
            <button onClick={markAllRead} className="ml-auto flex items-center gap-1 px-3 py-2 rounded-lg text-xs text-gray-500 hover:text-gray-300 hover:bg-gray-800 transition-all">
              <CheckCheck className="w-3.5 h-3.5" /> Mark all read
            </button>
          )}
        </motion.div>

        <div className="space-y-2">
          {notifications.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
              <Bell className="w-16 h-16 text-gray-800 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">All caught up!</h3>
              <p className="text-gray-500">No new notifications</p>
            </motion.div>
          ) : (
            notifications.map((notification, index) => {
              const Icon = NOTIFICATION_ICONS[notification.type] || Bell
              const color = NOTIFICATION_COLORS[notification.type] || 'text-gray-400'
              return (
                <motion.div key={notification.id} onClick={() => { if (!notification.read) markRead(notification.id) }}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.03 }}
                  className={`flex items-start gap-4 p-4 rounded-xl border transition-all cursor-pointer hover:border-gray-700 ${
                    notification.read ? 'border-gray-800/50 bg-gray-900/20' : 'border-cyan-500/20 bg-cyan-600/5'
                  }`}>
                  <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center flex-shrink-0">
                    <Icon className={`w-5 h-5 ${color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`text-sm ${notification.read ? 'text-gray-400' : 'text-white font-medium'}`}>{notification.text}</p>
                      {!notification.read && <span className="w-2 h-2 rounded-full bg-cyan-400 flex-shrink-0 mt-1.5" />}
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-gray-600">{new Date(notification.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </motion.div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
