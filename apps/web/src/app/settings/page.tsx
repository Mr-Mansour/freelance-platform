'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  User,
  Shield,
  Bell,
  CreditCard,
  Palette,
  Globe,
  Key,
  ChevronRight,
  Save,
  Loader2,
  CheckCircle,
  Camera,
  X,
  Eye,
  EyeOff,
  Smartphone,
  Mail,
  Lock,
  LogOut,
  AlertTriangle,
} from 'lucide-react'

type Tab = 'profile' | 'notifications' | 'security' | 'payments' | 'appearance'

const TABS: { id: Tab; label: string; icon: typeof User }[] = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'payments', label: 'Payments', icon: CreditCard },
  { id: 'appearance', label: 'Appearance', icon: Palette },
]

export default function SettingsPage() {
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<Tab>('profile')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [showMobileTabs, setShowMobileTabs] = useState(false)

  // Profile form state
  const [name, setName] = useState('Alex Chen')
  const [title, setTitle] = useState('Senior Full-Stack Developer')
  const [bio, setBio] = useState('Passionate full-stack developer with 8+ years of experience building scalable SaaS platforms. I specialize in React, Node.js, TypeScript, and cloud architecture.')
  const [location, setLocation] = useState('San Francisco, CA')
  const [hourlyRate, setHourlyRate] = useState('85')
  const [email, setEmail] = useState('alex@example.com')
  const [website, setWebsite] = useState('https://alexchen.dev')

  // Notification settings
  const [notifSettings, setNotifSettings] = useState({
    proposals: true,
    messages: true,
    milestones: true,
    payments: true,
    reviews: true,
    marketing: false,
  })

  // Security
  const [showPassword, setShowPassword] = useState(false)
  const [twoFactor, setTwoFactor] = useState(false)

  useEffect(() => {
    fetch('/api/settings/profile')
      .then(r => r.json())
      .then(d => {
        setName(d.name)
        setTitle(d.title)
        setBio(d.bio)
        setLocation(d.location)
        setHourlyRate(String(d.hourlyRate))
        setEmail(d.email)
        setWebsite(d.website)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    setSaving(true)
    await fetch('/api/settings/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, title, bio, location, hourlyRate: Number(hourlyRate), email, website }),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black animate-pulse">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="h-8 bg-gray-800 rounded w-1/4 mb-8" />
          <div className="flex gap-8">
            <div className="w-56 space-y-2">
              {[...Array(5)].map((_, i) => <div key={i} className="h-10 bg-gray-800 rounded-lg" />)}
            </div>
            <div className="flex-1 space-y-4">
              <div className="h-10 bg-gray-800 rounded w-1/3" />
              <div className="h-24 bg-gray-800 rounded-xl" />
              <div className="h-10 bg-gray-800 rounded w-1/2" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            {/* Avatar */}
            <div className="flex items-center gap-6">
              <div className="relative group">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-2xl font-bold">
                  AC
                </div>
                <button className="absolute inset-0 rounded-2xl bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="w-6 h-6 text-white" />
                </button>
              </div>
              <div>
                <button className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-sm text-white transition-colors">
                  Change Photo
                </button>
                <p className="text-xs text-gray-500 mt-1">JPG, PNG or WebP. Max 2MB.</p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-gray-800 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/50" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Professional Title</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-gray-800 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/50" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-gray-800 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/50" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
                <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-gray-800 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/50" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Hourly Rate ($/hr)</label>
                <input type="number" value={hourlyRate} onChange={(e) => setHourlyRate(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-gray-800 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/50" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Website</label>
                <input type="url" value={website} onChange={(e) => setWebsite(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-gray-800 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/50" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
              <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={4} className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-gray-800 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 resize-y" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">Skills</label>
              <div className="flex flex-wrap gap-2">
                {['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'AWS', 'Docker', 'GraphQL', 'Next.js', 'Tailwind CSS'].map((skill) => (
                  <span key={skill} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-800 border border-gray-700 text-sm text-gray-300">
                    {skill}
                    <button className="text-gray-600 hover:text-gray-400">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                <button className="px-3 py-1.5 rounded-lg border border-dashed border-gray-700 text-sm text-gray-500 hover:text-gray-300 hover:border-gray-600 transition-colors">
                  + Add Skill
                </button>
              </div>
            </div>
          </div>
        )

      case 'notifications':
        return (
          <div className="space-y-6">
            <p className="text-sm text-gray-500">Choose what notifications you want to receive</p>
            {[
              { key: 'proposals', label: 'Proposal Updates', desc: 'When a client views or responds to your proposal' },
              { key: 'messages', label: 'New Messages', desc: 'When someone sends you a message' },
              { key: 'milestones', label: 'Milestone Updates', desc: 'When a milestone is approved, completed, or needs review' },
              { key: 'payments', label: 'Payment Notifications', desc: 'When you receive a payment or escrow is funded' },
              { key: 'reviews', label: 'Reviews & Ratings', desc: 'When you receive a new review or rating' },
              { key: 'marketing', label: 'Marketing & Offers', desc: 'Tips, promotions, and platform updates' },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between p-4 rounded-xl border border-gray-800 bg-gray-900/30">
                <div>
                  <p className="text-sm font-medium text-white">{item.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                </div>
                <button
                  onClick={() => setNotifSettings(prev => ({ ...prev, [item.key]: !prev[item.key as keyof typeof prev] }))}
                  className={`relative w-11 h-6 rounded-full transition-colors ${
                    notifSettings[item.key as keyof typeof notifSettings] ? 'bg-cyan-600' : 'bg-gray-700'
                  }`}
                >
                  <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                    notifSettings[item.key as keyof typeof notifSettings] ? 'translate-x-[22px]' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>
            ))}
          </div>
        )

      case 'security':
        return (
          <div className="space-y-6">
            <div className="p-5 rounded-xl border border-gray-800 bg-gray-900/30">
              <h3 className="text-sm font-semibold text-white mb-4">Change Password</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Current Password</label>
                  <div className="relative">
                    <input type={showPassword ? 'text' : 'password'} placeholder="Enter current password" className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-gray-800 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 pr-10" />
                    <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">New Password</label>
                  <input type="password" placeholder="Enter new password" className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-gray-800 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/50" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Confirm New Password</label>
                  <input type="password" placeholder="Confirm new password" className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-gray-800 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/50" />
                </div>
              </div>
            </div>

            <div className="p-5 rounded-xl border border-gray-800 bg-gray-900/30">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white">Two-Factor Authentication</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Add an extra layer of security to your account</p>
                </div>
                <button
                  onClick={() => setTwoFactor(!twoFactor)}
                  className={`relative w-11 h-6 rounded-full transition-colors ${
                    twoFactor ? 'bg-cyan-600' : 'bg-gray-700'
                  }`}
                >
                  <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                    twoFactor ? 'translate-x-[22px]' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>
              {twoFactor && (
                <div className="mt-4 p-4 rounded-lg bg-gray-800/50 border border-gray-700">
                  <p className="text-xs text-gray-400">Two-factor authentication is enabled. You&apos;ll be asked for a verification code when signing in from a new device.</p>
                </div>
              )}
            </div>

            <div className="p-5 rounded-xl border border-gray-800 bg-gray-900/30">
              <h3 className="text-sm font-semibold text-white mb-3">Active Sessions</h3>
              <div className="space-y-3">
                {[
                  { device: 'Chrome on Windows', location: 'San Francisco, CA', active: true },
                  { device: 'Safari on iPhone', location: 'San Francisco, CA', active: false },
                ].map((session) => (
                  <div key={session.device} className="flex items-center justify-between p-3 rounded-lg bg-gray-800/30">
                    <div className="flex items-center gap-3">
                      <Smartphone className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-white">{session.device}</p>
                        <p className="text-xs text-gray-500">{session.location}</p>
                      </div>
                    </div>
                    {session.active ? (
                      <span className="text-xs text-emerald-400">Active now</span>
                    ) : (
                      <button className="text-xs text-gray-500 hover:text-red-400 transition-colors">Revoke</button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case 'payments':
        return (
          <div className="space-y-6">
            <div className="p-5 rounded-xl border border-gray-800 bg-gray-900/30">
              <h3 className="text-sm font-semibold text-white mb-4">Payment Methods</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 rounded-lg border border-gray-800 bg-gray-800/30">
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-cyan-400" />
                    <div>
                      <p className="text-sm font-medium text-white">Visa ending in 4242</p>
                      <p className="text-xs text-gray-500">Expires 12/2027</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs">Default</span>
                </div>
                <button className="w-full p-3 rounded-lg border border-dashed border-gray-700 text-sm text-gray-500 hover:text-gray-300 hover:border-gray-600 transition-colors">
                  + Add Payment Method
                </button>
              </div>
            </div>

            <div className="p-5 rounded-xl border border-gray-800 bg-gray-900/30">
              <h3 className="text-sm font-semibold text-white mb-4">Payout Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Preferred Payout Method</label>
                  <select className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-gray-800 text-white focus:outline-none focus:border-cyan-500/50">
                    <option>Bank Transfer (ACH)</option>
                    <option>PayPal</option>
                    <option>Wire Transfer</option>
                  </select>
                </div>
                <div className="p-4 rounded-lg bg-gray-800/50 border border-gray-700 flex items-start gap-3">
                  <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-gray-400">Payouts are processed within 5 business days after milestone approval. A 2.5% processing fee applies.</p>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-xl border border-gray-800 bg-gray-900/30">
              <h3 className="text-sm font-semibold text-white mb-3">Payout History</h3>
              <div className="space-y-2">
                {[
                  { amount: 2500, date: 'Mar 5, 2026', status: 'Completed', project: 'SaaS Analytics Dashboard' },
                  { amount: 1800, date: 'Feb 20, 2026', status: 'Completed', project: 'E-Commerce Platform' },
                  { amount: 3500, date: 'Feb 5, 2026', status: 'Completed', project: 'Mobile Banking App' },
                ].map((payout) => (
                  <div key={payout.date} className="flex items-center justify-between p-3 rounded-lg bg-gray-800/30">
                    <div>
                      <p className="text-sm text-white font-medium">${payout.amount.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">{payout.project}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-emerald-400">{payout.status}</p>
                      <p className="text-xs text-gray-600">{payout.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case 'appearance':
        return (
          <div className="space-y-6">
            <div className="p-5 rounded-xl border border-gray-800 bg-gray-900/30">
              <h3 className="text-sm font-semibold text-white mb-4">Theme</h3>
              <div className="grid grid-cols-2 gap-4">
                <button className="p-4 rounded-xl border-2 border-cyan-500/50 bg-gray-900 text-left">
                  <div className="w-full h-20 rounded-lg bg-black border border-gray-800 mb-3">
                    <div className="flex gap-1 p-2">
                      <div className="w-2 h-2 rounded-full bg-gray-700" />
                      <div className="w-2 h-2 rounded-full bg-gray-700" />
                      <div className="w-2 h-2 rounded-full bg-gray-700" />
                    </div>
                    <div className="flex gap-2 px-2">
                      <div className="w-8 h-4 rounded bg-gray-800" />
                      <div className="w-8 h-4 rounded bg-gray-800" />
                    </div>
                    <div className="mt-2 px-2">
                      <div className="w-16 h-2 rounded bg-gray-800" />
                    </div>
                  </div>
                  <p className="text-sm font-medium text-white">Dark Mode</p>
                  <p className="text-xs text-gray-500">Current theme</p>
                </button>
                <button className="p-4 rounded-xl border border-gray-800 bg-gray-900/30 text-left opacity-50 cursor-not-allowed">
                  <div className="w-full h-20 rounded-lg bg-white border border-gray-200 mb-3">
                    <div className="flex gap-1 p-2">
                      <div className="w-2 h-2 rounded-full bg-gray-300" />
                      <div className="w-2 h-2 rounded-full bg-gray-300" />
                      <div className="w-2 h-2 rounded-full bg-gray-300" />
                    </div>
                    <div className="flex gap-2 px-2">
                      <div className="w-8 h-4 rounded bg-gray-200" />
                      <div className="w-8 h-4 rounded bg-gray-200" />
                    </div>
                    <div className="mt-2 px-2">
                      <div className="w-16 h-2 rounded bg-gray-200" />
                    </div>
                  </div>
                  <p className="text-sm font-medium text-gray-400">Light Mode</p>
                  <p className="text-xs text-gray-600">Coming soon</p>
                </button>
              </div>
            </div>

            <div className="p-5 rounded-xl border border-gray-800 bg-gray-900/30">
              <h3 className="text-sm font-semibold text-white mb-4">Accent Color</h3>
              <div className="flex gap-3">
                {['#06b6d4', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899'].map((color) => (
                  <button key={color} className={`w-8 h-8 rounded-full border-2 ${color === '#06b6d4' ? 'border-white' : 'border-transparent'}`} style={{ backgroundColor: color }} />
                ))}
              </div>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your account settings and preferences</p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:w-56 flex-shrink-0"
          >
            {/* Mobile Tabs */}
            <div className="lg:hidden mb-4">
              <select
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value as Tab)}
                className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-gray-800 text-white focus:outline-none focus:border-cyan-500/50"
              >
                {TABS.map((tab) => (
                  <option key={tab.id} value={tab.id}>{tab.label}</option>
                ))}
              </select>
            </div>

            {/* Desktop Tabs */}
            <nav className="hidden lg:flex flex-col gap-1">
              {TABS.map((tab) => {
                const TabIcon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      activeTab === tab.id
                        ? 'bg-gray-800 text-white border border-gray-700'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800/50 border border-transparent'
                    }`}
                  >
                    <TabIcon className="w-4 h-4" />
                    {tab.label}
                  </button>
                )
              })}
              <hr className="my-3 border-gray-800" />
              <button className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all">
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </nav>
          </motion.div>

          {/* Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 min-w-0"
          >
            <div className="p-6 rounded-2xl border border-gray-800 bg-gray-900/50">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-white">
                  {TABS.find(t => t.id === activeTab)?.label}
                </h2>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-semibold transition-all disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : saved ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Saved!
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
              {renderContent()}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
