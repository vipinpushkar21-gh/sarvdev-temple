"use client"

import { useEffect, useState } from 'react'

type ForumPost = {
  _id: string
  title: string
  category: string
  authorName: string
  likes: number
  views: number
  replies: { _id: string }[]
  isPinned: boolean
  isApproved: boolean
  createdAt: string
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  return `${days}d ago`
}

export default function AdminForumPage() {
  const [posts, setPosts] = useState<ForumPost[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)

  useEffect(() => { fetchPosts() }, [])

  async function fetchPosts() {
    setLoading(true)
    try {
      const res = await fetch('/api/forum?limit=50')
      const data = await res.json()
      setPosts(data.posts || [])
      setPages(data.pages || 1)
    } catch { /* noop */ }
    finally { setLoading(false) }
  }

  async function togglePin(id: string, isPinned: boolean) {
    await fetch(`/api/forum/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'admin', isPinned: !isPinned, isApproved: true }),
    })
    setPosts(p => p.map(x => x._id === id ? { ...x, isPinned: !isPinned } : x))
  }

  async function toggleApprove(id: string, isApproved: boolean) {
    await fetch(`/api/forum/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'admin', isPinned: false, isApproved: !isApproved }),
    })
    setPosts(p => p.map(x => x._id === id ? { ...x, isApproved: !isApproved } : x))
  }

  async function deletePost(id: string) {
    if (!confirm('Delete this forum post?')) return
    const res = await fetch(`/api/forum/${id}`, { method: 'DELETE' })
    if (res.ok) setPosts(p => p.filter(x => x._id !== id))
  }

  const filtered = posts.filter(p =>
    !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.authorName.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return (
    <div className="space-y-5">
      <h1 className="admin-page-title">Community Forum</h1>
      <div className="animate-pulse space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-12 bg-gray-100 rounded-xl" />)}</div>
    </div>
  )

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="admin-page-title">Community Forum</h1>
          <p className="admin-section-subtitle">{posts.length} total posts · {filtered.length} shown</p>
        </div>
        <a href="/forum" target="_blank" className="admin-btn admin-btn-ghost">View Forum →</a>
      </div>

      <div className="admin-filter-bar">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search title or author..."
          className="admin-input max-w-sm"
        />
      </div>

      <div className="admin-table-wrap">
        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Author</th>
                <th>Replies</th>
                <th>Likes</th>
                <th>Posted</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(post => (
                <tr key={post._id}>
                  <td className="font-medium text-gray-900 max-w-xs">
                    <a href={`/forum/${post._id}`} target="_blank" className="hover:text-orange-600 transition-colors line-clamp-2">
                      {post.isPinned && <span className="mr-1">📌</span>}
                      {post.title}
                    </a>
                  </td>
                  <td><span className="admin-badge-orange">{post.category}</span></td>
                  <td className="text-gray-500">{post.authorName}</td>
                  <td className="text-gray-500">{post.replies?.length ?? 0}</td>
                  <td className="text-gray-500">{post.likes}</td>
                  <td className="text-gray-500">{timeAgo(post.createdAt)}</td>
                  <td>
                    <span className={post.isApproved ? 'admin-badge-green' : 'admin-badge-yellow'}>
                      {post.isApproved ? 'Approved' : 'Hidden'}
                    </span>
                  </td>
                  <td>
                    <div className="flex gap-1.5 flex-wrap">
                      <button onClick={() => togglePin(post._id, post.isPinned)} className="admin-btn admin-btn-ghost text-xs">
                        {post.isPinned ? 'Unpin' : 'Pin'}
                      </button>
                      <button onClick={() => toggleApprove(post._id, post.isApproved)} className={`admin-btn text-xs ${post.isApproved ? 'admin-btn-primary' : 'admin-btn-success'}`}>
                        {post.isApproved ? 'Hide' : 'Show'}
                      </button>
                      <button onClick={() => deletePost(post._id)} className="admin-btn admin-btn-danger text-xs">Del</button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="px-5 py-10 text-center text-gray-400">No forum posts found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
