import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { useAuth } from '../contexts/AuthContext'
import LiveFeed from '../components/LiveFeed'
import MapPlaceholder from '../components/MapPlaceholder'
import { apiFetch } from '../services/api'
import './Dashboard.css'

export default function Dashboard() {
  const { isAdmin } = useAuth()
  
  const [adminStats, setAdminStats] = useState({ activeIncidents: 3, ongoingCampaigns: 1, avgRiskScore: 47 })

  useEffect(() => {
    if (isAdmin) {
      apiFetch('/analytics/dashboard')
        .then(data => {
          if (data && data.stats) {
             setAdminStats({
               activeIncidents: data.stats.trackingStats.clickEvents + data.stats.trackingStats.submitEvents,
               ongoingCampaigns: data.stats.overview.activeCampaigns,
               avgRiskScore: Math.round(data.stats.riskScore)
             })
          }
        })
        .catch(err => console.error("Failed to load dashboard stats", err))
    }
  }, [isAdmin])

  if (isAdmin) {
    // Admin Dashboard
    return (
      <div className="dashboard">
        <section className="dashboard__overview">
          <div className="dashboard__card">
            <h3>Active incidents</h3>
            <p className="dashboard__value">{adminStats.activeIncidents}</p>
            <p className="dashboard__meta">Currently tracked across branches</p>
          </div>
          <div className="dashboard__card">
            <h3>Ongoing campaigns</h3>
            <p className="dashboard__value">{adminStats.ongoingCampaigns}</p>
            <p className="dashboard__meta">Phishing test in progress</p>
          </div>
          <div className="dashboard__card">
            <h3>Average risk score</h3>
            <p className="dashboard__value">{adminStats.avgRiskScore}%</p>
            <p className="dashboard__meta">Company-wide threshold: 65%</p>
          </div>
        </section>

        <section className="dashboard__map-section">
          <MapPlaceholder />
        </section>

        <section className="dashboard__timeline">
          <LiveFeed />
        </section>
      </div>
    )
  }

  // User Dashboard
  const [userStats, setUserStats] = useState({
    simulationsParticipated: 12,
    phishingLinksClicked: 3,
    attacksReported: 8,
    riskScore: 'Medium',
    riskScoreValue: 65,
    safeActions: 9,
    totalPoints: 1250
  })

  const [activityHistory, setActivityHistory] = useState([
    {
      id: 1,
      campaignName: 'Password Reset Campaign',
      attackType: 'Phishing',
      action: 'Clicked phishing link',
      result: 'Security warning displayed - Points: -3',
      timestamp: new Date(Date.now() - 86400000 * 2),
      status: 'failed'
    },
    {
      id: 2,
      campaignName: 'Payroll Update Malware Test',
      attackType: 'Malware',
      action: 'Downloaded and executed file',
      result: 'Malware simulation triggered - Points: -4',
      timestamp: new Date(Date.now() - 86400000),
      status: 'failed'
    },
    {
      id: 3,
      campaignName: 'CEO Email Phishing',
      attackType: 'Phishing',
      action: 'Reported suspicious email',
      result: 'Correct action taken - Points: +3',
      timestamp: new Date(Date.now() - 3600000),
      status: 'success'
    },
    {
      id: 4,
      campaignName: 'Ransomware Alert Training',
      attackType: 'Ransomware',
      action: 'Reported incident immediately',
      result: 'Excellent response - Points: +5',
      timestamp: new Date(Date.now() - 1800000),
      status: 'success'
    }
  ])

  const [trainingRecommendations, setTrainingRecommendations] = useState([
    {
      id: 1,
      title: 'Advanced Phishing Detection',
      description: 'Learn to identify sophisticated phishing attempts including spear-phishing and business email compromise.',
      icon: '🎣',
      progress: 75,
      estimatedTime: '45 min'
    },
    {
      id: 2,
      title: 'Safe File Handling Practices',
      description: 'Master secure file download, execution, and malware recognition techniques.',
      icon: '🛡️',
      progress: 60,
      estimatedTime: '30 min'
    },
    {
      id: 3,
      title: 'Incident Response Mastery',
      description: 'Develop skills for effective incident reporting and response procedures.',
      icon: '🚨',
      progress: 40,
      estimatedTime: '60 min'
    },
    {
      id: 4,
      title: 'Password Security & MFA',
      description: 'Strengthen password policies and multi-factor authentication best practices.',
      icon: '🔐',
      progress: 90,
      estimatedTime: '20 min'
    }
  ])

  // Enhanced risk score breakdown data
  const riskData = [
    { name: 'Phishing Vulnerabilities', value: 3, color: '#ff6b6b', points: -9 },
    { name: 'Malware Downloads', value: 1, color: '#4ecdc4', points: -4 },
    { name: 'Successful Reports', value: 8, color: '#45b7d1', points: 24 },
    { name: 'Safe Actions', value: 9, color: '#96ceb4', points: 27 }
  ]

  const getRiskColor = (score) => {
    if (score <= 30) return '#4ecdc4';
    if (score <= 70) return '#ffe066';
    return '#ff6b6b';
  }

  const getRiskLabel = (score) => {
    if (score <= 30) return 'Low Risk';
    if (score <= 70) return 'Medium Risk';
    return 'High Risk';
  }

  return (
    <div className="dashboard">
      {/* Welcome Header */}
      <section className="dashboard__welcome">
        <h1 style={{
          textAlign: 'center',
          color: '#ffffff',
          fontSize: '2.5rem',
          fontWeight: '700',
          marginBottom: '0.5rem',
          textShadow: '0 0 30px rgba(0, 212, 255, 0.5)'
        }}>
          Welcome to Your Security Command Center
        </h1>
        <p style={{
          textAlign: 'center',
          color: '#cccccc',
          fontSize: '1.1rem',
          marginBottom: '2rem'
        }}>
          Monitor your cybersecurity awareness, track your progress, and strengthen your defenses
        </p>
      </section>

      {/* Personal Security Overview */}
      <section className="dashboard__overview">
        <div className="dashboard__card">
          <h3>🏆 Simulations Participated</h3>
          <p className="dashboard__value">{userStats.simulationsParticipated}</p>
          <p className="dashboard__meta">Total campaigns you've encountered</p>
        </div>
        <div className="dashboard__card">
          <h3>🎯 Success Rate</h3>
          <p className="dashboard__value">{Math.round((userStats.attacksReported / userStats.simulationsParticipated) * 100)}%</p>
          <p className="dashboard__meta">Attacks successfully identified</p>
        </div>
        <div className="dashboard__card">
          <h3>⚠️ Security Incidents</h3>
          <p className="dashboard__value">{userStats.phishingLinksClicked + 1}</p>
          <p className="dashboard__meta">Unsafe actions taken</p>
        </div>
        <div className="dashboard__card">
          <h3>⭐ Total Points</h3>
          <p className="dashboard__value">{userStats.totalPoints}</p>
          <p className="dashboard__meta">Security awareness score</p>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="dashboard__quick-actions">
        <h3 style={{
          textAlign: 'center',
          color: '#ffffff',
          fontSize: '1.5rem',
          marginBottom: '2rem',
          fontWeight: '600'
        }}>
          Quick Actions
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
          marginBottom: '3rem'
        }}>
          <button style={{
            background: 'linear-gradient(135deg, #00d4ff, #0099cc)',
            border: 'none',
            borderRadius: '12px',
            padding: '2rem',
            color: '#ffffff',
            fontSize: '1.1rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 8px 25px rgba(0, 212, 255, 0.3)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem'
          }}
          onMouseOver={(e) => e.target.style.transform = 'translateY(-5px)'}
          onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
          >
            <span style={{ fontSize: '2rem' }}>🚨</span>
            Report Security Incident
          </button>
          <button style={{
            background: 'linear-gradient(135deg, #4ecdc4, #44a08d)',
            border: 'none',
            borderRadius: '12px',
            padding: '2rem',
            color: '#ffffff',
            fontSize: '1.1rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 8px 25px rgba(78, 205, 196, 0.3)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem'
          }}
          onMouseOver={(e) => e.target.style.transform = 'translateY(-5px)'}
          onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
          >
            <span style={{ fontSize: '2rem' }}>📚</span>
            Start Training Module
          </button>
          <button style={{
            background: 'linear-gradient(135deg, #ffe066, #ffb347)',
            border: 'none',
            borderRadius: '12px',
            padding: '2rem',
            color: '#ffffff',
            fontSize: '1.1rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 8px 25px rgba(255, 224, 102, 0.3)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem'
          }}
          onMouseOver={(e) => e.target.style.transform = 'translateY(-5px)'}
          onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
          >
            <span style={{ fontSize: '2rem' }}>📊</span>
            View Detailed Analytics
          </button>
          <button style={{
            background: 'linear-gradient(135deg, #96ceb4, #7fbf7f)',
            border: 'none',
            borderRadius: '12px',
            padding: '2rem',
            color: '#ffffff',
            fontSize: '1.1rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 8px 25px rgba(150, 206, 180, 0.3)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem'
          }}
          onMouseOver={(e) => e.target.style.transform = 'translateY(-5px)'}
          onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
          >
            <span style={{ fontSize: '2rem' }}>🏆</span>
            Check Achievements
          </button>
        </div>
      </section>

      {/* Risk Score Display */}
      <section className="dashboard__risk-score">
        <div className="risk-score-display">
          <div className="risk-score-value" style={{ color: getRiskColor(userStats.riskScoreValue) }}>
            {userStats.riskScoreValue}
          </div>
          <div className="risk-score-label">{getRiskLabel(userStats.riskScoreValue)}</div>
          <div className="risk-score-explanation">
            Your risk score is calculated based on your responses to simulated cyber attacks.
            Lower scores indicate better security awareness and safer behavior patterns.
          </div>
          <div className="risk-score-breakdown">
            <div className="risk-factor">
              <span className="factor-value" style={{ color: '#ff6b6b' }}>-{riskData[0].points}</span>
              <div className="factor-label">Phishing</div>
            </div>
            <div className="risk-factor">
              <span className="factor-value" style={{ color: '#4ecdc4' }}>-{riskData[1].points}</span>
              <div className="factor-label">Malware</div>
            </div>
            <div className="risk-factor">
              <span className="factor-value" style={{ color: '#45b7d1' }}>+{riskData[2].points}</span>
              <div className="factor-label">Reports</div>
            </div>
            <div className="risk-factor">
              <span className="factor-value" style={{ color: '#96ceb4' }}>+{riskData[3].points}</span>
              <div className="factor-label">Safe Actions</div>
            </div>
          </div>
        </div>
      </section>

      {/* Charts Section */}
      <section className="dashboard__charts">
        <div className="dashboard__chart-card">
          <h3>Security Performance Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={riskData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value, points }) => `${name}: ${points > 0 ? '+' : ''}${points}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {riskData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name, props) => [`${props.payload.points > 0 ? '+' : ''}${props.payload.points} points`, name]} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="dashboard__chart-card">
          <h3>Monthly Progress</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={[
              { month: 'Jan', points: 85, incidents: 2 },
              { month: 'Feb', points: 92, incidents: 1 },
              { month: 'Mar', points: 78, incidents: 3 },
              { month: 'Apr', points: 105, incidents: 0 },
              { month: 'May', points: 98, incidents: 1 },
              { month: 'Jun', points: 125, incidents: 0 }
            ]}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="month" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(0,0,0,0.8)',
                  border: '1px solid rgba(0,212,255,0.3)',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="points" fill="#00d4ff" name="Security Points" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Simulation Activity History */}
      <section className="dashboard__activity">
        <h3>Recent Security Activities</h3>
        <div className="activity-timeline">
          {activityHistory.map((activity) => (
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

      {/* Security Training Recommendations */}
      <section className="dashboard__recommendations">
        <h3>Recommended Security Training</h3>
        <div className="recommendations-grid">
          {trainingRecommendations.map((rec) => (
            <div key={rec.id} className="recommendation-item">
              <span className="recommendation-icon">{rec.icon}</span>
              <div className="recommendation-content">
                <h4>{rec.title}</h4>
                <p>{rec.description}</p>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: '1rem'
                }}>
                  <div style={{
                    width: '100px',
                    height: '6px',
                    background: 'rgba(255,255,255,0.2)',
                    borderRadius: '3px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${rec.progress}%`,
                      height: '100%',
                      background: 'linear-gradient(90deg, #00d4ff, #0099cc)',
                      borderRadius: '3px'
                    }}></div>
                  </div>
                  <span style={{ fontSize: '0.8rem', color: '#888' }}>
                    {rec.progress}% • {rec.estimatedTime}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="dashboard__achievements">
        <h3 style={{
          textAlign: 'center',
          color: '#ffffff',
          fontSize: '1.5rem',
          marginBottom: '2rem',
          fontWeight: '600'
        }}>
          Recent Achievements
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.5rem',
          marginBottom: '3rem'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #ffd700, #ffb347)',
            borderRadius: '12px',
            padding: '1.5rem',
            textAlign: 'center',
            boxShadow: '0 8px 25px rgba(255, 215, 0, 0.3)'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏆</div>
            <h4 style={{ color: '#ffffff', margin: '0 0 0.5rem 0' }}>First Responder</h4>
            <p style={{ color: '#cccccc', fontSize: '0.9rem', margin: 0 }}>
              Reported 5 security incidents
            </p>
          </div>
          <div style={{
            background: 'linear-gradient(135deg, #4ecdc4, #44a08d)',
            borderRadius: '12px',
            padding: '1.5rem',
            textAlign: 'center',
            boxShadow: '0 8px 25px rgba(78, 205, 196, 0.3)'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛡️</div>
            <h4 style={{ color: '#ffffff', margin: '0 0 0.5rem 0' }}>Security Guardian</h4>
            <p style={{ color: '#cccccc', fontSize: '0.9rem', margin: 0 }}>
              Maintained low risk score for 30 days
            </p>
          </div>
          <div style={{
            background: 'linear-gradient(135deg, #00d4ff, #0099cc)',
            borderRadius: '12px',
            padding: '1.5rem',
            textAlign: 'center',
            boxShadow: '0 8px 25px rgba(0, 212, 255, 0.3)'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎓</div>
            <h4 style={{ color: '#ffffff', margin: '0 0 0.5rem 0' }}>Training Champion</h4>
            <p style={{ color: '#cccccc', fontSize: '0.9rem', margin: 0 }}>
              Completed 4 training modules
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
