'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Navigation } from '@/components/Navigation'
import { User, Heart, Clock, Calendar, RefreshCw, Eye, CheckCircle } from 'lucide-react'

interface UserStats {
  favoritesCount: number
  totalWatchTime: number
  totalViews: number
  completedVideos: number
  joinDate: string
}

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState<UserStats>({
    favoritesCount: 0,
    totalWatchTime: 0,
    totalViews: 0,
    completedVideos: 0,
    joinDate: ''
  })
  const [loading, setLoading] = useState(true)
  const [statsLoading, setStatsLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  // Ji backend'ê statîstîkên bikarhêner bikişîne
  const fetchUserStats = async () => {
    try {
      const token = localStorage.getItem('filmxane_token')
      if (!token) return

      // Hejmara dilxwaziyê bikişîne
      const favoritesResponse = await fetch('https://filmxane-backend.onrender.com/api/favorites/my-favorites', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (favoritesResponse.ok) {
        const favoritesData = await favoritesResponse.json()
        const favoritesCount = Array.isArray(favoritesData) ? favoritesData.length : 0
        
        setStats(prev => ({
          ...prev,
          favoritesCount
        }))
      }

      // Dema temaşekirinê bikişîne
      try {
        const watchTimeResponse = await fetch('https://filmxane-backend.onrender.com/api/videos/watch-time', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        if (watchTimeResponse.ok) {
          const watchTimeData = await watchTimeResponse.json()
          
          const totalWatchTime = watchTimeData.totalMinutes || 0
          const totalViews = watchTimeData.totalViews || 0
          const completedVideos = watchTimeData.completedVideos || 0
          
          setStats(prev => ({
            ...prev,
            totalWatchTime,
            totalViews,
            completedVideos
          }))
        }
      } catch (error) {
        // Nirxên xwerû
        setStats(prev => ({
          ...prev,
          totalWatchTime: 0,
          totalViews: 0,
          completedVideos: 0
        }))
      }

      // Dîroka endamtiyê ji localStorage'ê bigire
      const joinDate = localStorage.getItem('filmxane_user_joinDate') || new Date().toISOString()
      setStats(prev => ({
        ...prev,
        joinDate
      }))

    } catch (error) {
      console.error('Statîstîkên bikarhêner nehatine wergirtin:', error)
    } finally {
      setStatsLoading(false)
      setRefreshing(false)
    }
  }

  // Fonksiyona nûkirina destî
  const handleRefresh = () => {
    setRefreshing(true)
    setStatsLoading(true)
    fetchUserStats()
  }

  // Sadece sayfa yüklendiğinde bir kez çalıştır
  useEffect(() => {
    if (user) {
      fetchUserStats()
    }
  }, []) // Sadece mount'ta çalışır

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('filmxane_token')
      if (!token) {
        router.push('/login')
        return
      }

      try {
        // Ji backend'ê agahiyên bikarhêner bikişîne
        const response = await fetch('https://filmxane-backend.onrender.com/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (response.ok) {
          const userData = await response.json()
          
          setUser({
            firstName: userData.firstName || userData.name?.split(' ')[0] || 'User',
            lastName: userData.lastName || userData.name?.split(' ')[1] || '',
            email: userData.email
          })
          
          // Dîroka endamtiyê ji backend'ê bigire
          const joinDate = userData.createdAt || userData.joinDate || new Date().toISOString()
          setStats(prev => ({
            ...prev,
            joinDate
          }))
        } else {
          // Fallback: ji localStorage'ê bigire
          const firstName = localStorage.getItem('filmxane_user_firstName')
          const lastName = localStorage.getItem('filmxane_user_lastName')
          const email = localStorage.getItem('filmxane_user_email')
          
          if (firstName && lastName && email) {
            setUser({ firstName, lastName, email })
            
            let joinDate = localStorage.getItem('filmxane_user_joinDate')
            if (!joinDate) {
              joinDate = new Date().toISOString()
              localStorage.setItem('filmxane_user_joinDate', joinDate)
            }
            
            setStats(prev => ({
              ...prev,
              joinDate
            }))
          }
        }
      } catch (error) {
        // Fallback: ji localStorage'ê bigire
        const firstName = localStorage.getItem('filmxane_user_firstName')
        const lastName = localStorage.getItem('filmxane_user_lastName')
        const email = localStorage.getItem('filmxane_user_email')
        
        if (firstName && lastName && email) {
          setUser({ firstName, lastName, email })
          
          let joinDate = localStorage.getItem('filmxane_user_joinDate')
          if (!joinDate) {
            joinDate = new Date().toISOString()
            localStorage.setItem('filmxane_user_joinDate', joinDate)
          }
          
          setStats(prev => ({
            ...prev,
            joinDate
          }))
        }
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
          <p className="text-white">Bikarhêner nehatibe dîtin</p>
        </div>
      </div>
    )
  }

  // Dîroka endamtiyê format bike
  const formatJoinDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      const now = new Date()
      const diffTime = Math.abs(now.getTime() - date.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      
      if (diffDays === 1) return 'Duh'
      if (diffDays === 0) return 'Îro'
      if (diffDays < 7) return `${diffDays} roj berê`
      if (diffDays < 30) return `${Math.floor(diffDays / 7)} hefte berê`
      if (diffDays < 365) return `${Math.floor(diffDays / 30)} meh berê`
      return `${Math.floor(diffDays / 365)} sal berê`
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
            {/* Bişkok Nûkirinê */}
            <div className="flex justify-end mb-4">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition-all duration-200 disabled:opacity-50"
                title="Daneyên Nû Bike"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {/* Avatara Profîlê */}
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">
                {user.firstName} {user.lastName}
              </h1>
              <p className="text-gray-400">{user.email}</p>
            </div>

            {/* Agahiyên ji Backend'ê */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                <Heart className="w-5 h-5 text-red-500" />
                <span className="text-white">Fîlmên Dilxwazî</span>
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
                <span className="text-white">Demê Temaşekirinê</span>
                <span className="ml-auto text-gray-400">
                  {statsLoading ? (
                    <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                  ) : (
                    stats.totalWatchTime > 0 ? `${stats.totalWatchTime} dk` : '0 dk'
                  )}
                </span>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                <Eye className="w-5 h-5 text-purple-500" />
                <span className="text-white">Tevahiya Temaşekirinê</span>
                <span className="ml-auto text-gray-400">
                  {statsLoading ? (
                    <div className="animate-spin w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full"></div>
                  ) : (
                    stats.totalViews > 0 ? stats.totalViews : '0'
                  )}
                </span>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-white">Temamkirî</span>
                <span className="ml-auto text-gray-400">
                  {statsLoading ? (
                    <div className="animate-spin w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full"></div>
                  ) : (
                    stats.completedVideos > 0 ? stats.completedVideos : '0'
                  )}
                </span>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                <Calendar className="w-5 h-5 text-green-500" />
                <span className="text-white">Dîroka Endamtiyê</span>
                <span className="ml-auto text-gray-400">
                  {statsLoading ? (
                    <div className="animate-spin w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full"></div>
                  ) : (
                    formatJoinDate(stats.joinDate)
                  )}
                </span>
              </div>
            </div>

            {/* Bişkokên Hêsan */}
            <div className="mt-6 space-y-3">
              <button 
                onClick={() => router.push('/mylist')}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
              >
                Lîsta Dilxwaziyê ({stats.favoritesCount})
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
                Derkeve
              </button>
            </div>


          </div>
        </div>
      </div>
    </div>
  )
}
