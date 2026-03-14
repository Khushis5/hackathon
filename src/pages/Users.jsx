import { useMemo, useState, useEffect } from 'react'
import { apiFetch } from '../services/api'
import './Users.css'

export default function Users() {
  const [users, setUsers] = useState([])
  const [query, setQuery] = useState('')
  const [selectedDept, setSelectedDept] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: 'Engineering',
    location: ''
  })
  const [errors, setErrors] = useState({})

  const fetchUsers = async () => {
    try {
      const data = await apiFetch('/users')
      if (data && data.users) {
        setUsers(data.users)
      }
    } catch (err) {
      console.error('Failed to fetch users:', err)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const filtered = useMemo(() => {
    const lower = query.toLowerCase()
    return users.filter(
      (u) =>
        (u.name.toLowerCase().includes(lower) ||
        u.email.toLowerCase().includes(lower) ||
        u.location.toLowerCase().includes(lower)) &&
        (!selectedDept || u.department === selectedDept)
    )
  }, [query, selectedDept, users])

  const getRiskColor = (score) => {
    if (score > 60) return 'high'
    if (score > 40) return 'medium'
    return 'low'
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format'
    if (!formData.location.trim()) newErrors.location = 'Location is required'
    if (users.some(u => u.email.toLowerCase() === formData.email.toLowerCase())) {
      newErrors.email = 'Email already exists'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleAddEmployee = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    try {
      // The backend expects password for registration. We'll generate a dummy one since this is an employee creation simulation
      await apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: 'securePassword123!',
          role: 'ANALYST',
          department: formData.department,
          location: formData.location
        })
      });
      
      setFormData({
        name: '',
        email: '',
        department: 'Engineering',
        location: ''
      })
      setErrors({})
      setShowForm(false)
      fetchUsers() // Refresh list
    } catch (err) {
      setErrors({ email: err.message || 'Failed to create employee' })
    }
  }

  const handleDeleteEmployee = async (id) => {
    if (window.confirm('Are you sure you want to remove this employee?')) {
      try {
        await apiFetch(`/users/${id}`, { method: 'DELETE' })
        fetchUsers() // Refresh list
      } catch (err) {
        alert('Failed to delete employee: ' + err.message)
      }
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  return (
    <div className="users">
      <header className="users__header">
        <h2>Employee Directory</h2>
      </header>

      <div className="users__controls">
        <div className="users__controls-left">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, email, or location..."
            className="users__search"
          />
          <select 
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="users__filter"
          >
            <option value="">All Departments</option>
            <option value="Engineering">Engineering</option>
            <option value="Finance">Finance</option>
            <option value="HR">HR</option>
            <option value="Marketing">Marketing</option>
          </select>
        </div>
        <button 
          className="users__add-btn"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? '✕ Cancel' : '+ Add Employee'}
        </button>
      </div>

      {showForm && (
        <form className="users__form" onSubmit={handleAddEmployee}>
          <h3>Add New Employee</h3>
          <div className="form__grid">
            <div className="form__group">
              <label>Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="John Doe"
                className={errors.name ? 'input-error' : ''}
              />
              {errors.name && <span className="form__error">{errors.name}</span>}
            </div>

            <div className="form__group">
              <label>Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="john@company.com"
                className={errors.email ? 'input-error' : ''}
              />
              {errors.email && <span className="form__error">{errors.email}</span>}
            </div>

            <div className="form__group">
              <label>Department *</label>
              <select
                name="department"
                value={formData.department}
                onChange={handleInputChange}
              >
                <option value="Engineering">Engineering</option>
                <option value="Finance">Finance</option>
                <option value="HR">HR</option>
                <option value="Marketing">Marketing</option>
              </select>
            </div>

            <div className="form__group">
              <label>Location *</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="New York"
                className={errors.location ? 'input-error' : ''}
              />
              {errors.location && <span className="form__error">{errors.location}</span>}
            </div>
          </div>

          <div className="form__actions">
            <button type="submit" className="form__submit">Add Employee</button>
          </div>
        </form>
      )}

      <table className="users__table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>Location</th>
            <th>Risk Score</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((user) => (
            <tr key={user.id}>
              <td><strong>{user.name}</strong></td>
              <td>{user.email}</td>
              <td>{user.department}</td>
              <td>{user.location}</td>
              <td>
                {user.riskScore === 0 ? (
                  <span className="risk-badge risk-badge--unassessed">—</span>
                ) : (
                  <span className={`risk-badge risk-badge--${getRiskColor(user.riskScore)}`}>
                    {user.riskScore}%
                  </span>
                )}
              </td>
              <td>
                <button 
                  className="users__delete-btn"
                  onClick={() => handleDeleteEmployee(user.id)}
                  title="Remove employee"
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {filtered.length === 0 && (
        <p className="users__empty">No matching users found.</p>
      )}
    </div>
  )
}
