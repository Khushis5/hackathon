import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import './Sidebar.css'

const adminNavItems = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/users', label: 'Users' },
  { to: '/campaigns', label: 'Campaigns' },
  { to: '/reports', label: 'Reports' },
  { to: '/risk', label: 'Risk Score' },
  { to: '/settings', label: 'Settings' },
]

const userNavItems = [
  { to: '/dashboard', label: 'Overview' },
  { to: '/activity', label: 'Activity' },
  { to: '/training', label: 'Training' },
  { to: '/risk', label: 'Risk Score' },
  { to: '/achievements', label: 'Achievements' },
  { to: '/settings', label: 'Settings' },
]

export default function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate()
  const { logout, isAdmin } = useAuth()

  const handleLogout = () => {
    logout()
    navigate(isAdmin ? '/admin/login' : '/login')
  }

  const navItems = isAdmin ? adminNavItems : userNavItems

  return (
    <nav className={`sidebar ${isOpen ? 'sidebar--open' : ''}`} aria-label="Main navigation">
      <div className="sidebar__header">
        <div className="sidebar__brand">
          <div className="sidebar__logo" />
          <div>
            <h1>{isAdmin ? 'FinSec Admin' : 'Employee Portal'}</h1>
            <small>{isAdmin ? 'Cybersecurity Operations' : 'Personal Security'}</small>
          </div>
        </div>
        <button 
          className="sidebar__close"
          onClick={onClose}
          aria-label="Close navigation menu"
        >
          ✕
        </button>
      </div>

      <ul className="sidebar__nav">
        {navItems.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              className={({ isActive }) =>
                `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
              }
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>

      <div className="sidebar__actions">
        <button className="sidebar__action-btn sidebar__action-logout" onClick={handleLogout}>
          🚪 Sign out
        </button>
      </div>
    </nav>
  )
}
