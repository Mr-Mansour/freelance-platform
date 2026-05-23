'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  CheckCircle,
  Circle,
  Clock,
  DollarSign,
  ChevronRight,
  MessageCircle,
  AlertCircle,
  Shield,
  ArrowLeft,
  User,
  Building,
  Calendar,
  FileText,
  Send,
  MoreHorizontal,
  Lock,
  Unlock,
} from 'lucide-react'

const MOCK_CONTRACT = {
  id: '1',
  title: 'Build a Full-Stack SaaS Analytics Dashboard',
  description: 'Development of a comprehensive analytics dashboard with real-time data visualization, user auth, and API integrations.',
  amount: 7500,
  status: 'ACTIVE',
  escrowAmount: 7500,
  escrowStatus: 'FUNDED',
  startDate: 'Jan 15, 2026',
  endDate: 'Mar 30, 2026',
  freelancer: {
    name: 'Alex Chen',
    avatar: null,
    rating: 4.9,
    trustLevel: 'ELITE',
  },
  client: {
    name: 'TechCorp Inc.',
    avatar: null,
    rating: 4.8,
    trustLevel: 'TRUSTED',
  },
  milestones: [
    {
      id: '1',
      title: 'Project Setup & Architecture',
      description: 'Set up repository, CI/CD pipeline, database schema, and project architecture.',
      amount: 1500,
      status: 'APPROVED',
      dueDate: 'Jan 25, 2026',
      completedAt: 'Jan 22, 2026',
    },
    {
      id: '2',
      title: 'Authentication & User Management',
      description: 'Implement user auth, roles, permissions, and profile management.',
      amount: 2000,
      status: 'COMPLETED',
      dueDate: 'Feb 10, 2026',
      completedAt: 'Feb 8, 2026',
    },
    {
      id: '3',
      title: 'Dashboard & Data Visualization',
      description: 'Build main dashboard with charts, tables, and real-time data updates.',
      amount: 2500,
      status: 'IN_PROGRESS',
      dueDate: 'Mar 5, 2026',
      completedAt: null,
    },
    {
      id: '4',
      title: 'API Integration & Final Polish',
      description: 'Integrate third-party APIs, optimize performance, and final testing.',
      amount: 1500,
      status: 'PENDING',
      dueDate: 'Mar 25, 2026',
      completedAt: null,
    },
  ],
}

const STATUS_STYLES: Record<string, { label: string; color: string; bg: string }> = {
  PENDING: { label: 'Pending', color: 'text-gray-400', bg: 'bg-gray-800/50' },
  IN_PROGRESS: { label: 'In Progress', color: 'text-blue-400', bg: 'bg-blue-500/10' },
  COMPLETED: { label: 'Completed', color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  APPROVED: { label: 'Approved', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
}

export default function ContractDetailPage() {
  const [loading, setLoading] = useState(true)
  const contract = MOCK_CONTRACT

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-black animate-pulse">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="h-8 bg-gray-800 rounded w-1/3 mb-8" />
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="h-24 bg-gray-800 rounded-xl" />
            <div className="h-24 bg-gray-800 rounded-xl" />
          </div>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-800 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  const completedMilestones = contract.milestones.filter(m => m.status === 'APPROVED').length
  const totalMilestones = contract.milestones.length
  const progress = (completedMilestones / totalMilestones) * 100

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <motion.a
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          href="/dashboard"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-300 mb-8 transition-colors"
        >
          <ChevronRight className="w-4 h-4 rotate-180" />
          Back to Dashboard
        </motion.a>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                  contract.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-700' :
                  'bg-blue-500/10 text-blue-400 border border-blue-700'
                }`}>
                  {contract.status}
                </span>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                  contract.escrowStatus === 'FUNDED' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-700' :
                  'bg-gray-800 text-gray-400 border border-gray-700'
                }`}>
                  <Lock className="w-3 h-3" />
                  Escrow {contract.escrowStatus}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-white mb-1">{contract.title}</h1>
              <p className="text-gray-500 text-sm">{contract.description}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-white">${contract.amount.toLocaleString()}</div>
              <p className="text-sm text-gray-500">Fixed Price</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-400">Project Progress</span>
              <span className="text-white font-medium">{completedMilestones}/{totalMilestones} milestones</span>
            </div>
            <div className="h-2 rounded-full bg-gray-800 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500"
              />
            </div>
          </div>
        </motion.div>

        {/* Party Cards */}
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-4 rounded-xl border border-gray-800 bg-gray-900/50"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-sm font-bold">
                {contract.freelancer.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <p className="text-xs text-gray-500">Freelancer</p>
                <p className="text-sm font-semibold text-white">{contract.freelancer.name}</p>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="p-4 rounded-xl border border-gray-800 bg-gray-900/50"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 text-sm font-bold">
                {contract.client.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <p className="text-xs text-gray-500">Client</p>
                <p className="text-sm font-semibold text-white">{contract.client.name}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Milestones */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-lg font-semibold text-white mb-4">Milestones</h2>
          <div className="space-y-3">
            {contract.milestones.map((milestone, index) => {
              const statusStyle = STATUS_STYLES[milestone.status]
              const isApproved = milestone.status === 'APPROVED'
              const isCompleted = milestone.status === 'COMPLETED'
              const isInProgress = milestone.status === 'IN_PROGRESS'
              const isPending = milestone.status === 'PENDING'

              return (
                <motion.div
                  key={milestone.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 + index * 0.05 }}
                  className={`p-5 rounded-xl border transition-all ${
                    isInProgress ? 'border-cyan-500/30 bg-cyan-600/5' :
                    isApproved ? 'border-emerald-500/20 bg-emerald-600/5' :
                    'border-gray-800 bg-gray-900/30'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="mt-0.5">
                      {isApproved ? (
                        <CheckCircle className="w-5 h-5 text-emerald-400" />
                      ) : isCompleted ? (
                        <Circle className="w-5 h-5 text-yellow-400" />
                      ) : isInProgress ? (
                        <div className="w-5 h-5 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-sm font-semibold text-white">{milestone.title}</h3>
                          <p className="text-xs text-gray-500 mt-1">{milestone.description}</p>
                        </div>
                        <div className="text-right flex-shrink-0 ml-4">
                          <div className="text-sm font-bold text-white">${milestone.amount.toLocaleString()}</div>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${statusStyle.bg} ${statusStyle.color}`}>
                            {statusStyle.label}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Due: {milestone.dueDate}
                        </span>
                        {milestone.completedAt && (
                          <span className="flex items-center gap-1 text-emerald-400">
                            <CheckCircle className="w-3 h-3" />
                            Completed: {milestone.completedAt}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-3">
                        {isCompleted && (
                          <button className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium transition-colors">
                            Approve & Release Payment
                          </button>
                        )}
                        {isInProgress && (
                          <button className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-medium transition-colors">
                            Mark as Complete
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-3 mt-8"
        >
          <button className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-semibold transition-all duration-200">
            <MessageCircle className="w-4 h-4" />
            Message
          </button>
          <button className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-gray-700 hover:border-cyan-500/50 text-gray-300 hover:text-white font-medium transition-all">
            <FileText className="w-4 h-4" />
            Request Changes
          </button>
          <button className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-gray-700 hover:border-red-500/50 text-gray-300 hover:text-red-400 font-medium transition-all ml-auto">
            <AlertCircle className="w-4 h-4" />
            Report Issue
          </button>
        </motion.div>
      </div>
    </div>
  )
}
