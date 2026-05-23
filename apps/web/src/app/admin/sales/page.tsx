'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { DollarSign, TrendingUp, Users, ShoppingCart, Calendar, Search } from 'lucide-react'
import { loadPlatformStats, formatCount } from '@/lib/platform-stats'

type Sale = {
  id: string; client: string; project: string; amount: number; status: 'completed' | 'pending' | 'refunded'; date: string; teamMember: string
}

const MOCK_SALES: Sale[] = [
  { id: 's1', client: 'TechCorp Inc.', project: 'Web App Development', amount: 15000, status: 'completed', date: '2026-05-15', teamMember: 'Sarah' },
  { id: 's2', client: 'GreenStartup', project: 'Mobile App Design', amount: 8500, status: 'completed', date: '2026-05-14', teamMember: 'Mike' },
  { id: 's3', client: 'DataFlow Ltd', project: 'API Integration', amount: 12000, status: 'pending', date: '2026-05-13', teamMember: 'Alex' },
  { id: 's4', client: 'CloudNine', project: 'UI/UX Redesign', amount: 9500, status: 'completed', date: '2026-05-12', teamMember: 'Sarah' },
  { id: 's5', client: 'NexGen Solutions', project: 'E-commerce Platform', amount: 22000, status: 'pending', date: '2026-05-11', teamMember: 'Mike' },
]

export default function SalesPage() {
  const [stats, setStats] = useState(loadPlatformStats())
  const [search, setSearch] = useState('')

  const allSales = MOCK_SALES
  const filtered = allSales.filter(s =>
    s.client.toLowerCase().includes(search.toLowerCase()) ||
    s.project.toLowerCase().includes(search.toLowerCase()) ||
    s.teamMember.toLowerCase().includes(search.toLowerCase())
  )

  const totalRevenue = allSales.filter(s => s.status === 'completed').reduce((sum, s) => sum + s.amount, 0)
  const pendingRevenue = allSales.filter(s => s.status === 'pending').reduce((sum, s) => sum + s.amount, 0)

  const teamStats = [
    { member: 'Sarah', sales: allSales.filter(s => s.teamMember === 'Sarah' && s.status === 'completed').length, revenue: allSales.filter(s => s.teamMember === 'Sarah' && s.status === 'completed').reduce((sum, s) => sum + s.amount, 0) },
    { member: 'Mike', sales: allSales.filter(s => s.teamMember === 'Mike' && s.status === 'completed').length, revenue: allSales.filter(s => s.teamMember === 'Mike' && s.status === 'completed').reduce((sum, s) => sum + s.amount, 0) },
    { member: 'Alex', sales: allSales.filter(s => s.teamMember === 'Alex' && s.status === 'completed').length, revenue: allSales.filter(s => s.teamMember === 'Alex' && s.status === 'completed').reduce((sum, s) => sum + s.amount, 0) },
  ]

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">💰 Sales Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Track revenue, team performance, and platform earnings</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="p-5 rounded-xl border border-gray-800 bg-gray-900/50">
          <p className="text-sm text-gray-500 mb-1">Total Revenue</p>
          <p className="text-2xl font-bold text-emerald-400">${totalRevenue.toLocaleString()}</p>
        </div>
        <div className="p-5 rounded-xl border border-gray-800 bg-gray-900/50">
          <p className="text-sm text-gray-500 mb-1">Pending</p>
          <p className="text-2xl font-bold text-amber-400">${pendingRevenue.toLocaleString()}</p>
        </div>
        <div className="p-5 rounded-xl border border-gray-800 bg-gray-900/50">
          <p className="text-sm text-gray-500 mb-1">Platform Earnings</p>
          <p className="text-2xl font-bold text-white">${stats.totalEarnings.toLocaleString()}</p>
        </div>
        <div className="p-5 rounded-xl border border-gray-800 bg-gray-900/50">
          <p className="text-sm text-gray-500 mb-1">Projects</p>
          <p className="text-2xl font-bold text-white">{formatCount(stats.projects)}</p>
        </div>
      </div>

      {/* Team Performance */}
      <div className="mb-8">
        <h2 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
          <Users className="w-4 h-4 text-amber-400" /> Sales Team
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {teamStats.map(t => (
            <div key={t.member} className="p-4 rounded-xl border border-gray-800 bg-gray-900/50">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center text-white text-xs font-bold">
                  {t.member.charAt(0)}
                </div>
                <p className="text-sm font-medium text-white">{t.member}</p>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div><span className="text-gray-500">Deals:</span> <span className="text-white">{t.sales}</span></div>
                <div><span className="text-gray-500">Revenue:</span> <span className="text-emerald-400">${t.revenue.toLocaleString()}</span></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sales Search */}
      <div className="relative max-w-xs mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search sales..."
          className="w-full pl-9 pr-3 py-2 rounded-lg bg-gray-900 border border-gray-800 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-amber-500/50" />
      </div>

      {/* Sales List */}
      <div className="space-y-3">
        {filtered.map(sale => (
          <div key={sale.id} className="p-4 rounded-xl border border-gray-800 bg-gray-900/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-sm">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">{sale.project}</p>
                <p className="text-xs text-gray-500">{sale.client} • {sale.date} • {sale.teamMember}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-white">${sale.amount.toLocaleString()}</p>
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                sale.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' :
                sale.status === 'pending' ? 'bg-amber-500/10 text-amber-400' :
                'bg-red-500/10 text-red-400'
              }`}>
                {sale.status}
              </span>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="p-10 rounded-xl border border-gray-800 bg-gray-900/50 text-center">
            <DollarSign className="w-12 h-12 mx-auto mb-3 text-gray-700" />
            <p className="text-gray-500 text-sm">No sales found.</p>
          </div>
        )}
      </div>
    </div>
  )
}
