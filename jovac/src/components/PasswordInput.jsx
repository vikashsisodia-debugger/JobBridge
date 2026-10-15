import { useState } from 'react'

const EyeOpen = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
)
const EyeClosed = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/>
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/>
    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/>
    <line x1="2" y1="2" x2="22" y2="22"/>
  </svg>
)

export default function PasswordInput({ id, name, placeholder, value, onChange, error, autocomplete = 'current-password' }) {
  const [show, setShow] = useState(false)
  return (
    <div className="input-wrapper">
      <span className="input-icon" aria-hidden="true">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
      </span>
      <input
        type={show ? 'text' : 'password'}
        id={id}
        name={name}
        className={`auth-input${error ? ' error-field' : ''}`}
        placeholder={placeholder}
        autoComplete={autocomplete}
        value={value}
        onChange={onChange}
        required
        aria-required="true"
        aria-describedby={`${id}-error`}
      />
      <button
        type="button"
        className="toggle-password"
        aria-label="Toggle password visibility"
        onClick={() => setShow(s => !s)}
      >
        {show ? <EyeClosed /> : <EyeOpen />}
      </button>
    </div>
  )
}
