import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PasswordInput from '../components/PasswordInput.jsx'

const isEmail = str => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str)

export default function LoginForm({ onToast }) {
  const navigate = useNavigate()
  const [form, setForm]     = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const set = field => e => setForm(f => ({ ...f, [field]: e.target.value }))

  const validate = () => {
    const errs = {}
    if (!form.email)          errs.email    = 'Email is required.'
    else if (!isEmail(form.email)) errs.email = 'Enter a valid email.'
    if (!form.password)       errs.password = 'Password is required.'
    return errs
  }

  const handleSubmit = e => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setLoading(true)

    setTimeout(() => {
      // Check against localStorage users
      const users = JSON.parse(localStorage.getItem('jovac_users') || '[]')
      const found = users.find(u => u.email === form.email.toLowerCase())

      if (!found || found.password !== form.password) {
        setErrors({ general: 'Invalid email or password.' })
        onToast('Invalid email or password.', 'error')
        setLoading(false)
        return
      }

      // Store session
      localStorage.setItem('jovac_user', JSON.stringify({
        id: found.id,
        full_name: found.full_name,
        email: found.email,
      }))

      onToast(`Welcome back, ${found.full_name.split(' ')[0]}! 🎉`, 'success')
      setTimeout(() => navigate('/dashboard'), 800)
      setLoading(false)
    }, 900)
  }

  return (
    <form id="login-form" className="auth-form" onSubmit={handleSubmit} noValidate>

      {/* Email */}
      <div className="input-group">
        <label htmlFor="login-email" className="input-label">Email address</label>
        <div className="input-wrapper">
          <span className="input-icon" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2"/>
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
            </svg>
          </span>
          <input
            type="email" id="login-email" name="email"
            className={`auth-input${errors.email ? ' error-field' : ''}`}
            placeholder="you@example.com"
            autoComplete="email"
            value={form.email}
            onChange={set('email')}
            aria-describedby="login-email-error"
          />
        </div>
        <span className="field-error" id="login-email-error">{errors.email || ''}</span>
      </div>

      {/* Password */}
      <div className="input-group">
        <div className="label-row">
          <label htmlFor="login-password" className="input-label">Password</label>
          <a href="#" className="forgot-link" id="forgot-password-link">Forgot password?</a>
        </div>
        <PasswordInput
          id="login-password" name="password"
          placeholder="••••••••"
          value={form.password}
          onChange={set('password')}
          error={errors.password}
        />
        <span className="field-error" id="login-password-error">{errors.password || ''}</span>
      </div>

      {/* General error */}
      {errors.general && (
        <span className="field-error" style={{ textAlign: 'center' }}>{errors.general}</span>
      )}

      {/* Submit */}
      <button type="submit" id="login-submit-btn" className={`submit-btn${loading ? ' loading' : ''}`} disabled={loading}>
        <span className="btn-text">Sign In</span>
        <span className="btn-spinner" aria-hidden="true" />
      </button>

      <div className="divider"><span>or continue with</span></div>

      <div className="social-row">
        <button type="button" id="google-login-btn" className="social-btn" aria-label="Sign in with Google"
          onClick={() => onToast('Google login coming soon!', 'info')}>
          <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          <span>Google</span>
        </button>
        <button type="button" id="mobile-login-btn" className="social-btn" aria-label="Sign in with Mobile"
          onClick={() => onToast('Mobile login coming soon!', 'info')}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
            <line x1="12" y1="18" x2="12.01" y2="18"/>
          </svg>
          <span>Mobile</span>
        </button>
      </div>
    </form>
  )
}
