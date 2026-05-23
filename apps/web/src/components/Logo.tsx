export default function Logo({ size = 'default', showText = true, variant = 'default' }: { size?: 'sm' | 'default' | 'lg'; showText?: boolean; variant?: 'default' | 'admin' }) {
  const sizeMap = { sm: 'w-7 h-7 text-sm', default: 'w-9 h-9 text-lg', lg: 'w-12 h-12 text-xl' }
  const textSizeMap = { sm: 'text-lg', default: 'text-xl', lg: 'text-2xl' }

  if (variant === 'admin') {
    return (
      <div className="flex items-center justify-center">
        <div className={`${sizeMap[size]} rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center shadow-lg shadow-amber-500/20 relative overflow-hidden`}>
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

  return (
    <a href="/" className="flex items-center gap-2.5 group">
      <div className={`${sizeMap[size]} rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/30 transition-all relative overflow-hidden`}>
        <svg viewBox="0 0 36 36" className="absolute inset-0 w-full h-full opacity-30">
          <circle cx="18" cy="18" r="16" fill="none" stroke="white" strokeWidth="0.5" />
          <circle cx="18" cy="18" r="10" fill="none" stroke="white" strokeWidth="0.3" />
          <path d="M18 2 L20 8 L16 8 Z" fill="rgba(255,255,255,0.15)" />
          <path d="M18 34 L20 28 L16 28 Z" fill="rgba(255,255,255,0.15)" />
        </svg>
        <span className="relative font-bold text-white">C</span>
      </div>
      {showText && (
        <span className={`${textSizeMap[size]} font-bold text-white`}>
          Cybr<span className="text-cyan-400">ion</span>
        </span>
      )}
    </a>
  )
}
