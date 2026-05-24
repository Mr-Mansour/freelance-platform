'use client'

import { motion } from 'framer-motion'
import { Users, Target, Eye, Shield, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const values = [
  { icon: Target, title: 'Our Mission', desc: 'To empower businesses and freelancers worldwide by providing an AI-powered platform that makes hiring and collaboration seamless, efficient, and transparent.' },
  { icon: Eye, title: 'Our Vision', desc: 'A world where anyone, anywhere, can build their career or business by connecting with the right talent and opportunities through intelligent matching.' },
  { icon: Shield, title: 'Trust & Safety', desc: 'We prioritize security and fairness with milestone-based payments, verified profiles, and a dedicated dispute resolution system.' },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">About Cybrion</h1>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto">The next-generation freelance marketplace powered by artificial intelligence.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-16">
          <p className="text-gray-300 leading-relaxed mb-6">Cybrion was built to solve the biggest challenges in freelancing — finding the right match, communicating effectively, and getting paid fairly. Our platform uses AI to match talent with projects, provide real-time collaboration tools, and ensure secure payments through an escrow system.</p>
          <p className="text-gray-300 leading-relaxed">Whether you are a business looking for top-tier talent or a freelancer seeking your next opportunity, Cybrion provides the tools, security, and community to succeed.</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {values.map((v, i) => (
            <motion.div key={v.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.1 }}
              className="p-6 rounded-2xl border border-gray-800 bg-gray-900/50"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mb-4">
                <v.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{v.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{v.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="text-center">
          <Link href="/sign-up" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-semibold transition-all">
            Get Started <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
