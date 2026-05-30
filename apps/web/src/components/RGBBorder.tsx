'use client'

import { useRef, useState, useEffect } from 'react'

export default function RGBBorder({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 })

  useEffect(() => {
    const card = cardRef.current
    if (!card) return
    const onMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect()
      setMousePos({
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      })
    }
    card.addEventListener('mousemove', onMove)
    return () => card.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <div
      ref={cardRef}
      className={`relative rounded-2xl ${className}`}
      style={{
        background: 'rgba(15, 15, 25, 0.75)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
      }}
    >
      {/* Animated RGB border */}
      <div
        className="absolute -inset-[1.5px] rounded-2xl z-0 pointer-events-none"
        style={{
          background: `conic-gradient(from ${mousePos.x * 360}deg at ${mousePos.x * 100}% ${mousePos.y * 100}%, 
            rgba(6, 182, 212, 0.6), 
            rgba(168, 85, 247, 0.6), 
            rgba(59, 130, 246, 0.6), 
            rgba(6, 182, 212, 0.6)
          )`,
          animation: 'rgbRotate 6s linear infinite',
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'exclude',
          WebkitMaskComposite: 'xor',
          padding: '1.5px',
        }}
      />

      {/* Outer glow */}
      <div
        className="absolute -inset-[3px] rounded-[1.1rem] z-0 pointer-events-none opacity-40 blur-md"
        style={{
          background: `conic-gradient(from ${mousePos.x * 360}deg at ${mousePos.x * 100}% ${mousePos.y * 100}%, 
            rgba(6, 182, 212, 0.4), 
            rgba(168, 85, 247, 0.4), 
            rgba(59, 130, 246, 0.4), 
            rgba(6, 182, 212, 0.4)
          )`,
          animation: 'rgbRotate 6s linear infinite',
        }}
      />

      {/* Content */}
      <div className="relative z-10 rounded-2xl">
        {children}
      </div>
    </div>
  )
}
