import { NextResponse } from 'next/server'

const LEADERBOARD = [
  { rank: 1, name: 'Marcus Johnson', score: 98, level: 'LEGENDARY', jobsCompleted: 142, successRate: 100 },
  { rank: 2, name: 'Priya Patel', score: 97, level: 'TITAN', jobsCompleted: 98, successRate: 99 },
  { rank: 3, name: 'Alex Chen', score: 94, level: 'ELITE', jobsCompleted: 86, successRate: 98 },
  { rank: 4, name: 'Sarah Williams', score: 90, level: 'ELITE', jobsCompleted: 52, successRate: 95 },
  { rank: 5, name: 'Emily Rodriguez', score: 85, level: 'TRUSTED', jobsCompleted: 33, successRate: 92 },
  { rank: 6, name: 'James Kim', score: 82, level: 'TRUSTED', jobsCompleted: 38, successRate: 90 },
]

export async function GET() {
  return NextResponse.json(LEADERBOARD)
}
