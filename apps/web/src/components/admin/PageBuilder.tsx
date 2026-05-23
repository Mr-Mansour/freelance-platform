'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, X, Globe, Trash2, Edit3, Eye } from 'lucide-react'

type CustomPage = {
  id: string
  title: string
  slug: string
  content: string
  published: boolean
  createdAt: number
  updatedAt: number
}

function loadPages(): CustomPage[] {
  const stored = localStorage.getItem('cybrion_custom_pages')
  if (stored) { try { return JSON.parse(stored) } catch {} }
  return []
}

function savePages(pages: CustomPage[]) {
  localStorage.setItem('cybrion_custom_pages', JSON.stringify(pages))
}

export default function PageBuilder() {
  const [pages, setPages] = useState<CustomPage[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [content, setContent] = useState('')

  useEffect(() => { setPages(loadPages()) }, [])

  const refresh = () => setPages(loadPages())

  const openNew = () => {
    setEditingId(null); setTitle(''); setSlug(''); setContent(''); setShowForm(true)
  }

  const openEdit = (p: CustomPage) => {
    setEditingId(p.id); setTitle(p.title); setSlug(p.slug); setContent(p.content); setShowForm(true)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !slug.trim() || !content.trim()) return
    const cleanSlug = slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/--+/g, '-').replace(/^-|-$/g, '')
    const now = Date.now()

    if (editingId) {
      const updated = loadPages().map(p => p.id === editingId ? { ...p, title: title.trim(), slug: cleanSlug, content: content.trim(), updatedAt: now } : p)
      savePages(updated)
    } else {
      const newPage: CustomPage = {
        id: `page_${now}`,
        title: title.trim(),
        slug: cleanSlug,
        content: content.trim(),
        published: true,
        createdAt: now,
        updatedAt: now,
      }
      savePages([...loadPages(), newPage])
    }
    refresh(); setShowForm(false)
  }

  const togglePublish = (id: string) => {
    const updated = loadPages().map(p => p.id === id ? { ...p, published: !p.published } : p)
    savePages(updated); refresh()
  }

  const removePage = (id: string) => {
    const updated = loadPages().filter(p => p.id !== id)
    savePages(updated); refresh()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-white">Page Builder</h2>
          <p className="text-sm text-gray-500">Create custom pages that get published instantly</p>
        </div>
        <button onClick={openNew}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-medium transition-all">
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? 'Cancel' : 'New Page'}
        </button>
      </div>

      {showForm && (
        <motion.form
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          onSubmit={handleSave}
          className="p-6 rounded-xl border border-gray-800 bg-gray-900/50 mb-6 space-y-4"
        >
          <h3 className="text-sm font-medium text-white">{editingId ? 'Edit Page' : 'Create New Page'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Page Title</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-cyan-500/50"
                placeholder="Privacy Policy" required />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">URL Slug</label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600">/p/</span>
                <input type="text" value={slug} onChange={e => setSlug(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-cyan-500/50"
                  placeholder="privacy-policy" required />
              </div>
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Page Content (HTML / Markdown)</label>
            <textarea value={content} onChange={e => setContent(e.target.value)} rows={12}
              className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm font-mono focus:outline-none focus:border-cyan-500/50 resize-y"
              placeholder="<h1>Welcome</h1><p>Page content here...</p>" />
          </div>
          <button type="submit"
            className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-medium transition-all">
            {editingId ? 'Update Page' : 'Publish Page'}
          </button>
        </motion.form>
      )}

      <div className="space-y-3">
        {pages.length === 0 ? (
          <div className="p-6 rounded-xl border border-gray-800 bg-gray-900/50 text-center">
            <Globe className="w-10 h-10 mx-auto mb-3 text-gray-700" />
            <p className="text-gray-500 text-sm">No pages yet. Create your first page!</p>
          </div>
        ) : (
          pages.map((p) => (
            <div key={p.id} className="p-4 rounded-xl border border-gray-800 bg-gray-900/50 flex items-center justify-between group">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-white truncate">{p.title}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${p.published ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                    {p.published ? 'Published' : 'Draft'}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mt-0.5">/p/{p.slug}</p>
              </div>
              <div className="flex items-center gap-1">
                <a href={`/p/${p.slug}`} target="_blank" rel="noopener noreferrer"
                  className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-gray-800 transition-all">
                  <Eye className="w-4 h-4" />
                </a>
                <button onClick={() => openEdit(p)}
                  className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-gray-800 transition-all">
                  <Edit3 className="w-4 h-4" />
                </button>
                <button onClick={() => togglePublish(p.id)}
                  className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-gray-800 transition-all">
                  <Globe className="w-4 h-4" />
                </button>
                <button onClick={() => removePage(p.id)}
                  className="p-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-all">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
