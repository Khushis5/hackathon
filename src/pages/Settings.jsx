import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import './Settings.css'

export default function Settings() {
  const { user, logout } = useAuth()
  const [settings, setSettings] = useState({
    firstName: 'Admin',
    lastName: 'User',
    email: user?.name?.toLowerCase().replace(/\s+/g, '.') + '@company.com' || 'admin@company.com',
    phone: '+1 (555) 000-0000',
    twoFactorEnabled: true,
    emailNotifications: true,
    securityAlerts: true,
  })
  const [showCacheDialog, setShowCacheDialog] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [cacheCleared, setCacheCleared] = useState(false)

  const handleSave = () => {
    alert('Settings saved successfully!')
    setEditMode(false)
  }

  const handleClearCache = () => {
    localStorage.clear()
    setCacheCleared(true)
    setShowCacheDialog(false)
    setTimeout(() => setCacheCleared(false), 3000)
  }

  return (
    <div className="settings">
      <header className="settings__header">
        <h2>Settings & Personal Data</h2>
        <p>Manage your account settings, security preferences, and cached data</p>
      </header>

      <div className="settings__grid">
        {/* Personal Details */}
        <section className="settings__card">
          <h3>Personal Details</h3>
          <div className="settings__form">
            <div className="form__row">
              <div className="form__group">
                <label>First Name</label>
                <input 
                  type="text" 
                  value={settings.firstName}
                  onChange={(e) => setSettings({...settings, firstName: e.target.value})}
                  disabled={!editMode}
                />
              </div>
              <div className="form__group">
                <label>Last Name</label>
                <input 
                  type="text" 
                  value={settings.lastName}
                  onChange={(e) => setSettings({...settings, lastName: e.target.value})}
                  disabled={!editMode}
                />
              </div>
            </div>

            <div className="form__group">
              <label>Email</label>
              <input 
                type="email" 
                value={settings.email}
                onChange={(e) => setSettings({...settings, email: e.target.value})}
                disabled={!editMode}
              />
            </div>

            <div className="form__group">
              <label>Phone</label>
              <input 
                type="tel" 
                value={settings.phone}
                onChange={(e) => setSettings({...settings, phone: e.target.value})}
                disabled={!editMode}
              />
            </div>

            <div className="form__actions">
              {!editMode ? (
                <button onClick={() => setEditMode(true)} className="button button--primary">
                  Edit Profile
                </button>
              ) : (
                <>
                  <button onClick={handleSave} className="button button--success">
                    Save Changes
                  </button>
                  <button onClick={() => setEditMode(false)} className="button button--secondary">
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Security Settings */}
        <section className="settings__card">
          <h3>Security Settings</h3>
          <div className="settings__options">
            <div className="setting-item">
              <div className="setting-item__content">
                <h4>Two-Factor Authentication</h4>
                <p>Add an extra layer of security</p>
              </div>
              <label className="toggle">
                <input 
                  type="checkbox" 
                  checked={settings.twoFactorEnabled}
                  onChange={(e) => setSettings({...settings, twoFactorEnabled: e.target.checked})}
                />
                <span className="toggle__slider"></span>
              </label>
            </div>

            <div className="setting-item">
              <div className="setting-item__content">
                <h4>Email Notifications</h4>
                <p>Receive activity updates</p>
              </div>
              <label className="toggle">
                <input 
                  type="checkbox" 
                  checked={settings.emailNotifications}
                  onChange={(e) => setSettings({...settings, emailNotifications: e.target.checked})}
                />
                <span className="toggle__slider"></span>
              </label>
            </div>

            <div className="setting-item">
              <div className="setting-item__content">
                <h4>Security Alerts</h4>
                <p>Threat notifications</p>
              </div>
              <label className="toggle">
                <input 
                  type="checkbox" 
                  checked={settings.securityAlerts}
                  onChange={(e) => setSettings({...settings, securityAlerts: e.target.checked})}
                />
                <span className="toggle__slider"></span>
              </label>
            </div>
          </div>
        </section>

        {/* Data & Privacy */}
        <section className="settings__card">
          <h3>Data & Privacy</h3>
          <div className="settings__actions">
            <div className="action-item">
              <h4>Clear Cache & Local Data</h4>
              <p>Remove all cached data</p>
              <button 
                onClick={() => setShowCacheDialog(true)}
                className="button button--warning"
              >
                Clear Cache
              </button>
              {cacheCleared && (
                <p className="settings__success">✓ Cache cleared</p>
              )}
            </div>

            <div className="action-item">
              <h4>Logout</h4>
              <p>End your session</p>
              <button 
                onClick={logout}
                className="button button--danger"
              >
                Logout
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Clear Cache Confirmation Dialog */}
      {showCacheDialog && (
        <div className="modal-overlay" onClick={() => setShowCacheDialog(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Clear Cache?</h2>
            <p>This action will remove all cached data. This cannot be undone.</p>
            <div className="modal__actions">
              <button onClick={handleClearCache} className="button button--danger">
                Yes, Clear Cache
              </button>
              <button onClick={() => setShowCacheDialog(false)} className="button button--secondary">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
