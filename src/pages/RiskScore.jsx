import { useMemo, useState } from 'react'
import './RiskScore.css'

const riskCategories = [
  { name: 'Phishing Susceptibility', score: 68, description: 'Employees clicking suspicious links' },
  { name: 'Password Strength', score: 45, description: 'Weak password practices across organization' },
  { name: 'Security Awareness', score: 72, description: 'Training completion and understanding', pending: 23 },
  { name: 'Access Control', score: 58, description: 'Proper use of permissions and privileges' },
  { name: 'Data Protection', score: 81, description: 'Encryption and data handling practices' },
  { name: 'Incident Response', score: 55, description: 'Speed and effectiveness of responses' },
]

const overallScore = 23 // Hardcoded for demo (was computed from categories)
const totalEmployees = 8 // Based on mockEmployees count

export default function RiskScore() {
  const [selectedCategory, setSelectedCategory] = useState(null)

  const getRiskLevel = (score) => {
    // Lower scores are safer in this dashboard context.
    // 0–35%: green (good), 36–65%: orange (warn), 66%+: red (critical)
    if (score <= 35) return { level: 'LOW RISK', color: 'good', label: '✓ Good' }
    if (score <= 65) return { level: 'MEDIUM RISK', color: 'warn', label: '• Fair' }
    return { level: 'HIGH RISK', color: 'critical', label: '✗ Critical' }
  }

  const overallRisk = getRiskLevel(overallScore)

  return (
    <div className="risk">
      <header className="risk__header">
        <div>
          <h2>Risk Score Dashboard</h2>
          <p>Overall security risk assessment for the entire organization</p>
        </div>
        <button className="button button--primary">
          Generate Report
        </button>
      </header>

      <div className="risk__content">
        <section className="risk__overall">
          <div className={`risk__meter risk__meter--${overallRisk.color}`}>
            <div className="risk__circle" style={{ '--fill': overallScore }}>
              <div className="risk__water" />
              <div className="risk__value">{overallScore}%</div>
              <div className="risk__label">Overall Score</div>
            </div>
            <div className="risk__info">
              <h3>Company Risk Assessment</h3>
              <p className={`risk__status risk__status--${overallRisk.color}`}>
                {overallRisk.level}
              </p>
              <p className="risk__description">
                Based on 6 key security categories across {totalEmployees} employees
              </p>
            </div>
          </div>
        </section>

        <section className="risk__categories">
          <div className="section__header">
            <h3>Risk by Category</h3>
            <p>Click on any category for detailed insights</p>
          </div>
          <div className="risk__grid">
            {riskCategories.map((category, idx) => {
              const risk = getRiskLevel(category.score)
              return (
                <div
                  key={idx}
                  className={`risk__category risk__category--${risk.color} ${selectedCategory?.name === category.name ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(selectedCategory?.name === category.name ? null : category)}
                >
                  <div className="category__header">
                    <h4>{category.name}</h4>
                    <span className={`category__score category__score--${risk.color}`}>{category.score}%</span>
                  </div>

                  <div className="category__bar">
                    <div className={`category__fill category__fill--${risk.color}`} style={{width: `${category.score}%`}}></div>
                  </div>

                  <p className="category__desc">{category.description}</p>

                  {category.pending && (
                    <div className="category__pending">
                      <span className="pending__icon">⏳</span>
                      <span>{category.pending} employees pending training</span>
                    </div>
                  )}

                  <div className="category__risk-level">
                    <span className={`risk-indicator risk-indicator--${risk.color}`}></span>
                    <span className="risk-text">{risk.level}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        <section className="risk__recommendations">
          <div className="section__header">
            <h3>Recommended Actions</h3>
            <p>Priority actions to improve your security posture</p>
          </div>
          <div className="recommendations__list">
            <div className="recommendation recommendation--critical">
              <div className="recommendation__header">
                <span className="recommendation__priority">🔴 HIGH PRIORITY</span>
                <span className="recommendation__score">Score: 45%</span>
              </div>
              <h4>Strengthen Password Policies</h4>
              <p>Implement mandatory multi-factor authentication across all departments within 30 days. Current weak password practices are a critical vulnerability.</p>
              <div className="recommendation__actions">
                <button className="action-btn action-btn--primary">Create Policy</button>
                <button className="action-btn action-btn--secondary">View Details</button>
              </div>
            </div>
            <div className="recommendation recommendation--warning">
              <div className="recommendation__header">
                <span className="recommendation__priority">🟠 MEDIUM PRIORITY</span>
                <span className="recommendation__score">Score: 55%</span>
              </div>
              <h4>Improve Incident Response</h4>
              <p>Conduct tabletop exercises and update response procedures to reduce incident resolution time from current average.</p>
              <div className="recommendation__actions">
                <button className="action-btn action-btn--primary">Schedule Training</button>
                <button className="action-btn action-btn--secondary">View Details</button>
              </div>
            </div>
            <div className="recommendation recommendation--success">
              <div className="recommendation__header">
                <span className="recommendation__priority">🟢 MAINTAIN</span>
                <span className="recommendation__score">Score: 81%</span>
              </div>
              <h4>Data Protection Excellence</h4>
              <p>Continue current data protection practices and share best practices across departments to maintain high standards.</p>
              <div className="recommendation__actions">
                <button className="action-btn action-btn--primary">Share Best Practices</button>
                <button className="action-btn action-btn--secondary">View Details</button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
