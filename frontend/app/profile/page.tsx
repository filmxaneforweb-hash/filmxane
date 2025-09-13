'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Navigation } from '@/components/Navigation'
import { User, Heart, Clock, Calendar, RefreshCw, Eye, CheckCircle } from 'lucide-react'

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [favoritesCount, setFavoritesCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  // Sadece favorileri çek
  const fetchFavorites = async () => {
    if (isLoading) return
    
    try {
      setIsLoading(true)
      
      const token = localStorage.getItem('filmxane_token')
      if (!token) {
        console.log('❌ Token bulunamadı')
        return
      }

      console.log('🔍 Favoriler çekiliyor...')

      try {
        const favoritesResponse = await fetch('https://filmxane-backend.onrender.com/api/favorites/my-favorites', {
          method: 'GET',
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
        
        if (favoritesResponse.ok) {
          const favoritesData = await favoritesResponse.json()
          const count = Array.isArray(favoritesData.data) ? favoritesData.data.length : 0
          setFavoritesCount(count)
          console.log('✅ Favoriler yüklendi:', count)
        } else {
          console.log('⚠️ Favoriler yüklenemedi:', favoritesResponse.status)
          setFavoritesCount(0)
        }
      } catch (error) {
        console.error('❌ Favoriler hatası:', error)
        setFavoritesCount(0)
      }
    } catch (error) {
      console.error('❌ Fetch error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Kullanıcı bilgilerini yükle ve favorileri çek
  useEffect(() => {
    const loadUser = () => {
      try {
        const firstName = localStorage.getItem('filmxane_user_firstName')
        const lastName = localStorage.getItem('filmxane_user_lastName')
        const email = localStorage.getItem('filmxane_user_email')
        
        if (firstName && lastName && email) {
          setUser({ firstName, lastName, email })
          // Kullanıcı yüklendikten sonra favorileri çek
          fetchFavorites()
        }
      } catch (error) {
        console.error('User load error:', error)
      }
    }

    loadUser()
  }, [])

  // Auth kontrolü
  useEffect(() => {
    const token = localStorage.getItem('filmxane_token')
    if (!token) {
      router.push('/login')
    }
  }, [router])


  if (!user) {
    return (
      <div className="min-h-screen bg-black">
        <Navigation />
        <div className="pt-24 text-center">
          <p className="text-white">Bikarhêner nehatibe dîtin</p>
        </div>
      </div>
    )
  }

  // Basit tarih formatı
  const formatJoinDate = () => {
    const joinDate = localStorage.getItem('filmxane_user_joinDate')
    if (!joinDate) return 'Nenas'
    
    try {
      const date = new Date(joinDate)
      return date.toLocaleDateString('tr-TR')
    } catch {
      return 'Nenas'
    }
  }

  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      
      <div className="pt-24 pb-8">
        <div className="container mx-auto px-4">
          {/* Karta Profîla Hêsan */}
          <div className="max-w-md mx-auto bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/30">
            {/* Refresh Butonu */}
            <div className="flex justify-end mb-4">
              <button
                onClick={() => {
                  fetchFavorites()
                }}
                disabled={isLoading}
                className={`p-2 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition-all duration-200 ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                title={isLoading ? 'Tê Barkirin...' : 'Favorileri Yenile'}
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {/* Avatara Profîlê */}
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">
                {user?.firstName} {user?.lastName}
              </h1>
              <p className="text-gray-400">{user?.email}</p>
            </div>

            {/* İstatistikler */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                <Heart className="w-5 h-5 text-red-500" />
                <span className="text-white">Fîlmên Dilxwazî</span>
                <span className="ml-auto text-gray-400">
                  {isLoading ? '...' : favoritesCount}
                </span>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                <Calendar className="w-5 h-5 text-green-500" />
                <span className="text-white">Dîroka Endamtiyê</span>
                <span className="ml-auto text-gray-400">{formatJoinDate()}</span>
              </div>
            </div>

            {/* Bişkokên Hêsan */}
            <div className="mt-6 space-y-3">
              <button 
                onClick={() => router.push('/mylist')}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
              >
                Lîsta Dilxwaziyê
              </button>
              
              <button 
                onClick={() => {
                  localStorage.removeItem('filmxane_token')
                  localStorage.removeItem('filmxane_user_firstName')
                  localStorage.removeItem('filmxane_user_lastName')
                  localStorage.removeItem('filmxane_user_email')
                  localStorage.removeItem('filmxane_user_joinDate')
                  window.location.href = '/'
                }}
                className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 px-4 rounded-lg font-medium transition-colors"
              >
                Derkeve
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
