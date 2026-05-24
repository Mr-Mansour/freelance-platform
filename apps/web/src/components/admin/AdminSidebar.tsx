'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Logo from '@/components/Logo'
import { useAuth, type AdminSection } from '@/lib/auth-context'

const NAV_ITEMS: { href: string; label: string; icon: string; section: AdminSection }[] = [
  { href: '/admin', label: 'Overview', icon: '◉', section: 'overview' },
  { href: '/admin/analytics', label: 'Analytics', icon: '📊', section: 'analytics' },
  { href: '/admin/chat', label: 'Messages', icon: '💬', section: 'chat' },
  { href: '/admin/meetings', label: 'Meetings', icon: '📅', section: 'meetings' },
  { href: '/admin/review', label: 'Review', icon: '⭐', section: 'review' },
  { href: '/admin/sales', label: 'Sales', icon: '💰', section: 'sales' },
  { href: '/admin/service', label: 'Service', icon: '🛠️', section: 'service' },
  { href: '/admin/pages', label: 'Pages', icon: '📄', section: 'pages' },
  { href: '/admin/disputes', label: 'Disputes', icon: '⚖️', section: 'disputes' },
  { href: '/admin/moderation', label: 'Moderation', icon: '🚩', section: 'moderation' },
  { href: '/admin/access', label: 'Access', icon: '🔐', section: 'access' },
]

export default function AdminSidebar() {
  const { user } = useAuth()
  const pathname = usePathname()
  const [hovered, setHovered] = useState(false)
  const [showDotMenu, setShowDotMenu] = useState(false)
  const expanded = hovered

  const isOwner = user?.role === 'owner'
  const userSections = user?.sections || []

  const filteredItems = isOwner
    ? NAV_ITEMS
    : NAV_ITEMS.filter(item => userSections.includes(item.section))

  return (
    <nav
      className="fixed left-0 top-0 h-screen z-50 flex flex-col bg-gray-950 border-r border-gray-800/50 transition-all duration-200"
      style={{ width: expanded ? 220 : 64 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setShowDotMenu(false) }}
    >
      <div className="flex items-center justify-center h-16 lg:h-20 border-b border-gray-800/50">
        {expanded ? <Logo size="sm" variant="admin" showText={true} /> : <Logo size="sm" variant="admin" showText={false} />}
      </div>

      <div className="flex-1 py-4 space-y-1 px-2 overflow-y-auto">
        {filteredItems.map((item) => {
          const active = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                active ? 'bg-amber-500/10 text-amber-400' : 'text-gray-500 hover:text-white hover:bg-gray-800/50'
              }`}
              title={!expanded ? item.label : undefined}
            >
              <span className="text-lg flex-shrink-0 w-6 text-center leading-none">{item.icon}</span>
              <AnimatePresence>
                {expanded && (
                  <motion.span initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: 'auto' }} exit={{ opacity: 0, width: 0 }} className="text-xs truncate">
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          )
        })}
      </div>

      <div className="border-t border-gray-800/50 p-2 relative">
        <button onClick={() => setShowDotMenu(!showDotMenu)}
          className={`w-full flex items-center justify-center gap-2 p-2 rounded-lg text-gray-500 hover:text-white hover:bg-gray-800 transition-all ${expanded ? 'justify-start px-3' : ''}`}>
          <span className="text-lg leading-none">•••</span>
          {expanded && <span className="text-xs">More</span>}
        </button>
        <AnimatePresence>
          {showDotMenu && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
              className="absolute bottom-full left-2 right-2 mb-2 rounded-xl border border-gray-800 bg-gray-900 shadow-2xl overflow-hidden">
              <Link href="/" onClick={() => setShowDotMenu(false)}
                className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-all">
                <span>←</span> <span>Go back to site</span>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}
