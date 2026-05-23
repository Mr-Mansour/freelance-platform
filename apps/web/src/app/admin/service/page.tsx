'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Plus, X, MessageCircle, Check, Clock, AlertTriangle } from 'lucide-react'

type Ticket = {
  id: string; title: string; description: string; status: 'open' | 'in-progress' | 'resolved'; priority: 'low' | 'medium' | 'high'; createdBy: string; date: string; assignee: string
}

const MOCK_TICKETS: Ticket[] = [
  { id: 't1', title: 'Payment not processing', description: 'User reports payment gateway timeout on checkout', status: 'open', priority: 'high', createdBy: 'User #42', date: '2026-05-17', assignee: 'Unassigned' },
  { id: 't2', title: 'Profile image upload broken', description: 'Users cannot upload profile pictures on mobile', status: 'in-progress', priority: 'medium', createdBy: 'User #87', date: '2026-05-16', assignee: 'Alex' },
  { id: 't3', title: 'Account verification email not sending', description: 'Verification emails delayed by 30+ minutes', status: 'open', priority: 'high', createdBy: 'System', date: '2026-05-16', assignee: 'Unassigned' },
  { id: 't4', title: 'Search results not loading', description: 'Marketplace search returns empty results intermittently', status: 'resolved', priority: 'high', createdBy: 'User #12', date: '2026-05-15', assignee: 'Mike' },
  { id: 't5', title: 'Feature request: Dark mode toggle', description: 'Users requesting system-wide dark/light mode switch', status: 'open', priority: 'low', createdBy: 'User #33', date: '2026-05-14', assignee: 'Unassigned' },
]

export default function ServicePage() {
  const [tickets, setTickets] = useState<Ticket[]>(MOCK_TICKETS)
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium')

  const filtered = tickets.filter(t =>
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.description.toLowerCase().includes(search.toLowerCase()) ||
    t.assignee.toLowerCase().includes(search.toLowerCase())
  )

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    setTickets(prev => [{
      id: `t${Date.now()}`, title: title.trim(), description: description.trim(), status: 'open',
      priority, createdBy: 'Admin', date: new Date().toISOString().split('T')[0], assignee: 'Unassigned',
    }, ...prev])
    setTitle(''); setDescription(''); setPriority('medium'); setShowForm(false)
  }

  const updateStatus = (id: string, status: Ticket['status']) => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, status } : t))
  }

  const openCount = tickets.filter(t => t.status === 'open').length
  const inProgressCount = tickets.filter(t => t.status === 'in-progress').length

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">🛠️ Service Team</h1>
          <p className="text-sm text-gray-500 mt-1">
            {openCount > 0 ? `${openCount} open ticket${openCount > 1 ? 's' : ''}, ${inProgressCount} in progress` : 'All tickets resolved'}
          </p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium transition-all">
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? 'Cancel' : 'New Ticket'}
        </button>
      </div>

      {showForm && (
        <motion.form
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          onSubmit={handleAdd}
          className="p-6 rounded-xl border border-gray-800 bg-gray-900/50 mb-6 space-y-4"
        >
          <h3 className="text-sm font-medium text-white">Create Support Ticket</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs text-gray-500 mb-1">Title</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-amber-500/50" required />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs text-gray-500 mb-1">Description</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3}
                className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-amber-500/50" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Priority</label>
              <select value={priority} onChange={e => setPriority(e.target.value as 'low' | 'medium' | 'high')}
                className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-amber-500/50">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
          <button type="submit" className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium transition-all">
            Create Ticket
          </button>
        </motion.form>
      )}

      <div className="relative max-w-xs mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search tickets..."
          className="w-full pl-9 pr-3 py-2 rounded-lg bg-gray-900 border border-gray-800 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-amber-500/50" />
      </div>

      <div className="space-y-3">
        {filtered.map(ticket => (
          <div key={ticket.id} className={`p-4 rounded-xl border ${
            ticket.priority === 'high' && ticket.status !== 'resolved' ? 'border-red-500/20 bg-red-500/5' :
            ticket.status === 'resolved' ? 'border-gray-800 bg-gray-900/30' :
            'border-gray-800 bg-gray-900/50'
          }`}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-medium text-white">{ticket.title}</p>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    ticket.priority === 'high' ? 'bg-red-500/10 text-red-400' :
                    ticket.priority === 'medium' ? 'bg-amber-500/10 text-amber-400' :
                    'bg-gray-500/10 text-gray-400'
                  }`}>
                    {ticket.priority}
                  </span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    ticket.status === 'open' ? 'bg-red-500/10 text-red-400' :
                    ticket.status === 'in-progress' ? 'bg-blue-500/10 text-blue-400' :
                    'bg-emerald-500/10 text-emerald-400'
                  }`}>
                    {ticket.status}
                  </span>
                </div>
                <p className="text-xs text-gray-500">{ticket.description}</p>
                <p className="text-[10px] text-gray-600 mt-1">{ticket.date} • {ticket.createdBy} • Assigned to: {ticket.assignee}</p>
              </div>
              <div className="flex items-center gap-1 ml-4">
                {ticket.status === 'open' && (
                  <button onClick={() => updateStatus(ticket.id, 'in-progress')}
                    className="flex items-center gap-1 px-2 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white text-[10px] transition-all">
                    <Clock className="w-3 h-3" /> Start
                  </button>
                )}
                {ticket.status === 'in-progress' && (
                  <button onClick={() => updateStatus(ticket.id, 'resolved')}
                    className="flex items-center gap-1 px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] transition-all">
                    <Check className="w-3 h-3" /> Resolve
                  </button>
                )}
                {ticket.status === 'resolved' && (
                  <span className="text-[10px] px-2 py-1 rounded bg-emerald-500/10 text-emerald-400">Done</span>
                )}
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="p-10 rounded-xl border border-gray-800 bg-gray-900/50 text-center">
            <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-700" />
            <p className="text-gray-500 text-sm">No tickets found.</p>
          </div>
        )}
      </div>
    </div>
  )
}
