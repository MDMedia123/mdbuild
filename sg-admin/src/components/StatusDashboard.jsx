import React, { useState, useEffect } from 'react'
import axios from 'axios'

function StatusDashboard() {
  const [status, setStatus] = useState({})
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadStatus()
  }, [])

  const loadStatus = async () => {
    try {
      const response = await axios.get('/api/status')
      setStatus(response.data)
    } catch (error) {
      console.error('Error loading status:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (key, value) => {
    const token = localStorage.getItem('token')

    try {
      await axios.put(`/api/status/${key}`, { value }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setMessage('Status updated!')
      loadStatus()
    } catch (error) {
      setMessage('Error updating status')
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <h2>Website Status</h2>
      {message && <div className={`alert ${message.includes('Error') ? 'error' : 'success'}`}>{message}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        <div className="card">
          <h3>Site Health</h3>
          <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#28a745', marginBottom: '10px' }}>✓ OK</div>
          <p style={{ color: '#5B6B69', marginBottom: '15px' }}>All systems operational</p>
          <button className="primary" onClick={() => updateStatus('health', 'OK')}>
            Mark Healthy
          </button>
        </div>

        <div className="card">
          <h3>Maintenance Mode</h3>
          <div style={{ fontSize: '20px', marginBottom: '15px' }}>
            <label>
              <input
                type="checkbox"
                checked={status.maintenance === 'true'}
                onChange={(e) => updateStatus('maintenance', e.target.checked ? 'true' : 'false')}
              />
              Site is under maintenance
            </label>
          </div>
        </div>

        <div className="card">
          <h3>Performance</h3>
          <div style={{ marginBottom: '15px' }}>
            <p><strong>Response Time:</strong> {status.responseTime || 'N/A'}</p>
            <p><strong>Uptime:</strong> {status.uptime || '99.9%'}</p>
          </div>
          <button className="primary" onClick={() => updateStatus('responseTime', 'Optimal')}>
            Update Metrics
          </button>
        </div>
      </div>

      <div className="card" style={{ marginTop: '20px' }}>
        <h3>Quick Actions</h3>
        <div className="button-group">
          <button className="primary" onClick={() => { alert('Backup started!'); }}>Backup Database</button>
          <button className="secondary" onClick={() => { alert('Cache cleared!'); }}>Clear Cache</button>
          <button className="secondary" onClick={() => { alert('Logs exported!'); }}>Export Logs</button>
        </div>
      </div>
    </div>
  )
}

export default StatusDashboard
