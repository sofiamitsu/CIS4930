import { useState, useEffect } from 'react'
import './FacultyManager.css'

const API_URL = 'http://localhost:8003'

export default function FacultyManager() {
  const [faculty, setFaculty] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    department: '',
    email: ''
  })
  const [showForm, setShowForm] = useState(false)

  // Fetch all faculty
  const fetchFaculty = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_URL}/faculty`)
      if (!response.ok) throw new Error('Failed to fetch faculty')
      const data = await response.json()
      setFaculty(data)
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFaculty()
  }, [])

  // Add faculty
  const handleAddFaculty = async (e) => {
    e.preventDefault()
    if (!formData.name || !formData.department || !formData.email) {
      alert('Please fill in all fields')
      return
    }

    try {
      const response = await fetch(`${API_URL}/faculty`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (!response.ok) throw new Error('Failed to add faculty')
      const newFaculty = await response.json()
      setFaculty([...faculty, newFaculty])
      setFormData({ name: '', department: '', email: '' })
      setShowForm(false)
      setError(null)
    } catch (err) {
      setError(err.message)
    }
  }

  // Delete faculty
  const handleDeleteFaculty = async (id) => {
    if (!confirm('Are you sure you want to delete this faculty member?')) return

    try {
      const response = await fetch(`${API_URL}/faculty/${id}`, {
        method: 'DELETE'
      })
      if (!response.ok) throw new Error('Failed to delete faculty')
      setFaculty(faculty.filter(f => f.id !== id))
      setError(null)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="faculty-manager">
      {/* Header */}
      <div className="fm-header">
        <h1>Faculty Management Dashboard</h1>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Cancel' : '+ Add Faculty'}
        </button>
      </div>

      {/* Error message */}
      {error && <div className="error-message">{error}</div>}

      {/* Add Faculty Form */}
      {showForm && (
        <form className="faculty-form" onSubmit={handleAddFaculty}>
          <input
            type="text"
            placeholder="Full Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <input
            type="text"
            placeholder="Department"
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <button type="submit" className="btn-primary">Add Faculty</button>
        </form>
      )}

      {/* Faculty List */}
      <div className="faculty-container">
        {loading ? (
          <p className="loading">Loading faculty...</p>
        ) : faculty.length === 0 ? (
          <p className="empty">No faculty members yet. Add one to get started!</p>
        ) : (
          <table className="faculty-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Department</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {faculty.map((member) => (
                <tr key={member.id}>
                  <td>#{member.id}</td>
                  <td>{member.name}</td>
                  <td>{member.department}</td>
                  <td>{member.email}</td>
                  <td>
                    <button
                      className="btn-delete"
                      onClick={() => handleDeleteFaculty(member.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
