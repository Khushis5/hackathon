import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Login from './pages/Login'
import AdminLogin from './pages/AdminLogin'
import Dashboard from './pages/Dashboard'
import Users from './pages/Users'
import Campaigns from './pages/Campaigns'
import Reports from './pages/Reports'
import RiskScore from './pages/RiskScore'
import Settings from './pages/Settings'
import UserOverview from './pages/UserOverview'
import UserActivity from './pages/UserActivity'
import UserTraining from './pages/UserTraining'
import UserRisk from './pages/UserRisk'
import UserAchievements from './pages/UserAchievements'
import RansomwareSimulation from './pages/RansomwareSimulation'
import MalwareSimulation from './pages/MalwareSimulation'
import PhishingSimulation from './pages/PhishingSimulation'
import Layout from './components/Layout'
import './App.css'

function AppRoutes() {
  const { isAuthenticated, isAdmin, activeSimulation } = useAuth()
  
  // Show simulation if active
  if (activeSimulation) {
    if (activeSimulation.type === 'ransomware') {
      return <RansomwareSimulation />
    } else if (activeSimulation.type === 'malware') {
      return <MalwareSimulation />
    } else if (activeSimulation.type === 'phishing') {
      return <PhishingSimulation />
    }
  }
  
  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/ransomware-simulation" element={<RansomwareSimulation />} />
        <Route path="/malware-simulation" element={<MalwareSimulation />} />
        <Route path="/phishing-simulation" element={<PhishingSimulation />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    )
  }

  // Admin routes
  if (isAdmin) {
    return (
      <Layout>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/campaigns" element={<Campaigns />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/risk" element={<RiskScore />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Layout>
    )
  }

  // User routes (limited)
  return (
    <Layout>
      <Routes>
        <Route path="/dashboard" element={<UserOverview />} />
        <Route path="/activity" element={<UserActivity />} />
        <Route path="/training" element={<UserTraining />} />
        <Route path="/risk" element={<UserRisk />} />
        <Route path="/achievements" element={<UserAchievements />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Layout>
  )
}

export default function App() {
  return (
    <Router future={{ v7_relativeSplatPath: true }}>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  )
}