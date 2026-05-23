'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Briefcase,
  FileText,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Search,
  Shield,
  User,
  Building,
  Lock,
  Unlock,
  Calendar,
  TrendingUp,
  ArrowRight,
} from 'lucide-react'

type Contract = {
  id: string
  title: string
  clientName: string
  clientAvatar: string | null
  amount: number
  escrowStatus: 'FUNDED' | 'PENDING'
  status: 'ACTIVE' | 'COMPLETED' | 'DISPUTED'
  progress: number
  totalMilestones: number
  completedMilestones: number
  startDate: string
  endDate: string
  role: 'freelancer' | 'client'
}

export default function ContractsPage() {
  const [loading, setLoading] = useState(true)
  const [contracts, setContracts] = useState<Contract[]>([])
  const [stats, setStats] = useState({ active: 0, completed: 0, totalEarned: 0, escrowed: 0 })
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')

  useEffect(() => {
    fetch('/api/contracts')
      .then(r => r.json())
      .then(d => { setContracts(d.contracts); setStats(d.stats); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filteredContracts = contracts.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase()) || c.clientName.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter
    return matchesSearch && matchesStatus
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-black animate-pulse">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="h-8 bg-gray-800 rounded w-1/4 mb-8" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[...Array(4)].map((_, i) => <div key={i} className="h-20 bg-gray-800 rounded-xl" />)}
          </div>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => <div key={i} className="h-32 bg-gray-800 rounded-xl" />)}
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
          <h1 className="text-2xl font-bold text-white">Contracts</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your active and past contracts</p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {[
            { label: 'Active Contracts', value: stats.active, icon: Briefcase, color: 'text-cyan-400', bg: 'bg-cyan-600/10' },
            { label: 'Completed', value: stats.completed, icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-600/10' },
            { label: 'Total Volume', value: `$${(stats.totalEarned / 1000).toFixed(0)}K`, icon: DollarSign, color: 'text-blue-400', bg: 'bg-blue-600/10' },
            { label: 'In Escrow', value: `$${(stats.escrowed / 1000).toFixed(0)}K`, icon: Shield, color: 'text-purple-400', bg: 'bg-purple-600/10' },
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
              placeholder="Search contracts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-900 border border-gray-800 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
            />
          </div>
          <div className="flex gap-1">
            {['ALL', 'ACTIVE', 'COMPLETED', 'DISPUTED'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  statusFilter === status
                    ? 'bg-cyan-600/20 text-cyan-400 border border-cyan-500/50'
                    : 'bg-gray-900 text-gray-400 border border-gray-800 hover:border-gray-700'
                }`}
              >
                {status.charAt(0) + status.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Contracts List */}
        <div className="space-y-3">
          {filteredContracts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <FileText className="w-12 h-12 text-gray-700 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-white mb-1">No contracts found</h3>
              <p className="text-sm text-gray-500">Contracts will appear here once you start a project</p>
            </motion.div>
          ) : (
            filteredContracts.map((contract, index) => (
              <motion.a
                key={contract.id}
                href={`/contracts/${contract.id}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="block p-5 rounded-xl border border-gray-800 bg-gray-900/30 hover:border-gray-700 transition-all group"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-start gap-4 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                      {contract.clientName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold text-white group-hover:text-cyan-400 transition-colors truncate">{contract.title}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">{contract.clientName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      contract.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-700' :
                      contract.status === 'COMPLETED' ? 'bg-blue-500/10 text-blue-400 border border-blue-700' :
                      'bg-red-500/10 text-red-400 border border-red-700'
                    }`}>
                      {contract.status}
                    </span>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                      contract.escrowStatus === 'FUNDED' ? 'bg-cyan-500/10 text-cyan-400' : 'bg-gray-800 text-gray-500'
                    }`}>
                      {contract.escrowStatus === 'FUNDED' ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                      {contract.escrowStatus}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-xs text-gray-500 mb-3">
                  <span className="flex items-center gap-1">
                    <DollarSign className="w-3 h-3" />
                    ${contract.amount.toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {contract.startDate} - {contract.endDate}
                  </span>
                  <span className="flex items-center gap-1">
                    <FileText className="w-3 h-3" />
                    {contract.completedMilestones}/{contract.totalMilestones} milestones
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-1.5 rounded-full bg-gray-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        contract.progress === 100 ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' :
                        contract.status === 'DISPUTED' ? 'bg-gradient-to-r from-red-500 to-red-400' :
                        'bg-gradient-to-r from-cyan-500 to-blue-500'
                      }`}
                      style={{ width: `${contract.progress}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500">{contract.progress}%</span>
                  <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-gray-400 transition-colors" />
                </div>
              </motion.a>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
