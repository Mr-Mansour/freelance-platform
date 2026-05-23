'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Briefcase,
  Users,
  ChevronRight,
  ChevronLeft,
  Check,
  Camera,
  Upload,
  Loader2,
  Sparkles,
  ArrowRight,
  CheckCircle,
  User as UserIcon,
} from 'lucide-react'

const STEPS = [
  { id: 1, title: 'Your Role', description: 'Are you hiring or looking for work?' },
  { id: 2, title: 'About You', description: 'Tell us a bit about yourself' },
  { id: 3, title: 'Your Skills', description: 'What are you great at?' },
  { id: 4, title: 'Profile Photo', description: 'Add a photo to your profile' },
]

const SKILL_OPTIONS = [
  'React', 'Vue.js', 'Angular', 'Next.js', 'Node.js', 'Python', 'TypeScript',
  'JavaScript', 'PostgreSQL', 'MongoDB', 'AWS', 'Docker', 'Kubernetes',
  'Figma', 'UI Design', 'UX Research', 'Graphic Design', 'Motion Design',
  'iOS', 'Android', 'React Native', 'Flutter',
  'SEO', 'Content Writing', 'Copywriting', 'Social Media',
  'Data Science', 'Machine Learning', 'AI', 'DevOps',
]

export default function OnboardingPage() {
  const [step, setStep] = useState(1)
  const [role, setRole] = useState<'freelancer' | 'client' | null>(null)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    title: '',
    location: '',
    companyName: '',
    companySize: '',
    industry: '',
  })
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [photo, setPhoto] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [completed, setCompleted] = useState(false)

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    )
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    await new Promise(r => setTimeout(r, 2000))
    setIsSubmitting(false)
    setCompleted(true)
  }

  if (completed) {
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
          <h1 className="text-2xl font-bold text-white mb-2">You&apos;re All Set!</h1>
          <p className="text-gray-400 mb-8">
            {role === 'freelancer' ? 'Your freelancer profile is ready. Start applying to jobs!' : 'Your client account is ready. Start posting jobs!'}
          </p>
          <a
            href={role === 'freelancer' ? '/marketplace' : '/post-job'}
            className="block w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-semibold transition-all glow-cyan"
          >
            {role === 'freelancer' ? 'Browse Jobs' : 'Post a Job'}
          </a>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="max-w-2xl w-full mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <span className="text-xl font-bold text-white">Cybrion</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Complete Your Profile</h1>
          <p className="text-gray-500">{STEPS.find(s => s.id === step)?.description}</p>
        </div>

        {/* Steps Indicator */}
        <div className="flex items-center justify-center gap-2 mb-12">
          {STEPS.map((s) => (
            <div key={s.id} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                s.id < step ? 'bg-emerald-600 text-white' :
                s.id === step ? 'bg-cyan-600 text-white ring-2 ring-cyan-500/50' :
                'bg-gray-800 text-gray-600'
              }`}>
                {s.id < step ? <Check className="w-4 h-4" /> : s.id}
              </div>
              {s.id < 4 && (
                <div className={`w-12 h-0.5 transition-colors ${s.id < step ? 'bg-emerald-600' : 'bg-gray-800'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Form Content */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <p className="text-sm text-gray-400 mb-4">Choose how you want to use Cybrion</p>
                <button
                  onClick={() => setRole('freelancer')}
                  className={`w-full p-6 rounded-xl border-2 text-left transition-all ${
                    role === 'freelancer'
                      ? 'border-cyan-500 bg-cyan-600/10'
                      : 'border-gray-800 hover:border-gray-700 bg-gray-900/30'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      role === 'freelancer' ? 'bg-cyan-600/20' : 'bg-gray-800'
                    }`}>
                      <Briefcase className={`w-6 h-6 ${role === 'freelancer' ? 'text-cyan-400' : 'text-gray-500'}`} />
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-white">I&apos;m a Freelancer</p>
                      <p className="text-sm text-gray-500">Find work and get paid for your skills</p>
                    </div>
                  </div>
                </button>
                <button
                  onClick={() => setRole('client')}
                  className={`w-full p-6 rounded-xl border-2 text-left transition-all ${
                    role === 'client'
                      ? 'border-cyan-500 bg-cyan-600/10'
                      : 'border-gray-800 hover:border-gray-700 bg-gray-900/30'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      role === 'client' ? 'bg-cyan-600/20' : 'bg-gray-800'
                    }`}>
                      <Users className={`w-6 h-6 ${role === 'client' ? 'text-cyan-400' : 'text-gray-500'}`} />
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-white">I&apos;m a Client</p>
                      <p className="text-sm text-gray-500">Hire top talent for your projects</p>
                    </div>
                  </div>
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">First Name</label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Last Name</label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50"
                      placeholder="Doe"
                    />
                  </div>
                </div>
                {role === 'freelancer' ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Professional Title</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50"
                      placeholder="e.g. Senior Full-Stack Developer"
                    />
                  </div>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Company Name</label>
                      <input
                        type="text"
                        value={formData.companyName}
                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50"
                        placeholder="Company Inc."
                      />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Company Size</label>
                        <select
                          value={formData.companySize}
                          onChange={(e) => setFormData({ ...formData, companySize: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-gray-300 focus:outline-none focus:border-cyan-500/50"
                        >
                          <option value="">Select size</option>
                          <option value="1-10">1-10 employees</option>
                          <option value="11-50">11-50 employees</option>
                          <option value="51-200">51-200 employees</option>
                          <option value="201-1000">201-1000 employees</option>
                          <option value="1000+">1000+ employees</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Industry</label>
                        <input
                          type="text"
                          value={formData.industry}
                          onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50"
                          placeholder="Technology"
                        />
                      </div>
                    </div>
                  </>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50"
                    placeholder="San Francisco, CA"
                  />
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <p className="text-sm text-gray-400 mb-4">
                  {role === 'freelancer' ? 'Select your top skills (minimum 3)' : 'Select skills you typically hire for'}
                </p>
                <div className="flex flex-wrap gap-2 max-h-64 overflow-y-auto">
                  {SKILL_OPTIONS.map((skill) => (
                    <button
                      key={skill}
                      onClick={() => toggleSkill(skill)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        selectedSkills.includes(skill)
                          ? 'bg-cyan-600/20 text-cyan-400 border border-cyan-500/50'
                          : 'bg-gray-800 text-gray-400 border border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-600 mt-3">
                  {selectedSkills.length} selected
                </p>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="text-center"
              >
                <div className="flex justify-center mb-6">
                  {photo ? (
                    <div className="relative w-32 h-32 rounded-2xl overflow-hidden">
                      <img src={photo} alt="Profile" className="w-full h-full object-cover" />
                      <button
                        onClick={() => setPhoto(null)}
                        className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center text-xs"
                      >
                        X
                      </button>
                    </div>
                  ) : (
                    <div className="w-32 h-32 rounded-2xl bg-gray-800 border-2 border-dashed border-gray-700 flex flex-col items-center justify-center cursor-pointer hover:border-cyan-500/50 transition-colors">
                      <Camera className="w-8 h-8 text-gray-600 mb-2" />
                      <span className="text-xs text-gray-600">Click to upload</span>
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-400">Add a profile photo to build trust with clients</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-800">
            <button
              onClick={() => setStep(Math.max(1, step - 1))}
              disabled={step === 1}
              className="flex items-center gap-1 px-4 py-2.5 rounded-xl text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>

            {step < 4 ? (
              <button
                onClick={() => setStep(step + 1)}
                disabled={
                  (step === 1 && !role) ||
                  (step === 2 && role === 'freelancer' && (!formData.firstName || !formData.title)) ||
                  (step === 2 && role === 'client' && (!formData.firstName || !formData.companyName)) ||
                  (step === 3 && selectedSkills.length < 3)
                }
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Continue
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-medium disabled:opacity-50 transition-all glow-cyan"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Setting up...
                  </>
                ) : (
                  <>
                    Complete Setup
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
