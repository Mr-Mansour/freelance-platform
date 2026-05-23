'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Briefcase,
  DollarSign,
  Clock,
  MapPin,
  Star,
  TrendingUp,
  ChevronRight,
  Filter,
  Sparkles,
  Shield,
  Calendar,
  Building,
  Users,
  Bookmark,
  BookmarkCheck,
} from 'lucide-react'

type Job = {
  id: string
  title: string
  clientName: string
  clientAvatar: string | null
  budget: string
  budgetType: 'fixed' | 'hourly'
  duration: string
  description: string
  skills: string[]
  proposals: number
  maxProposals: number
  experienceLevel: 'Entry' | 'Intermediate' | 'Expert'
  postedAt: string
  clientRating: number
  clientHires: number
  saved: boolean
}

const EXPERIENCE_LEVELS = ['All Levels', 'Entry', 'Intermediate', 'Expert']

const CATEGORIES = [
  'All', 'Web Development', 'Mobile', 'AI/ML', 'DevOps', 'Data Science', 'Design', 'Writing'
]

export default function JobsPage() {
  const [loading, setLoading] = useState(true)
  const [jobs, setJobs] = useState<Job[]>([])
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedLevel, setSelectedLevel] = useState('All Levels')
  const [showFilters, setShowFilters] = useState(false)
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetch('/api/jobs')
      .then(r => r.json())
      .then(d => { setJobs(d); setSavedJobs(new Set(d.filter((j: Job) => j.saved).map((j: Job) => j.id))); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filteredJobs = jobs.filter(j => {
    const matchesSearch = j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.description.toLowerCase().includes(search.toLowerCase()) ||
      j.skills.some(s => s.toLowerCase().includes(search.toLowerCase()))
    const matchesCategory = selectedCategory === 'All' || j.skills.some(s => s.toLowerCase().includes(selectedCategory.toLowerCase()))
    const matchesLevel = selectedLevel === 'All Levels' || j.experienceLevel === selectedLevel
    return matchesSearch && matchesCategory && matchesLevel
  })

  const toggleSaved = (jobId: string) => {
    setSavedJobs(prev => {
      const next = new Set(prev)
      next.has(jobId) ? next.delete(jobId) : next.add(jobId)
      return next
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black animate-pulse">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="h-8 bg-gray-800 rounded w-1/4 mb-8" />
          <div className="h-12 bg-gray-800 rounded-xl mb-6" />
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => <div key={i} className="h-36 bg-gray-800 rounded-xl" />)}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-bold text-white">Find Work</h1>
          <p className="text-gray-500 text-sm mt-1">Discover projects that match your skills</p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="flex items-center gap-3 mb-6"
        >
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search by title, skill, or keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-900 border border-gray-800 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-3 rounded-xl border transition-all ${
              showFilters ? 'bg-cyan-600/20 border-cyan-500/50 text-cyan-400' : 'bg-gray-900 border-gray-800 text-gray-400 hover:border-gray-700'
            }`}
          >
            <Filter className="w-5 h-5" />
          </button>
        </motion.div>

        {/* Filter Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-6"
            >
              <div className="p-4 rounded-xl bg-gray-900 border border-gray-800 space-y-4">
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Experience Level</label>
                  <div className="flex gap-2">
                    {EXPERIENCE_LEVELS.map((level) => (
                      <button
                        key={level}
                        onClick={() => setSelectedLevel(level)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          selectedLevel === level
                            ? 'bg-cyan-600/20 text-cyan-400 border border-cyan-500/50'
                            : 'bg-gray-800 text-gray-400 border border-gray-700 hover:border-gray-600'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Budget Range</label>
                  <div className="flex gap-2">
                    {['Any', '< $3K', '$3K - $5K', '$5K - $10K', '$10K+'].map((range) => (
                      <button key={range} className="px-3 py-1.5 rounded-lg bg-gray-800 text-gray-400 text-xs border border-gray-700 hover:border-gray-600 transition-all">
                        {range}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Categories */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-2 overflow-x-auto no-scrollbar mb-8 pb-2"
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-cyan-600/20 text-cyan-400 border border-cyan-500/50'
                  : 'bg-gray-900 text-gray-400 border border-gray-800 hover:border-gray-700 hover:text-gray-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-500">
            <span className="text-white font-medium">{filteredJobs.length}</span> jobs found
          </p>
        </div>

        {/* Job List */}
        <div className="space-y-4">
          {filteredJobs.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <Search className="w-16 h-16 text-gray-700 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No jobs found</h3>
              <p className="text-gray-500">Try adjusting your search or filters</p>
            </motion.div>
          ) : (
            filteredJobs.map((job, index) => (
              <motion.a
                key={job.id}
                href={`/jobs/${job.id}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="block p-6 rounded-2xl border border-gray-800 bg-gray-900/30 hover:border-cyan-500/30 transition-all duration-300 group"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-start gap-4 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-lg font-bold flex-shrink-0">
                      {job.clientName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-base font-semibold text-white group-hover:text-cyan-400 transition-colors">{job.title}</h3>
                      <p className="text-sm text-gray-500 mt-0.5">{job.clientName}</p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => { e.preventDefault(); toggleSaved(job.id); }}
                    className="p-2 rounded-lg text-gray-500 hover:text-yellow-400 hover:bg-gray-800 transition-all"
                  >
                    {savedJobs.has(job.id) ? <BookmarkCheck className="w-5 h-5 text-yellow-400 fill-yellow-400" /> : <Bookmark className="w-5 h-5" />}
                  </button>
                </div>

                <p className="text-sm text-gray-400 line-clamp-2 mb-4">{job.description}</p>

                <div className="flex items-center flex-wrap gap-x-5 gap-y-2 text-xs text-gray-500 mb-4">
                  <span className="flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5" />
                    <span className="text-white font-medium">{job.budget}</span>
                    <span className="text-gray-600">({job.budgetType})</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {job.duration}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                    {job.clientRating}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" />
                    {job.proposals}/{job.maxProposals} proposals
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5" />
                    {job.clientHires} hires
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {job.postedAt}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1.5">
                    {job.skills.map((skill) => (
                      <span key={skill} className="px-2 py-1 rounded-md bg-gray-800 text-gray-300 text-xs">
                        {skill}
                      </span>
                    ))}
                    <span className={`px-2 py-1 rounded-md text-xs ${
                      job.experienceLevel === 'Expert' ? 'bg-purple-500/10 text-purple-400' :
                      job.experienceLevel === 'Intermediate' ? 'bg-blue-500/10 text-blue-400' :
                      'bg-gray-800 text-gray-400'
                    }`}>
                      {job.experienceLevel}
                    </span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-gray-400 transition-colors flex-shrink-0" />
                </div>
              </motion.a>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
