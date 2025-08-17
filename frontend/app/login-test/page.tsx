'use client'

import { useState } from 'react'
import { apiClient } from '@/lib/api'
import Link from 'next/link'

export default function LoginTestPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleLogin = async () => {
    setLoading(true)
    setResult(null)

    try {
      console.log('🔐 Attempting login with:', { email, passwordLength: password?.length })
      
      const response = await apiClient.login(email, password)
      
      setResult({
        success: response.success,
        data: response.data,
        error: response.error,
        message: response.message
      })

      if (response.success) {
        console.log('✅ Login successful:', response.data)
        // Store token
        apiClient.setToken(response.data.token)
      } else {
        console.error('❌ Login failed:', response.error)
      }
    } catch (error) {
      console.error('💥 Login error:', error)
      setResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        type: 'exception'
      })
    } finally {
      setLoading(false)
    }
  }



  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🔐 Filmxane Login Test</h1>
        
        <div className="bg-blue-900/20 border border-blue-600 p-6 rounded-lg mb-6">
          <h2 className="text-xl font-semibold mb-4 text-blue-400">💡 Giriş Yap</h2>
          <p className="text-blue-300 text-sm">
            Kayıt olduktan sonra buraya email ve şifrenizi girerek giriş yapabilirsiniz.
          </p>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg mb-6">
          <h2 className="text-xl font-semibold mb-4">🔑 Login Form</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white"
                placeholder="Enter email"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white"
                placeholder="Enter password"
              />
            </div>
            
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 p-3 rounded font-semibold"
            >
              {loading ? '🔄 Logging in...' : '🚀 Login'}
            </button>
          </div>
        </div>

        {result && (
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">📊 Login Result</h2>
            
            <div className={`p-4 rounded ${result.success ? 'bg-green-900/20 border border-green-600' : 'bg-red-900/20 border border-red-600'}`}>
              <h3 className="font-semibold mb-2">
                {result.success ? '✅ Success' : '❌ Failed'}
              </h3>
              
              <pre className="text-sm bg-gray-900 p-3 rounded overflow-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          </div>
        )}

        <div className="mt-8 bg-yellow-900/20 border border-yellow-600 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-yellow-400 mb-2">💡 Test Bilgileri</h3>
          <ul className="text-sm space-y-1">
            <li>• Backend'in 3001 portunda çalıştığından emin ol</li>
            <li>• Database'de test kullanıcıları seeded olmalı</li>
            <li>• Console'da login loglarını kontrol et</li>
            <li>• Network tab'ında API çağrısını incele</li>
          </ul>
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-400">
            Hesabın yok mu?{' '}
            <Link href="/register" className="text-blue-400 hover:text-blue-300 font-medium">
              Kayıt ol
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
