'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  SlidersHorizontal,
  Star,
  MapPin,
  Briefcase,
  ChevronDown,
  Grid3X3,
  List,
  Clock,
  TrendingUp,
  Verified,
  Shield,
  Award,
  Sparkles,
  X,
  Filter,
} from 'lucide-react'

const TRUST_LEVELS = {
  ROOKIE: { label: 'Rookie', color: 'bg-gray-500/20 text-gray-400 border-gray-600' },
  VERIFIED: { label: 'Verified', color: 'bg-blue-500/20 text-blue-400 border-blue-600' },
  TRUSTED: { label: 'Trusted', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-600' },
  ELITE: { label: 'Elite', color: 'bg-purple-500/20 text-purple-400 border-purple-600' },
  TITAN: { label: 'Titan', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-600' },
  LEGENDARY: { label: 'Legendary', color: 'bg-cyan-500/20 text-cyan-400 border-cyan-600' },
}

const CATEGORIES = [
  'All', 'Web Development', 'Mobile', 'Design', 'AI/ML', 'DevOps', 'Data Science', 'Writing', 'Marketing'
]

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'rate_low', label: 'Rate: Low to High' },
  { value: 'rate_high', label: 'Rate: High to Low' },
  { value: 'success', label: 'Job Success Rate' },
]

