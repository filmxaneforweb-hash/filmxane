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

      if (response.success) {
        setSuccess('Hesap başarıyla oluşturuldu! Giriş yapabilirsiniz.')
        console.log('✅ Register successful:', response.data)
        
        // Store token if returned
        if (response.data?.token) {
          apiClient.setToken(response.data.token)
        }
        
        // Redirect to login after 2 seconds
        setTimeout(() => {
          router.push('/login-test')
        }, 2000)
      } else {
        setError(response.error || 'Kayıt işlemi başarısız')
        console.error('❌ Register failed:', response.error)
      }
    } catch (error) {
      console.error('💥 Register error:', error)
      setError(error instanceof Error ? error.message : 'Bilinmeyen hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">🎬 Filmxane</h1>
          <p className="text-gray-400">Hesap oluştur ve filmleri keşfet</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-600 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-900/20 border border-green-600 rounded-lg">
            <p className="text-green-400 text-sm">{success}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Ad *
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                placeholder="Adınız"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Soyad *
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                placeholder="Soyadınız"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
              placeholder="ornek@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Şifre *
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
              placeholder="En az 6 karakter"
              minLength={6}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Şifre Tekrar *
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
              placeholder="Şifrenizi tekrar girin"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 py-3 px-4 rounded-lg font-semibold text-white transition-colors"
          >
            {loading ? '🔄 Hesap oluşturuluyor...' : '🚀 Hesap Oluştur'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-400">
            Zaten hesabın var mı?{' '}
            <Link href="/login-test" className="text-blue-400 hover:text-blue-300 font-medium">
              Giriş yap
            </Link>
          </p>
        </div>

        <div className="mt-6 p-4 bg-yellow-900/20 border border-yellow-600 rounded-lg">
          <h3 className="text-sm font-medium text-yellow-400 mb-2">💡 Test Bilgileri</h3>
          <ul className="text-xs text-yellow-300 space-y-1">
            <li>• Backend'in 3001 portunda çalıştığından emin ol</li>
            <li>• Email adresi benzersiz olmalı</li>
            <li>• Şifre en az 6 karakter olmalı</li>
            <li>• Console'da register loglarını kontrol et</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
