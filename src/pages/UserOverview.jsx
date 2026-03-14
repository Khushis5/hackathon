import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { mockUserStats } from '../data/userDashboardData'
import './Dashboard.css'

export default function UserOverview() {
  const navigate = useNavigate()
  const { user } = useAuth()

  return (
    <div className="dashboard">
      <section className="dashboard__welcome">
        <h1>Your Security Command Center</h1>
        <p>Monitor your cybersecurity awareness, track your progress, and strengthen your defenses.</p>
        <div className="user-info">
          <span className="username-display">Name: {user?.name}</span>
        </div>
      </section>

      <section className="dashboard__overview">
        <div className="dashboard__card">
          <h3>🏆 Simulations Participated</h3>
          <p className="dashboard__value">{mockUserStats.simulationsParticipated}</p>
          <p className="dashboard__meta">Total campaigns you've encountered</p>
        </div>
        <div className="dashboard__card">
          <h3>🎯 Success Rate</h3>
          <p className="dashboard__value">{Math.round((mockUserStats.attacksReported / mockUserStats.simulationsParticipated) * 100)}%</p>
          <p className="dashboard__meta">Attacks successfully identified</p>
        </div>
        <div className="dashboard__card">
          <h3>⭐ Total Points</h3>
          <p className="dashboard__value">{mockUserStats.totalPoints}</p>
          <p className="dashboard__meta">Security awareness score</p>
        </div>
      </section>

      <section className="dashboard__quick-actions">
        <h3>Quick Actions</h3>
        <div className="dashboard__quick-grid">
          <button className="dashboard__quick-btn" onClick={() => navigate('/activity')}>
            <span>🚨</span>
            Report Security Incident
          </button>
          <button className="dashboard__quick-btn" onClick={() => navigate('/training')}>
            <span>📚</span>
            Start Training Module
          </button>
          <button className="dashboard__quick-btn" onClick={() => navigate('/risk')}>
            <span>📊</span>
            View Risk Score
          </button>
          <button className="dashboard__quick-btn" onClick={() => navigate('/achievements')}>
            <span>🏆</span>
            View Achievements
          </button>
        </div>
      </section>
    </div>
  )
}
