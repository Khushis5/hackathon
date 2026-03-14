import { mockUserStats } from '../data/userDashboardData'
import '../styles/RiskScore.css'

const getRiskColor = (score) => {
  if (score <= 30) return '#4ecdc4'
  if (score <= 70) return '#ffe066'
  return '#ff6b6b'
}

const getRiskLabel = (score) => {
  if (score <= 30) return 'Low Risk'
  if (score <= 70) return 'Medium Risk'
  return 'High Risk'
}

const quickTips = [
  {
    title: 'Report suspicious emails',
    description:
      'If something looks off, report it. Quick reporting helps protect everyone and improves your score.',
  },
  {
    title: 'Keep training current',
    description:
      'Complete at least one security module per week to stay sharp and reduce risk over time.',
  },
  {
    title: 'Use strong authentication',
    description:
      'Enable MFA and use strong passwords to reduce your exposure to credential attacks.',
  },
]

export default function UserRisk() {
  const score = mockUserStats.riskScoreValue
  const label = getRiskLabel(score)
  const level = label.toLowerCase().split(' ')[0]

  return (
    <div className="risk">
      <header className="risk__header">
        <div>
          <h2>Your Personal Risk Score</h2>
          <p>See where you stand and what to do next to stay secure.</p>
        </div>
        <button className="button button--primary">Download Report</button>
      </header>

      <div className="risk__content">
        <section className="risk__overall">
          <div className={`risk__meter risk__meter--${level}`}>
            <div className="risk__circle" style={{ '--fill': score }}>
              <div className="risk__value">{score}%</div>
              <div className="risk__label">{label}</div>
              <div className="risk__waves">
                <span className="risk__wave risk__wave--1" />
                <span className="risk__wave risk__wave--2" />
                <span className="risk__wave risk__wave--3" />
              </div>
            </div>

            <div className="risk__info">
              <h3>What this means</h3>
              <p className="risk__description">
                Your score is based on simulated risk events. Lower means more secure—keep going!
              </p>
              <p className="risk__description">
                Focus on reporting, training, and using secure habits to lower your risk over time.
              </p>
            </div>
          </div>
        </section>

        <section className="risk__recommendations">
          <div className="section__header">
            <h3>Quick Wins</h3>
            <p>Small actions you can take right now to improve your score.</p>
          </div>

          <div className="recommendations__list">
            {quickTips.map((tip) => (
              <div key={tip.title} className="recommendation recommendation--warning">
                <h4>{tip.title}</h4>
                <p>{tip.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
