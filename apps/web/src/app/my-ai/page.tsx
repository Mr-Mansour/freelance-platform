'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bot, Sparkles, Plus, Settings, Trash2, Edit3, User, MessageCircle, Check, Loader2, Globe, Zap, Crown, Smile, Shield, Send, X } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'

export type AIBot = {
  id: string
  userId: string
  name: string
  avatar: string
  personality: string
  tone: string
  welcomeMessage: string
  style: string
  createdAt: string
  active: boolean
}

const PERSONALITIES = [
  { value: 'professional', label: 'Professional', icon: Shield, desc: 'Formal and business-oriented' },
  { value: 'friendly', label: 'Friendly', icon: Smile, desc: 'Warm and approachable' },
  { value: 'cyberpunk', label: 'Cyberpunk', icon: Zap, desc: 'Edgy and futuristic' },
  { value: 'mentor', label: 'Mentor', icon: Crown, desc: 'Guiding and educational' },
  { value: 'recruiter', label: 'Recruiter', icon: User, desc: 'Sales and recruiting focused' },
  { value: 'technical', label: 'Technical Expert', icon: Sparkles, desc: 'Deep technical explanations' },
]

const TONES = ['Casual', 'Neutral', 'Formal', 'Enthusiastic', 'Calm', 'Witty']

const STYLES = ['Direct', 'Detailed', 'Storytelling', 'Question-based', 'Minimalist']

function getAvatars() {
  const colors = ['from-cyan-500 to-blue-600', 'from-purple-500 to-pink-600', 'from-green-500 to-teal-600', 'from-orange-500 to-red-600', 'from-yellow-500 to-amber-600', 'from-indigo-500 to-violet-600']
  return colors.map(c => c)
}

function getBots(): AIBot[] {
  try {
    return JSON.parse(localStorage.getItem('cybrion_ai_bots') || '[]')
  } catch { return [] }
}

function saveBots(bots: AIBot[]) {
  localStorage.setItem('cybrion_ai_bots', JSON.stringify(bots))
}

