import React, { useState, useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {  
  LogOut, 
  User,
  Search,
  Sun,
  Moon
} from 'lucide-react'

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
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  
  const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:3005/api'

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('filmxane_admin_token')
    if (!token) {
      navigate('/admin')
      return
    }
    
    loadUserProfile()
  }, [navigate])

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
                  placeholder="Tiştek bigere..."
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

        {/* Navigation Menu */}
        <nav className={`${darkMode ? 'bg-gray-800/95' : 'bg-white/95'} backdrop-blur-xl shadow-sm border-b ${darkMode ? 'border-gray-700' : 'border-gray-200/50'} px-6`}>
          <div className="flex items-center space-x-8 overflow-x-auto">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/admin/dashboard')}
              className={`py-4 px-3 border-b-2 font-medium text-sm transition-all duration-200 ${
                window.location.pathname === '/admin/dashboard'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Serê Rûpelê
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/admin/dashboard/content')}
              className={`py-4 px-3 border-b-2 font-medium text-sm transition-all duration-200 ${
                window.location.pathname === '/admin/dashboard/content'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Birêvebirina Naverokê
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/admin/dashboard/users')}
              className={`py-4 px-3 border-b-2 font-medium text-sm transition-all duration-200 ${
                window.location.pathname === '/admin/dashboard/users'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Bikarhêner
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/admin/dashboard/settings')}
              className={`py-4 px-3 border-b-2 font-medium text-sm transition-all duration-200 ${
                window.location.pathname === '/admin/dashboard/settings'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Mîhengên
            </motion.button>
          </div>
        </nav>

        {/* Page content - full width */}
        <main className="admin-content flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout
