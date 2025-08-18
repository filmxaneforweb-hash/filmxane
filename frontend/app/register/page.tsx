'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { apiClient } from '@/lib/api'
import Link from 'next/link'

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    // Clear errors when user types
    if (error) setError('')
  }

  const validateForm = () => {
    if (!formData.firstName.trim()) {
      setError('Ad alanı zorunludur')
      return false
    }
    if (!formData.lastName.trim()) {
      setError('Soyad alanı zorunludur')
      return false
    }
    if (!formData.email.trim()) {
      setError('Email alanı zorunludur')
      return false
    }
    if (!formData.password) {
      setError('Şifre alanı zorunludur')
      return false
    }
    if (formData.password.length < 6) {
      setError('Şifre en az 6 karakter olmalıdır')
      return false
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Şifreler eşleşmiyor')
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      console.log('🚀 Register attempt:', { 
        firstName: formData.firstName, 
        lastName: formData.lastName,
        email: formData.email, 
        passwordLength: formData.password?.length 
      })

      const response = await apiClient.register(
        formData.firstName,
        formData.lastName,
        formData.email,
        formData.password
      )

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
        setError(response.error || 'Hesap oluşturulamadı')
      }
    } catch (error) {
      console.error('💥 Register error:', error)
      setError(error instanceof Error ? error.message : 'Bilinmeyen hata oluştu')
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

        {/* Register Form */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/30 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-center mb-6">Hesap Oluştur</h2>
          
          {error && (
            <div className="bg-red-900/20 border border-red-600 text-red-300 p-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-900/20 border border-green-600 text-green-300 p-3 rounded-lg mb-4 text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Ad *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  placeholder="Adınız"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Soyad *
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  placeholder="Soyadınız"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                placeholder="ornek@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Şifre *
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                placeholder="En az 6 karakter"
                minLength={6}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Şifre Tekrar *
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                placeholder="Şifrenizi tekrar girin"
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
                  Hesap oluşturuluyor...
                </>
              ) : (
                '🚀 Hesap Oluştur'
              )}
            </button>
          </form>

          {/* Giriş Yap Linki */}
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Zaten hesabın var mı?{' '}
              <Link href="/login" className="text-red-400 hover:text-red-300 font-medium transition-colors">
                Giriş yap
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
