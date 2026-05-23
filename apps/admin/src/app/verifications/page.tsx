'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Shield,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  ChevronRight,
  User,
  BadgeCheck,
  AlertTriangle,
  FileText,
  Eye,
  Loader2,
  X,
  ArrowLeft,
  Download,
} from 'lucide-react'

const VERIFICATION_TABS = [
  { id: 'all', label: 'All Requests' },
  { id: 'PENDING', label: 'Pending', count: 12 },
  { id: 'APPROVED', label: 'Approved' },
  { id: 'REJECTED', label: 'Rejected' },
]

const MOCK_REQUESTS = [
  { id: '1', user: 'Alex Chen', email: 'alex@example.com', type: 'ID_VERIFIED', status: 'PENDING', submittedAt: '2 hours ago', documents: ['Passport.pdf', 'Selfie.jpg'], notes: '' },
  { id: '2', user: 'Sarah Williams', email: 'sarah@example.com', type: 'SKILL_VERIFIED', status: 'PENDING', submittedAt: '5 hours ago', documents: ['Certificate.pdf', 'Portfolio.pdf'], notes: '' },
  { id: '3', user: 'Mike Johnson', email: 'mike@example.com', type: 'PORTFOLIO_VERIFIED', status: 'PENDING', submittedAt: '1 day ago', documents: ['Portfolio.zip'], notes: '' },
  { id: '4', user: 'Emily Davis', email: 'emily@example.com', type: 'ID_VERIFIED', status: 'APPROVED', submittedAt: '2 days ago', documents: ['ID.pdf'], notes: '' },
  { id: '5', user: 'James Wilson', email: 'james@example.com', type: 'ELITE', status: 'REJECTED', submittedAt: '3 days ago', documents: ['Application.pdf'], notes: 'Insufficient portfolio quality' },
]

function VerificationModal({ request, onClose }: { request: typeof MOCK_REQUESTS[0]; onClose: () => void }) {
  const [action, setAction] = useState<'approve' | 'reject' | null>(null)
  const [reason, setReason] = useState('')
  const [processing, setProcessing] = useState(false)

  const handleAction = async () => {
    setProcessing(true)
    await new Promise(r => setTimeout(r, 1500))
    setProcessing(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-2xl rounded-2xl border border-gray-800 bg-gray-900 shadow-2xl"
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-600/20 flex items-center justify-center">
              <Shield className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Review Verification</h2>
              <p className="text-sm text-gray-500">{request.type.replace('_', ' ')}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* User Info */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-lg font-bold">
              {request.user.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">{request.user}</h3>
              <p className="text-sm text-gray-500">{request.email}</p>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-900/50 text-yellow-400 text-xs mt-1 border border-yellow-700">
                <Clock className="w-3 h-3" />
                Submitted {request.submittedAt}
              </span>
            </div>
          </div>

          {/* Documents */}
          <div>
            <h4 className="text-sm font-medium text-gray-300 mb-3">Submitted Documents</h4>
            <div className="space-y-2">
              {request.documents.map((doc) => (
                <div key={doc} className="flex items-center justify-between p-3 rounded-xl bg-gray-800/50 border border-gray-700">
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-300">{doc}</span>
                  </div>
                  <button className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    Preview
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Action */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <button
                onClick={() => setAction('approve')}
                className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                  action === 'approve'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                <CheckCircle className="w-4 h-4 inline mr-2" />
                Approve
              </button>
              <button
                onClick={() => setAction('reject')}
                className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                  action === 'reject'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                <XCircle className="w-4 h-4 inline mr-2" />
                Reject
              </button>
            </div>

            <AnimatePresence>
              {action === 'reject' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Reason for rejection..."
                    className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-red-500/50 resize-none"
                    rows={3}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <button
              onClick={handleAction}
              disabled={processing || (action === 'reject' && !reason)}
              className="w-full mt-4 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-semibold transition-all disabled:opacity-50"
            >
              {processing ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </span>
              ) : (
                `Submit ${action === 'approve' ? 'Approval' : 'Rejection'}`
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default function VerificationsPage() {
  const [activeTab, setActiveTab] = useState('PENDING')
  const [search, setSearch] = useState('')
  const [selectedRequest, setSelectedRequest] = useState<typeof MOCK_REQUESTS[0] | null>(null)

  const filtered = MOCK_REQUESTS.filter(r => {
    const matchesTab = activeTab === 'all' || r.status === activeTab
    const matchesSearch = r.user.toLowerCase().includes(search.toLowerCase()) || r.email.toLowerCase().includes(search.toLowerCase())
    return matchesTab && matchesSearch
  })

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <a href="/" className="hover:text-gray-300">Dashboard</a>
            <ChevronRight className="w-3 h-3" />
            <span className="text-gray-300">Verifications</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Verification Requests</h1>
          <p className="text-gray-500">Review and manage user verification submissions</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Pending', value: '12', color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
            { label: 'Approved Today', value: '8', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
            { label: 'Rejected Today', value: '3', color: 'text-red-400', bg: 'bg-red-500/10' },
          ].map((stat) => (
            <div key={stat.label} className="p-4 rounded-xl border border-gray-800 bg-gray-900/50">
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Tabs & Search */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            {VERIFICATION_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-cyan-600/20 text-cyan-400 border border-cyan-500/30'
                    : 'text-gray-400 hover:text-white border border-transparent'
                }`}
              >
                {tab.label}
                {tab.count && (
                  <span className="ml-2 px-1.5 py-0.5 rounded-full bg-gray-800 text-xs">{tab.count}</span>
                )}
              </button>
            ))}
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search users..."
              className="pl-10 pr-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:border-cyan-500/50"
            />
          </div>
        </div>

        {/* Requests List */}
        <div className="space-y-3">
          {filtered.map((request) => (
            <motion.div
              key={request.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => setSelectedRequest(request)}
              className="p-4 rounded-xl border border-gray-800 bg-gray-900/30 hover:border-gray-700 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  {request.user.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-white">{request.user}</p>
                      <p className="text-xs text-gray-500">{request.email}</p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      request.status === 'PENDING' ? 'bg-yellow-900/50 text-yellow-400 border border-yellow-700' :
                      request.status === 'APPROVED' ? 'bg-emerald-900/50 text-emerald-400 border border-emerald-700' :
                      'bg-red-900/50 text-red-400 border border-red-700'
                    }`}>
                      {request.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <BadgeCheck className="w-3 h-3" />
                      {request.type.replace('_', ' ')}
                    </span>
                    <span>{request.submittedAt}</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-600" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedRequest && (
          <VerificationModal
            request={selectedRequest}
            onClose={() => setSelectedRequest(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
