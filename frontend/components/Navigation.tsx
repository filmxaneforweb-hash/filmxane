'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Bell, User, Menu, X, LogIn, UserPlus, LogOut, Settings, Heart, User as UserIcon, Film } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useContent } from '@/contexts/ContentContext'
import { apiClient } from '@/lib/api'

export function Navigation() {
  const { user, isAuthenticated, login, register, logout } = useAuth()
  const { searchContent, clearSearch, searchResults } = useContent()
  const router = useRouter()

  // Local state
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [isClient, setIsClient] = useState(false)

  // Form state
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [signupForm, setSignupForm] = useState({ firstName: '', lastName: '', email: '', password: '' })
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({})

  // Refs
  const searchRef = useRef<HTMLDivElement>(null)
  const notificationsRef = useRef<HTMLDivElement>(null)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const mobileMenuRef = useRef<HTMLDivElement>(null)

  // Real notifications from API
  const [notifications, setNotifications] = useState<any[]>([])
  const [notificationsLoading, setNotificationsLoading] = useState(false)

  // Check if we're on client side
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Fetch notifications from API
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!isAuthenticated) return
      
      try {
        setNotificationsLoading(true)
        const response = await apiClient.getNotifications()
        if (response.success && response.data) {
          setNotifications(response.data)
        }
      } catch (error) {
        console.error('Failed to fetch notifications:', error)
      } finally {
        setNotificationsLoading(false)
      }
    }

    fetchNotifications()
  }, [isAuthenticated])

  const unreadCount = notifications.filter(n => !n.isRead).length

  // Navigation tabs
  const tabs = [
    { name: 'Fîlm', href: '/movies' },
    { name: 'Rêzefîlm', href: '/series' },
    { name: 'Nû', href: '/videos' },
    { name: 'Lîsta Min', href: '/mylist' }
  ]

  // Check if user is authenticated
  const isUserAuthenticated = () => {
    if (!isClient) return false
    return localStorage.getItem('filmxane_token') !== null
  }

  // Handle search
  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      clearSearch()
      return
    }

    setIsSearching(true)
    try {
      await searchContent(query)
    } catch (error) {
      console.error('Search failed:', error)
    } finally {
      setIsSearching(false)
    }
  }

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    
    // Debounce search
    const timeoutId = setTimeout(() => {
      handleSearch(query)
    }, 300)

    return () => clearTimeout(timeoutId)
  }

  // Handle login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormErrors({})

    if (!loginForm.email || !loginForm.password) {
      setFormErrors({ general: 'Ji kerema xwe hemû qadên pêwîst dagire' })
      return
    }

    try {
      const result = await login(loginForm.email, loginForm.password)
      if (result.success) {
        setIsLoginModalOpen(false)
        setLoginForm({ email: '', password: '' })
        router.push('/')
      } else {
        setFormErrors({ general: result.error || 'Têketin bi ser neket' })
      }
    } catch (error) {
      setFormErrors({ general: 'Çewtiyeke neçêkirî çêbû' })
    }
  }

  // Handle signup
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormErrors({})

    if (!signupForm.firstName || !signupForm.lastName || !signupForm.email || !signupForm.password) {
      setFormErrors({ general: 'Ji kerema xwe hemû qadên pêwîst dagire' })
      return
    }

    if (signupForm.password.length < 6) {
      setFormErrors({ password: 'Şîfre divê bi qasî 6 tîpan be' })
      return
    }

    try {
      const result = await register(signupForm.firstName, signupForm.lastName, signupForm.email, signupForm.password)
      if (result.success) {
        setIsSignupModalOpen(false)
        setSignupForm({ firstName: '', lastName: '', email: '', password: '' })
        router.push('/')
      } else {
        setFormErrors({ general: result.error || 'Hesab vekirin bi ser neket' })
      }
    } catch (error) {
      setFormErrors({ general: 'Çewtiyeke neçêkirî çêbû' })
    }
  }

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout()
      setIsUserMenuOpen(false)
      router.push('/')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false)
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false)
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false)
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Close modals when pressing Escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsLoginModalOpen(false)
        setIsSignupModalOpen(false)
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [])

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-black/95 via-slate-900/95 to-black/95 backdrop-blur-md border-b border-slate-800/50">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <motion.div 
              className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-red-500/25 transition-all duration-300"
              whileHover={{ scale: 1.05, rotate: 5 }}
            >
              <Film className="w-6 h-6 text-white" />
            </motion.div>
            <div className="flex flex-col">
              <motion.h1 
                className="text-2xl font-bold bg-gradient-to-r from-white to-red-100 bg-clip-text text-transparent"
                whileHover={{ scale: 1.02 }}
              >
                Filmxane
              </motion.h1>
              <p className="text-xs text-slate-400 font-medium">KURDISH CINEMA</p>
            </div>
          </Link>

          {/* Navigation Tabs */}
          <div className="hidden md:flex items-center gap-12">
            {tabs.map((tab) => (
              <Link 
                key={tab.name} 
                href={tab.href}
                className="relative px-3 py-2 text-sm font-medium transition-all duration-200 text-slate-300 hover:text-white"
              >
                {tab.name}
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <div ref={searchRef} className="relative">
              <motion.button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2.5 text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="Search"
              >
                <Search className="w-4 h-4" />
              </motion.button>
              
              <AnimatePresence>
                {isSearchOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="absolute top-full right-0 mt-2 w-80 bg-slate-800 border border-slate-600 rounded-lg shadow-2xl"
                  >
                    <div className="p-4">
                      <input
                        type="text"
                        placeholder="Fîlm, rêzefîlm an jî aktor lêbigere..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                        autoFocus
                      />
                      
                      {/* Search Results */}
                      {isSearching && (
                        <div className="mt-3 text-center py-4">
                          <div className="animate-spin w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full mx-auto"></div>
                          <p className="text-slate-400 text-sm mt-2">Lêdigere...</p>
                        </div>
                      )}

                      {searchResults && searchResults.items.length > 0 && (
                        <div className="mt-3">
                          <p className="text-sm text-slate-400 mb-2">
                            {searchResults.total} encam hat dîtin
                          </p>
                          <div className="space-y-2 max-h-60 overflow-y-auto">
                            {searchResults.items.slice(0, 5).map((item) => (
                              <Link
                                key={item.id}
                                href={`/${'seasons' in item ? 'series' : 'movies'}/${item.id}`}
                                className="flex items-center gap-3 p-2 hover:bg-slate-700 rounded-lg transition-colors duration-200"
                                onClick={() => setIsSearchOpen(false)}
                              >
                                <div className="w-12 h-8 bg-slate-700 rounded flex items-center justify-center">
                                  <Film className="w-4 h-4 text-slate-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-white text-sm font-medium truncate">
                                    {item.title}
                                  </p>
                                  <p className="text-slate-400 text-xs truncate">
                                    {item.year} • {item.genre.join(', ')}
                                  </p>
                                </div>
                              </Link>
                            ))}
                          </div>
                          {searchResults.items.length > 5 && (
                            <button
                              onClick={() => {
                                setIsSearchOpen(false)
                                router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
                              }}
                              className="w-full mt-2 text-center text-red-400 hover:text-red-300 text-sm"
                            >
                              Hemû encaman bibîne
                            </button>
                          )}
                        </div>
                      )}

                      {searchResults && searchResults.items.length === 0 && searchQuery && (
                        <div className="mt-3 text-center py-4">
                          <p className="text-slate-400 text-sm">Tu encam hat dîtin</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Notifications */}
            <div ref={notificationsRef} className="relative">
              <motion.button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="p-2.5 text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all duration-200 relative"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </motion.button>
              
              <AnimatePresence>
                {isNotificationsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="absolute top-full right-0 mt-2 w-80 bg-slate-800 border border-slate-600 rounded-lg shadow-2xl"
                  >
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-white mb-3">Agahdariyên</h3>
                      <div className="space-y-3">
                        {notificationsLoading ? (
                          <div className="text-center py-4">
                            <div className="animate-spin w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full mx-auto"></div>
                            <p className="text-slate-400 text-sm mt-2">Lêdigere...</p>
                          </div>
                        ) : notifications.length === 0 ? (
                          <p className="text-slate-400 text-sm text-center">Tu encam hat dîtin</p>
                        ) : (
                          notifications.map((notification) => (
                            <div
                              key={notification.id}
                              className={`p-3 rounded-lg ${
                                notification.isRead ? 'bg-slate-700/50' : 'bg-red-500/20 border border-red-500/30'
                              }`}
                            >
                              <h4 className="font-medium text-white text-sm">{notification.title}</h4>
                              <p className="text-slate-300 text-xs mt-1">{notification.message}</p>
                              <span className="text-slate-400 text-xs">{notification.time}</span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* User Menu */}
            <div ref={userMenuRef} className="relative">
              {isUserAuthenticated() ? (
                <motion.button 
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-2 text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title="Kullanıcı Profili"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">👤</span>
                  </div>
                  <span className="hidden md:block text-sm font-medium">Profil</span>
                </motion.button>
              ) : (
                <motion.button 
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="p-2.5 text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title="Giriş Yap / Kayıt Ol"
                >
                  <User className="w-4 h-4" />
                </motion.button>
              )}
              
              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="absolute top-full right-0 mt-2 w-64 bg-slate-800 border border-slate-600 rounded-lg shadow-2xl"
                  >
                    {isUserAuthenticated() ? (
                      <div className="p-4">
                        <div className="flex items-center gap-3 mb-4 p-3 bg-slate-700/50 rounded-lg">
                          <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-medium">👤</span>
                          </div>
                          <div>
                            <p className="text-white font-medium">
                              {isClient && localStorage.getItem('filmxane_user_name') || 'Kullanıcı'}
                            </p>
                            <p className="text-slate-400 text-sm">Giriş yapıldı</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Link href="/profile" className="flex items-center gap-3 p-2 text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors duration-200">
                            <UserIcon className="w-4 h-4" />
                            <span>Profilim</span>
                          </Link>
                          <Link href="/mylist" className="flex items-center gap-3 p-2 text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors duration-200">
                            <Heart className="w-4 h-4" />
                            <span>Listem</span>
                          </Link>
                          <hr className="border-slate-600 my-2" />
                          <button 
                            onClick={() => {
                              if (typeof window !== 'undefined') {
                                localStorage.removeItem('filmxane_token')
                                localStorage.removeItem('filmxane_user_name')
                                setIsUserMenuOpen(false)
                                window.location.reload()
                              }
                            }}
                            className="w-full flex items-center gap-3 p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors duration-200"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Çıkış Yap</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4">
                        <div className="space-y-3">
                          <button 
                            onClick={() => { setIsLoginModalOpen(true); setIsUserMenuOpen(false); }}
                            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
                          >
                            <LogIn className="w-4 h-4" />
                            <span>Giriş Yap</span>
                          </button>
                          <button 
                            onClick={() => { setIsSignupModalOpen(true); setIsUserMenuOpen(false); }}
                            className="w-full bg-slate-700 hover:bg-slate-600 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
                          >
                            <UserPlus className="w-4 h-4" />
                            <span>Hesap Oluştur</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            ref={mobileMenuRef}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-slate-800/95 border-t border-slate-700/50"
          >
            <div className="px-4 py-6 space-y-4">
              {tabs.map((tab) => (
                <Link 
                  key={tab.name} 
                  href={tab.href}
                  className="block px-4 py-3 text-lg font-medium rounded-lg transition-all duration-200 text-slate-300 hover:text-white hover:bg-slate-700/50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {tab.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Login Modal */}
      <AnimatePresence>
        {isLoginModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 modal-container"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-slate-800 rounded-2xl p-6 sm:p-8 w-full max-w-md mx-4 border border-slate-600 shadow-2xl modal-content"
            >
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">Têketin</h2>
                <p className="text-slate-400">Ji kerema xwe hesaba xwe bike</p>
              </div>
              
              {formErrors.general && (
                <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                  <p className="text-red-400 text-sm">{formErrors.general}</p>
                </div>
              )}
              
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    placeholder="Emaila te"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">Şîfre</label>
                  <input
                    type="password"
                    placeholder="Şîfreya te"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200"
                >
                  Têketin
                </button>
              </form>
              
              <div className="mt-6 text-center">
                <button
                  onClick={() => { setIsLoginModalOpen(false); setIsSignupModalOpen(true); }}
                  className="text-slate-400 hover:text-white transition-colors duration-200"
                >
                  Hesabeke nû tune? Vekirin
                </button>
              </div>
              
              <button
                onClick={() => setIsLoginModalOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Signup Modal */}
      <AnimatePresence>
        {isSignupModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 modal-container"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-slate-800 rounded-2xl p-6 sm:p-8 w-full max-w-md mx-4 border border-slate-600 shadow-2xl modal-content"
            >
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">Hesap Oluştur</h2>
                <p className="text-slate-400">Lütfen yeni bir hesap oluşturun</p>
              </div>
              
              {formErrors.general && (
                <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                  <p className="text-red-400 text-sm">{formErrors.general}</p>
                </div>
              )}
              
              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">Ad</label>
                  <input
                    type="text"
                    placeholder="Adınız"
                    value={signupForm.firstName}
                    onChange={(e) => setSignupForm({ ...signupForm, firstName: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">Soyad</label>
                  <input
                    type="text"
                    placeholder="Soyadınız"
                    value={signupForm.lastName}
                    onChange={(e) => setSignupForm({ ...signupForm, lastName: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    placeholder="Email adresiniz"
                    value={signupForm.email}
                    onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">Şifre</label>
                  <input
                    type="password"
                    placeholder="Şifreniz"
                    value={signupForm.password}
                    onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                  {formErrors.password && (
                    <p className="text-red-400 text-xs mt-1">{formErrors.password}</p>
                  )}
                </div>
                <button
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200"
                >
                  Hesap Oluştur
                </button>
              </form>
              
              <div className="mt-6 text-center">
                <button
                  onClick={() => { setIsSignupModalOpen(false); setIsLoginModalOpen(true); }}
                  className="text-slate-400 hover:text-white transition-colors duration-200"
                >
                  Zaten hesabınız var mı? Giriş yapın
                </button>
              </div>
              
              <button
                onClick={() => setIsSignupModalOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
