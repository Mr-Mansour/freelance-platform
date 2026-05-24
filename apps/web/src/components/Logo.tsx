'use client'

import dynamic from 'next/dynamic'

const Logo3D = dynamic(() => import('@/components/Logo3D'), { ssr: false })

export default function Logo({ size = 'default', showText = true, variant = 'default' }: { size?: 'sm' | 'default' | 'lg'; showText?: boolean; variant?: 'default' | 'admin' }) {
  const canvasSize = size === 'sm' ? 28 : size === 'lg' ? 48 : 36

  if (variant === 'admin') {
    const cls = size === 'sm' ? 'w-7 h-7' : size === 'lg' ? 'w-12 h-12' : 'w-9 h-9'
    return (
      <div className="flex items-center justify-center">
        <div className={`${cls} rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center shadow-lg shadow-amber-500/20 relative overflow-hidden`}>
          <svg viewBox="0 0 36 36" className="absolute inset-0 w-full h-full">
            <circle cx="18" cy="18" r="16" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
            <circle cx="18" cy="18" r="10" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.3" />
            <line x1="2" y1="18" x2="8" y2="18" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
            <line x1="28" y1="18" x2="34" y2="18" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
            <line x1="18" y1="2" x2="18" y2="8" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
            <line x1="18" y1="28" x2="18" y2="34" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
          </svg>
          <span className="relative font-bold text-white drop-shadow-lg">C</span>
        </div>
      </div>
    )
  }

  const textCls = size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-2xl' : 'text-xl'

  return (
    <a href="/" className="flex items-center gap-2.5 group">
      <Logo3D size={canvasSize} />
      {showText && (
        <span className={`${textCls} font-bold text-white`}>
          Cybr<span className="text-cyan-400">ion</span>
        </span>
      )}
    </a>
  )
}
