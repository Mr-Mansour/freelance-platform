'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Bell,
  ChevronDown,
  LogOut,
  User,
  Settings,
  Menu,
  X,
  ArrowRight,
  Briefcase,
  MessageCircle,
  LayoutDashboard,
  FileText,
  Shield,
  Sparkles,
  Info,
  DollarSign,
  Crown,
} from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import Logo from './Logo'

const ROLE_SUGGESTIONS = [
  { title: 'Web Developer', description: 'Build websites, web apps, and APIs using modern frameworks.', help: 'Offer custom development services, from landing pages to full-stack SaaS platforms.' },
  { title: 'Mobile Developer', description: 'Create iOS and Android apps with native or cross-platform tools.', help: 'Build mobile apps for clients — e-commerce, social, productivity, or games.' },
  { title: 'UI/UX Designer', description: 'Design intuitive interfaces and seamless user experiences.', help: 'Create wireframes, prototypes, and design systems for startups and agencies.' },
  { title: 'AI/ML Engineer', description: 'Develop machine learning models and AI-powered solutions.', help: 'Provide AI consulting, model training, chatbot development, and data analysis.' },
  { title: 'DevOps Engineer', description: 'Manage infrastructure, CI/CD pipelines, and cloud deployments.', help: 'Help clients automate deployments, optimize cloud costs, and improve reliability.' },
  { title: 'Data Scientist', description: 'Analyze data, build dashboards, and derive actionable insights.', help: 'Offer data analysis, visualization, and predictive modeling for business decisions.' },
  { title: 'Content Writer', description: 'Write articles, blog posts, copy, and marketing content.', help: 'Create SEO-optimized content, whitepapers, and brand stories for businesses.' },
  { title: 'Graphic Designer', description: 'Design logos, branding, social media graphics, and more.', help: 'Deliver visual identity packages, marketing materials, and custom illustrations.' },
  { title: 'Digital Marketer', description: 'Run campaigns, manage SEO, social media, and paid ads.', help: 'Help businesses grow online presence through targeted marketing strategies.' },
  { title: 'Video Editor', description: 'Edit and produce professional video content for any platform.', help: 'Create explainer videos, social reels, commercials, and YouTube content.' },
  { title: 'Virtual Assistant', description: 'Handle administrative tasks, scheduling, and email management.', help: 'Provide remote support to entrepreneurs and busy executives worldwide.' },
  { title: 'Project Manager', description: 'Plan, execute, and deliver projects on time and within budget.', help: 'Manage client projects end-to-end using agile methodologies and clear communication.' },
  { title: 'Blockchain Developer', description: 'Build smart contracts, dApps, and blockchain-based solutions.', help: 'Develop NFT marketplaces, DeFi protocols, and tokenization platforms for clients.' },
  { title: 'Cybersecurity Expert', description: 'Protect systems, networks, and data from security threats.', help: 'Offer penetration testing, security audits, and compliance consulting services.' },
  { title: 'Copywriter', description: 'Write persuasive copy for ads, emails, landing pages, and sales funnels.', help: 'Help businesses convert visitors into customers with compelling copy.' },
]

const APP_LINKS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/jobs', label: 'Find Work', icon: Briefcase },
  { href: '/freelancers', label: 'Freelancers', icon: User },
  { href: '/messages', label: 'Messages', icon: MessageCircle },
  { href: '/proposals', label: 'Proposals', icon: FileText },
]

const LANDING_LINKS = [
  { href: '/freelancers', label: 'Find Freelancers', icon: User },
  { href: '/jobs', label: 'Browse Jobs', icon: Briefcase },
  { href: '/how-it-works', label: 'How It Works', icon: Info },
]

