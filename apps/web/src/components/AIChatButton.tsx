'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, X, Send, Loader2, User, CheckCircle, ArrowRight, DollarSign, Star, Briefcase } from 'lucide-react'
import { parseMatchRequest, getTopMatches, type MatchResult } from '@/lib/ai-engine'

export default function AIChatButton() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<MatchResult[] | null>(null)
  const [showResults, setShowResults] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false)
        setShowResults(false)
      }
    }
    if (open) {
      setTimeout(() => window.addEventListener('mousedown', handleClick), 100)
      return () => window.removeEventListener('mousedown', handleClick)
    }
  }, [open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim() || loading) return
    setLoading(true)
    setShowResults(false)

    const request = parseMatchRequest(query)
    const matches = await getTopMatches(request)
    setResults(matches)
    setShowResults(true)
    setLoading(false)
  }

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            ref={panelRef}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 w-[380px] max-w-[calc(100vw-2rem)] z-50 rounded-2xl border border-gray-700 bg-gray-900 shadow-2xl shadow-cyan-500/10 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-gradient-to-r from-cyan-600/10 to-blue-600/10">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">AI Talent Match</p>
                  <p className="text-xs text-gray-400">Find the perfect freelancer</p>
                </div>
              </div>
              <button onClick={() => { setOpen(false); setShowResults(false) }} className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-all">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4">
              {showResults && results ? (
                <div className="space-y-3 max-h-[400px] overflow-y-auto">
                  <p className="text-sm text-gray-300 mb-3">
                    Found <span className="text-cyan-400 font-medium">{results.length}</span> match{results.length !== 1 ? 'es' : ''}:
                  </p>
                  {results.map((result, idx) => (
                    <div key={result.freelancerId} className="rounded-xl border border-cyan-500/20 bg-gray-800/80 p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
                            {result.freelancer.name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2) || 'FL'}
                          </div>
                          <div className="text-left">
                            <p className="text-sm font-medium text-white">{result.freelancer.name}</p>
                            <p className="text-xs text-gray-400">{result.freelancer.title}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-cyan-400">{result.matchScore}%</div>
                          <div className="text-[10px] text-gray-500">match</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-400 mb-2">
                        <span><DollarSign className="w-3 h-3 inline" /> ${result.freelancer.hourlyRate}/hr</span>
                        <span><Star className="w-3 h-3 inline" /> {result.freelancer.rating}</span>
                        <span><Briefcase className="w-3 h-3 inline" /> {result.freelancer.completedJobs}</span>
                      </div>
                      {result.reasons.slice(0, 3).map((r, ri) => (
                        <div key={ri} className="flex items-center gap-1.5 text-xs text-cyan-300">
                          <CheckCircle className="w-3 h-3 flex-shrink-0" />
                          {r}
                        </div>
                      ))}
                      <a
                        href={`/freelancers/${result.freelancerId}`}
                        className="mt-2 inline-flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300"
                      >
                        View Profile <ArrowRight className="w-3 h-3" />
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400 mb-4">
                  Describe your ideal freelancer. Include budget, skills, timeline, and preferences.
                </p>
              )}

              <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="e.g. React dev, $1000 budget..."
                  className="flex-1 px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-cyan-500/50"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading || !query.trim()}
                  className="px-3 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all flex items-center justify-center"
      >
        {open ? <X className="w-6 h-6" /> : <Sparkles className="w-6 h-6" />}
      </motion.button>
    </>
  )
}
