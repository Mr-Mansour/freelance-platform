'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Flag, Search, ThumbsUp, XCircle, Loader2,
  Briefcase, User, AlertTriangle,
} from 'lucide-react'

type FlaggedItem = {
  id: string; type: 'job' | 'freelancer' | 'review' | 'message'
  reason: string; reportedBy: string; status: 'pending' | 'reviewed' | 'removed'
  createdAt: string; targetId: string; targetTitle: string
  resolvedBy?: string; resolvedAt?: string
}

export default function ModerationPage() {
  const [items, setItems] = useState<FlaggedItem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => {
    const stored = localStorage.getItem('cybrion_flagged_items')
    if (stored) {
      try { setItems(JSON.parse(stored)) } catch {}
    }
    setLoading(false)
  }, [])

  const saveItems = (updated: FlaggedItem[]) => {
    setItems(updated)
    localStorage.setItem('cybrion_flagged_items', JSON.stringify(updated))
  }

  const updateStatus = (id: string, status: 'reviewed' | 'removed') => {
    saveItems(items.map(i =>
      i.id === id ? { ...i, status, resolvedBy: 'Admin', resolvedAt: new Date().toISOString() } : i
    ))
  }

  const filtered = items.filter(i => {
    if (filter !== 'all' && i.status !== filter) return false
    if (search && !i.targetTitle.toLowerCase().includes(search.toLowerCase()) &&
        !i.reason.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
      </div>
    )
  }

  const pending = items.filter(i => i.status === 'pending').length
  const typeIcons: Record<string, typeof Briefcase> = { job: Briefcase, freelancer: User, review: Flag, message: Flag }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">🚩 Content Moderation</h1>
          <p className="text-sm text-gray-500 mt-1">
            {pending > 0 ? `${pending} flagged item${pending > 1 ? 's' : ''} awaiting review` : 'No flagged items'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search flagged items..."
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-gray-900 border border-gray-800 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-amber-500/50" />
        </div>
        <div className="flex gap-1">
          {['all', 'pending', 'reviewed', 'removed'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${
                filter === f ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' : 'text-gray-500 hover:text-white hover:bg-gray-800/50'
              }`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map(item => {
          const TypeIcon = typeIcons[item.type] || Flag
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-xl border ${
                item.status === 'pending' ? 'border-red-500/30 bg-red-500/5' :
                item.status === 'removed' ? 'border-gray-700 bg-gray-800/30' :
                'border-gray-800 bg-gray-900/50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-6 h-6 rounded bg-gray-800 flex items-center justify-center">
                      <TypeIcon className="w-3 h-3 text-gray-400" />
                    </div>
                    <span className="text-xs font-medium text-gray-400 uppercase">{item.type}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                      item.status === 'pending' ? 'bg-red-500/10 text-red-400' :
                      item.status === 'removed' ? 'bg-gray-700 text-gray-400' :
                      'bg-emerald-500/10 text-emerald-400'
                    }`}>{item.status}</span>
                  </div>
                  <p className="text-sm font-medium text-white">{item.targetTitle}</p>
                  <p className="text-xs text-gray-400 mt-1">{item.reason}</p>
                  <div className="flex items-center gap-3 mt-2 text-[10px] text-gray-600">
                    <span>Reported by {item.reportedBy}</span>
                    <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  {item.status === 'pending' && (
                    <>
                      <button onClick={() => updateStatus(item.id, 'reviewed')}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs transition-all">
                        <ThumbsUp className="w-3 h-3" /> Keep
                      </button>
                      <button onClick={() => updateStatus(item.id, 'removed')}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs transition-all">
                        <XCircle className="w-3 h-3" /> Remove
                      </button>
                    </>
                  )}
                  {item.status === 'reviewed' && (
                    <span className="text-xs px-2 py-1 rounded bg-emerald-500/10 text-emerald-400">Kept</span>
                  )}
                  {item.status === 'removed' && (
                    <span className="text-xs px-2 py-1 rounded bg-red-500/10 text-red-400">Removed</span>
                  )}
                </div>
              </div>
            </motion.div>
          )
        })}
        {filtered.length === 0 && (
          <div className="p-10 rounded-xl border border-gray-800 bg-gray-900/50 text-center">
            <AlertTriangle className="w-12 h-12 mx-auto mb-3 text-gray-700" />
            <p className="text-gray-500 text-sm">No flagged items match your filter.</p>
          </div>
        )}
      </div>
    </div>
  )
}
