'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Plus, X, Calendar, Clock, Users as UsersIcon, Search } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'

type Meeting = {
  id: string; title: string; date: string; time: string; participants: string; createdBy: string; notes: string
}

export default function MeetingsPage() {
  const { managedUsers } = useAuth()
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [participants, setParticipants] = useState('')
  const [notes, setNotes] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const stored = localStorage.getItem('cybrion_meetings')
    if (stored) { try { setMeetings(JSON.parse(stored)) } catch {} }
    const onClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setShowSuggestions(false)
    }
    window.addEventListener('mousedown', onClick)
    return () => window.removeEventListener('mousedown', onClick)
  }, [])

  const save = (ms: Meeting[]) => { localStorage.setItem('cybrion_meetings', JSON.stringify(ms)); setMeetings(ms) }

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !date || !time) return
    const mtg: Meeting = {
      id: `mtg_${Date.now()}`, title: title.trim(), date, time,
      participants: participants.trim() || 'All team',
      createdBy: 'Admin', notes: notes.trim(),
    }
    save([...meetings, mtg])
    setTitle(''); setDate(''); setTime(''); setParticipants(''); setNotes(''); setShowForm(false)
  }

  const remove = (id: string) => save(meetings.filter(m => m.id !== id))

  const addToParticipants = (name: string) => {
    const existing = participants ? participants.split(', ').map(s => s.trim()) : []
    if (!existing.includes(name)) {
      setParticipants([...existing, name].join(', '))
    }
    setSearchQuery('')
    setShowSuggestions(false)
  }

  const suggestedUsers = managedUsers.filter(u =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.position.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const upcoming = meetings.filter(m => new Date(`${m.date}T${m.time}`) > new Date()).sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime())
  const past = meetings.filter(m => new Date(`${m.date}T${m.time}`) <= new Date()).sort((a, b) => new Date(`${b.date}T${b.time}`).getTime() - new Date(`${a.date}T${a.time}`).getTime())

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">📅 Meetings</h1>
          <p className="text-sm text-gray-500 mt-1">Schedule and manage team meetings</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium transition-all">
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? 'Cancel' : 'New Meeting'}
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
          <h3 className="text-sm font-medium text-white">Schedule Meeting</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs text-gray-500 mb-1">Title</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-amber-500/50" required />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Date</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-amber-500/50" required />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Time</label>
              <input type="time" value={time} onChange={e => setTime(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-amber-500/50" required />
            </div>
            <div className="md:col-span-2" ref={searchRef}>
              <label className="block text-xs text-gray-500 mb-1">Participants</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                <input type="text" value={searchQuery}
                  onChange={e => { setSearchQuery(e.target.value); setShowSuggestions(true) }}
                  onFocus={() => setShowSuggestions(true)}
                  placeholder="Search team members to add..."
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-amber-500/50" />
                {showSuggestions && searchQuery && suggestedUsers.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 rounded-lg border border-gray-700 bg-gray-900 shadow-2xl overflow-hidden z-10">
                    {suggestedUsers.map(u => (
                      <button key={u.id} type="button" onClick={() => addToParticipants(u.name)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-left text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-all">
                        <div className="w-7 h-7 rounded-md bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center text-white text-[10px] font-bold">
                          {u.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium">{u.name}</p>
                          <p className="text-xs text-gray-500">@{u.username} — {u.position}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {participants && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {participants.split(', ').map(p => (
                    <span key={p} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 text-xs">
                      {p}
                      <button type="button" onClick={() => setParticipants(participants.split(', ').filter(x => x !== p).join(', '))}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs text-gray-500 mb-1">Notes</label>
              <input type="text" value={notes} onChange={e => setNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-amber-500/50"
                placeholder="Agenda / links" />
            </div>
          </div>
          <button type="submit" className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium transition-all">Schedule</button>
        </motion.form>
      )}

      {upcoming.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-amber-400" /> Upcoming
          </h2>
          <div className="space-y-3">
            {upcoming.map(m => <MeetingCard key={m.id} meeting={m} onRemove={remove} />)}
          </div>
        </div>
      )}

      {past.length > 0 && (
        <div>
          <h2 className="text-sm font-medium text-gray-500 mb-3">Past Meetings</h2>
          <div className="space-y-3">
            {past.map(m => <MeetingCard key={m.id} meeting={m} onRemove={remove} />)}
          </div>
        </div>
      )}

      {meetings.length === 0 && (
        <div className="p-10 rounded-xl border border-gray-800 bg-gray-900/50 text-center">
          <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-700" />
          <p className="text-gray-500 text-sm">No meetings scheduled yet.</p>
        </div>
      )}
    </div>
  )
}

function MeetingCard({ meeting, onRemove }: { meeting: Meeting; onRemove: (id: string) => void }) {
  return (
    <div className="p-4 rounded-xl border border-gray-800 bg-gray-900/50 flex items-center justify-between group">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center text-white text-xs font-bold">
          {new Date(meeting.date).getDate()}
        </div>
        <div>
          <p className="text-sm font-medium text-white">{meeting.title}</p>
          <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{meeting.date}</span>
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{meeting.time}</span>
            <span className="flex items-center gap-1"><UsersIcon className="w-3 h-3" />{meeting.participants}</span>
          </div>
          {meeting.notes && <p className="text-xs text-gray-600 mt-1">{meeting.notes}</p>}
        </div>
      </div>
      <button onClick={() => onRemove(meeting.id)}
        className="p-2 rounded-lg text-red-400 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all">
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}
