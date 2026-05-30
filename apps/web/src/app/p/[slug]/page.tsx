'use client'

import { useState, useEffect, use } from 'react'
import { notFound } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import EnhancedContentPage from '@/components/EnhancedContentPage'

type CustomPage = {
  id: string; title: string; slug: string; content: string; published: boolean
}

export default function CustomPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const [page, setPage] = useState<CustomPage | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('cybrion_custom_pages')
    if (stored) {
      try {
        const pages: CustomPage[] = JSON.parse(stored)
        const found = pages.find(p => p.slug === slug && p.published)
        setPage(found || null)
      } catch {}
    }
    setLoading(false)
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-cyan-400 animate-spin" />
      </div>
    )
  }

  if (!page) return notFound()

  return (
    <EnhancedContentPage
      title={page.title}
      content={page.content}
      logo
    />
  )
}
