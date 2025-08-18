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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      console.log('🔐 Giriş yapılıyor:', { email, passwordLength: password?.length })
      
      const response = await apiClient.login(email, password)
      
      if (response.success && response.data) {
        // Store token
        localStorage.setItem('filmxane_token', response.data.token)
        
        // Store user name
        if (response.data.user) {
          const fullName = `${response.data.user.firstName || ''} ${response.data.user.lastName || ''}`.trim()
          localStorage.setItem('filmxane_user_name', fullName || 'Kullanıcı')
        }
        
        // Redirect to profile
        router.push('/profile')
      } else {
        setError(response.error || 'Giriş yapılamadı')
      }
    } catch (error) {
      console.error('💥 Giriş hatası:', error)
      setError('Giriş sırasında bir hata oluştu. Lütfen tekrar deneyin.')
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
          <p className="text-gray-400">Kürt Sineması Platformu</p>
        </div>

        {/* Login Form */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/30 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-center mb-6">Giriş Yap</h2>
          
          {error && (
            <div className="bg-red-900/20 border border-red-600 text-red-300 p-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Email Adresi
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                placeholder="ornek@email.com"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Şifre
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                placeholder="Şifrenizi girin"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-slate-600 p-3 rounded-lg font-semibold text-white transition-colors duration-200 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                  Giriş yapılıyor...
                </>
              ) : (
                'Giriş Yap'
              )}
            </button>
          </form>

          {/* Kayıt Ol Linki */}
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Hesabın yok mu?{' '}
              <Link href="/register" className="text-red-400 hover:text-red-300 font-medium transition-colors">
                Kayıt ol
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
