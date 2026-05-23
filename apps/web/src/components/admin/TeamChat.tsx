'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Send, Calendar, Clock, Plus, X, Users as UsersIcon } from 'lucide-react'

type ChatMessage = {
  id: string
  userId: string
  userName: string
  text: string
  timestamp: number
}

type Meeting = {
  id: string
  title: string
  date: string
  time: string
  participants: string
  createdBy: string
}

function loadMessages(): ChatMessage[] {
  const stored = localStorage.getItem('cybrion_chat_messages')
  if (stored) { try { return JSON.parse(stored) } catch {} }
  return []
}

function saveMessages(msgs: ChatMessage[]) {
  localStorage.setItem('cybrion_chat_messages', JSON.stringify(msgs))
}

function loadMeetings(): Meeting[] {
  const stored = localStorage.getItem('cybrion_chat_meetings')
  if (stored) { try { return JSON.parse(stored) } catch {} }
  return []
}

function saveMeetings(msgs: Meeting[]) {
  localStorage.setItem('cybrion_chat_meetings', JSON.stringify(msgs))
}

export default function TeamChat({ currentUser }: { currentUser: { id: string; name: string } }) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [text, setText] = useState('')
  const [showMeetingForm, setShowMeetingForm] = useState(false)
  const [mTitle, setMTitle] = useState('')
  const [mDate, setMDate] = useState('')
  const [mTime, setMTime] = useState('')
  const [mParticipants, setMParticipants] = useState('')
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => { setMessages(loadMessages()); setMeetings(loadMeetings()) }, [])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim()) return
    const msg: ChatMessage = {
      id: `msg_${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      text: text.trim(),
      timestamp: Date.now(),
    }
    const updated = [...loadMessages(), msg]
    saveMessages(updated)
    setMessages(updated)
    setText('')
  }

  const handleSchedule = (e: React.FormEvent) => {
    e.preventDefault()
    if (!mTitle.trim() || !mDate || !mTime) return
    const meeting: Meeting = {
      id: `mtg_${Date.now()}`,
      title: mTitle.trim(),
      date: mDate,
      time: mTime,
      participants: mParticipants.trim() || 'All team',
      createdBy: currentUser.name,
    }
    const updated = [...loadMeetings(), meeting]
    saveMeetings(updated)
    setMeetings(updated)
    setMTitle(''); setMDate(''); setMTime(''); setMParticipants('')
    setShowMeetingForm(false)
  }

  const removeMeeting = (id: string) => {
    const updated = loadMeetings().filter(m => m.id !== id)
    saveMeetings(updated)
    setMeetings(updated)
  }

  const formatTime = (ts: number) => {
    const d = new Date(ts)
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const formatDate = (ts: number) => {
    const d = new Date(ts)
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' })
  }

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Chat */}
      <div className="lg:col-span-2 rounded-xl border border-gray-800 bg-gray-900/50 overflow-hidden flex flex-col h-[500px]">
        <div className="p-4 border-b border-gray-800 flex items-center justify-between">
          <h3 className="text-sm font-medium text-white">Team Chat</h3>
          <span className="text-xs text-gray-500">{messages.length} messages</span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 && (
            <div className="h-full flex items-center justify-center">
              <p className="text-gray-600 text-sm">No messages yet. Start a conversation!</p>
            </div>
          )}
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.userId === currentUser.id ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] ${msg.userId === currentUser.id ? 'bg-cyan-600/20 border-cyan-500/30' : 'bg-gray-800/50 border-gray-700'} rounded-xl px-4 py-2 border`}>
                {msg.userId !== currentUser.id && (
                  <p className="text-xs text-cyan-400 mb-0.5 font-medium">{msg.userName}</p>
                )}
                <p className="text-sm text-white">{msg.text}</p>
                <p className="text-[10px] text-gray-600 mt-1 text-right">{formatDate(msg.timestamp)} {formatTime(msg.timestamp)}</p>
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        <form onSubmit={handleSend} className="p-3 border-t border-gray-800 flex gap-2">
          <input type="text" value={text} onChange={e => setText(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-cyan-500/50" />
          <button type="submit"
            className="p-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white transition-all">
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Meetings */}
      <div className="rounded-xl border border-gray-800 bg-gray-900/50 overflow-hidden flex flex-col h-[500px]">
        <div className="p-4 border-b border-gray-800 flex items-center justify-between">
          <h3 className="text-sm font-medium text-white flex items-center gap-2">
            <Calendar className="w-4 h-4 text-cyan-400" />
            Meetings
          </h3>
          <button onClick={() => setShowMeetingForm(!showMeetingForm)}
            className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 transition-all">
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {showMeetingForm && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              onSubmit={handleSchedule}
              className="p-3 rounded-xl bg-gray-800/50 border border-gray-700 space-y-2"
            >
              <input type="text" value={mTitle} onChange={e => setMTitle(e.target.value)}
                placeholder="Meeting title" className="w-full px-2 py-1.5 rounded bg-gray-800 border border-gray-700 text-white text-xs focus:outline-none focus:border-cyan-500/50" />
              <div className="flex gap-2">
                <input type="date" value={mDate} onChange={e => setMDate(e.target.value)}
                  className="flex-1 px-2 py-1.5 rounded bg-gray-800 border border-gray-700 text-white text-xs focus:outline-none focus:border-cyan-500/50" />
                <input type="time" value={mTime} onChange={e => setMTime(e.target.value)}
                  className="flex-1 px-2 py-1.5 rounded bg-gray-800 border border-gray-700 text-white text-xs focus:outline-none focus:border-cyan-500/50" />
              </div>
              <input type="text" value={mParticipants} onChange={e => setMParticipants(e.target.value)}
                placeholder="Participants (optional)" className="w-full px-2 py-1.5 rounded bg-gray-800 border border-gray-700 text-white text-xs focus:outline-none focus:border-cyan-500/50" />
              <button type="submit" className="w-full py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-medium transition-all">
                Schedule Meeting
              </button>
            </motion.form>
          )}

          {meetings.length === 0 && !showMeetingForm && (
            <div className="h-full flex items-center justify-center">
              <p className="text-gray-600 text-sm text-center">
                <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
                No meetings scheduled
              </p>
            </div>
          )}
          {meetings.map((mtg) => (
            <div key={mtg.id} className="p-3 rounded-xl bg-gray-800/30 border border-gray-700/50 group">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-white">{mtg.title}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{mtg.date}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{mtg.time}</span>
                  </div>
                  <span className="flex items-center gap-1 text-xs text-gray-600 mt-1">
                    <UsersIcon className="w-3 h-3" />{mtg.participants}
                  </span>
                </div>
                <button onClick={() => removeMeeting(mtg.id)}
                  className="p-1 rounded text-red-400 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all">
                  <X className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
