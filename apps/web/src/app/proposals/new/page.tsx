'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Send,
  Sparkles,
  FileText,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Loader2,
  Paperclip,
  X,
  Zap,
  Wand2,
} from 'lucide-react'

export default function NewProposalPage() {
  const [bidAmount, setBidAmount] = useState('')
  const [duration, setDuration] = useState('')
  const [coverLetter, setCoverLetter] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [attachedFiles, setAttachedFiles] = useState<{ name: string; url: string; type: string }[]>([])
  const [uploading, setUploading] = useState(false)
  const [aiGenerated, setAiGenerated] = useState(false)

  const handleAiGenerate = async () => {
    setIsGenerating(true)
    // Simulate AI generation
    await new Promise(r => setTimeout(r, 1500))
    setCoverLetter(`Dear Hiring Manager,

I've carefully reviewed your project requirements and I'm confident that my extensive experience in full-stack development makes me the ideal candidate for this position.

With over 8 years of experience building scalable SaaS platforms, I've delivered 80+ successful projects using React, Node.js, TypeScript, and PostgreSQL. I've built multiple analytics dashboards with real-time data visualization, user authentication, and complex API integrations.

Key strengths I bring to this project:
• Deep expertise in React/Next.js with TypeScript
• Strong Node.js/NestJS backend development
• Experience with real-time data visualization (D3.js, Chart.js)
• Cloud architecture on AWS/GCP
• Clean, maintainable code with comprehensive testing

I typically deliver projects 20% faster than estimated while maintaining high quality standards. I'd love to discuss your specific requirements in more detail.

Best regards,
Alex Chen`)
    setAiGenerated(true)
    setIsGenerating(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await fetch('/api/proposals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bidAmount, duration, coverLetter }),
      })
    } catch (err) { console.error(err) }
    setSubmitted(true)
    setIsSubmitting(false)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md mx-auto px-4"
        >
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-emerald-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Proposal Submitted!</h1>
          <p className="text-gray-400 mb-8">Your proposal has been sent to the client. You&apos;ll be notified when they respond.</p>
          <div className="space-y-3">
            <a
              href="/dashboard"
              className="block w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-semibold transition-all"
            >
              Go to Dashboard
            </a>
            <a
              href="/marketplace"
              className="block w-full py-3 rounded-xl border border-gray-700 text-gray-300 hover:text-white transition-all"
            >
              Browse More Jobs
            </a>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <motion.a
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          href="/jobs/1"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-300 mb-8 transition-colors"
        >
          <ChevronRight className="w-4 h-4 rotate-180" />
          Back to Job
        </motion.a>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-white mb-2">Submit a Proposal</h1>
          <p className="text-gray-400">Tell the client why you&apos;re the perfect fit for this project</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 mt-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Job Summary */}
              <div className="p-4 rounded-xl bg-gray-900/30 border border-gray-800">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Applying to</p>
                <p className="text-white font-semibold">Build a Full-Stack SaaS Analytics Dashboard</p>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5" />
                    $5,000 - $10,000
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    2-3 months
                  </span>
                </div>
              </div>

              {/* Bid Amount & Duration */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Your Bid Amount *</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      placeholder="5000"
                      required
                      className="w-full pl-8 pr-4 py-3 rounded-xl bg-gray-900 border border-gray-800 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/50"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Estimated Duration *</label>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="e.g. 10 weeks"
                    required
                    className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-800 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/50"
                  />
                </div>
              </div>

              {/* Cover Letter */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-300">Cover Letter *</label>
                  <button
                    type="button"
                    onClick={handleAiGenerate}
                    disabled={isGenerating}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600/10 text-cyan-400 text-xs font-medium hover:bg-cyan-600/20 transition-all border border-cyan-500/30 disabled:opacity-50"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-3.5 h-3.5" />
                        Generate with AI
                      </>
                    )}
                  </button>
                </div>
                <textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  rows={14}
                  required
                  placeholder="Introduce yourself and explain why you're the best fit for this project..."
                  className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-800 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 resize-y"
                />
                {aiGenerated && (
                  <div className="flex items-center gap-1.5 mt-2 text-xs text-emerald-400">
                    <Sparkles className="w-3.5 h-3.5" />
                    AI-generated proposal. Review and customize before submitting.
                  </div>
                )}
              </div>

              {/* File Attachments */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Attachments (Optional)</label>
                {attachedFiles.length > 0 && (
                  <div className="space-y-2 mb-3">
                    {attachedFiles.map((f, i) => (
                      <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-gray-800/50 border border-gray-700">
                        <Paperclip className="w-4 h-4 text-cyan-400" />
                        <span className="text-sm text-gray-300 flex-1 truncate">{f.name}</span>
                        <button onClick={() => setAttachedFiles(prev => prev.filter((_, j) => j !== i))}
                          className="text-gray-500 hover:text-red-400 transition-colors">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <label className="border-2 border-dashed border-gray-800 rounded-xl p-8 text-center hover:border-gray-700 transition-colors cursor-pointer block">
                  <input type="file" className="hidden" onChange={async (e) => {
                    const file = e.target.files?.[0]
                    if (!file) return
                    setUploading(true)
                    const formData = new FormData()
                    formData.append('file', file)
                    try {
                      const res = await fetch('/api/upload', { method: 'POST', body: formData })
                      const data = await res.json()
                      setAttachedFiles(prev => [...prev, { name: data.name, url: data.url, type: data.type }])
                    } catch {}
                    setUploading(false)
                    e.target.value = ''
                  }} />
                  {uploading ? (
                    <Loader2 className="w-8 h-8 text-gray-600 mx-auto mb-2 animate-spin" />
                  ) : (
                    <Paperclip className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                  )}
                  <p className="text-sm text-gray-500">{uploading ? 'Uploading...' : 'Drop files here or click to upload'}</p>
                  <p className="text-xs text-gray-600 mt-1">PDF, images, zip files (max 10MB)</p>
                </label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={!bidAmount || !coverLetter || isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-semibold transition-all duration-200 glow-cyan disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Submitting Proposal...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Submit Proposal
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Sidebar Tips */}
          <div className="space-y-6">
            <div className="p-6 rounded-2xl border border-gray-800 bg-gray-900/50">
              <h3 className="text-sm font-semibold text-white mb-4">Proposal Tips</h3>
              <ul className="space-y-3">
                {[
                  { icon: Zap, text: 'Be specific about your relevant experience' },
                  { icon: FileText, text: 'Reference similar projects you\'ve completed' },
                  { icon: Clock, text: 'Set a realistic timeline' },
                  { icon: DollarSign, text: 'Price competitively based on scope' },
                ].map((tip) => (
                  <li key={tip.text} className="flex items-start gap-2 text-sm text-gray-400">
                    <tip.icon className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                    {tip.text}
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-6 rounded-2xl border border-cyan-500/20 bg-cyan-600/5">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                <span className="text-sm font-semibold text-cyan-400">AI Proposal Generator</span>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                Our AI analyzes the job description and your profile to generate a tailored proposal. 
                It highlights your relevant skills and experience to maximize your chance of getting hired.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
