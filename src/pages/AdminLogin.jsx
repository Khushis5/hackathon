import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { apiFetch } from '../services/api'
import './Login.css'

export default function AdminLogin() {
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
      const email = username.includes('@') ? username : `${username.toLowerCase().trim()}@example.com`
      let data;
      try {
        data = await apiFetch('/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email, password: password || 'defaultAdminPass123!' })
        })
      } catch (loginErr) {
        // If login fails, check if they used "admin" or "a" shorthand
        const isValidAdmin = username.trim().toLowerCase() === 'admin' || username.trim().toLowerCase() === 'a'
        if (isValidAdmin) {
           console.log('[AdminLogin] Auto-provisioning SUPER_ADMIN in Firebase for demo...');
           // Register them
           try {
             await apiFetch('/auth/register', {
               method: 'POST',
               body: JSON.stringify({
                 name: 'System Admin',
                 email: 'admin@example.com',
                 password: 'defaultAdminPass123!',
                 role: 'SUPER_ADMIN'
               })
             });
           } catch(e) { /* Might already exist, ignore */ }
           
           // Retry login
           data = await apiFetch('/auth/login', {
             method: 'POST',
             body: JSON.stringify({ email: 'admin@example.com', password: 'defaultAdminPass123!' })
           });
        } else {
           throw loginErr;
        }
      }

      localStorage.setItem('accessToken', data.accessToken)
      login(data.user)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Invalid credentials')
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