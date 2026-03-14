import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('authUser'))
    } catch {
      return null
    }
  })

  const [activeSimulation, setActiveSimulation] = useState(null) // Don't load from localStorage on mount

  useEffect(() => {
    if (user) {
      localStorage.setItem('authUser', JSON.stringify(user))
    } else {
      localStorage.removeItem('authUser')
    }
  }, [user])

  useEffect(() => {
    if (activeSimulation) {
      localStorage.setItem('activeSimulation', JSON.stringify(activeSimulation))
    } else {
      localStorage.removeItem('activeSimulation')
    }
  }, [activeSimulation])

  const value = useMemo(
    () => ({
      user,
      login: (userData) => {
        setUser(userData)
        setActiveSimulation(null) // Clear any active simulation on login
        
        // Check for pending ransomware attack as soon as user logs in
        const userKey = String(userData.id)
        const pendingRansomware = JSON.parse(localStorage.getItem('pendingRansomware') || '{}')
        
        if (pendingRansomware[userKey]) {
          const ransomwareData = pendingRansomware[userKey]
          console.log('[AuthContext] Found pending ransomware for user', userKey, ransomwareData)
          
          // Trigger ransomware immediately
          setActiveSimulation({
            type: 'ransomware',
            userId: userData.id,
            campaignId: ransomwareData.campaignId,
            templateId: ransomwareData.templateId
          })
          
          // Mark as no longer pending
          delete pendingRansomware[userKey]
          localStorage.setItem('pendingRansomware', JSON.stringify(pendingRansomware))
        }
      },
      logout: () => {
        setUser(null)
        setActiveSimulation(null) // Clear simulation on logout
        localStorage.removeItem('accessToken')
      },
      isAuthenticated: Boolean(user),
      isAdmin: user?.role === 'admin' || user?.role === 'SUPER_ADMIN',
      activeSimulation,
      setActiveSimulation,
      clearSimulation: () => setActiveSimulation(null),
    }),
    [user, activeSimulation],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
