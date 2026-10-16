import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BgOrbs from '../components/BgOrbs.jsx'

const LogoSVG = () => (
  <svg width="36" height="36" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect width="44" height="44" rx="14" fill="url(#logoGrad2)"/>
    <path d="M13 22L22 13L31 22L22 31L13 22Z" stroke="white" strokeWidth="2.5" strokeLinejoin="round"/>
    <circle cx="22" cy="22" r="4" fill="white"/>
    <defs>
      <linearGradient id="logoGrad2" x1="0" y1="0" x2="44" y2="44" gradientUnits="userSpaceOnUse">
        <stop stopColor="#818CF8"/>
        <stop offset="1" stopColor="#6366F1"/>
      </linearGradient>
    </defs>
  </svg>
)

export default function Dashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [joined, setJoined] = useState('')

  useEffect(() => {
    const stored = localStorage.getItem('jovac_user')
    if (!stored) { navigate('/'); return }
    const u = JSON.parse(stored)
    setUser(u)

    if (u?.created_at) {
      setJoined(new Date(u.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }))
    }

    // Verify session with backend /api/me
    fetch('/api/me', { credentials: 'include' })
      .then(res => {
        if (!res.ok) {
          localStorage.removeItem('jovac_user')
          navigate('/')
        } else {
          return res.json()
        }
      })
      .then(data => {
        if (data?.user) {
          setUser(prev => ({ ...prev, ...data.user }))
          if (data.user.created_at) {
            setJoined(new Date(data.user.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }))
          }
        }
      })
      .catch(() => {
        // If network error during verify, keep cached session
      })
  }, [navigate])

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', { method: 'POST', credentials: 'include' })
    } catch (e) {
      // Ignore network errors on logout
    }
    localStorage.removeItem('jovac_user')
    navigate('/')
  }

  if (!user) return null

  const displayName = user.name || user.full_name || 'User'
  const initials = displayName
    .split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)

  const stats = [
    { icon: '💼', value: '0',   label: 'Jobs Applied' },
    { icon: '👁️', value: '0',   label: 'Profile Views' },
    { icon: '🤝', value: '0',   label: 'Connections' },
    { icon: '⭐', value: '0',   label: 'Saved Jobs' },
  ]

  return (
    <>
      <BgOrbs />
      <div className="dashboard" style={{ position: 'relative', zIndex: 1 }}>

        {/* Navbar */}
        <nav className="dash-nav" aria-label="Dashboard navigation">
          <div className="dash-logo">
            <LogoSVG />
            <span>JobBridge</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div className="dash-avatar" aria-label={`Avatar for ${displayName}`}>
              {initials}
            </div>
            <button
              id="logout-btn"
              className="logout-btn"
              onClick={handleLogout}
              aria-label="Logout"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              Logout
            </button>
          </div>
        </nav>

        {/* Main content */}
        <main className="dash-main">
          <div className="dash-welcome">
            <h1>Good day, {displayName.split(' ')[0]}! 👋</h1>
            <p>Here's your career dashboard overview.</p>
          </div>

          {/* Stats */}
          <div className="stats-grid" role="list" aria-label="Dashboard statistics">
            {stats.map(s => (
              <div key={s.label} className="stat-card" role="listitem">
                <div className="stat-icon" aria-hidden="true">{s.icon}</div>
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>

          {/* User profile card */}
          <div className="user-card" aria-label="User profile">
            <div className="user-avatar-lg" aria-hidden="true">{initials}</div>
            <div className="user-info">
              <h2>{displayName}</h2>
              <p>{user.email}</p>
              {joined && <p style={{ fontSize: '0.82rem', marginBottom: '8px' }}>Joined {joined}</p>}
              <span className="user-badge">
                <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
                  <circle cx="5" cy="5" r="5" fill="#10B981"/>
                </svg>
                Active Account
              </span>
            </div>
          </div>
        </main>

      </div>
    </>
  )
}
