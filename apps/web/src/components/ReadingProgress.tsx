'use client'

import { useEffect, useState } from 'react'

export default function ReadingProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      setProgress(docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      {/* Top progress bar */}
      <div className="fixed top-16 left-0 right-0 z-50 h-0.5 bg-gray-800/50">
        <div
          className="h-full rounded-full transition-all duration-150"
          style={{
            width: `${progress * 100}%`,
            background: 'linear-gradient(90deg, rgba(6,182,212,0.8), rgba(168,85,247,0.8), rgba(59,130,246,0.8))',
            boxShadow: '0 0 10px rgba(6,182,212,0.5), 0 0 20px rgba(168,85,247,0.3)',
          }}
        />
      </div>

      {/* Bottom-right percentage */}
      <div
        className="fixed bottom-6 left-6 z-50 flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-900/80 border border-gray-800 backdrop-blur-sm text-xs text-gray-400 select-none"
        style={{ opacity: progress > 0.02 ? 1 : 0, transition: 'opacity 0.3s' }}
      >
        <div
          className="w-1.5 h-1.5 rounded-full"
          style={{
            background: 'linear-gradient(90deg, rgba(6,182,212,0.8), rgba(168,85,247,0.8))',
          }}
        />
        {Math.round(progress * 100)}% read
      </div>
    </>
  )
}
