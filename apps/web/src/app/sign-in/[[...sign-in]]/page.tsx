'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, User, Lock, Eye, EyeOff, ArrowRight, X, KeyRound, Mail } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'

export default function SignInPage() {
  const router = useRouter()
  const { signIn, forgotPassword } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showForgot, setShowForgot] = useState(false)
  const [forgotUser, setForgotUser] = useState('')
  const [foundPass, setFoundPass] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!username.trim() || !password.trim()) {
      setError('Please fill in all fields')
      return
    }
    setLoading(true)
    const ok = await signIn(username, password)
    setLoading(false)
    if (ok) {
      setTimeout(() => {
        const stored = localStorage.getItem('cybrion_user')
        if (stored) {
          const u = JSON.parse(stored)
          router.push(u.role === 'owner' || u.role === 'admin' ? '/admin' : '/dashboard')
        } else {
          router.push('/dashboard')
        }
      }, 100)
    } else {
      setError('Invalid username or password')
    }
  }

  const handleForgot = (e: React.FormEvent) => {
    e.preventDefault()
    const pass = forgotPassword(forgotUser)
    setFoundPass(pass)
  }

  return (
    <div className="min-h-screen -mt-16 lg:-mt-20 flex items-center justify-center bg-black">
      <div className="absolute inset-0 bg-mesh" />
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-30" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md mx-auto px-4"
      >
        <div className="p-8 rounded-2xl border border-gray-800 bg-gray-900/50 backdrop-blur-sm">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-cyan-500/20">
              <span className="text-white text-xl font-bold">C</span>
            </div>
            <h1 className="text-2xl font-bold text-white">Welcome back</h1>
            <p className="text-gray-500 mt-2 text-sm">Sign in to your Cybrion account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-800/50 border border-gray-700 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm text-gray-400">Password</label>
                <button type="button" onClick={() => { setShowForgot(true); setForgotUser(username); setFoundPass(null) }}
                  className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors">
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-gray-800/50 border border-gray-700 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-400 bg-red-500/10 rounded-lg px-3 py-2">{error}</p>
            )}

            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold transition-all shadow-lg shadow-cyan-500/20 disabled:opacity-50">
              {loading ? (
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
              ) : (
                <><span>Sign In</span><ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Don&apos;t have an account?{' '}
              <a href="/sign-up" className="text-cyan-400 hover:text-cyan-300 transition-colors font-medium">Sign up</a>
            </p>
          </div>

          <div className="mt-6 p-4 rounded-xl bg-gray-800/30 border border-gray-700/50">
            <p className="text-xs text-gray-500 text-center flex items-center justify-center gap-1.5">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              Owner: Qan / TachOWNER159357
            </p>
          </div>
        </div>
      </motion.div>

      {/* Forgot Password Modal */}
      <AnimatePresence>
        {showForgot && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowForgot(false)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-sm p-6 rounded-2xl border border-gray-800 bg-gray-900 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-cyan-400" /> Forgot Password
                </h3>
                <button onClick={() => setShowForgot(false)} className="text-gray-500 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {foundPass === null ? (
                <form onSubmit={handleForgot} className="space-y-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Enter your username</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                      <input type="text" value={forgotUser} onChange={e => setForgotUser(e.target.value)}
                        placeholder="Username"
                        className="w-full pl-10 pr-4 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-cyan-500/50" required />
                    </div>
                  </div>
                  <button type="submit"
                    className="w-full py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-medium transition-all">
                    Recover Password
                  </button>
                  <p className="text-[10px] text-gray-600 text-center">If the username exists, your password will be shown below.</p>
                </form>
              ) : (
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <p className="text-xs text-emerald-400 mb-1">Your password is:</p>
                    <p className="text-lg font-bold text-white text-center tracking-wide">{foundPass}</p>
                  </div>
                  <button onClick={() => { setShowForgot(false); setPassword(foundPass) }}
                    className="w-full py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-medium transition-all">
                    Auto-fill & Sign In
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
