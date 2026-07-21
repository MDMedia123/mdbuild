import React, { useState, useEffect } from 'react'
import axios from 'axios'

function BlogManager() {
  const [posts, setPosts] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({ title: '', content: '', excerpt: '', status: 'draft', featured: false })
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadPosts()
  }, [])

  const loadPosts = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get('/api/blog/posts?status=all', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setPosts(response.data)
    } catch (error) {
      console.error('Error loading posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem('token')

    try {
      if (editingId) {
        await axios.put(`/api/blog/posts/${editingId}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setMessage('Post updated!')
      } else {
        await axios.post('/api/blog/posts', formData, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setMessage('Post created!')
      }
      setFormData({ title: '', content: '', excerpt: '', status: 'draft', featured: false })
      setEditingId(null)
      setShowForm(false)
      loadPosts()
    } catch (error) {
      setMessage('Error saving post')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this post?')) return
    const token = localStorage.getItem('token')

    try {
      await axios.delete(`/api/blog/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setMessage('Post deleted!')
      loadPosts()
    } catch (error) {
      setMessage('Error deleting post')
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <div className="card-header">
        <h2>Blog Posts</h2>
        <button className="primary" onClick={() => { setShowForm(!showForm); setEditingId(null); }}>
          {showForm ? 'Cancel' : '+ New Post'}
        </button>
      </div>

      {message && <div className={`alert ${message.includes('Error') ? 'error' : 'success'}`}>{message}</div>}

      {showForm && (
        <div className="card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Content</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Excerpt</label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                placeholder="Brief summary"
              />
            </div>

            <div className="form-group">
              <label>Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>

            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                />
                Featured Post
              </label>
            </div>

            <div className="button-group">
              <button type="submit" className="primary">Save Post</button>
              <button type="button" className="secondary" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Featured</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id}>
                <td>{post.title}</td>
                <td><span className={`status-badge ${post.status}`}>{post.status}</span></td>
                <td>{post.featured ? '✓' : '—'}</td>
                <td>
                  <button className="secondary" style={{ padding: '6px 12px', fontSize: '12px' }}>Edit</button>
                  <button className="secondary" onClick={() => handleDelete(post.id)} style={{ padding: '6px 12px', fontSize: '12px', marginLeft: '8px' }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default BlogManager
