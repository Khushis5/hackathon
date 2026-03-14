import { mockActivityHistory } from '../data/userDashboardData'
import './Dashboard.css'

export default function UserActivity() {
  return (
    <div className="dashboard">
      <section className="dashboard__activity">
        <h3>Recent Security Activities</h3>
        <div className="activity-timeline">
          {mockActivityHistory.map((activity) => (
            <div key={activity.id} className="activity-item">
              <div className="activity-header">
                <h4>{activity.campaignName}</h4>
                <span className={`activity-type ${activity.status === 'success' ? 'success' : 'failed'}`}>
                  {activity.attackType}
                </span>
                <span className="activity-time">
                  {activity.timestamp.toLocaleDateString()} at {activity.timestamp.toLocaleTimeString()}
                </span>
              </div>
              <div className="activity-details">
                <p><strong>Action Taken:</strong> {activity.action}</p>
                <p><strong>Result:</strong> {activity.result}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
