import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import './Login.css'

export default function AdminLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!username.trim() || !password.trim()) {
      setError('Please enter a username and password.')
      return
    }
    // Placeholder: Replace with real authentication API
    // Admin login - simplified for demo
    const isValidAdmin = username.trim().toLowerCase() === 'admin' || username.trim().toLowerCase() === 'a'
    if (isValidAdmin) {
      console.log('[AdminLogin] Admin login successful:', username.trim())
      login({ id: 999, username: username.trim(), role: 'admin' })
      navigate('/dashboard')
    } else {
      setError('Please use "admin" or "a" as username')
    }
  }

  return (
    <div className="login">
      <div className="login__card">
        <h1>Admin Login</h1>
        <form onSubmit={handleSubmit} className="login__form">
          <label className="login__label">
            Username
            <input
              className="login__input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              autoComplete="username"
            />
          </label>

          <label className="login__label">
            Password
            <input
              className="login__input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </label>

          {error && <p className="login__error">{error}</p>}

          <button type="submit" className="button button--primary">
            Sign in
          </button>

          <p className="login__help">
            Admins can use this interface to view user alerts, run campaign
            simulations, and see risk analytics.
            <br />
            <a href="/login" style={{ color: '#00d4ff', textDecoration: 'underline' }}>Employee Login</a>
          </p>
        </form>
      </div>
    </div>
  )
}