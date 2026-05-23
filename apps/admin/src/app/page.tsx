'use client'

import { useState } from 'react'
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Shield,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  Search,
  Bell,
  TrendingUp,
  DollarSign,
  UserPlus,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Activity,
  BarChart3,
  Award,
} from 'lucide-react'

const sidebarItems = [
  { icon: LayoutDashboard, label: 'Dashboard', active: true },
  { icon: Users, label: 'Users', active: false },
  { icon: Briefcase, label: 'Freelancers', active: false },
  { icon: Shield, label: 'Moderation', active: false },
  { icon: FileText, label: 'Reports', active: false },
  { icon: TrendingUp, label: 'Analytics', active: false },
  { icon: DollarSign, label: 'Payments', active: false },
  { icon: Settings, label: 'Settings', active: false },
]

const statsCards = [
  {
    title: 'Total Users',
    value: '24,563',
    change: '+12.5%',
    positive: true,
    icon: Users,
    color: 'from-cyan-500 to-blue-600',
  },
  {
    title: 'Active Freelancers',
    value: '8,230',
    change: '+8.2%',
    positive: true,
    icon: Award,
    color: 'from-purple-500 to-pink-600',
  },
  {
    title: 'Revenue (MTD)',
    value: '$128,430',
    change: '+23.1%',
    positive: true,
    icon: DollarSign,
    color: 'from-emerald-500 to-teal-600',
  },
  {
    title: 'Fraud Alerts',
    value: '12',
    change: '-5.3%',
    positive: true,
    icon: AlertTriangle,
    color: 'from-orange-500 to-red-600',
  },
]

const recentUsers = [
  { name: 'Alex Johnson', email: 'alex@example.com', role: 'Freelancer', status: 'Verified', time: '2m ago' },
  { name: 'Sarah Wilson', email: 'sarah@example.com', role: 'Client', status: 'Pending', time: '5m ago' },
  { name: 'Mike Chen', email: 'mike@example.com', role: 'Freelancer', status: 'Verified', time: '12m ago' },
  { name: 'Emily Davis', email: 'emily@example.com', role: 'Client', status: 'Suspended', time: '1h ago' },
  { name: 'James Brown', email: 'james@example.com', role: 'Freelancer', status: 'Verified', time: '2h ago' },
]

const fraudAlerts = [
  { user: 'fake_user_123', reason: 'Suspicious payment pattern', risk: 'High', time: '10m ago' },
  { user: 'spam_account_45', reason: 'Multiple duplicate listings', risk: 'Medium', time: '25m ago' },
  { user: 'suspicious_dev', reason: 'Stolen portfolio detected', risk: 'High', time: '1h ago' },
]

function Sidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  return (
    <aside className={`fixed left-0 top-0 h-screen bg-gray-900 border-r border-gray-800 transition-all duration-300 z-50 ${collapsed ? 'w-16' : 'w-64'}`}>
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-800">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <span className="font-semibold text-white">Command Center</span>
          </div>
        )}
        <button onClick={onToggle} className="text-gray-500 hover:text-white transition-colors">
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>

      <nav className="p-2 space-y-1">
        {sidebarItems.map((item) => (
          <a
            key={item.label}
            href="#"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
              item.active ? 'bg-cyan-600/20 text-cyan-400' : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span className="text-sm">{item.label}</span>}
          </a>
        ))}
      </nav>
    </aside>
  )
}

export default function AdminDashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="min-h-screen bg-gray-950">
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />

      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
        <header className="sticky top-0 z-40 h-16 bg-gray-900/80 backdrop-blur-xl border-b border-gray-800">
          <div className="flex items-center justify-between h-full px-6">
            <div className="flex items-center gap-4">
              <h1 className="text-lg font-semibold text-white">Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-64 pl-10 pr-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                />
              </div>
              <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
              </button>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-sm font-medium">
                A
              </div>
            </div>
          </div>
        </header>

        <main className="p-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statsCards.map((card) => (
              <div key={card.title} className="relative overflow-hidden p-6 rounded-xl border border-gray-800 bg-gray-900/50">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-br ${card.color}`}>
                    <card.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className={`text-sm font-medium ${card.positive ? 'text-emerald-400' : 'text-red-400'}`}>
                    {card.change}
                  </span>
                </div>
                <p className="text-sm text-gray-400 mb-1">{card.title}</p>
                <p className="text-2xl font-bold text-white">{card.value}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Recent Users */}
            <div className="p-6 rounded-xl border border-gray-800 bg-gray-900/50">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">Recent Users</h2>
                <a href="#" className="text-sm text-cyan-400 hover:text-cyan-300">View All</a>
              </div>
              <div className="space-y-3">
                {recentUsers.map((user) => (
                  <div key={user.email} className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-sm text-gray-400">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        user.status === 'Verified' ? 'bg-emerald-900/50 text-emerald-400' :
                        user.status === 'Pending' ? 'bg-yellow-900/50 text-yellow-400' :
                        'bg-red-900/50 text-red-400'
                      }`}>
                        {user.status}
                      </span>
                      <span className="text-xs text-gray-600">{user.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Fraud Alerts */}
            <div className="p-6 rounded-xl border border-gray-800 bg-gray-900/50">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">Fraud Alerts</h2>
                <span className="flex items-center gap-1 text-sm text-red-400">
                  <AlertTriangle className="w-4 h-4" />
                  3 Active
                </span>
              </div>
              <div className="space-y-3">
                {fraudAlerts.map((alert) => (
                  <div key={alert.user} className="flex items-center justify-between py-2">
                    <div>
                      <p className="text-sm font-medium text-white">{alert.user}</p>
                      <p className="text-xs text-gray-500">{alert.reason}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        alert.risk === 'High' ? 'bg-red-900/50 text-red-400' : 'bg-yellow-900/50 text-yellow-400'
                      }`}>
                        {alert.risk}
                      </span>
                      <span className="text-xs text-gray-600">{alert.time}</span>
                    </div>
                  </div>
                ))}
              </div>
              <button className="mt-4 w-full py-2.5 rounded-lg border border-gray-700 text-sm text-gray-400 hover:text-white hover:border-gray-600 transition-all">
                View All Alerts
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="p-6 rounded-xl border border-gray-800 bg-gray-900/50">
            <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: UserPlus, label: 'Verify Freelancer', color: 'text-cyan-400' },
                { icon: Shield, label: 'Review Reports', color: 'text-purple-400' },
                { icon: CheckCircle, label: 'Approve Listings', color: 'text-emerald-400' },
                { icon: BarChart3, label: 'View Analytics', color: 'text-yellow-400' },
              ].map((action) => (
                <button
                  key={action.label}
                  className="flex items-center gap-3 p-4 rounded-lg border border-gray-800 hover:border-gray-700 bg-gray-800/30 hover:bg-gray-800 transition-all"
                >
                  <action.icon className={`w-5 h-5 ${action.color}`} />
                  <span className="text-sm text-gray-300">{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
