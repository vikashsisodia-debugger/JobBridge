import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PasswordInput from '../components/PasswordInput.jsx'

const isEmail = str => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str)

function getStrength(pw) {
  let score = 0
  if (pw.length >= 8) score++
  if (/[A-Z]/.test(pw)) score++
  if (/[0-9]/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  return score
}
const strengthInfo = [
  { label: '', cls: '' },
  { label: 'Weak',   cls: 'weak'   },
  { label: 'Fair',   cls: 'fair'   },
  { label: 'Good',   cls: 'good'   },
  { label: 'Strong', cls: 'strong' },
]

export default function RegisterForm({ onToast }) {
  const navigate  = useNavigate()
  const [form, setForm]     = useState({ firstName: '', lastName: '', email: '', password: '', confirm: '', terms: false })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const strength = form.password ? getStrength(form.password) : 0

  const set = field => e =>
    setForm(f => ({ ...f, [field]: field === 'terms' ? e.target.checked : e.target.value }))

  const validate = () => {
    const errs = {}
    if (!form.firstName.trim() || form.firstName.trim().length < 2) errs.firstName = 'Min 2 characters.'
    if (!form.lastName.trim())  errs.lastName  = 'Last name is required.'
    if (!form.email)            errs.email     = 'Email is required.'
    else if (!isEmail(form.email)) errs.email  = 'Enter a valid email.'
    if (!form.password)         errs.password  = 'Password is required.'
    else if (form.password.length < 6) errs.password = 'Min 6 characters.'
    if (form.password !== form.confirm) errs.confirm = 'Passwords do not match.'
    if (!form.terms)            errs.terms     = 'You must accept the terms.'
    return errs
  }

  const handleSubmit = e => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setLoading(true)

    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem('jovac_users') || '[]')
      if (users.find(u => u.email === form.email.toLowerCase())) {
        setErrors({ email: 'Email is already registered.' })
        onToast('Email is already registered.', 'error')
        setLoading(false)
        return
      }

      const newUser = {
        id: Date.now(),
        full_name: `${form.firstName.trim()} ${form.lastName.trim()}`,
        email: form.email.toLowerCase(),
        password: form.password,
        created_at: new Date().toISOString(),
      }
      users.push(newUser)
      localStorage.setItem('jovac_users', JSON.stringify(users))

      // Auto-login
      localStorage.setItem('jovac_user', JSON.stringify({
        id: newUser.id, full_name: newUser.full_name, email: newUser.email,
      }))

      onToast(`Account created! Welcome, ${newUser.full_name.split(' ')[0]}! 🎉`, 'success')
      setTimeout(() => navigate('/dashboard'), 800)
      setLoading(false)
    }, 900)
  }

  return (
    <form id="register-form" className="auth-form" onSubmit={handleSubmit} noValidate>

      {/* Name row */}
      <div className="name-row">
        <div className="input-group">
          <label htmlFor="reg-fname" className="input-label">First name</label>
          <div className="input-wrapper">
            <span className="input-icon" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
              </svg>
            </span>
            <input type="text" id="reg-fname" name="first_name"
              className={`auth-input${errors.firstName ? ' error-field' : ''}`}
              placeholder="John" autoComplete="given-name"
              value={form.firstName} onChange={set('firstName')} />
          </div>
          <span className="field-error" id="reg-fname-error">{errors.firstName || ''}</span>
        </div>

        <div className="input-group">
          <label htmlFor="reg-lname" className="input-label">Last name</label>
          <div className="input-wrapper">
            <span className="input-icon" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
              </svg>
            </span>
            <input type="text" id="reg-lname" name="last_name"
              className={`auth-input${errors.lastName ? ' error-field' : ''}`}
              placeholder="Doe" autoComplete="family-name"
              value={form.lastName} onChange={set('lastName')} />
          </div>
          <span className="field-error" id="reg-lname-error">{errors.lastName || ''}</span>
        </div>
      </div>

      {/* Email */}
      <div className="input-group">
        <label htmlFor="reg-email" className="input-label">Email address</label>
        <div className="input-wrapper">
          <span className="input-icon" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2"/>
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
            </svg>
          </span>
          <input type="email" id="reg-email" name="email"
            className={`auth-input${errors.email ? ' error-field' : ''}`}
            placeholder="you@example.com" autoComplete="email"
            value={form.email} onChange={set('email')} />
        </div>
        <span className="field-error" id="reg-email-error">{errors.email || ''}</span>
      </div>

      {/* Password + strength meter */}
      <div className="input-group">
        <label htmlFor="reg-password" className="input-label">Password</label>
        <PasswordInput
          id="reg-password" name="password"
          placeholder="Min. 6 characters" autocomplete="new-password"
          value={form.password} onChange={set('password')} error={errors.password}
        />
        {form.password && (
          <div className="strength-meter" aria-label="Password strength">
            <div className="strength-bars" aria-hidden="true">
              {[1,2,3,4].map(i => (
                <span key={i} className={`bar${i <= strength ? ` ${strengthInfo[strength].cls}` : ''}`} />
              ))}
            </div>
            <span className="strength-label" aria-live="polite">{strengthInfo[strength].label}</span>
          </div>
        )}
        <span className="field-error" id="reg-password-error">{errors.password || ''}</span>
      </div>

      {/* Confirm password */}
      <div className="input-group">
        <label htmlFor="reg-confirm" className="input-label">Confirm password</label>
        <PasswordInput
          id="reg-confirm" name="confirm_password"
          placeholder="Repeat your password" autocomplete="new-password"
          value={form.confirm} onChange={set('confirm')} error={errors.confirm}
        />
        <span className="field-error" id="reg-confirm-error">{errors.confirm || ''}</span>
      </div>

      {/* Terms */}
      <div className="checkbox-row">
        <label className="checkbox-label" htmlFor="agree-terms">
          <input type="checkbox" id="agree-terms" name="terms"
            className="custom-checkbox" checked={form.terms} onChange={set('terms')} />
          <span className="checkmark" aria-hidden="true" />
          <span>I agree to the <a href="#" className="inline-link">Terms of Service</a> and <a href="#" className="inline-link">Privacy Policy</a></span>
        </label>
      </div>
      {errors.terms && <span className="field-error">{errors.terms}</span>}

      {/* Submit */}
      <button type="submit" id="register-submit-btn" className={`submit-btn${loading ? ' loading' : ''}`} disabled={loading}>
        <span className="btn-text">Create Account</span>
        <span className="btn-spinner" aria-hidden="true" />
      </button>

      <div className="divider"><span>or sign up with</span></div>

      <div className="social-row">
        <button type="button" id="google-register-btn" className="social-btn" aria-label="Sign up with Google"
          onClick={() => onToast('Google signup coming soon!', 'info')}>
          <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          <span>Google</span>
        </button>
        <button type="button" id="mobile-register-btn" className="social-btn" aria-label="Sign up with Mobile"
          onClick={() => onToast('Mobile signup coming soon!', 'info')}>
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
