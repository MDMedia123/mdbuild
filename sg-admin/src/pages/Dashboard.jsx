import React, { useState } from 'react'
import BlogManager from '../components/BlogManager'
import StatusDashboard from '../components/StatusDashboard'
import BugTracker from '../components/BugTracker'
import './Dashboard.css'

function Dashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('blog')

  return (
    <div className="dashboard">
      <header className="header">
        <div className="header-left">
          <div className="logo">S&G Admin</div>
          <nav className="header-nav">
            <button
              className={activeTab === 'blog' ? 'active' : ''}
              onClick={() => setActiveTab('blog')}
            >
              Blog
            </button>
            <button
              className={activeTab === 'status' ? 'active' : ''}
              onClick={() => setActiveTab('status')}
            >
              Status
            </button>
            <button
              className={activeTab === 'bugs' ? 'active' : ''}
              onClick={() => setActiveTab('bugs')}
            >
              Bugs
            </button>
          </nav>
        </div>

        <div className="header-right">
          <div className="user-info">
            <div className="username">{user.username}</div>
            <div className="role">{user.role}</div>
          </div>
          <button className="secondary" onClick={onLogout}>Logout</button>
        </div>
      </header>

      <main className="main-content">
        <div className={`section ${activeTab === 'blog' ? 'active' : ''}`}>
          <BlogManager />
        </div>

        <div className={`section ${activeTab === 'status' ? 'active' : ''}`}>
          <StatusDashboard />
        </div>

        <div className={`section ${activeTab === 'bugs' ? 'active' : ''}`}>
          <BugTracker />
        </div>
      </main>
    </div>
  )
}

export default Dashboard
