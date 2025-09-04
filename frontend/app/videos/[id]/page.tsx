'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams } from 'next/navigation'
// import { motion, AnimatePresence } from 'framer-motion' // SSR sorunu nedeniyle kaldırıldı
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
  const [showTrailer, setShowTrailer] = useState(false)
  const [watchProgress, setWatchProgress] = useState<any>(null)
  const [showResumeButton, setShowResumeButton] = useState(false)
  const [resumeTime, setResumeTime] = useState(0)
  const [isSeeking, setIsSeeking] = useState(false)
  const [seekTime, setSeekTime] = useState(0)
  const [showStartOptions, setShowStartOptions] = useState(false) // Başlangıçta false
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
            console.log('🔍 Video duration debug:', {
              id: foundVideo.id,
              title: foundVideo.title,
              duration: foundVideo.duration,
              durationType: typeof foundVideo.duration,
              durationRaw: foundVideo.duration
            })
            setVideo(foundVideo)
                    // Vîdyoyên têkildar jî bihêle
        const related = videos
          .filter((v: any) => {
            if (v.id === videoId) return false
            if (!v.genre || !foundVideo.genre) return false
            
            // Genre'yan parse bike (JSON string wekî tê tomarkirin)
            const vGenres = typeof v.genre === 'string' ? JSON.parse(v.genre) : v.genre
            const foundGenres = typeof foundVideo.genre === 'string' ? JSON.parse(foundVideo.genre) : foundVideo.genre
            
            return vGenres.some((g: any) => foundGenres.includes(g))
          })
          .slice(0, 6)
        setRelatedVideos(related)
      } else {
        setError('Vîdyo nehatibe dîtin')
      }
    } else {
      setError('Vîdyo nehatibe barkirin')
    }
  } catch (error) {
    console.error('Çewtiya barkirina vîdyoyê:', error)
    setError('Di barkirina vîdyoyê de çewtiya çêbûye')
      } finally {
        setLoading(false)
      }
    }

    if (videoId) {
      fetchVideo()
    }
  }, [videoId])

  // Watch progress'i fetch et
  useEffect(() => {
    const fetchWatchProgress = async () => {
      if (!videoId || !isAuthenticated) return;
      
      try {
        const response = await apiClient.getWatchProgress(videoId);
        if (response.success && response.data) {
          setWatchProgress(response.data);
          
                  // Eger berê hatibe temaşekirin û nehatibe temamkirin resume butonê nîşan bide
        if (response.data.watchDuration > 0 && !response.data.isCompleted) {
          setShowResumeButton(true);
          // Deqîqeyê bi saniyeyê nû bike (backend bi deqîqeyê tê tomarkirin)
          setResumeTime(response.data.watchDuration * 60);
        }
        }
      } catch (error) {
        console.error('Watch progress fetch error:', error);
      }
    };

    fetchWatchProgress();
  }, [videoId, isAuthenticated]);

  // Video yüklendiğinde start options'ı göster
  useEffect(() => {
    // Sadece daha önce izlenmiş videolarda start options'ı göster
    if (video && !isPlaying && watchProgress && watchProgress.watchDuration > 0) {
      setShowStartOptions(true);
    }
  }, [video, isPlaying, watchProgress]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!playerRef.current) return;
      
      switch (event.key) {
        case ' ':
          event.preventDefault();
          setIsPlaying(!isPlaying);
          break;
        case 'ArrowLeft':
          event.preventDefault();
          const newTimeLeft = Math.max(0, currentTime - 10);
          playerRef.current.seekTo(newTimeLeft);
          setCurrentTime(newTimeLeft);
          // Film durmasın
          break;
        case 'ArrowRight':
          event.preventDefault();
          const newTimeRight = Math.min(duration, currentTime + 10);
          playerRef.current.seekTo(newTimeRight);
          setCurrentTime(newTimeRight);
          // Film durmasın
          break;
        case 'm':
        case 'M':
          event.preventDefault();
          setIsMuted(!isMuted);
          break;
        case 'f':
        case 'F':
          event.preventDefault();
          // Fullscreen toggle
          if (document.fullscreenElement) {
            document.exitFullscreen();
          } else {
            document.documentElement.requestFullscreen();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, currentTime, duration, isMuted]);

  const formatDuration = (seconds: number) => {
    // Float değerleri yuvarla ve negatif değerleri kontrol et
    const safeSeconds = Math.max(0, Math.round(seconds))
    
    console.log('🔍 formatDuration debug:', {
      input: seconds,
      safeSeconds,
      hours: Math.floor(safeSeconds / 3600),
      minutes: Math.floor((safeSeconds % 3600) / 60),
      secs: safeSeconds % 60
    })
    
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

  // Kaldığın yerden devam et
  const handleResume = () => {
    if (playerRef.current && resumeTime > 0) {
      playerRef.current.seekTo(resumeTime);
      setIsPlaying(true);
      setShowResumeButton(false);
    }
  }

  // Progress bar'a tıklayınca o noktaya atla
  const handleProgressBarClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!duration) return;
    
    const progressBar = event.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const progressBarWidth = rect.width;
    const clickPercentage = clickX / progressBarWidth;
    const newTime = duration * clickPercentage;
    
    setSeekTime(newTime);
    setIsSeeking(true);
    
    if (playerRef.current) {
      playerRef.current.seekTo(newTime);
      setCurrentTime(newTime);
      // Film durmasın, mevcut playing state'ini koru
      // setIsPlaying(false); // Bu satırı kaldırdık
    }
    
    // Seeking state'ini kısa süre sonra sıfırla
    setTimeout(() => {
      setIsSeeking(false);
    }, 100);
  }

  // View count'ı backend'e gönder - sadece bir kez
  const incrementViewCount = async () => {
    try {
      // Eğer zaten artırıldıysa tekrar artırma
      if (video && video.views && video.views > 0) {
        console.log('✅ Hejmara dîtinê berê hatibe zêdekirin, dîsa nayê zêdekirin')
        return
      }

      const response = await fetch(`http://localhost:3005/api/videos/${videoId}/views`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (response.ok) {
        console.log('✅ Hejmara dîtinê bi serkeftî hatibe zêdekirin')
        // Local state'ê jî nû bike
        if (video) {
          setVideo({
            ...video,
            views: (video.views || 0) + 1
          })
        }
      }
    } catch (error) {
      console.error('❌ Hejmara dîtinê nehatibe zêdekirin:', error)
    }
  }

  // İzleme geçmişini backend'e kaydet
  const saveWatchHistory = async (watchDuration: number, isCompleted: boolean = false) => {
    try {
      const token = localStorage.getItem('filmxane_token')
      if (!token) return

      // Saniyeyi dakikaya çevir (doğru hesaplama)
      const watchDurationMinutes = Math.round(watchDuration / 60)

      const response = await fetch('http://localhost:3005/api/videos/watch-history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          videoId: videoId,
          watchDuration: watchDurationMinutes, // Dakika cinsinden
          isCompleted: isCompleted
        })
      })
      
      if (response.ok) {
        console.log('✅ Dîroka temaşekirinê hatibe tomarkirin:', watchDurationMinutes, 'deqîqe')
      } else {
        console.error('❌ Dîroka temaşekirinê nehatibe tomarkirin:', response.status)
      }
    } catch (error) {
      console.error('❌ Dîroka temaşekirinê nehatibe tomarkirin:', error)
    }
  }

  // Video oynatıldığında
  const handlePlay = () => {
    setIsPlaying(true)
    setShowStartOptions(false) // Start options'ı gizle
  }

  // Video duraklatıldığında
  const handlePause = () => {
    setIsPlaying(false)
    // Start options'ı gizle - video duraklatıldığında görünmesin
    setShowStartOptions(false)
  }

  const handleProgress = (state: { played: number; playedSeconds: number; loaded: number; loadedSeconds: number }) => {
    // Süreyi yuvarla ve negatif değerleri engelle
    const safeTime = Math.max(0, Math.round(state.playedSeconds * 100) / 100)
    setCurrentTime(safeTime)
    
          // Her 30 saniyede bir dîroka temaşekirinê tomarke (zêde zêde tomarkirinê nehêle)
      if (Math.round(safeTime) % 30 === 0 && safeTime > 0) {
        console.log('📺 Dîroka temaşekirinê tê tomarkirin:', safeTime, 'saniye')
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
            // Vîdyoyê wekî temamkirî nîşan bide
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
        console.log(`✅ ${isFavorite ? 'Ji dilxwaziyan hatibe derxistin' : 'Bixe dilxwaziyan'}`)
      } else {
        console.error('❌ Çalakiya dilxwaziyê nehatibe serkeftin')
      }
    } catch (error) {
      console.error('❌ Çewtiya çalakiya dilxwaziyê:', error)
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
        alert('Lînka vîdyoyê hatibe kopîkirin li panoyê!')
      }
      
      // Backend'e hejmara parvekirinê bişîne
      try {
        await fetch(`http://localhost:3005/api/videos/${video.id}/share`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          }
        })
      } catch (error) {
        console.error('❌ Hejmara parvekirinê nehatibe nûkirin:', error)
      }
      
    } catch (error) {
      console.error('❌ Çewtiya parvekirinê:', error)
      // Fallback: Basit alert
      alert('Çewtiya parvekirinê çêbûye')
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

  // Video yüklendiğinde view count'ı artır
  useEffect(() => {
    if (video && !loading) {
      incrementViewCount()
    }
  }, [video, loading])

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
                  <button
                    className="bg-red-600 hover:bg-red-700 text-white rounded-full p-8 shadow-2xl transition-colors duration-300"
                    onClick={() => {
                      setIsPlaying(!isPlaying)
                      setShowStartOptions(false)
                    }}
                  >
                    {isPlaying ? (
                      <Pause className="w-16 h-16" />
                    ) : (
                      <Play className="w-16 h-16 ml-2" />
                    )}
                  </button>
                </div>
                
                <div className="absolute bottom-20 left-8 right-8">
                  <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-2xl">
                    {video.title}
                  </h1>
                  
                  <div className="flex items-center gap-6 text-gray-300 mb-6">
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
                  </div>
                </div>
              </div>
            }
          />

          {/* Resume Button - Kaldığın yerden devam et */}
          {showResumeButton && (
            <div className="absolute top-8 left-8 z-20">
              <button
                onClick={handleResume}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg flex items-center gap-2"
              >
                <Play className="w-5 h-5" />
                Ji Cihê Te Bê Domandin ({formatDuration(resumeTime)})
              </button>
            </div>
          )}

          {/* Video Start Options - Filmin ortasında */}
          {showStartOptions && (
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <div className="bg-black/80 backdrop-blur-md rounded-2xl p-8 text-center">
                <h2 className="text-2xl font-bold text-white mb-6">Vîdyoya Temaşekirinê</h2>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Baştan başla butonu */}
                  <button
                    onClick={() => {
                      if (playerRef.current) {
                        playerRef.current.seekTo(0);
                        setIsPlaying(true);
                        setShowResumeButton(false);
                        setShowStartOptions(false);
                      }
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg flex items-center gap-3 text-lg"
                  >
                    <Play className="w-6 h-6" />
                    Ji Destpêkê Dest Pêke
                  </button>

                  {/* Kaldığın yerden devam et butonu */}
                  {showResumeButton && (
                    <button
                      onClick={() => {
                        handleResume();
                        setShowStartOptions(false);
                      }}
                      className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg flex items-center gap-3 text-lg"
                    >
                      <Play className="w-6 h-6" />
                      Ji Cihê Te Bê Domandin
                      <span className="text-sm bg-red-700 px-2 py-1 rounded">
                        {formatDuration(resumeTime)}
                      </span>
                    </button>
                  )}
                </div>
                
                {/* Progress bilgisi */}
                {watchProgress && (
                  <div className="mt-6 p-4 bg-gray-800/50 rounded-lg">
                    <div className="text-gray-300 text-sm mb-2">Pêşketina Temaşekirinê</div>
                    <div className="w-full bg-gray-600 rounded-full h-3">
                      <div 
                        className="bg-red-500 h-3 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${duration > 0 ? Math.min(100, Math.max(0, ((watchProgress.watchDuration * 60) / duration) * 100)) : 0}%` 
                        }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>{formatDuration(watchProgress.watchDuration * 60)}</span>
                      <span>{formatDuration(duration)}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Enhanced Video Controls */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/60 to-transparent p-8">
            {/* Progress Bar */}
            <div className="mb-6">
              <div 
                className="w-full bg-gray-600/30 rounded-full h-2 mb-2 cursor-pointer relative group"
                onClick={handleProgressBarClick}
              >
                <div 
                  className="bg-red-600 h-2 rounded-full transition-all duration-300 group-hover:bg-red-500"
                  style={{ width: `${duration > 0 ? Math.min(100, Math.max(0, (currentTime / duration) * 100)) : 0}%` }}
                />
                {/* Seeking indicator */}
                {isSeeking && (
                  <div 
                    className="absolute top-0 h-2 bg-white rounded-full transition-all duration-100"
                    style={{ 
                      width: '4px',
                      left: `${duration > 0 ? Math.min(100, Math.max(0, (seekTime / duration) * 100)) : 0}%`,
                      transform: 'translateX(-50%)'
                    }}
                  />
                )}
                {/* Hover tooltip */}
                <div className="absolute bottom-4 left-0 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                  Ji bo çûna wê cihê bikirtîne
                </div>
              </div>
              <div className="flex justify-between text-white text-sm">
                <span>{formatDuration(currentTime)}</span>
                <span>{formatDuration(duration)}</span>
              </div>
            </div>
            
            {/* Control Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <button
                  onClick={() => {
                    setIsPlaying(!isPlaying)
                    setShowStartOptions(false) // Start options'ı gizle
                  }}
                  className="bg-white text-black rounded-full p-4 hover:bg-gray-200 transition-colors shadow-lg"
                >
                  {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
                </button>
                
                <button
                  onClick={toggleMute}
                  className="text-white hover:text-red-500 transition-colors p-2"
                >
                  {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                </button>
                
                <div className="text-white text-lg font-medium">
                  {formatDuration(currentTime)} / {formatDuration(duration)}
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                {isAuthenticated && (
                  <button 
                    onClick={toggleFavorite}
                    disabled={isLoadingFavorite}
                    className={`text-white transition-colors p-2 ${
                      isFavorite 
                        ? 'text-red-500 hover:text-red-400' 
                        : 'hover:text-red-500'
                    } ${isLoadingFavorite ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <Heart className={`w-6 h-6 ${isFavorite ? 'fill-current' : ''}`} />
                  </button>
                )}
                <button 
                  onClick={handleShare}
                  disabled={isLoadingShare}
                  className={`text-white hover:text-red-500 transition-colors p-2 ${
                    isLoadingShare ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <Share2 className="w-6 h-6" />
                </button>
                <button 
                  onClick={toggleFullscreen}
                  className="text-white hover:text-red-500 transition-colors p-2"
                >
                  <Maximize className="w-6 h-6" />
                </button>
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
              <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-sm rounded-3xl p-8 border border-slate-700/30 shadow-2xl hover:shadow-red-500/10 transition-all duration-300">
                <div className="flex items-start justify-between mb-6">
                  <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                    {video.title}
                  </h1>
                  <button
                    onClick={() => setShowInfoModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600/20 text-red-400 rounded-xl border border-red-500/30 hover:bg-red-600/30 transition-all duration-200"
                  >
                    <Info className="w-5 h-5" />
                    <span className="hidden sm:inline">Agahiyên Detayî</span>
                  </button>
                </div>
                
                <div className="flex items-center gap-8 text-gray-300 mb-8">
                  {video.rating && (
                    <div className="flex items-center gap-3">
                      <Star className="w-7 h-7 text-yellow-500 fill-current" />
                      <span className="text-xl font-semibold">{video.rating}</span>
                    </div>
                  )}

                  {(video as any).duration && (
                    <div className="flex items-center gap-3">
                      <Clock className="w-7 h-7 text-green-400" />
                      <span className="text-xl font-semibold">
                        {formatDuration((video as any).duration)}
                      </span>
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
                      Daxuyanî
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
                      Cureyên Fîlmê
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
                      Derhêner
                    </h3>
                    <p className="text-gray-300 text-lg">{video.director}</p>
                  </div>
                )}

                {isMovie && video.cast && video.cast.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-2xl font-semibold text-white mb-4 flex items-center gap-3">
                      <span className="w-1 h-6 bg-green-500 rounded-full"></span>
                      Lîstikvan
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
                    <button
                      onClick={toggleFavorite}
                      disabled={isLoadingFavorite}
                      className={`px-8 py-4 rounded-xl font-semibold transition-colors flex items-center gap-3 ${
                        isFavorite
                          ? 'bg-red-700 text-white hover:bg-red-800'
                          : 'bg-red-600 text-white hover:bg-red-700'
                      } ${isLoadingFavorite ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                      {isFavorite ? 'Ji Dilxwaziyan Bîre' : 'Bixe Dilxwaziyan'}
                    </button>
                  ) : (
                    <button
                      onClick={() => window.location.href = '/login'}
                      className="px-8 py-4 bg-gray-600 text-white rounded-xl font-semibold hover:bg-gray-500 transition-colors flex items-center gap-3"
                    >
                      <Heart className="w-5 h-5" />
                      Biket Nav û Bixe Dilxwaziyan
                    </button>
                  )}
                  
                  {/* Butona Fragmanê - Tenê ji bo Fîlman */}
                  {isMovie && (
                    <button
                      onClick={() => setShowTrailer(true)}
                      className="px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center gap-3"
                    >
                      <Play className="w-5 h-5" />
                      Fragmanê Bixwîne
                    </button>
                  )}
                  
                  <button
                    onClick={handleShare}
                    disabled={isLoadingShare}
                    className={`px-8 py-4 bg-slate-700 text-white rounded-xl font-semibold hover:bg-gray-600 transition-colors flex items-center gap-3 ${
                      isLoadingShare ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <Share2 className="w-5 h-5" />
                    {isLoadingShare ? 'Tê Parvekirin...' : 'Parveke'}
                  </button>
                </div>
              </div>
            </div>

            {/* Enhanced Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-sm rounded-3xl p-6 border border-slate-700/30 shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 sticky top-8">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <span className="w-2 h-8 bg-blue-500 rounded-full"></span>
                  Naverokên Têkildar
                </h3>
                
                {relatedVideos.length > 0 ? (
                  <div className="space-y-4">
                    {relatedVideos.map((relatedVideo) => (
                      <div
                        key={relatedVideo.id}
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
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-gray-500 text-6xl mb-4">🎬</div>
                    <p className="text-gray-400 text-lg">
                      Hîn naverokên têkildar tune ne
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Info Modal */}
      {showInfoModal && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowInfoModal(false)}
        >
          <div
            className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-700/30"
            onClick={(e) => e.stopPropagation()}
          >
              {/* Modal Header */}
              <div className="sticky top-0 bg-gradient-to-r from-slate-900 to-slate-800 rounded-t-3xl p-6 border-b border-slate-700/30">
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                    <span className="w-2 h-8 bg-red-500 rounded-full"></span>
                    {video.title} - Agahiyên Detayî
                  </h2>
                  <button
                    onClick={() => setShowInfoModal(false)}
                    className="text-gray-400 hover:text-white transition-colors p-2"
                  >
                    <X className="w-8 h-8" />
                  </button>
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
                        Agahiyên Bingehîn
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">Cure:</span>
                          <span className="text-white font-medium">{isMovie ? 'Fîlm' : 'Rêzefîlm'}</span>
                        </div>
                        {video.year && (
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400">Sal:</span>
                            <span className="text-white font-medium">{video.year}</span>
                          </div>
                        )}
                        {(video as any).duration && (
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400">Dirêjahî:</span>
                            <span className="text-white font-medium">{formatDuration((video as any).duration)}</span>
                          </div>
                        )}
                        {video.rating && (
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400">Nirx:</span>
                            <span className="text-white font-medium flex items-center gap-2">
                              <Star className="w-5 h-5 text-yellow-500 fill-current" />
                              {video.rating}
                            </span>
                          </div>
                        )}

                      </div>
                    </div>

                    {/* Genre Info */}
                    {video.genre && (
                      <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/30">
                        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
                          <Award className="w-6 h-6 text-blue-400" />
                          Cureyên Fîlmê
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
                          Daxuyanî
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
                          Derhêner
                        </h3>
                        <p className="text-gray-300">{video.director}</p>
                      </div>
                    )}

                    {isMovie && video.cast && video.cast.length > 0 && (
                      <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/30">
                        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
                          <Users className="w-6 h-6 text-green-400" />
                          Lîstikvan
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
                        Agahiyên Teknîkî
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">Kalîte:</span>
                          <span className="text-white font-medium bg-green-600/20 text-green-400 px-3 py-1 rounded-lg text-sm">
                            HD
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">Format:</span>
                          <span className="text-white font-medium">MP4</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">Çareserî:</span>
                          <span className="text-white font-medium">1920x1080</span>
                        </div>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/30">
                      <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
                        <span className="w-1 h-6 bg-red-500 rounded-full"></span>
                        Çalakiyên Bilez
                      </h3>
                      <div className="space-y-3">
                        {isAuthenticated ? (
                          <button
                            onClick={toggleFavorite}
                            disabled={isLoadingFavorite}
                            className={`w-full py-3 px-4 rounded-xl font-medium transition-colors flex items-center justify-center gap-3 ${
                              isFavorite
                                ? 'bg-red-700 text-white hover:bg-red-800'
                                : 'bg-red-600 text-white hover:bg-red-700'
                            } ${isLoadingFavorite ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                            {isFavorite ? 'Ji Dilxwaziyan Bîre' : 'Bixe Dilxwaziyan'}
                          </button>
                        ) : (
                          <button
                            onClick={() => window.location.href = '/login'}
                            className="w-full py-3 px-4 bg-gray-600 text-white rounded-xl font-medium hover:bg-gray-500 transition-colors flex items-center justify-center gap-3"
                          >
                            <Heart className="w-5 h-5" />
                            Biket Nav û Bixe Dilxwaziyan
                          </button>
                        )}
                        
                        <button
                          onClick={handleShare}
                          disabled={isLoadingShare}
                          className={`w-full py-3 px-4 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-3 ${
                            isLoadingShare ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                        >
                          <Share2 className="w-5 h-5" />
                          {isLoadingShare ? 'Tê Parvekirin...' : 'Parveke'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
          </div>
        </div>
      )}

      {/* Trailer Modal */}
      {showTrailer && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowTrailer(false)}
        >
          <div
            className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl max-w-5xl w-full shadow-2xl border border-slate-700/30"
            onClick={(e) => e.stopPropagation()}
          >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                    <span className="w-2 h-8 bg-red-500 rounded-full"></span>
                    Fragman - {video.title}
                  </h2>
                  <button
                    onClick={() => setShowTrailer(false)}
                    className="text-gray-400 hover:text-white transition-colors p-2"
                  >
                    <X className="w-8 h-8" />
                  </button>
                </div>
                
                {/* Fragman Video Player */}
                {video.trailerUrl ? (
                  <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden">
                    <ReactPlayer
                      url={video.trailerUrl.startsWith('http') ? video.trailerUrl : `http://localhost:3005${video.trailerUrl}`}
                      width="100%"
                      height="100%"
                      controls={true}
                      playing={true}
                      muted={false}
                      style={{ objectFit: 'cover' }}
                      fallback={
                        <div className="w-full h-full bg-gradient-to-br from-slate-900 to-black flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-red-500 text-6xl mb-4">🎬</div>
                            <p className="text-white text-lg">Fragman barkirin...</p>
                          </div>
                        </div>
                      }
                    />
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="text-gray-500 text-6xl mb-4">🎬</div>
                    <h3 className="text-2xl font-semibold text-white mb-4">Fragman Tune</h3>
                    <p className="text-gray-400 text-lg mb-6">
                      Ji bo vê fîlmê hîn fragman tune ye. Admin panelê de fragmanê têkevê.
                    </p>
                    <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/30">
                      <h4 className="text-lg font-semibold text-white mb-3">Çawa Fragman Têkevê:</h4>
                      <ol className="text-gray-300 text-left space-y-2">
                        <li className="flex items-start gap-3">
                          <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                          <span>Admin panelê de têkeve</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                          <span>Content Management babetê hilbijêre</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                          <span>Fîlmê hilbijêre û "Edit" bikirtîne</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                          <span>Trailer URL babetê fragman URL'ê têkevê</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                          <span>Save bikirtîne</span>
                        </li>
                      </ol>
                    </div>
                  </div>
                )}
              </div>
          </div>
        </div>
      )}
    </div>
  )
}
