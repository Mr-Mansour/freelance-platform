'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  MessageCircle,
  ChevronRight,
  Send,
  Paperclip,
  MoreVertical,
  Phone,
  Video,
  Check,
  CheckCheck,
  Star,
  Shield,
  Clock,
  ArrowLeft,
  Trash2,
  Archive,
  Flag,
  User,
  X,
  Loader2,
} from 'lucide-react'

type Message = {
  id?: string
  senderId: string
  text: string
  timestamp: string
  status?: string
  attachment?: { name: string; url: string; type: string }
}

type Conversation = {
  id: string
  name: string
  avatar: string | null
  lastMessage: string
  lastTimestamp: string
  unread: number
  online: boolean
  role?: string
  project: string
  messages?: Message[]
}

export default function MessagesPage() {
  const [loading, setLoading] = useState(true)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [messagesLoading, setMessagesLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [messageInput, setMessageInput] = useState('')
  const [showMobileList, setShowMobileList] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [pendingAttachment, setPendingAttachment] = useState<{ name: string; url: string; type: string } | null>(null)

  useEffect(() => {
    fetch('/api/messages')
      .then(r => r.json())
      .then(d => { setConversations(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!selectedConversation) return
    setMessagesLoading(true)
    fetch(`/api/messages/${selectedConversation}`)
      .then(r => r.json())
      .then(d => { setMessages(d); setMessagesLoading(false) })
      .catch(() => setMessagesLoading(false))
  }, [selectedConversation])

  const filteredConversations = conversations.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.project.toLowerCase().includes(search.toLowerCase())
  )

  const activeConversation = conversations.find(c => c.id === selectedConversation)

  const handleSendMessage = async () => {
    if ((!messageInput.trim() && !pendingAttachment) || !selectedConversation) return
    const msg: Message = {
      senderId: 'me',
      text: messageInput.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent',
      ...(pendingAttachment ? { attachment: pendingAttachment } : {}),
    }
    try {
      await fetch(`/api/messages/${selectedConversation}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(msg) })
      setMessages(prev => [...prev, msg])
    } catch (err) { console.error(err) }
    setMessageInput('')
    setPendingAttachment(null)
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const data = await res.json()
      setPendingAttachment({ name: data.name, url: data.url, type: data.type })
    } catch (err) { console.error(err) }
    setUploading(false)
    e.target.value = ''
  }

  const handleSelectConversation = (id: string) => {
    setSelectedConversation(id)
    setShowMobileList(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black animate-pulse">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="h-8 bg-gray-800 rounded w-1/4 mb-8" />
          <div className="grid grid-cols-[380px_1fr] gap-6 h-[600px]">
            <div className="rounded-2xl bg-gray-900/50 border border-gray-800 p-4 space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gray-800" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-800 rounded w-3/4" />
                    <div className="h-3 bg-gray-800 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
            <div className="rounded-2xl bg-gray-900/50 border border-gray-800 p-4">
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gray-800 rounded-xl mx-auto mb-3" />
                  <div className="h-4 bg-gray-800 rounded w-48 mx-auto" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-2xl font-bold text-white">Messages</h1>
          <p className="text-gray-500 text-sm mt-1">Stay connected with your clients and collaborators</p>
        </motion.div>

        <div className="grid lg:grid-cols-[380px_1fr] gap-6 h-[calc(100vh-220px)] min-h-[500px]">
          {/* Conversation List */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`lg:block ${showMobileList ? 'block' : 'hidden'} rounded-2xl border border-gray-800 bg-gray-900/50 overflow-hidden`}
          >
            <div className="p-3 border-b border-gray-800">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
                />
              </div>
            </div>

            <div className="overflow-y-auto h-[calc(100%-60px)]">
              {filteredConversations.length === 0 ? (
                <div className="p-8 text-center">
                  <MessageCircle className="w-10 h-10 text-gray-700 mx-auto mb-3" />
                  <p className="text-sm text-gray-500">No conversations found</p>
                </div>
              ) : (
                filteredConversations.map((conversation) => (
                  <button
                    key={conversation.id}
                    onClick={() => handleSelectConversation(conversation.id)}
                    className={`w-full text-left p-4 border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors ${
                      selectedConversation === conversation.id ? 'bg-gray-800/40' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative flex-shrink-0">
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-sm font-bold">
                          {conversation.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        {conversation.online && (
                          <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-gray-900" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-medium text-white truncate">{conversation.name}</span>
                          <span className="text-xs text-gray-500 flex-shrink-0">{conversation.lastTimestamp}</span>
                        </div>
                        <p className="text-xs text-gray-500 truncate mt-0.5">{conversation.project}</p>
                        <p className="text-xs text-gray-400 truncate mt-0.5">{conversation.lastMessage}</p>
                      </div>
                      {conversation.unread > 0 && (
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-cyan-500 text-white text-[10px] font-bold flex items-center justify-center">
                          {conversation.unread}
                        </span>
                      )}
                    </div>
                  </button>
                ))
              )}
            </div>
          </motion.div>

          {/* Chat Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`lg:block ${!showMobileList ? 'block' : 'hidden'} rounded-2xl border border-gray-800 bg-gray-900/50 overflow-hidden flex flex-col`}
          >
            {activeConversation ? (
              <>
                {/* Chat Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-800">
                  <div className="flex items-center gap-3">
                    <button onClick={() => setShowMobileList(true)} className="lg:hidden p-1 -ml-1 text-gray-400 hover:text-white">
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div className="relative">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-sm font-bold">
                        {activeConversation.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      {activeConversation.online && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-gray-900" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{activeConversation.name}</p>
                      <p className="text-xs text-gray-500">
                        {activeConversation.online ? 'Online' : 'Offline'} &middot; {activeConversation.role === 'client' ? 'Client' : 'Freelancer'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">
                      <Phone className="w-4 h-4" />
                    </button>
                    <button className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">
                      <Video className="w-4 h-4" />
                    </button>
                    <button className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                  {messages.length === 0 && !messagesLoading ? (
                    <div className="flex-1 flex items-center justify-center text-gray-500 text-sm">
                      No messages yet. Start a conversation.
                    </div>
                  ) : messagesLoading ? (
                    <div className="flex-1 flex items-center justify-center text-gray-500 text-sm">
                      Loading messages...
                    </div>
                  ) : (
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                      <div className="text-center mb-4">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-800 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          {messages[0]?.timestamp || 'Today'}
                        </div>
                      </div>

                  {messages.map((msg) => {
                    const isMe = msg.senderId === 'me'
                    return (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[75%] ${isMe ? 'order-1' : 'order-1'}`}>
                          <div className={`p-3 rounded-2xl ${
                            isMe
                              ? 'bg-cyan-600/20 border border-cyan-500/30 rounded-br-md'
                              : 'bg-gray-800 border border-gray-700/50 rounded-bl-md'
                          }`}>
                            <p className="text-sm text-gray-200">{msg.text}</p>
                            {msg.attachment && (
                              <div className="mt-2 p-2 rounded-lg bg-gray-800/50 border border-gray-700/50">
                                <p className="text-xs text-cyan-400 truncate">{msg.attachment.name}</p>
                                {msg.attachment.type.startsWith('image/') && (
                                  <img src={msg.attachment.url} alt={msg.attachment.name}
                                    className="mt-1 max-w-full h-32 rounded object-cover" />
                                )}
                              </div>
                            )}
                          </div>
                          <div className={`flex items-center gap-1 mt-1 ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <span className="text-[10px] text-gray-600">{msg.timestamp}</span>
                            {isMe && (
                              msg.status === 'read' ? (
                                <CheckCheck className="w-3 h-3 text-cyan-400" />
                              ) : msg.status === 'delivered' ? (
                                <CheckCheck className="w-3 h-3 text-gray-600" />
                              ) : (
                                <Check className="w-3 h-3 text-gray-600" />
                              )
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              )}

              {/* Message Input */}
                <div className="p-4 border-t border-gray-800">
                  {pendingAttachment && (
                    <div className="flex items-center gap-2 mb-2 p-2 rounded-lg bg-gray-800/50 border border-gray-700">
                      <span className="text-xs text-cyan-400 flex-1 truncate">{pendingAttachment.name}</span>
                      <button onClick={() => setPendingAttachment(null)} className="text-gray-500 hover:text-red-400 transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <label className="p-2 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-gray-800 transition-colors cursor-pointer">
                      <Paperclip className="w-5 h-5" />
                      <input type="file" className="hidden" onChange={handleFileSelect} disabled={uploading} />
                    </label>
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Type a message..."
                        className="w-full px-4 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
                      />
                    </div>
                    <button
                      onClick={handleSendMessage}
                      disabled={(!messageInput.trim() && !pendingAttachment)}
                      className="p-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="w-8 h-8 text-gray-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-1">Select a conversation</h3>
                  <p className="text-sm text-gray-500">Choose from your existing conversations or start a new one</p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
