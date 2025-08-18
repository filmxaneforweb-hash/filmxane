'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Play, Pause, Volume2, VolumeX, Maximize, Heart, Share2, Download, Clock, Star, Eye } from 'lucide-react'
import ReactPlayer from 'react-player'
import { apiClient } from '@/lib/api'
import { Movie, Series } from '@/lib/api'
import { VideoCard } from '@/components/VideoCard'
import { getSafeImageUrl } from '@/lib/utils'
import { useAuth } from '@/contexts/AuthContext'

export default function VideoPlayerPage() {
  const params = useParams()
  const videoId = params.id as string
  const { user, isAuthenticated } = useAuth()
  
  const [video, setVideo] = useState<Movie | Series | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [relatedVideos, setRelatedVideos] = useState<(Movie | Series)[]>([])
  const [showControls, setShowControls] = useState(true)
  const [isFavorite, setIsFavorite] = useState(false)
  const [isLoadingFavorite, setIsLoadingFavorite] = useState(false)
  const [isLoadingShare, setIsLoadingShare] = useState(false)
  const playerRef = useRef<ReactPlayer>(null)

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        setLoading(true)
        // Doğrudan tüm videoları getir
        const response = await fetch('http://localhost:3005/api/videos')
        if (response.ok) {
          const videos = await response.json()
          const foundVideo = videos.find(v => v.id === videoId)
          if (foundVideo) {
            setVideo(foundVideo)
            // İlgili videoları da getir
            const related = videos
              .filter(v => {
                if (v.id === videoId) return false
                if (!v.genre || !foundVideo.genre) return false
                
                // Genre'ları parse et (JSON string olarak saklanıyor)
                const vGenres = typeof v.genre === 'string' ? JSON.parse(v.genre) : v.genre
                const foundGenres = typeof foundVideo.genre === 'string' ? JSON.parse(foundVideo.genre) : foundVideo.genre
                
                return vGenres.some(g => foundGenres.includes(g))
              })
              .slice(0, 6)
            setRelatedVideos(related)
          } else {
            setError('Video bulunamadı')
          }
        } else {
          setError('Video yüklenemedi')
        }
      } catch (error) {
        console.error('Error fetching video:', error)
        setError('Video yüklenirken hata oluştu')
      } finally {
        setLoading(false)
      }
    }

    if (videoId) {
      fetchVideo()
    }
  }, [videoId])

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return hours > 0 ? `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}` : `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  const formatViewCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`
    }
    return count.toString()
  }

  // View count'ı backend'e gönder
  const incrementViewCount = async () => {
    try {
      const response = await fetch(`http://localhost:3005/api/videos/${videoId}/views`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (response.ok) {
        console.log('✅ View count incremented successfully')
        // Local state'i de güncelle
        if (video) {
          setVideo({
            ...video,
            views: (video.views || 0) + 1
          })
        }
      }
    } catch (error) {
      console.error('❌ Failed to increment view count:', error)
    }
  }

  const handlePlay = () => {
    setIsPlaying(true)
    // Video oynatıldığında view count'ı artır
    incrementViewCount()
  }
  const handlePause = () => setIsPlaying(false)
  const handleProgress = (state: { played: number; playedSeconds: number; loaded: number; loadedSeconds: number }) => {
    setCurrentTime(state.playedSeconds)
  }
  const handleDuration = (duration: number) => setDuration(duration)
  const handleSeek = (seconds: number) => {
    if (playerRef.current) {
      playerRef.current.seekTo(seconds)
    }
  }
  const toggleMute = () => setIsMuted(!isMuted)
  const toggleFullscreen = () => {
    if (playerRef.current) {
      const playerElement = playerRef.current.getInternalPlayer()
      if (playerElement && playerElement.requestFullscreen) {
        playerElement.requestFullscreen()
      }
    }
  }

  // Favori ekleme/çıkarma işlevi
  const toggleFavorite = async () => {
    if (!video) return
    
    try {
      setIsLoadingFavorite(true)
      const response = await fetch(`http://localhost:3005/api/favorites`, {
        method: isFavorite ? 'DELETE' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          videoId: video.id,
          userId: user?.id || 'anonymous',
          type: isMovie ? 'movie' : 'series'
        })
      })
      
      if (response.ok) {
        setIsFavorite(!isFavorite)
        console.log(`✅ ${isFavorite ? 'Favorilerden çıkarıldı' : 'Favorilere eklendi'}`)
      } else {
        console.error('❌ Favori işlemi başarısız')
      }
    } catch (error) {
      console.error('❌ Favori işlemi hatası:', error)
    } finally {
      setIsLoadingFavorite(false)
    }
  }

  // Paylaşma işlevi
  const handleShare = async () => {
    if (!video) return
    
    try {
      setIsLoadingShare(true)
      
      // Web Share API kullan (modern tarayıcılarda)
      if (navigator.share) {
        await navigator.share({
          title: video.title,
          text: video.description || `${video.title} - Filmxane'de izle`,
          url: window.location.href
        })
      } else {
        // Fallback: URL'yi panoya kopyala
        await navigator.clipboard.writeText(window.location.href)
        alert('Video linki panoya kopyalandı!')
      }
      
      // Backend'e paylaşım sayısını gönder
      try {
        await fetch(`http://localhost:3005/api/videos/${video.id}/share`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          }
        })
      } catch (error) {
        console.error('❌ Paylaşım sayısı güncellenemedi:', error)
      }
      
    } catch (error) {
      console.error('❌ Paylaşım hatası:', error)
      // Fallback: Basit alert
      alert('Paylaşım hatası oluştu')
    } finally {
      setIsLoadingShare(false)
    }
  }

  // Video yüklendiğinde favori durumunu kontrol et
  useEffect(() => {
    if (video) {
      checkFavoriteStatus()
    }
  }, [video])

  const checkFavoriteStatus = async () => {
    if (!video) return
    
    try {
      const response = await fetch(`http://localhost:3005/api/favorites/check`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          videoId: video.id,
          userId: user?.id || 'anonymous'
        })
      })
      
      if (response.ok) {
        const { isFavorite: favoriteStatus } = await response.json()
        setIsFavorite(favoriteStatus)
      }
    } catch (error) {
      console.error('❌ Favori durumu kontrol edilemedi:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-white text-lg">Video barkirin...</p>
        </div>
      </div>
    )
  }

  if (error || !video) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h1 className="text-white text-2xl mb-2">Video Bulunamadı</h1>
          <p className="text-gray-400">{error || 'Video mevcut değil'}</p>
        </div>
      </div>
    )
  }

  const isMovie = 'videoUrl' in video || 'videoPath' in video

  return (
    <div className="min-h-screen bg-black">
      {/* Video Player Section - Netflix Style */}
      <section className="relative h-[80vh] bg-black overflow-hidden">
        <div className="relative w-full h-full">
          {/* React Player */}
          <ReactPlayer
            ref={playerRef}
            url={isMovie ? (video.videoUrl || video.videoPath ? `http://localhost:3005${video.videoUrl || video.videoPath}` : undefined) : undefined}
            playing={isPlaying}
            muted={isMuted}
            width="100%"
            height="100%"
            onPlay={handlePlay}
            onPause={handlePause}
            onProgress={handleProgress}
            onDuration={handleDuration}
            controls={false}
            style={{ objectFit: 'cover' }}
            fallback={
              <div className="w-full h-full bg-gradient-to-br from-slate-900 to-black flex items-center justify-center relative">
                {(video.thumbnail || video.thumbnailUrl || video.thumbnailPath) && (
                  <img 
                    src={getSafeImageUrl(video.thumbnail || video.thumbnailUrl || video.thumbnailPath, 1200, 800, 'poster')} 
                    alt={video.title}
                    className="w-full h-full object-cover opacity-60"
                  />
                )}
                <div className="absolute inset-0 bg-black/40" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="bg-red-600 hover:bg-red-700 text-white rounded-full p-8 shadow-2xl transition-all duration-300"
                    onClick={() => {
                      if (!isPlaying) {
                        incrementViewCount()
                      }
                      setIsPlaying(!isPlaying)
                    }}
                  >
                    {isPlaying ? (
                      <Pause className="w-16 h-16" />
                    ) : (
                      <Play className="w-16 h-16 ml-2" />
                    )}
                  </motion.button>
                </div>
                
                {/* Video Title Overlay */}
                <div className="absolute bottom-20 left-8 right-8">
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-2xl"
                  >
                    {video.title}
                  </motion.h1>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="flex items-center gap-6 text-gray-300 mb-6"
                  >
                    {video.rating && (
                      <div className="flex items-center gap-2">
                        <Star className="w-6 h-6 text-yellow-500 fill-current" />
                        <span className="text-lg">{video.rating}</span>
                      </div>
                    )}
                    {video.year && (
                      <span className="text-lg">{video.year}</span>
                    )}
                    {video.duration && (
                      <span className="text-lg">{formatDuration(video.duration)}</span>
                    )}
                    <span className="bg-red-600 px-3 py-1 rounded text-sm font-semibold">HD</span>
                  </motion.div>
                </div>
              </div>
            }
          />

          {/* Enhanced Video Controls */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/60 to-transparent p-8">
            {/* Progress Bar */}
            <div className="mb-6">
              <div className="w-full bg-gray-600/30 rounded-full h-2 mb-2">
                <div 
                  className="bg-red-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-white text-sm">
                <span>{formatDuration(currentTime)}</span>
                <span>{formatDuration(duration)}</span>
              </div>
            </div>
            
            {/* Control Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    if (!isPlaying) {
                      incrementViewCount()
                    }
                    setIsPlaying(!isPlaying)
                  }}
                  className="bg-white text-black rounded-full p-4 hover:bg-gray-200 transition-colors shadow-lg"
                >
                  {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleMute}
                  className="text-white hover:text-red-500 transition-colors p-2"
                >
                  {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                </motion.button>
                
                <div className="text-white text-lg font-medium">
                  {formatDuration(currentTime)} / {formatDuration(duration)}
                </div>
              </div>
              
                             <div className="flex items-center gap-4">
                 {isAuthenticated && (
                   <motion.button 
                     whileHover={{ scale: 1.1 }}
                     whileTap={{ scale: 0.9 }}
                     onClick={toggleFavorite}
                     disabled={isLoadingFavorite}
                     className={`text-white transition-colors p-2 ${
                       isFavorite 
                         ? 'text-red-500 hover:text-red-400' 
                         : 'hover:text-red-500'
                     } ${isLoadingFavorite ? 'opacity-50 cursor-not-allowed' : ''}`}
                   >
                     <Heart className={`w-6 h-6 ${isFavorite ? 'fill-current' : ''}`} />
                   </motion.button>
                 )}
                                 <motion.button 
                   whileHover={{ scale: 1.1 }}
                   whileTap={{ scale: 0.9 }}
                   onClick={handleShare}
                   disabled={isLoadingShare}
                   className={`text-white hover:text-red-500 transition-colors p-2 ${
                     isLoadingShare ? 'opacity-50 cursor-not-allowed' : ''
                   }`}
                 >
                   <Share2 className="w-6 h-6" />
                 </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleFullscreen}
                  className="text-white hover:text-red-500 transition-colors p-2"
                >
                  <Maximize className="w-6 h-6" />
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Info Section - Enhanced */}
      <section className="py-12 px-4 md:px-8 bg-gradient-to-b from-black to-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Video Details */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/30"
              >
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                  {video.title}
                </h1>
                
                <div className="flex items-center gap-8 text-gray-300 mb-8">
                  {video.rating && (
                    <div className="flex items-center gap-3">
                      <Star className="w-7 h-7 text-yellow-500 fill-current" />
                      <span className="text-xl font-semibold">{video.rating}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <Eye className="w-7 h-7 text-blue-400" />
                    <span className="text-xl font-semibold">{formatViewCount(video.views || 0)} temaşe</span>
                  </div>
                  {video.duration && (
                    <div className="flex items-center gap-3">
                      <Clock className="w-7 h-7 text-green-400" />
                      <span className="text-xl font-semibold">{formatDuration(video.duration)}</span>
                    </div>
                  )}
                  {video.year && (
                    <div className="flex items-center gap-3">
                      <span className="text-xl font-semibold">{video.year}</span>
                    </div>
                  )}
                </div>

                {video.description && (
                  <div className="mb-8">
                    <h3 className="text-2xl font-semibold text-white mb-4">Açıklama</h3>
                    <p className="text-gray-300 text-lg leading-relaxed">
                      {video.description}
                    </p>
                  </div>
                )}

                {/* Genre Tags */}
                {video.genre && (
                  <div className="mb-8">
                    <h3 className="text-2xl font-semibold text-white mb-4">Türler</h3>
                    <div className="flex flex-wrap gap-3">
                      {(typeof video.genre === 'string' ? JSON.parse(video.genre) : video.genre).map((genre, index) => (
                        <span
                          key={index}
                          className="px-4 py-2 bg-red-600/20 text-red-400 rounded-full text-sm font-medium border border-red-500/30 hover:bg-red-600/30 transition-colors cursor-pointer"
                        >
                          {genre}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Movie/Series Specific Info */}
                {isMovie && video.director && (
                  <div className="mb-6">
                    <h3 className="text-2xl font-semibold text-white mb-4">Yönetmen</h3>
                    <p className="text-gray-300 text-lg">{video.director}</p>
                  </div>
                )}

                {isMovie && video.cast && video.cast.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-2xl font-semibold text-white mb-4">Oyuncular</h3>
                    <div className="flex flex-wrap gap-3">
                      {video.cast.map((actor, index) => (
                        <span
                          key={index}
                          className="px-4 py-2 bg-slate-700/50 text-gray-300 rounded-full text-sm hover:bg-slate-600/50 transition-colors cursor-pointer"
                        >
                          {actor}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                                 {/* Action Buttons */}
                 <div className="flex flex-wrap gap-4 pt-6 border-t border-slate-700/30">
                   {isAuthenticated ? (
                     <motion.button
                       whileHover={{ scale: 1.05 }}
                       whileTap={{ scale: 0.95 }}
                       onClick={toggleFavorite}
                       disabled={isLoadingFavorite}
                       className={`px-8 py-4 rounded-xl font-semibold transition-colors flex items-center gap-3 ${
                         isFavorite
                           ? 'bg-red-700 text-white hover:bg-red-800'
                           : 'bg-red-600 text-white hover:bg-red-700'
                       } ${isLoadingFavorite ? 'opacity-50 cursor-not-allowed' : ''}`}
                     >
                       <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                       {isFavorite ? 'Favorilerden Çıkar' : 'Favorilere Ekle'}
                     </motion.button>
                   ) : (
                     <motion.button
                       whileHover={{ scale: 1.05 }}
                       whileTap={{ scale: 0.95 }}
                       onClick={() => window.location.href = '/login'}
                       className="px-8 py-4 bg-gray-600 text-white rounded-xl font-semibold hover:bg-gray-500 transition-colors flex items-center gap-3"
                     >
                       <Heart className="w-5 h-5" />
                       Giriş Yap ve Favorilere Ekle
                     </motion.button>
                   )}
                   <motion.button
                     whileHover={{ scale: 1.05 }}
                     whileTap={{ scale: 0.95 }}
                     onClick={handleShare}
                     disabled={isLoadingShare}
                     className={`px-8 py-4 bg-slate-700 text-white rounded-xl font-semibold hover:bg-gray-600 transition-colors flex items-center gap-3 ${
                       isLoadingShare ? 'opacity-50 cursor-not-allowed' : ''
                     }`}
                   >
                     <Share2 className="w-5 h-5" />
                     {isLoadingShare ? 'Paylaşılıyor...' : 'Paylaş'}
                   </motion.button>
                 </div>
              </motion.div>
            </div>

            {/* Enhanced Sidebar */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="bg-slate-900/70 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/30 sticky top-8"
              >
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <span className="w-2 h-8 bg-red-500 rounded-full"></span>
                  İlgili İçerikler
                </h3>
                
                {relatedVideos.length > 0 ? (
                  <div className="space-y-4">
                    {relatedVideos.map((relatedVideo) => (
                      <motion.div
                        key={relatedVideo.id}
                        whileHover={{ scale: 1.02 }}
                        className="cursor-pointer"
                      >
                        <VideoCard
                          id={relatedVideo.id}
                          title={relatedVideo.title}
                          description={relatedVideo.description}
                          thumbnail={relatedVideo.thumbnail || relatedVideo.thumbnailUrl || relatedVideo.thumbnailPath}
                          duration={relatedVideo.duration}
                          rating={relatedVideo.rating}
                          views={relatedVideo.views}
                        />
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-gray-500 text-6xl mb-4">🎬</div>
                    <p className="text-gray-400 text-lg">
                      Henüz ilgili içerik bulunmuyor
                    </p>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
