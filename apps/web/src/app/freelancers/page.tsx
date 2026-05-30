'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, Star, MapPin, Briefcase, Clock, TrendingUp, Verified, Shield, Award,
  Sparkles, X, Filter, Grid3X3, List, ChevronDown, Heart, MessageCircle,
  Calendar, Eye, Bot, Zap, CheckCircle, DollarSign, Globe, User, ArrowRight,
  ExternalLink, Loader2, SlidersHorizontal, ChevronRight, Bookmark,
} from 'lucide-react'

const TRUST_COLORS: Record<string, { label: string; color: string; glow: string; icon: string }> = {
  ROOKIE: { label: 'Rookie', color: 'from-gray-400 to-gray-500', glow: 'rgba(156,163,175,0.3)', icon: '◆' },
  VERIFIED: { label: 'Verified', color: 'from-blue-400 to-blue-500', glow: 'rgba(59,130,246,0.3)', icon: '✓' },
  TRUSTED: { label: 'Trusted', color: 'from-emerald-400 to-emerald-500', glow: 'rgba(16,185,129,0.3)', icon: '★' },
  ELITE: { label: 'Elite', color: 'from-purple-400 to-purple-500', glow: 'rgba(168,85,247,0.3)', icon: '♦' },
  TITAN: { label: 'Titan', color: 'from-yellow-400 to-amber-500', glow: 'rgba(245,158,11,0.3)', icon: '♛' },
  LEGENDARY: { label: 'Legendary', color: 'from-cyan-400 to-blue-500', glow: 'rgba(6,182,212,0.3)', icon: '⚡' },
}

const INDUSTRIES = [
  'All', 'Web Development', 'Mobile', 'Design', 'AI/ML', 'DevOps',
  'Data Science', 'Writing', 'Marketing', 'Video', 'Blockchain', 'Security',
]

const EXPERIENCE_LEVELS = ['All', 'Beginner', 'Intermediate', 'Expert']

const LANGUAGES_LIST = ['All', 'English', 'Spanish', 'French', 'German', 'Arabic', 'Japanese', 'Korean', 'Hindi', 'Mandarin']

function getInitials(name: string) {
  return name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
}

function getGradient(name: string) {
  const gradients = [
    'from-cyan-400 via-blue-500 to-purple-600',
    'from-emerald-400 via-teal-500 to-cyan-600',
    'from-purple-400 via-pink-500 to-rose-600',
    'from-amber-400 via-orange-500 to-red-600',
    'from-blue-400 via-indigo-500 to-violet-600',
    'from-green-400 via-emerald-500 to-teal-600',
  ]
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = ((hash << 5) - hash) + name.charCodeAt(i)
  return gradients[Math.abs(hash) % gradients.length]
}

interface Freelancer {
  id: string; name: string; username?: string; title: string; avatar: string | null
  hourlyRate: number; rating: number; reviewCount: number
  trustLevel: string; jobSuccessRate: number; location: string
  skills: string[]; verifiedBadges: string[]; completedJobs: number
  totalEarned: number; available: boolean
  languages?: string[]; aiMatchScore?: number; responseTime?: string; trustScore?: number
}

