import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import '../styles/MalwareSimulation.css'

export default function PhishingSimulation() {
  const { user, activeSimulation, clearSimulation } = useAuth()
  const [showResult, setShowResult] = useState(false)
  const [userAction, setUserAction] = useState('')
  const [showCredentialForm, setShowCredentialForm] = useState(false)
  const [credentials, setCredentials] = useState({ username: '', password: '' })

  const userId = activeSimulation?.userId || user?.id
  const campaignId = activeSimulation?.campaignId
  const templateId = activeSimulation?.templateId || 'general'

  const phishingTemplates = {
    general: {
      subject: 'Important: System Maintenance Notice',
      from: 'noreply@company-security.com',
      body: 'Dear Team,\n\nWe will be performing critical system maintenance this weekend. Click below to download the maintenance schedule and FAQs.\n\n[CLICK HERE]\n\nThank you for your patience,\nIT Operations',
      displayBody: 'We will be performing critical system maintenance this weekend. Click below to download the maintenance schedule and FAQs.',
      cta: '[CLICK HERE]',
      urgency: 'low'
    },
    hr: {
      subject: 'Action Required: Update Your Employee Profile',
      from: 'hr@company.com',
      body: 'Dear Employee,\n\nPlease click the link below to verify and update your employee profile information. This is required for our upcoming HR system migration.\n\n[CLICK HERE]\n\nBest regards,\nHuman Resources Team',
      displayBody: 'Please click the link below to verify and update your employee profile information. This is required for our upcoming HR system migration.',
      cta: '[CLICK HERE]',
      urgency: 'medium'
    },
    it: {
      subject: 'Security Alert: Update Your Password Now',
      from: 'security@company.com',
      body: 'Dear Employee,\n\nWe detected suspicious activity on your account. Please click below to verify your credentials and secure your account immediately.\n\n[CLICK HERE]\n\nIf you did not request this, please contact IT.\n\nIT Security Team',
      displayBody: 'We detected suspicious activity on your account. Please click below to verify your credentials and secure your account immediately.',
      cta: '[CLICK HERE]',
      urgency: 'high'
    },
    finance: {
      subject: 'Invoice Verification Required',
      from: 'finance@company.com',
      body: 'Dear Colleague,\n\nWe need you to verify an outstanding invoice. Please click the link below to review and confirm payment details.\n\n[CLICK HERE]\n\nThank you,\nFinance Department',
      displayBody: 'We need you to verify an outstanding invoice. Please click the link below to review and confirm payment details.',
      cta: '[CLICK HERE]',
      urgency: 'medium'
    },
    executive: {
      subject: 'Board Meeting - Confidential Document Access',
      from: 'executive@company.com',
      body: 'Dear Executive,\n\nPlease access the confidential board meeting document by clicking the link below. Your login credentials will be required.\n\n[CLICK HERE]\n\nRegards,\nExecutive Office',
      displayBody: 'Please access the confidential board meeting document by clicking the link below. Your login credentials will be required.',
      cta: '[CLICK HERE]',
      urgency: 'high'
    }
  }

  const template = phishingTemplates[templateId] || phishingTemplates.general

  const handleClickLink = () => {
    setShowCredentialForm(true)
  }

  const deleteMessage = () => {
    // Delete the message from localStorage
    try {
      const adminDMs = JSON.parse(localStorage.getItem('adminDMs') || '{}')
      const userKey = String(userId)
      if (adminDMs[userKey]) {
        adminDMs[userKey] = adminDMs[userKey].filter(msg => msg.campaignId !== campaignId)
        localStorage.setItem('adminDMs', JSON.stringify(adminDMs))
        console.log(`[PhishingSimulation] Deleted message with campaignId ${campaignId} for user ${userKey}`)
      }
    } catch (e) {
      console.error('Error deleting email:', e)
    }
  }

  const handleSubmitCredentials = (e) => {
    e.preventDefault()
    deleteMessage()
    setUserAction('Entered Credentials')
    setShowResult(true)
  }

  const handleReportPhishing = () => {
    deleteMessage()
    setUserAction('Reported Phishing')
    setShowResult(true)
  }

  const handleDeleteEmail = () => {
    deleteMessage()
    setUserAction('Deleted Email')
    setShowResult(true)
  }

  const handleContactIT = () => {
    deleteMessage()
    setUserAction('Contacted IT')
    setShowResult(true)
  }

  const getActionFeedback = (action) => {
    const feedbacks = {
      'Entered Credentials': {
        type: 'danger',
        message: '❌ Compromised! You just gave attackers your credentials.',
        details: 'This phishing email was designed to steal your login information. Always verify email senders before entering credentials on linked pages.'
      },
      'Reported Phishing': {
        type: 'success',
        message: '✅ Excellent! You correctly identified and reported the phishing attempt.',
        details: 'Reporting suspicious emails helps protect your organization. Your security awareness is critical to our defense.'
      },
      'Deleted Email': {
        type: 'success',
        message: '✅ Good! You deleted the suspicious email.',
        details: 'Deleting phishing emails prevents accidental clicks. However, reporting is even better so IT can warn others.'
      },
      'Contacted IT': {
        type: 'success',
        message: '✅ Perfect! You contacted IT about the suspicious email.',
        details: 'This is the best response. IT can investigate and protect other employees from the same attack.'
      }
    }
    return feedbacks[action] || { type: 'warning', message: '⚠️ Unknown action.' }
  }

  if (showResult) {
    const feedback = getActionFeedback(userAction)
    return (
      <div className="malware-simulation">
        <div className="malware-overlay">
          <div className="malware-panel result-panel">
            <div className="result-header">
              <div className={`result-icon ${feedback.type}`}>
                {feedback.type === 'success' ? '🛡️' : feedback.type === 'danger' ? '⚠️' : 'ℹ️'}
              </div>
              <h1>Phishing Simulation Complete</h1>
            </div>

            <div className="result-content">
              <p className="result-message">
                This was a <strong>simulated phishing attack</strong> as part of your organization's security awareness training.
              </p>

              <div className="result-feedback" style={{ 
                padding: '1.5rem', 
                backgroundColor: feedback.type === 'success' ? 'rgba(0, 212, 255, 0.1)' : 
                                 feedback.type === 'danger' ? 'rgba(255, 100, 100, 0.1)' : 
                                 'rgba(255, 200, 0, 0.1)',
                borderLeft: `4px solid ${feedback.type === 'success' ? '#00d4ff' : 
                                         feedback.type === 'danger' ? '#ff6464' : 
                                         '#ffc800'}`,
                borderRadius: '4px',
                marginBottom: '1.5rem'
              }}>
                <p style={{ fontSize: '1.1rem', fontWeight: 'bold', margin: '0 0 0.5rem 0' }}>
                  {feedback.message}
                </p>
                <p style={{ margin: '0', color: '#aaa', fontSize: '0.95rem' }}>
                  {feedback.details}
                </p>
              </div>

              <div className="result-details">
                <h3>📧 What You Saw:</h3>
                <div style={{
                  backgroundColor: 'rgba(0, 212, 255, 0.05)',
                  border: '1px solid rgba(0, 212, 255, 0.2)',
                  borderRadius: '4px',
                  padding: '1rem',
                  marginBottom: '1rem'
                }}>
                  <p><strong>From:</strong> {template.from}</p>
                  <p><strong>Subject:</strong> {template.subject}</p>
                  <p><strong>Red Flags:</strong></p>
                  <ul style={{ margin: '0.5rem 0 0 1.5rem' }}>
                    <li>Generic greeting ("Dear Employee/Colleague" instead of your name)</li>
                    <li>Urgency or pressure to act immediately</li>
                    <li>Request for sensitive information or credentials</li>
                    <li>Suspicious sender email address (check carefully!)</li>
                    <li>Links that don't match the stated domain</li>
                  </ul>
                </div>

                <h3>🛡️ How to Stay Safe:</h3>
                <ul style={{ margin: '0.5rem 0 0 1.5rem' }}>
                  <li><strong>Never click links</strong> from unsolicited emails</li>
                  <li><strong>Verify the sender</strong> by looking at the full email address</li>
                  <li><strong>When in doubt</strong>, navigate to the website directly instead of clicking email links</li>
                  <li><strong>Report suspicious emails</strong> to your IT department immediately</li>
                  <li><strong>Enable two-factor authentication</strong> to protect your accounts</li>
                </ul>
              </div>

              <button 
                onClick={clearSimulation}
                className="button button--primary"
                style={{ marginTop: '1.5rem', width: '100%' }}
              >
                Complete Simulation
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }


  if (showCredentialForm) {
    return (
      <div className="malware-simulation">
        <div className="malware-overlay">
          <div className="malware-panel" style={{ maxWidth: '500px' }}>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🔓</div>
              <h2 style={{ margin: '0 0 0.5rem 0' }}>Verify Your Identity</h2>
              <p style={{ color: '#888', margin: '0' }}>Please enter your credentials to continue</p>
            </div>

            <form onSubmit={handleSubmitCredentials} style={{ marginBottom: '1.5rem' }}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#aaa', fontSize: '0.9rem' }}>
                  Email or Username
                </label>
                <input
                  type="text"
                  value={credentials.username}
                  onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                  placeholder="Enter your email"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    backgroundColor: 'rgba(0, 212, 255, 0.05)',
                    border: '1px solid rgba(0, 212, 255, 0.2)',
                    borderRadius: '4px',
                    color: '#fff',
                    boxSizing: 'border-box'
                  }}
                  required
                />
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#aaa', fontSize: '0.9rem' }}>
                  Password
                </label>
                <input
                  type="password"
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                  placeholder="Enter your password"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    backgroundColor: 'rgba(0, 212, 255, 0.05)',
                    border: '1px solid rgba(0, 212, 255, 0.2)',
                    borderRadius: '4px',
                    color: '#fff',
                    boxSizing: 'border-box'
                  }}
                  required
                />
              </div>
              <button
                type="submit"
                className="button button--primary"
                style={{ width: '100%', marginBottom: '1rem' }}
              >
                Sign In
              </button>
            </form>

            <hr style={{ borderColor: 'rgba(255, 255, 255, 0.1)', marginBottom: '1.5rem' }} />

            <div style={{ textAlign: 'center' }}>
              <p style={{ color: '#888', margin: '0 0 1rem 0', fontSize: '0.9rem' }}>
                ⚠️ Did you notice this looks suspicious?
              </p>
              <button
                onClick={handleReportPhishing}
                className="button button--secondary"
                style={{ width: '100%' }}
              >
                Report as Phishing →
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="malware-simulation">
      <div className="malware-overlay">
        <div className="malware-panel" style={{ maxWidth: '600px' }}>
          {/* Email Preview */}
          <div style={{
            backgroundColor: 'rgba(0, 212, 255, 0.05)',
            border: '1px solid rgba(0, 212, 255, 0.2)',
            borderRadius: '4px',
            padding: '1.5rem',
            marginBottom: '2rem'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '0.5rem',
              paddingBottom: '1rem',
              borderBottom: '1px solid rgba(0, 212, 255, 0.2)'
            }}>
              <div>
                <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.9rem', color: '#888' }}>From:</p>
                <p style={{ margin: '0', fontWeight: 'bold', color: '#fff' }}>{template.from}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                {template.urgency === 'high' && <span style={{ color: '#ff6464', fontWeight: 'bold' }}>⚠️ URGENT</span>}
                {template.urgency === 'medium' && <span style={{ color: '#ffc800', fontWeight: 'bold' }}>⚡ ACTION REQUIRED</span>}
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <p style={{ margin: '0.5rem 0', fontSize: '0.9rem', color: '#888' }}>Subject:</p>
              <h3 style={{ margin: '0.5rem 0', color: '#fff' }}>{template.subject}</h3>
            </div>

            <div style={{ marginBottom: '1.5rem', lineHeight: '1.6', color: '#ccc' }}>
              {template.displayBody}
            </div>

            <button
              onClick={handleClickLink}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#00d4ff',
                color: '#000',
                border: 'none',
                borderRadius: '4px',
                fontWeight: 'bold',
                cursor: 'pointer',
                marginBottom: '1.5rem',
                display: 'block'
              }}
            >
              {template.cta}
            </button>
          </div>

          {/* Actions */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <button
              onClick={handleDeleteEmail}
              className="button button--secondary"
              style={{ width: '100%' }}
            >
              🗑️ Delete Email
            </button>
            <button
              onClick={handleReportPhishing}
              className="button button--primary"
              style={{ width: '100%' }}
            >
              🚨 Report Phishing
            </button>
          </div>

          <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
            <button
              onClick={handleContactIT}
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: 'transparent',
                border: '1px solid rgba(0, 212, 255, 0.3)',
                color: '#00d4ff',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              📞 Contact IT Support
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
