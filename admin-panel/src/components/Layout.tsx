import React, { useState, useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  LogOut, 
  Settings, 
  User,
  Bell,
  Search,
  Sun,
  Moon
} from 'lucide-react'

interface Notification {
  id: string
  message: string
  time: string
  unread: boolean
  type: 'success' | 'info' | 'warning' | 'error'
}

interface UserProfile {
  id: string
  firstName: string
  lastName: string
  email: string
  role: string
  avatar?: string
}

const Layout: React.FC = () => {
  const navigate = useNavigate()
  const [darkMode, setDarkMode] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  
  const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:3005/api'

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('filmxane_admin_token')
    if (!token) {
      navigate('/admin')
      return
    }
    
    loadNotifications()
    loadUserProfile()
  }, [navigate])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (!target.closest('.notifications-dropdown') && !target.closest('.notifications-button')) {
        setShowNotifications(false)
      }
      if (!target.closest('.settings-dropdown') && !target.closest('.settings-button')) {
        setShowSettings(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const loadNotifications = async () => {
    try {
      const token = localStorage.getItem('filmxane_admin_token')
      if (!token) return
      
      const response = await fetch(`${API_BASE_URL}/admin/notifications`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setNotifications(data)
      }
    } catch (error) {
      console.error('Dengvedan nehatin barkirin:', error)
    }
  }

  const loadUserProfile = async () => {
    try {
      // Get admin token from localStorage
      const token = localStorage.getItem('filmxane_admin_token')
      if (!token) {
        navigate('/admin')
        return
      }
      
      const response = await fetch(`${API_BASE_URL}/admin/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setUserProfile(data)
      } else if (response.status === 401) {
        // Token expired or invalid
        localStorage.removeItem('filmxane_admin_token')
        navigate('/admin')
      }
    } catch (error) {
      console.error('Profîla bikarhêner nehat barkirin:', error)
      // Redirect to login if there's an error
      navigate('/admin')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('filmxane_admin_token')
    navigate('/admin')
  }

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle('dark')
  }

  const markNotificationAsRead = async (notificationId: string) => {
    try {
      const token = localStorage.getItem('filmxane_admin_token')
      if (!token) return
      
      const response = await fetch(`${API_BASE_URL}/admin/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (response.ok) {
        setNotifications(prev => 
          prev.map(n => 
            n.id === notificationId ? { ...n, unread: false } : n
          )
        )
      }
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
    }
  }

  const unreadCount = notifications.filter(n => n.unread).length

  return (
    <div className={`admin-layout flex h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100'}`}>
      {/* Main content - full width */}
      <div className="admin-main flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className={`${darkMode ? 'bg-gray-800/95' : 'bg-white/95'} backdrop-blur-xl shadow-sm border-b ${darkMode ? 'border-gray-700' : 'border-gray-200/50'} px-6 py-4`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Logo */}
              <motion.div 
                className="flex items-center space-x-3"
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                <div className="w-10 h-10 bg-gradient-to-br from-red-500 via-pink-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">F</span>
                </div>
                <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Filmxane Admin</h1>
              </motion.div>
              
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search anything..."
                  className={`pl-10 pr-4 py-2.5 w-80 border ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white'} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400`}
                />
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* Dark mode toggle */}
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleDarkMode}
                className={`p-2.5 rounded-xl transition-all duration-200 ${
                  darkMode 
                    ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </motion.button>

              {/* Notifications */}
              <div className="relative">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowNotifications(!showNotifications)}
                  className={`notifications-button p-2.5 rounded-xl transition-all duration-200 relative ${
                    darkMode 
                      ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700' 
                      : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <motion.span 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center font-medium shadow-lg"
                    >
                      {unreadCount}
                    </motion.span>
                  )}
                </motion.button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`notifications-dropdown absolute right-0 top-12 w-80 max-h-96 overflow-y-auto rounded-xl shadow-xl border ${
                      darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                    } z-50`}
                  >
                    <div className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                      <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Notifications ({notifications.length})
                      </h3>
                    </div>
                    <div className="p-2">
                      {notifications.length > 0 ? (
                        notifications.map((notification) => (
                          <motion.div
                            key={notification.id}
                            whileHover={{ backgroundColor: darkMode ? '#374151' : '#f3f4f6' }}
                            className={`p-3 rounded-lg cursor-pointer transition-colors ${
                              notification.unread ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                            }`}
                            onClick={() => markNotificationAsRead(notification.id)}
                          >
                            <div className="flex items-start space-x-3">
                              <div className={`w-2 h-2 rounded-full mt-2 ${
                                notification.type === 'success' ? 'bg-green-500' :
                                notification.type === 'info' ? 'bg-green-500' :
                                notification.type === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                              }`} />
                              <div className="flex-1 min-w-0">
                                <p className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'} ${
                                  notification.unread ? 'font-medium' : ''
                                }`}>
                                  {notification.message}
                                </p>
                                <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                  {notification.time}
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        ))
                      ) : (
                        <div className={`p-4 text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          Dengvedan tune
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Settings */}
              <div className="relative">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowSettings(!showSettings)}
                  className={`settings-button p-2.5 rounded-xl transition-all duration-200 ${
                    darkMode 
                      ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700' 
                      : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Settings className="w-5 h-5" />
                </motion.button>

                {/* Settings Dropdown */}
                {showSettings && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`settings-dropdown absolute right-0 top-12 w-64 rounded-xl shadow-xl border ${
                      darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                    } z-50`}
                  >
                    <div className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                      <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Mîhengên Zû
                      </h3>
                    </div>
                    <div className="p-2">
                      <motion.button
                        whileHover={{ backgroundColor: darkMode ? '#374151' : '#f3f4f6' }}
                        onClick={() => {
                          setShowSettings(false)
                          navigate('/admin/dashboard/settings')
                        }}
                        className={`w-full p-3 rounded-lg text-left transition-colors ${
                          darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <Settings className="w-4 h-4" />
                          <span>Mîhengên Sîstemê</span>
                        </div>
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ backgroundColor: darkMode ? '#374151' : '#f3f4f6' }}
                        onClick={toggleDarkMode}
                        className={`w-full p-3 rounded-lg text-left transition-colors ${
                          darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                          <span>Moda {darkMode ? 'Ronahî' : 'Tarî'} Guherîne</span>
                        </div>
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* User profile */}
              <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-gray-300 dark:border-gray-600">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="hidden md:block">
                  <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {userProfile ? `${userProfile.firstName} ${userProfile.lastName}` : 'Admin User'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {userProfile ? userProfile.email : 'admin@filmxane.com'}
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200"
                >
                  <LogOut className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </div>
        </header>

        {/* Page content - full width */}
        <main className="admin-content flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout
