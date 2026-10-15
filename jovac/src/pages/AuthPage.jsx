import { useState, useCallback } from 'react'
import BgOrbs from '../components/BgOrbs.jsx'
import LoginForm from '../components/LoginForm.jsx'
import RegisterForm from '../components/RegisterForm.jsx'
import Toast from '../components/Toast.jsx'

const LogoSVG = () => (
  <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect width="44" height="44" rx="14" fill="url(#logoGrad)"/>
    <path d="M13 22L22 13L31 22L22 31L13 22Z" stroke="white" strokeWidth="2.5" strokeLinejoin="round"/>
    <circle cx="22" cy="22" r="4" fill="white"/>
    <defs>
      <linearGradient id="logoGrad" x1="0" y1="0" x2="44" y2="44" gradientUnits="userSpaceOnUse">
        <stop stopColor="#818CF8"/>
        <stop offset="1" stopColor="#6366F1"/>
      </linearGradient>
    </defs>
  </svg>
)

export default function AuthPage() {
  const [tab, setTab]     = useState('login') // 'login' | 'register'
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now()
    setToasts(t => [...t, { id, message, type }])
  }, [])

  const removeToast = useCallback(id => {
    setToasts(t => t.filter(x => x.id !== id))
  }, [])

  return (
    <>
      <BgOrbs />

      {/* Toast container */}
      <div className="toast-container" aria-live="polite">
        {toasts.map(t => (
          <Toast key={t.id} message={t.message} type={t.type} onClose={() => removeToast(t.id)} />
        ))}
      </div>

      <main className="auth-container" role="main">

        {/* ── Brand panel ── */}
        <section className="brand-panel" aria-label="Brand information">
          <div className="brand-content">
            <div className="brand-logo">
              <LogoSVG />
              <span className="brand-name">Job Bridge</span>
            </div>

            <div className="brand-hero">
              <h1 className="brand-title">
                Welcome to<br/>
                <span className="gradient-text">your workspace.</span>
              </h1>
              <p className="brand-subtitle">
                Connect, collaborate, and accelerate your career with JOVAC — the platform built for growth.
              </p>
            </div>

            <ul className="feature-list" aria-label="Platform features">
              {[
                'Smart job matching powered by AI',
                'Real-time collaboration tools',
                'Progress tracking & career insights',
              ].map(f => (
                <li key={f} className="feature-item">
                  <span className="feature-icon" aria-hidden="true">✦</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── Form panel ── */}
        <section className="form-panel" aria-label="Authentication forms">
          <div className="form-card">

            {/* Tab switcher */}
            <div className="tab-switcher" role="tablist" aria-label="Authentication tabs">
              <button
                className={`tab-btn${tab === 'login' ? ' active' : ''}`}
                id="tab-login"
                role="tab"
                aria-selected={tab === 'login'}
                aria-controls="panel-login"
                onClick={() => setTab('login')}
              >Sign In</button>
              <button
                className={`tab-btn${tab === 'register' ? ' active' : ''}`}
                id="tab-register"
                role="tab"
                aria-selected={tab === 'register'}
                aria-controls="panel-register"
                onClick={() => setTab('register')}
              >Create Account</button>
              <div className={`tab-indicator${tab === 'register' ? ' right' : ''}`} aria-hidden="true" />
            </div>

            {/* Login panel */}
            {tab === 'login' && (
              <div id="panel-login" role="tabpanel" aria-labelledby="tab-login">
                <div className="form-header">
                  <h2 className="form-title">Welcome back</h2>
                  <p className="form-subtitle">Enter your credentials to access your account.</p>
                </div>
                <LoginForm onToast={addToast} />
                <p className="switch-prompt" style={{ marginTop: '20px' }}>
                  Don't have an account?{' '}
                  <button type="button" className="switch-link" onClick={() => setTab('register')}>
                    Create one for free →
                  </button>
                </p>
              </div>
            )}

            {/* Register panel */}
            {tab === 'register' && (
              <div id="panel-register" role="tabpanel" aria-labelledby="tab-register">
                <div className="form-header">
                  <h2 className="form-title">Create your account</h2>
                  <p className="form-subtitle">Join thousands of professionals already on JOVAC.</p>
                </div>
                <RegisterForm onToast={addToast} />
                <p className="switch-prompt" style={{ marginTop: '20px' }}>
                  Already have an account?{' '}
                  <button type="button" className="switch-link" onClick={() => setTab('login')}>
                    Sign in instead →
                  </button>
                </p>
              </div>
            )}

          </div>
        </section>

      </main>
    </>
  )
}
