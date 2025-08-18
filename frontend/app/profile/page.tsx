'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { apiClient } from '@/lib/api'
import Link from 'next/link'

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
  createdAt: string
}

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [stats, setStats] = useState({
    favoritesCount: 0,
    watchHistoryCount: 0,
    totalWatchTime: 0
  })

  useEffect(() => {
    const checkAuth = async () => {
      // Check if we're on client side
      if (typeof window === 'undefined') return
      
      const token = localStorage.getItem('filmxane_token')
      if (!token) {
        router.push('/login')
        return
      }

      try {
        const [profileResponse, favoritesResponse] = await Promise.all([
          apiClient.getProfile(),
          apiClient.getFavorites()
        ])
        
        if (profileResponse.success && profileResponse.data) {
          // API'den gelen veriyi local User type'ına dönüştür
          const userData = profileResponse.data as any
          setUser({
            id: userData.id,
            email: userData.email,
            firstName: userData.firstName || userData.name?.split(' ')[0] || 'Kullanıcı',
            lastName: userData.lastName || userData.name?.split(' ').slice(1).join(' ') || '',
            role: userData.role,
            createdAt: userData.createdAt
          })
        } else {
          console.error('Profile response error:', profileResponse.error)
          localStorage.removeItem('filmxane_token')
          router.push('/login')
          return
        }

        if (favoritesResponse.success && favoritesResponse.data) {
          setStats(prev => ({
            ...prev,
            favoritesCount: favoritesResponse.data?.length || 0
          }))
        }
      } catch (error) {
        console.error('Profil yüklenirken hata:', error)
        localStorage.removeItem('filmxane_token')
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('filmxane_token')
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-900 text-white flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-900 text-white">
      {/* Header */}
      <div className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-red-500">FILMXANE</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                Ana Sayfa
              </Link>
              <Link href="/movies" className="text-gray-300 hover:text-white transition-colors">
                Filmler
              </Link>
              <Link href="/series" className="text-gray-300 hover:text-white transition-colors">
                Diziler
              </Link>
              <Link href="/mylist" className="text-gray-300 hover:text-white transition-colors">
                Listem
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/30 rounded-2xl p-6 shadow-2xl">
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-red-500 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold">
                  {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                </div>
                <h2 className="text-xl font-bold text-white">{user.firstName} {user.lastName}</h2>
                <p className="text-gray-400">{user.email}</p>
                <p className="text-sm text-gray-500 mt-1">Üye olma: {new Date(user.createdAt).toLocaleDateString('tr-TR')}</p>
              </div>

              <div className="space-y-4">
                <button
                  onClick={handleLogout}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  Çıkış Yap
                </button>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/30 rounded-2xl p-6 shadow-2xl text-center">
                <div className="text-3xl mb-2">❤️</div>
                <div className="text-2xl font-bold text-white mb-1">{stats.favoritesCount}</div>
                <div className="text-sm text-gray-400">Favori</div>
              </div>
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/30 rounded-2xl p-6 shadow-2xl text-center">
                <div className="text-3xl mb-2">👁️</div>
                <div className="text-2xl font-bold text-white mb-1">{stats.watchHistoryCount}</div>
                <div className="text-sm text-gray-400">İzlenen</div>
              </div>
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/30 rounded-2xl p-6 shadow-2xl text-center">
                <div className="text-3xl mb-2">⏱️</div>
                <div className="text-2xl font-bold text-white mb-1">{stats.totalWatchTime}h</div>
                <div className="text-sm text-gray-400">Toplam Süre</div>
              </div>
            </div>

            {/* My List Section */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/30 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">🎬 Listem</h3>
                <Link 
                  href="/mylist" 
                  className="text-red-400 hover:text-red-300 text-sm transition-colors"
                >
                  Tümünü Gör →
                </Link>
              </div>
              {stats.favoritesCount > 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-2">🎉</div>
                  <p className="text-gray-400">Listenizde {stats.favoritesCount} favori var</p>
                  <Link 
                    href="/mylist" 
                    className="inline-block mt-3 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg text-sm transition-colors"
                  >
                    Listeyi Görüntüle
                  </Link>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-2">📝</div>
                  <p className="text-gray-400">Henüz listenize film eklemediniz</p>
                  <p className="text-gray-500 text-sm mt-2">Filmleri keşfetmeye başlayın ve favorilerinizi ekleyin</p>
                  <Link 
                    href="/movies" 
                    className="inline-block mt-3 bg-red-600 hover:bg-red-700 text-white py-2 px-6 rounded-lg transition-colors"
                  >
                    Filmleri Keşfet
                  </Link>
                </div>
              )}
            </div>

            {/* Recently Watched */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/30 rounded-2xl p-6 shadow-2xl">
              <h3 className="text-xl font-bold text-white mb-4">⏰ Son İzlenenler</h3>
              <div className="text-center py-8">
                <div className="text-4xl mb-2">🕒</div>
                <p className="text-gray-400">Henüz film izlemediniz</p>
                <p className="text-gray-500 text-sm mt-2">İlk filminizi izlemeye başlayın</p>
              </div>
            </div>

            {/* Watchlist */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/30 rounded-2xl p-6 shadow-2xl">
              <h3 className="text-xl font-bold text-white mb-4">📋 İzleme Listesi</h3>
              <div className="text-center py-8">
                <div className="text-4xl mb-2">📋</div>
                <p className="text-gray-400">İzleme listeniz boş</p>
                <p className="text-gray-500 text-sm mt-2">Daha sonra izlemek istediğiniz filmleri ekleyin</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
