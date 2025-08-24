'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { apiClient } from '@/lib/api'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

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
      const response = await apiClient.login(email, password)
      
      // DEBUG: Tam yanıtı logla
      console.log('🔍 DEBUG: Login response:', response)
      console.log('🔍 DEBUG: response.success:', response.success)
      console.log('🔍 DEBUG: response.data:', response.data)
      console.log('🔍 DEBUG: response.data?.token:', response.data?.token)
      console.log('🔍 DEBUG: response.data?.user:', response.data?.user)
      
      if (response.success && response.data && response.data.token) {
        // Token var, devam et
        console.log('✅ Token bulundu:', response.data.token)

        // User bilgilerini kontrol et
        if (!response.data.user || !response.data.user.id) {
          setError('Giriş başarısız - kullanıcı bilgileri alınamadı')
          return
        }

        localStorage.setItem('filmxane_token', response.data.token)
        
        // Kullanıcı bilgilerini localStorage'a kaydet
        if (response.data.user.firstName) {
          localStorage.setItem('filmxane_user_firstName', response.data.user.firstName)
        }
        if (response.data.user.lastName) {
          localStorage.setItem('filmxane_user_lastName', response.data.user.lastName)
        }
        if (response.data.user.email) {
          localStorage.setItem('filmxane_user_email', response.data.user.email)
        }
        if (response.data.user.role) {
          localStorage.setItem('filmxane_user_role', response.data.user.role)
        }
        
        // Üyelik tarihini kontrol et, yoksa bugün olarak ayarla
        if (!localStorage.getItem('filmxane_user_joinDate')) {
          localStorage.setItem('filmxane_user_joinDate', new Date().toISOString())
        }
        
        // Role kontrolü
        if (response.data.user?.role === 'admin') {
          router.push('/admin')
        } else {
          router.push('/')
        }
      } else {
        // Hata durumu - response.error'dan mesaj al
        console.log('❌ Login failed:', response.error)
        setError(response.error || 'Giriş başarısız - ji kerema xwe dîsa biceribîne')
      }
    } catch (error: any) {
      console.error('Login error:', error)
      
      // Network/connection errors
      if (error.message?.includes('fetch') || error.message?.includes('network') || error.message?.includes('Failed to fetch')) {
        setError('Backend sunucusuna bağlanılamıyor. Lütfen backend\'in çalıştığından emin olun.')
      } else if (error.message?.includes('401')) {
        setError('Email an jî şîfre çewt e. Ji kerema xwe kontrol bike.')
      } else if (error.message?.includes('404')) {
        setError('Ev email endam nîne. Ji kerema xwe pêşî endam bibe.')
      } else {
        setError('Giriş yapılırken beklenmeyen hata: ' + (error.message || 'Bilinmeyen hata'))
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-900 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo ve Başlık */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-red-500 mb-2">FILMXANE</h1>
          <p className="text-gray-400">Platforma Sînema ya Kurdî</p>
        </div>

        {/* Login Form */}
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
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                placeholder="Şîfreya xwe binivîse"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-slate-600 p-3 rounded-lg font-semibold text-white transition-colors duration-200 flex items-center justify-center gap-2"
            >
              {loading ? 'Têkeve...' : 'Têkeve'}
            </button>
          </form>

          {/* Links */}
          <div className="mt-6 text-center space-y-2">
            <Link href="/register" className="block text-red-400 hover:text-red-300 text-sm transition-colors">
              Hesabek tune? Endam bibe
            </Link>
            <Link href="/forgot-password" className="block text-gray-400 hover:text-gray-300 text-sm transition-colors">
              Şîfreya xwe ji bîr kir?
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
