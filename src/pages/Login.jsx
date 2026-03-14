import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import './Login.css'

export default function Login() {
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
    // Map username to employee ID for demo purposes
    const mockUserMapping = {
      'ava': { id: 1, name: 'Ava Chen', username: 'ava' },
      'sam': { id: 2, name: 'Sam Patel', username: 'sam' },
      'jordan': { id: 3, name: 'Jordan Lee', username: 'jordan' },
      'taylor': { id: 4, name: 'Taylor Smith', username: 'taylor' },
      'casey': { id: 5, name: 'Casey Johnson', username: 'casey' },
      'morgan': { id: 6, name: 'Morgan Davis', username: 'morgan' },
      'riley': { id: 7, name: 'Riley Chen', username: 'riley' },
      'alex': { id: 8, name: 'Alex Brown', username: 'alex' },
    }
    
    const userData = mockUserMapping[username.trim().toLowerCase()] || { id: 1, name: 'Ava Chen', username: username.trim() }
    login({ ...userData, role: 'user' })
    navigate('/dashboard')
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
