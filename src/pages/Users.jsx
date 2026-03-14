import { useMemo, useState, useEffect } from 'react'
import './Users.css'

const mockUsers = [
  { id: 1, name: 'Ava Chen', email: 'ava.chen@company.com', department: 'Engineering', location: 'New York', status: 'Active', riskScore: 35 },
  { id: 2, name: 'Sam Patel', email: 'sam.patel@company.com', department: 'Finance', location: 'London', status: 'Active', riskScore: 62 },
  { id: 3, name: 'Jordan Lee', email: 'jordan.lee@company.com', department: 'Marketing', location: 'Singapore', status: 'Active', riskScore: 48 },
  { id: 4, name: 'Taylor Smith', email: 'taylor@company.com', department: 'Engineering', location: 'Toronto', status: 'Active', riskScore: 28 },
  { id: 5, name: 'Casey Johnson', email: 'casey.j@company.com', department: 'HR', location: 'Network', status: 'Active', riskScore: 71 },
]

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

  // Load users from localStorage on mount
  useEffect(() => {
    const savedUsers = localStorage.getItem('users')
    if (savedUsers) {
      try {
        const parsed = JSON.parse(savedUsers)
        setUsers(parsed.length > 0 ? parsed : mockUsers)
      } catch (error) {
        console.error('Error loading users from localStorage:', error)
        setUsers(mockUsers)
      }
    } else {
      setUsers(mockUsers)
    }
  }, [])

  // Save users to localStorage whenever users change (but not on initial load)
  useEffect(() => {
    // Only save if users is not empty (to avoid saving empty array on mount)
    if (users.length > 0) {
      localStorage.setItem('users', JSON.stringify(users))
    }
  }, [users])

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

  const handleAddEmployee = (e) => {
    e.preventDefault()
    if (!validateForm()) return

    const newEmployee = {
      id: Math.max(...users.map(u => u.id), 0) + 1,
      ...formData,
      riskScore: 0,
      status: 'Active'
    }

    setUsers([...users, newEmployee])
    setFormData({
      name: '',
      email: '',
      department: 'Engineering',
      location: ''
    })
    setErrors({})
    setShowForm(false)
  }

  const handleDeleteEmployee = (id) => {
    if (window.confirm('Are you sure you want to remove this employee?')) {
      setUsers(users.filter(u => u.id !== id))
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
