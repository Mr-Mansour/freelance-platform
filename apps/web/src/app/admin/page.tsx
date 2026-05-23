'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users, Briefcase, TrendingUp, DollarSign } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { loadPlatformStats, formatCount } from '@/lib/platform-stats'

export default function AdminOverview() {
  const { user, managedUsers } = useAuth()
  const [stats, setStats] = useState(loadPlatformStats())
  const [jobsCount, setJobsCount] = useState(0)
  const [pagesCount, setPagesCount] = useState(0)

  useEffect(() => {
    setStats(loadPlatformStats())
    const stored = localStorage.getItem('cybrion_admin_jobs')
    if (stored) { try { setJobsCount(JSON.parse(stored).length) } catch {} }
    const storedPages = localStorage.getItem('cybrion_custom_pages')
    if (storedPages) { try { setPagesCount(JSON.parse(storedPages).length) } catch {} }
  }, [])

  const cards = [
    { label: 'Active Freelancers', value: formatCount(stats.freelancers), icon: Users, color: 'from-cyan-500 to-blue-600' },
    { label: 'Jobs Posted', value: formatCount(stats.jobsPosted), icon: Briefcase, color: 'from-purple-500 to-pink-600' },
    { label: 'Successful Projects', value: formatCount(stats.projects), icon: TrendingUp, color: 'from-emerald-500 to-teal-600' },
    { label: 'Total Earnings', value: `$${stats.totalEarnings.toLocaleString()}`, icon: DollarSign, color: 'from-yellow-500 to-amber-600' },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">
          {user?.role === 'owner' ? "Qan's Dashboard" : 'Admin Dashboard'}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Welcome back, {user?.name} — {user?.title}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="p-6 rounded-xl border border-gray-800 bg-gray-900/50"
          >
            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${card.color} flex items-center justify-center mb-3`}>
              <card.icon className="w-5 h-5 text-white" />
            </div>
            <p className="text-sm text-gray-500 mb-1">{card.label}</p>
            <p className="text-3xl font-bold text-white">{card.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="p-5 rounded-xl border border-gray-800 bg-gray-900/50">
          <p className="text-sm text-gray-500 mb-1">Team Members</p>
          <p className="text-2xl font-bold text-white">{managedUsers.length}</p>
        </div>
        <div className="p-5 rounded-xl border border-gray-800 bg-gray-900/50">
          <p className="text-sm text-gray-500 mb-1">Admin Jobs</p>
          <p className="text-2xl font-bold text-white">{jobsCount}</p>
        </div>
        <div className="p-5 rounded-xl border border-gray-800 bg-gray-900/50">
          <p className="text-sm text-gray-500 mb-1">Published Pages</p>
          <p className="text-2xl font-bold text-white">{pagesCount}</p>
        </div>
      </div>

      {user?.role === 'owner' && (
        <div className="p-5 rounded-xl border border-amber-500/20 bg-amber-500/5">
          <p className="text-sm font-medium text-amber-300 mb-1">🔐 Owner Access</p>
          <p className="text-xs text-gray-500">Full platform control. Use the sidebar to manage users, content, sales, and more.</p>
        </div>
      )}
    </div>
  )
}