export default function Navbar() {
  const { user, signOut } = useAuth()
  const [scrolled, setScrolled] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [pathname, setPathname] = useState('/')
  const [unreadNotifs, setUnreadNotifs] = useState(0)
  const [showRoleSuggestions, setShowRoleSuggestions] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLDivElement>(null)

  const fetchUnread = useCallback(() => {
    fetch('/api/notifications?filter=unread')
      .then(r => r.json())
      .then(d => setUnreadNotifs(d.unreadCount || 0))
      .catch(() => {})
  }, [])

  useEffect(() => {
    setPathname(window.location.pathname)
    fetchUnread()
    const interval = setInterval(fetchUnread, 10000)
    return () => clearInterval(interval)
    const onScroll = () => setScrolled(window.scrollY > 10)
    const onClick = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false)
      }
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false)
        setShowRoleSuggestions(false)
      }
    }
    window.addEventListener('scroll', onScroll)
    window.addEventListener('mousedown', onClick)
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('mousedown', onClick) }
  }, [])

  const isLanding = pathname === '/'
  const isAdminArea = pathname.startsWith('/admin')

  if (isAdminArea) return null
  const isAdmin = user?.role === 'owner' || user?.role === 'admin'
  const canAccess = user?.role === 'owner' || user?.role === 'admin' || user?.role === 'user'

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    setShowRoleSuggestions(false)
    window.location.href = `/marketplace?search=${encodeURIComponent(searchQuery)}`
    setSearchQuery('')
    setSearchOpen(false)
  }

  const activeClass = (href: string) => {
    if (href.startsWith('#')) return 'text-gray-400 hover:text-white hover:bg-gray-800/50'
    const isActive = pathname.startsWith(href)
    return isActive ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
  }

  const renderNavLinks = () => {
    const links = isLanding ? LANDING_LINKS : (user ? APP_LINKS : [])
    if (links.length === 0) return null
    return (
      <div className="hidden md:flex items-center gap-1">
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${activeClass(link.href)}`}
          >
            {link.icon && <link.icon className="w-4 h-4" />}
            {link.label}
          </a>
        ))}
      </div>
    )
  }

  const renderMobileLinks = () => {
    if (isLanding) {
      return (
        <>
          {LANDING_LINKS.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setShowMobileMenu(false)}
              className="flex items-center gap-3 text-gray-400 hover:text-white py-2"
            >
              <link.icon className="w-5 h-5" />
              {link.label}
            </a>
          ))}
          <div className="pt-4 space-y-3">
            <a href="/sign-in" onClick={() => setShowMobileMenu(false)} className="block text-center text-gray-400 hover:text-white py-2">Sign In</a>
            <a href="/sign-up" onClick={() => setShowMobileMenu(false)} className="block text-center px-4 py-2.5 rounded-xl bg-cyan-600 text-white font-medium">Get Started</a>
          </div>
        </>
      )
    }
    if (!user) return null
    return (
      <>
        <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-900/50 border border-gray-800">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold">
            {user.initials}
          </div>
          <div>
            <p className="text-sm font-medium text-white">{user.name}</p>
            <p className="text-xs text-gray-500">{user.username}</p>
          </div>
        </div>
        {APP_LINKS.map((link) => (
          <a key={link.href} href={link.href} onClick={() => setShowMobileMenu(false)}
            className="flex items-center gap-3 text-gray-400 hover:text-white py-2"
          >
            <link.icon className="w-5 h-5" />
            {link.label}
          </a>
        ))}
        {isAdmin && (
          <a href="/admin" onClick={() => setShowMobileMenu(false)}
            className="flex items-center gap-3 text-amber-400 hover:text-amber-300 py-2"
          >
            <Crown className="w-5 h-5" /> Admin Panel
          </a>
        )}
        <hr className="border-gray-800" />
        <a href="/settings" onClick={() => setShowMobileMenu(false)} className="flex items-center gap-3 text-gray-400 hover:text-white py-2">
          <Settings className="w-5 h-5" /> Settings
        </a>
        <button onClick={() => { signOut(); setShowMobileMenu(false) }} className="flex items-center gap-3 text-red-400 py-2">
          <LogOut className="w-5 h-5" /> Sign Out
        </button>
      </>
    )
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-black/80 backdrop-blur-xl border-b border-gray-800/50' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Logo />

          {renderNavLinks()}

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {/* Search Icon */}
            <div className="relative hidden sm:block" ref={searchRef}>
              <AnimatePresence mode="wait">
                {searchOpen ? (
                  <motion.form
                    key="search-input"
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 320, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    onSubmit={handleSearch}
                    className="relative"
                  >
                    <div className="relative w-full">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type="text"
                        placeholder="Search roles, freelancers, jobs..."
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value)
                          setShowRoleSuggestions(e.target.value.length > 0)
                        }}
                        onFocus={() => setShowRoleSuggestions(searchQuery.length > 0)}
                        autoFocus
                        className="w-full pl-9 pr-3 py-2 rounded-lg bg-gray-900 border border-gray-800 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 transition-colors"
                      />
                    </div>
                    {showRoleSuggestions && searchQuery.trim() && (
                      <div className="absolute top-full mt-2 left-0 w-full max-h-80 overflow-y-auto rounded-xl border border-gray-800 bg-gray-900 shadow-2xl z-50">
                        {ROLE_SUGGESTIONS.filter(r =>
                          r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          r.description.toLowerCase().includes(searchQuery.toLowerCase())
                        ).length > 0 ? (
                          ROLE_SUGGESTIONS.filter(r =>
                            r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            r.description.toLowerCase().includes(searchQuery.toLowerCase())
                          ).slice(0, 8).map((role) => (
                            <button
                              key={role.title}
                              type="button"
                              onClick={() => {
                                setShowRoleSuggestions(false)
                                setSearchOpen(false)
                                setSearchQuery('')
                                window.location.href = `/marketplace?search=${encodeURIComponent(role.title)}`
                              }}
                              className="w-full text-left px-4 py-3 hover:bg-gray-800 border-b border-gray-800 last:border-b-0 transition-colors"
                            >
                              <p className="text-sm font-medium text-white">{role.title}</p>
                              <p className="text-xs text-gray-400 mt-0.5">{role.description}</p>
                              <p className="text-xs text-cyan-400 mt-0.5">{role.help}</p>
                            </button>
                          ))
                        ) : (
                          <div className="px-4 py-3 text-sm text-gray-500">No matching roles found. Press Enter to search all freelancers.</div>
                        )}
                      </div>
                    )}
                  </motion.form>
                ) : (
                  <motion.button
                    key="search-icon"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setSearchOpen(true)}
                    className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-all"
                  >
                    <Search className="w-5 h-5" />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            {user ? (
              <>
                <a href="/notifications" className="relative p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-all">
                  <Bell className="w-5 h-5" />
                  {unreadNotifs > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
                      {unreadNotifs > 9 ? '9+' : unreadNotifs}
                    </span>
                  )}
                </a>

                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-800 transition-all"
                  >
                    {user.role === 'owner' ? (
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-amber-500/20 ring-1 ring-amber-400/30">
                        <Crown className="w-4 h-4" />
                      </div>
                    ) : isAdmin ? (
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-amber-500/20">
                        {user.initials}
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
                        {user.initials}
                      </div>
                    )}
                    <span className="hidden lg:block text-sm text-white font-medium">{user.name}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                  </button>

                  <AnimatePresence>
                    {showUserMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-gray-800 bg-gray-900 shadow-2xl overflow-hidden"
                      >
                        <div className="p-3 border-b border-gray-800">
                          <p className="text-sm font-medium text-white">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.username}</p>
                          {isAdmin && (
                            <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 text-xs font-medium">
                              <Crown className="w-3 h-3" />
                              {user.role === 'owner' ? 'Owner' : 'Admin'}
                            </span>
                          )}
                        </div>
                        <div className="p-1">
                          {isAdmin && (
                            <a href="/admin" onClick={() => setShowUserMenu(false)} className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 transition-all">
                              <Crown className="w-4 h-4" />
                              Admin Panel
                            </a>
                          )}
                          <a href="/settings" onClick={() => setShowUserMenu(false)} className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-all">
                            <Settings className="w-4 h-4" />
                            Settings
                          </a>
                          <a href="/dashboard" onClick={() => setShowUserMenu(false)} className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-all">
                            <LayoutDashboard className="w-4 h-4" />
                            Dashboard
                          </a>
                          <a href="/contracts" onClick={() => setShowUserMenu(false)} className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-all">
                            <Shield className="w-4 h-4" />
                            Contracts
                          </a>
                        </div>
                        <div className="p-1 border-t border-gray-800">
                          <button onClick={() => { signOut(); setShowUserMenu(false) }} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-all">
                            <LogOut className="w-4 h-4" />
                            Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <>
                <a href="/sign-in" className="hidden sm:inline text-sm text-gray-400 hover:text-white transition-colors">Sign In</a>
                <a href="/sign-up" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-medium transition-all shadow-lg shadow-cyan-500/20">
                  Get Started
                  <ArrowRight className="w-4 h-4" />
                </a>
              </>
            )}

            <button className="md:hidden p-2 text-gray-400 hover:text-white" onClick={() => setShowMobileMenu(!showMobileMenu)}>
              {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-800 bg-black/95 backdrop-blur-xl"
          >
            <div className="px-4 py-6 space-y-4">
              {/* Mobile Search */}
              <div className="relative">
                <form onSubmit={handleSearch} className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search roles, freelancers, jobs..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value)
                      setShowRoleSuggestions(e.target.value.length > 0)
                    }}
                    onFocus={() => setShowRoleSuggestions(searchQuery.length > 0)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-900 border border-gray-800 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-cyan-500/50"
                  />
                </form>
                {showRoleSuggestions && searchQuery.trim() && (
                  <div className="mt-1 rounded-xl border border-gray-800 bg-gray-900 shadow-2xl overflow-hidden">
                    {ROLE_SUGGESTIONS.filter(r =>
                      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      r.description.toLowerCase().includes(searchQuery.toLowerCase())
                    ).slice(0, 6).map((role) => (
                      <button
                        key={role.title}
                        type="button"
                        onClick={() => {
                          setShowRoleSuggestions(false)
                          setShowMobileMenu(false)
                          setSearchQuery('')
                          window.location.href = `/marketplace?search=${encodeURIComponent(role.title)}`
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-gray-800 border-b border-gray-800 last:border-b-0 transition-colors"
                      >
                        <p className="text-sm font-medium text-white">{role.title}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{role.description}</p>
                        <p className="text-xs text-cyan-400 mt-0.5">{role.help}</p>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {renderMobileLinks()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
