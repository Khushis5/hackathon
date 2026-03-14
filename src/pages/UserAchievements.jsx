import { mockAchievements } from '../data/userDashboardData'
import './Dashboard.css'

export default function UserAchievements() {
  return (
    <div className="dashboard">
      <section className="dashboard__achievements">
        <h3>Recent Achievements</h3>
        <div className="achievements-grid">
          {mockAchievements.map((achievement) => (
            <div key={achievement.id} className="achievement-card" style={{ background: achievement.gradient }}>
              <div className="achievement-icon">{achievement.icon}</div>
              <div className="achievement-info">
                <h4>{achievement.title}</h4>
                <p>{achievement.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
