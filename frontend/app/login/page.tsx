'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !password) {
      setError('Hemû qadên pêdivî ne')
      return
    }

    if (password.length < 6) {
      setError('Şîfre divê bi kêmî 6 tîpan be')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await login(email, password)
      
      if (response.success) {
        // AuthContext zaten state'i güncelledi, sadece yönlendirme yap
        console.log('✅ Login successful, redirecting...')
        
        // Kullanıcı rolüne göre yönlendir
        const userRole = localStorage.getItem('filmxane_user_role')
        if (userRole === 'admin') {
          router.push('/admin')
        } else {
          router.push('/')
        }
      } else {
        setError(response.error || 'Giriş başarısız - ji kerema xwe dîsa biceribîne')
      }
    } catch (error: any) {
      console.error('Çewtiya têketinê:', error)
      
      // Çewtiyên tora/têkilî
      if (error.message?.includes('fetch') || error.message?.includes('network') || error.message?.includes('Failed to fetch')) {
        setError('Backend sunucusuna têkilî nayê dayîn. Ji kerema xwe backend\'ê çalak e kontrol bike.')
      } else if (error.message?.includes('401')) {
        setError('Email an jî şîfre çewt e. Ji kerema xwe kontrol bike.')
      } else if (error.message?.includes('404')) {
        setError('Ev email endam nîne. Ji kerema xwe pêşî endam bibe.')
      } else {
        setError('Di têketinê de çewtiya nexwezî: ' + (error.message || 'Çewtiya nenas'))
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-900 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo û Sernav */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-red-500 mb-2">FILMXANE</h1>
          <p className="text-gray-400">Platforma Sînema ya Kurdî</p>
        </div>

        {/* Forma Têketinê */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/30 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-center mb-6">Têkeve</h2>
          
          {error && (
            <div className="bg-red-900/20 border border-red-600 text-red-300 p-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Navnîşana Emailê
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                placeholder="mînak@email.com"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Şîfre
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 pr-12 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  placeholder="Şîfreya xwe binivîse"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-slate-600 p-3 rounded-lg font-semibold text-white transition-colors duration-200 flex items-center justify-center gap-2"
            >
              {loading ? 'Têkeve...' : 'Têkeve'}
            </button>
          </form>

          {/* Girêdan */}
          <div className="mt-6 text-center">
            <Link href="/register" className="block text-red-400 hover:text-red-300 text-sm transition-colors">
              Hesabek tune? Endam bibe
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
