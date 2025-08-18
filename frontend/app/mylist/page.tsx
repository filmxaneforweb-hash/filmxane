'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { apiClient } from '@/lib/api'
import Link from 'next/link'
import { Heart, Play, Clock, Star, Trash2 } from 'lucide-react'

interface FavoriteContent {
  id: string
  title: string
  type: 'movie' | 'series'
  thumbnail?: string
  poster?: string
  year?: number
  rating?: number
  duration?: number
  genre?: string[]
}

export default function MyListPage() {
  const router = useRouter()
  const [favorites, setFavorites] = useState<FavoriteContent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

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
        const response = await apiClient.getFavorites()
        if (response.success && response.data) {
          setFavorites(response.data)
        } else {
          console.error('Favorites response error:', response.error)
          if (response.error?.includes('Authentication failed')) {
            localStorage.removeItem('filmxane_token')
            router.push('/login')
            return
          }
          setError(response.error || 'Favoriler yüklenemedi')
        }
      } catch (error) {
        console.error('Favoriler yüklenirken hata:', error)
        setError('Favoriler yüklenirken bir hata oluştu')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  const handleRemoveFavorite = async (contentId: string) => {
    try {
      const response = await apiClient.removeFromFavorites(contentId)
      if (response.success) {
        setFavorites(prev => prev.filter(item => item.id !== contentId))
      }
    } catch (error) {
      console.error('Favorilerden çıkarırken hata:', error)
    }
  }

  const handlePlay = (contentId: string, type: 'movie' | 'series') => {
    if (type === 'movie') {
      router.push(`/videos/${contentId}`)
    } else {
      router.push(`/series/${contentId}`)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-900 text-white flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full"></div>
      </div>
    )
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
              <Link href="/profile" className="text-gray-300 hover:text-white transition-colors">
                Profilim
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">🎬 Favori Listem</h1>
          <p className="text-gray-400">Beğendiğiniz film ve diziler burada saklanır</p>
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-600 text-red-300 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {favorites.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-8xl mb-6">💔</div>
            <h2 className="text-2xl font-bold text-white mb-4">Henüz favori listeniz boş</h2>
            <p className="text-gray-400 mb-8">Filmleri keşfetmeye başlayın ve beğendiklerinizi favorilere ekleyin</p>
            <Link 
              href="/movies" 
              className="inline-block bg-red-600 hover:bg-red-700 text-white py-3 px-8 rounded-lg font-medium transition-colors"
            >
              Filmleri Keşfet
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map((content) => (
              <div key={content.id} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/30 rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                {/* Thumbnail */}
                <div className="relative h-48 bg-slate-700">
                  {content.thumbnail || content.poster ? (
                    <img 
                      src={content.thumbnail || content.poster} 
                      alt={content.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl text-slate-500">
                      🎬
                    </div>
                  )}
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handlePlay(content.id, content.type)}
                        className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-full transition-colors"
                      >
                        <Play className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleRemoveFavorite(content.id)}
                        className="bg-slate-700 hover:bg-slate-600 text-white p-3 rounded-full transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Content Info */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                    {content.title}
                  </h3>
                  
                  <div className="flex items-center justify-between text-sm text-gray-400 mb-3">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {content.duration ? `${content.duration} dk` : 'N/A'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      {content.rating ? content.rating.toFixed(1) : 'N/A'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {content.year || 'N/A'}
                    </span>
                    <span className="text-xs bg-red-600 text-white px-2 py-1 rounded">
                      {content.type === 'movie' ? 'Film' : 'Dizi'}
                    </span>
                  </div>

                  {content.genre && content.genre.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {content.genre.slice(0, 2).map((genre, index) => (
                        <span key={index} className="text-xs bg-slate-700 text-gray-300 px-2 py-1 rounded">
                          {genre}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
