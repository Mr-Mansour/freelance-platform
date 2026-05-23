'use client'

import { useState, useEffect, use } from 'react'
import { notFound } from 'next/navigation'
import Logo from '@/components/Logo'

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

  if (loading) return null
  if (!page) return notFound()

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Logo size="sm" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-8">{page.title}</h1>
        <div
          className="prose prose-invert max-w-none text-gray-300 [&_h1]:text-white [&_h2]:text-white [&_h3]:text-white [&_a]:text-cyan-400 [&_a]:hover:text-cyan-300 [&_code]:text-cyan-300 [&_code]:bg-gray-800 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_pre]:bg-gray-900 [&_pre]:border [&_pre]:border-gray-800 [&_pre]:rounded-xl [&_blockquote]:border-cyan-500 [&_blockquote]:text-gray-400"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      </div>
    </div>
  )
}
