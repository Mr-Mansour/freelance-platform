'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, X, Trash2, Users, Check, Crown, Mail } from 'lucide-react'
import { useAuth, ADMIN_SECTIONS, ADMIN_SECTION_LABELS, type AdminSection } from '@/lib/auth-context'

export default function AccessPage() {
  const { user, managedUsers, registeredUsers, addManagedUser, removeManagedUser, makeOwner } = useAuth()
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [position, setPosition] = useState('')
  const [sections, setSections] = useState<AdminSection[]>(['overview'])

  const isOwner = user?.role === 'owner'

  const toggleSection = (key: AdminSection) => {
    setSections(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key])
  }

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!username.trim() || !password.trim()) return
    addManagedUser({
      id: `mu_${Date.now()}`,
      username: username.trim(),
      password: password.trim(),
      name: name.trim() || username.trim(),
      email: email.trim(),
      position: position.trim() || 'Team Member',
      sections,
    })
    setName(''); setUsername(''); setEmail(''); setPassword(''); setPosition(''); setSections(['overview'])
    setShowForm(false)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">🔐 Access Control</h1>
          <p className="text-sm text-gray-500 mt-1">Manage users, view emails, and assign permissions</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium transition-all">
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? 'Cancel' : 'New User'}
        </button>
      </div>

      {showForm && (
        <motion.form
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          onSubmit={handleCreate}
          className="p-6 rounded-xl border border-gray-800 bg-gray-900/50 mb-6 space-y-4"
        >
          <h3 className="text-sm font-medium text-white">New Team Member</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-amber-500/50" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Username *</label>
              <input type="text" value={username} onChange={e => setUsername(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-amber-500/50" required />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-amber-500/50" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Password *</label>
              <input type="text" value={password} onChange={e => setPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-amber-500/50" required />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Position / Role</label>
              <input type="text" value={position} onChange={e => setPosition(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-amber-500/50" />
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-2">Section Access — toggle which admin sections this user can see</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {ADMIN_SECTIONS.map(key => (
                <button key={key} type="button" onClick={() => toggleSection(key)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all border ${
                    sections.includes(key)
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      : 'bg-gray-800 text-gray-500 border-gray-700 hover:border-gray-600'
                  }`}>
                  {sections.includes(key) ? <Check className="w-3 h-3" /> : <span className="w-3 h-3" />}
                  {ADMIN_SECTION_LABELS[key]}
                </button>
              ))}
            </div>
          </div>

          <button type="submit" className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium transition-all">
            Create Account
          </button>
        </motion.form>
      )}

      <div className="space-y-3">
        <h2 className="text-sm font-medium text-white flex items-center gap-2">
          <Users className="w-4 h-4 text-amber-400" /> All Users
        </h2>

        {registeredUsers.length === 0 && managedUsers.length === 0 ? (
          <div className="p-10 rounded-xl border border-gray-800 bg-gray-900/50 text-center">
            <Users className="w-12 h-12 mx-auto mb-3 text-gray-700" />
            <p className="text-gray-500 text-sm">No users yet.</p>
          </div>
        ) : (
          <>
            {/* Registered users (from sign-up) */}
            {isOwner && registeredUsers.filter(u => u.role !== 'admin').map(u => (
              <div key={u.id} className="p-4 rounded-xl border border-gray-800 bg-gray-900/50 flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white text-xs font-bold ${
                    u.role === 'owner' ? 'bg-gradient-to-br from-amber-500 to-yellow-600' : 'bg-gradient-to-br from-gray-600 to-gray-700'
                  }`}>
                    {u.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-white">{u.name}</p>
                      <span className="text-xs text-gray-600">@{u.username}</span>
                      {u.role === 'owner' && (
                        <span className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400">
                          <Crown className="w-3 h-3" /> Owner
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                      {u.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{u.email}</span>}
                      <span>{u.position}</span>
                    </div>
                  </div>
                </div>
                {isOwner && u.role !== 'owner' && (
                  <button onClick={() => makeOwner(u.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-amber-400 hover:bg-amber-500/10 border border-amber-500/20 opacity-0 group-hover:opacity-100 transition-all">
                    <Crown className="w-3.5 h-3.5" /> Make Owner
                  </button>
                )}
              </div>
            ))}

            {/* Managed users (from admin panel) */}
            {managedUsers.map(mu => (
              <div key={mu.id} className="p-4 rounded-xl border border-gray-800 bg-gray-900/50 flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center text-white text-xs font-bold">
                    {mu.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-white">{mu.name}</p>
                      <span className="text-xs text-gray-600">@{mu.username}</span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400">{mu.position}</span>
                      {mu.sections?.map(s => (
                        <span key={s} className="text-[10px] px-1.5 py-0.5 rounded bg-gray-800 text-gray-500">{ADMIN_SECTION_LABELS[s]}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <button onClick={() => removeManagedUser(mu.id)}
                  className="p-2 rounded-lg text-red-400 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  )
}
