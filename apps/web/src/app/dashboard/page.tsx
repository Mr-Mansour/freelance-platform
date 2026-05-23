'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Briefcase,
  DollarSign,
  Send,
  TrendingUp,
  Shield,
  Users,
  Clock,
  MessageCircle,
  Plus,
  Search,
  Bell,
  ChevronRight,
  Star,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Sparkles,
  BarChart3,
  FileText,
  Calendar,
  Award,
  Zap,
} from 'lucide-react'

type DashboardData = {
  stats: { icon: string; label: string; value: string; color: string; bg: string }[]
  activity: { icon: string; text: string; time: string; color: string }[]
  milestones: { title: string; project: string; amount: number; dueDate: string; status: string }[]
  recommendations: { title: string; match: number; budget: string; skills: string[] }[]
  trustMetrics: { label: string; value: string }[]
}

const LUCIDE_MAP: Record<string, any> = {
  Briefcase, DollarSign, Send, TrendingUp, Shield, Users,
  CheckCircle, MessageCircle, Star, Clock,
}

function toStatIcon(name: string) {
  return LUCIDE_MAP[name] || Clock
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<DashboardData | null>(null)

  useEffect(() => {
    fetch('/api/dashboard')
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-black animate-pulse">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="h-8 bg-gray-800 rounded w-1/4 mb-8" />
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[...Array(6)].map((_, i) => <div key={i} className="h-24 bg-gray-800 rounded-xl" />)}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-64 bg-gray-800 rounded-xl" />
            <div className="h-64 bg-gray-800 rounded-xl" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-2xl font-bold text-white">
              Welcome back, Alex <span className="wave">👋</span>
            </h1>
            <p className="text-gray-500 mt-1">Here&apos;s what&apos;s happening with your projects</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-xl bg-gray-900 border border-gray-800 text-gray-400 hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
            </button>
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-900 border border-gray-800">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
                AC
              </div>
              <span className="text-sm text-white font-medium">Alex Chen</span>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8"
        >
          {data?.stats.map((stat) => {
            const StatIcon = toStatIcon(stat.icon)
            return (
              <div key={stat.label} className="p-4 rounded-xl border border-gray-800 bg-gray-900/50">
                <div className={`w-9 h-9 rounded-lg ${stat.bg} flex items-center justify-center mb-3`}>
                  <StatIcon className={`w-4 h-4 ${stat.color}`} />
                </div>
                <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
                <p className="text-lg font-bold text-white">{stat.value}</p>
              </div>
            )
          })}
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Activity & Milestones */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-3"
            >
              {[
                { icon: Plus, label: 'Post a Job', href: '/post-job', color: 'text-cyan-400' },
                { icon: Search, label: 'Browse Jobs', href: '/marketplace', color: 'text-blue-400' },
                { icon: MessageCircle, label: 'Messages', href: '/messages', color: 'text-purple-400' },
                { icon: FileText, label: 'Proposals', href: '/proposals', color: 'text-emerald-400' },
              ].map((action) => (
                <a
                  key={action.label}
                  href={action.href}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-800 bg-gray-900/30 hover:border-gray-700 transition-all group"
                >
                  <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center group-hover:bg-gray-700 transition-colors">
                    <action.icon className={`w-5 h-5 ${action.color}`} />
                  </div>
                  <span className="text-xs text-gray-400 group-hover:text-gray-300">{action.label}</span>
                </a>
              ))}
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="p-6 rounded-2xl border border-gray-800 bg-gray-900/50"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
                <a href="#" className="text-sm text-cyan-400 hover:text-cyan-300">View All</a>
              </div>
              <div className="space-y-4">
                {data?.activity.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <MessageCircle className={`w-4 h-4 ${item.color} mt-0.5 flex-shrink-0`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-300">{item.text}</p>
                      <p className="text-xs text-gray-600">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Upcoming Milestones */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-6 rounded-2xl border border-gray-800 bg-gray-900/50"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">Upcoming Milestones</h2>
                <span className="text-xs text-gray-500">{data?.milestones.length || 0} pending</span>
              </div>
              <div className="space-y-3">
                {data?.milestones.map((ms, i) => (
                  <div key={i} className="p-4 rounded-xl border border-gray-800 bg-gray-900/30">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-sm font-medium text-white">{ms.title}</p>
                        <p className="text-xs text-gray-500">{ms.project}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-cyan-400">${ms.amount.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1 text-gray-500">
                        <Calendar className="w-3 h-3" />
                        Due {ms.dueDate}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full ${
                        ms.status === 'IN_PROGRESS' ? 'bg-blue-900/50 text-blue-400' : 'bg-gray-800 text-gray-500'
                      }`}>
                        {ms.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column - Trust & AI */}
          <div className="space-y-6">
            {/* Trust Score Widget */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="p-6 rounded-2xl border border-gray-800 bg-gray-900/50"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-white">Trust Score</h3>
                <span className="px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 text-xs border border-purple-700">
                  ELITE
                </span>
              </div>
              <div className="text-center mb-4">
                <div className="text-5xl font-bold text-white mb-1">94</div>
                <p className="text-sm text-emerald-400">Excellent standing</p>
              </div>
              <div className="h-2 rounded-full bg-gray-800 mb-4 overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-purple-500" style={{ width: '94%' }} />
              </div>
              <div className="space-y-2">
                {[
                  { label: 'Delivery Rate', value: '99%' },
                  { label: 'Client Satisfaction', value: '98%' },
                  { label: 'On-Time Delivery', value: '97%' },
                ].map((m) => (
                  <div key={m.label} className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">{m.label}</span>
                    <span className="text-white font-medium">{m.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* AI Recommendations */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              className="p-6 rounded-2xl border border-cyan-500/20 bg-cyan-600/5"
            >
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                <h3 className="text-sm font-semibold text-cyan-400">AI Recommended Jobs</h3>
              </div>
              <div className="space-y-3">
                {data?.recommendations.map((rec, i) => (
                  <div key={i} className="p-3 rounded-xl bg-gray-900/50 border border-gray-800 cursor-pointer hover:border-cyan-500/30 transition-all">
                    <div className="flex items-start justify-between mb-1">
                      <p className="text-sm font-medium text-white">{rec.title}</p>
                      <span className="text-xs text-emerald-400 font-medium">{rec.match}%</span>
                    </div>
                    <p className="text-xs text-gray-500 mb-2">{rec.budget}</p>
                    <div className="flex flex-wrap gap-1">
                      {rec.skills.map((s) => (
                        <span key={s} className="px-1.5 py-0.5 rounded bg-gray-800 text-gray-500 text-xs">{s}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <a href="/marketplace" className="flex items-center justify-center gap-1 mt-4 text-sm text-cyan-400 hover:text-cyan-300">
                View All Matches
                <ArrowRight className="w-4 h-4" />
              </a>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="p-6 rounded-2xl border border-gray-800 bg-gray-900/50"
            >
              <h3 className="text-sm font-semibold text-white mb-4">This Month</h3>
              <div className="space-y-3">
                {[
                  { icon: DollarSign, label: 'Earnings', value: '$4,200', change: '+12%', positive: true },
                  { icon: Clock, label: 'Hours Logged', value: '84', change: '+8%', positive: true },
                  { icon: Award, label: 'Completed', value: '3', change: '+1', positive: true },
                ].map((s) => (
                  <div key={s.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <s.icon className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-400">{s.label}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-semibold text-white">{s.value}</span>
                      <span className={`text-xs ml-2 ${s.positive ? 'text-emerald-400' : 'text-red-400'}`}>{s.change}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
