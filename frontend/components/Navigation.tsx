'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { User, Heart, LogOut, Search, Menu, X, Settings } from 'lucide-react'

import { useAuth } from '@/contexts/AuthContext'
import { useContent } from '@/contexts/ContentContext'
import { apiClient } from '@/lib/api'

// Logo PNG Component
const FilmxaneLogo = ({ className = "w-6 h-6" }: { className?: string }) => (
  <img 
    src="/newlogo.png" 
    alt="Filmxane Logo" 
    className={className}
  />
)

export function Navigation() {
  const { user, isAuthenticated, login, register, logout } = useAuth()
  const { searchContent, clearSearch, searchResults } = useContent()
  const router = useRouter()

  // Local state
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [loginData, setLoginData] = useState({ email: '', password: '' })
  const [signupData, setSignupData] = useState({ 
    firstName: '', 
    lastName: '', 
    email: '', 
    password: '', 
    confirmPassword: '' 
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  // Refs
  const searchRef = useRef<HTMLInputElement>(null)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const mobileMenuRef = useRef<HTMLDivElement>(null)

  // Navigation tabs
  const tabs = [
    { name: 'Serê Rûpelê', href: '/' },
    { name: 'Fîlmên', href: '/movies' },
    { name: 'Rêzefîlmên', href: '/series' },
    { name: 'Lîsta Min', href: '/mylist' },
  ]

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
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

  // Handle search
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      console.log('🔍 Arama başlatılıyor:', searchQuery)
      try {
        await searchContent(searchQuery)
        console.log('✅ Arama tamamlandı, sonuçlar:', searchResults)
      } catch (error) {
        console.error('❌ Arama hatası:', error)
      }
    }
  }

  // Handle login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const result = await login(loginData.email, loginData.password)
      if (result.success) {
        setIsLoginModalOpen(false)
        setLoginData({ email: '', password: '' })
        router.push('/')
      } else {
        setError('Giriş başarısız. Lütfen bilgilerinizi kontrol edin.')
      }
    } catch (err) {
      setError('Bir hata oluştu. Lütfen tekrar deneyin.')
    } finally {
      setIsLoading(false)
    }
  }

  // Handle signup
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    if (signupData.password !== signupData.confirmPassword) {
      setError('Şifreler eşleşmiyor')
      setIsLoading(false)
      return
    }

    try {
      const result = await register(
        signupData.firstName,
        signupData.lastName,
        signupData.email,
        signupData.password
      )
      if (result.success) {
        setIsSignupModalOpen(false)
        setSignupData({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' })
        router.push('/')
      } else {
        setError('Kayıt başarısız. Lütfen bilgilerinizi kontrol edin.')
      }
    } catch (err) {
      setError('Bir hata oluştu. Lütfen tekrar deneyin.')
    } finally {
      setIsLoading(false)
    }
  }

  // Handle logout
  const handleLogout = async () => {
    await logout()
    setIsUserMenuOpen(false)
    router.push('/')
  }

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-black/95 via-slate-900/95 to-black/95 backdrop-blur-md border-b border-slate-800/50">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-black/25 transition-all duration-300">
                <FilmxaneLogo className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-red-100 bg-clip-text text-transparent">
                  Filmxane
                </h1>
                <p className="text-xs text-slate-400 font-medium">KURDISH CINEMA</p>
              </div>
            </Link>

            {/* Navigation Tabs */}
            <div className="hidden md:flex items-center space-x-1">
              {tabs.map((tab) => (
                <Link
                  key={tab.name}
                  href={tab.href}
                  className="px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 text-slate-300 hover:text-white hover:bg-slate-800/50"
                >
                  {tab.name}
                </Link>
              ))}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <div className="relative">
                <button
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="p-2.5 text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all duration-200"
                  title="Search"
                >
                  <Search className="w-4 h-4" />
                </button>
                
                {isSearchOpen && (
                  <div className="absolute top-full right-0 mt-2 w-96 bg-slate-900/95 backdrop-blur-md rounded-lg shadow-xl border border-slate-700/50 p-4 max-h-96 overflow-y-auto">
                    <form onSubmit={handleSearch} className="space-y-3">
                      <input
                        ref={searchRef}
                        type="text"
                        placeholder="Fîlm, rêzefîlm an jî lîstikvan..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-transparent"
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <button
                          type="submit"
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200"
                        >
                          Lêbigere
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsSearchOpen(false)
                            setSearchQuery('')
                            clearSearch()
                          }}
                          className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors duration-200"
                        >
                          Bêçe
                        </button>
                      </div>
                    </form>

                    {/* Arama Sonuçları */}
                    {searchResults && searchResults.items && searchResults.items.length > 0 && (
                      <div className="mt-4 space-y-2">
                        <h3 className="text-white font-medium text-sm">Encamên Lêgerînê:</h3>
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                          {searchResults.items.map((item: any) => (
                            <Link
                              key={item.id}
                              href={`/videos/${item.id}`}
                              onClick={() => {
                                setIsSearchOpen(false)
                                setSearchQuery('')
                              }}
                              className="flex items-center gap-3 p-2 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg transition-colors duration-200"
                            >
                              <div className="w-12 h-8 bg-slate-700 rounded flex items-center justify-center">
                                {item.thumbnail ? (
                                  <img 
                                    src={item.thumbnail} 
                                    alt={item.title}
                                    className="w-full h-full object-cover rounded"
                                  />
                                ) : (
                                  <span className="text-xs text-slate-400">
                                    {item.type === 'movie' ? 'F' : 'R'}
                                  </span>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-white text-sm font-medium truncate">{item.title}</p>
                                <p className="text-slate-400 text-xs">
                                  {item.type === 'movie' ? 'Fîlm' : 'Rêzefîlm'} • {item.year || 'Nenas'}
                                </p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Arama Sonucu Yok */}
                    {searchResults && searchResults.items && searchResults.items.length === 0 && searchQuery.trim() && (
                      <div className="mt-4 text-center py-4">
                        <p className="text-slate-400 text-sm">Encamên lêgerînê nehat dîtin.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* User Menu */}
              <div className="relative" ref={userMenuRef}>
                {isAuthenticated ? (
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="p-2.5 text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all duration-200"
                    title="User Menu"
                  >
                    👤
                  </button>
                ) : (
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="p-2.5 text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all duration-200"
                    title="Giriş Yap / Kayıt Ol"
                  >
                    👤
                  </button>
                )}
                
                {isUserMenuOpen && (
                  <div className="absolute top-full right-0 mt-2 w-64 bg-slate-900/95 backdrop-blur-md rounded-lg shadow-xl border border-slate-700/50 p-4">
                    {isAuthenticated ? (
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 pb-3 border-b border-slate-700/50">
                          <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-sm">
                              {(user?.firstName || user?.name)?.charAt(0).toUpperCase() || 'U'}
                            </span>
                          </div>
                          <div>
                            <p className="text-white font-medium">
                              {user?.firstName && user?.lastName 
                                ? `${user.firstName} ${user.lastName}` 
                                : user?.name || 'User'
                              }
                            </p>
                            <p className="text-slate-400 text-sm">Giriş yapıldı</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Link href="/profile" className="flex items-center gap-3 p-2 text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors duration-200">
                            <User className="w-4 h-4" />
                            <span>Profilim</span>
                          </Link>
                          <Link href="/mylist" className="flex items-center gap-3 p-2 text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors duration-200">
                            <Heart className="w-4 h-4" />
                            <span>Listem</span>
                          </Link>
                          {user?.role === 'admin' && (
                            <Link href="/admin" className="flex items-center gap-3 p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors duration-200">
                              <Settings className="w-4 h-4" />
                              <span>Admin Panel</span>
                            </Link>
                          )}
                          <hr className="border-slate-600 my-2" />
                          <button 
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors duration-200"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Çıkış Yap</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <button 
                          onClick={() => { setIsLoginModalOpen(true); setIsUserMenuOpen(false); }}
                          className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
                        >
                          🔑
                          <span>Giriş Yap</span>
                        </button>
                        <button 
                          onClick={() => { setIsSignupModalOpen(true); setIsUserMenuOpen(false); }}
                          className="w-full bg-slate-700 hover:bg-slate-600 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
                        >
                          ➕
                          <span>Hesap Oluştur</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all duration-200"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div
            ref={mobileMenuRef}
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
          </div>
        )}
      </nav>

      {/* Login Modal */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-2xl p-8 max-w-md w-full border border-slate-700/50">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Giriş Yap</h2>
              <button
                onClick={() => setIsLoginModalOpen(false)}
                className="text-slate-400 hover:text-white transition-colors duration-200"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  E-posta
                </label>
                <input
                  type="email"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-transparent"
                  placeholder="E-posta adresinizi girin"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Şifre
                </label>
                <input
                  type="password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-transparent"
                  placeholder="Şifrenizi girin"
                  required
                />
              </div>
              
              {error && (
                <div className="text-red-400 text-sm">{error}</div>
              )}
              
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-600/50 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200"
              >
                {isLoading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Signup Modal */}
      {isSignupModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-2xl p-8 max-w-md w-full border border-slate-700/50">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Hesap Oluştur</h2>
              <button
                onClick={() => setIsSignupModalOpen(false)}
                className="text-slate-400 hover:text-white transition-colors duration-200"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Ad
                </label>
                <input
                  type="text"
                  value={signupData.firstName}
                  onChange={(e) => setSignupData({ ...signupData, firstName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-transparent"
                  placeholder="Adınızı girin"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Soyad
                </label>
                <input
                  type="text"
                  value={signupData.lastName}
                  onChange={(e) => setSignupData({ ...signupData, lastName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-transparent"
                  placeholder="Soyadınızı girin"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  E-posta
                </label>
                <input
                  type="email"
                  value={signupData.email}
                  onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-transparent"
                  placeholder="E-posta adresinizi girin"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Şifre
                </label>
                <input
                  type="password"
                  value={signupData.password}
                  onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-transparent"
                  placeholder="Şifrenizi girin"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Şifre Tekrar
                </label>
                <input
                  type="password"
                  value={signupData.confirmPassword}
                  onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-transparent"
                  placeholder="Şifrenizi tekrar girin"
                  required
                />
              </div>
              
              {error && (
                <div className="text-red-400 text-sm">{error}</div>
              )}
              
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-600/50 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200"
              >
                {isLoading ? 'Hesap oluşturuluyor...' : 'Hesap Oluştur'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}