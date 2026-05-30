'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { List } from 'lucide-react'

type Heading = { id: string; text: string; level: number }

export default function TableOfContents() {
  const [headings, setHeadings] = useState<Heading[]>([])
  const [activeId, setActiveId] = useState<string>('')
  const [open, setOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const content = document.getElementById('page-content')
    if (!content) return
    const els = content.querySelectorAll('h1, h2, h3')
    const items: Heading[] = []
    els.forEach((el, i) => {
      const id = el.textContent?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || `section-${i}`
      el.id = id
      items.push({ id, text: el.textContent || '', level: parseInt(el.tagName[1]) })
    })
    setHeadings(items)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActiveId(entry.target.id)
        })
      },
      { rootMargin: '-80px 0px -60% 0px' }
    )
    headings.forEach(h => {
      const el = document.getElementById(h.id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [headings])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) setOpen(false)
    }
    if (open) {
      setTimeout(() => window.addEventListener('mousedown', handleClick), 100)
      return () => window.removeEventListener('mousedown', handleClick)
    }
  }, [open])

  if (headings.length < 2) return null

  return (
    <>
      {/* Desktop: fixed sidebar */}
      <div className="hidden lg:block fixed left-8 top-1/2 -translate-y-1/2 z-40 w-56">
        <nav className="space-y-1 border-l border-gray-800/50 pl-4">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">On this page</p>
          {headings.map(h => (
            <a
              key={h.id}
              href={`#${h.id}`}
              onClick={(e) => { e.preventDefault(); document.getElementById(h.id)?.scrollIntoView({ behavior: 'smooth' }) }}
              className={`block text-xs transition-all duration-200 py-1 ${
                h.level === 2 ? 'pl-4' : h.level === 3 ? 'pl-8' : ''
              } ${
                activeId === h.id
                  ? 'text-cyan-400 font-medium'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {h.text}
            </a>
          ))}
        </nav>
      </div>

      {/* Mobile: floating button + panel */}
      <div className="lg:hidden fixed bottom-6 right-6 z-50" ref={panelRef}>
        <button
          onClick={() => setOpen(!open)}
          className="w-10 h-10 rounded-xl bg-gray-900 border border-gray-700 flex items-center justify-center text-gray-400 hover:text-white hover:border-cyan-500/50 transition-all shadow-lg"
        >
          <List className="w-4 h-4" />
        </button>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute bottom-12 right-0 w-64 rounded-xl border border-gray-800 bg-gray-900 shadow-2xl overflow-hidden"
            >
              <div className="p-3 border-b border-gray-800">
                <p className="text-xs font-medium text-gray-400">On this page</p>
              </div>
              <div className="max-h-64 overflow-y-auto p-2 space-y-0.5">
                {headings.map(h => (
                  <a
                    key={h.id}
                    href={`#${h.id}`}
                    onClick={(e) => { e.preventDefault(); document.getElementById(h.id)?.scrollIntoView({ behavior: 'smooth' }); setOpen(false) }}
                    className={`block text-xs rounded-lg px-3 py-2 transition-colors ${
                      h.level === 2 ? 'pl-6' : h.level === 3 ? 'pl-9' : ''
                    } ${
                      activeId === h.id
                        ? 'bg-cyan-500/10 text-cyan-400'
                        : 'text-gray-400 hover:bg-gray-800'
                    }`}
                  >
                    {h.text}
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}
