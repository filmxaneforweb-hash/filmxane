import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Film, 
  Eye, 
  EyeOff, 
  Lock, 
  Mail,
  AlertCircle,
  Sparkles
} from 'lucide-react'

const Login: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  
  const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:3005/api'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      console.log('🔐 Admin login attempt:', { email, passwordLength: password?.length })
      
      const response = await fetch(`${API_BASE_URL}/auth/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      
      console.log('📡 Response status:', response.status)
      console.log('📡 Response ok:', response.ok)
      
      const data = await response.json()
      console.log('📡 Response data:', data)
      
      if (!response.ok) {
        throw new Error(data.error || data.message || 'Login failed')
      }
      
      // Check if login was successful
      if (!data.success) {
        throw new Error(data.error || 'Login failed')
      }
      
      // Extract user and token from response
      const userData = data.data || data
      const token = userData.token
      const user = userData.user
      
      console.log('✅ Login successful:', { token: token ? 'EXISTS' : 'MISSING', user: user ? 'EXISTS' : 'MISSING' })
      
      if (!token) {
        throw new Error('Token not received from server')
      }
      
      // Admin token'ını kaydet
      localStorage.setItem('filmxane_admin_token', token)
      
      // User bilgilerini de kaydet (AdminRoute için gerekli)
      if (user) {
        localStorage.setItem('filmxane_user_email', user.email || email)
        localStorage.setItem('filmxane_user_role', user.role || 'admin')
        localStorage.setItem('filmxane_user_firstName', user.firstName || '')
        localStorage.setItem('filmxane_user_lastName', user.lastName || '')
      } else {
        // Fallback values if user data is not provided
        localStorage.setItem('filmxane_user_email', email)
        localStorage.setItem('filmxane_user_role', 'admin')
        localStorage.setItem('filmxane_user_firstName', 'Admin')
        localStorage.setItem('filmxane_user_lastName', 'User')
      }
      
      console.log('💾 LocalStorage updated with admin data')
      
      // Navigate to admin dashboard
      navigate('/admin/dashboard')
    } catch (error) {
      console.error('❌ Login error:', error)
      setError(error instanceof Error ? error.message : 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 p-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-pink-400/20 to-red-400/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-indigo-400/10 to-blue-400/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        {/* Logo and Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <motion.div 
            className="mx-auto w-20 h-20 bg-gradient-to-br from-red-500 via-pink-500 to-red-600 rounded-3xl flex items-center justify-center mb-6 shadow-2xl"
            whileHover={{ 
              scale: 1.05,
              rotate: [0, -5, 5, 0],
            }}
            transition={{ duration: 0.3 }}
          >
            <Film className="w-10 h-10 text-white" />
          </motion.div>
          <motion.h2 
            className="text-4xl font-bold text-gray-900 mb-3 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Filmxane Birêveber
          </motion.h2>
          <motion.p 
            className="text-gray-600 text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Ji bo birêvebirina platforma sînemaya kurdî têkeve
          </motion.p>
        </motion.div>

        {/* Login Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          onSubmit={handleSubmit}
          className="relative group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
          <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-6 p-4 bg-red-50/80 backdrop-blur-sm border border-red-200/50 rounded-2xl flex items-center space-x-3"
              >
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-700">{error}</p>
              </motion.div>
            )}

            <div className="space-y-6">
              {/* Email Field */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Navnîşana Emailê
                </label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Emaila xwe binivîse"
                    className="w-full pl-12 pr-4 py-4 border border-gray-300/50 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 bg-white/50 backdrop-blur-sm placeholder-gray-400 hover:bg-white/70 focus:bg-white"
                  />
                </div>
              </motion.div>

              {/* Password Field */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Şîfre
                </label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Şîfreya xwe binivîse"
                    className="w-full pl-12 pr-12 py-4 border border-gray-300/50 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 bg-white/50 backdrop-blur-sm placeholder-gray-400 hover:bg-white/70 focus:bg-white"
                  />
                  <motion.button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </motion.button>
                </div>
              </motion.div>

              {/* Remember Me & Forgot Password */}
              <motion.div 
                className="flex items-center justify-between"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <label className="flex items-center cursor-pointer group">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 transition-colors"
                  />
                  <span className="ml-2 text-sm text-gray-600 group-hover:text-gray-800 transition-colors">Min bi bîr bîne</span>
                </label>
                <motion.button
                  type="button"
                  className="text-sm text-blue-600 hover:text-blue-700 transition-colors font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Şîfreya xwe ji bîr kir?
                </motion.button>
              </motion.div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 text-white py-4 px-6 rounded-2xl font-medium hover:from-blue-700 hover:via-blue-800 hover:to-purple-700 focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Têkeve...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <Sparkles className="w-5 h-5" />
                    <span>Têkeve</span>
                  </div>
                )}
              </motion.button>
            </div>


          </div>
        </motion.form>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center text-sm text-gray-500"
        >
          <p>© 2024 Filmxane. Hemû mafên parastî ne.</p>
        </motion.div>
      </div>
    </div>
  )
}

export default Login
