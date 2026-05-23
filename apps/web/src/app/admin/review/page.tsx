'use client'

import { useState } from 'react'
import { Star, ThumbsUp, MessageCircle, Search } from 'lucide-react'

type Review = {
  id: string; author: string; text: string; rating: number; status: 'pending' | 'approved' | 'rejected'; date: string
}

const MOCK_REVIEWS: Review[] = [
  { id: 'r1', author: 'Sarah Johnson', text: 'Excellent platform! Found the perfect developer for my project within days.', rating: 5, status: 'approved', date: '2026-05-15' },
  { id: 'r2', author: 'Mike Chen', text: 'Great experience. The AI matching saved me hours of searching.', rating: 4, status: 'approved', date: '2026-05-14' },
  { id: 'r3', author: 'Emma Wilson', text: 'Payment was smooth and secure. Will definitely use again.', rating: 5, status: 'pending', date: '2026-05-13' },
  { id: 'r4', author: 'Alex Rivera', text: 'Had some issues with communication but support team resolved it quickly.', rating: 3, status: 'pending', date: '2026-05-12' },
]

export default function ReviewPage() {
  const [reviews, setReviews] = useState<Review[]>(MOCK_REVIEWS)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')

  const filtered = reviews.filter(r => {
    if (filter !== 'all' && r.status !== filter) return false
    if (search && !r.text.toLowerCase().includes(search.toLowerCase()) && !r.author.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const updateStatus = (id: string, status: 'approved' | 'rejected') => {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, status } : r))
  }

  const pending = reviews.filter(r => r.status === 'pending').length

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">⭐ Reviews</h1>
          <p className="text-sm text-gray-500 mt-1">
            {pending > 0 ? `${pending} pending review${pending > 1 ? 's' : ''} awaiting moderation` : 'All reviews moderated'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search reviews..."
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-gray-900 border border-gray-800 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-amber-500/50" />
        </div>
        <div className="flex gap-1">
          {(['all', 'pending', 'approved', 'rejected'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${
                filter === f ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' : 'text-gray-500 hover:text-white hover:bg-gray-800/50'
              }`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filtered.map(review => (
          <div key={review.id} className={`p-4 rounded-xl border ${review.status === 'pending' ? 'border-amber-500/30 bg-amber-500/5' : 'border-gray-800 bg-gray-900/50'}`}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-medium text-white">{review.author}</p>
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-700'}`} />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-400">{review.text}</p>
                <p className="text-xs text-gray-600 mt-2">{review.date}</p>
              </div>
              <div className="flex items-center gap-2 ml-4">
                {review.status === 'pending' && (
                  <>
                    <button onClick={() => updateStatus(review.id, 'approved')}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs transition-all">
                      <ThumbsUp className="w-3 h-3" /> Approve
                    </button>
                    <button onClick={() => updateStatus(review.id, 'rejected')}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs transition-all">
                      Reject
                    </button>
                  </>
                )}
                {review.status === 'approved' && (
                  <span className="text-xs px-2 py-1 rounded bg-emerald-500/10 text-emerald-400">Approved</span>
                )}
                {review.status === 'rejected' && (
                  <span className="text-xs px-2 py-1 rounded bg-red-500/10 text-red-400">Rejected</span>
                )}
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="p-10 rounded-xl border border-gray-800 bg-gray-900/50 text-center">
            <Star className="w-12 h-12 mx-auto mb-3 text-gray-700" />
            <p className="text-gray-500 text-sm">No reviews match your filter.</p>
          </div>
        )}
      </div>
    </div>
  )
}
