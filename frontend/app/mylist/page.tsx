'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Heart, Clock, Star } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { apiClient } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'

export default function MyListPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const [favoriteVideos, setFavoriteVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Fetch favorites from API
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!isAuthenticated) {
        setError('Please login to view your favorites')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const response = await apiClient.getFavorites()
        if (response.success && response.data) {
          setFavoriteVideos(response.data)
        } else {
          setError('Failed to fetch favorites')
        }
      } catch (error) {
        console.error('Error fetching favorites:', error)
        setError('Failed to fetch favorites')
      } finally {
        setLoading(false)
      }
    }

    fetchFavorites()
  }, [isAuthenticated])

  const handleWatchVideo = (videoId: string, videoTitle: string) => {
    // TODO: Implement actual video watching functionality
    console.log(`Watching video: ${videoTitle} (ID: ${videoId})`)
    alert(`Temaşeya ${videoTitle} dest pê dike...`)
  }

  const handleToggleFavorite = async (videoId: string, videoTitle: string) => {
    try {
      await apiClient.removeFromFavorites(videoId)
      // Refresh favorites list
      const response = await apiClient.getFavorites()
      if (response.success && response.data) {
        setFavoriteVideos(response.data)
      }
      alert(`${videoTitle} ji lîsta te ya xweşbînî hate rakirin`)
    } catch (error) {
      console.error('Error removing from favorites:', error)
      alert('Error removing from favorites')
    }
  }

  const handleViewAllVideos = () => {
    // Navigate to videos page
    router.push('/videos')
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-black pt-20">
      {/* Hero Section */}
      <section className="py-16 px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1 
            className="text-5xl md:text-6xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="bg-gradient-to-r from-white via-red-100 to-red-200 bg-clip-text text-transparent">
              Lîsta Min
            </span>
          </motion.h1>
          <motion.p 
            className="text-xl text-slate-400 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Fîlm û rêzefîlmên ku te ji xweş dîtine û dixwazî dîsa bibînî
          </motion.p>
        </div>
      </section>

      {/* Favorites Grid */}
      <section className="py-16 px-8">
        <div className="max-w-7xl mx-auto">
          {loading && (
            <div className="text-center py-20">
              <p className="text-slate-500">Loading favorites...</p>
            </div>
          )}
          {error && (
            <div className="text-center py-20 text-red-400">
              <p>{error}</p>
            </div>
          )}
          {!loading && !error && favoriteVideos.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {favoriteVideos.map((video, index) => (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-slate-800/40 backdrop-blur-sm rounded-2xl overflow-hidden border border-slate-600/30 hover:border-slate-500/50 transition-all duration-300 group hover:scale-105"
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-video bg-slate-700/50 flex items-center justify-center">
                    <Heart className="w-16 h-16 text-red-500 fill-current" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-red-400 transition-colors duration-300">
                      {video.title}
                    </h3>
                    <p className="text-slate-400 text-sm mb-4 leading-relaxed">
                      {video.description}
                    </p>

                    {/* Meta Info */}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-blue-400" />
                          <span className="text-slate-300">{video.duration}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-slate-300">{video.rating}</span>
                        </div>
                      </div>
                      <span className="text-slate-400">{video.year}</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 mt-6">
                      <button 
                        onClick={() => handleWatchVideo(video.id, video.title)}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200"
                      >
                        Temaşe Et
                      </button>
                      <button 
                        onClick={() => handleToggleFavorite(video.id, video.title)}
                        className="px-4 py-2 border border-slate-600 text-slate-300 hover:text-white hover:border-slate-500 rounded-lg transition-all duration-200"
                      >
                        <Heart className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
          {!loading && !error && favoriteVideos.length === 0 && (
            <motion.div 
              className="text-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <Heart className="w-24 h-24 text-slate-600 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-slate-400 mb-4">
                Lîsta te ya xweşbînî vala ye
              </h3>
              <p className="text-slate-500 mb-8">
                Fîlm û rêzefîlmên ku te ji xweş dîtine li vir dê xuya bibin
              </p>
              <button 
                onClick={handleViewAllVideos}
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200"
              >
                Fîlmên Bibîne
              </button>
            </motion.div>
          )}
        </div>
      </section>
    </main>
  )
}