function StarRating({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' }) {
  return (
    <div className="flex items-center gap-1">
      <Star className={`${size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} fill-yellow-500 text-yellow-500`} />
      <span className={`${size === 'sm' ? 'text-xs' : 'text-sm'} font-medium text-white`}>{rating}</span>
      <span className={`${size === 'sm' ? 'text-xs' : 'text-sm'} text-gray-500`}>({size === 'sm' ? '' : ''})</span>
    </div>
  )
}

function TrustBadge({ level }: { level: string }) {
  const trust = TRUST_LEVELS[level as keyof typeof TRUST_LEVELS]
  if (!trust) return null
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${trust.color}`}>
      <Shield className="w-3 h-3" />
      {trust.label}
    </span>
  )
}

interface MarketplaceFreelancer {
  id: string; name: string; title: string; avatar: string | null; hourlyRate: number;
  rating: number; reviewCount: number; trustLevel: string; jobSuccessRate: number;
  location: string; skills: string[]; verifiedBadges: string[]; completedJobs: number;
  totalEarned: number; available: boolean;
}

function FreelancerCard({ freelancer, index }: { freelancer: MarketplaceFreelancer; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group relative p-6 rounded-2xl border border-gray-800 bg-gray-900/50 backdrop-blur-sm hover:border-cyan-500/30 transition-all duration-300 cursor-pointer"
    >
      <div className="flex items-start gap-4 mb-4">
        <div className="relative flex-shrink-0">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-xl font-bold">
            {freelancer.name.split(' ').map((n: string) => n[0]).join('')}
          </div>
          {freelancer.available && (
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-gray-900" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-base font-semibold text-white truncate">{freelancer.name}</h3>
              <p className="text-sm text-gray-400 truncate">{freelancer.title}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <TrustBadge level={freelancer.trustLevel} />
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-4 text-sm">
        <div className="flex items-center gap-1 text-gray-400">
          <MapPin className="w-3.5 h-3.5" />
          <span className="truncate max-w-[120px]">{freelancer.location}</span>
        </div>
        <div className="flex items-center gap-1 text-gray-400">
          <Briefcase className="w-3.5 h-3.5" />
          <span>{freelancer.completedJobs} jobs</span>
        </div>
        <div className="flex items-center gap-1">
          <StarRating rating={freelancer.rating} />
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <div className="text-lg font-bold text-white">${freelancer.hourlyRate}</div>
        <span className="text-sm text-gray-500">/hr</span>
        <div className="ml-auto flex items-center gap-1 text-xs text-emerald-400">
          <TrendingUp className="w-3 h-3" />
          {freelancer.jobSuccessRate}% success
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {freelancer.skills.slice(0, 3).map((skill) => (
          <span key={skill} className="px-2 py-1 rounded-md bg-gray-800 text-gray-300 text-xs">
            {skill}
          </span>
        ))}
        {freelancer.skills.length > 3 && (
          <span className="px-2 py-1 rounded-md bg-gray-800 text-gray-500 text-xs">
            +{freelancer.skills.length - 3}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        {freelancer.verifiedBadges.map((badge) => (
          <span key={badge} className="flex items-center gap-1 text-xs text-cyan-400">
            <Verified className="w-3 h-3" />
            {badge.replace('_', ' ')}
          </span>
        ))}
      </div>

      <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/0 group-hover:ring-cyan-500/20 transition-all duration-300 pointer-events-none" />
    </motion.div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="p-6 rounded-2xl border border-gray-800 bg-gray-900/50 animate-pulse">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-14 h-14 rounded-xl bg-gray-800" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-800 rounded w-3/4" />
              <div className="h-3 bg-gray-800 rounded w-1/2" />
            </div>
          </div>
          <div className="flex gap-4 mb-4">
            <div className="h-3 bg-gray-800 rounded w-1/4" />
            <div className="h-3 bg-gray-800 rounded w-1/4" />
          </div>
          <div className="h-6 bg-gray-800 rounded w-1/3 mb-4" />
          <div className="flex gap-2">
            <div className="h-6 bg-gray-800 rounded w-16" />
            <div className="h-6 bg-gray-800 rounded w-20" />
            <div className="h-6 bg-gray-800 rounded w-14" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function MarketplacePage() {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [sortBy, setSortBy] = useState('newest')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [budgetRange, setBudgetRange] = useState<[number, number]>([0, 500])
  const [freelancers, setFreelancers] = useState<MarketplaceFreelancer[]>([])

  useEffect(() => {
    fetch('/api/freelancers')
      .then(r => r.json())
      .then(d => { setFreelancers(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filteredFreelancers = freelancers.filter((f) => {
    const matchesSearch = f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.title.toLowerCase().includes(search.toLowerCase()) ||
      f.skills.some(s => s.toLowerCase().includes(search.toLowerCase()))
    const matchesCategory = selectedCategory === 'All' || f.skills.some(s => s.toLowerCase().includes(selectedCategory.toLowerCase()))
    const matchesBudget = f.hourlyRate >= budgetRange[0] && f.hourlyRate <= budgetRange[1]
    return matchesSearch && matchesCategory && matchesBudget
  }).sort((a, b) => {
    switch (sortBy) {
      case 'rating': return b.rating - a.rating
      case 'rate_low': return a.hourlyRate - b.hourlyRate
      case 'rate_high': return b.hourlyRate - a.hourlyRate
      case 'success': return b.jobSuccessRate - a.jobSuccessRate
      default: return 0
    }
  })

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl font-bold text-white mb-2">Find Expert Freelancers</h1>
            <p className="text-gray-400">Browse top-rated talent powered by AI matching</p>
          </motion.div>

          {/* Search & Filters */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-6 space-y-4"
          >
            {/* Search Bar */}
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search by name, skill, or title..."
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
              <div className="hidden sm:flex items-center gap-1 p-1 rounded-lg bg-gray-900 border border-gray-800">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-gray-800 text-white' : 'text-gray-500 hover:text-white'}`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-gray-800 text-white' : 'text-gray-500 hover:text-white'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Filter Panel */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 rounded-xl bg-gray-900 border border-gray-800 space-y-4">
                    <div>
                      <label className="text-sm text-gray-400 mb-2 block">Budget Range (per hour)</label>
                      <div className="flex items-center gap-4">
                        <input
                          type="range"
                          min={0}
                          max={500}
                          value={budgetRange[0]}
                          onChange={(e) => setBudgetRange([parseInt(e.target.value), budgetRange[1]])}
                          className="flex-1 accent-cyan-500"
                        />
                        <input
                          type="range"
                          min={0}
                          max={500}
                          value={budgetRange[1]}
                          onChange={(e) => setBudgetRange([budgetRange[0], parseInt(e.target.value)])}
                          className="flex-1 accent-cyan-500"
                        />
                        <span className="text-sm text-gray-300 whitespace-nowrap">${budgetRange[0]} - ${budgetRange[1]}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Categories */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
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
            </div>

            {/* Sort & Results Count */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">
                <span className="text-white font-medium">{filteredFreelancers.length}</span> freelancers found
              </p>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-gray-900 border border-gray-800 text-gray-300 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-cyan-500/50"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <LoadingSkeleton />
        ) : filteredFreelancers.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <Search className="w-16 h-16 text-gray-800 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No freelancers found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </motion.div>
        ) : (
          <div className={viewMode === 'grid'
            ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-4'
          }>
            {filteredFreelancers.map((freelancer, index) => (
              <a key={freelancer.id} href={`/freelancers/${freelancer.id}`}>
                <FreelancerCard freelancer={freelancer} index={index} />
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
