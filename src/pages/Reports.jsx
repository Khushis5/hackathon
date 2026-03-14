import { useMemo, useState } from 'react'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts'
import './Reports.css'

const trendData = [
  { month: 'Jan', incidents: 12, detected: 9 },
  { month: 'Feb', incidents: 19, detected: 12 },
  { month: 'Mar', incidents: 15, detected: 13 },
  { month: 'Apr', incidents: 25, detected: 18 },
  { month: 'May', incidents: 22, detected: 20 },
  { month: 'Jun', incidents: 18, detected: 17 },
]

const branchData = [
  { branch: 'Americas', incidents: 45, score: 68 },
  { branch: 'EMEA', incidents: 38, score: 72 },
  { branch: 'APAC', incidents: 28, score: 75 },
]

const domainData = [
  { domain: 'Engineering', risks: 12, score: 78 },
  { domain: 'Finance', risks: 8, score: 62 },
  { domain: 'HR', risks: 3, score: 88 },
  { domain: 'Marketing', risks: 15, score: 45 },
]

const mockReports = [
  { id: 1, category: 'Phishing', value: 38 },
  { id: 2, category: 'Malware', value: 12 },
  { id: 3, category: 'Credential theft', value: 20 },
  { id: 4, category: 'Policy violations', value: 30 },
]

const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4']

export default function Reports() {
  const [selected, setSelected] = useState('branch')

  const breakdown = useMemo(() => {
    if (selected === 'branch') {
      return branchData
    }
    return domainData
  }, [selected])

  return (
    <div className="reports">
      <header className="reports__header">
        <h2>Reports & Analysis</h2>
        <p>Review attack patterns and performance metrics by domain, branch, and campaign</p>
      </header>

      <section className="reports__section">
        <h3>Incident Trends (Last 6 Months)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={trendData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="incidents" stroke="#ef4444" strokeWidth={2} name="Total Incidents" />
            <Line type="monotone" dataKey="detected" stroke="#22c55e" strokeWidth={2} name="Detected" />
          </LineChart>
        </ResponsiveContainer>
      </section>

      <section className="reports__section">
        <h3>Performance by {selected === 'branch' ? 'Office Branch' : 'Department'}</h3>
        <div className="reports__controls">
          <label>
            <span>View by:</span>
            <select value={selected} onChange={(e) => setSelected(e.target.value)}>
              <option value="branch">Office Branch</option>
              <option value="domain">Department</option>
            </select>
          </label>
        </div>

        <div className="reports__grid">
          <div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={breakdown} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={selected === 'branch' ? 'branch' : 'domain'} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey={selected === 'branch' ? 'incidents' : 'risks'} fill="#f97316" name={selected === 'branch' ? 'Incidents' : 'Risks'} />
                <Bar dataKey="score" fill="#22c55e" name="Security Score %" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={breakdown}
                  dataKey="score"
                  nameKey={selected === 'branch' ? 'branch' : 'domain'}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {breakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="reports__section">
        <h3>Risk Summary by Category</h3>
        <div className="reports__bars">
          {mockReports.map((row) => (
            <div key={row.id} className="reports__bar">
              <span className="reports__label">{row.category}</span>
              <div className="reports__barContainer">
                <div className="reports__barFill" style={{ width: `${row.value}%` }}>
                  <span className="reports__barValue">{row.value}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
