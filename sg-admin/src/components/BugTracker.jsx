import React, { useState, useEffect } from 'react'
import axios from 'axios'

function BugTracker() {
  const [bugs, setBugs] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState('all')
  const [formData, setFormData] = useState({ title: '', description: '', severity: 'low', status: 'open' })
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadBugs()
  }, [filter])

  const loadBugs = async () => {
    try {
      const token = localStorage.getItem('token')
      let url = '/api/bugs'
      if (filter !== 'all') {
        url += `?status=${filter}`
      }
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setBugs(response.data)
    } catch (error) {
      console.error('Error loading bugs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem('token')

    try {
      await axios.post('/api/bugs', formData, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setMessage('Bug report created!')
      setFormData({ title: '', description: '', severity: 'low', status: 'open' })
      setShowForm(false)
      loadBugs()
    } catch (error) {
      setMessage('Error creating bug report')
    }
  }

  const updateBugStatus = async (id, newStatus) => {
    const token = localStorage.getItem('token')

    try {
      await axios.put(`/api/bugs/${id}`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      loadBugs()
    } catch (error) {
      setMessage('Error updating bug status')
    }
  }

  if (loading) return <div>Loading...</div>

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return '#dc3545'
      case 'high': return '#fd7e14'
      case 'medium': return '#ffc107'
      case 'low': return '#28a745'
      default: return '#6c757d'
    }
  }

  return (
    <div>
      <div className="card-header">
        <h2>Bug Tracker</h2>
        <button className="primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Report Bug'}
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
              <label>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div className="form-group">
                <label>Severity</label>
                <select
                  value={formData.severity}
                  onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>

              <div className="form-group">
                <label>Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="open">Open</option>
                  <option value="investigating">Investigating</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>
            </div>

            <div className="button-group">
              <button type="submit" className="primary">Submit Report</button>
              <button type="button" className="secondary" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="card" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <button
            className={filter === 'all' ? 'primary' : 'secondary'}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            className={filter === 'open' ? 'primary' : 'secondary'}
            onClick={() => setFilter('open')}
          >
            Open
          </button>
          <button
            className={filter === 'investigating' ? 'primary' : 'secondary'}
            onClick={() => setFilter('investigating')}
          >
            Investigating
          </button>
          <button
            className={filter === 'resolved' ? 'primary' : 'secondary'}
            onClick={() => setFilter('resolved')}
          >
            Resolved
          </button>
        </div>
      </div>

      <div className="card">
        {bugs.length === 0 ? (
          <p style={{ color: '#5B6B69', textAlign: 'center', padding: '20px' }}>No bugs reported</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Severity</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bugs.map((bug) => (
                <tr key={bug.id}>
                  <td>{bug.title}</td>
                  <td>
                    <span style={{
                      display: 'inline-block',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      backgroundColor: getSeverityColor(bug.severity),
                      color: 'white',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      {bug.severity}
                    </span>
                  </td>
                  <td><span className={`status-badge ${bug.status}`}>{bug.status}</span></td>
                  <td>
                    <select
                      value={bug.status}
                      onChange={(e) => updateBugStatus(bug.id, e.target.value)}
                      style={{ padding: '6px', fontSize: '12px' }}
                    >
                      <option value="open">Open</option>
                      <option value="investigating">Investigating</option>
                      <option value="resolved">Resolved</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default BugTracker
