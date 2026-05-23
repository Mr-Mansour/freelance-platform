'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import AdminSidebar from '@/components/admin/AdminSidebar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && (!user || (user.role !== 'owner' && user.role !== 'admin'))) {
      router.push('/sign-in')
    }
  }, [user, loading, router])

  if (loading || !user || (user.role !== 'owner' && user.role !== 'admin')) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <AdminSidebar />
      <div className="ml-16 transition-all duration-200 -mt-16 lg:-mt-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-8">
          {children}
        </div>
      </div>
    </div>
  )
}
