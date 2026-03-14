import { useMemo, useState, useEffect } from 'react'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts'
import { apiFetch } from '../services/api'
import html2pdf from 'html2pdf.js'
import './Reports.css'

const trendData = [
  { month: 'Jan', incidents: 12, detected: 9 },
  { month: 'Feb', incidents: 19, detected: 12 },
  { month: 'Mar', incidents: 15, detected: 13 },
  { month: 'Apr', incidents: 25, detected: 18 },
  { month: 'May', incidents: 22, detected: 20 },
  { month: 'Jun', incidents: 18, detected: 17 },
]

const mockReports = [
  { id: 1, category: 'Phishing', value: 38 },
  { id: 2, category: 'Malware', value: 12 },
  { id: 3, category: 'Credential theft', value: 20 },
  { id: 4, category: 'Policy violations', value: 30 },
]

const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#8b5cf6', '#ec4899', '#14b8a6']

export default function Reports() {
  const [selected, setSelected] = useState('domain')
  const [users, setUsers] = useState([])
  
  useEffect(() => {
    // Fetch real user data to compute dynamic department and branch risk scores
    apiFetch('/users')
      .then(data => {
        if (data && data.users) setUsers(data.users)
      })
      .catch(err => console.error("Failed to fetch users for reporting", err))
  }, [])

  const { branchData, domainData } = useMemo(() => {
    if (users.length === 0) {
      // Fallback if no users exist
      return {
        branchData: [
          { branch: 'Americas', incidents: 0, score: 100 },
          { branch: 'EMEA', incidents: 0, score: 100 },
          { branch: 'APAC', incidents: 0, score: 100 },
        ],
        domainData: [
          { domain: 'Engineering', risks: 0, score: 100 },
          { domain: 'Finance', risks: 0, score: 100 },
          { domain: 'HR', risks: 0, score: 100 },
          { domain: 'Marketing', risks: 0, score: 100 },
        ]
      }
    }
    
    const branches = {}
    const domains = {}
    
    users.forEach(u => {
      // Calculate active risks based roughly on their riskScore, higher score -> more risks
      const riskCount = Math.floor((u.riskScore || 0) / 10)
      
      const loc = u.location || 'HQ'
      if (!branches[loc]) branches[loc] = { branch: loc, incidents: 0, scoreTotal: 0, count: 0 }
      branches[loc].incidents += riskCount
      branches[loc].scoreTotal += (100 - (u.riskScore || 0)) // 100 - risk is their security score
      branches[loc].count += 1
      
      const dept = u.department || 'General'
      if (!domains[dept]) domains[dept] = { domain: dept, risks: 0, scoreTotal: 0, count: 0 }
      domains[dept].risks += riskCount
      domains[dept].scoreTotal += (100 - (u.riskScore || 0))
      domains[dept].count += 1
    })

    return {
      branchData: Object.values(branches).map(b => ({
        branch: b.branch,
        incidents: b.incidents,
        score: Math.round(b.scoreTotal / b.count)
      })).sort((a,b) => b.incidents - a.incidents),
      
      domainData: Object.values(domains).map(d => ({
        domain: d.domain,
        risks: d.risks,
        score: Math.round(d.scoreTotal / d.count)
      })).sort((a,b) => b.risks - a.risks)
    }
  }, [users])

  const breakdown = selected === 'branch' ? branchData : domainData

  const handleDownloadPDF = () => {
    const element = document.getElementById('report-content')
    const opt = {
      margin: 10,
      filename: 'Security_Risk_Report.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, backgroundColor: '#0f172a' },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
    }
    html2pdf().set(opt).from(element).save()
  }

  return (
    <div className="reports">
      <header className="reports__header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2>Reports & Analysis</h2>
          <p>Review attack patterns and performance metrics by department, branch, and campaign</p>
        </div>
        <button 
          onClick={handleDownloadPDF}
          style={{
            background: 'linear-gradient(135deg, #00d4ff, #0099cc)',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 15px rgba(0, 212, 255, 0.3)'
          }}
        >
          📄 Download PDF
        </button>
      </header>

      <div id="report-content" style={{ padding: '20px', backgroundColor: '#0f172a' }}>
        <section className="reports__section">
          <h3 style={{ color: 'white' }}>Incident Trends (Last 6 Months)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="month" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', color: 'white' }} />
              <Legend wrapperStyle={{ color: 'white' }} />
              <Line type="monotone" dataKey="incidents" stroke="#ef4444" strokeWidth={2} name="Total Incidents" />
              <Line type="monotone" dataKey="detected" stroke="#22c55e" strokeWidth={2} name="Detected" />
            </LineChart>
          </ResponsiveContainer>
        </section>

        <section className="reports__section">
          <h3 style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '15px' }}>
            Risk Score Analysis Breakdown
            <select 
              value={selected} 
              onChange={(e) => setSelected(e.target.value)}
              style={{ padding: '5px 10px', borderRadius: '4px', background: '#1e293b', color: 'white', border: '1px solid #334155' }}
            >
              <option value="domain">By Department</option>
              <option value="branch">By Office Branch</option>
            </select>
          </h3>

          <div className="reports__grid">
            <div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={breakdown} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey={selected === 'branch' ? 'branch' : 'domain'} stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', color: 'white' }} />
                  <Legend wrapperStyle={{ color: 'white' }} />
                  <Bar dataKey={selected === 'branch' ? 'incidents' : 'risks'} fill="#ef4444" name={selected === 'branch' ? 'Active Risks/Incidents' : 'Active Risks'} />
                  <Bar dataKey="score" fill="#22c55e" name="Security Score %" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={breakdown}
                    dataKey={selected === 'branch' ? 'incidents' : 'risks'}
                    nameKey={selected === 'branch' ? 'branch' : 'domain'}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {breakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', color: 'white' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        <section className="reports__section">
          <h3 style={{ color: 'white' }}>Risk Summary by Category</h3>
          <div className="reports__bars">
            {mockReports.map((row) => (
              <div key={row.id} className="reports__bar">
                <span className="reports__label" style={{ color: '#cbd5e1' }}>{row.category}</span>
                <div className="reports__barContainer" style={{ background: '#334155' }}>
                  <div className="reports__barFill" style={{ width: `${row.value}%`, background: 'linear-gradient(90deg, #ef4444, #f97316)' }}>
                    <span className="reports__barValue" style={{ color: 'white' }}>{row.value}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
