'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Send, User, Zap, CheckCircle, Clock, DollarSign, Globe, X, ArrowRight, Loader2, Search, Briefcase, Star } from 'lucide-react'
import { parseMatchRequest, getTopMatches, type MatchResult } from '@/lib/ai-engine'

const EXAMPLE_PROMPTS = [
  'I have $1,000 and need a React developer with Node.js experience, fluent English, available this week.',
  'Looking for a mobile app developer with Flutter experience. Budget $2,500, need it done in 2 weeks.',
  'Need a senior Python developer for AI/ML project. Budget $5,000, must be available immediately.',
  'I need a UI/UX designer for my SaaS platform. Budget $800, English speaking preferred.',
]

export default function AIMatchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<MatchResult[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [showChat, setShowChat] = useState(true)
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string; data?: MatchResult[] }[]>([
    { role: 'ai', text: "Hi! I'm Cybrion's AI Talent Match Assistant. Tell me what you're looking for in a freelancer. Include budget, skills needed, timeline, and any preferences." },
  ])
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSubmit = async (text: string) => {
    if (!text.trim() || loading) return

    setMessages(prev => [...prev, { role: 'user', text }])
    setLoading(true)
    setQuery('')

    const request = parseMatchRequest(text)
    const matches = await getTopMatches(request)

    const responseText = matches.length > 0
      ? `I found ${matches.length} great matches based on your requirements:`
      : "I couldn't find exact matches in our current freelancer database. Try adjusting your requirements or being more specific about the skills you need."

    setMessages(prev => [...prev, { role: 'ai', text: responseText, data: matches }])
    setResults(matches)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Hero */}
      <div className="relative overflow-hidden border-b border-gray-800">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(6,182,212,0.15),transparent_50%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm font-medium text-cyan-400">AI-Powered Matching</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
            AI Talent Match
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              Assistant
            </span>
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl">
            Describe your project requirements naturally. Our AI analyzes budget, skills, timeline, and preferences
            to find the perfect freelancer match — even if they have few reviews.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Chat Panel */}
          <div className="lg:col-span-3">
            <div className="rounded-2xl border border-gray-800 bg-gray-900/50 backdrop-blur-sm overflow-hidden">
              {/* Chat Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Talent Match AI</p>
                    <p className="text-xs text-green-400">Online</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowChat(!showChat)}
                  className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-all"
                >
                  {showChat ? <X className="w-4 h-4" /> : <Search className="w-4 h-4" />}
                </button>
              </div>

              {/* Messages */}
              <div className="h-[500px] overflow-y-auto p-4 space-y-4">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    {msg.role === 'ai' ? (
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-4 h-4 text-white" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-lg bg-gray-700 flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-gray-300" />
                      </div>
                    )}
                    <div className={`max-w-[80%] ${msg.role === 'user' ? 'text-right' : ''}`}>
                      <div className={`rounded-2xl px-4 py-3 ${
                        msg.role === 'user'
                          ? 'bg-cyan-600 text-white rounded-tr-sm'
                          : 'bg-gray-800 text-gray-200 rounded-tl-sm'
                      }`}>
                        <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                      </div>

                      {msg.data && msg.data.length > 0 && (
                        <div className="mt-3 space-y-3">
                          {msg.data.map((result, idx) => (
                            <motion.div
                              key={result.freelancerId}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: idx * 0.1 }}
                              className="rounded-xl border border-cyan-500/20 bg-gray-800/80 p-4 text-left"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-sm font-bold">
                                    {result.freelancer.name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2) || 'FL'}
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-white">{result.freelancer.name}</p>
                                    <p className="text-xs text-gray-400">{result.freelancer.title}</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-lg font-bold text-cyan-400">{result.matchScore}%</div>
                                  <div className="text-xs text-gray-500">Match</div>
                                </div>
                              </div>

                              <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
                                <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" />${result.freelancer.hourlyRate}/hr</span>
                                <span className="flex items-center gap-1"><Star className="w-3 h-3" />{result.freelancer.rating}</span>
                                <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" />{result.freelancer.completedJobs} jobs</span>
                                <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3" />{result.estimatedSuccessRate}% success</span>
                              </div>

                              <div className="space-y-1 mb-3">
                                {result.reasons.map((reason, ri) => (
                                  <div key={ri} className="flex items-center gap-2 text-xs text-cyan-300">
                                    <CheckCircle className="w-3 h-3 flex-shrink-0" />
                                    {reason}
                                  </div>
                                ))}
                              </div>

                              <a
                                href={`/freelancers/${result.freelancerId}`}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-medium transition-colors"
                              >
                                View Profile <ArrowRight className="w-3 h-3" />
                              </a>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div className="rounded-2xl rounded-tl-sm bg-gray-800 px-4 py-3">
                      <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-gray-800">
                <form onSubmit={(e) => { e.preventDefault(); handleSubmit(query) }} className="flex gap-3">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Describe your ideal freelancer..."
                    className="flex-1 px-4 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
                    disabled={loading}
                  />
                  <button
                    type="submit"
                    disabled={loading || !query.trim()}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-medium hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  </button>
                </form>
                <div className="flex flex-wrap gap-2 mt-3">
                  {EXAMPLE_PROMPTS.map((prompt, i) => (
                    <button
                      key={i}
                      onClick={() => setQuery(prompt)}
                      className="text-xs text-gray-500 hover:text-cyan-400 px-3 py-1.5 rounded-lg bg-gray-800/50 hover:bg-gray-800 border border-gray-800 transition-all"
                    >
                      {prompt.slice(0, 50)}...
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Info Panel */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border border-gray-800 bg-gray-900/50 backdrop-blur-sm p-6">
              <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <Zap className="w-4 h-4 text-cyan-400" />
                How It Works
              </h3>
              <div className="space-y-4">
                {[
                  { step: '1', title: 'Describe', desc: 'Tell the AI what you need — budget, skills, timeline, language, and project type.' },
                  { step: '2', title: 'Analyze', desc: 'Our AI analyzes your requirements against our freelancer database using smart matching.' },
                  { step: '3', title: 'Match', desc: 'Get ranked results with match scores, reasons, and estimated success rates.' },
                ].map((item) => (
                  <div key={item.step} className="flex gap-3">
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-cyan-400">{item.step}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{item.title}</p>
                      <p className="text-xs text-gray-400">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-gray-800 bg-gray-900/50 backdrop-blur-sm p-6">
              <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-cyan-400" />
                Smart Scoring
              </h3>
              <div className="space-y-3">
                {[
                  'Skill relevance & verified skills',
                  'Budget compatibility',
                  'Experience level match',
                  'Language compatibility',
                  'Availability & response time',
                  'Portfolio quality & history',
                  'Similar completed projects',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-gray-400">
                    <CheckCircle className="w-3 h-3 text-cyan-400/60 flex-shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-gray-800 bg-gray-900/50 backdrop-blur-sm p-6">
              <h3 className="text-sm font-semibold text-white mb-2">Why AI Matching?</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Traditional platforms rely heavily on ratings and reviews. Cybrion's AI looks deeper —
                analyzing actual skills, project history, and requirements fit. Even freelancers with
                few reviews can rank #1 if they're the perfect match for your project.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