export default function MyAIPage() {
  const { user } = useAuth()
  const [bots, setBots] = useState<AIBot[]>([])
  const [editing, setEditing] = useState<string | null>(null)
  const [showCreate, setShowCreate] = useState(false)
  const [testing, setTesting] = useState<string | null>(null)
  const [testMessages, setTestMessages] = useState<{ role: string; text: string }[]>([])
  const [testInput, setTestInput] = useState('')

  const [form, setForm] = useState({
    name: '',
    personality: 'professional',
    tone: 'Neutral',
    welcomeMessage: 'Hello! How can I help you today?',
    style: 'Direct',
  })

  useEffect(() => {
    setBots(getBots())
  }, [])

  const refreshBots = () => {
    setBots(getBots())
  }

  const handleCreate = () => {
    if (!form.name.trim() || !user) return
    const avatarGradients = getAvatars()
    const newBot: AIBot = {
      id: `bot${Date.now()}`,
      userId: user.id,
      name: form.name.trim(),
      avatar: avatarGradients[Math.floor(Math.random() * avatarGradients.length)],
      personality: form.personality,
      tone: form.tone,
      welcomeMessage: form.welcomeMessage,
      style: form.style,
      createdAt: new Date().toISOString(),
      active: true,
    }
    const updated = [...bots, newBot]
    saveBots(updated)
    setBots(updated)
    setShowCreate(false)
    setForm({ name: '', personality: 'professional', tone: 'Neutral', welcomeMessage: 'Hello! How can I help you today?', style: 'Direct' })
  }

  const handleDelete = (id: string) => {
    const updated = bots.filter(b => b.id !== id)
    saveBots(updated)
    setBots(updated)
    if (editing === id) setEditing(null)
  }

  const handleUpdate = (id: string, data: Partial<AIBot>) => {
    const updated = bots.map(b => b.id === id ? { ...b, ...data } : b)
    saveBots(updated)
    setBots(updated)
  }

  const handleTest = (bot: AIBot) => {
    setTesting(bot.id)
    setTestMessages([
      { role: 'ai', text: bot.welcomeMessage },
    ])
    setTestInput('')
  }

  const sendTestMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!testInput.trim() || !testing) return
    const userMsg = testInput.trim()
    setTestMessages(prev => [...prev, { role: 'user', text: userMsg }])
    setTestInput('')

    const bot = bots.find(b => b.id === testing)
    if (!bot) return

    setTimeout(() => {
      const responses: Record<string, string[]> = {
        professional: [
          'Thank you for your inquiry. I would be happy to discuss how I can assist with your project.',
          'I have extensive experience in this area. Let me share some relevant details.',
          'I appreciate your interest. Here is an overview of my services and expertise.',
        ],
        friendly: [
          'Hey thanks for reaching out! I\'d love to help with that!',
          'Great question! Let me break it down for you.',
          'Awesome, I can definitely help with that! What specific aspects are you interested in?',
        ],
        cyberpunk: [
          'AFFIRMATIVE. UNIT INITIALIZING RESPONSE PROTOCOL.',
          'QUERY RECEIVED. ANALYZING REQUEST PARAMETERS...',
          'SYNC COMPLETE. DEPLOYING SOLUTION VECTOR.',
        ],
        mentor: [
          'Excellent question. Let me walk you through this step by step.',
          'This is a great opportunity to learn something new. Here\'s how it works.',
          'I can guide you through this process. Let\'s start with the fundamentals.',
        ],
        recruiter: [
          'Based on your needs, I believe we would be an excellent fit for this project.',
          'Let me highlight some key qualifications that match your requirements.',
          'I have successfully delivered similar projects. Here are the results.',
        ],
        technical: [
          'The architecture involves three core components: data ingestion, processing pipeline, and API layer.',
          'From a technical standpoint, this requires expertise in distributed systems and microservices.',
          'Let me provide a detailed breakdown of the implementation approach.',
        ],
      }

      const personalityResponses = responses[bot.personality] || responses.professional
      const response = personalityResponses[Math.floor(Math.random() * personalityResponses.length)]
      setTestMessages(prev => [...prev, { role: 'ai', text: response }])
    }, 600)
  }

  const getAvatarPreview = (gradient: string) => (
    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-sm font-bold`}>
      <Bot className="w-5 h-5" />
    </div>
  )

  const personalityInfo = PERSONALITIES.find(p => p.value === form.personality)

  return (
    <div className="min-h-screen bg-black">
      {/* Hero */}
      <div className="relative overflow-hidden border-b border-gray-800">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(168,85,247,0.15),transparent_50%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm font-medium text-purple-400">Personal AI</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
            My Personal
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
              AI Assistants
            </span>
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl">
            Create custom AI bots that represent you 24/7. Answer client questions, explain services,
            and collect project requirements — even when you&apos;re offline.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Create Button */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-lg font-semibold text-white">
            Your Bots ({bots.length})
          </h2>
          <button
            onClick={() => setShowCreate(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 text-white text-sm font-medium hover:opacity-90 transition-all"
          >
            <Plus className="w-4 h-4" /> Create Bot
          </button>
        </div>

        {bots.length === 0 && !showCreate && (
          <div className="text-center py-20">
            <Bot className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-400 mb-2">No AI Bots Yet</h3>
            <p className="text-sm text-gray-500 mb-6">Create your first personal AI assistant to start automating client interactions.</p>
            <button
              onClick={() => setShowCreate(true)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 text-white font-medium"
            >
              <Plus className="w-4 h-4" /> Create Your First Bot
            </button>
          </div>
        )}

        {/* Bot List */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bots.map((bot) => (
            <motion.div
              key={bot.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-gray-800 bg-gray-900/50 backdrop-blur-sm overflow-hidden"
            >
              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {getAvatarPreview(bot.avatar)}
                    <div>
                      <p className="text-sm font-medium text-white">{bot.name}</p>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-400 text-xs">
                        {PERSONALITIES.find(p => p.value === bot.personality)?.label || bot.personality}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleTest(bot)}
                      className="p-2 rounded-lg text-gray-400 hover:text-cyan-400 hover:bg-gray-800 transition-all"
                      title="Test Bot"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(bot.id)}
                      className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-gray-800 transition-all"
                      title="Delete Bot"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-gray-400">
                  <div className="flex items-center gap-2">
                    <span className="w-20 text-gray-500">Tone:</span>
                    <span className="text-gray-300">{bot.tone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-20 text-gray-500">Style:</span>
                    <span className="text-gray-300">{bot.style}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-20 text-gray-500">Status:</span>
                    <span className={`inline-flex items-center gap-1 ${bot.active ? 'text-green-400' : 'text-gray-500'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${bot.active ? 'bg-green-400' : 'bg-gray-500'}`} />
                      {bot.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>

                <div className="mt-3 p-3 rounded-lg bg-gray-800/50 border border-gray-800">
                  <p className="text-xs text-gray-500 mb-1">Welcome Message:</p>
                  <p className="text-xs text-gray-300 italic">"{bot.welcomeMessage}"</p>
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <button
                    onClick={() => handleUpdate(bot.id, { active: !bot.active })}
                    className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
                      bot.active
                        ? 'bg-gray-800 text-gray-400 hover:text-red-400'
                        : 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
                    }`}
                  >
                    {bot.active ? 'Deactivate' : 'Activate'}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Create Modal */}
        <AnimatePresence>
          {showCreate && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowCreate(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-lg rounded-2xl border border-gray-700 bg-gray-900 shadow-2xl overflow-hidden"
              >
                <div className="p-6 border-b border-gray-800">
                  <h3 className="text-lg font-semibold text-white">Create AI Bot</h3>
                  <p className="text-sm text-gray-400 mt-1">Customize your personal AI assistant</p>
                </div>

                <div className="p-6 space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Bot Name</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="e.g. John AI, Support Bot, Sales Assistant"
                      className="w-full px-4 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-purple-500/50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">Personality</label>
                    <div className="grid grid-cols-2 gap-2">
                      {PERSONALITIES.map((p) => (
                        <button
                          key={p.value}
                          onClick={() => setForm({ ...form, personality: p.value })}
                          className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-left transition-all ${
                            form.personality === p.value
                              ? 'border-purple-500 bg-purple-500/10 text-purple-300'
                              : 'border-gray-800 bg-gray-800/50 text-gray-400 hover:border-gray-700'
                          }`}
                        >
                          <p.icon className="w-4 h-4 flex-shrink-0" />
                          <div>
                            <p className="text-xs font-medium">{p.label}</p>
                            <p className="text-[10px] opacity-70">{p.desc}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Tone</label>
                      <select
                        value={form.tone}
                        onChange={(e) => setForm({ ...form, tone: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-purple-500/50"
                      >
                        {TONES.map((t) => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Style</label>
                      <select
                        value={form.style}
                        onChange={(e) => setForm({ ...form, style: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-purple-500/50"
                      >
                        {STYLES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Welcome Message</label>
                    <textarea
                      value={form.welcomeMessage}
                      onChange={(e) => setForm({ ...form, welcomeMessage: e.target.value })}
                      rows={3}
                      placeholder="Hello! How can I help you today?"
                      className="w-full px-4 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-purple-500/50 resize-none"
                    />
                  </div>
                </div>

                <div className="p-6 border-t border-gray-800 flex items-center justify-end gap-3">
                  <button
                    onClick={() => setShowCreate(false)}
                    className="px-4 py-2 rounded-lg text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreate}
                    disabled={!form.name.trim()}
                    className="px-6 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 text-white text-sm font-medium hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Create Bot
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Test Chat Modal */}
        <AnimatePresence>
          {testing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
              onClick={() => setTesting(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-md rounded-2xl border border-gray-700 bg-gray-900 shadow-2xl overflow-hidden"
              >
                <div className="flex items-center justify-between p-4 border-b border-gray-800">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{bots.find(b => b.id === testing)?.name || 'AI Bot'}</p>
                      <p className="text-xs text-green-400">Test Mode</p>
                    </div>
                  </div>
                  <button onClick={() => setTesting(null)} className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="h-72 overflow-y-auto p-4 space-y-3">
                  {testMessages.map((msg, i) => (
                    <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                      {msg.role === 'ai' ? (
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center flex-shrink-0">
                          <Bot className="w-3.5 h-3.5 text-white" />
                        </div>
                      ) : (
                        <div className="w-7 h-7 rounded-lg bg-gray-700 flex items-center justify-center flex-shrink-0">
                          <User className="w-3.5 h-3.5 text-gray-300" />
                        </div>
                      )}
                      <div className={`max-w-[80%] ${msg.role === 'user' ? '' : ''}`}>
                        <div className={`rounded-2xl px-3 py-2 ${
                          msg.role === 'user'
                            ? 'bg-purple-600 text-white rounded-tr-sm'
                            : 'bg-gray-800 text-gray-200 rounded-tl-sm'
                        }`}>
                          <p className="text-sm">{msg.text}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={(el) => el?.scrollIntoView({ behavior: 'smooth' })} />
                </div>

                <div className="p-4 border-t border-gray-800">
                  <form onSubmit={sendTestMessage} className="flex gap-2">
                    <input
                      type="text"
                      value={testInput}
                      onChange={(e) => setTestInput(e.target.value)}
                      placeholder="Ask something..."
                      className="flex-1 px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-purple-500/50"
                    />
                    <button
                      type="submit"
                      disabled={!testInput.trim()}
                      className="px-3 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-600 text-white text-sm hover:opacity-90 transition-all disabled:opacity-50"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Info Section */}
        <div className="mt-16 grid md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-gray-800 bg-gray-900/50 backdrop-blur-sm p-6">
            <Bot className="w-8 h-8 text-purple-400 mb-3" />
            <h3 className="text-sm font-semibold text-white mb-2">Freelancer Use</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Create a bot that answers client questions, explains your services, shows portfolio information,
              discusses pricing, and collects project requirements — 24/7 without you being online.
            </p>
          </div>
          <div className="rounded-2xl border border-gray-800 bg-gray-900/50 backdrop-blur-sm p-6">
            <Globe className="w-8 h-8 text-purple-400 mb-3" />
            <h3 className="text-sm font-semibold text-white mb-2">Business Use</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Agencies can deploy branded AI representatives that act as virtual sales and support agents,
              handling client inquiries and lead qualification automatically.
            </p>
          </div>
          <div className="rounded-2xl border border-gray-800 bg-gray-900/50 backdrop-blur-sm p-6">
            <Zap className="w-8 h-8 text-purple-400 mb-3" />
            <h3 className="text-sm font-semibold text-white mb-2">24/7 Availability</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Your AI bot works around the clock. Never miss a client inquiry again. Each bot is customized
              with your unique personality, tone, and communication style.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
