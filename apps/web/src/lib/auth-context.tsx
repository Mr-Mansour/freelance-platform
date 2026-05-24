'use client'

import { createContext, useContext, useState, useEffect, useCallback } from 'react'

export type UserRole = 'owner' | 'admin' | 'user'

export const ADMIN_SECTIONS = [
  'overview', 'chat', 'meetings', 'review', 'sales', 'service', 'pages', 'access',
  'analytics', 'disputes', 'moderation',
] as const
export type AdminSection = (typeof ADMIN_SECTIONS)[number]
export const ADMIN_SECTION_LABELS: Record<AdminSection, string> = {
  overview: 'Overview Dashboard', chat: 'Messages', meetings: 'Meetings',
  review: 'Review', sales: 'Sales', service: 'Service Team', pages: 'Pages', access: 'Access Control',
  analytics: 'Analytics', disputes: 'Disputes', moderation: 'Content Moderation',
}

export type RegisteredUser = {
  id: string
  name: string
  username: string
  email: string
  password: string
  role: UserRole
  position: string
}

export type ManagedUser = {
  id: string
  username: string
  password: string
  name: string
  email?: string
  position: string
  sections: AdminSection[]
}

export type User = {
  id: string
  name: string
  username: string
  email?: string
  avatar: string | null
  title: string
  initials: string
  role: UserRole
  position: string
  sections: AdminSection[]
}

type AuthContextType = {
  user: User | null
  loading: boolean
  signIn: (username: string, password: string) => Promise<boolean>
  signUp: (name: string, username: string, password: string, email?: string) => Promise<boolean>
  signOut: () => void
  forgotPassword: (username: string) => string | null
  managedUsers: ManagedUser[]
  registeredUsers: RegisteredUser[]
  addManagedUser: (u: ManagedUser) => void
  removeManagedUser: (id: string) => void
  updateManagedUser: (id: string, data: Partial<ManagedUser>) => void
  makeOwner: (id: string) => void
}

const AuthContext = createContext<AuthContextType>({
  user: null, loading: true,
  signIn: async () => false, signUp: async () => false, signOut: () => {},
  forgotPassword: () => null,
  managedUsers: [], registeredUsers: [],
  addManagedUser: () => {}, removeManagedUser: () => {}, updateManagedUser: () => {}, makeOwner: () => {},
})

const OWNER_USERNAMES = ['Qan', 'owner']
const OWNER_PASSWORD = 'TachOWNER159357'

