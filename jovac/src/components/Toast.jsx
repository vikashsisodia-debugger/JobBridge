import { useEffect, useState } from 'react'

export default function Toast({ message, type, onClose }) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => {
      setVisible(false)
      setTimeout(onClose, 300)
    }, 3500)
    return () => clearTimeout(t)
  }, [onClose])

  const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'

  return (
    <div
      className={`toast ${type}`}
      style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.3s' }}
      role="alert"
      aria-live="polite"
    >
      <span className="toast-icon">{icon}</span>
      <span>{message}</span>
    </div>
  )
}
