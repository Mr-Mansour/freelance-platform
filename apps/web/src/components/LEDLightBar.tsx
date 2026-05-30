'use client'

import { useEffect, useRef } from 'react'

type Props = {
  color?: 'cyan' | 'purple' | 'blue' | 'green' | 'amber'
  variant?: 'bar' | 'dots'
  className?: string
}

const COLORS = {
  cyan: { bar: 'from-cyan-400 via-blue-500 to-cyan-400', glow: 'rgba(6,182,212,0.3)' },
  purple: { bar: 'from-purple-400 via-pink-500 to-purple-400', glow: 'rgba(168,85,247,0.3)' },
  blue: { bar: 'from-blue-400 via-indigo-500 to-blue-400', glow: 'rgba(59,130,246,0.3)' },
  green: { bar: 'from-emerald-400 via-teal-500 to-emerald-400', glow: 'rgba(16,185,129,0.3)' },
  amber: { bar: 'from-amber-400 via-yellow-500 to-amber-400', glow: 'rgba(245,158,11,0.3)' },
}

export default function LEDLightBar({ color = 'cyan', variant = 'bar', className = '' }: Props) {
  const c = COLORS[color]

  if (variant === 'dots') {
    return (
      <div className={`flex gap-1.5 ${className}`}>
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full animate-pulse"
            style={{
              background: c.bar.split(' ')[0].replace('from-', ''),
              boxShadow: `0 0 6px ${c.glow}`,
              animationDelay: `${i * 0.15}s`,
              animationDuration: '1.5s',
            }}
          />
        ))}
      </div>
    )
  }

  return (
    <div className={`relative h-1 w-full overflow-hidden rounded-full ${className}`}>
      <div
        className={`h-full w-full bg-gradient-to-r ${c.bar} rounded-full`}
        style={{ boxShadow: `0 0 12px ${c.glow}, 0 0 40px ${c.glow}` }}
      />
      <div
        className="absolute inset-0 w-20 h-full bg-white/20 rounded-full animate-[slide_2s_ease-in-out_infinite]"
        style={{
          filter: 'blur(4px)',
        }}
      />
    </div>
  )
}
