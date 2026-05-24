'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Mail, Search, Loader2, CheckCircle, XCircle } from 'lucide-react'

type EmailLog = {
  id: string; to: string; subject: string; body: string
  status: 'sent' | 'failed'; sentAt: string; type: string
}

export default function EmailLogPage() {
  const [logs, setLogs] = useState<EmailLog[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<EmailLog | null>(null)

  useEffect(() => {
    fetch('/api/email-log')
      .then(r => r.json())
      .then(d => { setLogs(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filtered = logs.filter(l =>
    l.to.toLowerCase().includes(search.toLowerCase()) ||
    l.subject.toLowerCase().includes(search.toLowerCase()) ||
    l.type.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">📧 Email Log</h1>
        <p className="text-sm text-gray-500 mt-1">
          {logs.length} email{logs.length !== 1 ? 's' : ''} sent
          {logs.filter(l => l.status === 'failed').length > 0 && (
            <span className="text-red-400"> · {logs.filter(l => l.status === 'failed').length} failed</span>
          )}
        </p>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search emails..."
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-gray-900 border border-gray-800 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-amber-500/50" />
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="space-y-2">
          {filtered.length === 0 ? (
            <div className="p-10 rounded-xl border border-gray-800 bg-gray-900/50 text-center">
              <Mail className="w-12 h-12 mx-auto mb-3 text-gray-700" />
              <p className="text-gray-500 text-sm">No emails sent yet.</p>
            </div>
          ) : (
            filtered.map(email => (
              <motion.div key={email.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                onClick={() => setSelected(email)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selected?.id === email.id ? 'border-amber-500/50 bg-amber-500/5' :
                  email.status === 'failed' ? 'border-red-800 bg-red-500/5' : 'border-gray-800 bg-gray-900/50'
                }`}>
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {email.status === 'sent' ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-red-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{email.subject}</p>
                    <p className="text-xs text-gray-500 mt-0.5">To: {email.to}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-gray-600">{new Date(email.sentAt).toLocaleString()}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-800 text-gray-400">{email.type}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        <div className="p-5 rounded-xl border border-gray-800 bg-gray-900/50">
          {selected ? (
            <div>
              <h3 className="text-sm font-semibold text-white mb-4">Email Details</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500">To</p>
                  <p className="text-sm text-white">{selected.to}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Subject</p>
                  <p className="text-sm text-white">{selected.subject}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Type</p>
                  <p className="text-sm text-white capitalize">{selected.type}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Status</p>
                  <span className={`text-xs px-2 py-0.5 rounded ${selected.status === 'sent' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                    {selected.status}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Sent at</p>
                  <p className="text-sm text-white">{new Date(selected.sentAt).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Body</p>
                  <div className="p-3 rounded-lg bg-gray-800/50 border border-gray-700 text-xs text-gray-300 whitespace-pre-wrap max-h-48 overflow-y-auto">
                    {selected.body}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 text-gray-500">
              <Mail className="w-12 h-12 mx-auto mb-3 text-gray-700" />
              <p className="text-sm">Select an email to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
