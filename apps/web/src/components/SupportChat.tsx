'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, Loader2, Bot, User, ExternalLink, CheckCircle } from 'lucide-react'
import { findSupportMatch } from '@/lib/ai-engine'

type Message = {
  role: 'user' | 'ai'
  text: string
  actions?: { label: string; api?: string }[]
}

export default function SupportChat() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', text: "Hi! I'm Cybrion's AI Support Assistant. How can I help you today? I can assist with payments, verification, disputes, proposals, contracts, and account issues." },
  ])
  const [diagnostics, setDiagnostics] = useState<string | null>(null)
  const chatEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim() || loading) return

    const userText = query
    setMessages(prev => [...prev, { role: 'user', text: userText }])
    setQuery('')
    setLoading(true)
    setDiagnostics(null)

    await new Promise(r => setTimeout(r, 500 + Math.random() * 500))

    const match = findSupportMatch(userText)
    const botMsg: Message = { role: 'ai', text: match.response }

    if (match.actions) {
      botMsg.actions = match.actions.map(a => ({
        label: a.label,
        api: a.api,
      }))
    }

    if (userText.toLowerCase().includes('account') || userText.toLowerCase().includes('status')) {
      try {
        const res = await fetch('/api/auth/me')
        const data = await res.json()
        if (data.user) {
          setDiagnostics(`Account: ${data.user.name} (${data.user.role}) — Status: Active`)
        }
      } catch {}
    }

    if (userText.toLowerCase().includes('payment') || userText.toLowerCase().includes('transaction')) {
      try {
        const res = await fetch('/api/payments')
        const payments = await res.json()
        const recent = Array.isArray(payments) ? payments.slice(0, 3) : []
        if (recent.length > 0) {
          setDiagnostics(`Recent payments: ${recent.map((p: any) => `$${p.amount} (${p.status})`).join(', ')}`)
        }
      } catch {}
    }

    if (userText.toLowerCase().includes('ticket') || userText.toLowerCase().includes('support')) {
      try {
        await fetch('/api/notifications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'support_ticket',
            text: `Support ticket auto-created: "${userText.slice(0, 100)}"`,
            userId: 'system',
          }),
        })
        botMsg.text += '\n\nA support ticket has been created automatically. Our team will follow up.'
      } catch {}
    }

    setMessages(prev => [...prev, botMsg])
    setLoading(false)
  }

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-[5.5rem] w-[360px] max-w-[calc(100vw-6rem)] z-50 rounded-2xl border border-gray-700 bg-gray-900 shadow-2xl shadow-blue-500/10 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-gradient-to-r from-blue-600/10 to-indigo-600/10">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">AI Support</p>
                  <p className="text-xs text-green-400">Online — Instant Help</p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-all">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="h-[360px] overflow-y-auto p-4 space-y-3">
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  {msg.role === 'ai' ? (
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-3.5 h-3.5 text-white" />
                    </div>
                  ) : (
                    <div className="w-7 h-7 rounded-lg bg-gray-700 flex items-center justify-center flex-shrink-0">
                      <User className="w-3.5 h-3.5 text-gray-300" />
                    </div>
                  )}
                  <div className={`max-w-[85%] ${msg.role === 'user' ? 'text-right' : ''}`}>
                    <div className={`rounded-2xl px-3 py-2 ${
                      msg.role === 'user'
                        ? 'bg-blue-600 text-white rounded-tr-sm'
                        : 'bg-gray-800 text-gray-200 rounded-tl-sm'
                    }`}>
                      <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                    </div>
                    {msg.actions && (
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {msg.actions.map((action, ai) => (
                          <a
                            key={ai}
                            href={action.api || '#'}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-400 text-xs hover:bg-cyan-500/20 transition-colors"
                          >
                            <ExternalLink className="w-3 h-3" />
                            {action.label}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {diagnostics && (
                <div className="flex gap-2">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="rounded-2xl rounded-tl-sm bg-gray-800/80 px-3 py-2 border border-green-500/20">
                    <div className="flex items-center gap-1.5 text-xs text-green-400 mb-1">
                      <CheckCircle className="w-3 h-3" />
                      System Diagnostics
                    </div>
                    <p className="text-xs text-gray-300">{diagnostics}</p>
                  </div>
                </div>
              )}

              {loading && (
                <div className="flex gap-2">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="rounded-2xl rounded-tl-sm bg-gray-800 px-3 py-2">
                    <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-800">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ask about payments, verification, disputes..."
                  className="flex-1 px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading || !query.trim()}
                  className="px-3 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setOpen(!open)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-24 z-50 w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all flex items-center justify-center"
      >
        {open ? <X className="w-5 h-5" /> : <MessageCircle className="w-5 h-5" />}
      </motion.button>
    </>
  )
}
