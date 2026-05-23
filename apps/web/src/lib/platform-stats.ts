'use client'

export type PlatformStats = {
  freelancers: number
  jobsPosted: number
  projects: number
  responseTime: string
  totalEarnings: number
}

const DEFAULT_STATS: PlatformStats = {
  freelancers: 0,
  jobsPosted: 0,
  projects: 0,
  responseTime: '< 24hrs',
  totalEarnings: 0,
}

export function loadPlatformStats(): PlatformStats {
  const stored = localStorage.getItem('cybrion_platform_stats')
  if (stored) { try { return JSON.parse(stored) } catch {} }
  return DEFAULT_STATS
}

export function savePlatformStats(stats: PlatformStats) {
  localStorage.setItem('cybrion_platform_stats', JSON.stringify(stats))
}

export function incrementStat(key: keyof PlatformStats, amount = 1) {
  const stats = loadPlatformStats()
  if (typeof stats[key] === 'number') {
    (stats as Record<string, unknown>)[key] = (stats[key] as number) + amount
  }
  savePlatformStats(stats)
  return stats
}

export function decrementStat(key: keyof PlatformStats, amount = 1) {
  const stats = loadPlatformStats()
  if (typeof stats[key] === 'number') {
    (stats as Record<string, unknown>)[key] = Math.max(0, (stats[key] as number) - amount)
  }
  savePlatformStats(stats)
  return stats
}

export function formatCount(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M+`
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K+`
  if (n === 0) return '0'
  return `${n}+`
}
