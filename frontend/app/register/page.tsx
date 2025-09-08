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
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    // Çewtiyên paqij bike dema bikarhêner dinivîse
    if (error) setError('')
  }

  const validateForm = () => {
    if (!formData.firstName.trim()) {
      setError('Qada navê pêwîst e')
      return false
    }
    if (!formData.lastName.trim()) {
      setError('Qada paşnavê pêwîst e')
      return false
    }
    if (!formData.email.trim()) {
      setError('Qada emailê pêwîst e')
      return false
    }
    if (!formData.password) {
      setError('Qada şîfreyê pêwîst e')
      return false
    }
    if (formData.password.length < 6) {
      setError('Şîfre divê bi kêmî 6 tîpan be')
      return false
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Şîfreyên newekhev in')
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Rastandin
    if (formData.password !== formData.confirmPassword) {
      setError('Şîfreyên newekhev in')
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('Şîfre divê bi kêmî 6 tîpan be')
      setLoading(false)
      return
    }

    try {
      const response = await apiClient.register(
        formData.firstName,
        formData.lastName,
        formData.email,
        formData.password
      )
      
      if (response.success && response.data) {
        // Tokenê kontrol bike
        if (!response.data.token) {
          setError('Tomarkirin nehatibe serkeftin - token nehatibe wergirtin')
          return
        }

        // Agahiyên bikarhêner kontrol bike
        if (!response.data.user || !response.data.user.id) {
          setError('Tomarkirin nehatibe serkeftin - agahiyên bikarhêner nehatibe wergirtin')
          return
        }

        localStorage.setItem('filmxane_token', response.data.token)
        
        // Agahiyên bikarhêner di localStorage'ê de tomar bike
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
        
        // Dîroka endamtiyê tomar bike
        localStorage.setItem('filmxane_user_joinDate', new Date().toISOString())
        
        // Bixweber têkeve û berbiçe rûpela sereke
        router.push('/')
      } else {
        setError(response.error || 'Tomarkirin nehatibe serkeftin')
      }
    } catch (error: any) {
      console.error('Çewtiya tomarkirinê:', error)
      
      // Çewtiyên tora/têkilî
      if (error.message?.includes('fetch') || error.message?.includes('network') || error.message?.includes('Failed to fetch')) {
        setError('Backend sunucusuna têkilî nayê dayîn. Ji kerema xwe backend\'ê çalak e kontrol bike.')
      } else {
        setError('Di tomarkirinê de çewtiya nexwezî: ' + (error.message || 'Çewtiya nenas'))
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

        {/* Forma Tomarkirinê */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/30 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-center mb-6">Hesab Avêje</h2>
          
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
                  Nav *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  placeholder="Nava we"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Paşnav *
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  placeholder="Paşnava we"
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
                placeholder="mînak@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Şîfre *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full p-3 pr-12 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  placeholder="Bi kêmî 6 tîp"
                  minLength={6}
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

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Şîfre Dîsa *
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full p-3 pr-12 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  placeholder="Şîfre dîsa we"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showConfirmPassword ? (
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
              {loading ? 'Hesab tê avêtin...' : '🚀 Hesab Avêje'}
            </button>
          </form>

          {/* Girêdana Têketinê */}
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Hîn hesabek heye?{' '}
              <Link href="/login" className="text-red-400 hover:text-red-300 font-medium transition-colors">
                Têkeve
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
