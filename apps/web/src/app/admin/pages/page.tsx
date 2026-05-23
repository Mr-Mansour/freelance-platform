'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, X, Globe, Trash2, Edit3, Eye } from 'lucide-react'

type CustomPage = {
  id: string; title: string; slug: string; content: string; published: boolean; createdAt: number; updatedAt: number
}

const PAGE_TEMPLATES = [
  { title: 'Privacy Policy', slug: 'privacy-policy', content: '<h1>Privacy Policy</h1><p>Your privacy is important to us. This policy outlines how we collect, use, and protect your personal information.</p><h2>Information We Collect</h2><p>We collect information you provide directly to us, such as when you create an account, post a project, or communicate with other users.</p><h2>How We Use Your Information</h2><p>We use your information to provide, maintain, and improve our services, process transactions, and communicate with you.</p><h2>Data Protection</h2><p>We implement industry-standard security measures to protect your data.</p><h2>Contact</h2><p>For any privacy-related inquiries, contact us through our support channels.</p>' },
  { title: 'Terms of Service', slug: 'terms-of-service', content: '<h1>Terms of Service</h1><p>By using Cybrion, you agree to these terms. Please read them carefully.</p><h2>Acceptance of Terms</h2><p>By accessing and using this platform, you accept and agree to be bound by these terms.</p><h2>User Responsibilities</h2><p>Users are responsible for maintaining the confidentiality of their account credentials and for all activities under their account.</p><h2>Payment Terms</h2><p>All payments are processed securely through our escrow system. Funds are released only when work is approved by both parties.</p><h2>Termination</h2><p>We reserve the right to suspend or terminate accounts that violate these terms.</p>' },
  { title: 'Cookie Policy', slug: 'cookie-policy', content: '<h1>Cookie Policy</h1><p>This Cookie Policy explains how Cybrion uses cookies and similar technologies.</p><h2>What Are Cookies</h2><p>Cookies are small text files stored on your device when you visit a website.</p><h2>How We Use Cookies</h2><p>We use cookies to improve your experience, analyze traffic, and provide personalized content.</p><h2>Managing Cookies</h2><p>You can control and manage cookies in your browser settings.</p>' },
  { title: 'GDPR Compliance', slug: 'gdpr', content: '<h1>GDPR Compliance</h1><p>We are committed to protecting the privacy rights of individuals in the European Union.</p><h2>Your Rights</h2><p>Under GDPR, you have the right to access, rectify, erase, and port your data.</p><h2>Data Processing</h2><p>We process personal data only for specified, explicit, and legitimate purposes.</p><h2>Data Protection Officer</h2><p>Contact our DPO for any GDPR-related inquiries.</p>' },
  { title: 'Data Processing Agreement', slug: 'dpa', content: '<h1>Data Processing Agreement</h1><p>This Data Processing Agreement governs the processing of personal data by Cybrion on behalf of its users.</p><h2>Scope</h2><p>This DPA applies to all processing of personal data carried out by Cybrion.</p><h2>Security Measures</h2><p>We implement appropriate technical and organizational measures to ensure data security.</p><h2>Sub-processors</h2><p>We maintain a list of authorized sub-processors and will notify you of any changes.</p>' },
]

function loadPages(): CustomPage[] {
  const stored = localStorage.getItem('cybrion_custom_pages')
  if (stored) { try { return JSON.parse(stored) } catch {} }
  return []
}

function savePages(pages: CustomPage[]) {
  localStorage.setItem('cybrion_custom_pages', JSON.stringify(pages))
}

export default function PagesPage() {
  const [pages, setPages] = useState<CustomPage[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [content, setContent] = useState('')

  useEffect(() => { setPages(loadPages()) }, [])

  const refresh = () => setPages(loadPages())

  const openNew = (template?: typeof PAGE_TEMPLATES[0]) => {
    setEditingId(null)
    setTitle(template?.title || '')
    setSlug(template?.slug || '')
    setContent(template?.content || '')
    setShowForm(true)
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
      savePages(loadPages().map(p => p.id === editingId ? { ...p, title: title.trim(), slug: cleanSlug, content: content.trim(), updatedAt: now } : p))
    } else {
      savePages([...loadPages(), { id: `page_${now}`, title: title.trim(), slug: cleanSlug, content: content.trim(), published: true, createdAt: now, updatedAt: now }])
    }
    refresh(); setShowForm(false)
  }

  const togglePublish = (id: string) => {
    savePages(loadPages().map(p => p.id === id ? { ...p, published: !p.published } : p)); refresh()
  }

  const removePage = (id: string) => {
    savePages(loadPages().filter(p => p.id !== id)); refresh()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">📄 Pages</h1>
          <p className="text-sm text-gray-500 mt-1">Create legal pages and content — Privacy Policy, Terms, GDPR, and more</p>
        </div>
        <button onClick={() => { openNew(); setShowForm(!showForm) }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium transition-all">
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? 'Cancel' : 'New Page'}
        </button>
      </div>

      {/* Templates */}
      <div className="mb-6">
        <h2 className="text-xs text-gray-600 uppercase tracking-wider mb-3">Quick Templates</h2>
        <div className="flex flex-wrap gap-2">
          {PAGE_TEMPLATES.map(t => (
            <button key={t.slug} onClick={() => openNew(t)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white text-xs transition-all border border-gray-700 hover:border-amber-500/30">
              <Plus className="w-3 h-3" />
              {t.title}
            </button>
          ))}
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <motion.form
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          onSubmit={handleSave}
          className="p-6 rounded-xl border border-gray-800 bg-gray-900/50 mb-6 space-y-4"
        >
          <h3 className="text-sm font-medium text-white">{editingId ? 'Edit Page' : 'Create Page'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Title</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-amber-500/50" required />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Slug</label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600">/p/</span>
                <input type="text" value={slug} onChange={e => setSlug(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-amber-500/50" required />
              </div>
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Content (HTML)</label>
            <textarea value={content} onChange={e => setContent(e.target.value)} rows={14}
              className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm font-mono focus:outline-none focus:border-amber-500/50 resize-y" />
          </div>
          <button type="submit" className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium transition-all">
            {editingId ? 'Update' : 'Publish'}
          </button>
        </motion.form>
      )}

      {/* Pages List */}
      <div className="space-y-3">
        {pages.length === 0 ? (
          <div className="p-10 rounded-xl border border-gray-800 bg-gray-900/50 text-center">
            <Globe className="w-12 h-12 mx-auto mb-3 text-gray-700" />
            <p className="text-gray-500 text-sm">No pages yet. Use the templates or create a custom page.</p>
          </div>
        ) : (
          pages.map(p => (
            <div key={p.id} className="p-4 rounded-xl border border-gray-800 bg-gray-900/50 flex items-center justify-between group">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-white truncate">{p.title}</p>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${p.published ? 'bg-emerald-500/10 text-emerald-400' : 'bg-gray-500/10 text-gray-400'}`}>
                    {p.published ? 'Live' : 'Draft'}
                  </span>
                </div>
                <p className="text-[10px] text-gray-600 mt-0.5">/p/{p.slug}</p>
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

      <div className="mt-6 p-4 rounded-xl border border-amber-500/20 bg-amber-500/5">
        <p className="text-xs text-amber-400/80">
          Pages are published at <code className="text-amber-300">/p/[slug]</code>. You can edit or unpublish any page at any time.
          Use the quick templates above to generate standard legal pages and customize them.
        </p>
      </div>
    </div>
  )
}
