'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Send,
  FileText,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
  ChevronRight,
  TrendingUp,
  Search,
  Filter,
  AlertCircle,
  MessageCircle,
  Star,
} from 'lucide-react'

type Proposal = {
  id: string
  jobTitle: string
  clientName: string
  clientAvatar: string | null
  bidAmount: number
  duration: string
  status: 'PENDING' | 'VIEWED' | 'ACCEPTED' | 'DECLINED' | 'WITHDRAWN'
  submittedAt: string
  matchScore: number
  clientRating: number
}

const STATUS_STYLES: Record<string, { label: string; icon: typeof Eye; color: string; bg: string }> = {
  PENDING: { label: 'Pending', icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  VIEWED: { label: 'Viewed', icon: Eye, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  ACCEPTED: { label: 'Accepted', icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  DECLINED: { label: 'Declined', icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/10' },
  WITHDRAWN: { label: 'Withdrawn', icon: EyeOff, color: 'text-gray-400', bg: 'bg-gray-800' },
}

export default function ProposalsPage() {
  const [loading, setLoading] = useState(true)
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')

  useEffect(() => {
    fetch('/api/proposals')
      .then(r => r.json())
      .then(d => { setProposals(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filteredProposals = proposals.filter(p => {
    const matchesSearch = p.jobTitle.toLowerCase().includes(search.toLowerCase()) || p.clientName.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const stats = {
    total: proposals.length,
    pending: proposals.filter(p => p.status === 'PENDING').length,
    viewed: proposals.filter(p => p.status === 'VIEWED').length,
    accepted: proposals.filter(p => p.status === 'ACCEPTED').length,
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black animate-pulse">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="h-8 bg-gray-800 rounded w-1/4 mb-8" />
          <div className="grid grid-cols-4 gap-4 mb-8">
            {[...Array(4)].map((_, i) => <div key={i} className="h-20 bg-gray-800 rounded-xl" />)}
          </div>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => <div key={i} className="h-28 bg-gray-800 rounded-xl" />)}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-bold text-white">My Proposals</h1>
          <p className="text-gray-500 text-sm mt-1">Track and manage your submitted proposals</p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {[
            { label: 'Total Sent', value: stats.total, icon: Send, color: 'text-cyan-400', bg: 'bg-cyan-600/10' },
            { label: 'Pending', value: stats.pending, icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-600/10' },
            { label: 'Viewed', value: stats.viewed, icon: Eye, color: 'text-blue-400', bg: 'bg-blue-600/10' },
            { label: 'Accepted', value: stats.accepted, icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-600/10' },
          ].map((stat) => (
            <div key={stat.label} className="p-4 rounded-xl border border-gray-800 bg-gray-900/50">
              <div className={`w-9 h-9 rounded-lg ${stat.bg} flex items-center justify-center mb-3`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
              <p className="text-lg font-bold text-white">{stat.value}</p>
            </div>
          ))}
        </motion.div>

        {/* Search & Filter */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-3 mb-6"
        >
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search proposals..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-900 border border-gray-800 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
            />
          </div>
          <div className="flex gap-1 overflow-x-auto no-scrollbar">
            {['ALL', 'PENDING', 'VIEWED', 'ACCEPTED', 'DECLINED'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  statusFilter === status
                    ? 'bg-cyan-600/20 text-cyan-400 border border-cyan-500/50'
                    : 'bg-gray-900 text-gray-400 border border-gray-800 hover:border-gray-700'
                }`}
              >
                {status === 'ALL' ? 'All' : STATUS_STYLES[status]?.label || status}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Proposals List */}
        <div className="space-y-3">
          {filteredProposals.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <Send className="w-12 h-12 text-gray-700 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-white mb-1">No proposals found</h3>
              <p className="text-sm text-gray-500">Start browsing jobs and submit your first proposal</p>
              <a href="/marketplace" className="inline-block mt-4 px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-semibold transition-colors">
                Browse Jobs
              </a>
            </motion.div>
          ) : (
            filteredProposals.map((proposal, index) => {
              const statusStyle = STATUS_STYLES[proposal.status]
              const StatusIcon = statusStyle.icon

              return (
                <motion.div
                  key={proposal.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-5 rounded-xl border border-gray-800 bg-gray-900/30 hover:border-gray-700 transition-all group"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                        {proposal.clientName.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="text-sm font-semibold text-white group-hover:text-cyan-400 transition-colors">{proposal.jobTitle}</h3>
                            <p className="text-xs text-gray-500 mt-0.5">{proposal.clientName}</p>
                          </div>
                        </div>
                        <div className="flex items-center flex-wrap gap-x-4 gap-y-1 mt-3">
                          <span className="flex items-center gap-1 text-xs text-gray-500">
                            <DollarSign className="w-3 h-3" />
                            Bid: <span className="text-white font-medium">${proposal.bidAmount.toLocaleString()}</span>
                          </span>
                          <span className="flex items-center gap-1 text-xs text-gray-500">
                            <Clock className="w-3 h-3" />
                            {proposal.duration}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-gray-500">
                            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                            {proposal.clientRating}
                          </span>
                          {proposal.matchScore >= 90 && (
                            <span className="flex items-center gap-1 text-xs text-emerald-400">
                              <TrendingUp className="w-3 h-3" />
                              {proposal.matchScore}% match
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${statusStyle.bg} ${statusStyle.color} border border-transparent`}>
                        <StatusIcon className="w-3 h-3" />
                        {statusStyle.label}
                      </span>
                      <span className="text-xs text-gray-500 hidden sm:block">{proposal.submittedAt}</span>
                      <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-gray-400 transition-colors hidden sm:block" />
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
