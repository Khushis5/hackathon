import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function RansomwareSimulation() {
  const { activeSimulation, clearSimulation } = useAuth()
  const navigate = useNavigate()
  const [showResult, setShowResult] = useState(false)
  const [userAction, setUserAction] = useState('')
  const [encryptedFiles, setEncryptedFiles] = useState(0)

  const queryParams = new URLSearchParams(window.location.search)
  const userId = activeSimulation?.userId || queryParams.get('u')
  const campaignId = activeSimulation?.campaignId || queryParams.get('c')
  const templateId = activeSimulation?.templateId || queryParams.get('t') || 'ransomware'

  // Simulate file encryption counter
  useEffect(() => {
    if (!showResult) {
      const interval = setInterval(() => {
        setEncryptedFiles(prev => {
          if (prev < 1247) {
            return prev + Math.floor(Math.random() * 50) + 20
          }
          return 1247
        })
      }, 800)
      return () => clearInterval(interval)
    }
  }, [showResult])

  // Fallback: if no activeSimulation, redirect to dashboard
  useEffect(() => {
    if (!activeSimulation) {
      navigate('/dashboard', { replace: true })
    }
  }, [activeSimulation, navigate])

  const handleAction = async (action) => {
    // Cleanup: ensure the ransomware pending entry is removed
    try {
      const pendingRansomware = JSON.parse(localStorage.getItem('pendingRansomware') || '{}')
      const userKey = String(userId)
      if (pendingRansomware[userKey]) {
        delete pendingRansomware[userKey]
        localStorage.setItem('pendingRansomware', JSON.stringify(pendingRansomware))
        console.log(`[RansomwareSimulation] Cleaned up pending ransomware for user ${userKey}`)
      }
    } catch (e) {
      console.error('Error cleaning up ransomware:', e)
    }

    setUserAction(action)
    setShowResult(true)

    // Log the event
    const eventData = {
      event_type: `ransomware_${action.toLowerCase().replace(/ /g, '_')}`,
      user_id: userId,
      campaign_id: campaignId,
      template_id: templateId,
      encrypted_files: encryptedFiles,
      timestamp: new Date().toISOString(),
      simulation: true
    }

    console.log('Logging ransomware event:', eventData)

    // Clear the simulation
    clearSimulation()
  }

  const getActionFeedback = (action) => {
    const feedbacks = {
      'Isolate System Immediately': {
        type: 'success',
        message: '✅ Excellent! Isolation is the first critical step.',
        details: 'Disconnecting from network prevents ransomware from spreading to other systems and network shares. This is the correct immediate response.'
      },
      'Call Security Team': {
        type: 'success',
        message: '✅ Perfect! Professional response initiated.',
        details: 'The security team can initiate incident response procedures, isolate the network segment, and begin forensic analysis.'
      },
      'Preserve Evidence': {
        type: 'success',
        message: '✅ Good! Preserving evidence for forensics.',
        details: 'Documenting the attack preserves valuable evidence for investigation and helps identify attack patterns and threat actors.'
      },
      'Keep Working': {
        type: 'danger',
        message: '❌ Critical mistake!',
        details: 'Continuing to use the system allows ransomware to spread across your network and encrypt more critical data.'
      }
    }
    return feedbacks[action] || { type: 'warning', message: '⚠️ Take immediate action against ransomware.' }
  }

  if (showResult) {
    const feedback = getActionFeedback(userAction)
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: '#0a0a0a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        overflow: 'auto'
      }}>
        <div style={{
          position: 'relative',
          background: '#0f0f1a',
          border: feedback.type === 'success' ? '2px solid #00d4ff' : '2px solid #994444',
          borderRadius: '0px',
          padding: '50px',
          maxWidth: '800px',
          width: '95%',
          maxHeight: '95vh',
          overflow: 'auto',
          textAlign: 'center',
          boxShadow: feedback.type === 'success' ? '0 0 30px rgba(0, 212, 255, 0.2)' : '0 0 30px rgba(153, 68, 68, 0.2)'
        }}>
          <div style={{
            fontSize: '3.5rem',
            marginBottom: '20px'
          }}>
            {feedback.type === 'success' ? '🛡️' : '⚠️'}
          </div>

          <h1 style={{
            color: feedback.type === 'success' ? '#00d4ff' : '#bb5555',
            fontSize: '2rem',
            margin: '0 0 10px 0',
            fontWeight: 'bold',
            textTransform: 'uppercase'
          }}>
            {feedback.type === 'success' ? 'Incident Response Initiated' : 'Critical Security Failure'}
          </h1>

          <p style={{
            color: '#aaa',
            fontSize: '1rem',
            margin: '10px 0 30px 0'
          }}>
            This was a <strong>simulated ransomware attack</strong> as part of your organization's security awareness training.
          </p>

          <div style={{
            background: feedback.type === 'success' ? 'rgba(0, 212, 255, 0.08)' : 'rgba(153, 100, 100, 0.08)',
            border: `1px solid ${feedback.type === 'success' ? '#00d4ff' : '#996666'}`,
            borderRadius: '0px',
            padding: '25px',
            marginBottom: '25px'
          }}>
            <p style={{
              fontSize: '1.1rem',
              fontWeight: 'bold',
              margin: '0 0 10px 0',
              color: feedback.type === 'success' ? '#00d4ff' : '#996666'
            }}>
              {feedback.message}
            </p>
            <p style={{
              margin: '0',
              color: '#aaa',
              fontSize: '0.95rem'
            }}>
              {feedback.details}
            </p>
          </div>

          <div style={{
            textAlign: 'left',
            background: 'rgba(255, 150, 0, 0.05)',
            border: '1px solid rgba(255, 150, 0, 0.3)',
            borderRadius: '0px',
            padding: '20px',
            marginBottom: '25px',
            fontSize: '0.9rem'
          }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#ffaa00', textTransform: 'uppercase', fontSize: '1rem' }}>🚨 What Happened:</h3>
            <p style={{ margin: '0 0 10px 0', color: '#aaa' }}>A ransomware executable was disguised as a legitimate attachment or download and automatically executed when opened, initiating file encryption.</p>

            <h3 style={{ margin: '15px 0 10px 0', color: '#ffaa00', textTransform: 'uppercase', fontSize: '1rem' }}>📊 Attack Impact:</h3>
            <p style={{ margin: '0 0 10px 0', color: '#aaa' }}>Files encrypted before response: <strong>{encryptedFiles.toLocaleString()}</strong> / 1,247</p>

            <h3 style={{ margin: '15px 0 10px 0', color: '#ffaa00', textTransform: 'uppercase', fontSize: '1rem' }}>🛡️ Ransomware Defense Checklist:</h3>
            <ul style={{
              margin: '0 0 0 20px',
              color: '#aaa',
              lineHeight: '1.8'
            }}>
              <li>🔌 Immediately disconnect from network to prevent spread</li>
              <li>📞 Call IT Security team - do NOT continue using system</li>
              <li>📸 Document/screenshot malware messages for forensics</li>
              <li>💾 Regularly backup critical files to offline storage</li>
              <li>🔐 Never pay ransom or contact attackers</li>
              <li>📮 Report to FBI/local law enforcement</li>
              <li>⚠️ Alert your team - they may be targeted too</li>
            </ul>
          </div>

          <button
            onClick={clearSimulation}
            style={{
              padding: '14px 28px',
              background: '#00d4ff',
              color: '#000',
              border: 'none',
              borderRadius: '0px',
              fontSize: '0.95rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              width: '100%',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              e.target.style.background = '#0088cc'
              e.target.style.boxShadow = '0 0 20px rgba(0, 212, 255, 0.5)'
            }}
            onMouseOut={(e) => {
              e.target.style.background = '#00d4ff'
              e.target.style.boxShadow = 'none'
            }}
          >
            Complete Simulation & Return to Dashboard
          </button>
        </div>
      </div>
    )
  }

  // Main ransomware lock screen
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: '#0a0a0a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      overflow: 'hidden'
    }}>
      {/* Glitch effect background */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'repeating-linear-gradient(0deg, rgba(255, 68, 68, 0.03) 0px, rgba(255, 68, 68, 0.05) 1px, transparent 1px, transparent 2px)',
        pointerEvents: 'none',
        animation: 'scanlines 8s linear infinite'
      }} />

      {/* Main ransomware screen */}
      <div style={{
        position: 'relative',
        background: '#0f0f1a',
        border: '2px solid #994444',
        borderRadius: '0px',
        padding: '50px',
        maxWidth: '800px',
        width: '95%',
        maxHeight: '95vh',
        overflow: 'auto',
        textAlign: 'center',
        boxShadow: '0 0 60px rgba(153, 68, 68, 0.3), inset 0 0 40px rgba(153, 68, 68, 0.05)',
        fontFamily: 'Monaco, "Courier New", monospace',
        animation: 'criticalAlertPulse 2s ease-in-out infinite'
      }}>
        {/* Alert icon */}
        <div style={{
          fontSize: '4rem',
          marginBottom: '20px',
          animation: 'none'
        }}>
          ⚠️
        </div>

        {/* Title - Professional warning */}
        <h1 style={{
          color: '#bb5555',
          fontSize: '2.2rem',
          margin: '0 0 10px 0',
          fontWeight: 'bold',
          textShadow: 'none',
          letterSpacing: '3px',
          textTransform: 'uppercase'
        }}>
          CRITICAL SECURITY ALERT
        </h1>

        {/* Subtitle */}
        <p style={{
          color: '#996666',
          fontSize: '1.1rem',
          margin: '10px 0 30px 0',
          fontWeight: '600',
          textTransform: 'uppercase',
          letterSpacing: '1px'
        }}>
          Ransomware Detected - System Compromised
        </p>

        {/* Professional ransom note */}
        <div style={{
          background: '#1a1a2e',
          border: '1px solid #994444',
          borderRadius: '0px',
          padding: '30px',
          marginBottom: '30px',
          lineHeight: '1.9',
          textAlign: 'left'
        }}>
          <p style={{ margin: '0 0 15px 0', color: '#fff', fontSize: '0.95rem', fontFamily: 'monospace' }}>
            [ENCRYPTION NOTICE]
          </p>
          <p style={{ margin: '0 0 15px 0', color: '#e5e7eb', fontSize: '0.95rem' }}>
            Your system and files have been encrypted with advanced encryption. All your personal files, documents, photos, videos, and backups are inaccessible.
          </p>
          <p style={{ margin: '0 0 15px 0', color: '#996666', fontSize: '0.9rem', fontWeight: 'bold' }}>
            Files Encrypted: <span style={{color: '#ffffff'}}>{encryptedFiles.toLocaleString()} / 1,247</span>
          </p>
          <p style={{ margin: '0 0 15px 0', color: '#e5e7eb', fontSize: '0.95rem' }}>
            Without our decryption key, you will NEVER be able to recover your files. You have limited time to take action.
          </p>
          <p style={{ margin: '0', color: '#ffaa00', fontSize: '0.9rem', fontWeight: 'bold' }}>
            Contact: admin@recovery.onion | Time Remaining: 72 HOURS
          </p>
        </div>

        {/* Critical status */}
        <div style={{
          background: 'rgba(153, 100, 100, 0.1)',
          border: '1px solid rgba(153, 100, 100, 0.4)',
          borderRadius: '0px',
          padding: '20px',
          marginBottom: '30px',
          fontSize: '0.9rem',
          color: '#996666'
        }}>
          <p style={{ margin: '5px 0', fontWeight: 'bold' }}>⚠️ ENCRYPTION IN PROGRESS...</p>
          <p style={{ margin: '5px 0', color: '#bb5555', fontWeight: 'bold' }}>
            🔒 YOUR SYSTEM IS LOCKED - DO NOT REBOOT OR RESTART
          </p>
          <p style={{ margin: '5px 0', color: '#aaa', fontSize: '0.85rem' }}>
            Network communication detected - ransomware is spreading
          </p>
        </div>

        {/* Action buttons - Realistic responses */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px',
          marginBottom: '15px'
        }}>
          <button
            onClick={() => handleAction('Isolate System Immediately')}
            style={{
              padding: '16px',
              background: '#994444',
              color: '#fff',
              border: '1px solid #bb5555',
              borderRadius: '0px',
              fontSize: '0.9rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              e.target.style.background = '#bb5555'
              e.target.style.boxShadow = '0 0 20px rgba(187, 85, 85, 0.6)'
            }}
            onMouseOut={(e) => {
              e.target.style.background = '#994444'
              e.target.style.boxShadow = 'none'
            }}
          >
            🔌 ISOLATE SYSTEM
          </button>
          <button
            onClick={() => handleAction('Call Security Team')}
            style={{
              padding: '16px',
              background: '#994444',
              color: '#fff',
              border: '1px solid #bb5555',
              borderRadius: '0px',
              fontSize: '0.9rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              e.target.style.background = '#bb5555'
              e.target.style.boxShadow = '0 0 20px rgba(187, 85, 85, 0.6)'
            }}
            onMouseOut={(e) => {
              e.target.style.background = '#994444'
              e.target.style.boxShadow = 'none'
            }}
          >
            📞 CALL SECURITY
          </button>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px'
        }}>
          <button
            onClick={() => handleAction('Preserve Evidence')}
            style={{
              padding: '16px',
              background: '#994444',
              color: '#fff',
              border: '1px solid #bb5555',
              borderRadius: '0px',
              fontSize: '0.9rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              e.target.style.background = '#bb5555'
              e.target.style.boxShadow = '0 0 20px rgba(187, 85, 85, 0.6)'
            }}
            onMouseOut={(e) => {
              e.target.style.background = '#994444'
              e.target.style.boxShadow = 'none'
            }}
          >
            📸 PRESERVE EVIDENCE
          </button>
          <button
            onClick={() => handleAction('Keep Working')}
            style={{
              padding: '16px',
              background: 'rgba(100, 100, 100, 0.3)',
              color: '#888',
              border: '1px solid #666',
              borderRadius: '0px',
              fontSize: '0.9rem',
              fontWeight: 'bold',
              cursor: 'not-allowed',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              opacity: '0.6'
            }}
            onMouseOver={(e) => {
              e.target.style.background = 'rgba(150, 100, 100, 0.4)'
              e.target.style.color = '#bb5555'
              e.target.style.borderColor = '#bb5555'
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'rgba(100, 100, 100, 0.3)'
              e.target.style.color = '#888'
              e.target.style.borderColor = '#666'
            }}
          >
            ❌ KEEP WORKING?
          </button>
        </div>

        {/* Footer */}
        <p style={{
          marginTop: '30px',
          fontSize: '0.8rem',
          color: '#666',
          fontStyle: 'italic'
        }}>
          ⏰ This is a security awareness training simulation. No files have been encrypted.
        </p>
      </div>

      <style>{`
        @keyframes criticalAlertPulse {
          0%, 100% {
            box-shadow: 0 0 60px rgba(153, 68, 68, 0.3), inset 0 0 40px rgba(153, 68, 68, 0.05);
          }
          50% {
            box-shadow: 0 0 80px rgba(153, 68, 68, 0.5), inset 0 0 60px rgba(153, 68, 68, 0.1);
          }
        }
          }
        }

        @keyframes scanlines {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(10px);
          }
        }
      `}</style>
    </div>
  )
}
