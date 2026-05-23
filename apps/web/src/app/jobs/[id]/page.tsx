'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Briefcase,
  Clock,
  DollarSign,
  MapPin,
  Star,
  Shield,
  ChevronRight,
  Users,
  FileText,
  Send,
  Sparkles,
  Calendar,
  BarChart3,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Bookmark,
  Share2,
  Flag,
  ArrowLeft,
  MessageCircle,
} from 'lucide-react'


export default function JobDetailsPage() {
  const params = useParams()
  const [loading, setLoading] = useState(true)
  const [job, setJob] = useState<any>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!params?.id) return
    fetch(`/api/jobs/${params.id}`)
      .then(r => { if (!r.ok) throw new Error(); return r.json() })
      .then(d => { setJob(d); setLoading(false) })
      .catch(() => { setError(true); setLoading(false) })
  }, [params?.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-black animate-pulse">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="h-8 bg-gray-800 rounded w-1/3 mb-4" />
          <div className="h-4 bg-gray-800 rounded w-1/2 mb-8" />
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2 space-y-4">
              <div className="h-40 bg-gray-800 rounded-xl" />
              <div className="h-20 bg-gray-800 rounded-xl" />
              <div className="h-32 bg-gray-800 rounded-xl" />
            </div>
            <div className="h-96 bg-gray-800 rounded-xl" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg">Job not found</p>
          <a href="/jobs" className="text-cyan-400 text-sm mt-2 inline-block hover:text-cyan-300">Browse jobs</a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <motion.a
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          href="/marketplace"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-300 mb-8 transition-colors"
        >
          <ChevronRight className="w-4 h-4 rotate-180" />
          Back to Jobs
        </motion.a>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Job Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    {job.featured && (
                      <span className="px-2 py-0.5 rounded-full bg-cyan-600/20 text-cyan-400 text-xs font-medium border border-cyan-500/30">
                        Featured
                      </span>
                    )}
                    <span className="px-2 py-0.5 rounded-full bg-emerald-900/50 text-emerald-400 text-xs font-medium border border-emerald-700">
                      {job.status}
                    </span>
                    <span className="text-xs text-gray-500">{job.createdAt}</span>
                  </div>
                  <h1 className="text-3xl font-bold text-white mb-2">{job.title}</h1>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                    <span className="flex items-center gap-1">
                      <Briefcase className="w-4 h-4" />
                      {job.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <BarChart3 className="w-4 h-4" />
                      {job.experienceLevel}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {job.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {job.proposalsCount} proposals
                    </span>
                  </div>
                </div>
              </div>

              {/* Budget Display */}
              <div className="flex items-center gap-2 mb-6">
                <span className="text-3xl font-bold text-white">${job.budgetMin.toLocaleString()}</span>
                <span className="text-2xl text-gray-600">-</span>
                <span className="text-3xl font-bold text-white">${job.budgetMax.toLocaleString()}</span>
                <span className="text-gray-500 text-lg">{job.budgetType === 'FIXED' ? 'Fixed Price' : 'Hourly'}</span>
              </div>

              {/* Skills */}
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill: string) => (
                  <span key={skill} className="px-3 py-1.5 rounded-lg bg-gray-800 text-gray-300 text-sm border border-gray-700">
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-6 rounded-2xl border border-gray-800 bg-gray-900/50"
            >
              <h2 className="text-lg font-semibold text-white mb-4">Project Description</h2>
              <div className="prose prose-invert max-w-none text-gray-400 leading-relaxed whitespace-pre-line">
                {job.description}
              </div>
            </motion.div>

            {/* Proposals (Client View) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-6 rounded-2xl border border-gray-800 bg-gray-900/50"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-white">
                  Proposals
                  <span className="text-sm text-gray-500 font-normal ml-2">({job.proposals.length})</span>
                </h2>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>Average bid:</span>
                  <span className="text-white font-semibold">${job.averageBid.toLocaleString()}</span>
                </div>
              </div>
              <div className="space-y-4">
                {job.proposals.map((proposal: any, i: number) => (
                  <motion.div
                    key={proposal.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="p-4 rounded-xl border border-gray-800 hover:border-gray-700 bg-gray-900/30 transition-all cursor-pointer"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                        {proposal.freelancer.split(' ').map((n: string) => n[0]).join('')}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="text-sm font-semibold text-white">{proposal.freelancer}</h3>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-cyan-400">${proposal.bid.toLocaleString()}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                          <span className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                            {proposal.rating}
                          </span>
                          <span>{proposal.timeline}</span>
                          <span>{proposal.experience}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan-600/10 text-cyan-400 text-xs border border-cyan-500/30">
                            <Sparkles className="w-3 h-3" />
                            AI Match: {proposal.matchScore}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Apply Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              className="sticky top-24 space-y-6"
            >
              <div className="p-6 rounded-2xl border border-gray-800 bg-gray-900/50">
                <div className="space-y-3">
                  <a
                    href={`/proposals/new?jobId=${job.id}`}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-semibold transition-all duration-200 glow-cyan"
                  >
                    <Send className="w-4 h-4" />
                    Submit Proposal
                  </a>
                  <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-700 hover:border-cyan-500/50 text-gray-300 hover:text-white font-medium transition-all duration-200">
                    <MessageCircle className="w-4 h-4" />
                    Ask a Question
                  </button>
                </div>
              </div>

              {/* AI Match (for freelancers) */}
              <div className="p-6 rounded-2xl border border-cyan-500/20 bg-cyan-600/5">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-5 h-5 text-cyan-400" />
                  <span className="text-sm font-semibold text-cyan-400">Your AI Match Score</span>
                </div>
                <div className="flex items-end gap-2 mb-2">
                  <span className="text-4xl font-bold text-white">{job.aiMatch.score}%</span>
                  <span className="text-sm text-emerald-400 mb-1">Strong Match</span>
                </div>
                <p className="text-xs text-gray-500">{job.aiMatch.reasoning}</p>
              </div>

              {/* Client Info */}
              <div className="p-6 rounded-2xl border border-gray-800 bg-gray-900/50">
                <h3 className="text-sm font-semibold text-white mb-4">About the Client</h3>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold">
                    {job.client.name.split(' ').map((n: string) => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{job.client.name}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {job.client.location}
                      </span>
                      {job.client.verified && (
                        <span className="flex items-center gap-1 text-cyan-400">
                          <CheckCircle className="w-3 h-3" />
                          Verified
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-500">Rating</p>
                    <p className="text-white font-semibold flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
                      {job.client.rating}
                      <span className="text-gray-500 font-normal">({job.client.reviewCount})</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Total Spent</p>
                    <p className="text-white font-semibold">${(job.client.totalSpent / 1000).toFixed(0)}K+</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Jobs Posted</p>
                    <p className="text-white font-semibold">{job.client.jobsPosted}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Hire Rate</p>
                    <p className="text-white font-semibold">{job.client.hireRate}%</p>
                  </div>
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
    </div>
  )
}
