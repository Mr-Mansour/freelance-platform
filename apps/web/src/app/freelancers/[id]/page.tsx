'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Star,
  MapPin,
  Briefcase,
  Clock,
  TrendingUp,
  DollarSign,
  Shield,
  Award,
  CheckCircle,
  MessageCircle,
  ChevronRight,
  Image as ImageIcon,
  BadgeCheck,
  Sparkles,
  GraduationCap,
  Bookmark,
  Share2,
  Flag,
  Bot,
  Send,
  X,
  User,
} from 'lucide-react'

const TRUST_LEVEL_STYLES: Record<string, { label: string; color: string; bg: string; border: string }> = {
  ROOKIE: { label: 'Rookie', color: 'text-gray-400', bg: 'bg-gray-500/20', border: 'border-gray-600' },
  VERIFIED: { label: 'Verified', color: 'text-blue-400', bg: 'bg-blue-500/20', border: 'border-blue-600' },
  TRUSTED: { label: 'Trusted', color: 'text-emerald-400', bg: 'bg-emerald-500/20', border: 'border-emerald-600' },
  ELITE: { label: 'Elite', color: 'text-purple-400', bg: 'bg-purple-500/20', border: 'border-purple-600' },
  TITAN: { label: 'Titan', color: 'text-yellow-400', bg: 'bg-yellow-500/20', border: 'border-yellow-600' },
  LEGENDARY: { label: 'Legendary', color: 'text-cyan-400', bg: 'bg-cyan-500/20', border: 'border-cyan-600' },
}


function StatCard({ icon: Icon, label, value, color }: { icon: any; label: string; value: string | number; color?: string }) {
  return (
    <div className="p-4 rounded-xl bg-gray-900/50 border border-gray-800">
      <div className="flex items-center gap-2 text-gray-500 text-xs mb-2">
        <Icon className="w-3.5 h-3.5" />
        {label}
      </div>
      <p className={`text-lg font-bold ${color || 'text-white'}`}>{value}</p>
    </div>
  )
}

function SkillBar({ name, level }: { name: string; level: number }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-300">{name}</span>
        <span className="text-xs text-gray-500">{level}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-gray-800 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${level}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"
        />
      </div>
    </div>
  )
}

