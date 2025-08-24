'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, Volume2, VolumeX, Maximize, Heart, Share2, Download, Clock, Star, Eye, X, Info, Calendar, Users, Award, Globe, Film, Tv, ExternalLink } from 'lucide-react'
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
  const [showInfoModal, setShowInfoModal] = useState(false)
  const playerRef = useRef<ReactPlayer>(null)

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        setLoading(true)
        // Doğrudan tüm videoları getir
        const response = await fetch('http://localhost:3005/api/videos')
        if (response.ok) {
          const videos = await response.json()
          const foundVideo = videos.find((v: any) => v.id === videoId)
          if (foundVideo) {
            setVideo(foundVideo)
            // İlgili videoları da getir
            const related = videos
              .filter((v: any) => {
                if (v.id === videoId) return false
                if (!v.genre || !foundVideo.genre) return false
                
                // Genre'ları parse et (JSON string olarak saklanıyor)
                const vGenres = typeof v.genre === 'string' ? JSON.parse(v.genre) : v.genre
                const foundGenres = typeof foundVideo.genre === 'string' ? JSON.parse(foundVideo.genre) : foundVideo.genre
                
                return vGenres.some((g: any) => foundGenres.includes(g))
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
    // Float değerleri yuvarla ve negatif değerleri kontrol et
    const safeSeconds = Math.max(0, Math.round(seconds))
    
    const hours = Math.floor(safeSeconds / 3600)
    const minutes = Math.floor((safeSeconds % 3600) / 60)
    const secs = safeSeconds % 60
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    } else {
      return `${minutes}:${secs.toString().padStart(2, '0')}`
    }
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

  // İzleme geçmişini backend'e kaydet
  const saveWatchHistory = async (watchDuration: number, isCompleted: boolean = false) => {
    try {
      const token = localStorage.getItem('filmxane_token')
      if (!token) return

      const response = await fetch('http://localhost:3005/api/videos/watch-history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          videoId: videoId,
          watchDuration: Math.round(watchDuration / 60), // Saniyeyi dakikaya çevir
          isCompleted: isCompleted
        })
      })
      
      if (response.ok) {
        console.log('✅ İzleme geçmişi kaydedildi')
      } else {
        console.error('❌ İzleme geçmişi kaydedilemedi:', response.status)
      }
    } catch (error) {
      console.error('❌ İzleme geçmişi kaydedilemedi:', error)
    }
  }

  const handlePlay = () => {
    setIsPlaying(true)
    // Video oynatıldığında view count'ı artır
    incrementViewCount()
  }
  const handlePause = () => setIsPlaying(false)
  const handleProgress = (state: { played: number; playedSeconds: number; loaded: number; loadedSeconds: number }) => {
    // Süreyi yuvarla ve negatif değerleri engelle
    const safeTime = Math.max(0, Math.round(state.playedSeconds * 100) / 100)
    setCurrentTime(safeTime)
    
    // Her 10 saniyede bir izleme geçmişini kaydet
    if (Math.round(safeTime) % 10 === 0 && safeTime > 0) {
      console.log('📺 İzleme geçmişi kaydediliyor:', safeTime, 'saniye')
      saveWatchHistory(safeTime, false)
    }
  }
  const handleDuration = (duration: number) => {
    // Toplam süreyi yuvarla ve negatif değerleri engelle
    const safeDuration = Math.max(0, Math.round(duration * 100) / 100)
    setDuration(safeDuration)
  }
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

  // Video tamamlandığında
  const handleEnded = () => {
    setIsPlaying(false)
    // Video tamamlandı olarak işaretle
    if (duration > 0) {
      saveWatchHistory(duration, true)
    }
  }

  // Favori ekleme/çıkarma işlevi
  const toggleFavorite = async () => {
    if (!video) return
    
    try {
      setIsLoadingFavorite(true)
      const response = await fetch(`http://localhost:3005/api/favorites`, {
        method: isMovie ? 'DELETE' : 'POST',
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
            url={isMovie ? ((video as any).videoUrl || (video as any).videoPath ? `http://localhost:3005${(video as any).videoUrl || (video as any).videoPath}` : undefined) : undefined}
            playing={isPlaying}
            muted={isMuted}
            width="100%"
            height="100%"
            onPlay={handlePlay}
            onPause={handlePause}
            onProgress={handleProgress}
            onDuration={handleDuration}
            onEnded={handleEnded}
            controls={false}
            style={{ objectFit: 'cover' }}
            fallback={
              <div className="w-full h-full bg-gradient-to-br from-slate-900 to-black flex items-center justify-center relative">
                {(video.thumbnail || video.thumbnailUrl || (video as any).thumbnailPath) && (
                  <img 
                    src={getSafeImageUrl(video.thumbnail || video.thumbnailUrl || (video as any).thumbnailPath, 1200, 800, 'poster')} 
                    alt={video.title}
                    className="w-full h-full object-cover opacity-60"
                  />
                )}
                <div className="absolute inset-0 bg-black/40" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="bg-red-600 hover:bg-red-700 text-white rounded-full p-8 shadow-2xl transition-colors duration-300"
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
                    {(video as any).duration && (
                      <span className="text-lg">{formatDuration((video as any).duration)}</span>
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
                  style={{ width: `${duration > 0 ? Math.min(100, Math.max(0, (currentTime / duration) * 100)) : 0}%` }}
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
                className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-sm rounded-3xl p-8 border border-slate-700/30 shadow-2xl hover:shadow-red-500/10 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-6">
                  <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                    {video.title}
                  </h1>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowInfoModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600/20 text-red-400 rounded-xl border border-red-500/30 hover:bg-red-600/30 transition-all duration-200"
                  >
                    <Info className="w-5 h-5" />
                    <span className="hidden sm:inline">Detaylı Bilgi</span>
                  </motion.button>
                </div>
                
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
                  {(video as any).duration && (
                    <div className="flex items-center gap-3">
                      <Clock className="w-7 h-7 text-green-400" />
                      <span className="text-xl font-semibold">{formatDuration((video as any).duration)}</span>
                    </div>
                  )}
                  {video.year && (
                    <div className="flex items-center gap-3">
                      <Calendar className="w-7 h-7 text-purple-400" />
                      <span className="text-xl font-semibold">{video.year}</span>
                    </div>
                  )}
                </div>

                {video.description && (
                  <div className="mb-8">
                    <h3 className="text-2xl font-semibold text-white mb-4 flex items-center gap-3">
                      <span className="w-1 h-6 bg-green-500 rounded-full"></span>
                      Açıklama
                    </h3>
                    <p className="text-gray-300 text-lg leading-relaxed">
                      {video.description}
                    </p>
                  </div>
                )}

                {/* Genre Tags */}
                {video.genre && (
                  <div className="mb-8">
                    <h3 className="text-2xl font-semibold text-white mb-4 flex items-center gap-3">
                      <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
                      Türler
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {(typeof video.genre === 'string' ? JSON.parse(video.genre) : video.genre).map((genre: any, index: any) => (
                        <span
                          key={index}
                          className="px-4 py-2 bg-blue-600/20 text-blue-400 rounded-full text-sm font-medium border border-blue-500/30 hover:bg-blue-600/30 transition-colors cursor-pointer"
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
                    <h3 className="text-2xl font-semibold text-white mb-4 flex items-center gap-3">
                      <span className="w-1 h-6 bg-purple-500 rounded-full"></span>
                      Yönetmen
                    </h3>
                    <p className="text-gray-300 text-lg">{video.director}</p>
                  </div>
                )}

                {isMovie && video.cast && video.cast.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-2xl font-semibold text-white mb-4 flex items-center gap-3">
                      <span className="w-1 h-6 bg-green-500 rounded-full"></span>
                      Oyuncular
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {video.cast.map((actor, index) => (
                        <span
                          key={index}
                          className="px-4 py-2 bg-purple-600/20 text-purple-400 rounded-full text-sm hover:bg-purple-600/30 transition-colors cursor-pointer"
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
                className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-sm rounded-3xl p-6 border border-slate-700/30 shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 sticky top-8"
              >
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <span className="w-2 h-8 bg-blue-500 rounded-full"></span>
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
                          thumbnail={relatedVideo.thumbnail || relatedVideo.thumbnailUrl || (relatedVideo as any).thumbnailPath}
                          thumbnailUrl={relatedVideo.thumbnailUrl}
                          posterUrl={relatedVideo.posterUrl}
                          duration={(relatedVideo as any).duration}
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

      {/* Enhanced Info Modal */}
      <AnimatePresence>
        {showInfoModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowInfoModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-700/30"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-gradient-to-r from-slate-900 to-slate-800 rounded-t-3xl p-6 border-b border-slate-700/30">
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                    <span className="w-2 h-8 bg-red-500 rounded-full"></span>
                    {video.title} - Detaylı Bilgi
                  </h2>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowInfoModal(false)}
                    className="text-gray-400 hover:text-white transition-colors p-2"
                  >
                    <X className="w-8 h-8" />
                  </motion.button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Column - Main Info */}
                  <div className="space-y-6">
                    {/* Basic Info Cards */}
                    <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/30">
                      <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
                        <Film className="w-6 h-6 text-red-400" />
                        Temel Bilgiler
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">Tür:</span>
                          <span className="text-white font-medium">{isMovie ? 'Film' : 'Dizi'}</span>
                        </div>
                        {video.year && (
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400">Yıl:</span>
                            <span className="text-white font-medium">{video.year}</span>
                          </div>
                        )}
                        {(video as any).duration && (
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400">Süre:</span>
                            <span className="text-white font-medium">{formatDuration((video as any).duration)}</span>
                          </div>
                        )}
                        {video.rating && (
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400">Puan:</span>
                            <span className="text-white font-medium flex items-center gap-2">
                              <Star className="w-5 h-5 text-yellow-500 fill-current" />
                              {video.rating}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">Görüntülenme:</span>
                          <span className="text-white font-medium flex items-center gap-2">
                            <Eye className="w-5 h-5 text-blue-400" />
                            {formatViewCount(video.views || 0)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Genre Info */}
                    {video.genre && (
                      <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/30">
                        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
                          <Award className="w-6 h-6 text-blue-400" />
                          Türler
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {(typeof video.genre === 'string' ? JSON.parse(video.genre) : video.genre).map((genre: any, index: any) => (
                            <span
                              key={index}
                              className="px-3 py-2 bg-blue-600/20 text-blue-400 rounded-lg text-sm font-medium border border-blue-500/30"
                            >
                              {genre}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Description */}
                    {video.description && (
                      <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/30">
                        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
                          <span className="w-1 h-6 bg-green-500 rounded-full"></span>
                          Açıklama
                        </h3>
                        <p className="text-gray-300 leading-relaxed">
                          {video.description}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Right Column - Additional Info */}
                  <div className="space-y-6">
                    {/* Cast & Crew */}
                    {isMovie && video.director && (
                      <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/30">
                        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
                          <Users className="w-6 h-6 text-purple-400" />
                          Yönetmen
                        </h3>
                        <p className="text-gray-300">{video.director}</p>
                      </div>
                    )}

                    {isMovie && video.cast && video.cast.length > 0 && (
                      <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/30">
                        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
                          <Users className="w-6 h-6 text-green-400" />
                          Oyuncular
                        </h3>
                        <div className="space-y-2">
                          {video.cast.map((actor, index) => (
                            <div key={index} className="flex items-center gap-3">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span className="text-gray-300">{actor}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Technical Info */}
                    <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/30">
                      <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
                        <span className="w-1 h-6 bg-yellow-500 rounded-full"></span>
                        Teknik Bilgiler
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">Kalite:</span>
                          <span className="text-white font-medium bg-green-600/20 text-green-400 px-3 py-1 rounded-lg text-sm">
                            HD
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">Format:</span>
                          <span className="text-white font-medium">MP4</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">Çözünürlük:</span>
                          <span className="text-white font-medium">1920x1080</span>
                        </div>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/30">
                      <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
                        <span className="w-1 h-6 bg-red-500 rounded-full"></span>
                        Hızlı İşlemler
                      </h3>
                      <div className="space-y-3">
                        {isAuthenticated ? (
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={toggleFavorite}
                            disabled={isLoadingFavorite}
                            className={`w-full py-3 px-4 rounded-xl font-medium transition-colors flex items-center justify-center gap-3 ${
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
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => window.location.href = '/login'}
                            className="w-full py-3 px-4 bg-gray-600 text-white rounded-xl font-medium hover:bg-gray-500 transition-colors flex items-center justify-center gap-3"
                          >
                            <Heart className="w-5 h-5" />
                            Giriş Yap ve Favorilere Ekle
                          </motion.button>
                        )}
                        
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleShare}
                          disabled={isLoadingShare}
                          className={`w-full py-3 px-4 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-3 ${
                            isLoadingShare ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                        >
                          <Share2 className="w-5 h-5" />
                          {isLoadingShare ? 'Paylaşılıyor...' : 'Paylaş'}
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
