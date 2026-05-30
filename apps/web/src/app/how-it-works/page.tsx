'use client'

import { motion } from 'framer-motion'
import { Search, UserCheck, CreditCard, MessageCircle, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import LEDLightBar from '@/components/LEDLightBar'

const steps = [
  { icon: Search, title: '1. Post a Job', desc: 'Tell us what you need done. Describe your project and set your budget. Our AI helps match you with the right freelancers.' },
  { icon: UserCheck, title: '2. Choose Freelancers', desc: 'Review proposals from qualified freelancers. Check their profiles, portfolios, and ratings to find the perfect match.' },
  { icon: CreditCard, title: '3. Pay Securely', desc: 'Use our milestone-based escrow system. Funds are released only when you are satisfied with the work delivered.' },
  { icon: MessageCircle, title: '4. Collaborate & Deliver', desc: 'Communicate in real-time, share files, and track progress. When done, review and approve the work.' },
]

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="mb-6">
          <LEDLightBar color="purple" />
        </div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">How It Works</h1>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto">Get started in four simple steps. Whether you are hiring or freelancing, Cybrion makes it easy.</p>
        </motion.div>

        <div className="relative">
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-500/40 via-cyan-500/20 to-transparent -translate-x-1/2" />
          {steps.map((step, i) => (
            <motion.div key={step.title} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15 }}
              className={`flex items-start gap-8 mb-16 last:mb-0 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
            >
              <div className={`flex-1 ${i % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                <div className={`p-6 rounded-2xl border border-gray-800 bg-gray-900/50 ${i % 2 === 0 ? 'md:mr-8' : 'md:ml-8'}`}>
                  <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{step.desc}</p>
                </div>
              </div>
              <div className="hidden md:flex flex-col items-center flex-shrink-0">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 relative z-10">
                  <step.icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="flex-1 hidden md:block" />
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="text-center mt-12">
          <p className="text-gray-400 mb-6">Ready to get started?</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/post-job" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-semibold transition-all">
              Hire a Freelancer <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/sign-up?role=freelancer" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border border-gray-700 hover:border-cyan-500/50 text-gray-300 hover:text-white font-semibold transition-all">
              Start Freelancing <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
