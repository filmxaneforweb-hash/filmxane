'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Navigation } from '@/components/Navigation'
import { User, Heart, Clock, Calendar, RefreshCw } from 'lucide-react'

interface UserStats {
  favoritesCount: number
  totalWatchTime: number
  joinDate: string
}

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState<UserStats>({
    favoritesCount: 0,
    totalWatchTime: 0,
    joinDate: ''
  })
  const [loading, setLoading] = useState(true)
  const [statsLoading, setStatsLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  // Backend'den kullanıcı istatistiklerini çek
  const fetchUserStats = async () => {
    try {
      const token = localStorage.getItem('filmxane_token')
      if (!token) return

      console.log('🔄 Profil verileri yenileniyor...')

      // Favori sayısını çek
      const favoritesResponse = await fetch('http://localhost:3005/api/favorites/my-favorites', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (favoritesResponse.ok) {
        const favoritesData = await favoritesResponse.json()
        const favoritesCount = Array.isArray(favoritesData) ? favoritesData.length : 0
        
        console.log('📊 Favori sayısı:', favoritesCount)
        
        setStats(prev => ({
          ...prev,
          favoritesCount
        }))
      } else {
        console.error('❌ Favori verisi alınamadı:', favoritesResponse.status)
      }

      // İzlenme süresini çek
      try {
        const watchTimeResponse = await fetch('http://localhost:3005/api/videos/watch-time', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        if (watchTimeResponse.ok) {
          const watchTimeData = await watchTimeResponse.json()
          setStats(prev => ({
            ...prev,
            totalWatchTime: watchTimeData.totalMinutes || 0
          }))
        }
      } catch (error) {
        console.log('İzlenme süresi endpoint\'i mevcut değil, 0 olarak ayarlandı')
      }

      // Üyelik tarihini localStorage'dan al
      const joinDate = localStorage.getItem('filmxane_user_joinDate') || new Date().toISOString()
      setStats(prev => ({
        ...prev,
        joinDate
      }))

      console.log('✅ Profil verileri güncellendi')

    } catch (error) {
      console.error('Kullanıcı istatistikleri alınamadı:', error)
    } finally {
      setStatsLoading(false)
      setRefreshing(false)
    }
  }

  // Manuel yenileme fonksiyonu
  const handleRefresh = () => {
    console.log('🔄 Manuel yenileme başlatıldı')
    setRefreshing(true)
    setStatsLoading(true)
    fetchUserStats()
  }

  // Sayfa görünür olduğunda verileri güncelle
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log('👁️ Sayfa görünür oldu, veriler güncelleniyor...')
        fetchUserStats()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [])

  // Favori sayısını gerçek zamanlı güncelle - Basit polling sistemi
  useEffect(() => {
    // Her 5 saniyede bir favori sayısını kontrol et
    const interval = setInterval(() => {
      const token = localStorage.getItem('filmxane_token')
      if (token) {
        fetch('http://localhost:3005/api/favorites/my-favorites', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        .then(response => response.json())
        .then(data => {
          const newCount = Array.isArray(data) ? data.length : 0
          if (newCount !== stats.favoritesCount) {
            console.log('🔄 Favori sayısı değişti:', stats.favoritesCount, '->', newCount)
            setStats(prev => ({
              ...prev,
              favoritesCount: newCount
            }))
          }
        })
        .catch(error => {
          console.log('Favori sayısı kontrol edilemedi:', error)
        })
      }
    }, 5000) // 5 saniye

    return () => clearInterval(interval)
  }, [stats.favoritesCount])

  // İlk yükleme
  useEffect(() => {
    if (user) {
      fetchUserStats()
    }
  }, [user])

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('filmxane_token')
      if (!token) {
        router.push('/login')
        return
      }

      // Basit kullanıcı bilgileri
      const firstName = localStorage.getItem('filmxane_user_firstName')
      const lastName = localStorage.getItem('filmxane_user_lastName')
      const email = localStorage.getItem('filmxane_user_email')
      
      if (firstName && lastName && email) {
        setUser({ firstName, lastName, email })
      }
      
      setLoading(false)
    }

    checkAuth()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <Navigation />
        <div className="pt-24 flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full"></div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black">
        <Navigation />
        <div className="pt-24 text-center">
          <p className="text-white">Kullanıcı bulunamadı</p>
        </div>
      </div>
    )
  }

  // Üyelik tarihini formatla
  const formatJoinDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      const now = new Date()
      const diffTime = Math.abs(now.getTime() - date.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      
      if (diffDays === 1) return 'Dün'
      if (diffDays === 0) return 'Bugün'
      if (diffDays < 7) return `${diffDays} gün önce`
      if (diffDays < 30) return `${Math.floor(diffDays / 7)} hafta önce`
      if (diffDays < 365) return `${Math.floor(diffDays / 30)} ay önce`
      return `${Math.floor(diffDays / 365)} yıl önce`
    } catch {
      return 'Bilinmiyor'
    }
  }

  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      
      <div className="pt-24 pb-8">
        <div className="container mx-auto px-4">
          {/* Basit Profil Kartı */}
          <div className="max-w-md mx-auto bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/30">
            {/* Yenileme Butonu */}
            <div className="flex justify-end mb-4">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition-all duration-200 disabled:opacity-50"
                title="Verileri Yenile"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {/* Profil Avatar */}
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">
                {user.firstName} {user.lastName}
              </h1>
              <p className="text-gray-400">{user.email}</p>
            </div>

            {/* Backend'den Gelen Bilgiler */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                <Heart className="w-5 h-5 text-red-500" />
                <span className="text-white">Favori Filmler</span>
                <span className="ml-auto text-gray-400">
                  {statsLoading ? (
                    <div className="animate-spin w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full"></div>
                  ) : (
                    stats.favoritesCount
                  )}
                </span>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                <Clock className="w-5 h-5 text-blue-500" />
                <span className="text-white">İzleme Süresi</span>
                <span className="ml-auto text-gray-400">
                  {statsLoading ? (
                    <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                  ) : (
                    stats.totalWatchTime > 0 ? `${stats.totalWatchTime} dk` : '0 dk'
                  )}
                </span>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                <Calendar className="w-5 h-5 text-green-500" />
                <span className="text-white">Üyelik Tarihi</span>
                <span className="ml-auto text-gray-400">
                  {statsLoading ? (
                    <div className="animate-spin w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full"></div>
                  ) : (
                    formatJoinDate(stats.joinDate)
                  )}
                </span>
              </div>
            </div>

            {/* Basit Butonlar */}
            <div className="mt-6 space-y-3">
              <button 
                onClick={() => router.push('/mylist')}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
              >
                Favori Listem ({stats.favoritesCount})
              </button>
              
              <button 
                onClick={() => {
                  localStorage.removeItem('filmxane_token')
                  localStorage.removeItem('filmxane_user_firstName')
                  localStorage.removeItem('filmxane_user_lastName')
                  localStorage.removeItem('filmxane_user_email')
                  localStorage.removeItem('filmxane_user_joinDate')
                  router.push('/')
                }}
                className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 px-4 rounded-lg font-medium transition-colors"
              >
                Çıkış Yap
              </button>
            </div>


          </div>
        </div>
      </div>
    </div>
  )
}
