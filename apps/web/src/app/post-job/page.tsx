'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, ChevronRight, Loader2, CheckCircle, Sparkles, Wand2 } from 'lucide-react'

export default function PostJobPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'Web Development',
    skills: '',
    budgetType: 'FIXED',
    budgetMin: '',
    budgetMax: '',
    experienceLevel: 'INTERMEDIATE',
    duration: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Failed to post job')
    } catch (err) {
      console.error(err)
    }
    setIsSubmitting(false)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-md mx-auto px-4">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-emerald-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Job Posted!</h1>
          <p className="text-gray-400 mb-8">Your project is now live. AI is matching freelancers to your job.</p>
          <a href="/dashboard" className="block w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-semibold transition-all glow-cyan">Go to Dashboard</a>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-white mb-2">Post a Job</h1>
          <p className="text-gray-400 mb-8">Describe your project and let AI find the perfect freelancer</p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Job Title *</label>
            <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required
              className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-800 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/50"
              placeholder="e.g. Build a Full-Stack SaaS Dashboard" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Description *</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required rows={8}
              className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-800 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 resize-y"
              placeholder="Describe your project in detail..." />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-800 text-gray-300 focus:outline-none focus:border-cyan-500/50">
                {['Web Development', 'Mobile Development', 'UI/UX Design', 'Data Science', 'DevOps & Cloud', 'Writing', 'Marketing', 'Video & Animation'].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Experience Level</label>
              <select value={form.experienceLevel} onChange={(e) => setForm({ ...form, experienceLevel: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-800 text-gray-300 focus:outline-none focus:border-cyan-500/50">
                <option value="ENTRY">Entry Level</option>
                <option value="INTERMEDIATE">Intermediate</option>
                <option value="EXPERT">Expert</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Required Skills (comma separated)</label>
            <input type="text" value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-800 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/50"
              placeholder="React, Node.js, TypeScript" />
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Budget Type</label>
              <select value={form.budgetType} onChange={(e) => setForm({ ...form, budgetType: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-800 text-gray-300 focus:outline-none focus:border-cyan-500/50">
                <option value="FIXED">Fixed Price</option>
                <option value="HOURLY">Hourly</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Min Budget</label>
              <input type="number" value={form.budgetMin} onChange={(e) => setForm({ ...form, budgetMin: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-800 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/50"
                placeholder="5000" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Max Budget</label>
              <input type="number" value={form.budgetMax} onChange={(e) => setForm({ ...form, budgetMax: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-800 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/50"
                placeholder="10000" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Estimated Duration</label>
            <input type="text" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-800 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/50"
              placeholder="2-3 months" />
          </div>

          <button type="submit" disabled={!form.title || !form.description || isSubmitting}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-semibold transition-all glow-cyan disabled:opacity-50">
            {isSubmitting ? <><Loader2 className="w-5 h-5 animate-spin" /> Posting Job...</> : <><Send className="w-5 h-5" /> Post Job</>}
          </button>
        </form>
      </div>
    </div>
  )
}
