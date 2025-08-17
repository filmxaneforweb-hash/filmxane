'use client'

import { useState, useEffect } from 'react'
import { apiClient } from '@/lib/api'

export default function ApiTestPage() {
  const [testResults, setTestResults] = useState<any>({})
  const [loading, setLoading] = useState(false)

  const runTests = async () => {
    setLoading(true)
    const results: any = {}

    try {
      // Test 1: Categories API
      console.log('🧪 Testing Categories API...')
      const categoriesResponse = await apiClient.getCategories()
      results.categories = {
        success: categoriesResponse.success,
        data: categoriesResponse.data,
        error: categoriesResponse.error
      }

      // Test 2: Movies API
      console.log('🧪 Testing Movies API...')
      const moviesResponse = await apiClient.getMovies()
      results.movies = {
        success: moviesResponse.success,
        data: moviesResponse.data,
        error: moviesResponse.error
      }

      // Test 3: Series API
      console.log('🧪 Testing Series API...')
      const seriesResponse = await apiClient.getSeries()
      results.series = {
        success: seriesResponse.success,
        data: seriesResponse.data,
        error: seriesResponse.error
      }

      // Test 4: Auth Test Endpoint
      console.log('🧪 Testing Auth Test Endpoint...')
      try {
        const authTestResponse = await fetch('http://localhost:3001/api/auth/test')
        const authTestData = await authTestResponse.json()
        results.authTest = {
          success: authTestResponse.ok,
          data: authTestData,
          status: authTestResponse.status
        }
      } catch (error) {
        results.authTest = {
          success: false,
          error: error.message
        }
      }

    } catch (error) {
      console.error('❌ Test failed:', error)
      results.error = error
    } finally {
      setLoading(false)
      setTestResults(results)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🧪 Filmxane API Test Sayfası</h1>
        
        <div className="bg-gray-800 p-6 rounded-lg mb-6">
          <h2 className="text-xl font-semibold mb-4">🔧 API Yapılandırması</h2>
          <div className="space-y-2 text-sm">
            <p><strong>Base URL:</strong> {typeof window !== 'undefined' ? window.location.origin : 'Server-side'}</p>
            <p><strong>Current Port:</strong> {typeof window !== 'undefined' ? window.location.port : 'Unknown'}</p>
            <strong>Expected Backend:</strong> localhost:3001</p>
            <p><strong>API Endpoint:</strong> /api</p>
            <p><strong>Full API URL:</strong> http://localhost:3001/api</p>
          </div>
        </div>

        <button
          onClick={runTests}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-6 py-3 rounded-lg font-semibold mb-6"
        >
          {loading ? '🔄 Testler Çalışıyor...' : '🚀 API Testlerini Başlat'}
        </button>

        {Object.keys(testResults).length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">📊 Test Sonuçları</h2>
            
            {Object.entries(testResults).map(([key, value]: [string, any]) => (
              <div key={key} className="bg-gray-800 p-4 rounded-lg">
                <h3 className="font-semibold mb-2 capitalize">{key}</h3>
                <pre className="text-sm bg-gray-900 p-3 rounded overflow-auto">
                  {JSON.stringify(value, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 bg-yellow-900/20 border border-yellow-600 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-yellow-400 mb-2">💡 Sorun Giderme</h3>
          <ul className="text-sm space-y-1">
            <li>• Backend'in 3001 portunda çalıştığından emin ol</li>
            <li>• Frontend'in 3000 veya 3002 portunda çalıştığından emin ol</li>
            <li>• Console'da hata mesajlarını kontrol et</li>
            <li>• Network tab'ında API çağrılarını incele</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
