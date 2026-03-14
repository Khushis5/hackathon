
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useState, useEffect, useRef } from 'react'
import Sidebar from './Sidebar'
import './Layout.css'


export default function Layout({ children }) {
  const navigate = useNavigate()
  const { user, isAdmin, setActiveSimulation, logout } = useAuth()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [messageInput, setMessageInput] = useState('')
  const [unreadCount, setUnreadCount] = useState(0)
  const messagesEndRef = useRef(null)
  const profileMenuRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false)
      }
    }
    if (isProfileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isProfileMenuOpen])

  // Load admin DMs for this user from localStorage and refresh periodically
  useEffect(() => {
    if (!isChatOpen || !user?.id) return;

    const loadDMs = () => {
      try {
        const adminDMs = JSON.parse(localStorage.getItem('adminDMs') || '{}');
        const userKey = String(user.id); // Ensure consistent string key
        
        const userDMs = adminDMs[userKey] || [];
        console.log(`[Layout] User ${userKey} has ${userDMs.length} messages:`, userDMs);
        console.log('[Layout] All adminDMs:', adminDMs);
        
        // Convert to chat message format with unique IDs
        const chatMsgs = userDMs.map((dm, idx) => ({
          id: `admin-${dm.timestamp}-${idx}`,
          sender: dm.from || 'Admin',
          text: dm.text,
          timestamp: new Date(dm.timestamp),
          campaignId: dm.campaignId,
          type: dm.type,
          templateId: dm.templateId,
          isAttack: true
        }));
        
        // Always update, don't skip updates
        const newMessages = [
          { id: 'welcome-0', sender: 'Admin', text: 'Welcome to secure messaging', timestamp: new Date(Date.now() - 3600000), isAttack: false },
          ...chatMsgs
        ];
        
        setMessages(newMessages);
        console.log('[Layout] Updated messages array:', newMessages);
      } catch (e) {
        console.error('Error loading DMs:', e);
      }
    };

    // Load immediately when chat opens
    console.log('[Layout] Chat opened, loading DMs immediately');
    loadDMs();
    setUnreadCount(0); // Clear unread count when chat opens
    
    // Poll faster when chat is open (every 300ms)
    const interval = setInterval(() => {
      console.log('[Layout] Polling for new messages...');
      loadDMs();
    }, 300);
    
    return () => clearInterval(interval);
  }, [user?.id, isChatOpen]);

  // Count unread attack messages when chat is closed
  useEffect(() => {
    if (isChatOpen || !user?.id) return;

    const countUnread = () => {
      try {
        const adminDMs = JSON.parse(localStorage.getItem('adminDMs') || '{}');
        const userKey = String(user.id);
        const userDMs = adminDMs[userKey] || [];
        // Count all messages (all adminDMs are attack messages)
        const unread = userDMs.length;
        console.log(`[Layout] User ${userKey} unread count: ${unread}, messages:`, userDMs);
        console.log(`[Layout] Full adminDMs:`, adminDMs);
        setUnreadCount(unread);
      } catch (e) {
        console.error('Error counting unread:', e);
      }
    };

    // Count immediately
    countUnread();
    // Then poll every 500ms for faster updates
    const interval = setInterval(countUnread, 500);
    return () => clearInterval(interval);
  }, [user?.id, isChatOpen]);

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      setMessages([...messages, {
        id: messages.length + 1,
        sender: 'You',
        text: messageInput,
        timestamp: new Date()
      }])
      setMessageInput('')
    }
  }

  const handleOpenSimulation = (msg) => {
    if (msg.isAttack && msg.type) {
      setActiveSimulation({
        type: msg.type,
        userId: user?.id,
        campaignId: msg.campaignId,
        templateId: msg.templateId
      });
    }
  }

  const handleChangeProfilePic = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = (e) => {
      const file = e.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (event) => {
          localStorage.setItem(`profilePic_${user?.id || 'guest'}`, event.target.result)
          setIsProfileMenuOpen(false)
        }
        reader.readAsDataURL(file)
      }
    }
    input.click()
  }

  const handleSignOut = () => {
    logout()
    navigate('/admin-login')
    setIsProfileMenuOpen(false)
  }

  return (
    <div className="layout">
      {isSidebarOpen && <div className="layout__overlay" onClick={() => setIsSidebarOpen(false)}></div>}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="layout__main">
        <header className="layout__header">
          <div className="layout__title">
            <button 
              className="layout__hamburger"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              aria-label="Toggle navigation menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
            <h2>Welcome back, {user?.name || (isAdmin ? 'Admin' : 'User')}</h2>
            <p>{isAdmin ? 'Real-time mission command center' : 'Personal Security Dashboard'}</p>
          </div>
          <div className="layout__header-actions">
            <div style={{ position: 'relative' }}>
              <button 
                className="layout__action-btn layout__action-dm" 
                title="Direct Messages"
                onClick={() => setIsChatOpen(!isChatOpen)}
              >
                💬
              </button>
              {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
            </div>
            <div 
              style={{ position: 'relative' }} 
              ref={profileMenuRef}
              onMouseEnter={() => setIsProfileMenuOpen(true)}
              onMouseLeave={() => setIsProfileMenuOpen(false)}
            >
              <button 
                className="layout__action-btn layout__action-profile" 
                title="Profile"
              >
                👤
              </button>
              {isProfileMenuOpen && (
                <div className="profile-menu">
                  <button className="profile-menu__item" onClick={handleChangeProfilePic}>
                    📷 Change Profile Pic
                  </button>
                  <button className="profile-menu__item profile-menu__item--danger" onClick={handleSignOut}>
                    🚪 Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>
        <main className="layout__content">
          {children}
        </main>
      </div>

      {isChatOpen && (
        <div className="chat-box">
          <div className="chat-box__header">
            <h3>Direct Messages</h3>
            <button 
              className="chat-box__close"
              onClick={() => setIsChatOpen(false)}
            >
              ✕
            </button>
          </div>
          
          <div className="chat-box__messages">
            {messages.length <= 1 ? (
              <div style={{ padding: '1rem', textAlign: 'center', color: '#666' }}>
                No messages yet. Check back when campaigns are launched.
              </div>
            ) : (
              messages.map(msg => (
                <div 
                  key={msg.id} 
                  className={`chat-message chat-message--${msg.sender.toLowerCase()} ${msg.isAttack ? 'chat-message--attack' : ''}`}
                  onClick={() => msg.isAttack && handleOpenSimulation(msg)}
                  role={msg.isAttack ? "button" : undefined}
                  style={{ cursor: msg.isAttack ? 'pointer' : 'default' }}
                >
                  <div className="chat-message__header">
                    <span className="chat-message__sender">{msg.sender}</span>
                    <span className="chat-message__time">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="chat-message__text">{msg.text}</div>
                  {msg.isAttack && (
                    <div className="chat-message__action">
                      Click to open message →
                    </div>
                  )}
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-box__input-area">
            <input 
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type a message..."
              className="chat-box__input"
            />
            <button 
              className="chat-box__send"
              onClick={handleSendMessage}
            >
              →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}