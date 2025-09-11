'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Navigation } from '@/components/Navigation'
import { User, Heart, Clock, Calendar, RefreshCw, Eye, CheckCircle } from 'lucide-react'

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // Basit kullanıcı bilgilerini yükle
  useEffect(() => {
    const loadUser = () => {
      const firstName = localStorage.getItem('filmxane_user_firstName')
      const lastName = localStorage.getItem('filmxane_user_lastName')
      const email = localStorage.getItem('filmxane_user_email')
      
      if (firstName && lastName && email) {
        setUser({ firstName, lastName, email })
      }
      setLoading(false)
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

            {/* Basit İstatistikler */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                <Heart className="w-5 h-5 text-red-500" />
                <span className="text-white">Fîlmên Dilxwazî</span>
                <span className="ml-auto text-gray-400">0</span>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                <Clock className="w-5 h-5 text-blue-500" />
                <span className="text-white">Demê Temaşekirinê</span>
                <span className="ml-auto text-gray-400">0 dk</span>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                <Eye className="w-5 h-5 text-purple-500" />
                <span className="text-white">Tevahiya Temaşekirinê</span>
                <span className="ml-auto text-gray-400">0</span>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-white">Temamkirî</span>
                <span className="ml-auto text-gray-400">0</span>
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