export default function FreelancerProfilePage() {
  const params = useParams()
  const [loading, setLoading] = useState(true)
  const [freelancer, setFreelancer] = useState<any>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!params?.id) return
    fetch(`/api/freelancers/${params.id}`)
      .then(r => { if (!r.ok) throw new Error(); return r.json() })
      .then(d => { setFreelancer(d); setLoading(false) })
      .catch(() => { setError(true); setLoading(false) })
  }, [params?.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-black animate-pulse">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-start gap-8 mb-10">
            <div className="w-24 h-24 rounded-2xl bg-gray-800" />
            <div className="flex-1 space-y-3">
              <div className="h-8 bg-gray-800 rounded w-1/3" />
              <div className="h-5 bg-gray-800 rounded w-1/4" />
              <div className="h-4 bg-gray-800 rounded w-1/2" />
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4 mb-10">
            {[...Array(4)].map((_, i) => <div key={i} className="h-20 bg-gray-800 rounded-xl" />)}
          </div>
          <div className="h-32 bg-gray-800 rounded-xl mb-10" />
          <div className="grid grid-cols-2 gap-4">
            {[...Array(6)].map((_, i) => <div key={i} className="h-10 bg-gray-800 rounded-xl" />)}
          </div>
        </div>
      </div>
    )
  }

  if (error || !freelancer) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg">Freelancer not found</p>
          <a href="/freelancers" className="text-cyan-400 text-sm mt-2 inline-block hover:text-cyan-300">Back to marketplace</a>
        </div>
      </div>
    )
  }

  const trust = TRUST_LEVEL_STYLES[freelancer.trustLevel]

  // AI Bot integration
  const [botChatOpen, setBotChatOpen] = useState(false)
  const [botMessages, setBotMessages] = useState<{ role: string; text: string }[]>([])
  const [botInput, setBotInput] = useState('')
  const freelancerBot = (() => {
    try {
      const bots = JSON.parse(localStorage.getItem('cybrion_ai_bots') || '[]')
      return bots.find((b: any) => b.userId === freelancer.id || b.name.toLowerCase().includes(freelancer.name.split(' ')[0].toLowerCase()))
    } catch { return null }
  })()

  const handleBotChat = (e: React.FormEvent) => {
    e.preventDefault()
    if (!botInput.trim() || !freelancerBot) return
    const userMsg = botInput.trim()
    setBotMessages(prev => [...prev, { role: 'user', text: userMsg }])
    setBotInput('')
    setTimeout(() => {
      const responses: string[] = [
        `Thank you for your interest! Based on my experience as ${freelancer.title}, I believe I can help with your project.`,
        `Great question! I have extensive experience in ${freelancer.skills?.slice(0, 3).join(', ') || 'this area'}. Let me share more details.`,
        `I've completed ${freelancer.completedJobs} similar projects with a ${freelancer.jobSuccessRate}% success rate. I'd be happy to discuss your requirements.`,
        `My rate is $${freelancer.hourlyRate}/hr and I'm ${freelancer.available ? 'available now' : 'currently busy but can discuss timelines'}.`,
      ]
      setBotMessages(prev => [...prev, { role: 'ai', text: responses[Math.floor(Math.random() * responses.length)] }])
    }, 600)
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <motion.a
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          href="/freelancers"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-300 mb-8 transition-colors"
        >
          <ChevronRight className="w-4 h-4 rotate-180" />
          Back to Marketplace
        </motion.a>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col sm:flex-row items-start gap-6"
            >
              <div className="relative">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-3xl font-bold">
                  {freelancer.name.split(' ').map((n: string) => n[0]).join('')}
                </div>
                {freelancer.available && (
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-black" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-white mb-1">{freelancer.name}</h1>
                    <p className="text-lg text-gray-400 mb-3">{freelancer.title}</p>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border ${trust.border} ${trust.bg} ${trust.color}`}>
                        <Shield className="w-4 h-4" />
                        {trust.label}
                      </span>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                        <span className="text-white font-semibold">{freelancer.rating}</span>
                        <span className="text-gray-500">({freelancer.reviewCount} reviews)</span>
                      </div>
                      {freelancer.available ? (
                        <span className="flex items-center gap-1.5 text-sm text-emerald-400">
                          <div className="w-2 h-2 rounded-full bg-emerald-500" />
                          Available Now
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-sm text-gray-500">
                          <div className="w-2 h-2 rounded-full bg-gray-600" />
                          Currently Busy
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Stats Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-3"
            >
              <StatCard icon={Briefcase} label="Completed Jobs" value={freelancer.completedJobs} />
              <StatCard icon={TrendingUp} label="Success Rate" value={`${freelancer.jobSuccessRate}%`} color="text-emerald-400" />
              <StatCard icon={DollarSign} label="Total Earned" value={`$${(freelancer.totalEarned / 1000).toFixed(0)}K`} color="text-cyan-400" />
              <StatCard icon={Clock} label="Response Time" value={freelancer.responseTime} />
            </motion.div>

            {/* Bio */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="p-6 rounded-2xl border border-gray-800 bg-gray-900/50"
            >
              <h2 className="text-lg font-semibold text-white mb-4">About Me</h2>
              <div className="text-gray-400 leading-relaxed space-y-4 whitespace-pre-line">
                {freelancer.bio}
              </div>
            </motion.div>

            {/* Skills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-6 rounded-2xl border border-gray-800 bg-gray-900/50"
            >
              <h2 className="text-lg font-semibold text-white mb-6">Skills &amp; Expertise</h2>
              <div className="grid sm:grid-cols-2 gap-5">
                {freelancer.skills.map((skill: any) => (
                  <SkillBar key={skill.name} name={skill.name} level={skill.level} />
                ))}
              </div>
            </motion.div>

            {/* Portfolio */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="p-6 rounded-2xl border border-gray-800 bg-gray-900/50"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-white">Portfolio</h2>
                <a href="#" className="text-sm text-cyan-400 hover:text-cyan-300">View All</a>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {freelancer.portfolio.map((item: any) => (
                  <div key={item.id} className="group relative aspect-video rounded-xl bg-gray-800 overflow-hidden cursor-pointer">
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-600/10 flex items-center justify-center">
                      <ImageIcon className="w-10 h-10 text-gray-700" />
                    </div>
                    <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                      <p className="text-sm font-medium text-white">{item.title}</p>
                      <p className="text-xs text-gray-400">{item.category}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Reviews */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="p-6 rounded-2xl border border-gray-800 bg-gray-900/50"
            >
              <h2 className="text-lg font-semibold text-white mb-6">Reviews</h2>
              <div className="space-y-6">
                {freelancer.reviews.map((review: any) => (
                  <div key={review.id} className="pb-6 border-b border-gray-800 last:border-0 last:pb-0">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 text-sm font-medium">
                        {review.client.split(' ').map((n: string) => n[0]).join('')}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-white">{review.client}</p>
                          <span className="text-xs text-gray-500">{review.date}</span>
                        </div>
                        <div className="flex items-center gap-0.5 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'fill-yellow-500 text-yellow-500' : 'text-gray-700'}`} />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-400 leading-relaxed">{review.content}</p>
                    <div className="flex flex-wrap gap-3 mt-3">
                      {Object.entries(review.categories).map(([key, val]: [string, any]) => (
                        <span key={key} className="text-xs text-gray-500 capitalize">
                          {key}: <span className="text-gray-300">{val}/5</span>
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Hire Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="sticky top-24 space-y-6"
            >
              <div className="p-6 rounded-2xl border border-gray-800 bg-gray-900/50">
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-white">
                    ${freelancer.hourlyRate}
                    <span className="text-lg text-gray-500 font-normal"> /hr</span>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <button onClick={async () => { try { await fetch('/api/contracts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: `${freelancer.name} - ${freelancer.title}`, clientName: freelancer.name, amount: freelancer.hourlyRate * 40, totalMilestones: 4, startDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }) }); alert('Contract created! Check your Contracts page.') } catch { alert('Failed to create contract') } }} className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-semibold transition-all duration-200">
                    Hire Now
                  </button>
                  <button className="w-full py-3 rounded-xl border border-gray-700 hover:border-cyan-500/50 text-gray-300 hover:text-white font-medium transition-all duration-200">
                    <MessageCircle className="w-4 h-4 inline mr-2" />
                    Send Message
                  </button>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Location</span>
                    <span className="text-gray-300 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-gray-600" />
                      {freelancer.location}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Timezone</span>
                    <span className="text-gray-300">{freelancer.timezone}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Member Since</span>
                    <span className="text-gray-300">{freelancer.memberSince}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Languages</span>
                    <span className="text-gray-300 text-right">{freelancer.languages.join(', ')}</span>
                  </div>
                </div>
              </div>

              {/* AI Match Score */}
              <div className="p-6 rounded-2xl border border-cyan-500/20 bg-cyan-600/5">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-5 h-5 text-cyan-400" />
                  <span className="text-sm font-semibold text-cyan-400">AI Match Score</span>
                </div>
                <div className="flex items-end gap-2 mb-2">
                  <span className="text-4xl font-bold text-white">{freelancer.aiMatchScore}%</span>
                  <span className="text-sm text-emerald-400 mb-1">Excellent Match</span>
                </div>
                <p className="text-xs text-gray-500">
                  Our AI analyzed this freelancer&apos;s skills, experience, and success rate against your project needs.
                </p>
              </div>

              {/* AI Bot Chat */}
              {freelancerBot && (
                <div className="p-6 rounded-2xl border border-purple-500/20 bg-purple-600/5">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-purple-400">{freelancerBot.name}</span>
                      <p className="text-xs text-gray-500">AI Assistant</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mb-3 leading-relaxed">
                    {freelancerBot.welcomeMessage || `Hi! I'm ${freelancerBot.name}, ${freelancer.name}'s AI assistant. Ask me anything!`}
                  </p>
                  <button
                    onClick={() => { setBotChatOpen(true); setBotMessages([{ role: 'ai', text: freelancerBot.welcomeMessage || `Hi! I'm ${freelancerBot.name}. How can I help you?` }]) }}
                    className="w-full py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-600 text-white text-sm font-medium hover:opacity-90 transition-all"
                  >
                    <MessageCircle className="w-4 h-4 inline mr-2" />
                    Chat with AI
                  </button>
                </div>
              )}
              {/* Trust Score */}
              <div className="p-6 rounded-2xl border border-gray-800 bg-gray-900/50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-white">Trust Score</h3>
                  <span className="text-2xl font-bold text-emerald-400">{freelancer.trustScore}</span>
                </div>
                <div className="space-y-2">
                      {Object.entries(freelancer.trustMetrics).map(([key, val]: [string, any]) => (
                    <div key={key} className="flex items-center justify-between text-xs">
                      <span className="text-gray-500 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-1.5 rounded-full bg-gray-800 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500"
                            style={{ width: `${val}%` }}
                          />
                        </div>
                        <span className="text-gray-400 w-7 text-right">{val}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Verification Badges */}
              <div className="p-6 rounded-2xl border border-gray-800 bg-gray-900/50">
                <h3 className="text-sm font-semibold text-white mb-4">Verifications</h3>
                <div className="space-y-3">
                  {freelancer.verificationBadges.map((badge: any) => (
                    <div key={badge.type} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-cyan-600/20 flex items-center justify-center">
                        <BadgeCheck className="w-4 h-4 text-cyan-400" />
                      </div>
                      <span className="text-sm text-gray-300">{badge.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Education & Certificates */}
              <div className="p-6 rounded-2xl border border-gray-800 bg-gray-900/50">
                <h3 className="text-sm font-semibold text-white mb-4">Background</h3>
                <div className="space-y-4">
                  {freelancer.education.map((edu: any) => (
                    <div key={edu.degree} className="flex items-start gap-3">
                      <GraduationCap className="w-4 h-4 text-gray-600 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-300">{edu.degree}</p>
                        <p className="text-xs text-gray-500">{edu.school} · {edu.year}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-800 space-y-3">
                  {freelancer.certificates.map((cert: any) => (
                    <div key={cert.name} className="flex items-start gap-3">
                      <Award className="w-4 h-4 text-gray-600 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-300">{cert.name}</p>
                        <p className="text-xs text-gray-500">{cert.issuer} · {cert.year}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-800 text-gray-400 hover:text-white hover:border-gray-700 transition-all text-sm">
                  <Bookmark className="w-4 h-4" />
                  Save
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-800 text-gray-400 hover:text-white hover:border-gray-700 transition-all text-sm">
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-800 text-gray-400 hover:text-red-400 hover:border-red-900 transition-all text-sm">
                  <Flag className="w-4 h-4" />
                  Report
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* AI Bot Chat Modal */}
      {botChatOpen && freelancerBot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setBotChatOpen(false)}>
          <div className="w-full max-w-md rounded-2xl border border-gray-700 bg-gray-900 shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{freelancerBot.name}</p>
                  <p className="text-xs text-purple-400">{freelancer.name}&apos;s AI Assistant</p>
                </div>
              </div>
              <button onClick={() => setBotChatOpen(false)} className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="h-72 overflow-y-auto p-4 space-y-3">
              {botMessages.map((msg, i) => (
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
                  <div className={`max-w-[80%]`}>
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
              <form onSubmit={handleBotChat} className="flex gap-2">
                <input
                  type="text"
                  value={botInput}
                  onChange={(e) => setBotInput(e.target.value)}
                  placeholder="Ask about services, pricing, availability..."
                  className="flex-1 px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-purple-500/50"
                />
                <button
                  type="submit"
                  disabled={!botInput.trim()}
                  className="px-3 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-600 text-white text-sm hover:opacity-90 transition-all disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
