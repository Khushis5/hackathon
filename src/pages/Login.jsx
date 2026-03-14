import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { apiFetch } from '../services/api'
import './Login.css'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!username.trim() || !password.trim()) {
      setError('Please enter a username and password.')
      return
    }
    
    try {
      // Create email mapping for the demo users to actual backend emails
      // If user inputs "ava", map it to "ava@example.com"
      const email = username.includes('@') ? username : `${username.toLowerCase().trim()}@example.com`

      const data = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      })

      localStorage.setItem('accessToken', data.accessToken)
      login(data.user)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check your credentials.')
    }
  }

  return (

    <div className="login">
      <div className="login__card">
        <h1>Employee Login</h1>
        <form onSubmit={handleSubmit} className="login__form">
          <label className="login__label">
            Username
            <input
              className="login__input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username (e.g. ava, sam)"
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
            Employees can use this interface to view their security performance, participate in training, and improve their cybersecurity awareness.
            <br />
            <a href="/admin/login" style={{ color: '#00d4ff', textDecoration: 'underline' }}>Admin Login</a>
          </p>
        </form>
      </div>
    </div>
  )
}
