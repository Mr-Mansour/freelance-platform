'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  TrendingUp, DollarSign, Users, Briefcase, Star,
  AlertTriangle, CheckCircle, Loader2,
} from 'lucide-react'

type Analytics = {
  overview: Record<string, number>
  revenueByMonth: Record<string, number>
  jobsByCategory: Record<string, number>
  signupsByMonth: Record<string, number>
  recentEvents: { id: string; type: string; description: string; amount?: number; userName?: string; createdAt: string }[]
}

export default function AnalyticsPage() {
  const [data, setData] = useState<Analytics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/stats')
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
      </div>
    )
  }

  if (!data) {
    return <div className="text-gray-500 text-center py-20">Failed to load analytics</div>
  }

  const { overview, revenueByMonth, jobsByCategory, signupsByMonth, recentEvents } = data
  const revenueEntries = Object.entries(revenueByMonth)
  const maxRevenue = revenueEntries.length ? Math.max(...revenueEntries.map(([, v]) => v)) : 1
  const maxCategory = Object.values(jobsByCategory).length ? Math.max(...Object.values(jobsByCategory)) : 1

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">📊 Analytics</h1>
        <p className="text-sm text-gray-500 mt-1">Real-time platform metrics and insights</p>
      </div>

      {/* Overview cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {[
          { label: 'Freelancers', value: overview.totalFreelancers, icon: Users, color: 'from-cyan-500 to-blue-600' },
          { label: 'Jobs Posted', value: overview.totalJobs, icon: Briefcase, color: 'from-purple-500 to-pink-600' },
          { label: 'Active Contracts', value: overview.activeContracts, icon: CheckCircle, color: 'from-emerald-500 to-teal-600' },
          { label: 'Revenue', value: `$${overview.totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'from-yellow-500 to-amber-600' },
          { label: 'Platform Fees', value: `$${overview.platformFees.toLocaleString()}`, icon: TrendingUp, color: 'from-rose-500 to-red-600' },
          { label: 'Pending Reviews', value: overview.pendingReviews, icon: Star, color: 'from-amber-500 to-orange-600' },
          { label: 'Open Disputes', value: overview.openDisputes, icon: AlertTriangle, color: 'from-red-500 to-rose-600' },
          { label: 'Completed', value: overview.completedContracts, icon: CheckCircle, color: 'from-emerald-500 to-teal-600' },
        ].map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            className="p-4 rounded-xl border border-gray-800 bg-gray-900/50"
          >
            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${card.color} flex items-center justify-center mb-2`}>
              <card.icon className="w-4 h-4 text-white" />
            </div>
            <p className="text-xs text-gray-500">{card.label}</p>
            <p className="text-lg font-bold text-white">{card.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Chart */}
        <div className="p-5 rounded-xl border border-gray-800 bg-gray-900/50">
          <h3 className="text-sm font-semibold text-white mb-4">Revenue by Month</h3>
          {revenueEntries.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-8">No revenue data yet</p>
          ) : (
            <div className="space-y-2">
              {revenueEntries.map(([month, amount]) => (
                <div key={month} className="flex items-center gap-3">
                  <span className="text-xs text-gray-500 w-16 flex-shrink-0">{month}</span>
                  <div className="flex-1 h-5 rounded-full bg-gray-800 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(amount / maxRevenue) * 100}%` }}
                      className="h-full rounded-full bg-gradient-to-r from-amber-500 to-yellow-500"
                    />
                  </div>
                  <span className="text-xs text-gray-400 w-20 text-right">${amount.toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Jobs by Category */}
        <div className="p-5 rounded-xl border border-gray-800 bg-gray-900/50">
          <h3 className="text-sm font-semibold text-white mb-4">Jobs by Category</h3>
          {Object.keys(jobsByCategory).length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-8">No jobs yet</p>
          ) : (
            <div className="space-y-2">
              {Object.entries(jobsByCategory).map(([cat, count]) => (
                <div key={cat} className="flex items-center gap-3">
                  <span className="text-xs text-gray-300 w-28 flex-shrink-0 truncate">{cat}</span>
                  <div className="flex-1 h-5 rounded-full bg-gray-800 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(count / maxCategory) * 100}%` }}
                      className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"
                    />
                  </div>
                  <span className="text-xs text-gray-400 w-8 text-right">{count}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Events */}
      <div className="p-5 rounded-xl border border-gray-800 bg-gray-900/50">
        <h3 className="text-sm font-semibold text-white mb-4">Recent Platform Events</h3>
        {recentEvents.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-8">No events yet</p>
        ) : (
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {recentEvents.map(event => (
              <div key={event.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800/30 transition-colors">
                <div className={`w-2 h-2 rounded-full ${
                  event.type === 'signup' ? 'bg-emerald-500' :
                  event.type === 'payment' ? 'bg-yellow-500' :
                  event.type === 'contract' ? 'bg-cyan-500' :
                  event.type === 'dispute' ? 'bg-red-500' :
                  'bg-gray-500'
                }`} />
                <p className="text-sm text-gray-300 flex-1">{event.description}</p>
                {event.amount && <span className="text-xs text-emerald-400">${event.amount}</span>}
                <span className="text-xs text-gray-600">{new Date(event.createdAt).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
