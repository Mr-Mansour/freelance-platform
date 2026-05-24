'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  AlertTriangle, Search, MessageCircle, CheckCircle,
  XCircle, Clock, Loader2, Send,
} from 'lucide-react'

type Dispute = {
  id: string; contractTitle: string; raisedByName: string
  subject: string; description: string; priority: string
  status: string; createdAt: string; updatedAt: string
  resolution?: string; resolvedByName?: string
  messages: { senderId: string; text: string; timestamp: string }[]
}

const PRIORITY_STYLES: Record<string, string> = {
  low: 'text-gray-400 bg-gray-800',
  medium: 'text-yellow-400 bg-yellow-500/10',
  high: 'text-orange-400 bg-orange-500/10',
  urgent: 'text-red-400 bg-red-500/10',
}

const STATUS_STYLES: Record<string, string> = {
  open: 'text-red-400 bg-red-500/10 border-red-800',
  investigating: 'text-yellow-400 bg-yellow-500/10 border-yellow-800',
  resolved: 'text-emerald-400 bg-emerald-500/10 border-emerald-800',
  dismissed: 'text-gray-400 bg-gray-800 border-gray-700',
}

export default function DisputesPage() {
  const [disputes, setDisputes] = useState<Dispute[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<string>('all')
  const [selected, setSelected] = useState<Dispute | null>(null)
  const [replyText, setReplyText] = useState('')

  const fetchDisputes = () => {
    fetch('/api/disputes')
      .then(r => r.json())
      .then(d => { setDisputes(d); setLoading(false) })
      .catch(() => setLoading(false))
  }

  useEffect(() => { fetchDisputes() }, [])

  const filtered = disputes.filter(d => {
    if (filter !== 'all' && d.status !== filter) return false
    if (search && !d.subject.toLowerCase().includes(search.toLowerCase()) &&
        !d.contractTitle.toLowerCase().includes(search.toLowerCase()) &&
        !d.raisedByName.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const updateStatus = async (id: string, status: string, resolution?: string) => {
    await fetch(`/api/disputes/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, resolution, resolvedByName: 'Admin' }),
    })
    fetchDisputes()
    setSelected(null)
  }

  const sendReply = async () => {
    if (!replyText.trim() || !selected) return
    const msg = { senderId: 'admin', text: replyText, timestamp: new Date().toISOString() }
    await fetch(`/api/disputes/${selected.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: [...selected.messages, msg] }),
    })
    setReplyText('')
    fetchDisputes()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
      </div>
    )
  }

  const openCount = disputes.filter(d => d.status === 'open' || d.status === 'investigating').length

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">⚖️ Disputes</h1>
          <p className="text-sm text-gray-500 mt-1">
            {openCount > 0 ? `${openCount} open dispute${openCount > 1 ? 's' : ''} requiring attention` : 'All disputes resolved'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search disputes..."
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-gray-900 border border-gray-800 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-amber-500/50" />
        </div>
        <div className="flex gap-1">
          {['all', 'open', 'investigating', 'resolved', 'dismissed'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${
                filter === f ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' : 'text-gray-500 hover:text-white hover:bg-gray-800/50'
              }`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="space-y-3">
          {filtered.map(dispute => (
            <motion.div
              key={dispute.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => setSelected(dispute)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                selected?.id === dispute.id
                  ? 'border-amber-500/50 bg-amber-500/5'
                  : dispute.status === 'open' ? 'border-red-800 bg-red-500/5' :
                    dispute.status === 'investigating' ? 'border-yellow-800 bg-yellow-500/5' :
                    'border-gray-800 bg-gray-900/50'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${PRIORITY_STYLES[dispute.priority]}`}>
                      {dispute.priority}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${STATUS_STYLES[dispute.status]}`}>
                      {dispute.status}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-white">{dispute.subject}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{dispute.contractTitle} · by {dispute.raisedByName}</p>
                </div>
              </div>
              <p className="text-xs text-gray-400 line-clamp-2">{dispute.description}</p>
              <p className="text-[10px] text-gray-600 mt-2">{new Date(dispute.createdAt).toLocaleDateString()}</p>
            </motion.div>
          ))}
          {filtered.length === 0 && (
            <div className="p-10 rounded-xl border border-gray-800 bg-gray-900/50 text-center">
              <AlertTriangle className="w-12 h-12 mx-auto mb-3 text-gray-700" />
              <p className="text-gray-500 text-sm">No disputes found.</p>
            </div>
          )}
        </div>

        {/* Detail Panel */}
        <div className="p-5 rounded-xl border border-gray-800 bg-gray-900/50">
          {selected ? (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-white">{selected.subject}</h3>
                <div className="flex gap-1">
                  {selected.status !== 'resolved' && selected.status !== 'dismissed' && (
                    <>
                      <button onClick={() => updateStatus(selected.id, 'resolved', 'Issue resolved by admin')}
                        className="px-2 py-1 rounded text-[10px] bg-emerald-600 hover:bg-emerald-700 text-white transition-colors">
                        Resolve
                      </button>
                      <button onClick={() => updateStatus(selected.id, 'dismissed', 'Claim dismissed')}
                        className="px-2 py-1 rounded text-[10px] bg-gray-700 hover:bg-gray-600 text-white transition-colors">
                        Dismiss
                      </button>
                    </>
                  )}
                </div>
              </div>
              <p className="text-xs text-gray-400 mb-2">{selected.contractTitle}</p>
              <p className="text-xs text-gray-500 mb-4">{selected.description}</p>

              {selected.resolution && (
                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-800 mb-4">
                  <p className="text-xs text-emerald-400 font-medium">Resolution</p>
                  <p className="text-xs text-gray-400 mt-1">{selected.resolution}</p>
                  {selected.resolvedByName && (
                    <p className="text-[10px] text-gray-600 mt-1">by {selected.resolvedByName}</p>
                  )}
                </div>
              )}

              {selected.messages.length > 0 && (
                <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
                  <p className="text-xs text-gray-500 font-medium">Messages</p>
                  {selected.messages.map((msg, i) => (
                    <div key={i} className={`p-2 rounded-lg ${msg.senderId === 'admin' ? 'bg-amber-500/10 ml-4' : 'bg-gray-800/50'}`}>
                      <p className="text-xs text-gray-300">{msg.text}</p>
                      <p className="text-[10px] text-gray-600 mt-1">{new Date(msg.timestamp).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              )}

              {selected.status !== 'resolved' && selected.status !== 'dismissed' && (
                <div className="flex items-center gap-2">
                  <input type="text" value={replyText} onChange={e => setReplyText(e.target.value)}
                    placeholder="Type a reply..."
                    className="flex-1 px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-xs placeholder-gray-600 focus:outline-none focus:border-amber-500/50" />
                  <button onClick={sendReply}
                    className="p-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white transition-colors">
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-16 text-gray-500">
              <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-700" />
              <p className="text-sm">Select a dispute to review</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
