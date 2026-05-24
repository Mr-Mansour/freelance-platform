'use client'

import { useEffect, useRef } from 'react'

export default function Logo3D({ size = 200 }: { size?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    const cx = size / 2
    const cy = size / 2
    const R = size * 0.28
    const r = size * 0.12
    let angle = 0

    function torusPoint(u: number, v: number): [number, number, number] {
      return [
        (R + r * Math.cos(v)) * Math.cos(u),
        (R + r * Math.cos(v)) * Math.sin(u),
        r * Math.sin(v),
      ]
    }

    function rotateX(p: [number, number, number], a: number): [number, number, number] {
      const c = Math.cos(a), s = Math.sin(a)
      return [p[0], p[1] * c - p[2] * s, p[1] * s + p[2] * c]
    }

    function rotateY(p: [number, number, number], a: number): [number, number, number] {
      const c = Math.cos(a), s = Math.sin(a)
      return [p[0] * c + p[2] * s, p[1], -p[0] * s + p[2] * c]
    }

    function rotateZ(p: [number, number, number], a: number): [number, number, number] {
      const c = Math.cos(a), s = Math.sin(a)
      return [p[0] * c - p[1] * s, p[0] * s + p[1] * c, p[2]]
    }

    function project(p: [number, number, number]): [number, number] {
      const scale = 400 / (400 + p[2])
      return [cx + p[0] * scale, cy + p[1] * scale]
    }

    function draw() {
      ctx.clearRect(0, 0, size, size)

      angle += 0.008

      const steps = 24
      const vSteps = 12
      const points: { x: number; y: number; z: number }[] = []

      for (let i = 0; i <= steps; i++) {
        for (let j = 0; j <= vSteps; j++) {
          const u = (i / steps) * Math.PI * 2
          const v = (j / vSteps) * Math.PI * 2
          let p = torusPoint(u, v)
          p = rotateX(p, angle * 1.3)
          p = rotateY(p, angle * 0.7)
          p = rotateZ(p, angle * 0.4)
          const [px, py] = project(p)
          points.push({ x: px, y: py, z: p[2] })
        }
      }

      ctx.strokeStyle = 'rgba(6, 182, 212, 0.15)'
      ctx.lineWidth = 1
      for (let i = 0; i <= steps; i++) {
        ctx.beginPath()
        for (let j = 0; j <= vSteps; j++) {
          const idx = i * (vSteps + 1) + j
          if (j === 0) ctx.moveTo(points[idx].x, points[idx].y)
          else ctx.lineTo(points[idx].x, points[idx].y)
        }
        ctx.stroke()
      }
      for (let j = 0; j <= vSteps; j++) {
        ctx.beginPath()
        for (let i = 0; i <= steps; i++) {
          const idx = i * (vSteps + 1) + j
          if (i === 0) ctx.moveTo(points[idx].x, points[idx].y)
          else ctx.lineTo(points[idx].x, points[idx].y)
        }
        ctx.stroke()
      }

      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, size * 0.22)
      glow.addColorStop(0, 'rgba(6, 182, 212, 0.12)')
      glow.addColorStop(0.5, 'rgba(6, 182, 212, 0.04)')
      glow.addColorStop(1, 'rgba(6, 182, 212, 0)')
      ctx.fillStyle = glow
      ctx.beginPath()
      ctx.arc(cx, cy, size * 0.22, 0, Math.PI * 2)
      ctx.fill()

      ctx.font = `bold ${size * 0.35}px -apple-system, BlinkMacSystemFont, sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'

      ctx.shadowColor = 'rgba(6, 182, 212, 0.6)'
      ctx.shadowBlur = 20
      const grad = ctx.createLinearGradient(cx - 20, cy - 20, cx + 20, cy + 20)
      grad.addColorStop(0, '#22d3ee')
      grad.addColorStop(0.5, '#fff')
      grad.addColorStop(1, '#3b82f6')
      ctx.fillStyle = grad
      ctx.fillText('C', cx, cy + 2)

      ctx.shadowBlur = 40
      ctx.shadowColor = 'rgba(6, 182, 212, 0.3)'
      ctx.fillStyle = 'rgba(6, 182, 212, 0.08)'
      ctx.fillText('C', cx, cy + 2)

      ctx.shadowBlur = 0
      ctx.fillStyle = grad
      ctx.fillText('C', cx, cy + 2)

      animId = requestAnimationFrame(draw)
    }

    draw()
    return () => cancelAnimationFrame(animId)
  }, [size])

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      className="drop-shadow-2xl"
      style={{ filter: 'drop-shadow(0 0 30px rgba(6, 182, 212, 0.15))' }}
    />
  )
}