function FreelancerCard({ freelancer, index }: { freelancer: Freelancer; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [hover, setHover] = useState(false)
  const [showPortfolio, setShowPortfolio] = useState(false)
  const [aiChatOpen, setAiChatOpen] = useState(false)
  const [aiMessages, setAiMessages] = useState<{ role: string; text: string }[]>([])
  const [aiInput, setAiInput] = useState('')
  const [fav, setFav] = useState(false)
  const trust = TRUST_COLORS[freelancer.trustLevel] || TRUST_COLORS.ROOKIE
  const gradient = getGradient(freelancer.name)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    setTilt({ x: -y * 12, y: x * 12 })
  }

  const botName = freelancer.name.split(' ')[0] + 'AI'

  const handleAiChat = (e: React.FormEvent) => {
    e.preventDefault()
    if (!aiInput.trim()) return
    setAiMessages(prev => [...prev, { role: 'user', text: aiInput.trim() }])
    setAiInput('')
    setTimeout(() => {
      const responses = [
        `Hi! I'm ${botName}, ${freelancer.name}'s AI assistant. I can tell you about their experience in ${freelancer.skills.slice(0, 2).join(' and ')}.`,
        `Great question! ${freelancer.name} has completed ${freelancer.completedJobs} projects with a ${freelancer.jobSuccessRate}% success rate.`,
        `${freelancer.name} is ${freelancer.available ? 'available now' : 'currently busy but taking new projects'}. Their rate is $${freelancer.hourlyRate}/hr.`,
        `I'd recommend checking out ${freelancer.name}'s portfolio for examples of similar work!`,
      ]
      setAiMessages(prev => [...prev, { role: 'ai', text: responses[Math.floor(Math.random() * responses.length)] }])
    }, 800)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
      className="group"
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => { setHover(false); setTilt({ x: 0, y: 0 }) }}
        className="relative rounded-2xl transition-all duration-500 cursor-pointer"
        style={{
          perspective: '1000px',
        }}
      >
        {/* Card body */}
        <div
          className="relative rounded-2xl border border-gray-800/80 overflow-hidden transition-all duration-500"
          style={{
            transform: hover ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(1.02)` : 'rotateX(0) rotateY(0)',
            transition: 'transform 0.2s ease-out, box-shadow 0.3s',
            boxShadow: hover
              ? `0 20px 60px rgba(0,0,0,0.4), 0 0 30px ${trust.glow}, 0 0 60px ${trust.glow}`
              : '0 4px 20px rgba(0,0,0,0.2)',
            background: hover
              ? 'linear-gradient(135deg, rgba(15,15,30,0.95), rgba(20,20,40,0.95))'
              : 'rgba(15,15,25,0.85)',
            backdropFilter: 'blur(16px)',
          }}
        >
          {/* Glow border on hover */}
          <div
            className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{
              background: `linear-gradient(135deg, ${trust.glow.replace('0.3', '0.08')}, transparent 60%)`,
            }}
          />

          <div className="p-5 relative z-10">
            {/* Header: Avatar + Name + Badge */}
            <div className="flex items-start gap-4 mb-4">
              <div className="relative flex-shrink-0">
                <div
                  className={`w-14 h-14 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-lg font-bold shadow-lg`}
                  style={{ boxShadow: hover ? `0 0 20px ${trust.glow}` : '' }}
                >
                  {getInitials(freelancer.name)}
                </div>
                {freelancer.available && (
                  <div className="absolute -bottom-1 -right-1 w-4.5 h-4.5 rounded-full bg-emerald-500 border-[3px] border-gray-900">
                    <div className="absolute inset-0 rounded-full animate-ping bg-emerald-400 opacity-40" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <a href={`/freelancers/${freelancer.id}`} className="inline-block">
                  <h3
                    className="text-lg font-bold bg-gradient-to-r bg-clip-text text-transparent transition-all duration-300"
                    style={{
                      backgroundImage: `linear-gradient(135deg, ${hover ? '#22d3ee, #a78bfa, #60a5fa' : '#e5e7eb, #9ca3af'})`,
                      textShadow: hover ? '0 0 20px rgba(6,182,212,0.3)' : 'none',
                    }}
                  >
                    {freelancer.name}
                  </h3>
                </a>
                {freelancer.username && (
                  <p className="text-xs text-gray-500">{freelancer.username}</p>
                )}
                <p className="text-sm text-gray-400 truncate mt-0.5">{freelancer.title}</p>
              </div>

              <button
                onClick={(e) => { e.stopPropagation(); setFav(!fav) }}
                className={`p-2 rounded-lg transition-all ${fav ? 'text-red-400 bg-red-500/10' : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800'}`}
              >
                <Heart className={`w-4 h-4 ${fav ? 'fill-red-400' : ''}`} />
              </button>
            </div>

            {/* Trust Badge + Match Score Row */}
            <div className="flex items-center gap-2 mb-3">
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-gradient-to-r ${trust.color} text-white shadow-sm`}
                style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}
              >
                {trust.icon} {trust.label}
              </span>
              {freelancer.aiMatchScore && (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-[11px] font-medium border border-cyan-500/20">
                  <Sparkles className="w-3 h-3" /> AI {freelancer.aiMatchScore}%
                </span>
              )}
              <span className="ml-auto flex items-center gap-1 text-xs" style={{ color: freelancer.available ? '#34d399' : '#6b7280' }}>
                <span className={`w-1.5 h-1.5 rounded-full ${freelancer.available ? 'bg-emerald-400 animate-pulse' : 'bg-gray-500'}`} />
                {freelancer.available ? 'Available' : 'Busy'}
              </span>
            </div>

            {/* Info Row */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-3 text-xs text-gray-400">
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {freelancer.location}</span>
              {freelancer.languages && (
                <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> {freelancer.languages.join(', ')}</span>
              )}
              {freelancer.responseTime && (
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {freelancer.responseTime}</span>
              )}
            </div>

            {/* Trust Score Bar */}
            {freelancer.trustScore && (
              <div className="mb-3">
                <div className="flex items-center justify-between text-[10px] text-gray-500 mb-1">
                  <span>Trust Score</span>
                  <span className="text-emerald-400 font-medium">{freelancer.trustScore}%</span>
                </div>
                <div className="h-1 rounded-full bg-gray-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-500"
                    style={{ width: `${freelancer.trustScore}%` }}
                  />
                </div>
              </div>
            )}

            {/* Rate + Success */}
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-xl font-bold text-white">${freelancer.hourlyRate}</span>
                <span className="text-xs text-gray-500"> /hr</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
                  <span className="text-white font-medium">{freelancer.rating}</span>
                  <span>({freelancer.reviewCount})</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-emerald-400">
                  <TrendingUp className="w-3 h-3" />
                  {freelancer.jobSuccessRate}%
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {freelancer.skills.slice(0, 4).map((skill) => (
                <span key={skill} className="px-2 py-1 rounded-md bg-gray-800/80 text-gray-300 text-[11px] font-medium border border-gray-700/50">
                  {skill}
                </span>
              ))}
              {freelancer.skills.length > 4 && (
                <span className="px-2 py-1 rounded-md bg-gray-800/80 text-gray-500 text-[11px] border border-gray-700/50">
                  +{freelancer.skills.length - 4}
                </span>
              )}
            </div>

            {/* AI Assistant Mini Card */}
            <div
              className="mb-3 p-3 rounded-xl border transition-all duration-300 cursor-pointer"
              style={{
                borderColor: hover ? 'rgba(168,85,247,0.3)' : 'rgba(75,85,99,0.3)',
                background: hover ? 'rgba(168,85,247,0.05)' : 'rgba(31,41,55,0.3)',
              }}
              onClick={(e) => { e.stopPropagation(); e.preventDefault(); setAiChatOpen(!aiChatOpen) }}
            >
              <div className="flex items-center gap-3">
                <div className={`relative w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center transition-all duration-500 ${hover ? 'scale-110' : ''}`}
                  style={{ boxShadow: hover ? '0 0 15px rgba(168,85,247,0.4)' : 'none' }}
                >
                  <Bot className="w-4 h-4 text-white" />
                  <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-green-400 border-[2px] border-gray-900">
                    <div className="absolute inset-0 rounded-full animate-ping bg-green-300 opacity-60" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-purple-300">{botName}</p>
                  <p className="text-[10px] text-gray-500">AI Assistant · Active</p>
                </div>
                <div className="flex items-center gap-1">
                  <span className="flex gap-0.5">
                    <span className="w-1 h-1 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1 h-1 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1 h-1 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <a
                href={`/freelancers/${freelancer.id}`}
                className="flex-1 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-semibold hover:opacity-90 transition-all text-center shadow-lg shadow-cyan-500/20"
              >
                <Eye className="w-3.5 h-3.5 inline mr-1" /> View Profile
              </a>
              <button
                onClick={(e) => { e.stopPropagation(); e.preventDefault(); setAiChatOpen(!aiChatOpen) }}
                className="px-3 py-2 rounded-lg bg-purple-600/20 text-purple-300 text-xs font-medium hover:bg-purple-600/30 transition-all border border-purple-500/20"
              >
                <MessageCircle className="w-3.5 h-3.5" />
              </button>
              <button className="px-3 py-2 rounded-lg bg-gray-800 text-gray-400 text-xs font-medium hover:bg-gray-700 hover:text-white transition-all border border-gray-700/50">
                <Bookmark className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Portfolio Preview */}
          <AnimatePresence>
            {showPortfolio && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="border-t border-gray-800 overflow-hidden"
              >
                <div className="p-4 space-y-3">
                  <p className="text-xs font-medium text-gray-400">Recent Projects</p>
                  <div className="grid grid-cols-2 gap-2">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="p-2 rounded-lg bg-gray-800/50 border border-gray-800">
                        <div className="h-12 rounded-md bg-gradient-to-br from-gray-700 to-gray-800 mb-1.5" />
                        <p className="text-[10px] text-gray-400 truncate">Project {i + 1}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Expand Portfolio Button */}
          <button
            onClick={(e) => { e.stopPropagation(); e.preventDefault(); setShowPortfolio(!showPortfolio) }}
            className="w-full py-2 text-[11px] text-gray-500 hover:text-gray-300 border-t border-gray-800/50 transition-colors flex items-center justify-center gap-1"
          >
            {showPortfolio ? 'Hide' : 'Show'} Portfolio
            <ChevronDown className={`w-3 h-3 transition-transform ${showPortfolio ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* AI Chat Modal */}
      <AnimatePresence>
        {aiChatOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setAiChatOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl border border-gray-700 bg-gray-900 shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-gradient-to-r from-purple-600/10 to-pink-600/10">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{botName}</p>
                    <p className="text-xs text-purple-400">{freelancer.name}&apos;s AI Assistant</p>
                  </div>
                </div>
                <button onClick={() => setAiChatOpen(false)} className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="h-72 overflow-y-auto p-4 space-y-3">
                {aiMessages.length === 0 && (
                  <div className="flex gap-2">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div className="max-w-[85%]">
                      <div className="rounded-2xl rounded-tl-sm bg-gray-800 px-3 py-2 text-gray-200">
                        <p className="text-sm">Hi! I'm {botName}. Ask me about {freelancer.name}'s experience, availability, or services!</p>
                      </div>
                    </div>
                  </div>
                )}
                {aiMessages.map((msg, i) => (
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
                    <div className="max-w-[85%]">
                      <div className={`rounded-2xl px-3 py-2 ${msg.role === 'user' ? 'bg-purple-600 text-white rounded-tr-sm' : 'bg-gray-800 text-gray-200 rounded-tl-sm'}`}>
                        <p className="text-sm">{msg.text}</p>
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={(el) => el?.scrollIntoView({ behavior: 'smooth' })} />
              </div>
              <div className="p-4 border-t border-gray-800">
                <form onSubmit={handleAiChat} className="flex gap-2">
                  <input
                    type="text"
                    value={aiInput}
                    onChange={(e) => setAiInput(e.target.value)}
                    placeholder="Ask about their experience..."
                    className="flex-1 px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-purple-500/50"
                  />
                  <button
                    type="submit"
                    disabled={!aiInput.trim()}
                    className="px-3 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-600 text-white text-sm hover:opacity-90 transition-all disabled:opacity-50"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="rounded-2xl border border-gray-800 bg-gray-900/50 animate-pulse p-5">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-14 h-14 rounded-xl bg-gray-800" />
            <div className="flex-1 space-y-2">
              <div className="h-5 bg-gray-800 rounded w-2/3" />
              <div className="h-3 bg-gray-800 rounded w-1/3" />
              <div className="h-3 bg-gray-800 rounded w-1/2" />
            </div>
          </div>
          <div className="flex gap-3 mb-3">
            <div className="h-6 bg-gray-800 rounded-full w-20" />
            <div className="h-6 bg-gray-800 rounded-full w-16" />
          </div>
          <div className="h-3 bg-gray-800 rounded w-full mb-3" />
          <div className="flex gap-2 mb-3">
            {[...Array(3)].map((_, j) => <div key={j} className="h-6 bg-gray-800 rounded w-16" />)}
          </div>
          <div className="h-10 bg-gray-800 rounded-xl mb-2" />
          <div className="flex gap-2">
            <div className="flex-1 h-9 bg-gray-800 rounded-lg" />
            <div className="w-9 h-9 bg-gray-800 rounded-lg" />
            <div className="w-9 h-9 bg-gray-800 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function FreelancersPage() {
  const [search, setSearch] = useState('')
  const [industry, setIndustry] = useState('All')
  const [experience, setExperience] = useState('All')
  const [language, setLanguage] = useState('All')
  const [sortBy, setSortBy] = useState('rating')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [budgetRange, setBudgetRange] = useState<[number, number]>([0, 500])
  const [availabilityOnly, setAvailabilityOnly] = useState(false)
  const [freelancers, setFreelancers] = useState<Freelancer[]>([])

  useEffect(() => {
    fetch('/api/freelancers')
      .then(r => r.json())
      .then(d => { setFreelancers(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filtered = freelancers.filter(f => {
    const q = search.toLowerCase()
    const matchSearch = !q || f.name.toLowerCase().includes(q) || f.title.toLowerCase().includes(q) || f.skills.some(s => s.toLowerCase().includes(q)) || f.username?.toLowerCase().includes(q)
    const matchIndustry = industry === 'All' || f.skills.some(s => s.toLowerCase().includes(industry.toLowerCase().replace(' ', '')))
    const matchExp = experience === 'All' || (experience === 'Expert' && f.completedJobs > 20) || (experience === 'Intermediate' && f.completedJobs > 5) || (experience === 'Beginner')
    const matchLang = language === 'All' || f.languages?.some(l => l.toLowerCase().includes(language.toLowerCase()))
    const matchBudget = f.hourlyRate >= budgetRange[0] && f.hourlyRate <= budgetRange[1]
    const matchAvail = !availabilityOnly || f.available
    return matchSearch && matchIndustry && matchExp && matchLang && matchBudget && matchAvail
  }).sort((a, b) => {
    switch (sortBy) {
      case 'rating': return b.rating - a.rating
      case 'rate_low': return a.hourlyRate - b.hourlyRate
      case 'rate_high': return b.hourlyRate - a.hourlyRate
      case 'success': return b.jobSuccessRate - a.jobSuccessRate
      case 'trust': return (b.trustScore || 0) - (a.trustScore || 0)
      case 'ai_score': return (b.aiMatchScore || 0) - (a.aiMatchScore || 0)
      default: return 0
    }
  })

  return (
    <div className="min-h-screen bg-black">
      {/* Hero */}
      <div className="relative overflow-hidden border-b border-gray-800">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(6,182,212,0.12),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(168,85,247,0.08),transparent_50%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-medium text-cyan-400">AI-Powered Talent Discovery</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3">
              Find Expert <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Freelancers</span>
            </h1>
            <p className="text-gray-400 max-w-2xl">Browse top-rated professionals powered by AI matching. Each profile includes a personal AI assistant for instant answers.</p>
          </motion.div>

          {/* Search */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mt-6">
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search by name, skill, title, or username..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-gray-900/80 border border-gray-800 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 transition-all text-sm"
                />
                {search && (
                  <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`p-3.5 rounded-2xl border transition-all ${
                  showFilters ? 'bg-cyan-600/20 border-cyan-500/50 text-cyan-400' : 'bg-gray-900/80 border-gray-800 text-gray-400 hover:border-gray-700'
                }`}
              >
                <SlidersHorizontal className="w-5 h-5" />
              </button>
              <div className="hidden sm:flex items-center gap-1 p-1 rounded-xl bg-gray-900/80 border border-gray-800">
                <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-gray-800 text-white' : 'text-gray-500 hover:text-white'}`}>
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-gray-800 text-white' : 'text-gray-500 hover:text-white'}`}>
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Filters */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden mt-3"
                >
                  <div className="p-5 rounded-2xl bg-gray-900/80 border border-gray-800 space-y-5">
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                      <div>
                        <label className="text-xs text-gray-500 mb-1.5 block">Industry</label>
                        <select value={industry} onChange={e => setIndustry(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white text-xs focus:outline-none focus:border-cyan-500/50">
                          {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 mb-1.5 block">Experience</label>
                        <select value={experience} onChange={e => setExperience(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white text-xs focus:outline-none focus:border-cyan-500/50">
                          {EXPERIENCE_LEVELS.map(e => <option key={e} value={e}>{e}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 mb-1.5 block">Language</label>
                        <select value={language} onChange={e => setLanguage(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white text-xs focus:outline-none focus:border-cyan-500/50">
                          {LANGUAGES_LIST.map(l => <option key={l} value={l}>{l}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 mb-1.5 block">Sort By</label>
                        <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white text-xs focus:outline-none focus:border-cyan-500/50">
                          <option value="rating">Highest Rated</option>
                          <option value="rate_low">Rate: Low to High</option>
                          <option value="rate_high">Rate: High to Low</option>
                          <option value="success">Success Rate</option>
                          <option value="trust">Trust Score</option>
                          <option value="ai_score">AI Match Score</option>
                        </select>
                      </div>
                      <div className="flex items-end">
                        <label className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-800 border border-gray-700 cursor-pointer hover:border-cyan-500/50 transition-colors w-full">
                          <input type="checkbox" checked={availabilityOnly} onChange={e => setAvailabilityOnly(e.target.checked)} className="accent-cyan-500" />
                          <span className="text-xs text-gray-300">Available only</span>
                        </label>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-2 block">Hourly Rate: ${budgetRange[0]} — ${budgetRange[1]}</label>
                      <div className="flex items-center gap-3">
                        <input type="range" min={0} max={500} value={budgetRange[0]} onChange={e => setBudgetRange([Math.min(parseInt(e.target.value), budgetRange[1]), budgetRange[1]])} className="flex-1 accent-cyan-500 h-1.5" />
                        <input type="range" min={0} max={500} value={budgetRange[1]} onChange={e => setBudgetRange([budgetRange[0], Math.max(parseInt(e.target.value), budgetRange[0])])} className="flex-1 accent-cyan-500 h-1.5" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Quick Chips */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 mt-4">
              {INDUSTRIES.slice(0, 6).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setIndustry(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                    industry === cat
                      ? 'bg-cyan-600/20 text-cyan-400 border border-cyan-500/40'
                      : 'bg-gray-900/50 text-gray-400 border border-gray-800 hover:border-gray-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
              <span className="text-xs text-gray-600 px-1">|</span>
              <button
                onClick={() => setAvailabilityOnly(!availabilityOnly)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  availabilityOnly ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/40' : 'bg-gray-900/50 text-gray-400 border border-gray-800 hover:border-gray-700'
                }`}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block mr-1.5" />
                Available Now
              </button>
            </div>

            {/* Results Count */}
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-gray-500">
                <span className="text-white font-semibold">{filtered.length}</span> expert{filtered.length !== 1 ? 's' : ''} found
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <LoadingSkeleton />
        ) : filtered.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <Search className="w-16 h-16 text-gray-800 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No freelancers found</h3>
            <p className="text-gray-500 text-sm">Try adjusting your search or filters</p>
          </motion.div>
        ) : (
          <motion.div
            layout
            className={
              viewMode === 'grid'
                ? 'grid md:grid-cols-2 xl:grid-cols-3 gap-6'
                : 'space-y-4'
            }
          >
            {filtered.map((freelancer, index) => (
              <FreelancerCard key={freelancer.id} freelancer={freelancer} index={index} />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}
