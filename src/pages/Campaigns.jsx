import { useMemo, useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import './Campaigns.css'

const emailTemplates = {
  hr: {
    subject: 'Action Required: Update Your Employee Profile',
    body: 'Dear Employee,\n\nPlease click the link below to verify and update your employee profile information. This is required for our upcoming HR system migration.\n\n[CLICK HERE]\n\nBest regards,\nHuman Resources Team',
    department: 'HR'
  },
  it: {
    subject: 'Security Alert: Update Your Password Now',
    body: 'Dear Employee,\n\nWe detected suspicious activity on your account. Please click below to verify your credentials and secure your account immediately.\n\n[CLICK HERE]\n\nIf you did not request this, please contact IT.\n\nIT Security Team',
    department: 'IT'
  },
  finance: {
    subject: 'Invoice Verification Required',
    body: 'Dear Colleague,\n\nWe need you to verify an outstanding invoice. Please click the link below to review and confirm payment details.\n\n[CLICK HERE]\n\nThank you,\nFinance Department',
    department: 'Finance'
  },
  executive: {
    subject: 'Board Meeting - Confidential Document Access',
    body: 'Dear Executive,\n\nPlease access the confidential board meeting document by clicking the link below. Your login credentials will be required.\n\n[CLICK HERE]\n\nRegards,\nExecutive Office',
    department: 'Executive'
  },
  general: {
    subject: 'Important: System Maintenance Notice',
    body: 'Dear Team,\n\nWe will be performing critical system maintenance this weekend. Click below to download the maintenance schedule and FAQs.\n\n[CLICK HERE]\n\nThank you for your patience,\nIT Operations',
    department: 'General'
  }
}

const malwareTemplates = {
  trojan: {
    subject: 'Important: System Security Update Required',
    body: 'Dear Employee,\n\nOur IT department has detected a potential security vulnerability on your workstation.\n\nPlease download and run the attached Security_Scanner.exe to check for any issues.\n\nFailure to comply may result in restricted access to company resources.\n\nBest regards,\nIT Security Team',
    attachment: 'Security_Scanner.exe',
    department: 'IT'
  },
  keylogger: {
    subject: 'New Employee Handbook - Please Review',
    body: 'Dear Team Member,\n\nWe have updated our employee handbook with new policies and procedures for 2026.\n\nPlease download and review the attached Employee_Handbook_2026.pdf.\n\nYour acknowledgment is required by the end of the week.\n\nThank you,\nHR Department',
    attachment: 'Employee_Handbook_2026.pdf',
    department: 'HR'
  },
  worm: {
    subject: 'Urgent: Network Maintenance Tool Required',
    body: 'Dear Colleague,\n\nTo ensure continued network stability, all employees are required to run the attached Network_Maintenance.exe tool before Friday.\n\nThank you for your cooperation,\nNetwork Operations',
    attachment: 'Network_Maintenance.exe',
    department: 'IT'
  },
  ransomware: {
    subject: 'Critical: Data Backup Verification',
    body: 'Dear Employee,\n\nAs part of our new data protection policy, please download and run the attached Backup_Verify.exe tool.\n\nThis process is mandatory to ensure your files are properly backed up and protected.\n\nBest regards,\nData Protection Team',
    attachment: 'Backup_Verify.exe',
    department: 'General'
  }
}

const ransomwareTemplates = { ...malwareTemplates }

const mockEmployees = [
  { id: 1, name: 'Ava Chen', email: 'ava.chen@company.com', department: 'Engineering', branch: 'Americas' },
  { id: 2, name: 'Sam Patel', email: 'sam.patel@company.com', department: 'Finance', branch: 'Europe' },
  { id: 3, name: 'Jordan Lee', email: 'jordan.lee@company.com', department: 'Marketing', branch: 'APAC' },
  { id: 4, name: 'Taylor Smith', email: 'taylor@company.com', department: 'Engineering', branch: 'Global HQ' },
  { id: 5, name: 'Casey Johnson', email: 'casey.j@company.com', department: 'HR', branch: 'Global HQ' },
  { id: 6, name: 'Morgan Davis', email: 'morgan.d@company.com', department: 'IT', branch: 'Americas' },
  { id: 7, name: 'Riley Chen', email: 'riley.c@company.com', department: 'Finance', branch: 'Europe' },
  { id: 8, name: 'Alex Brown', email: 'alex.b@company.com', department: 'Executive', branch: 'Global HQ' },
]

const initialCampaigns = [
  {
    id: 1,
    name: 'Q1 Phishing Test',
    createdAt: '2026-03-11',
    branch: 'Global HQ',
    participants: 327,
    engaged: 245,
    clicked: 68,
    submitted: 34,
    status: 'active',
    type: 'Phishing'
  },
  {
    id: 2,
    name: 'Invoice Scam Simulation',
    createdAt: '2026-01-18',
    branch: 'Europe',
    participants: 118,
    engaged: 98,
    clicked: 44,
    submitted: 18,
    status: 'completed',
    type: 'Ransomware'
  },
]

export default function Campaigns() {
  const { user } = useAuth()
  const [campaigns, setCampaigns] = useState([])
  const [search, setSearch] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [selectedCampaign, setSelectedCampaign] = useState(null)
  const [showLaunchForm, setShowLaunchForm] = useState(false)
  const [showLaunchConfirm, setShowLaunchConfirm] = useState(false)
  const [isLaunching, setIsLaunching] = useState(false)
  const [launchData, setLaunchData] = useState({
    templateId: 'general',
    selectedEmployees: [],
    selectedBranch: '',
    selectedDepartment: ''
  })
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    branch: 'Global HQ',
    type: 'Phishing',
  })

  useEffect(() => {
    const savedCampaigns = localStorage.getItem('campaigns')
    if (savedCampaigns) {
      try {
        const parsed = JSON.parse(savedCampaigns)
        setCampaigns(parsed.length > 0 ? parsed : initialCampaigns)
      } catch {
        setCampaigns(initialCampaigns)
      }
    } else {
      setCampaigns(initialCampaigns)
    }
  }, [])

  useEffect(() => {
    if (campaigns.length > 0) {
      localStorage.setItem('campaigns', JSON.stringify(campaigns))
    }
  }, [campaigns])

  const filtered = useMemo(() => {
    const lower = search.toLowerCase()
    return campaigns.filter(
      (item) =>
        item.name.toLowerCase().includes(lower) ||
        item.branch.toLowerCase().includes(lower) ||
        item.status.toLowerCase().includes(lower),
    )
  }, [campaigns, search])

  const handleCreateCampaign = (e) => {
    e.preventDefault()
    const nextId = Math.max(...campaigns.map((c) => c.id)) + 1
    const campaign = {
      id: nextId,
      name: newCampaign.name,
      createdAt: new Date().toISOString().slice(0, 10),
      branch: newCampaign.branch,
      participants: 0,
      engaged: 0,
      clicked: 0,
      submitted: 0,
      status: 'draft',
      type: newCampaign.type,
    }
    setCampaigns((prev) => [campaign, ...prev])
    setNewCampaign({ name: '', branch: 'Global HQ', type: 'Phishing' })
    setShowCreateForm(false)
  }

  const filteredEmployees = useMemo(() => {
    return mockEmployees.filter(emp => !launchData.selectedEmployees.includes(emp.id))
  }, [launchData.selectedEmployees])

  const handleDeleteCampaign = (campaignId) => {
    if (confirm('Are you sure you want to delete this campaign? This action cannot be undone.')) {
      const updatedCampaigns = campaigns.filter(c => c.id !== campaignId)
      setCampaigns(updatedCampaigns)
      localStorage.setItem('campaigns', JSON.stringify(updatedCampaigns))
      setSelectedCampaign(null)
      console.log(`[Campaigns] Deleted campaign ${campaignId}`)
    }
  }

  const handleLaunchCampaign = (e) => {
    e.preventDefault()
    if (launchData.selectedEmployees.length === 0) {
      alert('Please select at least one employee')
      return
    }
    setShowLaunchConfirm(true)
  }

  const confirmLaunchCampaign = async () => {
    setIsLaunching(true)
    const selectedCount = launchData.selectedEmployees.length

    console.log('=========== [Campaigns] CAMPAIGN LAUNCH START ===========')
    console.log('[Campaigns] Launching campaign:', selectedCampaign)
    console.log('[Campaigns] Campaign type:', selectedCampaign.type)
    console.log('[Campaigns] Template ID:', launchData.templateId)

    if (selectedCampaign.type === 'Ransomware') {
      // Ransomware: Auto-trigger on next login
      const pendingRansomware = JSON.parse(localStorage.getItem('pendingRansomware') || '{}')
      console.log('[Campaigns] Storing ransomware to trigger on login')
      
      launchData.selectedEmployees.forEach(userId => {
        const userKey = String(userId)
        pendingRansomware[userKey] = {
          campaignId: selectedCampaign.id,
          templateId: launchData.templateId,
          type: 'ransomware',
          timestamp: Date.now()
        }
        console.log(`[Campaigns] Ransomware pending for user ${userKey}`)
      })
      
      localStorage.setItem('pendingRansomware', JSON.stringify(pendingRansomware))
      console.log('[Campaigns] pendingRansomware saved:', JSON.parse(localStorage.getItem('pendingRansomware')))
    } else {
      // Phishing & Malware: Send as emails only
      console.log(`[Campaigns] Sending ${selectedCampaign.type} emails to ${launchData.selectedEmployees.length} employees`)
      
      launchData.selectedEmployees.forEach(userId => {
        const userKey = String(userId)
        let body = ''
        if (selectedCampaign.type === 'Phishing') {
          body = emailTemplates[launchData.templateId]?.body || 'No message body'
        } else if (selectedCampaign.type === 'Malware') {
          body = malwareTemplates[launchData.templateId]?.body || 'No message body'
        }
        console.log(`[Campaigns] Email sent for ${selectedCampaign.type} campaign to user ${userKey}`)
      })
      
      console.log('[Campaigns] All emails sent successfully')
    }
    
    console.log('=========== [Campaigns] CAMPAIGN LAUNCH END ===========')

    await new Promise(resolve => setTimeout(resolve, 2000))

    const updatedCampaigns = campaigns.map(c => {
      if (c.id === selectedCampaign.id) {
        return {
          ...c,
          status: 'active',
          participants: selectedCount,
          engaged: Math.floor(selectedCount * 0.75),
          clicked: Math.floor(selectedCount * 0.2),
          submitted: Math.floor(selectedCount * 0.1)
        }
      }
      return c
    })

    setCampaigns(updatedCampaigns)
    setSelectedCampaign({ ...selectedCampaign, status: 'active' })
    localStorage.setItem('campaigns', JSON.stringify(updatedCampaigns))
    setShowLaunchForm(false)
    setShowLaunchConfirm(false)
    setIsLaunching(false)
    setLaunchData({ templateId: 'general', selectedEmployees: [], selectedBranch: '', selectedDepartment: '' })

    alert(`Campaign completed! ${
      selectedCampaign.type === 'Phishing' ? `Emails sent to ${selectedCount} employees.` :
      selectedCampaign.type === 'Ransomware' ? `Ransomware attack scheduled! System will lock when ${selectedCount} employees next login.` :
      `Emails sent to ${selectedCount} employees.`
    }`)
  }

  const toggleEmployeeSelection = (empId) => {
    setLaunchData(prev => ({
      ...prev,
      selectedEmployees: prev.selectedEmployees.includes(empId)
        ? prev.selectedEmployees.filter(id => id !== empId)
        : [...prev.selectedEmployees, empId]
    }))
  }

  const selectAllInBranch = () => {
    if (!launchData.selectedBranch) return
    const ids = mockEmployees
      .filter(emp => emp.branch === launchData.selectedBranch && !launchData.selectedEmployees.includes(emp.id))
      .map(emp => emp.id)
    setLaunchData(prev => ({ ...prev, selectedEmployees: [...prev.selectedEmployees, ...ids] }))
  }

  const selectAllInDepartment = () => {
    if (!launchData.selectedDepartment) return
    const ids = mockEmployees
      .filter(emp => emp.department === launchData.selectedDepartment && !launchData.selectedEmployees.includes(emp.id))
      .map(emp => emp.id)
    setLaunchData(prev => ({ ...prev, selectedEmployees: [...prev.selectedEmployees, ...ids] }))
  }

  const selectAllInBoth = () => {
    if (!launchData.selectedBranch || !launchData.selectedDepartment) return
    const ids = mockEmployees
      .filter(emp =>
        emp.branch === launchData.selectedBranch &&
        emp.department === launchData.selectedDepartment &&
        !launchData.selectedEmployees.includes(emp.id)
      )
      .map(emp => emp.id)
    setLaunchData(prev => ({ ...prev, selectedEmployees: [...prev.selectedEmployees, ...ids] }))
  }

  const getSelectedEmployeeNames = () => {
    return mockEmployees
      .filter(emp => launchData.selectedEmployees.includes(emp.id))
      .map(emp => emp.name)
  }

  const getTemplateSets = () => {
    if (!selectedCampaign) return {}
    if (selectedCampaign.type === 'Phishing') return emailTemplates
    if (selectedCampaign.type === 'Ransomware') return ransomwareTemplates
    return malwareTemplates
  }

  return (
    <>
      {/* ── Main campaigns list ── */}
      <div className="campaigns">
        <header className="campaigns__header">
          <div>
            <h2>Security Campaigns</h2>
          </div>
          <div className="campaigns__header-actions">
            <input
              type="text"
              placeholder="Search campaigns..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="campaigns__search-input"
            />
            <button className="button button--primary" onClick={() => setShowCreateForm(!showCreateForm)}>
              {showCreateForm ? 'Cancel' : '+ New Campaign'}
            </button>
          </div>
        </header>

        {showCreateForm && (
          <form className="campaigns__form" onSubmit={handleCreateCampaign}>
            <h3>Create New Campaign</h3>
            <div className="form__row">
              <div className="form__group">
                <label>Campaign Name</label>
                <input
                  type="text"
                  value={newCampaign.name}
                  onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                  placeholder="e.g. Q2 Phishing Test"
                  required
                />
              </div>
              <div className="form__group">
                <label>Branch</label>
                <select value={newCampaign.branch} onChange={(e) => setNewCampaign({ ...newCampaign, branch: e.target.value })}>
                  <option>Global HQ</option>
                  <option>Americas</option>
                  <option>Europe</option>
                  <option>APAC</option>
                </select>
              </div>
              <div className="form__group">
                <label>Type</label>
                <select value={newCampaign.type} onChange={(e) => setNewCampaign({ ...newCampaign, type: e.target.value })}>
                  <option>Phishing</option>
                  <option>Malware</option>
                  <option>Ransomware</option>
                </select>
              </div>
            </div>
            <button type="submit" className="button button--primary">Create Campaign</button>
          </form>
        )}

        <div className="campaigns__list">
          {filtered.length === 0 && (
            <p className="campaigns__empty">No campaigns found.</p>
          )}
          {filtered.map(c => (
            <div key={c.id} className="campaign-card">
              <div className="campaign-card__header">
                <div>
                  <h3>{c.name}</h3>
                  <p className="campaign-card__type">{c.type} · {c.branch}</p>
                </div>
                <span className={`badge badge--${c.status}`}>{c.status}</span>
              </div>

              <div className="campaign-card__stats">
                <div className="stat">
                  <span>Participants</span>
                  <strong>{c.participants}</strong>
                </div>
                <div className="stat">
                  <span>Clicked</span>
                  <strong>{c.clicked}</strong>
                </div>
                <div className="stat">
                  <span>Submitted</span>
                  <strong>{c.submitted}</strong>
                </div>
              </div>

              <div className="campaign-card__footer">
                <small>Created {c.createdAt}</small>
                <button
                  className="campaign-card__action"
                  onClick={() => setSelectedCampaign(c)}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Campaign details modal ── */}
      {selectedCampaign && !showLaunchForm && (
        <div className="campaign-details-modal">
          <div className="campaign-details-overlay" onClick={() => setSelectedCampaign(null)} />
          <div className="campaign-details-panel">

            <div className="campaign-details__header">
              <div>
                <h2>{selectedCampaign.name}</h2>
                <p>{selectedCampaign.type} · {selectedCampaign.branch}</p>
              </div>
              <button className="campaign-details__close" onClick={() => setSelectedCampaign(null)}>✕</button>
            </div>

            <div className="campaign-details__content">

              <div className="details-section">
                <h3>Overview</h3>
                <div className="details-grid">
                  <div className="detail-item">
                    <span className="detail-label">Status</span>
                    <span className="detail-value">
                      <span className={`badge badge--${selectedCampaign.status}`}>{selectedCampaign.status}</span>
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Created</span>
                    <span className="detail-value">{selectedCampaign.createdAt}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Branch</span>
                    <span className="detail-value">{selectedCampaign.branch}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Type</span>
                    <span className="detail-value">{selectedCampaign.type}</span>
                  </div>
                </div>
              </div>

              <div className="details-section">
                <h3>Metrics</h3>
                <div className="details-metrics">
                  <div className="metric-card">
                    <span className="metric-label">Participants</span>
                    <span className="metric-value">{selectedCampaign.participants}</span>
                    <span className="metric-desc">Total targeted</span>
                  </div>
                  <div className="metric-card">
                    <span className="metric-label">Engaged</span>
                    <span className="metric-value">{selectedCampaign.engaged}</span>
                    <span className="metric-desc">Opened email</span>
                  </div>
                  <div className="metric-card">
                    <span className="metric-label">Clicked</span>
                    <span className="metric-value">{selectedCampaign.clicked}</span>
                    <span className="metric-desc">Clicked link</span>
                  </div>
                  <div className="metric-card">
                    <span className="metric-label">Submitted</span>
                    <span className="metric-value">{selectedCampaign.submitted}</span>
                    <span className="metric-desc">Entered credentials</span>
                  </div>
                </div>
              </div>

              <div className="details-section">
                <h3>Insights</h3>
                <div className="insights-list">
                  <div className="insight-item">
                    <span className="insight-icon">▸</span>
                    <span>
                      {selectedCampaign.status === 'active'
                        ? 'Campaign is currently running. Monitor engagement in real-time.'
                        : selectedCampaign.status === 'completed'
                        ? 'Campaign completed. Review results for security training opportunities.'
                        : 'Campaign is in draft status. Configure and launch when ready.'}
                    </span>
                  </div>
                  <div className="insight-item">
                    <span className="insight-icon">▸</span>
                    <span>
                      Recommended action:{' '}
                      {selectedCampaign.submitted > 10
                        ? 'Conduct mandatory security awareness training for high-risk users.'
                        : 'Consider phishing prevention tools and continued user education.'}
                    </span>
                  </div>
                </div>
              </div>

            </div>

            <div className="campaign-details__footer">
              <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
                <button 
                  className="details-btn details-btn--danger" 
                  onClick={() => handleDeleteCampaign(selectedCampaign.id)}
                  style={{
                    background: 'rgba(255, 100, 100, 0.2)',
                    color: '#ff6464',
                    border: '2px solid #ff6464',
                    flex: 1
                  }}
                >
                  🗑️ Delete Campaign
                </button>
                <button 
                  className="details-btn details-btn--secondary" 
                  onClick={() => setSelectedCampaign(null)}
                  style={{ flex: 1 }}
                >
                  Close
                </button>
                {selectedCampaign.status === 'draft' && (
                  <button 
                    className="details-btn details-btn--primary" 
                    onClick={() => setShowLaunchForm(true)}
                    style={{ flex: 1 }}
                  >
                    Launch Campaign
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ── Launch form modal ── */}
      {showLaunchForm && selectedCampaign && (
        <div className="launch-modal">
          <div className="launch-overlay" onClick={() => setShowLaunchForm(false)} />
          <div className="launch-panel">
            <div className="launch-header">
              <h2>Launch: {selectedCampaign.name}</h2>
              <button onClick={() => setShowLaunchForm(false)}>✕</button>
            </div>

            <form className="launch-form" onSubmit={handleLaunchCampaign}>
              <div className="launch-content">

                {/* Template selection */}
                <div className="launch-section">
                  <h3>Select Template</h3>
                  <div className="template-options">
                    {Object.entries(getTemplateSets()).map(([templateId, template]) => (
                      <label
                        key={templateId}
                        className={`template-option malware-template-option ${launchData.templateId === templateId ? 'selected' : ''}`}
                      >
                        <input
                          type="radio"
                          name="template"
                          value={templateId}
                          checked={launchData.templateId === templateId}
                          onChange={(e) => setLaunchData({ ...launchData, templateId: e.target.value })}
                        />
                        <div className="malware-template-details">
                          <div className="malware-template-dept">{template.department}</div>
                          <div className="malware-template-subject">
                            <strong>Subject:</strong>{' '}
                            {template.subject.length > 40 ? template.subject.slice(0, 40) + '…' : template.subject}
                          </div>
                          {template.attachment && (
                            <div className="malware-template-attachment">
                              <strong>Attachment:</strong>{' '}
                              <span className="malware-template-attachment-name">{template.attachment}</span>
                            </div>
                          )}
                          <div className="malware-template-desc">{template.body.split('\n')[0]}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Email preview */}
                <div className="launch-section">
                  <h3>Email Preview</h3>
                  <div className="email-preview">
                    {selectedCampaign.type === 'Ransomware' ? (
                      <div>
                        <div className="email-from">
                          <strong>From:</strong> Admin
                        </div>
                        <div className="ransomware-preview">
                          <p>⚠️ Full-screen ransomware simulation</p>
                          <p>Immediate overlay on selected screens</p>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="email-header">
                          <div className="email-from">
                            <strong>From:</strong> Admin
                          </div>
                          <div className="email-subject">
                            <strong>Subject:</strong> {getTemplateSets()[launchData.templateId]?.subject}
                          </div>
                        </div>
                        <div className="email-divider"></div>
                        <div className="email-body">
                          {getTemplateSets()[launchData.templateId]?.body?.split('\n').map((line, idx) => (
                            <p key={idx}>{line || <br />}</p>
                          ))}
                        </div>
                        {selectedCampaign.type === 'Malware' && (
                          <div className="attachment-preview">
                            <strong>Attachment:</strong>{' '}
                            <span className="attachment-name">{getTemplateSets()[launchData.templateId]?.attachment}</span>
                            <span className="attachment-warning"> ⚠️ Contains simulated malware payload</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Employee selection */}
                <div className="launch-section">
                  <h3>Select Target Employees</h3>
                  <div className="group-selection">
                    <div className="form__row">
                      <div className="form__group">
                        <label>Branch</label>
                        <select value={launchData.selectedBranch} onChange={(e) => setLaunchData({ ...launchData, selectedBranch: e.target.value })}>
                          <option value="">Select Branch</option>
                          <option>Global HQ</option>
                          <option>Americas</option>
                          <option>Europe</option>
                          <option>APAC</option>
                        </select>
                      </div>
                      <div className="form__group">
                        <label>Department</label>
                        <select value={launchData.selectedDepartment} onChange={(e) => setLaunchData({ ...launchData, selectedDepartment: e.target.value })}>
                          <option value="">Select Department</option>
                          <option>Engineering</option>
                          <option>Finance</option>
                          <option>Marketing</option>
                          <option>HR</option>
                          <option>IT</option>
                          <option>Executive</option>
                        </select>
                      </div>
                    </div>
                    <div className="group-buttons">
                      <button type="button" onClick={selectAllInBranch} disabled={!launchData.selectedBranch}>Select All in Branch</button>
                      <button type="button" onClick={selectAllInDepartment} disabled={!launchData.selectedDepartment}>Select All in Department</button>
                      <button type="button" onClick={selectAllInBoth} disabled={!launchData.selectedBranch || !launchData.selectedDepartment}>Select All in Branch & Dept</button>
                    </div>
                  </div>

                  <div className="employees-grid">
                    {filteredEmployees.map(emp => (
                      <label key={emp.id} className="employee-checkbox">
                        <input
                          type="checkbox"
                          checked={launchData.selectedEmployees.includes(emp.id)}
                          onChange={() => toggleEmployeeSelection(emp.id)}
                        />
                        <span className="employee-info">
                          <span className="employee-name">{emp.name}</span>
                          <span className="employee-dept">{emp.department} • {emp.branch}</span>
                        </span>
                      </label>
                    ))}
                  </div>

                  {filteredEmployees.length === 0 && <p className="no-results">All employees selected</p>}

                  {launchData.selectedEmployees.length > 0 && (
                    <div className="selected-employees">
                      <p><strong>Selected ({launchData.selectedEmployees.length}):</strong></p>
                      <div className="selected-list">
                        {getSelectedEmployeeNames().map((name, idx) => (
                          <span key={idx} className="selected-tag">{name}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="launch-footer">
                <button type="button" className="launch-btn launch-btn--secondary" onClick={() => setShowLaunchForm(false)}>Cancel</button>
                <button type="submit" className="launch-btn launch-btn--primary" disabled={launchData.selectedEmployees.length === 0}>
                  {selectedCampaign.type === 'Phishing' && 'Next: Review & Send Emails'}
                  {selectedCampaign.type === 'Ransomware' && 'Next: Review & Launch Ransomware'}
                  {selectedCampaign.type === 'Malware' && 'Next: Review & Send Emails'}
                  {launchData.selectedEmployees.length > 0 && ` (${launchData.selectedEmployees.length})`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Launch confirm modal ── */}
      {showLaunchConfirm && selectedCampaign && (
        <div className="launch-confirm-modal">
          <div className="launch-confirm-overlay" onClick={() => setShowLaunchConfirm(false)} />
          <div className="launch-confirm-panel">
            <div className="launch-confirm-header">
              <h2>Confirm Campaign Launch</h2>
              <button className="launch-confirm-close" onClick={() => setShowLaunchConfirm(false)}>✕</button>
            </div>

            <div className="launch-confirm-content">
              {isLaunching ? (
                <div className="launch-loading">
                  <div className="loading-spinner"></div>
                  <p>
                    {selectedCampaign.type === 'Phishing' ? 'Sending emails to employees...' :
                     selectedCampaign.type === 'Ransomware' ? 'Deploying ransomware simulation...' :
                     'Sending emails to employees...'}
                  </p>
                  <small>This may take a few moments</small>
                </div>
              ) : (
                <>
                  <div className="confirm-warning">
                    <div className="warning-icon">⚠️</div>
                    <p><strong>Warning:</strong> This will launch a simulated attack on selected employees.</p>
                  </div>

                  <div className="confirm-details">
                    <h3>Campaign Summary</h3>
                    <div className="confirm-grid">
                    <div className="confirm-item">
                      <span className="confirm-label">Campaign:</span>
                      <span className="confirm-value">{selectedCampaign.name}</span>
                    </div>
                    <div className="confirm-item">
                      <span className="confirm-label">Type:</span>
                      <span className="confirm-value">{selectedCampaign.type}</span>
                    </div>
                    <div className="confirm-item">
                      <span className="confirm-label">Template:</span>
                      <span className="confirm-value">{getTemplateSets()[launchData.templateId]?.department}</span>
                    </div>
                    <div className="confirm-item">
                      <span className="confirm-label">Recipients:</span>
                      <span className="confirm-value">{launchData.selectedEmployees.length} employees</span>
                    </div>
                    <div className="confirm-item">
                      <span className="confirm-label">Delivery:</span>
                      <span className="confirm-value">
                        {selectedCampaign.type === 'Ransomware' ? 'Popup on Next Login' : 'Email'}
                      </span>
                    </div>
                    {(selectedCampaign.type === 'Malware' || selectedCampaign.type === 'Ransomware') && (
                      <div className="confirm-item">
                        <span className="confirm-label">Attachment:</span>
                        <span className="confirm-value">{getTemplateSets()[launchData.templateId]?.attachment}</span>
                      </div>
                    )}
                    </div>
                  </div>

                  <div className="confirm-email-preview">
                    <h3>{selectedCampaign.type === 'Ransomware' ? 'Attack Preview:' : 'Message:'}</h3>
                    <div className="email-preview-small">
                      <div className="email-body-small">
                        {selectedCampaign.type === 'Ransomware' ? (
                          <div className="attack-description-small">
                            <p>⚠️ Full-screen ransomware simulation</p>
                            <p>Immediate overlay on selected screens</p>
                          </div>
                        ) : (
                          getTemplateSets()[launchData.templateId]?.body?.split('\n').slice(0, 3).map((line, idx) => (
                            <p key={idx}>{line}</p>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="launch-confirm-footer">
              <button
                type="button"
                className="confirm-btn confirm-btn--secondary"
                onClick={() => setShowLaunchConfirm(false)}
                disabled={isLaunching}
              >
                Cancel
              </button>
              <button
                type="button"
                className="confirm-btn confirm-btn--primary"
                onClick={confirmLaunchCampaign}
                disabled={isLaunching}
              >
                {isLaunching
                  ? (selectedCampaign.type === 'Ransomware' ? 'Deploying Popups...' : 'Sending Emails...')
                  : (selectedCampaign.type === 'Ransomware' ? 'Launch Campaign & Deploy Popups' : 'Launch Campaign & Send Emails')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}