function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [managedUsers, setManagedUsers] = useState<ManagedUser[]>([])
  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUser[]>([])

  useEffect(() => {
    const stored = localStorage.getItem('cybrion_user')
    if (stored) {
      try { setUser(JSON.parse(stored)) } catch { localStorage.removeItem('cybrion_user') }
    }
    const storedUsers = localStorage.getItem('cybrion_managed_users')
    if (storedUsers) {
      try { setManagedUsers(JSON.parse(storedUsers)) } catch { localStorage.removeItem('cybrion_managed_users') }
    }
    const storedAll = localStorage.getItem('cybrion_all_users')
    if (storedAll) {
      try { setRegisteredUsers(JSON.parse(storedAll)) } catch { localStorage.removeItem('cybrion_all_users') }
    }
    setLoading(false)
  }, [])

  const saveManagedUsers = useCallback((users: ManagedUser[]) => {
    setManagedUsers(users)
    localStorage.setItem('cybrion_managed_users', JSON.stringify(users))
  }, [])

  const saveRegisteredUsers = useCallback((users: RegisteredUser[]) => {
    setRegisteredUsers(users)
    localStorage.setItem('cybrion_all_users', JSON.stringify(users))
  }, [])

  const registerUser = useCallback((u: RegisteredUser) => {
    const all = [...registeredUsers.filter(r => r.id !== u.id), u]
    saveRegisteredUsers(all)
  }, [registeredUsers, saveRegisteredUsers])

  const signIn = useCallback(async (username: string, password: string): Promise<boolean> => {
    await new Promise(r => setTimeout(r, 400))

    if (OWNER_USERNAMES.includes(username) && password === OWNER_PASSWORD) {
      const owner: User = {
        id: 'owner', name: 'Qan', username: 'Qan',
        avatar: null, title: 'Founder & CEO', initials: 'QN',
        role: 'owner', position: 'Founder & CEO of CYBRION',
        sections: [...ADMIN_SECTIONS],
      }
      setUser(owner); localStorage.setItem('cybrion_user', JSON.stringify(owner))
      return true
    }

    // Check registered users (regular sign-ups)
    const regMatch = registeredUsers.find(u => u.username === username && u.password === password)
    if (regMatch) {
      const u: User = {
        id: regMatch.id, name: regMatch.name, username: regMatch.username,
        email: regMatch.email,
        avatar: null, title: regMatch.position || 'Freelancer',
        initials: getInitials(regMatch.name),
        role: regMatch.role || 'user',
        position: regMatch.position || 'Freelancer',
        sections: regMatch.role === 'owner' ? [...ADMIN_SECTIONS] : [],
      }
      setUser(u); localStorage.setItem('cybrion_user', JSON.stringify(u))
      return true
    }

    const storedUsers = localStorage.getItem('cybrion_managed_users')
    if (storedUsers) {
      try {
        const managed: ManagedUser[] = JSON.parse(storedUsers)
        const match = managed.find(u => u.username === username && u.password === password)
        if (match) {
          const adminUser: User = {
            id: match.id, name: match.name, username: match.username,
            email: match.email,
            avatar: null, title: match.position, initials: getInitials(match.name),
            role: 'admin', position: match.position, sections: match.sections || [],
          }
          setUser(adminUser); localStorage.setItem('cybrion_user', JSON.stringify(adminUser))
          return true
        }
      } catch {}
    }

    return false
  }, [registeredUsers])

  const signUp = useCallback(async (name: string, username: string, password: string, email?: string): Promise<boolean> => {
    // Record signup event
    try {
      await fetch('/api/stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'signup', description: `New user registered: ${name} (${username})`, userName: name }),
      })
    } catch {}
    await new Promise(r => setTimeout(r, 400))

    if (OWNER_USERNAMES.includes(username) && password === OWNER_PASSWORD) {
      const owner: User = {
        id: 'owner', name: 'Qan', username: 'Qan',
        avatar: null, title: 'Founder & CEO', initials: 'QN',
        role: 'owner', position: 'Founder & CEO of CYBRION',
        sections: [...ADMIN_SECTIONS],
      }
      setUser(owner); localStorage.setItem('cybrion_user', JSON.stringify(owner))
      return true
    }

    const newId = `u${Date.now()}`
    const regUser: RegisteredUser = {
      id: newId, name, username, email: email || '', password,
      role: 'user', position: 'Freelancer',
    }
    registerUser(regUser)

    const newUser: User = {
      id: newId, name, username, email,
      avatar: null, title: 'Freelancer', initials: getInitials(name),
      role: 'user', position: 'Freelancer', sections: [],
    }
    setUser(newUser); localStorage.setItem('cybrion_user', JSON.stringify(newUser))
    return true
  }, [registerUser])

  const signOut = useCallback(() => {
    setUser(null); localStorage.removeItem('cybrion_user')
  }, [])

  const forgotPassword = useCallback((username: string): string | null => {
    // Check managed users first
    const managed = managedUsers.find(u => u.username === username)
    if (managed) return managed.password

    // Check registered users
    const reg = registeredUsers.find(u => u.username === username)
    if (reg) return reg.password

    // Check owner
    if (OWNER_USERNAMES.includes(username)) return OWNER_PASSWORD

    return null
  }, [managedUsers, registeredUsers])

  const addManagedUser = useCallback((u: ManagedUser) => {
    saveManagedUsers([...managedUsers, u])
    if (u.email) {
      registerUser({
        id: u.id, name: u.name, username: u.username,
        email: u.email, password: u.password, role: 'admin', position: u.position,
      })
    }
  }, [managedUsers, saveManagedUsers, registerUser])

  const removeManagedUser = useCallback((id: string) => {
    saveManagedUsers(managedUsers.filter(u => u.id !== id))
    saveRegisteredUsers(registeredUsers.filter(u => u.id !== id))
  }, [managedUsers, saveManagedUsers, registeredUsers, saveRegisteredUsers])

  const updateManagedUser = useCallback((id: string, data: Partial<ManagedUser>) => {
    saveManagedUsers(managedUsers.map(u => u.id === id ? { ...u, ...data } : u))
  }, [managedUsers, saveManagedUsers])

  const makeOwner = useCallback((id: string) => {
    const updated = registeredUsers.map(u =>
      u.id === id ? { ...u, role: 'owner' as UserRole, position: 'Owner' } : u
    )
    saveRegisteredUsers(updated)
    // Also update managed users if applicable
    saveManagedUsers(managedUsers.map(u =>
      u.id === id ? { ...u, sections: [...ADMIN_SECTIONS] } : u
    ))
  }, [registeredUsers, saveRegisteredUsers, managedUsers, saveManagedUsers])

  return (
    <AuthContext.Provider value={{
      user, loading, signIn, signUp, signOut, forgotPassword,
      managedUsers, registeredUsers,
      addManagedUser, removeManagedUser, updateManagedUser, makeOwner,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
