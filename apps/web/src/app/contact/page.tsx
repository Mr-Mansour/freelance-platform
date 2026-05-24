'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, MessageCircle, MapPin, Send, Check } from 'lucide-react'

export default function ContactPage() {
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Contact Us</h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">Have a question or need help? We are here for you.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            {sent ? (
              <div className="flex flex-col items-center justify-center h-full p-8 rounded-2xl border border-emerald-500/20 bg-emerald-500/5">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4">
                  <Check className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Message Sent!</h3>
                <p className="text-gray-400 text-center">We will get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1.5">Name</label>
                    <input type="text" required className="w-full px-4 py-2.5 rounded-xl bg-gray-800/50 border border-gray-700 text-white text-sm focus:outline-none focus:border-cyan-500/50" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1.5">Email</label>
                    <input type="email" required className="w-full px-4 py-2.5 rounded-xl bg-gray-800/50 border border-gray-700 text-white text-sm focus:outline-none focus:border-cyan-500/50" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">Subject</label>
                  <input type="text" required className="w-full px-4 py-2.5 rounded-xl bg-gray-800/50 border border-gray-700 text-white text-sm focus:outline-none focus:border-cyan-500/50" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">Message</label>
                  <textarea rows={5} required className="w-full px-4 py-2.5 rounded-xl bg-gray-800/50 border border-gray-700 text-white text-sm focus:outline-none focus:border-cyan-500/50 resize-none" />
                </div>
                <button type="submit" className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-semibold transition-all">
                  <Send className="w-4 h-4" /> Send Message
                </button>
              </form>
            )}
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="space-y-6">
            {[
              { icon: Mail, title: 'Email', info: 'support@cybrion.io', desc: 'We respond within 24 hours' },
              { icon: MessageCircle, title: 'Live Chat', info: 'Available 24/7', desc: 'Chat with our support team' },
              { icon: MapPin, title: 'Location', info: 'Global Remote', desc: 'Operating worldwide' },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-4 p-5 rounded-2xl border border-gray-800 bg-gray-900/50">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">{item.title}</h3>
                  <p className="text-cyan-400 text-sm">{item.info}</p>
                  <p className="text-gray-500 text-xs mt-1">{item.desc}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
